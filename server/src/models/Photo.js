const mongoose = require("mongoose");
const fs = require("fs-extra");
const path = require("path");
const sharp = require("sharp");

const { getGeoStats } = require("../utils/getGeoStats");

const photoShema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "photo must have a name"],
            trim: true,
            minLength: [2, "name must be loneger then 1 character"],
            maxLenght: [20, "name cant be longer then 20 characters"],
        },
        region: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
            required: true,
            default: "default.jpg",
        },
        lat: {
            type: Number,
            trim: true,
            required: [
                true,
                "Photo requires coordinates, right click on the pin location and copy the top two numbers.",
            ],
        },
        lng: {
            type: Number,
            trim: true,
            required: [
                true,
                "Photo requires coordinates, right click on the pin location and copy the top two numbers.",
            ],
        },
        likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
        stars: { type: Number, default: 0 },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        secretPhoto: {
            type: Boolean,
            default: false,
            select: false,
        },
        owner: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
        comments: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "Comment",
            },
        ],
        imagefile: {
            type: Object,
            default: {},
            select: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

//pre middleware for all find queries.

photoShema.pre("save", function (next) {
    this.stars = this.likes.length;
    next();
});

photoShema.pre("save", async function (next) {
    const data = await getGeoStats(this.lat, this.lng);
    console.log(data);
    if (data.address === undefined) {
        throw new Error("Cordinates are invalid!");
    }
    this.region = data.address.county;

    next();
});

photoShema.pre("save", function (next) {
    if (this.isNew) {
        const pathToClient = path.resolve("../server/src/public/photos");
        const dir = `${pathToClient}/${this._id}`;
        this.filename = this.imagefile.originalname;
        if (fs.existsSync(dir)) {
            fs.emptyDir(dir)
                .then(() => console.log("All files deleted Successfully"))
                .catch((e) => console.log(e));
        } else {
            fs.mkdirSync(dir, { recursive: true });
        }

        sharp(this.imagefile.buffer).toFormat("jpeg").toFile(`${dir}/${this.filename}`);
    }

    next();
});

photoShema.pre(/^find/, async function (next) {
    if (this.op === "findOneAndUpdate") {
        if (this._update.imagefile) {
            const pathToClient = path.resolve("../server/src/public/photos");
            const dir = `${pathToClient}/${this._conditions._id}`;
            this.filename = this._update.imagefile.originalname;
            if (fs.existsSync(dir) && this._update.imagefile) {
                await fs.emptyDir(dir);
                sharp(this._update.imagefile.buffer)
                    .toFormat("jpeg")
                    .toFile(`${dir}/${this.filename}`);
            } else {
                fs.mkdirSync(dir, { recursive: true });
                sharp(this._update.imagefile.buffer)
                    .toFormat("jpeg")
                    .toFile(`${dir}/${this.filename}`);
            }
        }
        const data = await getGeoStats(this._update.lat, this._update.lng);
        if (data.address === undefined) {
            throw new Error("Cordinates are invalid!");
        }

        this._update.region = data.address.county;
    }

    this.find({ secretPhoto: { $ne: true } });

    next();
});

//remove secret data from aggregation pipeline
photoShema.pre("aggregate", function (next) {
    this.pipeline.unshift({
        $match: { secretPhoto: { $ne: true } },
    });
    next();
});

const Photo = mongoose.model("Photo", photoShema);

module.exports = Photo;
