const express = require('express');
const router = express.Router();

const db = require("./../config/db");
const authorization = require('../middlewares/authorization');

module.exports = () => {

    router.route("/")
        .get(async (req, res, next) => {
            try {
                const genres = await db.Genre.findAll();
                res.status(200).json(genres);
            } catch (err) {
                next(err);
            }
        })
        .post(async (req, res, next) => {
            try {
                const genre = await db.Genre.create({
                    name: req.body.name
                });

                res.status(200).json(genre);
            } catch (err) {
                next(err);
            }
        })

    router.route("/:id")
        .get(async (req, res, next) => {
            try {
                const genre = await db.Genre.findByPk(req.params.id);

                if (!genre) {
                    res.status(404).json({
                        message: "genre not found"
                    });
                    return;
                }

                res.status(200).json(genre);
            } catch (err) {
                next(err);
            }
        })
        .delete(authorization, async (req, res, next) => {
            try {
                const genre = await db.Genre.findByPk(req.params.id);

                if (!genre) {
                    res.status(404).json({
                        message: "genre not found"
                    });
                    return;
                }

                const deleted = await db.Genre.destroy({
                    where: {
                        id: genre.id
                    }
                });

                if (!deleted) {
                    res.status(400).json({
                        message: "genre deletion failed"
                    });
                    return;
                }

                res.status(200).json({
                    message: "movie deleted successfully"
                });
            } catch (err) {
                next(err);
            }
        });

    return router;
}