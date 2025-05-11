const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR || "public/uploads";

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, `../${UPLOAD_DIR}`));
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        cb(null, `${timestamp}-${file.originalname}`);
    }
});
const upload = multer({ storage });

router.post("/", upload.single("video"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    console.log(`File uploaded: ${req.file.filename}`);
    res.send(`File uploaded successfully: ${req.file.filename}`);
});

module.exports = router;
