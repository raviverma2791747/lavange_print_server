const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    status: {
      type: mongoose.SchemaTypes.String,
      enum: ["active", "inactive", "archive"],
      default: "inactive",
    },
    username: {
      type: mongoose.SchemaTypes.String,
      unique: true,
      required: true,
      index: true,
    },
    email: {
      type: mongoose.SchemaTypes.String,
      unique: true,
      required: true,
      index: true,
    },
    firstName: mongoose.SchemaTypes.String,
    lastName: mongoose.SchemaTypes.String,
    password: mongoose.SchemaTypes.String,
    dateOfBirth: mongoose.SchemaTypes.Date,
    // account: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "account",
    //   //required: true,
    // },
    // role: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "role", // Reference to the User model
    //   //required: true,
    // },
    wishList: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "product",
      },
    ],
    cart: [
      {
        variant: {
          type: mongoose.SchemaTypes.ObjectId,
          default: null,
        },
        variantSchema: {
          type: mongoose.SchemaTypes.ObjectId,
          default: null,
        },
        price: {
          type: mongoose.SchemaTypes.Number,
        },
        quantity: {
          type: mongoose.SchemaTypes.Number,
          default: 1,
        },
        product: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "product",
        },
      },
    ],
    addresses: [
      {
        status: {
          type: mongoose.SchemaTypes.String,
          enum: ["active", "archive"],
          default: "active",
        },
        default: {
          type: mongoose.SchemaTypes.Boolean,
          default: false,
        },
        fullName: {
          type: mongoose.SchemaTypes.String,
        },
        mobile: {
          type: mongoose.SchemaTypes.Number,
        },
        addressLine1: {
          type: mongoose.SchemaTypes.String,
        },
        addressLine2: {
          type: mongoose.SchemaTypes.String,
        },
        landmark: {
          type: mongoose.SchemaTypes.String,
        },
        city: {
          type: mongoose.SchemaTypes.String,
        },
        state: {
          type: mongoose.SchemaTypes.String,
        },
        country: {
          type: mongoose.SchemaTypes.String,
        },
        pincode: {
          type: mongoose.SchemaTypes.Number,
        },
        type: {
          type: mongoose.SchemaTypes.String,
          enum: ["home", "work", "other"],
        },
      },
    ],
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role", // Reference to the User model
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
