const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const { promisify } = require("util");
const { extractErrorMsg } = require("../utils/errorHanler");

exports.protect = async (req, res, next) => {
    let token;
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            throw new Error("your not logged in! please log in to get access");
        }
        const decoded = await promisify(jwt.verify)(token, process.env.SECRET);
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            throw new Error("the user belonging to the token does no longer exists");
        }

        if (currentUser.changedPasswordAfter(decoded.iat)) {
            throw new Error("User recently changed password. Please login again!");
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
                throw new Error("you dont hava permission to perform this action");
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

exports.restrictToOnwer = (model) => {
    return async (req, res, next) => {
        try {
            const element = await mongoose.model(model).findById(req.params.id);
            if (!element) {
                throw new Error("there is no item with this id!");
            }
            const owner =
                model === "User"
                    ? req.user._id.toString() === element._id.toString()
                    : req.user._id.toString() === element.owner.toString();
            if (!owner && req.user.role !== "admin") {
                throw new Error("you are not the owner of this item!");
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
