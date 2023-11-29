const router = require("express").Router();
const Comment = require("../models/Comment");
const Photo = require("../models/Photo");
const QueryManipulation = require("../utils/QueryManipulator");

const { extractErrorMsg } = require("../utils/errorHanler");
const { protect, restrict, restrictToOnwer } = require("../middlewares/authMiddlewares");

router.get("/", async (req, res) => {
    const manipulated = new QueryManipulation(Comment.find(), req.query)
        .filter()
        .sort()
        .filterFields()
        .paginate()
        .searchByPhotoId();
    try {
        const comments = await manipulated.query;
        res.status(200).json({
            status: "success",
            results: comments.length,
            data: {
                comments,
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
        const comment = await Comment.findById(req.params.id);

        res.status(200).json({
            status: "success",
            data: {
                comment,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

router.post("/create/:photoId", protect, restrict("user"), async (req, res) => {
    try {
        const newComment = await Comment.create({
            ...req.body,
            name: req.user.username,
            photoId: req.params.photoId,
            owner: req.user._id,
            photo: req.user.image,
        });
        const photo = await Photo.findById(req.params.photoId);
        if (!photo) {
            throw new Error("Invalid photo!");
        }
        photo.comments.push(newComment._id);
        await photo.save();

        res.status(200).json({
            status: "success",
            data: {
                comment: newComment,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

router.delete("/:id", protect, restrictToOnwer("Comment"), async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        const photo = await Photo.findById(comment.photoId);

        photo.comments = photo.comments.filter((el) => el.toString() !== req.params.id);
        await photo.save();
        await Comment.findByIdAndDelete(req.params.id);

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
