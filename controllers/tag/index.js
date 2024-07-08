const mongoose = require("mongoose");
const TagModel = require("../../models/tag");

const fetchTag = async (req, res) => {
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

  const tags = await TagModel.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean({ virtuals: true });

  const total = await TagModel.find(filter).countDocuments();

  return res.json({
    status: 200,
    data: {
      tags,
      total: total,
      limit: limit,
      page: page,
    },
  });
};

const getTag = async (req, res) => {
  const tagId = req.params.id;
  const tag = await TagModel.findById(tagId);
  return res.json({
    status: 200,
    data: {
      tag,
    },
  });
};

const updateTag = async (req, res) => {
  const tagId = req.body._id ?? new mongoose.Types.ObjectId();
  const data = req.body;

  const tag = await TagModel.updateOne(
    {
      _id: tagId,
    },
    data,
    {
      upsert: true,
      new: true,
    }
  );

  return res.json({
    status: 200,
    data: {
      tag: {
        id: tagId,
      },
    },
  });
};

module.exports = { fetchTag, getTag, updateTag };
