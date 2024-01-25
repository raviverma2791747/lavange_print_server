const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    assetId: {
      type: mongoose.SchemaTypes.String,
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

const AnnouncementModel = mongoose.model("announcement", announcementSchema);

module.exports = AnnouncementModel;
