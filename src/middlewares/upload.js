import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Storage setup for video in cloudinary
const videoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "boom/videos",
        resource_type: "video",
        format: "mp4"
    }
});

// Storage for video thumbnail in cloudinary
const thumbnailStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: process.env.CLOUDINARY_THUMBNAIL_FOLDER,
        resource_type: "image",
        allowedFormats: ["jpg", "jpeg", "png"]
    }
});

// Select custom storage for either video or eithe thumnbail because we adding video and thumbnail in single api
const customStorage = {
    _handleFile: function (req, file, cb) {
        let storage;
        if (file.fieldname === "video") {
            storage = videoStorage;
        } else if (file.fieldname === "thumbnail") {
            storage = thumbnailStorage;
        } else {
            return cb(new Error("Unexpected field"));
        }
        storage._handleFile(req, file, cb);
    }
};

// Create multer instance with custom storage
export const uploadVideoAndThumbnail = multer({
    storage: customStorage,
}).fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
]);