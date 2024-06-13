const setTokenCookies = (
  res,
  accessToken,
  refreshToken,
  accessTokenExp,
  refreshTokenExp
) => {
  const accessTokenMaxAge =
    (accessTokenExp - Math.floor(Date.now() / 1000)) * 1000;
  const refreshTokenMaxAge =
    (refreshTokenExp - Math.floor(Date.now() / 1000)) * 1000;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: accessTokenMaxAge,
    sameSite: "none",
    secure: true,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: refreshTokenMaxAge,
    sameSite: "none",
    secure: true,
  });
};

module.exports = setTokenCookies;
