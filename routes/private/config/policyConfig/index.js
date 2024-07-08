const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../../middlewares/validate");
const authenticate = require("../../../../middlewares/authenticate");
const admin = require("../../../../middlewares/admin");
const {
  getPolicyConfig,
  updatePolicyConfig,
} = require("../../../../controllers/policyConfig");
const router = express.Router();

router.get("/:name", authenticate, admin, asyncHandler(getPolicyConfig));
router.post("/", authenticate, admin, asyncHandler(updatePolicyConfig));

module.exports = router;
