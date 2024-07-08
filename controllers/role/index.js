const mongoose = require("mongoose");
const RoleModel = require("../../models/role");

const fetchRole = async (req, res) => {
  const roles = await RoleModel.find();
  return res.json({ status: 200, data: { roles } });
};

const getRole = async (req, res) => {
  const roleId = req.params.id;
  const role = await RoleModel.findById(roleId);
  return res.json({ status: 200, data: { role } });
};

const updateRole = async (req, res) => {
  const roleId = req.body._id ?? new mongoose.Types.ObjectId();
  const data = req.body;

  const role = await RoleModel.updateOne(
    {
      roleId,
    },
    data,
    {
      upsert: true,
      new: true,
    }
  );

  return res.json({
    status: 200,
    data: { role: { id: roleId } },
  });
};

module.exports = {
  fetchRole,
  getRole,
  updateRole,
};
