const mongoose = require("mongoose");
const { HomeConfigModel } = require("../../models/config");
const { STATUS } = require("../../helper/constants");

const getHomeConfig = async (req, res) => {
  const homeConfig = await HomeConfigModel.findOne();
  return res.json({
    status: 200,
    data: {
      homeConfig,
    },
  });
};

const updateHomeConfig = async (req, res) => {
  const homeConfigId = req.body._id ?? new mongoose.Types.ObjectId();
  const homeConfig = await HomeConfigModel.updateOne(
    {
      _id: homeConfigId,
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
      homeConfig: {
        id: homeConfigId,
      },
    },
  });
};

const getUserHomeConfig = async (req, res) => {
  const productPopulateOptions = (name) => {
    return {
      path: name,
      populate: {
        path: "assets",
        select: "_id url title",
      },
      select:
        "_id status url title slug price variants variantSchema assets price compareAtPrice",
      match: { status: STATUS.ACTIVE },
    };
  };
  let homeConfig = await HomeConfigModel.findOne()
    .populate("featuredCategories")
    .populate({
      path: "featuredAnnouncements",
      populate: {
        path: "asset",
        select: "_id url title",
      },
      match: { status: STATUS.ACTIVE },
    })
    .populate(productPopulateOptions("exploreProducts"))
    .populate({
      path: "exploreCollections",
      populate: {
        path: "asset",
        select: "_id url title",
      },
      match: { status: STATUS.ACTIVE },
    })
    .populate(productPopulateOptions("bestSellerProducts"))
    .populate(productPopulateOptions("newArrivalProducts"))
    .populate({
      path: "featuredCollections",
      match: { status: STATUS.ACTIVE },
      populate: {
        path: "products",
        populate: {
          path: "assets",
          select: "_id url title",
        },
        match: { status: STATUS.ACTIVE },
      },
    })
    .lean({ virtuals: true });

  return res.json({
    status: 200,
    data: {
      homeConfig: homeConfig,
    },
  });
};

module.exports = {
  getHomeConfig,
  updateHomeConfig,
  getUserHomeConfig,
};
