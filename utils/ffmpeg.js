const { spawn } = require("child_process");
const path = require("path");
require("dotenv").config();

const CAPTURE_DIR = process.env.CAPTURE_DIR || "captures";

const startFFmpeg = (ws, rtspUrl) => {
    const ffmpeg = spawn("ffmpeg", [
        "-rtsp_transport", "tcp",
        "-i", rtspUrl,
        "-f", "mpegts",
        "-codec:v", "mpeg1video",
        "-b:v", "2M",
        "-maxrate", "20M",
        "-bufsize", "20M",
        "-s", "1280x720",
        "-r", "20",
        "-pix_fmt", "yuv420p",
        "-vf", "scale=640:360",
        "-an",
        "-"
    ]);

    ffmpeg.stdout.on("data", (data) => {
        if (ws.readyState === 1) {
            ws.send(data);
        }
    });

    ffmpeg.stderr.on("data", (data) => {
        console.error(`FFmpeg error: ${data.toString()}`);
    });

    ffmpeg.on("close", (code) => {
        console.log(`FFmpeg exited with code: ${code}`);
    });

    ws.on("close", () => {
        console.log("Terminating FFmpeg process");
        ffmpeg.kill("SIGINT");
    });
};

const captureFrameAndSaveAsJpeg = (rtspUrl) => {
    const capture = spawn("ffmpeg", [
        "-rtsp_transport", "tcp",
        "-i", rtspUrl,
        "-vframes", "1",
        "-f", "image2",
        "-q:v", "2",
        path.join(__dirname, `../${CAPTURE_DIR}/frame_${Date.now()}.jpg`)
    ]);

    capture.stderr.on("data", (data) => {
        console.error(`Capture error: ${data.toString()}`);
    });

    capture.on("close", (code) => {
        if (code === 0) {
            console.log("Frame captured successfully.");
        } else {
            console.error("Failed to capture frame.");
        }
    });
};

module.exports = {
    startFFmpeg,
    captureFrameAndSaveAsJpeg
};
