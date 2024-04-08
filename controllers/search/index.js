const CategoryModel = require("../../models/category");
const CollectionModel = require("../../models/collection");
const FacetModel = require("../../models/facet");

const getSearchFilters = async (req, res, next) => {
  try {
    const categories = await CategoryModel.find({ status: "active" });
    const collections = await CollectionModel.find({ status: "active" });
    const facets = await FacetModel.find();

    return res.json({
      status: 200,
      data: {
        categories,
        collections,
        facets,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSearchFilters };
