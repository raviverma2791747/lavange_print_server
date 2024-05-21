const dotenv = require("dotenv");

dotenv.config();

const assetUrl = (id) => {
  return process.env.NODE_ENV === "production"
    ? `${process.env.AWS_S3_URL}/${id}`
    : `${process.env.BASE_URI}:${process.env.PORT || 3000}/media/${id}`;
};

const getByValue = (obj, val) => {
  return Object.keys(obj).find((key) => obj[key] === val);
};

module.exports = { assetUrl , getByValue};
