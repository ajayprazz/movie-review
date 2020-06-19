const express = require("express");
const router = express.Router();

const reviewController = require("./../controllers/review");

router.route("/")
    .post(reviewController.add);

router.route("/:id")
    .get(reviewController.getById)
    .put(reviewController.update)
    .delete(reviewController.remove);

module.exports = router;