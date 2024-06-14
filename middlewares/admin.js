const RightType = require("../models/right");

function admin(req, res, next) {
  if (req.user.rights?.includes(RightType.ADMIN_ACCESS)) {
    return next();
  }
  return res.json({ status: 401, messages: ["Invalid credentials!"] });
}

module.exports = admin;
