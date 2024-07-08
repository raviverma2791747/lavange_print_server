const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../../middlewares/validate");
const authenticate = require("../../../../middlewares/authenticate");
const admin = require("../../../../middlewares/admin");
const {
  getServerConfig,
  updateServerConfig,
} = require("../../../../controllers/serverConfig");
const router = express.Router();

router.get(
  "/",
  authenticate,
  admin,
  asyncHandler(getServerConfig)
);
router.post(
  "/",
  authenticate,
  admin,
  asyncHandler(updateServerConfig)
);

module.exports = router;
