require("dotenv").config();

const express = require("express");
const { connectDB } = require("./config/db");
const cors = require("cors");
const { apiLimiter } = require("../src/middlewares/rateLimiter");
const { startCronJob } = require("./jobs/renewalChecker");

const authRoutes = require("./routes/auth.routes");
const subscriptionRoutes = require("./routes/subscription.routes");
const notificationRoutes = require("./routes/notification.routes");

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-session-token", "x-reset-token"],
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

connectDB();
startCronJob();

module.exports = app;
