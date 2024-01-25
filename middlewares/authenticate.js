const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ status:500, errors:["Token not provided"] });
    }

    jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET_KEY,
      (err, decoded) => {
        if (err) {
          return res.status(401).json({ status: 500, errors:["Token is invalid"] });
        }
        req.user = decoded;
        next();
      }
    );
  } catch {
    return res.status(500).json({ status: 500, errors:["Something went wrong!"] });
  }
}

module.exports = authenticate;