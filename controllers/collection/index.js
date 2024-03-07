const mongoose = require("mongoose");
const CollectionModel = require("../../models/collection");
const dotenv = require("dotenv");
const { assetUrl } = require("../../helper/utils");

dotenv.config();

const fetchCollection = async (req,  res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};


const getCollection = async (req,  res, next) => {
  try {
    let collection = await CollectionModel.findById({ _id: req.params.id })
      .populate("products")
      .lean();

    if (process.env.NODE_ENV === "production") {
      collection.assetUrl = `${process.env.AWS_S3_URL}/${collection.assetId}`;
    } else {
      collection.assetUrl = assetUrl(collection.assetId);
    }

    collection.products.forEach((product) => {
      product.assets = product.assets.map((asset) => {
        return {
          ...asset,
          url: assetUrl(asset.id),
        };
      });
    });

    return res.json({
      status: 200,
      data: {
        collection,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateCollection = async (req,  res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

const getUserCollection = async (req,  res, next) => {
  try {
    let collection = await CollectionModel.findOne({ slug: req.params.slug })
      .populate("products")
      .lean();

    collection.assetUrl = assetUrl(collection.assetId);

    collection.products.forEach((product) => {
      product.assets = product.assets.map((asset) => {
        return {
          ...asset,
          url: assetUrl(asset.id),
        };
      });
    });

    return res.json({
      status: 200,
      data: {
        collection,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchCollection,
  getCollection,
  updateCollection,
  getUserCollection,
};
