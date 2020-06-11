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
        .post((req, res, next) => {
            const mappedUser = map_user_request(req.body);
            db.User.create(mappedUser)
                .then(user => {
                    res.status(400).json({
                        user: user
                    });
                }).catch(err => {
                    return next(err);
                })
        });

    router.route("/login")
        .post((req, res, next) => {
            db.User.findOne({
                    where: {
                        username: req.body.username
                    }
                })
                .then(user => {
                    console.log(user);
                    if (user) {
                        const matched = bcrypt.compareSync(req.body.password, user.password);
                        if (matched) {
                            const token = jwt.sign({
                                id: user.id,
                                username: user.username
                            }, config.app.jwtSecret);
                            res.status(200).json({
                                message: "login successfull",
                                user: user,
                                token: token
                            });
                        } else {
                            res.status(400).json({
                                message: "username or password wrong"
                            });
                        }
                    } else {
                        res.status(400).json({
                            message: "username or password wrong"
                        });
                    }
                })
                .catch(err => {
                    return next(err);
                });
        });


    router.route("/user")
        .get((req, res, next) => {
            db.User.findAll()
                .then(users => {
                    res.status(200).json({
                        users: users
                    });
                })
                .catch(err => next(err));
        })

    router.route("/user/:id")
        .get((req, res, next) => {
            db.User.findByPk(req.params.id)
                .then(user => {
                    if (user) {
                        res.status(200).json({
                            user: user
                        });
                    } else {
                        res.status(404).json({
                            message: "user not found"
                        });
                    }

                })
                .catch(err => next(err));
        })
        .delete((req, res, next) => {
            db.User.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                .then(deleted => {
                    if (deleted) {
                        res.status(200).json({
                            message: "user deleted successfully"
                        });
                    } else {
                        res.status(400).json({
                            message: "user deletion failed"
                        });
                    }
                })
                .catch(err => next(err));
        });

    return router;
}