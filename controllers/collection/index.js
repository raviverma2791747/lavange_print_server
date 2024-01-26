const mongoose = require("mongoose");
const CollectionModel = require("../../models/collection");
const dotenv = require("dotenv");

dotenv.config();

const fetchCollection = async (req, res) => {
  const { status } = req.query;

  let filter = {};

  if (status) {
    filter["status"] = status;
  }

  const collections = await CollectionModel.find(filter);
  return res.json({
    status: 200,
    data: {
      collections,
    },
  });
};

const getCollection = async (req, res) => {
  let collection = await CollectionModel.findById({ _id: req.params.id })
    .populate("products")
    .lean();

  if (process.env.NODE_ENV === "production") {
    collection.assetUrl = `${process.env.AWS_S3_URL}/${collection.assetId}`;
  } else {
    collection.assetUrl = `${process.env.BASE_URI}:${
      process.env.PORT || 3000
    }/media/${collection.assetId}`;
  }

  collection.products.forEach((product) => {
    product.assets = product.assets.map((asset) => {
      return {
        ...asset,
        url:
          process.env.NODE_ENV === "production"
            ? `${process.env.AWS_S3_URL}/${asset.id}`
            : `${process.env.BASE_URI}:${process.env.PORT || 3000}/media/${
                asset.id
              }`,
      };
    });
  });

  return res.json({
    status: 200,
    data: {
      collection,
    },
  });
};

const updateCollection = async (req, res) => {
  const _id = req.body._id ?? new mongoose.Types.ObjectId();
  const collection = await CollectionModel.updateOne(
    {
      _id: _id,
    },
    req.body,
    {
      upsert: true,
      new: true,
    }
  );
  return res.json({
    status: 200,
    data: {
      collection: {
        id: _id,
      },
    },
  });
};

const getUserCollection = async (req, res) => {
  let collection = await CollectionModel.findById({ _id: req.params.id })
    .populate("products")
    .lean();

  collection.assetUrl = `${process.env.BASE_URI}:${
    process.env.PORT || 3000
  }/media/${collection.assetId}`;

  collection.products.forEach((product) => {
    product.assets = product.assets.map((asset) => {
      return {
        ...asset,
        url: `${process.env.BASE_URI}:${process.env.PORT || 3000}/media/${
          asset.id
        }`,
      };
    });
  });

  return res.json({
    status: 200,
    data: {
      collection,
    },
  });
};

module.exports = {
  fetchCollection,
  getCollection,
  updateCollection,
  getUserCollection,
};
