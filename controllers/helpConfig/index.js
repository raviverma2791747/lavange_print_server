const mongoose = require("mongoose");
const { HelpConfigModel } = require("../../models/config");
const dotenv = require("dotenv");

dotenv.config();

const getHelpConfig = async (req, res, next) => {
  const helpConfig = await HelpConfigModel.findOne();
  return res.json({
    status: 200,
    data: {
      helpConfig,
    },
  });
};

const updateHelpConfig = async (req, res, next) => {
  const _id = req.body._id ?? new mongoose.Types.ObjectId();
  const helpConfig = await HelpConfigModel.updateOne(
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
      helpConfig: {
        id: _id,
      },
    },
  });
};

module.exports = {
  getHelpConfig,
  updateHelpConfig,
};
