const express = require("express");
const router = express.Router();

const genreController = require("./../controllers/genre");
const authenticate = require("../middlewares/authenticate");
const authorization = require("../middlewares/authorization");

router.route("/")
    .get(authenticate, genreController.list)
    .post(authenticate, genreController.add);

router.route("/:id")
    .get(authenticate, genreController.getById)
    .delete(authenticate, authorization, genreController.remove);

router.route("/:id/movie")
    .get(authenticate, genreController.listMovies);

module.exports = router;