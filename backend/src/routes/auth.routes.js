const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const authHandler = require("../middlewares/auth.middleware");
const preAuthHandler = require("../middlewares/preLogin.middleware");
const { authLimiter } = require("../middlewares/rateLimiter");

router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post(
  "/verify-login-otp",
  authLimiter,
  preAuthHandler,
  authController.verifyLogin,
);
router.post("/forgot-password", authLimiter, authController.forgotPassword);
router.post(
  "/verify-forgot-otp",
  authLimiter,
  preAuthHandler,
  authController.verifyForgotOtp,
);
router.post(
  "/reset-password",
  authLimiter,
  preAuthHandler,
  authController.resetPassword,
);

router.get("/profile", authHandler, authController.getProfile);
router.patch("/profile", authHandler, authController.updateProfile);

module.exports = router;
