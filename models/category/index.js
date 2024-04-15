const mongoose = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
const { STATUS } = require("../../helper/constants");

const categorySchema = new mongoose.Schema(
  {
    status: {
      type: mongoose.SchemaTypes.Number,
      enum: Object.values(STATUS),
      default: STATUS.DRAFT,
      required: true,
    },
    name: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: true,
      index: true,
    },
    slug: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: true,
      index: true,
    },
    asset: {
      type: mongoose.SchemaTypes.String,
      ref: "image",
      required: true,
    },
    facets: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "facet",
        // required: true,
      },
    ],
  },
  { timestamps: true }
);

categorySchema.virtual("products", {
  ref: "product",
  localField: "_id",
  foreignField: "category",
  justOne: false, // Retrieve all associated products
});

categorySchema.set("toJSON", {
  virtuals: true,
});

categorySchema.set("toObject", {
  virtuals: true,
});

categorySchema.plugin(mongooseLeanVirtuals);
const CategoryModel = mongoose.model("category", categorySchema);

module.exports = CategoryModel;
