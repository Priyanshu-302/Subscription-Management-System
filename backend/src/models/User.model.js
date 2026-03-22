const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name!"],
      trim: true,
      minlength: [2, "Name must have more or equal then 2 characters"],
      maxlength: [20, "Name must have less or equal then 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email."],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must have more or equal then 8 characters"],
      select: false,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password format do not match",
      ],
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
      unique: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    notificationPreferences: {
      email: {
        type: Boolean,
        default: true,
      },
      sms: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    this.password = await bcryptjs.hash(this.password, 10);
  } catch (error) {
    throw error;
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
