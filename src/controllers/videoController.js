import cloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js";
import Video from "../models/videoModel.js";

export const uploadVideo = async (req, res) => {
    try {
        const { title, description } = req.body;
        const { userId } = req.client;

        if (!title || !description)
            return res.status(400).json({ message: "All fields are required" });

        const user = await User.findById(userId);

        if (!user)
            return res.status(404).json({ message: "User not found" });

        if (!req.files['video'])
            return res.status(400).json({ message: "Video file required" });

        const videoFile = req.files['video'][0];

        const videoUrl = videoFile.path;

        const thumbnailUrl = req.files['thumbnail'] ? req.files['thumbnail'][0].path : videoUrl.replace("/upload/", "/upload/w_300,h_200,so_1/f_jpg/");

        const publicId = videoFile.filename;

        const videoMetadata = await cloudinary.api.resource(publicId, {
            resource_type: 'video',
            media_metadata: true
        })

        const duration = Math.floor(videoMetadata.duration);

        const newVideo = new Video({
            title,
            description,
            videoUrl,
            thumbnailUrl,
            uploader: userId,
            duration
        })

        await newVideo.save();

        res.status(200).json({ message: "Video uploaded successfully" });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }
}

export const getVideosByUser = async (req, res) => {
    try {
        const { userId } = req.client;

        const videos = await Video.find({ uploader: userId });

        res.status(200).json({ messages: "Videos fetched succssfully", data: videos });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }
}

export const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find().populate("uploader", "_id username");
        res.status(200).json({ messages: "Videos fetched succssfully", data: videos });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }
}

export const getVideo = async (req, res) => {
    try {
        const { videoId } = req.params;

        const video = await Video.findByIdAndUpdate(
            videoId,
            { $inc: { views: 1 } },
            { new: true }
        ).populate("uploader", "_id username");

        if (!video)
            return res.status(404).json({ message: "Video not found", data: null })

        res.status(200).json({ messages: "Video fetched succssfully", data: video });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }
}

export const likeVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { userId } = req.client;

        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        let message = "", likeAction;

        // If user already liked then remove like either like and set message
        if (video.likes.includes(userId)) {
            likeAction = { $pull: { likes: userId } };
            message = "Video unliked";
        } else {
            likeAction = { $addToSet: { likes: userId } };
            message = "Video liked";
        }

        // Remove from dislike and use likeAction
        const updatedVideo = await Video.findByIdAndUpdate(videoId, likeAction, { new: true });

        res.status(200).json({ message, data: { likes: updatedVideo.likes.length } });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
}