const express = require('express');
const multer = require('multer');
const {
    uploadMedia,
    deleteMediaById,
    bulkUploadMedia,
} = require('../../controllers/media-controllers');

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// POST: Upload file to Cloudinary
router.post('/upload', upload.single('file'),uploadMedia );

// DELETE: Delete media from Cloudinary
router.delete('/delete/:type/:id', deleteMediaById);

router.post("/bulk-upload", upload.array("files"),bulkUploadMedia);

module.exports = router;
