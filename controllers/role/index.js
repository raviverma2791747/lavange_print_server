const mongoose = require("mongoose");
const RoleModel = require("../../models/role");

const fetchRole = async (req, res) => {
  const roles = await RoleModel.find();

  return res.json({ status: 200, data: { roles } });
};

const getRole = async (req, res) => {
  const role = await RoleModel.findById(req.params.id);

  return res.json({ status: 200, data: { role } });
};

const updateRole = async (req, res) => {
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
};

module.exports = {
  fetchRole,
  getRole,
  updateRole,
};
