const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
      index: true,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
      index: true,
    },
    type: {
      type: String,
      required: [true, "Please provide a notification type"],
      trim: true,
      index: true,
      enum: {
        values: [
          "renewal_reminder",
          "subscription_expired",
          "subscription_created",
          "subscription_cancelled",
          "test",
        ],
      },
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "SUCCESS", "FAILED"],
      },
      default: "PENDING",
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;