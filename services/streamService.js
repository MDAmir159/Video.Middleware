const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const { getCurrentTimeStamp, } = require("../utils/helpers/functions");
const { broadcastBase64Frame } = require("../utils/broadcastBase64Frame");

let frameStreamingActive = false;
let chunkStreamingActive = false;
let base64StreamingActive = false;

const RTSP_URL = process.env.RTSP_URL;
const FRAME_CAPTURE_DIR = process.env.FRAME_CAPTURE_DIR;
const CHUNK_CAPTURE_DIR = process.env.CHUNK_CAPTURE_DIR;
const BASE64_CAPTURE_DIR = process.env.BASE64_CAPTURE_DIR;

let ffmpegFrameProcess = null;
let ffmpegChunkProcess = null;
let ffmpegBase64Process = null;

// Start Frame Streaming
exports.startFrameStreaming = () => {
    try {
        if (frameStreamingActive) {
            console.log("Frame streaming is already active");
            return;
        }

        frameStreamingActive = true;
        console.log("Frame-based streaming started");

        ffmpegFrameProcess = spawn("ffmpeg", [
            "-rtsp_transport", "tcp",
            "-i", RTSP_URL,
            "-vf", "fps=1",
            "-f", "image2",
            `${FRAME_CAPTURE_DIR}/frame_%03d.jpg`,
        ]);

        ffmpegFrameProcess.on("close", () => {
            frameStreamingActive = false;
            console.log("Frame-based streaming stopped");
        });
    } catch (error) {
        console.log(error);
    }
};

// Stop Frame Streaming
exports.stopFrameStreaming = () => {
    if (!frameStreamingActive) {
        console.log("Frame streaming is not active");
        return;
    }

    if (ffmpegFrameProcess) {
        ffmpegFrameProcess.kill("SIGINT"); // Gracefully stop the ffmpeg process
        ffmpegFrameProcess = null;
    }

    frameStreamingActive = false;
    console.log("Stopping frame-based streaming...");
};

// Start Chunk Streaming
exports.startChunkedStreaming = () => {
    try {
        if (chunkStreamingActive) {
            console.log("Chunked streaming is already active");
            return;
        }

        chunkStreamingActive = true;
        console.log("Chunked streaming started");

        const CHUNK_SIZE_MB = 5;
        const CHUNK_SIZE_BYTES = CHUNK_SIZE_MB * 1024 * 1024;

        ffmpegChunkProcess = spawn("ffmpeg", [
            "-rtsp_transport", "tcp",
            "-i", RTSP_URL,
            "-c", "copy",
            "-f", "segment",
            "-segment_time", "00:00:10",
            "-fs", CHUNK_SIZE_BYTES.toString(),
            `${CHUNK_CAPTURE_DIR}/chunk_%03d.mp4`,
        ]);

        ffmpegChunkProcess.stdout.on('data', (data) => {
            console.log(`FFmpeg stdout: ${data}`);
        });

        ffmpegChunkProcess.stderr.on('data', (data) => {
            console.error(`FFmpeg stderr: ${data}`);
        });

        ffmpegChunkProcess.on("close", (code) => {
            chunkStreamingActive = false;
            if (code === 0) {
                console.log("Chunked streaming completed successfully");
            } else {
                console.log(`FFmpeg process exited with code ${code}`);
            }
        });

        ffmpegFrameProcess.on("error", (err) => {
            chunkStreamingActive = false;
            console.error("Error with FFmpeg process:", err);
        });
    } catch (error) {
        console.error("Error starting chunked streaming:", error);
    }
};

// Stop Chunk Streaming
exports.stopChunkStreaming = () => {
    if (!chunkStreamingActive) {
        console.log("Chunk streaming is not active");
        return;
    }

    if (ffmpegChunkProcess) {
        ffmpegChunkProcess.kill("SIGINT"); // Gracefully stop the ffmpeg process
        ffmpegChunkProcess = null;
    }

    chunkStreamingActive = false;
    console.log("Stopping chunk-based streaming...");
};

// Start Base64 Frame Streaming
exports.startBase64Streaming = () => {
    try {
        if (base64StreamingActive) {
            console.log("Base64 frame streaming is already active.");
            return;
        }

        if (!fs.existsSync(BASE64_CAPTURE_DIR)) {
            fs.mkdirSync(BASE64_CAPTURE_DIR, { recursive: true });
        }

        base64StreamingActive = true;
        console.log("Base64 frame streaming started.");

        ffmpegBase64Process = spawn("ffmpeg", [
            "-rtsp_transport", "tcp",
            "-i", process.env.RTSP_URL,
            "-vf", "fps=1", // Capture 1 frame per second
            "-f", "image2pipe",
            "-vcodec", "mjpeg", // Output as MJPEG to pipe
            "pipe:1",
        ]);

        ffmpegBase64Process.stdout.on("data", (data) => {
            const timestamp = getCurrentTimeStamp();
            const base64Data = data.toString("base64");
            broadcastBase64Frame(base64Data);
            const filePath = path.join(BASE64_CAPTURE_DIR, `frame_${timestamp}.txt`);

            fs.writeFile(filePath, base64Data, (err) => {
                if (err) {
                    console.error(`Error saving base64 frame: ${err}`);
                } else {
                    // console.log(`Saved base64 frame: ${filePath}`);
                }
            });
        });

        ffmpegBase64Process.stderr.on("data", (data) => {
            // console.error(`FFmpeg stderr: ${data}`);
        });

        ffmpegBase64Process.on("close", (code) => {
            // base64StreamingActive = false;
            if (code === 0) {
                // console.log("Base64 frame streaming completed successfully.");
            } else {
                // console.error(`FFmpeg process exited with code ${code}`);
            }
        });

        ffmpegBase64Process.on("error", (err) => {
            // base64StreamingActive = false;
            console.error("Error with FFmpeg process:", err);
        });
    } catch (error) {
        console.error("Error starting base64 frame streaming:", error);
    }
};

// Stop Base64 Frame Streaming
exports.stopBase64Streaming = () => {
    if (!base64StreamingActive) {
        console.log("Base64 frame streaming is not active.");
        return;
    }

    if (ffmpegBase64Process) {
        ffmpegBase64Process.kill("SIGINT"); // Gracefully stop the ffmpeg process
        ffmpegBase64Process = null;
    }

    base64StreamingActive = false;
    console.log("Base64 frame streaming stopped.");
};

// Status checks
exports.isFrameStreamingActive = () => { 
    return frameStreamingActive 
};

exports.isChunkStreamingActive = () => { 
    return chunkStreamingActive 
};

exports.isBase64StreamingActive = () => { 
    return base64StreamingActive 
};
