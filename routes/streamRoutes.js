const express = require("express");
const router = express.Router();
const streamController = require("../controllers/streamController");

// Upload video route
router.post("/upload", streamController.uploadVideo);

// Start frame-based streaming
router.get("/start/frame", streamController.startFrameStreaming);

// Stop frame-based streaming (fixed the route path)
router.get("/stop/frame", streamController.stopFrameStreaming);

// Start chunk-based streaming
router.get("/start/chunk", streamController.startChunkStreaming);

// Stop chunk-based streaming
router.get("/stop/chunk", streamController.stopChunkStreaming);

// Start base64-based streaming
router.get("/start/base", streamController.startBase64Streaming);

// Stop base64-based streaming
router.get("/stop/base", streamController.stopBase64Streaming);

// Check streaming status
router.get("/status/frame", streamController.statusFrameStreaming);
router.get("/status/chunk", streamController.statusChunkStreaming);
router.get("/status/base", streamController.statusBase64Streaming);

module.exports = router;