const router = require("express").Router();
const subscriptionController = require("../controllers/subscription.controller");
const authHandler = require("../middlewares/auth.middleware");

router.use(authHandler);

router.get("/summary", subscriptionController.getSummary);

router.post("/", subscriptionController.createSubscription);
router.get("/", subscriptionController.getAll);

router.get("/:id", subscriptionController.getOne);
router.patch("/:id", subscriptionController.updateSubscription);
router.delete("/:id", subscriptionController.deleteSubscription);

module.exports = router;
