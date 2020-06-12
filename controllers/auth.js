const express = require("express");
const router = express.Router();

const config = require("./../config");

const db = require("./../config/db");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRound = 10;

function map_user_request(userDetail) {
    let user = {};

    if (userDetail.email) {
        user.email = userDetail.email;
    }
    if (userDetail.username) {
        user.username = userDetail.username;
    }
    if (userDetail.password) {
        user.password = bcrypt.hashSync(userDetail.password, saltRound);
    }
    if (userDetail.firstname) {
        user.firstname = userDetail.firstname;
    }
    if (userDetail.lastname) {
        user.lastname = userDetail.lastname;
    }
    if (userDetail.role) {
        user.role = userDetail.role;
    }

    return user;
}

module.exports = function () {

    router.route("/register")
        .post(async (req, res, next) => {
            const mappedUser = map_user_request(req.body);
            try {
                const user = await db.User.create(mappedUser);
                res.status(400).json({
                    user: user
                });
            } catch (err) {
                next(err);
            }
        });

    router.route("/login")
        .post(async (req, res, next) => {
            try {
                const user = await db.User.findOne({
                    where: {
                        username: req.body.username
                    }
                });

                if (!user) {
                    res.status(401).json({
                        message: "username or password wrong"
                    });
                    return;
                }

                const matched = bcrypt.compareSync(req.body.password, user.password);

                if (!matched) {
                    res.status(401).json({
                        message: "username or password wrong"
                    });
                }
                const token = jwt.sign({
                    id: user.id,
                    username: user.username
                }, config.app.jwtSecret);

                res.status(200).json({
                    message: "login successfull",
                    user: user,
                    token: token
                });
            } catch (err) {
                next(err);
            }
        });


    router.route("/user")
        .get(async (req, res, next) => {
            try {
                const users = await db.User.findAll();
                res.status(200).json({
                    users: users
                });
            } catch (err) {
                next(err);
            }
        });

    router.route("/user/:id")
        .get(async (req, res, next) => {
            try {
                const user = await db.User.findByPk(req.params.id);

                if (!user) {
                    res.status(404).json({
                        message: "user not found"
                    });
                    return;
                }
                res.status(200).json({
                    user: user
                });
            } catch (err) {
                next(err);
            }
        })
        .delete(async (req, res, next) => {
            try {
                const user = await db.User.findByPk(req.params.id);

                if (!user) {
                    res.status(404).json({
                        message: "user not found"
                    });
                    return;
                }

                const deleted = await db.User.destroy({
                    where: {
                        id: req.params.id
                    }
                });

                if (!deleted) {
                    res.status(400).json({
                        message: "user deletion failed"
                    });
                    return;
                }

                res.status(200).json({
                    message: "user deleted successfully"
                });
            } catch (err) {
                next(err);
            }
        });

    return router;
}