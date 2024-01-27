const mongoose = require("mongoose");
const RoleModel = require("../../models/role");

const fetchRole = async (req,  res, next) => {
  try {
    const roles = await RoleModel.find();

    return res.json({ status: 200, data: { roles } });
  } catch (error) {
    next(error);
  }
};

const getRole = async (req,  res, next) => {
  try {
    const role = await RoleModel.findById(req.params.id);

    return res.json({ status: 200, data: { role } });
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req,  res, next) => {
  try {
    const _id = req.body._id ?? new mongoose.Types.ObjectId();

    const role = await RoleModel.updateOne(
      {
        _id,
      },
      req.body,
      {
        upsert: true,
        new: true,
      }
    );

    return res.json({
      status: 200,
      data: { id: _id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchRole,
  getRole,
  updateRole,
};
