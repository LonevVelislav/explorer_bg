const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Photo = require("../models/Photo");
const { secret } = require("../config");
const { promisify } = require("util");
const { extractErrorMsg } = require("../utils/errorHanler");

exports.protect = async (req, res, next) => {
    let token;
    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
            console.log(token);
        }

        if (!token) {
            throw new Error("your not logged in! please log in to get access");
        }
        const decoded = await promisify(jwt.verify)(token, secret);
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            throw new Error(
                "the user belonging to the token does no longer exists"
            );
        }

        if (currentUser.changedPasswordAfter(decoded.iat)) {
            throw new Error(
                "User recently changed password. Please login again!"
            );
        }

        req.user = currentUser;
        console.log(req.user);

        next();
    } catch (err) {
        res.status(401).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
};

exports.restrict = (...roles) => {
    return async (req, res, next) => {
        try {
            if (!roles.includes(req.user.role)) {
                throw new Error(
                    "you dont hava permission to perform this action"
                );
            }
            next();
        } catch (err) {
            res.status(403).json({
                status: "fail",
                message: extractErrorMsg(err),
            });
        }
    };
};

exports.restrictToOnwer = async (req, res, next) => {
    try {
        const photo = await Photo.findById(req.params.id);
        const owner = req.user._id.toString() === photo.owner.toString();
        if (!owner && req.user.role !== "admin") {
            throw new Error("you are not the owner of this photo!");
        }
        next();
    } catch (err) {
        res.status(403).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
};
