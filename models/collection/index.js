const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.SchemaTypes.String,
      required: true,
      index: true,
    },
    description: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    assetId: {
      type: mongoose.SchemaTypes.String,
    },
    status: {
      type: mongoose.SchemaTypes.String,
      enum: ["active", "draft", "archive"],
      default: "draft",
    },
    slug: {
      type: mongoose.SchemaTypes.String,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

collectionSchema.virtual("products", {
  ref: "product",
  localField: "_id",
  foreignField: "collections",
  justOne: false, // Retrieve all associated products
});

collectionSchema.set("toJSON", {
  virtuals: true,
});
collectionSchema.set("toObject", {
  virtuals: true,
});

const CollectionModel = mongoose.model("collection", collectionSchema);

module.exports = CollectionModel;
