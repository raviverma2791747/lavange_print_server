const mongoose = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const tokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    token: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    blacklisted: {
      type: mongoose.SchemaTypes.Boolean,
      default: false,
    },
    createdAt: {
      type: mongoose.SchemaTypes.Date,
      default: Date.now,
      expires: "5d",
    },
  },
  {
    timestamps: true,
  }
);

tokenSchema.plugin(mongooseLeanVirtuals);
const TokenModel = mongoose.model("token", tokenSchema);

module.exports = TokenModel;
