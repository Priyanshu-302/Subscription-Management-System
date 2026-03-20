const subscriptionService = require("../services/subscription.service");

exports.createSubscription = async (req, res, next) => {
  try {
    const subscription = await subscriptionService.createSubscription(
      req.user.id,
      req.body,
    );

    return res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { status, category, sort, order, page, limit } = req.query;
    const result = await subscriptionService.getAll(req.user.id, {
      status,
      category,
      sort,
      order,
      page: page ? parseInt(page) : 1,
      limit: limit ? Math.min(parseInt(limit), 100) : 20,
    });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const subscription = await subscriptionService.getById(
      req.user.id,
      req.params.id,
    );

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    return res.status(200).json({
      success: true,
      message: "Subscription found",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSubscription = async (req, res, next) => {
  try {
    const subscription = await subscriptionService.updateSubscription(
      req.user.id,
      req.params.id,
      req.body,
    );

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    return res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await subscriptionService.deleteSubscription(
      req.user.id,
      req.params.id,
    );

    return res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSummary = async (req, res, next) => {
  try {
    const summary = await subscriptionService.getSummary(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Summary fetched successfully",
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};
