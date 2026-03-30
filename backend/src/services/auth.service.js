const User = require("../models/User.model");
const OTP = require("../models/OTP.model");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const {
  sendWelcomeEmail,
  sendForgotPasswordOtpEmail,
  sendLoginOtpEmail,
} = require("../services/email.service");
const { sendWelcomeSMS, sendOtpSMS } = require("../services/sms.service");
const { generateToken, generateSessionToken } = require("../utils/token");

exports.register = async ({ name, email, password, phone }) => {
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    sendWelcomeEmail(user).catch((err) => {
      console.log(err);
    });

    sendWelcomeSMS(user).catch((err) => {
      console.log(err);
    });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.login = async ({ email, password, skipOtp }) => {
  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    if (skipOtp) {
      const token = generateToken(user._id);
      return {
        user,
        token,
        message: "Login successful",
      };
    }

    await OTP.deleteMany({ email });

    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOTP = await bcryptjs.hash(otp, 10);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await OTP.create({
      email,
      otp: hashedOTP,
      expiresAt,
    });

    await sendLoginOtpEmail(user, otp);

    const sessionToken = generateSessionToken(email);

    return {
      sessionToken,
      message:
        "OTP sent to your registered mobile number. Please verify to continue.",
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.verifyLogin = async ({ otp, email }) => {
  try {
    const otpRecord = await OTP.findOne({ email, isUsed: false });

    if (!otpRecord) {
      throw new Error("Invalid OTP");
    }

    if (new Date() > otpRecord.expiresAt) {
      throw new Error("OTP expired");
    }

    const isMatch = await bcryptjs.compare(otp, otpRecord.otp);
    if (!isMatch) {
      throw new Error("Invalid OTP");
    }

    otpRecord.isUsed = true;
    await otpRecord.save();

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const token = generateToken(user._id);

    return {
      user,
      token,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.getProfile = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.updateProfile = async (userId, { name, email, phone }) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, phone },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.forgotPassword = async ({ email }) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    await OTP.deleteMany({ email });

    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOTP = await bcryptjs.hash(otp, 10);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await OTP.create({
      email,
      otp: hashedOTP,
      expiresAt,
    });

    await sendForgotPasswordOtpEmail(user, otp);

    const sessionToken = generateSessionToken(email);

    return {
      sessionToken,
      message: "OTP sent to your registered email. Please verify to continue.",
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.verifyForgotOtp = async ({ otp, email }) => {
  try {
    const otpRecord = await OTP.findOne({ email, isUsed: false });
    if (!otpRecord) {
      throw new Error("Invalid OTP");
    }

    if (new Date() > otpRecord.expiresAt) {
      throw new Error("OTP expired");
    }

    const isMatch = await bcryptjs.compare(otp, otpRecord.otp);
    if (!isMatch) {
      throw new Error("Invalid OTP");
    }

    otpRecord.isUsed = true;
    await otpRecord.save();

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const sessionToken = generateSessionToken(email);

    return {
      user,
      sessionToken,
      message: "OTP verified. Please enter a new password.",
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.resetPassword = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    user.password = password;
    await user.save();

    return {
      user,
      message: "Password reset successfully. Please login.",
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
