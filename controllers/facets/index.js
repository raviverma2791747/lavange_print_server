const FacetModel = require("../../models/facet");
const mongoose = require("mongoose");

const updateFacet = async (req, res, next) => {
  const facetId = req.body._id ?? new mongoose.Types.ObjectId();
  const payload = req.body;
  const facet = await FacetModel.updateOne({ _id: facetId }, payload, {
    upsert: true,
    new: true,
  });
  return res.json({
    status: 200,
    data: {
      facet: {
        id: facetId,
      },
    },
  });
};

const getFacet = async (req, res) => {
  const facetId = req.params.id;
  const facet = await FacetModel.findById(facetId);
  return res.json({
    status: 200,
    data: {
      facet,
    },
  });
};

const fetchFacet = async (req, res) => {
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

  const facets = await FacetModel.find()
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean({ virtuals: true });

  const total = await FacetModel.find(filter).countDocuments();
  return res.json({
    status: 200,
    data: {
      facets,
      total: total,
      limit: limit,
      page: page,
    },
  });
};

module.exports = { fetchFacet, getFacet, updateFacet };
