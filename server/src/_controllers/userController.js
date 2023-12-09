const router = require("express").Router();

const User = require("../models/User");
const { extractErrorMsg } = require("../utils/errorHanler");
const { createAndSendToken } = require("../utils/userToken");
const { filterObject } = require("../utils/filterObject");
const { restrict, protect, restrictToOnwer } = require("../middlewares/authMiddlewares");
const { uploadPhoto } = require("../middlewares/uploadPhotoMiddleware");

router.get("/", protect, restrict("admin"), async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            status: "successs",

            count: users.length,
            data: {
                users,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

router.get(
    "/:id",
    protect,
    restrict("admin", "user"),
    restrictToOnwer("User"),
    async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            res.status(200).json({
                status: "success",
                data: {
                    user,
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

router.post("/register", async (req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            role: req.body.role,
        });

        createAndSendToken(newUser, 200, res);
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("please provide email and password");
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await user.correctPassword(password, user.password))) {
            throw new Error("incorrect email or password");
        }
        createAndSendToken(user, 200, res);
    } catch (err) {
        res.status(401).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

router.patch("/upatePassword", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("+password");

        console.log(req.body, req.user);

        const correctPassword = await user.correctPassword(req.body.oldPassword, user.password);
        if (!correctPassword) {
            throw new Error("your current password is wrong!");
        }
        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        user.timeEdited = Date.now();

        await user.save();

        createAndSendToken(user, 201, res);
    } catch (err) {
        res.status(401).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

router.patch("/updateMe", protect, uploadPhoto(), async (req, res) => {
    try {
        if (req.body.password || req.body.confirmPassword) {
            throw new Error(
                "Cant change password here, go to http://localhost:3000/api/bg-explorer/users/upatePassword"
            );
        }
        const filteredObject = filterObject(req.body, "email", "username");

        if (req.file) {
            filteredObject.imagefile = req.file;
            filteredObject.image = req.file.originalname;
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { ...filteredObject },
            {
                runValidators: true,
                new: true,
            }
        );

        res.status(200).json({
            status: "success",
            data: {
                user,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

router.delete("/deleteMe", protect, restrict("admin", "user"), async (req, res) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: "success",
        data: null,
    });
});

module.exports = router;
