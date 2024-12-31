const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs'); // For file cleanup after upload


const uploadMediaToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
          resource_type: "auto",
        });

        return result;
    } catch (error) {
        console.error('Error during Cloudinary upload:', error.message);
        throw new Error('Error uploading to Cloudinary');
    }finally{
        // Optional: Cleanup local file after upload
        fs.unlinkSync(filePath);
    }
};

const deleteMediaFromCloudinary = async (publicId, type) => {

    try {

        const response = await cloudinary.uploader.destroy(publicId, { type: 'upload', resource_type: type });

        if (response.result === 'ok') {
            return response;
        } else {
            console.log('Something went wrong while deleting the asset', response)
        }

    } catch (error) {
        console.error('Error during Cloudinary delete:', error.message);
        throw new Error('Failed to delete asset from Cloudinary');
    }
};

module.exports = {
    uploadMediaToCloudinary,
    deleteMediaFromCloudinary,
};