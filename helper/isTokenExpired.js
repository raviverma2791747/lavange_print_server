const jwt = require("jsonwebtoken");

const isTokenExpired = async (token) => {
  if (!token) {
    return true;
  }

  const decodedToken = jwt.decode(token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};

module.exports = isTokenExpired;
