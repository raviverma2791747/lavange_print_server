const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../middlewares/validate");
const authenticate = require("../../../middlewares/authenticate");
const admin = require("../../../middlewares/admin");
const collectionSchema = require("../../../validators/collection");
const {
  fetchCollection,
  getCollection,
  updateCollection,
} = require("../../../controllers/collection");

const router = express.Router();

router.get("/", authenticate, admin, asyncHandler(fetchCollection));
router.get("/:id", authenticate, admin, asyncHandler(getCollection));
router.post(
  "/",
  authenticate,
  admin,
  validate(collectionSchema),
  asyncHandler(updateCollection)
);

module.exports = router;
