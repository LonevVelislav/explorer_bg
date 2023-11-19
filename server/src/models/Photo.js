const mongoose = require("mongoose");
const { getGeoStats } = require("../utils/getGeoStats");

const photoShema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "photo must have a name"],
            trim: true,
            minLength: [2, "name must be loneger then 1 character"],
        },
        description: {
            type: String,
            trim: true,
            maxLenght: [100, "description length must be below 100 characters long"],
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
        coordinates: {
            type: [Number],
            validate: {
                validator: function (value) {
                    return Array.isArray(value) && value.length > 0;
                },
                message:
                    "Photo requires coordinates, right click on the pin location and copy the top two numbers.",
            },
        },
        likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
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
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

photoShema.pre("save", async function (next) {
    if (this.coordinates) {
        const data = await getGeoStats(this.coordinates[0], this.coordinates[1]);

        this.region = data.address.county;
    }

    next();
});

//pre middleware for all find queries.
photoShema.pre(/^find/, function (next) {
    this.find({ secretPhoto: { $ne: true } });
    this.start = Date.now();
    next();
});

photoShema.post(/^find/, function (docs, next) {
    // console.log(docs); //docs has access to found documents
    console.log(`query took ${Date.now() - this.start} miliseconds`);

    next();
});

//remove secret data from aggregation pipeline
photoShema.pre("aggregate", function (next) {
    this.pipeline.unshift({
        $match: { secretGame: { $ne: true } },
    });
    next();
});

const Photo = mongoose.model("Photo", photoShema);

module.exports = Photo;
