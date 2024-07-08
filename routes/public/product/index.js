const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../middlewares/validate");
const authenticate = require("../../../middlewares/authenticate");
const admin = require("../../../middlewares/admin");
const {
  getUserProductBySlug,
  fetchUserProduct,
} = require("../../../controllers/product");

const router = express.Router();

router.get("/:slug", asyncHandler(getUserProductBySlug));
router.get("/", asyncHandler(fetchUserProduct));

module.exports = router;
