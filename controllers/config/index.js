const mongoose = require("mongoose");
const { ConfigModel } = require("../../models/config");

const fetchConfig = async (req,  res, next) => {
  try {
    const configs = await ConfigModel.find();

    return res.json({
      status: 200,
      data: {
        configs,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchConfig,
};
