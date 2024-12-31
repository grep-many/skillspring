const express = require('express');
const multer = require('multer');
const { uploadMediaToCloudinary, deleteMediaFromCloudinary } = require('../../helpers/cloudinary');
const fs = require('fs');
const ytpl = require('ytpl');
const ytdl = require('ytdl-core');

const router = express.Router();

function generateUniqueId() {
    const date = new Date().toISOString(); // Get current date and time in ISO format (e.g., 2024-12-31T12:00:00Z)
    const randomString = Math.random().toString(36).substr(2, 10); // Generate a 10-character random string

    return `${date}-${randomString}`;
}

// Configure Multer with storage and limits
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, file.originalname),
});

function isValidYouTubeURL(url) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?.*v=|playlist\?|embed\/)|youtu\.be\/)([\w-]{11}(&.*)?|.*list=([\w-]+))/;
    return youtubeRegex.test(url);
}

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 * 1024, // 5GB limit
    },
});

// POST: Upload file to Cloudinary
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (req.file) {
            // Upload file to Cloudinary
            const response = await uploadMediaToCloudinary(req.file.path);
            res.status(200).json({
                success: true,
                public_id: response.public_id,
                secure_url: response.secure_url,
            })

        } else if (req.body.url) {
            const { url } = req.body;
            if (isValidYouTubeURL(url)) {
                const response = {
                    success: true,
                    data: {
                        public_id: generateUniqueId(),
                        secure_url: url
                    }
                };
                res.status(200).json(response)
            } else {
                const response = {
                    success: false,
                    message: 'Not a valid YouTube URL'
                };
                res.status(400).json(response)
            }
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid input data'
            });
        }

    } catch (err) {
        console.error('Upload error:', err.message);

        res.status(500).json({
            success: false,
            message: 'Something went wrong while uploading file',
            error: err.message,
        });
    } finally {
        // Cleanup file in case of failure
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
});

// DELETE: Delete media from Cloudinary
router.delete('/delete/:type/:id', async (req, res) => {
    try {
        const { id, type } = req.params;

        if (!id || !type) {
            return res.status(400).json({
                success: false,
                message: 'Id is required',
            });
        }

        const response = await deleteMediaFromCloudinary(id, type);

        res.status(200).json({
            success: true,
            message: 'Deleted successfully',
            data: response,
        });
    } catch (err) {
        console.error('Delete error:', err.message);

        res.status(500).json({
            success: false,
            message: 'Something went wrong while deleting file',
            error: err.message,
        });
    }
});

router.post("/bulk-upload", upload.array("files"), async (req, res) => {
    try {
        if (req.files) {
            const uploadPromises = req.files.map(async (fileItem) => {
                try {
                    const uploadResponse = await uploadMediaToCloudinary(fileItem.path);
                    return uploadResponse;
                } catch (uploadError) {
                    console.error(`Upload error for ${fileItem.path}:`, uploadError.message);
                    return null; // Return null for errors
                }
            });

            const results = await Promise.all(uploadPromises);

            // Filter out null responses and map results
            const secureUrls = results.filter((result) => result !== null).map((result) => ({
                public_id: result.public_id,
                secure_url: result.secure_url,
            }));

            res.status(200).json({
                success: true,
                data: secureUrls,
            });
        } else if (req.body.url) {
            const { url } = req.body;

            if (isValidYouTubeURL(url)) {
                const playlistId = url.split('list=')[1]?.split('&')[0];
                if (playlistId) {
                    const playlist = await ytpl(playlistId);

                    const videoObjects = await Promise.all(
                        playlist.items.map(async (video) => {
                            try {
                                const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
                                const videoInfo = await ytdl.getInfo(videoUrl);
                                return {
                                    public_id: generateUniqueId(),
                                    secure_url: videoInfo.videoDetails.video_url
                                };
                            } catch (videoError) {
                                console.error(`Error fetching video info for ID ${video.id}:`, videoError.message);
                                return {
                                    public_id: generateUniqueId(),
                                    secure_url: `https://www.youtube.com/watch?v=${video.id}`
                                }; // Fallback
                            }
                        })
                    );

                    res.status(200).json({
                        success: true,
                        data: videoObjects,
                    });
                } else {
                    res.status(400).json({
                        success: false,
                        message: 'Invalid playlist ID extracted from URL',
                    });
                }
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Not a valid YouTube playlist URL',
                });
            }
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid input data',
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Something went wrong while bulk uploading',
            error: err.message,
        });
    } finally {
        if (req.files) {
            req.files.forEach((file) => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
    }
});

module.exports = router;
