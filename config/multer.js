const multer = require("multer");
let folderPath = "";
if (process.env.NODE_ENV == 'test') {
    folderPath = "./uploads/test";
} else {
    folderPath = "./uploads/images";
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, folderPath);
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