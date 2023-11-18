const multer = require("multer");
const sharp = require("sharp");

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

exports.photoConfig = (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `photo-${req.user._id}-${Date.now()}.jpeg`;

    sharp(req.file.buffer).toFormat("jpeg").toFile(`public/photos/${req.file.filename}`);
    next();
};

exports.usersPhotoConfig = (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

    sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/users/${req.file.filename}`);
    next();
};
