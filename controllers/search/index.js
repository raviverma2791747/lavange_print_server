const CategoryModel = require("../../models/category");
const CollectionModel = require("../../models/collection");
const FacetModel = require("../../models/facet");
const { STATUS } = require("../../helper/constants");

const getSearchFilters = async (req, res, next) => {
  try {
    const categories = await CategoryModel.find({ status: STATUS.ACTIVE });
    const collections = await CollectionModel.find({ status: STATUS.ACTIVE });
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
