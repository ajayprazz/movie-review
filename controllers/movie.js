const express = require("express");
const router = express.Router();

const multer = require("multer");

const Movie = require("./../models/movie");
const Review = require("./../models/review");

const authorization = require("./../middlewares/authorization");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const image = file.mimetype.split("/")[0];
    if (image != "image") {
      return cb("Use valid image format");
    }

    cb(null, true);
  },
});

function map_movie_request(movieDetails) {
  let movie = {};
  if (movieDetails.title) {
    movie.title = movieDetails.title;
  }
  if (movieDetails.duration) {
    movie.duration = movieDetails.duration;
  }
  if (movieDetails.releasedDate) {
    movie.releasedDate = movieDetails.releasedDate;
  }
  if (movieDetails.description) {
    movie.description = movieDetails.description;
  }
  if (movieDetails.poster) {
    movie.poster = movieDetails.poster;
  }
  if (movieDetails.wikiLink) {
    movie.wikiLink = movieDetails.wikiLink;
  }

  return movie;
}

module.exports = () => {
  router
    .route("/")
    .get(authorization, (req, res, next) => {
      Movie.findAll()
        .then((movies) => {
          res.status(200).json({
            message: "movies list retreived",
            movies: movies,
          });
        })
        .catch((err) => next(err));
    })
    .post(authorization, upload.single("poster"), (req, res, next) => {
      if (req.file) {
        req.body.poster = req.file.filename;
        const mappedMovie = map_movie_request(req.body);
        console.log(mappedMovie);
        Movie.create(mappedMovie)
          .then((movie) => {
            res.status(200).json({
              movie: movie,
              message: "movie inserted successfully",
            });
          })
          .catch((err) => next(err));
      } else {
        res.status(400).json({
          message: "poster required",
        });
      }
    });

  router
    .route("/:id")
    .get((req, res, next) => {
      Movie.findByPk(req.params.id)
        .then((movie) => {
          if (movie) {
            res.status(200).json({
              movie: movie,
            });
          } else {
            res.status(404).json({
              message: "movie not found",
            });
          }
        })
        .catch((err) => next(err));
    })
    .put(authorization, upload.single("poster"), (req, res, next) => {
      Movie.findByPk(req.params.id)
        .then((movie) => {
          if (req.file) {
            req.body.poster = req.file.filename;
          }
          const mappedMovie = map_movie_request(req.body);
          Movie.update(mappedMovie, {
            where: {
              id: movie.id,
            },
          })
            .then((rowAffected) => {
              if (rowAffected > 0) {
                Movie.findOne({
                  where: {
                    id: movie.id,
                  },
                })
                  .then((movie) => {
                    res.status(200).json({
                      movie: movie,
                    });
                  })
                  .catch((err) => next(err));
              } else {
                res.status(400).json({
                  message: "update failed",
                });
              }
            })
            .catch((err) => next(err));
        })
        .catch((err) => next(err));
    })
    .delete(authorization, (req, res, next) => {
      Movie.destroy({
        where: {
          id: req.params.id,
        },
      })
        .then((deleted) => {
          if (deleted) {
            res.status(200).json({
              message: "movie deletion successfull",
            });
          } else {
            res.status(400).json({
              message: "movie deletion failed",
            });
          }
        })
        .catch((err) => next(err));
    });

  return router;
};
