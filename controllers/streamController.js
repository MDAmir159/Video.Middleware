const multer = require("multer");
const streamService = require("../services/streamService");

// Configure Multer for file uploads
const upload = multer({ dest: "uploads/" });

exports.uploadVideo = (req, res) => {
    upload.single("video")(req, res, (err) => {
        if (err) return res.status(500).send("Upload error");
        res.status(200).json({ message: "Video uploaded", file: req.file });
    });
};

// Frame streaming
exports.startFrameStreaming = (req, res) => {
    streamService.startFrameStreaming();
    res.send("Started frame streaming");
};

exports.stopFrameStreaming = (req, res) => {
    streamService.stopFrameStreaming();
    res.send("Stopped frame streaming");
}

// Chunk streaming
exports.startChunkStreaming = (req, res) => {
    streamService.startChunkedStreaming();
    res.send("Started chunk streaming");
};

exports.stopChunkStreaming = (req, res) => {
    streamService.stopChunkStreaming();
    res.send("Stopped chunk streaming");
}

// base64 streaming
exports.startBase64Streaming = (req, res) => {
    streamService.startBase64Streaming();
    res.send("Started base64 streaming");
};

exports.stopBase64Streaming = (req, res) => {
    streamService.stopBase64Streaming();
    res.send("Stopped base64 streaming");
}

// Status checks
exports.statusFrameStreaming = (req, res) => {
    const isFrameStreamingActive = streamService.isFrameStreamingActive();
    res.json({ status: isFrameStreamingActive });
};

exports.statusChunkStreaming = (req, res) => {
    const isChunkStreamingActive = streamService.isChunkStreamingActive();
    res.json({ status: isChunkStreamingActive });
};

exports.statusBase64Streaming = (req, res) => {
    const isBase64StreamingActive = streamService.isBase64StreamingActive();
    res.json({ status: isBase64StreamingActive });
};
