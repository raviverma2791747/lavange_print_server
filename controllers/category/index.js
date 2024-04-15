const mongoose = require("mongoose");
const CategoryModel = require("../../models/category");
const { STATUS } = require("../../helper/constants");

const fetchCategory = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req, res, next) => {
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

const updateCategory = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

const getUserCategory = async (req, res, next) => {
  try {
    let category = await CategoryModel.findById({
      _id: req.params.id,
    })
      .populate({
        path: "products",
        populate: {
          path: "assets",
          select: "_id url title",
        },
        match: { status: STATUS.ACTIVE },
      })
      .lean({
        virtuals: true,
      });

    return res.json({
      status: 200,
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserCategorySlug = async (req, res, next) => {
  try {
    let category = await CategoryModel.findOne({ slug: req.params.slug })
      .populate({
        path: "products",
        match: { status: STATUS.ACTIVE },
        populate: {
          path: "assets",
          select: "_id url title",
        },
      })
      .lean({
        virtuals: true,
      });

    return res.json({
      status: 200,
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

const fetchUserCategory = async (req, res, next) => {
  try {
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
      .limit(limit)
      .populate({
        path: "asset",
        select: "_id url title",
      })
      .lean({ virtuals: true });

    return res.json({
      status: 200,
      data: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchCategory,
  getCategory,
  updateCategory,
  getUserCategory,
  getUserCategorySlug,
  fetchUserCategory,
};
