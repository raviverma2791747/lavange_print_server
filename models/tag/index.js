const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: true,
      index: true,
    },
    // isArchived: {
    //   type: mongoose.SchemaTypes.Boolean,
    //   default: false,
    // },
  },
  { timestamps: true }
);

const TagModel = mongoose.model("tag", tagSchema);

module.exports = TagModel;
