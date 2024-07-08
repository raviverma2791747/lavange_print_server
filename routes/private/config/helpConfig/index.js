const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../../middlewares/validate");
const authenticate = require("../../../../middlewares/authenticate");
const admin = require("../../../../middlewares/admin");
const { updateHelpConfig } = require("../../../../controllers/helpConfig");

const router = express.Router();

router.post("/", asyncHandler(updateHelpConfig));

module.exports = router;
