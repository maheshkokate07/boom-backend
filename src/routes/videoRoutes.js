import express from 'express';
import { checkJWT } from '../middlewares/checkJwt.js';
import { uploadVideoAndThumbnail } from '../middlewares/upload.js';
import { getAllVideos, getVideo, getVideosByUser, likeVideo, uploadVideo } from '../controllers/videoController.js';

const router = express.Router();

router.use(checkJWT);

router.post('/upload', uploadVideoAndThumbnail, uploadVideo);
router.get('/my', getVideosByUser);
router.get('/all', getAllVideos);
router.get('/:videoId', getVideo);
router.post('/like/:videoId', likeVideo);

export default router;