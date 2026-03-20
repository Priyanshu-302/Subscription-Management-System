const router = require("express").Router();
const notificationController = require("../controllers/notification.controller");
const authHandler = require("../middlewares/auth.middleware");

router.use(authHandler);

router.get("/", notificationController.getAll);

router.get("/:id", notificationController.getOne);
router.patch("/:id", notificationController.markAsRead);
router.delete("/:id", notificationController.remove);

router.patch("/mark-all-read", notificationController.markAllAsRead);

module.exports = router;
