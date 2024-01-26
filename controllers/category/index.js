const mongoose = require("mongoose");
const CategoryModel = require("../../models/category");

const fetchCategory = async (req, res) => {
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  const categories = await CategoryModel.find({
    name: {
      $regex: search,
      $options: "i",
    },
  })
    .skip(page * limit)
    .limit(limit);

  return res.json({
    status: 200,
    data: {
      categories,
    },
  });
};

const getCategory = async (req, res) => {
  try {
    const category = await CategoryModel.findById({ _id: req.params.id });
    return res.json({
      status: 200,
      data: {
        category,
      },
    });
  } catch {
    return res.json({
      status: 500,
      data: {},
    });
  }
};

const updateCategory = async (req, res) => {
  const _id = req.body._id ?? new mongoose.Types.ObjectId();
  const category = await CategoryModel.updateOne(
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
      category: {
        id: _id,
      },
    },
  });
};

module.exports = { fetchCategory, getCategory, updateCategory };
