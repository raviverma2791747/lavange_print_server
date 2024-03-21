const mongoose = require("mongoose");
const { HomeConfigModel } = require("../../models/config");
const dotenv = require("dotenv");
const { assetUrl } = require("../../helper/utils");

dotenv.config();

// const fetchHomeConfig = async (req,  res, next) => {
//   const homeConfigs = await HomeConfigModel.find();

//   return res.json({
//     status: 200,
//     data: {
//       homeConfigs,
//     },
//   });
// };

const getHomeConfig = async (req, res, next) => {
  try {
    const homeConfig = await HomeConfigModel.findOne();
    return res.json({
      status: 200,
      data: {
        homeConfig,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateHomeConfig = async (req, res, next) => {
  try {
    const _id = req.body._id ?? new mongoose.Types.ObjectId();
    const homeConfig = await HomeConfigModel.updateOne(
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
        homeConfig: {
          id: _id,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getHomeConfigPublic = async (req, res, next) => {
  try {
    let homeConfig = await HomeConfigModel.findOne()
      .populate("featuredCategories")
      .populate({
        path: "featuredAnnouncements",
        populate: {
          path: "asset",
          select: "_id url title",
        },
        match: { status: "active" },
      })
      .populate({
        path: "exploreProducts",
        populate: {
          path: "assets",
          select: "_id url title",
        },
        match: { status: "active" },
      })
      .populate({
        path: "exploreCollections",
        populate: {
          path: "asset",
          select: "_id url title",
        },
        match: { status: "active" },
      })
      .populate({
        path: "bestSellerProducts",
        populate: {
          path: "assets",
          select: "_id url title",
        },
        match: { status: "active" },
      })
      .populate({
        path: "newArrivalProducts",
        populate: {
          path: "assets",
          select: "_id url title",
        },
        match: { status: "active" },
      })
      .populate({
        path: "featuredCollections",
        match: { status: "active" },
        populate: {
          path: "products",
          populate: {
            path: "assets",
            select: "_id url title",
          },

          match: { status: "active" },
        },
      })
      .lean({ virtuals: true });

    return res.json({
      status: 200,
      data: {
        homeConfig: homeConfig,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  //fetchHomeConfig,
  getHomeConfig,
  updateHomeConfig,
  getHomeConfigPublic,
};
