const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../middlewares/validate");
const authenticate = require("../../../middlewares/authenticate");
const admin = require("../../../middlewares/admin");
const {
  fetchUserCollection,
  getUserCollection,
  getUserCollectionBySlug,
} = require("../../../controllers/collection");

const router = express.Router();

router.get("/", asyncHandler(fetchUserCollection));
router.get("/:id", asyncHandler(getUserCollection));
router.get("/slug/:slug", asyncHandler(getUserCollectionBySlug));

module.exports = router;
