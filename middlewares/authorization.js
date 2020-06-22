module.exports = (req, res, next) => {
    if (req.loggedInUser.role == 1) {
        return next();
    } else {
        res.status(403).json({
            message: "you are not authorized"
        });
    }
}