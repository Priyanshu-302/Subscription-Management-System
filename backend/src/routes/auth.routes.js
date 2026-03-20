const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const authHandler = require("../middlewares/auth.middleware");
const { authLimiter } = require("../middlewares/rateLimiter");

router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);

router.get("/profile", authHandler, authController.getProfile);
router.patch("/profile", authHandler, authController.updateProfile);

module.exports = router;
