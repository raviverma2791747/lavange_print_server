const dotenv = require("dotenv");
const transporter = require("../config/emailConfig");

dotenv.config();

const assetUrl = (id) => {
  if (process.env.MEDIA_LOCAL === "false" && process.env.MEDIA_CDN === "aws") {
    console.log("Storage: S3");
    return `${process.env.BASE_URI}:${process.env.PORT || 3000}/media/${id}`;
  } else if (
    process.env.MEDIA_LOCAL === "false" &&
    process.env.MEDIA_CDN === "cloudinary"
  ) {
    console.log("Storage: Cloudinary");
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${process.env.CLOUDINARY_FOLDER_NAME}/${id}`;
  } else {
    console.log("Storage: Local");
    return `${process.env.AWS_S3_URL}/${id}`;
  }
};

const getByValue = (obj, val) => {
  return Object.keys(obj).find((key) => obj[key] === val);
};

const sendEmail = async ({ email, subject, text, html }) => {
  return await transporter.sendMail(
    {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: text,
      html: html,
    },
    function (error, info) {
      if (!error) {
        return info;
      } else {
        return error;
      }
    }
  );
};

module.exports = { assetUrl, getByValue, sendEmail };
