const mongoose = require("mongoose");
const { ServerConfigModel } = require("../../models/config");

const getServerConfig = async (req, res) => {
  const serverConfig = await ServerConfigModel.findOne();
  return res.json({
    status: 200,
    data: {
      serverConfig,
    },
  });
};

const updateServerConfig = async (req, res) => {
  const serverConfigId = req.body._id ?? new mongoose.Types.ObjectId();
  const data = req.body;

  const serverConfig = await ServerConfigModel.updateOne(
    {
      _id: serverConfigId,
    },
    data,
    {
      upsert: true,
      new: true,
    }
  );
  return res.json({
    status: 200,
    data: {
      serverConfig: {
        id: serverConfigId,
      },
    },
  });
};

module.exports = {
  getServerConfig,
  updateServerConfig,
};
