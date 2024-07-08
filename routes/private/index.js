const express = require("express");
const authenticate = require("../../middlewares/authenticate");
const admin = require("../../middlewares/admin");
const asyncHandler = require("express-async-handler");

const { getStats } = require("../../controllers/stat");

const announcementRouter = require("./announcement");
const productRouter = require("./product");
const imageRouter = require("./image");
const userRouter = require("./user");
const tagRouter = require("./tag");
const categoryRouter = require("./category");
const checkoutRouter = require("./checkout");
const collectionRouter = require("./collection");
const couponRouter = require("./coupon");
const facetRouter = require("./facet");
const configRouter = require("./config");
const orderRouter = require("./order");
const rightRouter = require("./right");
const roleRouter = require("./role");

const router = express.Router();

router.use("/announcement", announcementRouter);
router.use("/product", productRouter);
router.use("/image", imageRouter);
router.use("/user", userRouter);
router.use("/tag", tagRouter);
router.use("/category", categoryRouter);
router.use("/checkout", checkoutRouter);
router.use("/collection", collectionRouter);
router.use("/coupon", couponRouter);
router.use("/facet", facetRouter);
router.use("/config", configRouter);
router.use("/order", orderRouter);
router.use("/right", rightRouter);
router.use("/role", roleRouter);

router.get("/stats", authenticate, admin, asyncHandler(getStats));

module.exports = router;
