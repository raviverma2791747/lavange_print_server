const CategoryModel = require("../../models/category");
const CollectionModel = require("../../models/collection");

const getSearchFilters = async (req, res) => {
  const categories = await CategoryModel.find();
  const collections = await CollectionModel.find();

  return res.json({
    status: 200,
    data: {
      categories,
      collections,
      sizes: [
        {
          displayName: "Small",
          value: "small",
        },
        {
          displayName: "Medium",
          value: "medium",
        },
        {
          displayName: "Large",
          value: "large",
        },
      ],
    },
  });
};


module.exports = { getSearchFilters }