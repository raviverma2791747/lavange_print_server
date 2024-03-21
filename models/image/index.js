const mongoose = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
const { assetUrl } = require("../../helper/utils");

const imageSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: mongoose.SchemaTypes.String,
      default: "",
    },
  },
  { timestamps: true }
);

imageSchema.virtual("url").get(function () {
  return assetUrl(`${this._id}`);
});

imageSchema.set("toJSON", {
  virtuals: true,
});
imageSchema.set("toObject", {
  virtuals: true,
});

imageSchema.plugin(mongooseLeanVirtuals);
const ImageModel = mongoose.model("image", imageSchema);

module.exports = ImageModel;
