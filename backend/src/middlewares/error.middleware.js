const errorHandler = (err, req, res, next) => {
  try {
    console.log(err.stack);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (
      message === "User already exists" ||
      message === "Invalid email or password" ||
      message === "Invalid OTP" ||
      message === "OTP expired" ||
      message === "User not found"
    ) {
      statusCode = 400;
    }

    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      statusCode = 401;
      message = "Unauthorized: Invalid or expired token";
    }

    return res.status(statusCode).json({ message });
  } catch (error) {
    next(error);
  }
};

module.exports = errorHandler;