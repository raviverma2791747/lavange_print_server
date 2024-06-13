const TokenModel = require("../models/token");
const UserModel = require("../models/user");
const verifyRefreshToken = require("./verifyRefreshToken");
const generateTokens = require("./generateTokens");

const refreshAccessToken = async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;
  const { tokenDetails, error } = await verifyRefreshToken(oldRefreshToken);

  if (error) {
    throw { status: 401, messages: ["Invalid refresh token"] };
  }

  const user = await UserModel.findById(tokenDetails.userId);

  if (!user) {
    throw { status: 401, messages: ["User not found"] };
  }

  const userRefreshToken = await TokenModel.findOne({
    user: tokenDetails.userId,
    token: oldRefreshToken,
  });

  if (
    oldRefreshToken !== userRefreshToken.token ||
    userRefreshToken.blacklisted
  ) {
    throw { status: 401, messages: ["Unauthorized access"] };
  }

  const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
    await generateTokens(user);

  return {
    newAccessToken: accessToken,
    newRefreshToken: refreshToken,
    newAccessTokenExp: accessTokenExp,
    newRefreshTokenExp: refreshTokenExp,
  };
};

module.exports = refreshAccessToken;
