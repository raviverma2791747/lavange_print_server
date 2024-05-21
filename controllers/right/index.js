const RightType = require("../../models/right");

const fetchRight = async (req,  res, next) => {
  try {
    const rights = RightType;
    return res.json({ status: 200, data: { rights } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchRight,
};
