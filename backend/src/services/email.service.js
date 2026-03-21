const nodemailer = require("nodemailer");

// 1. Create a transporter object
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 2. Send the email
exports.sendEmail = async ({ to, subject, html, text }) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
    text,
  });

  return info;
};

exports.sendRenewalRemainderEmail = async (user, subscription, daysLeft) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: #4f46e5; color: #fff; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; }
        .body { padding: 32px; color: #333; }
        .highlight { background: #eef2ff; border-left: 4px solid #4f46e5; padding: 16px; border-radius: 4px; margin: 20px 0; }
        .highlight p { margin: 4px 0; }
        .badge { display: inline-block; background: #ef4444; color: #fff; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 14px; }
        .footer { background: #f8f8f8; padding: 16px; text-align: center; font-size: 12px; color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Subscription Renewal Reminder</h1>
        </div>
        <div class="body">
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>Your subscription is renewing soon. Here are the details:</p>
          <div class="highlight">
            <p><strong>Service:</strong> ${subscription.name}</p>
            <p><strong>Amount:</strong> ${subscription.currency} ${subscription.amount}</p>
            <p><strong>Billing Cycle:</strong> ${subscription.billingCycle}</p>
            <p><strong>Renewal Date:</strong> ${new Date(subscription.nextRenewal).toDateString()}</p>
            <p><strong>Days Remaining:</strong> <span class="badge">${daysLeft} day${daysLeft !== 1 ? "s" : ""}</span></p>
          </div>
          <p>If you wish to cancel or modify this subscription, please do so before the renewal date.</p>
        </div>
        <div class="footer">
          <p>Subscription Manager &bull; You're receiving this because you enabled email alerts.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const info = await this.sendEmail({
    to: user.email,
    subject: `⏰ Reminder: "${subscription.name}" renews in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`,
    html,
    text: `Hi ${user.name}, your subscription "${subscription.name}" (${subscription.currency} ${subscription.amount}) renews on ${new Date(subscription.nextRenewal).toDateString()} — ${daysLeft} day(s) from now.`,
  });

  return info;
};

exports.sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 32px;">
      <h2 style="color: #4f46e5;">Welcome to Subscription Manager! 🎉</h2>
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Your account has been created. Start tracking your subscriptions and never miss a renewal.</p>
      <p style="color: #888; font-size: 12px; margin-top: 40px;">Subscription Manager</p>
    </div>
  `;

  const info = await this.sendEmail({
    to: user.email,
    subject: "Welcome to Subscription Manager!",
    html,
    text: `Hi ${user.name}, welcome to Subscription Manager! Your account is ready.`,
  });

  return info;
};