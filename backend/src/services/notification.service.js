const Notification = require("../models/Notification.model");
const emailService = require("../services/email.service");

exports.sendRenewalRemainder = async (user, subscription) => {
  try {
    const daysLeft = Math.ceil(
      (new Date(subscription.nextRenewal) - new Date()) / (1000 * 60 * 60 * 24),
    );

    const title = `"${subscription.name}" renews in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`;

    const message = `Your ${subscription.billingCycle} subscription for ${subscription.currency} ${subscription.amount} is due on ${new Date(subscription.nextRenewal).toDateString()}.`;

    const notification = await Notification.create({
      userId: user._id,
      subscriptionId: subscription._id,
      type: "renewal_remainder",
      status: "PENDING",
      metadata: {
        daysLeft,
        amount: subscription.amount,
        currency: subscription.currency,
        renewalDate: subscription.nextRenewal,
        title,
        message,
      },
    });

    const info = await emailService.sendRenewalRemainderEmail(
      user,
      subscription,
      daysLeft,
    );

    notification.status = "SUCCESS";
    notification.metadata.emailId = info.messageId;
    await notification.save();

    return notification;
  } catch (error) {
    console.log(error);
  }
};

exports.getAll = async (
  userId,
  { type, status, isRead, page = 1, limit = 20 } = {},
) => {
  const query = { userId };
  if (type !== undefined) query.type = type;
  if (status !== undefined) query.status = status;
  if (isRead !== undefined) query.isRead = isRead;

  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments(query),
    Notification.countDocuments({ userId, isRead: false }),
  ]);

  return {
    notifications,
    total,
    unreadCount,
    page,
    pages: Math.ceil(total / limit),
  };
};

exports.getById = async (userId, notificationId) => {
  try {
    const notification = await Notification.findOne({
      userId,
      _id: notificationId,
    });

    if (!notification) {
      throw new Error("Notification not found");
    }

    return notification;
  } catch (error) {
    console.log(error);
  }
};

exports.markAsRead = async (userId, notificationId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { userId, _id: notificationId },
      { $set: { isRead: true } },
      { new: true },
    );

    if (!notification) {
      throw new Error("Notification not found");
    }

    return notification;
  } catch (error) {
    console.log(error);
  }
};

exports.markAllAsRead = async (userId) => {
  try {
    const result = await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } },
    );

    return result;
  } catch (error) {
    console.log(error);
  }
};

exports.remove = async (userId, notificationId) => {
  try {
    const notification = await Notification.findOneAndDelete({
      userId,
      _id: notificationId,
    });

    if (!notification) {
      throw new Error("Notification not found");
    }

    return notification;
  } catch (error) {
    console.log(error);
  }
};

// exports.getStats = async (userId) => {
//   try {
//     const stats = await Notification.aggregate([
//       {
//         $match: {
//           userId: new mongoose.Types.ObjectId(userId.toString()),
//         },
//       },
//       {
//         $group: {
//           _id: { type: "$type", status: "$status" },
//           count: { $sum: 1 },
//           latest: { $max: "$createdAt" },
//         },
//       },
//       {
//         $group: {
//           _id: "$_id.type",
//           statuses: {
//             $push: {
//               status: "$_id.status",
//               count: "$count",
//               latest: "$latest",
//             },
//           },
//           total: { $sum: "$count" },
//         },
//       },
//     ]);

//     return stats;
//   } catch (error) {
//     console.log(error);
//   }
// };
