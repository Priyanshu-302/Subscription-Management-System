const notificationService = require("../services/notification.service");

exports.getAll = async (req, res, next) => {
  try {
    const { type, status, isRead, page, limit } = req.query;
    const result = await notificationService.getAll(req.user.id, {
      type,
      status,
      isRead: isRead !== undefined ? isRead === "true" : undefined,
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
    const notification = await notificationService.getById(
      req.user.id,
      req.params.id,
    );

    if (!notification) {
      throw new Error("Notification not found");
    }

    return res.status(200).json({
      success: true,
      message: "Notification found",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(
      req.user.id,
      req.params.id,
    );

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAllAsRead(req.user.id);

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const notification = await notificationService.remove(
      req.user.id,
      req.params.id,
    );

    return res.status(200).json({
      success: true,
      message: "Notification removed",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};
