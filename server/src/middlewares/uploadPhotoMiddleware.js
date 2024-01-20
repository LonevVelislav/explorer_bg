const multer = require("multer");

exports.uploadPhoto = () => {
    //multer options
    const multerStorage = multer.memoryStorage();

    const multerFilter = (req, file, cb) => {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        } else {
            cb(new Error("Not an image, upload only images!"), false);
        }
    };

    //middleware

    const uploadPhotoMiddleware = multer({
        storage: multerStorage,
        fileFilter: multerFilter,
    }).single("image");

    return uploadPhotoMiddleware;
};
