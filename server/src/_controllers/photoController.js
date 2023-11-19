const router = require("express").Router();
const Photo = require("../models/Photo");
const QueryManipulation = require("../utils/QueryManipulator");

const { extractErrorMsg } = require("../utils/errorHanler");
const { getTopPhoto } = require("../middlewares/photoMiddlewares");
const { protect, restrict, restrictToOnwer } = require("../middlewares/authMiddlewares");

const { uploadPhoto, photoConfig } = require("../middlewares/uploadPhotoMiddleware");

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

router.patch(
    "/:id",
    protect,
    restrictToOnwer("Photo"),
    uploadPhoto(),
    photoConfig,
    async (req, res) => {
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
    }
);

router.delete("/:id", protect, restrictToOnwer("Photo"), async (req, res) => {
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

router.get("/like/:id", protect, restrict("user"), async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (photo.owner.toString() === req.user._id.toString()) {
            throw new Error("You cant post likes on your own photos!");
        }
        photo.likes.push(req.user._id);
        await photo.save();

        res.status(200).json({
            status: "success",
            liked: {
                _id: photo._id,
                name: photo.name,
                image: photo.image,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

module.exports = router;
