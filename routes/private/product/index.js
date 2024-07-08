const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../middlewares/validate");
const authenticate = require("../../../middlewares/authenticate");
const admin = require("../../../middlewares/admin");
const productSchema = require("../../../validators/product");
const {
  fetchProduct,
  getProduct,
  updateProduct,
} = require("../../../controllers/product");

const router = express.Router();

router.get("/", authenticate, admin, asyncHandler(fetchProduct));
router.get("/:id", authenticate, admin, asyncHandler(getProduct));
router.post(
  "/",
  authenticate,
  admin,
  validate(productSchema),
  asyncHandler(updateProduct)
);

module.exports = router;
