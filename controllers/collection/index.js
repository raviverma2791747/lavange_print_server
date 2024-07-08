const mongoose = require("mongoose");
const CollectionModel = require("../../models/collection");
const { STATUS } = require("../../helper/constants");

const fetchCollection = async (req, res) => {
  const filter = {};
  const status = req.query.status;
  const page = req.query.page ?? 1;
  const limit = req.query.limit ?? 10;

  filter["name"] = {
    $regex: req.query.search ?? "",
    $options: "i",
  };

  if (status) {
    filter["status"] = status;
  }

  let sort = {};

  if (req.query.sort) {
    sort[req.query.sort] = req.query.order === "desc" ? -1 : 1;
  }

  const collections = await CollectionModel.find(filter)
    .populate({
      path: "asset",
      select: "_id url title",
    })
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean({ virtuals: true });

  const total = await CollectionModel.find(filter).countDocuments();

  return res.json({
    status: 200,
    data: {
      collections,
      total: total,
      limit: limit,
      page: page,
    },
  });
};

const getCollection = async (req, res) => {
  const collectionId = req.params.id;
  const collection = await CollectionModel.findById(collectionId)
    .populate({
      path: "products",
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
};

const updateCollection = async (req, res) => {
  const collectionId = req.body._id ?? new mongoose.Types.ObjectId();
  const collection = await CollectionModel.updateOne(
    {
      _id: collectionId,
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
        id: collectionId,
      },
    },
  });
};

const getUserCollectionBySlug = async (req, res) => {
  const slug = req.params.slug;
  const collection = await CollectionModel.findOne({ slug: slug })
    .populate({
      path: "products",
      match: { status: STATUS.ACTIVE },
      populate: {
        path: "assets",
        select: "_id url title",
      },
      select:
        "_id status url title slug price variants variantSchema assets price compareAtPrice",
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
};

const getUserCollection = async (req, res) => {
  const collectionId = req.params.id;
  const collection = await CollectionModel.findById(collectionId)
    .populate({
      path: "products",
      populate: {
        path: "assets",
        select: "_id url title",
      },
      match: { status: STATUS.ACTIVE },
      select:
        "_id status url title slug price variants variantSchema assets price compareAtPrice",
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
};

const fetchUserCollection = async (req, res) => {
  const filter = {};
  const status = req.query.status;
  const page = req.query.page ?? 1;
  const limit = req.query.limit ?? 10;

  filter["name"] = {
    $regex: req.query.search ?? "",
    $options: "i",
  };

  if (status) {
    filter["status"] = status;
  }

  let sort = {};

  if (req.query.sort) {
    sort[req.query.sort] = req.query.order === "desc" ? -1 : 1;
  }

  const collections = await CollectionModel.find(filter)
    .populate({
      path: "asset",
      select: "_id url title",
    })
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean({ virtuals: true });

  const total = await CollectionModel.find(filter).countDocuments();

  return res.json({
    status: 200,
    data: {
      collections,
      total: total,
      limit: limit,
      page: page,
    },
  });
};

module.exports = {
  fetchCollection,
  getCollection,
  updateCollection,
  getUserCollection,
  getUserCollectionBySlug,
  fetchUserCollection,
};
