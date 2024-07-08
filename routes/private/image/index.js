const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../middlewares/validate");
const authenticate = require("../../../middlewares/authenticate");
const admin = require("../../../middlewares/admin");
const { upload } = require("../../../config/multerConfig");
const {
  updateImage,
  getImage,
  fetchImage,
  createImage,
  deleteImage,
} = require("../../../controllers/image");

const router = express.Router();

router.post(
  "/upload",
  authenticate,
  admin,
  upload.single("img"),
  asyncHandler(createImage)
);
router.post("/", authenticate, admin, asyncHandler(updateImage));
router.get("/:id", authenticate, admin, asyncHandler(getImage));
router.get("/", authenticate, admin, asyncHandler(fetchImage));
router.delete("/:id", authenticate, admin, asyncHandler(deleteImage));

module.exports = router;
