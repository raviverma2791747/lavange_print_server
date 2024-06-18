const mongoose = require("mongoose");
const { ServerConfigModel } = require("../../models/config");
const dotenv = require("dotenv");
const { assetUrl } = require("../../helper/utils");
const { STATUS } = require("../../helper/constants");

dotenv.config();

const getServerConfig = async (req, res, next) => {
  const serverConfig = await ServerConfigModel.findOne();
  return res.json({
    status: 200,
    data: {
      serverConfig,
    },
  });
};

const updateServerConfig = async (req, res, next) => {
  const _id = req.body._id ?? new mongoose.Types.ObjectId();
  const serverConfig = await ServerConfigModel.updateOne(
    {
      _id: _id,
    },
    req.body,
    {
      upsert: true,
      new: true,
    }
  );
  return res.json({
    status: 200,
    data: {
      serverConfig: {
        id: _id,
      },
    },
  });
};

module.exports = {
  getServerConfig,
  updateServerConfig,
};
