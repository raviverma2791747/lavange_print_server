const mongoose = require("mongoose");
const TagModel = require("../../models/tag");

const fetchTag = async (req, res) => {
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  const tags = await TagModel.find({
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
      tags,
    },
  });
};

const getTag = async (req, res) => {
  try {
    const tag = await TagModel.findById({ _id: req.params.id });
    return res.json({
      status: 200,
      data: {
        tag,
      },
    });
  } catch {
    return res.json({
      status: 500,
      data: {},
    });
  }
};

const updateTag = async (req, res) => {
  const _id = req.body._id ?? new mongoose.Types.ObjectId();

  const tag = await TagModel.updateOne(
    {
      _id,
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
      tag: {
        _id,
      },
    },
  });
};

module.exports = { fetchTag, getTag, updateTag };
