const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../../middlewares/validate");
const authenticate = require("../../../../middlewares/authenticate");
const admin = require("../../../../middlewares/admin");
const {
  getHomeConfig,
  updateHomeConfig,
} = require("../../../../controllers/homeConfig");

const router = express.Router();

router.get("/", authenticate, authenticate, admin, getHomeConfig);
router.post("/", authenticate, admin, asyncHandler(updateHomeConfig));

module.exports = router;
