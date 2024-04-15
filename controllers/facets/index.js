const FacetModel = require("../../models/facet");
const mongoose = require("mongoose");

const updateFacet = async (req, res, next) => {
  const _id = req.body._id ?? new mongoose.Types.ObjectId();
  const facet = await FacetModel.updateOne({ _id }, req.body, {
    upsert: true,
    new: true,
  });
  return res.json({
    status: 200,
    data: {
      facet: {
        id: _id,
      },
    },
  });
};

const getFacet = async (req, res, next) => {
  const facet = await FacetModel.findById(req.params.id);
  return res.json({
    status: 200,
    data: {
      facet,
    },
  });
};

const fetchFacet = async (req, res, next) => {
  const facets = await FacetModel.find();
  return res.json({
    status: 200,
    data: {
      facets,
    },
  });
};

module.exports = { fetchFacet, getFacet, updateFacet };
