const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../middlewares/validate");
const authenticate = require("../../../middlewares/authenticate");
const admin = require("../../../middlewares/admin");
const categorySchema = require("../../../validators/category");
const {
  fetchCategory,
  getCategory,
  updateCategory,
} = require("../../../controllers/category");

const router = express.Router();

router.get("/", authenticate, admin, asyncHandler(fetchCategory));
router.get("/:id", authenticate, admin, asyncHandler(getCategory));
router.post(
  "/",
  authenticate,
  admin,
  validate(categorySchema),
  asyncHandler(updateCategory)
);

module.exports = router;
