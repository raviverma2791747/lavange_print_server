const jwt = require("jsonwebtoken");
const isTokenExpired = require("../helper/isTokenExpired");
const refreshAccessToken = require("../helper/refreshAccessToken");
const setTokenCookies = require("../helper/setTokenCookies");

// function authenticate(req, res, next) {
//   try {
//     const token = req.headers.authorization;

//     if (!token) {
//       return res.status(401).json({ status:500, errors:["Token not provided"] });
//     }

//     jwt.verify(
//       token.replace("Bearer ", ""),
//       process.env.JWT_SECRET_KEY,
//       (err, decoded) => {
//         if (err) {
//           return res.status(401).json({ status: 500, errors:["Token is invalid"] });
//         }
//         req.user = decoded;
//         next();
//       }
//     );
//   } catch {
//     return res.status(500).json({ status: 500, errors:["Something went wrong!"] });
//   }
// }

async function authenticate(req, res, next) {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken || !isTokenExpired(accessToken)) {
      req.headers["authorization"] = `Bearer ${accessToken}`;
    }

    if (!accessToken || isTokenExpired(accessToken)) {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res
          .status(401)
          .json({ status: 401, errors: ["Refresh Token not provided"] });
      }

      const {
        newAccessToken,
        newRefreshToken,
        newAccessTokenExp,
        newRefreshTokenExp,
      } = await refreshAccessToken(req, res);

      setTokenCookies(
        res,
        newAccessToken,
        newRefreshToken,
        newAccessTokenExp,
        newRefreshTokenExp
      );

      req.headers["authorization"] = `Bearer ${newAccessToken}`;
    }

    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json({ status: 401, errors: ["Token not provided"] });
    }

    const user = await jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_ACCESS_SECRET_KEY
    );

    req.user = user;

    next();
  } catch (error) {
    if (error?.status) {
      return res
        .status(error.status)
        .json({ status: error.status, messages: error.messages });
    }
    return res
      .status(500)
      .json({ status: 500, errors: ["Something went wrong!"] });
  }
}

module.exports = authenticate;
