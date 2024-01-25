const mongoose = require("mongoose");
const RightType = require("../right");

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    rights: {
      type: [
        {
          type: String,
          enum: Object.values(RightType),
          required: true,
        },
      ],
      validate: {
        validator: function (rights) {
          // Custom validation logic to ensure unique values
          const uniqueRights = new Set(rights);
          return uniqueRights.size === rights.length;
        },
        message: "Rights in the array must be unique.",
      },
    },
  },
  { timestamps: true }
);

const RoleModel = mongoose.model("role", roleSchema);

module.exports = RoleModel;
