const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

console.log("===== CLOUDINARY CHECK =====");
console.log("Cloud Name:", process.env.CLOUD_NAME);
console.log(
    "API Key:",
    process.env.CLOUD_API_KEY ? "LOADED" : "MISSING"
);
console.log(
    "API Secret:",
    process.env.CLOUD_API_SECRET ? "LOADED" : "MISSING"
);
console.log("============================");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "StayNest_DEV",
        allowed_formats: ["jpg", "png", "jpeg"],
    },
});

module.exports = {
    cloudinary,
    storage,
};