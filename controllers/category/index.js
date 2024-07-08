const mongoose = require("mongoose");
const CategoryModel = require("../../models/category");
const { STATUS } = require("../../helper/constants");

const fetchCategory = async (req, res) => {
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

  const categories = await CategoryModel.find(filter)
    .populate({
      path: "asset",
      select: "_id url title",
    })
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean({ virtuals: true });

  const total = await CategoryModel.find(filter).countDocuments();

  return res.json({
    status: 200,
    data: {
      categories: categories,
      total: total,
      limit: limit,
      page: page,
    },
  });
};

const getCategory = async (req, res) => {
  const categoryId = req.params.id;
  const category = await CategoryModel.findById(categoryId);
  return res.json({
    status: 200,
    data: {
      category,
    },
  });
};

const updateCategory = async (req, res) => {
  const categoryId = req.body._id ?? new mongoose.Types.ObjectId();
  const category = await CategoryModel.updateOne(
    {
      _id: categoryId,
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
      category: {
        id: categoryId,
      },
    },
  });
};

const getUserCategory = async (req, res) => {
  const categoryId = req.params.id;
  const category = await CategoryModel.findById(categoryId)
    .populate({
      path: "products",
      populate: {
        path: "assets",
        select: "_id url title",
      },
      select:
        "_id status url title slug price variants variantSchema assets price compareAtPrice",
      match: { status: STATUS.ACTIVE },
    })
    .lean({
      virtuals: true,
    });

  return res.json({
    status: 200,
    data: {
      category,
    },
  });
};

const getUserCategoryBySlug = async (req, res) => {
  const slug = req.params.slug;
  const category = await CategoryModel.findOne({ slug: slug })
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
      category,
    },
  });
};

const fetchUserCategory = async (req, res, next) => {
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

  const categories = await CategoryModel.find(filter)
    .populate({
      path: "asset",
      select: "_id url title",
    })
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean({ virtuals: true });

  const total = await CategoryModel.find(filter).countDocuments();

  return res.json({
    status: 200,
    data: {
      categories: categories,
      total: total,
      limit: limit,
      page: page,
    },
  });
};

module.exports = {
  fetchCategory,
  getCategory,
  updateCategory,
  getUserCategory,
  getUserCategoryBySlug,
  fetchUserCategory,
};
