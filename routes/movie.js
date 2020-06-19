const express = require("express");
const router = express.Router();

const movieController = require("./../controllers/movie");

const authorization = require("./../middlewares/authorization");
const authenticate = require("../middlewares/authenticate");

const upload = require("./../config/multer");

router.route("/")
    .get(authenticate, authorization, movieController.list)
    .post(authenticate, upload.single("poster"), authorization, movieController.add);

router.route("/:id")
    .get(authenticate, movieController.getById)
    .put(authenticate, upload.single("poster"), authorization, movieController.update)
    .delete(authenticate, authorization, movieController.remove);

router.route("/:id/review")
    .get(authenticate, movieController.listReviews);

module.exports = router;