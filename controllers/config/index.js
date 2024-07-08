const { ConfigModel } = require("../../models/config");

const fetchConfig = async (req, res) => {
  const configs = await ConfigModel.find();
  return res.json({
    status: 200,
    data: {
      configs,
    },
  });
};

module.exports = {
  fetchConfig,
};
