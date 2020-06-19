const multer = require("multer");

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

module.exports = upload;