const mongoose = require("mongoose");
const { HelpConfigModel } = require("../../models/config");

const getHelpConfig = async (req, res) => {
  const helpConfig = await HelpConfigModel.findOne();
  return res.json({
    status: 200,
    data: {
      helpConfig,
    },
  });
};

const updateHelpConfig = async (req, res, next) => {
  const helpConfigId = req.body._id ?? new mongoose.Types.ObjectId();
  const payload = req.body;
  const helpConfig = await HelpConfigModel.updateOne(
    {
      _id: helpConfigId,
    },
    payload,
    {
      upsert: true,
      new: true,
    }
  );
  return res.json({
    status: 200,
    data: {
      helpConfig: {
        id: helpConfigId,
      },
    },
  });
};

module.exports = {
  getHelpConfig,
  updateHelpConfig,
};
