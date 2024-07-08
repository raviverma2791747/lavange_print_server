const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../middlewares/validate");
const authenticate = require("../../../middlewares/authenticate");
const admin = require("../../../middlewares/admin");
const tagSchema = require("../../../validators/tag");
const { fetchTag, getTag, updateTag } = require("../../../controllers/tag");

const router = express.Router();

router.get("/", authenticate, admin, asyncHandler(fetchTag));
router.get("/:id", authenticate, admin, asyncHandler(getTag));
router.post(
  "/",
  authenticate,
  admin,
  validate(tagSchema),
  asyncHandler(updateTag)
);

module.exports = router;
