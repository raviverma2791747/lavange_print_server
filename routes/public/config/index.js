const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../middlewares/validate");
const authenticate = require("../../../middlewares/authenticate");
const admin = require("../../../middlewares/admin");

const helpConfigRouter = require("./helpConfig");
const homeConfigRouter = require("./homeConfig");
const policyConfigRouter = require("./policyConfig");

const router = express.Router();

router.use("/help", helpConfigRouter);
router.use("/home", homeConfigRouter);
router.use("/policy", policyConfigRouter);

module.exports = router;
