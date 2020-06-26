const express = require("express");
const router = express.Router();

const movieController = require("./../controllers/movie");

const authorization = require("./../middlewares/authorization");

const upload = require("./../config/multer");

router.route("/")
    .get(authorization, movieController.list)
    .post(upload.single("poster"), authorization, movieController.add);

router.route("/:id")
    .get(movieController.getById)
    .put(upload.single("poster"), authorization, movieController.update)
    .delete(authorization, movieController.remove);

router.route("/:id/review")
    .get(movieController.listReviews);

router.route(":/id/genre")
    .get(movieController.listGenres);

module.exports = router;