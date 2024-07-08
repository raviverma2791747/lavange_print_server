const RightType = require("../../models/right");

const fetchRight = async (req, res) => {
  const rights = RightType;
  return res.json({ status: 200, data: { rights } });
};

module.exports = {
  fetchRight,
};
