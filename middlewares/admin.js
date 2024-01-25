const RightType = require("../models/right");

function admin(req, res, next) {
  if (req.user.rights.includes(RightType.ADMIN_ACCESS)) {
    return next();
  }

  return res.json({ status: 400 });
}

module.exports = admin;
