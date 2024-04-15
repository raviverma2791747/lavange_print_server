const mongoose = require("mongoose");
const CollectionModel = require("../../models/collection");
const dotenv = require("dotenv");
const { assetUrl } = require("../../helper/utils");
const { STATUS } = require("../../helper/constants");

dotenv.config();

const fetchCollection = async (req, res, next) => {
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

const getCollection = async (req, res, next) => {
  try {
    let collection = await CollectionModel.findById({ _id: req.params.id })
      .populate({
        path: "products",
        match: { status: STATUS.ACTIVE },
        populate: {
          path: "assets",
          select: "_id url title",
        },
      })
      .lean({ virtuals: true });

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

const updateCollection = async (req, res, next) => {
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

const getUserCollectionSlug = async (req, res, next) => {
  try {
    let collection = await CollectionModel.findOne({ slug: req.params.slug })
      .populate({
        path: "products",
        match: { status: STATUS.ACTIVE },
        populate: {
          path: "assets",
          select: "_id url title",
        },
      })
      .lean({
        virtuals: true,
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

const getUserCollection = async (req, res, next) => {
  try {
    let collection = await CollectionModel.findOne({ _id: req.params.id })
      .populate({
        path: "products",
        populate: {
          path: "assets",
          select: "_id url title",
        },
        match: { status: STATUS.ACTIVE },
      })
      .lean({
        virtuals: true,
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

const fetchUserCollection = async (req, res, next) => {
  try {
    const collections = await CollectionModel.find({
      status: STATUS.ACTIVE,
    })
      .populate({
        path: "asset",
        select: "_id url title",
      })
      .lean({ virtuals: true });

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

module.exports = {
  fetchCollection,
  getCollection,
  updateCollection,
  getUserCollection,
  getUserCollectionSlug,
  fetchUserCollection,
};
