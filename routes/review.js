const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/authenticate");

const reviewController = require("./../controllers/review");

router.route("/")
    .post(authenticate, reviewController.add);

router.route("/:id")
    .get(authenticate, reviewController.getById)
    .put(authenticate, reviewController.update)
    .delete(authenticate, reviewController.remove);

module.exports = router;