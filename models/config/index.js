const mongoose = require("mongoose");
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const configSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: true,
    },
    status: {
      type: mongoose.SchemaTypes.String,
      enum: ["draft", "active", "archive"], 
      default: "draft",
      required: true,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "type",
  }
);
configSchema.plugin(mongooseLeanVirtuals);

//Home config
const homeConfigSchema = new mongoose.Schema(
  {
    featuredCategories: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "category",
      },
    ],
    featuredAnnouncements: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "announcement",
      },
    ],
    bestSellerProducts: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "product",
      },
    ],
    newArrivalProducts: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "product",
      },
    ],
    featuredCollections: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "collection",
      },
    ],
    exploreProducts: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "product",
      }
    ],
    exploreCollections: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "collection",
      }
    ],
    exploreProducts: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "product",
      }
    ]
  },
  {
    timestamps: true,
  }
);
homeConfigSchema.plugin(mongooseLeanVirtuals);

const ConfigModel = mongoose.model("config", configSchema);
const HomeConfigModel = ConfigModel.discriminator("home", homeConfigSchema);

module.exports = { ConfigModel, HomeConfigModel };
