const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const { sendWelcomeEmail } = require("../services/email.service");
const { generateToken } = require("../utils/token");

exports.register = async ({ name, email, password, phone }) => {
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    sendWelcomeEmail(user).catch((err) => {
      console.log(err);
    });

    return user;
  } catch (error) {
    console.log(error);
  }
};

exports.login = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken(user._id);

    return { user, token };
  } catch (error) {
    console.log(error);
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
  }
};
