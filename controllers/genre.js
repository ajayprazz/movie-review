const db = require("./../models/");

module.exports = {

    list: async (req, res, next) => {
        try {
            const genres = await db.Genre.findAll();
            res.status(200).json({
                genres: genres
            });
        } catch (err) {
            next(err);
        }
    },

    add: async (req, res, next) => {
        try {
            const genre = await db.Genre.create({
                name: req.body.name
            });

            res.status(200).json({
                genre: genre
            });
        } catch (err) {
            next(err);
        }
    },

    getById: async (req, res, next) => {
        try {
            const genre = await db.Genre.findByPk(req.params.id);

            if (!genre) {
                res.status(404).json({
                    message: "genre not found"
                });
                return;
            }

            res.status(200).json({
                genre: genre
            });
        } catch (err) {
            next(err);
        }
    },

    remove: async (req, res, next) => {
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
                message: "genre deleted successfully"
            });
        } catch (err) {
            next(err);
        }
    },

    listMovies: async (req, res, next) => {
        try {
            const genre = await db.Genre.findByPk(req.params.id);

            if (!genre) {
                res.status(404).json({
                    message: "genre not found"
                });
                return;
            }

            const genreMovies = await db.MovieGenre.findAll({
                attributes: ['movieId'],
                where: {
                    genreId: genre.id
                }
            });

            res.status(200).json({
                movies: genreMovies
            });
        } catch (err) {
            next(err);
        }
    }
}