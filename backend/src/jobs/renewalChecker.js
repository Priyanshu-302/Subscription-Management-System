const cron = require("node-cron");
const Subscriptions = require("../services/subscription.service");
const Notification = require("../services/notification.service");

// Run the renewal check at everyday 8 AM
exports.runRenewalCheck = async () => {
  try {
    const daysLeft = 7;

    console.log(
      `[${new Date().toISOString()}] Running renewal check (${daysLeft} days ahead)...`,
    );

    const dueSubscriptions = await Subscriptions.getDueForRenewal(daysLeft);

    for (const subscription of dueSubscriptions) {
      const user = subscription.userId;

      try {
        await Notification.sendRenewalRemainder(user, subscription);
      } catch (error) {
        console.error(
          `❌ Failed to send alert for subscription "${subscription.name}": ${err.message}`,
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Run expiry cleanup
exports.runExpiryCleanup = async () => {
  try {
    console.log(`[${new Date().toISOString()}] Running expiry cleanup...`);

    const result = await Subscriptions.updateMany(
      {
        status: "active",
        nextRenewal: { $lt: new Date() },
      },
      { $set: { status: "EXPIRED" } },
    );

    if (result.modifiedCount > 0) {
      console.log(`Marked ${result.modifiedCount} subscription(s) as expired.`);
    } else {
      console.log("No expired subscriptions found.");
    }
  } catch (error) {
    console.log(error);
  }
};

// Start Cron Jobs
exports.startCronJob = () => {
  try {
    const renewalCron = "0 8 * * *";

    if (!cron.validate(renewalCron)) {
      console.error(
        `Invalid cron expression: "${renewalCron}". Skipping cron setup.`,
      );
      return;
    }

    // Renewal alerts — default: every day at 8:00 AM
    cron.schedule(renewalCron, exports.runRenewalCheck);

    // Expiry cleanup — every day at midnight
    cron.schedule("0 0 * * *", exports.runExpiryCleanup);

    console.log(`   Cron jobs scheduled.`);
    console.log(`   Renewal alerts : "${renewalCron}"`);
    console.log(`   Expiry cleanup : "0 0 * * *"`);
  } catch (error) {
    console.log(error);
  }
};
