const config = require("./../config");

const db = require("./../models/");

const jwt = require("jsonwebtoken");

function map_user_request(userDetail) {
    let user = {};

    if (userDetail.email) {
        user.email = userDetail.email;
    }
    if (userDetail.username) {
        user.username = userDetail.username;
    }
    if (userDetail.password) {
        user.password = userDetail.password;
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

module.exports = {

    register: async (req, res, next) => {
        const mappedUser = map_user_request(req.body);
        try {
            const user = await db.User.create(mappedUser);
            res.status(400).json({
                user: user
            });
        } catch (err) {
            next(err);
        }
    },

    login: async (req, res, next) => {
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

            if (user.comparePassword(req.body.password)) {
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
                res.status(401).json({
                    message: "username or password wrong"
                });
            }
        } catch (err) {
            next(err);
        }
    }
}