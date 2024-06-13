const transporter = require("../config/emailConfig");
const OtpModel = require("../models/otp");

const sendEmailVerificationOTP = async ( user) => {
  //generate 4 digit otp
  const otp = Math.floor(1000 + Math.random() * 9000);

  await new OtpModel({
    user: user._id,
    otp: otp,
  }).save();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "OTP Email Verification",
    text: `Your Email Verification OTP is ${otp}`,
  });
};

module.exports = sendEmailVerificationOTP;
