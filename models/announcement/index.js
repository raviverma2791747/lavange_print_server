const mongoose = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    asset: {
      type: mongoose.SchemaTypes.String,
      ref: "image",
      required: true,
    },
    ctaUrl: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    status: {
      type: mongoose.SchemaTypes.String,
      enum: ["active", "draft", "archive"],
      default: "draft",
      required: true,
    },
  },
  { timestamps: true }
);

announcementSchema.plugin(mongooseLeanVirtuals);
const AnnouncementModel = mongoose.model("announcement", announcementSchema);

module.exports = AnnouncementModel;
