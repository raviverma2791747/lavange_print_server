const mongoose = require("mongoose");

const facetSchema = new mongoose.Schema(
  {
    displayName: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    name: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    type: {
      type: mongoose.SchemaTypes.String,
      enum: ["color", "size", "material", "other"],
      default: "other",
      required: true,
    },
    options: [
      {
        displayName: {
          type: mongoose.SchemaTypes.String,
          required: true,
        },
        value: {
          type: mongoose.SchemaTypes.String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// facetSchema.virtual("products", {
//   ref: "product",
//   localField: "_id",
//   foreignField: "facet",
//   justOne: false, // Retrieve all associated products
// });

facetSchema.set("toJSON", {
  virtuals: true,
});

facetSchema.set("toObject", {
  virtuals: true,
});

const FacetModel = mongoose.model("facet", facetSchema);

module.exports = FacetModel;
