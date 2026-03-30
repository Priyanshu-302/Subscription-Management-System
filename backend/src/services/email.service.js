const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Subscription Manager <onboarding@resend.dev>";

const sendEmail = async ({ to, subject, html, text }) => {
  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    subject,
    html,
    text,
  });
  if (error) throw new Error(error.message);
  return data;
};

exports.sendRenewalReminderEmail = async (user, subscription, daysLeft) => {
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
        <div class="header"><h1>⏰ Subscription Renewal Reminder</h1></div>
        <div class="body">
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>Your subscription is renewing soon:</p>
          <div class="highlight">
            <p><strong>Service:</strong> ${subscription.name}</p>
            <p><strong>Amount:</strong> ${subscription.currency} ${subscription.amount}</p>
            <p><strong>Billing Cycle:</strong> ${subscription.billingCycle}</p>
            <p><strong>Renewal Date:</strong> ${new Date(subscription.nextRenewal).toDateString()}</p>
            <p><strong>Days Remaining:</strong> <span class="badge">${daysLeft} day${daysLeft !== 1 ? "s" : ""}</span></p>
          </div>
        </div>
        <div class="footer"><p>Subscription Manager &bull; You enabled email alerts.</p></div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: `⏰ "${subscription.name}" renews in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`,
    html,
    text: `Hi ${user.name}, your subscription "${subscription.name}" renews on ${new Date(subscription.nextRenewal).toDateString()} — ${daysLeft} day(s) from now.`,
  });
};

exports.sendOtpEmail = async (user, otp) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:32px;">
      <h2 style="color:#4f46e5;">🔐 Login Verification</h2>
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Your OTP is:</p>
      <div style="background:#eef2ff;border:2px dashed #4f46e5;border-radius:8px;padding:16px 32px;text-align:center;margin:24px 0;">
        <span style="font-size:36px;font-weight:bold;letter-spacing:10px;color:#4f46e5;">${otp}</span>
      </div>
      <p style="color:#888;font-size:13px;">⏱ Expires in <strong>5 minutes</strong>. Do not share it.</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: "Your Login OTP — Subscription Manager",
    html,
    text: `Your OTP is: ${otp}. Expires in 5 minutes.`,
  });
};

exports.sendForgotPasswordOtpEmail = async (user, otp) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:32px;">
      <h2 style="color:#dc2626;">🔑 Password Reset</h2>
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Your password reset OTP is:</p>
      <div style="background:#fef2f2;border:2px dashed #dc2626;border-radius:8px;padding:16px 32px;text-align:center;margin:24px 0;">
        <span style="font-size:36px;font-weight:bold;letter-spacing:10px;color:#dc2626;">${otp}</span>
      </div>
      <p style="color:#888;font-size:13px;">⏱ Expires in <strong>5 minutes</strong>. Do not share it.</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: "Password Reset OTP — Subscription Manager",
    html,
    text: `Your password reset OTP is: ${otp}. Expires in 5 minutes.`,
  });
};

exports.sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:32px;">
      <h2 style="color:#4f46e5;">Welcome to Subscription Manager! 🎉</h2>
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Your account has been created. Start tracking your subscriptions and never miss a renewal.</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: "Welcome to Subscription Manager!",
    html,
    text: `Hi ${user.name}, welcome to Subscription Manager!`,
  });
};
