const jwt = require("jsonwebtoken");
const TokenModel = require("../models/token");

const verifyRefreshToken = async (refreshToken) => {
  try {
    const userRefreshToken = await TokenModel.findOne({ token: refreshToken });

    if (!userRefreshToken) {
      return { error: true, message: "Invalid refresh token" };
    }
    const tokenDetails = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
    );

    return {
      tokenDetails,
      error: false,
      message: "Valid refresh token",
    };
  } catch (error) {
    return { error: true, message: "Invalid refresh token" };
  }
};

module.exports = verifyRefreshToken;
