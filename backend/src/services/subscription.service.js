const Subscription = require("../models/Subscription.model");
const mongoose = require("mongoose");

exports.calcNextRenewal = (startDate, billingCycle) => {
  const date = new Date(startDate);

  switch (billingCycle) {
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "QUARTERLY":
      date.setMonth(date.getMonth() + 3);
      break;
    case "HALF_YEARLY":
      date.setMonth(date.getMonth() + 6);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      date.setMonth(date.getMonth() + 1);
  }

  return date;
};

exports.createSubscription = async (userId, subscriptionData) => {
  try {
    const {
      name,
      description,
      amount,
      currency,
      billingCycle = "MONTHLY",
      status,
      startDate,
      remainderDays,
      notifyEmail,
      category,
    } = subscriptionData;

    const nextRenewal = this.calcNextRenewal(startDate, billingCycle);

    const existingSubscription = await Subscription.findOne({
      name,
    });

    if (existingSubscription) {
      throw new Error("Subscription already exists");
    }

    const subscription = await Subscription.create({
      userId,
      name,
      description,
      amount,
      currency,
      billingCycle,
      status,
      startDate,
      nextRenewal,
      remainderDays,
      notifyEmail,
      category,
    });

    return subscription;
  } catch (error) {
    console.log(error);
  }
};

exports.getAll = async (
  userId,
  {
    status,
    category,
    sort = "nextRenewal",
    order = "asc",
    page = 1,
    limit = 20,
  } = {},
) => {
  try {
    const query = { userId };

    if (status) query.status = status;
    if (category) query.category = category;

    const sortOrder = order === "desc" ? -1 : 1;
    const skip = (page - 1) * limit;

    const [subscriptions, total] = await Promise.all([
      Subscription.find(query)
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Subscription.countDocuments(query),
    ]);

    return { subscriptions, total, page, pages: Math.ceil(total / limit) };
  } catch (error) {
    console.log(error);
  }
};

exports.getById = async (userId, subscriptionId) => {
  try {
    const subscription = await Subscription.findOne({
      userId,
      _id: subscriptionId,
    });

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    return subscription;
  } catch (error) {
    console.log(error);
  }
};

exports.updateSubscription = async (userId, subscriptionId, data) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { userId, _id: subscriptionId },
      data,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    await subscription.save();

    return subscription;
  } catch (error) {
    console.log(error);
  }
};

exports.deleteSubscription = async (userId, subscriptionId) => {
  try {
    const subscription = await Subscription.findOneAndDelete({
      userId,
      _id: subscriptionId,
    });

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    return { deleted: true };
  } catch (error) {
    console.log(error);
  }
};

exports.getSummary = async (userId) => {
  try {
    const summary = await Subscription.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId.toString()),
          status: "ACTIVE",
        },
      },
      {
        $group: {
          _id: "$category",
          totalSubscriptions: { $sum: 1 },
          monthlyEstimate: {
            $sum: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ["$billingCycle", "MONTHLY"] },
                    then: "$amount",
                  },
                  {
                    case: { $eq: ["$billingCycle", "YEARLY"] },
                    then: { $divide: ["$amount", 12] },
                  },
                  {
                    case: { $eq: ["$billingCycle", "QUARTERLY"] },
                    then: { $divide: ["$amount", 3] },
                  },
                  {
                    case: { $eq: ["$billingCycle", "HALF_YEARLY"] },
                    then: { $divide: ["$amount", 6] },
                  },
                  {
                    case: { $eq: ["$billingCycle", "WEEKLY"] },
                    then: { $multiply: ["$amount", 4] },
                  },
                ],
                default: "$amount",
              },
            },
          },
          yearlyEstimate: {
            $sum: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ["$billingCycle", "MONTHLY"] },
                    then: { $multiply: ["$amount", 12] },
                  },
                  {
                    case: { $eq: ["$billingCycle", "YEARLY"] },
                    then: "$amount",
                  },
                  {
                    case: { $eq: ["$billingCycle", "QUARTERLY"] },
                    then: { $multiply: ["$amount", 4] },
                  },
                  {
                    case: { $eq: ["$billingCycle", "HALF_YEARLY"] },
                    then: { $multiply: ["$amount", 2] },
                  },
                  {
                    case: { $eq: ["$billingCycle", "WEEKLY"] },
                    then: { $multiply: ["$amount", 52] },
                  },
                ],
                default: "$amount",
              },
            },
          },
        },
      },
    ]);

    return summary;
  } catch (error) {
    console.log(error);
  }
};

exports.getDueForRenewal = async (daysAhead = 7) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const future = new Date(today);
  future.setDate(future.getDate() + daysAhead);

  const subscriptions = await Subscription.find({
    status: "active",
    nextRenewal: { $gte: today, $lte: future },
    notifyEmail: true,
  }).populate("userId", "name email phone notificationPreferences");

  return subscriptions;
};
