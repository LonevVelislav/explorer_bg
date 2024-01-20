const router = require("express").Router();
const fs = require("fs-extra");
const path = require("path");
const Photo = require("../models/Photo");
const Comment = require("../models/Comment");
const QueryManipulation = require("../utils/QueryManipulator");

const { extractErrorMsg } = require("../utils/errorHanler");
const { getTopPhoto } = require("../middlewares/photoMiddlewares");
const { protect, restrict, restrictToOnwer } = require("../middlewares/authMiddlewares");

const { uploadPhoto } = require("../middlewares/uploadPhotoMiddleware");

// routes
router.get("/", async (req, res) => {
    const manipulated = new QueryManipulation(Photo.find(), req.query)
        .filter()
        .sort()
        .filterFields()
        .paginate()
        .searchByUserId()
        .searchByName();

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

router.get("/:id/comments&owner", async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id)
            .populate("comments")
            .populate("owner", "username");
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

router.get("/:id/coordinates", async (req, res) => {
    try {
        const photo = await Photo.find({ _id: req.params.id })
            .select("lat")
            .select("lng")
            .select("name");

        res.status(200).json({
            status: "success",
            data: {
                photo,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fial",
            message: extractErrorMsg(err),
        });
    }
});

router.get("/get/top-photo", getTopPhoto, async (req, res) => {
    try {
        const topPhotoQuery = new QueryManipulation(Photo.find(), req.query)
            .filter()
            .sort()
            .filterFields()
            .paginate();

        const topPhotoData = await topPhotoQuery.query.populate("owner");

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

router.post("/", protect, restrict("user", "admin"), uploadPhoto(), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error("Photo is required! Upload a photo and try again!");
        }
        const newPhoto = await Photo.create({
            ...req.body,
            owner: req.user._id,
            imagefile: req.file,
            image: req.file.originalname,
        });
        console.log(newPhoto);
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

router.patch("/:id", protect, restrictToOnwer("Photo"), uploadPhoto(), async (req, res) => {
    try {
        let photo;
        console.log(req.file);
        if (req.file) {
            photo = await Photo.findByIdAndUpdate(
                req.params.id,
                {
                    ...req.body,
                    imagefile: req.file,
                    image: req.file.originalname,
                    region: "",
                },
                {
                    new: true,
                    runValidators: true,
                }
            );
        } else {
            photo = await Photo.findByIdAndUpdate(
                req.params.id,
                {
                    ...req.body,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );
        }

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

router.delete("/:id", protect, restrictToOnwer("Photo"), async (req, res) => {
    try {
        const pathToClient = path.resolve("../client/public/img/photos");
        await Photo.findByIdAndDelete(req.params.id);
        await Comment.deleteMany({ photoId: req.params.id });
        //delete the folder containing current photo
        fs.rmSync(`${pathToClient}/${req.params.id}`, { recursive: true, force: true });
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
        if (photo.likes.some((el) => el.toString() === req.user._id.toString())) {
            throw new Error("You already liked this photo!");
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

router.get("/liked/:id", protect, async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        console.log(photo.likes);
        let data;
        if (photo.likes.some((el) => el.toString() === req.query.userId)) {
            data = true;
        } else {
            data = false;
        }

        res.status(200).json({
            status: "success",
            data,
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

module.exports = router;
