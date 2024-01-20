const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "comment needs a name!"],
        trim: true,
    },
    text: {
        type: String,
        required: [true, "comment cant be empty!"],
        trim: true,
        maxLength: [100, "Comments cant be longer then 100 characters"],
    },
    photoId: {
        type: mongoose.Schema.ObjectId,
        ref: "Photo",
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    photo: {
        type: String,
        default: "default.jpeg",
        trim: true,
    },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
