const jwt = require("jsonwebtoken");
const config = require("./../config");
const db = require("./../models/");

module.exports = (req, res, next) => {
    let token;
    if (req.headers.token) {
        token = req.headers.token;
    }

    if (token) {
        jwt.verify(token, config.app.jwtSecret, (err, decoded) => {
            if (err) return next(err);

            if (decoded) {
                db.User.findOne({
                        where: {
                            id: decoded.id
                        }
                    })
                    .then(user => {
                        if (user) {
                            req.loggedInUser = user;
                            next();
                        } else {
                            res.status(204).json({
                                message: "user not found"
                            });
                        }
                    })
                    .catch(err => next(err));
            } else {
                res.status(400).json({
                    message: "token verification failed"
                });
            }
        });

    } else {
        res.status(400).json({
            message: "token not provided"
        });
    }
}