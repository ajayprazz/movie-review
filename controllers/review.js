const db = require("./../models/");

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

module.exports = {
    add: async (req, res, next) => {
        const mappedReview = map_review_request(req.body);
        try {
            const review = await db.Review.create(mappedReview);
            res.status(200).json({
                review: review
            });
        } catch (err) {
            next(err);
        }
    },

    getById: async (req, res, next) => {
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
    },

    update: async (req, res, next) => {
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
            const updatedReview = await db.Review.findByPk(review.id);
            res.status(200).json({
                review: updatedReview,
                message: "review updated successfully"
            });
        } catch (err) {
            next(err);
        };
    },

    remove: async (req, res, next) => {
        try {
            const review = await db.Review.findByPk(req.params.id);

            if (!review) {
                res.status(404).json({
                    message: "review not found"
                });
                return;
            }

            const deleted = await db.Review.destroy({
                where: {
                    id: review.id
                }
            });

            if (!deleted) {
                res.status(400).json({
                    message: "review deletion failed"
                });
                return
            }
            res.status(200).json({
                message: "review deletion successfull"
            });
        } catch (err) {
            next(err);
        }
    }
}