const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../middlewares/validate");
const authenticate = require("../../../middlewares/authenticate");
const admin = require("../../../middlewares/admin");
const {
  fetchUserCategory,
  getUserCategory,
  getUserCategoryBySlug,
} = require("../../../controllers/category");

const router = express.Router();

router.get("/", asyncHandler(fetchUserCategory));
router.get("/:id", asyncHandler(getUserCategory));
router.get("/slug/:slug", asyncHandler(getUserCategoryBySlug));

module.exports = router;
