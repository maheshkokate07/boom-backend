import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    thumbnailUrl: {
        type: String,
    },
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    duration: {
        type: String
    },
    views: {
        type: Number,
        default: 0,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
}, { timestamps: true });

const Video = mongoose.model("Video", videoSchema);

export default Video;