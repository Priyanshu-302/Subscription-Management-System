const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const authHandler = require("../middlewares/auth.middleware");
const preAuthHandler = require("../middlewares/preLogin.middleware");
const { authLimiter } = require("../middlewares/rateLimiter");

router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post(
  "/verify-login",
  authLimiter,
  preAuthHandler,
  authController.verifyLogin,
);

router.get("/profile", authHandler, authController.getProfile);
router.patch("/profile", authHandler, authController.updateProfile);

module.exports = router;
