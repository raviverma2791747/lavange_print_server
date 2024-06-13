const mongoose = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const otpSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    otp: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    createdAt: {
      type: mongoose.SchemaTypes.Date,
      default: Date.now,
      expires: "10m",
    },
  },
  {
    timestamps: true,
  }
);

otpSchema.plugin(mongooseLeanVirtuals);
const OtpModel = mongoose.model("otp", otpSchema);

module.exports = OtpModel;
