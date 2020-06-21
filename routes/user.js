const express = require("express");
const router = express.Router();

const userController = require("./../controllers/user");

router.route("/")
    .get(userController.list);

router.route("/:id")
    .get(userController.getById)
    .delete(userController.remove);

router.route("/:id/review")
    .get(userController.listReviews);

module.exports = router;