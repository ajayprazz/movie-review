const express = require("express");
const router = express.Router();

const userController = require("./../controllers/user");

const authenticate = require("./../middlewares/authenticate");
const authorization = require("./../middlewares/authorization");

router.route("/")
    .get(authenticate, userController.list);

router.route("/:id")
    .get(authenticate, userController.getById)
    .delete(authenticate, userController.remove);

module.exports = router;