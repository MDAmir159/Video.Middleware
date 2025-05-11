const { spawn } = require("child_process");
const path = require("path");

const startFFmpegForChunks = (rtspUrl, ws) => {
    const chunkDuration = 10; // Duration of each chunk in seconds
    const chunkFilePattern = path.join(__dirname, "../captures/chunked/chunk_%03d.mp4");  // Naming pattern for chunks

    const ffmpeg = spawn("ffmpeg", [
        "-rtsp_transport", "tcp",
        "-i", rtspUrl,
        "-c:v", "libx264",              // Use H.264 codec for video
        "-f", "segment",                // Segment output into multiple files
        "-segment_time", chunkDuration, // Duration of each chunk
        "-segment_format", "mp4",       // Output format for chunks
        "-reset_timestamps", "1",       // Reset timestamps for each chunk
        "-an",                          // No audio (if not required)
        chunkFilePattern                // Output filename pattern for segments
    ]);

    ffmpeg.stdout.on("data", (data) => {
        console.log("FFmpeg Chunking Output:", data.toString());
    });

    ffmpeg.stderr.on("data", (data) => {
        console.error(`FFmpeg Chunking Error: ${data.toString()}`);
    });

    ffmpeg.on("close", (code) => {
        console.log(`FFmpeg process for chunking closed with code: ${code}`);
    });

    ffmpeg.on("exit", (code) => {
        console.log(`FFmpeg process for chunking exited with code: ${code}`);
    });

    ws.on("close", () => {
        console.log("WebSocket closed, terminating FFmpeg process for chunks");
        ffmpeg.kill("SIGINT");
    });

    ws.on("error", (err) => {
        console.error(`WebSocket error: ${err.message}`);
    });
};

module.exports = { startFFmpegForChunks };
