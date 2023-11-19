const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required!"],
        trim: true,
        maxLength: [10, "username is too long, 10 characters max"],
    },
    email: {
        type: String,
        required: [true, "email is required!"],
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: "please provide valid email",
        },
    },
    password: {
        type: String,
        required: [true, "password is required!"],
        minlength: [8, "password must be at least 8 characters long"],
        trim: true,
        select: false,
    },
    image: {
        type: String,
        required: true,
        default: "default.jpg",
    },
    timeEdited: {
        type: Date,
        default: Date.now(),
    },
    role: {
        type: String,
        trim: true,
        default: "user",
    },
    active: {
        type: Boolean,
        default: true,
        select: false,
    },

    photo: String,
});

userSchema.virtual("confirmPassword").set(function (value) {
    if (this.password !== value) {
        throw new Error("passwords must match");
    }
});

userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

//methods
userSchema.methods.correctPassword = async function (incomingPassword, correctPassword) {
    return await bcrypt.compare(incomingPassword, correctPassword);
};

userSchema.methods.changedPasswordAfter = function (time) {
    const editedTimeStamp = parseInt(this.timeEdited.getTime() / 1000, 10);

    return time < editedTimeStamp ? true : false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
