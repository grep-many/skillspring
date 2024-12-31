require('dotenv').config({path:'.env.local'});

const port = process.env.PORT || 5000;
const clientUrl = process.env.CLIENT_URL;
const dbUri = process.env.MONGO_URI;
const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;
const paypalClientId = process.env.PAYPAL_CLIENT_ID
const paypalSecretId = process.env.PAYPAL_SECRET_ID
const jwtSecret = process.env.JWT_SECRET

module.exports = {
    port,
    clientUrl,
    dbUri,
    cloudinaryCloudName,
    cloudinaryApiKey,
    cloudinaryApiSecret,
    paypalClientId,
    paypalSecretId,
    jwtSecret,
}