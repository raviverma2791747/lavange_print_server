const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true , }
);

const CategoryModel = mongoose.model("category", categorySchema);

module.exports = CategoryModel;
