const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../middlewares/validate");
const authenticate = require("../../../middlewares/authenticate");
const admin = require("../../../middlewares/admin");
const { fetchConfig } = require("../../../controllers/config");

const helpConfigRouter = require("./helpConfig");
const homeConfigRouter = require("./homeConfig");
const policyConfigRouter = require("./policyConfig");
const serverConfigRouter = require("./serverConfig");

const router = express.Router();

router.get("/", authenticate, admin, fetchConfig);
router.use("/help", helpConfigRouter);
router.use("/home", homeConfigRouter);
router.use("/policy", policyConfigRouter);
router.use("/server", serverConfigRouter);

module.exports = router;
