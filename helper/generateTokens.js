const jwt = require("jsonwebtoken");
const TokenModel = require("../models/token");

const generateTokens = async (user) => {

  const payload = {
    userId: user._id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role.name,
    rights: user.role.rights,
  };

  // Generate access token with 1 hour expiration
  const accessTokenExp = Math.floor(Date.now() / 1000) + 60 * 60;

  const accessToken = jwt.sign(
    { ...payload, exp: accessTokenExp },
    process.env.JWT_ACCESS_SECRET_KEY,
    {
      //expiresIn: '1h',
    }
  );

  // Generate refresh token with 5 days expiration
  const refreshTokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5;
  const refreshToken = jwt.sign(
    { ...payload, exp: refreshTokenExp },
    process.env.JWT_REFRESH_SECRET_KEY,
    {
      //expiresIn: '5d',
    }
  );

  const userRefreshToken = await TokenModel.findOne({ user: user._id });
  if (userRefreshToken) {
      await userRefreshToken.deleteOne();
  }

  await new TokenModel({ user: user._id, token: refreshToken }).save();

  return Promise.resolve({
    accessToken,
    refreshToken,
    accessTokenExp,
    refreshTokenExp,
  });
};

module.exports = generateTokens;
