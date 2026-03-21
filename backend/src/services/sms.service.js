let twilioClient = null;

const getTwilioClient = () => {
  if (!twilioClient) {
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
      throw new Error("Twilio credentials not configured.");
    }
    twilioClient = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }
  return twilioClient;
};

exports.sendSMS = async (to, body) => {
  try {
    const client = getTwilioClient();
    const message = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
      body,
    });
    return message;
  } catch (error) {
    console.log(error);
  }
};

exports.sendWelcomeSMS = async (user) => {
  try {
    const body =
      `Welcome to Subscription Manager, ${user.name}! 🎉 ` +
      `Your account has been created successfully. ` +
      `Start tracking your subscriptions and never miss a renewal.`;

    await this.sendSMS(user.phone, body);
  } catch (error) {
    console.log(error);
  }
};

exports.sendRenewalRemainderSMS = async (user, subscription, daysLeft) => {
  try {
    const body =
      `[SubManager] Reminder: "${subscription.name}" renews in ${daysLeft} day${daysLeft !== 1 ? "s" : ""} ` +
      `on ${new Date(subscription.nextRenewal).toDateString()}. ` +
      `Amount: ${subscription.currency} ${subscription.amount}.`;

    const message = await this.sendSMS(user.phone, body);
    return message;
  } catch (error) {
    console.log(error);
  }
};

exports.sendOtpSMS = async (user, otp) => {
  if (!user.phone) return;

  const body =
    `[SubManager] Your login OTP is: ${otp}. ` +
    `It expires in 5 minutes. Do not share it with anyone.`;

  await this.sendSMS(user.phone, body);
};
