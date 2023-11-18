exports.getTopPhoto = (req, res, next) => {
    req.query.sort = "-likes,-createdAt";
    req.query.page = "1";
    req.query.limit = "1";

    next();
};
