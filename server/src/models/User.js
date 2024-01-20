const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs-extra");
const sharp = require("sharp");

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
        minlength: [5, "password must be at least 5 characters long"],
        trim: true,
        select: false,
    },
    image: {
        type: String,
        default: "default.jpeg",
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
    imagefile: {
        type: Object,
        default: {},
        select: false,
    },
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

userSchema.pre(/^find/, async function (next) {
    if (this.op === "findOneAndUpdate" && this._update.imagefile) {
        const pathToClient = path.resolve("../server/src/public/users_photos");
        const dir = `${pathToClient}/${this._conditions._id}`;
        this.filename = this._update.imagefile.originalname;
        if (fs.existsSync(dir)) {
            await fs.emptyDir(dir);
            if (this._update.imagefile) {
                sharp(this._update.imagefile.buffer)
                    .resize(500, 500)
                    .toFormat("jpeg")
                    .jpeg({ quality: 90 })
                    .toFile(`${dir}/${this.filename}`);
            }
        } else {
            fs.mkdirSync(dir, { recursive: true });
            if (this._update.imagefile) {
                sharp(this._update.imagefile.buffer)
                    .resize(500, 500)
                    .toFormat("jpeg")
                    .jpeg({ quality: 90 })
                    .toFile(`${dir}/${this.filename}`);
            }
        }
    }
    this.imagefile = undefined;

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
