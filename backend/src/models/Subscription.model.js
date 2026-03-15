const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Please provide a subscription name"],
      trim: true,
      maxlength: [
        150,
        "Subscription name must have less or equal then 150 characters",
      ],
    },
    description: {
      type: String,
      required: [true, "Please provide a subscription description"],
      trim: true,
      maxlength: [
        500,
        "Subscription description must have less or equal then 500 characters",
      ],
    },
    amount: {
      type: Number,
      required: [true, "Please provide a subscription amount"],
      min: [0, "Amount must be greater than 0"],
    },
    currency: {
      type: String,
      trim: true,
      uppercase: true,
      default: "INR",
      maxlength: [10, "Currency code must be at most 10 characters."],
    },
    billingCycle: {
      type: String,
      required: [true, "Please provide a billing cycle"],
      trim: true,
      uppercase: true,
      enum: {
        values: ["WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"],
      },
      default: "MONTHLY",
    },
    status: {
      type: String,
      required: [true, "Please provide a subscription status"],
      trim: true,
      uppercase: true,
      enum: {
        values: ["ACTIVE", "INACTIVE"],
      },
      default: "ACTIVE",
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    nextRenewal: {
      type: Date,
      required: [true, "Next renewal date is required"],
      index: true,
    },
    remainderDays: {
      type: Number,
      default: 7,
      min: [0, "Remainder days must be greater than 0"],
      max: [30, "Remainder days must be less than 30"],
    },
    notifyEmail: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      trim: true,
      maxlength: [50, "Category must have less or equal then 50 characters"],
      default: null,
    },
  },
  { timestamps: true },
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
