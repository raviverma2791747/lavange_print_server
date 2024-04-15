const mongoose = require("mongoose");
const { FACET_TYPE } = require("../../helper/constants");

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
      type: mongoose.SchemaTypes.Number,
      enum: Object.values(FACET_TYPE),
      default: FACET_TYPE.OTHER,
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
