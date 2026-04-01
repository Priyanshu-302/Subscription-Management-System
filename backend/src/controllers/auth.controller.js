const authService = require("../services/auth.service");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const user = await authService.register({ name, email, password, phone });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authService.login({ email, password });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);

    if (!user) {
      throw new Error("User not found");
    }

    return res.status(200).json({
      success: true,
      message: "User found",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    const user = await authService.updateProfile(req.user.id, {
      name,
      email,
      phone,
    });

    if (!user) {
      throw new Error("User not found");
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const result = await authService.forgotPassword({ email });

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyForgotOtp = async (req, res, next) => {
  try {
    const result = await authService.verifyForgotOtp({
      otp: req.body.otp,
      email: req.email,
    });

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    console.log(password);

    const result = await authService.resetPassword({
      email: req.email,
      password,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
