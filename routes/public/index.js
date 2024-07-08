const express = require("express");

const configRouter = require("./config");
const collectionRouter = require("./collection");
const productRouter = require("./product");
const userRouter = require("./user");
const categoryRouter = require("./category");
const orderRouter = require("./order");
const filterRouter = require("./filter");

const router = express.Router();

router.use("/config", configRouter);
router.use("/collection", collectionRouter);
router.use("/product", productRouter);
router.use("/user", userRouter);
router.use("/category", categoryRouter);
router.use("/order", orderRouter);
router.use("/filters", filterRouter);

module.exports = router;
