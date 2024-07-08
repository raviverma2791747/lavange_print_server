const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../../middlewares/validate");
const authenticate = require("../../../../middlewares/authenticate");
const admin = require("../../../../middlewares/admin");
const { fetchPolicyConfig } = require("../../../../controllers/policyConfig");
const router = express.Router();

router.get("/", asyncHandler(fetchPolicyConfig));

module.exports = router;
