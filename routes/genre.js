const express = require("express");
const router = express.Router();

const genreController = require("./../controllers/genre");

const authorization = require("../middlewares/authorization");

router.route("/")
    .get(genreController.list)
    .post(genreController.add);

router.route("/:id")
    .get(genreController.getById)
    .delete(authorization, genreController.remove);

router.route("/:id/movie")
    .get(genreController.listMovies);

module.exports = router;