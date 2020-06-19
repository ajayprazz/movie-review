const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/authenticate");

const authRoute = require("./auth");
const userRoute = require("./user");
const movieRoute = require("./movie");
const reviewRoute = require("./review");
const genreRoute = require("./genre");

router.use("/auth", authRoute);
//apply middleware for all remaining routes
router.use(authenticate);
router.use("/user", userRoute);
router.use("/movie", movieRoute);
router.use("/review", reviewRoute);
router.use("/genre", genreRoute);

module.exports = router;