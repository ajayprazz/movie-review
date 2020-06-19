const db = require("./../models/");

module.exports = {
    list: async (req, res, next) => {
        try {
            const users = await db.User.findAll();
            res.status(200).json({
                users: users
            });
        } catch (err) {
            next(err);
        }
    },
    getById: async (req, res, next) => {
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
    },
    remove: async (req, res, next) => {
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
    }
}