const router = require("express").Router();
const Photo = require("../models/Photo");

const { extractErrorMsg } = require("../utils/errorHanler");
const { getTopPhoto } = require("../middlewares/photoMiddlewares");
const { protect, restrict, restrictToOnwer } = require("../middlewares/authMiddlewares");

const { uploadPhoto, photoConfig } = require("../middlewares/uploadPhotoMiddleware");

//class for basic query manipulation
class QueryManipulation {
    constructor(query, requestQuery) {
        this.query = query;
        this.requestQuery = requestQuery;
    }

    filter() {
        const queryCopy = { ...this.requestQuery };
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach((el) => delete queryCopy[el]);

        let queryString = JSON.stringify(queryCopy);

        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
        this.query = this.query.find(JSON.parse(queryString));

        return this;
    }

    sort() {
        if (this.requestQuery.sort) {
            const sortBy = this.requestQuery.sort.split(",").join(" ");
            this.query.sort(sortBy);
        } else {
            this.query.sort("-createdAt");
        }
        return this;
    }

    filterFields() {
        if (this.requestQuery.fields) {
            const fields = this.requestQuery.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__v");
            this.query = this.query.select("-secretPhoto");
        }
        return this;
    }

    paginate() {
        const page = this.requestQuery.page * 1 || 1;
        const limit = this.requestQuery.limit * 1 || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
    searchByregion() {
        if (this.requestQuery.region) {
            const region = this.requestQuery.region;
            this.query = this.query.find({ region: region });
        }
        return this;
    }
}

// routes
router.get("/", async (req, res) => {
    const manipulated = new QueryManipulation(Photo.find(), req.query)
        .filter()
        .sort()
        .filterFields()
        .paginate()
        .searchByregion();
    try {
        const photos = await manipulated.query;

        res.status(200).json({
            status: "success",
            results: photos.length,
            data: {
                photos,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                photo,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

router.get("/top-photo", getTopPhoto, async (req, res) => {
    const topPhotoQuery = new QueryManipulation(Photo.find(), req.query)
        .filter()
        .sort()
        .filterFields()
        .paginate();

    try {
        const topPhotoData = await topPhotoQuery.query;

        res.status(200).json({
            status: "success",
            data: {
                photo: topPhotoData,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

router.post("/", protect, restrict("user"), uploadPhoto(), photoConfig, async (req, res) => {
    try {
        if (!req.file) {
            throw new Error("Photo is required! Upload a photo and try again!");
        }
        const newPhoto = await Photo.create({
            ...req.body,
            owner: req.user._id,
            image: req.file.filename,
        });
        res.status(200).json({
            status: "success",
            data: {
                photo: newPhoto,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

router.patch("/:id", protect, restrictToOnwer, uploadPhoto(), photoConfig, async (req, res) => {
    try {
        if (!req.file) {
            throw new Error("Photo is required! Upload a photo and try again!");
        }
        const photo = await Photo.findByIdAndUpdate(
            req.params.id,
            { ...req.body, image: req.file.filename },
            {
                new: true,
                runValidators: true,
            }
        );
        res.status(201).json({
            status: "success",
            data: {
                photo,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

router.delete("/:id", protect, restrictToOnwer, async (req, res) => {
    try {
        await Photo.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: "success",
            data: null,
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

module.exports = router;
