const express = require("express");
const router = express.Router();

const db = require("./../config/db");

function map_review_request(reviewDetail) {
    let review = {};

    if (reviewDetail.userId) {
        review.userId = reviewDetail.userId;
    }
    if (reviewDetail.movieId) {
        review.movieId = reviewDetail.movieId;
    }
    if (reviewDetail.rating) {
        review.rating = reviewDetail.rating;
    }
    if (reviewDetail.review) {
        review.review = reviewDetail.review;
    }

    return review;
}

module.exports = () => {
    router.route("/")
        .post((req, res, next) => {
            const mappedReview = map_review_request(req.body);
            db.Review.create(mappedReview)
                .then(review => {
                    res.status(200).json({
                        review: review
                    });
                })
                .catch(err => next(err));
        });

    router.route("/:id")
        .get(async (req, res, next) => {
            try {
                const review = await db.Review.findByPk(req.params.id);
                if (!review) {
                    res.status(404).json({
                        message: "review not found"
                    });
                    return;
                }
                res.status(200).json({
                    review: review
                });
            } catch (err) {
                next(err);
            }
        })
        .put(async (req, res, next) => {
            try {
                const review = await db.Review.findByPk(req.params.id);
                if (!review) {
                    res.status(404).json({
                        message: "review not found"
                    });
                    return
                }
                const mappedReview = map_review_request(req.body);
                const affectedRow = await db.Review.update(mappedReview, {
                    where: {
                        id: review.id
                    }
                });
                if (affectedRow == 0) {
                    res.status(400).json({
                        message: "review update failed"
                    });
                    return;
                }
                const updatedReview = db.Review.findByPk(review.id);
                res.status(200).json({
                    review: updatedReview,
                    message: "review updated successfullt"
                });
            } catch (err) {
                next(err);
            };
        });

    return router;
}