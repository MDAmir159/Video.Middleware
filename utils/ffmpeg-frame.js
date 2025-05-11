const { spawn } = require("child_process");
const path = require("path");

const captureFrame = (rtspUrl, ws) => {
    const capture = spawn("ffmpeg", [
        "-rtsp_transport", "tcp",
        "-i", rtspUrl,
        "-vframes", "1",              // Capture only one frame
        "-f", "image2",               // Output format for images
        "-q:v", "2",                  // Quality level (1=best)
        path.join(__dirname, "../captures/frames/frame_" + new Date().toISOString().replace(/:/g, "-").replace(/\..+/, "") + ".jpg")  // Save frame as .jpg
    ]);

    capture.stdout.on("data", (data) => {
        console.log("Frame capture output:", data.toString());
    });

    capture.stderr.on("data", (data) => {
        console.error(`Frame capture error: ${data.toString()}`);
    });

    capture.on("close", (code) => {
        console.log(`Capture frame process closed with code: ${code}`);
    });

    capture.on("exit", (code) => {
        console.log(`Capture frame process exited with code: ${code}`);
    });
};

const startFFmpegForFrame = (ws, rtspUrl) => {
    // Repeatedly capture frames every second or as required
    setInterval(() => captureFrame(rtspUrl, ws), 1000);  // Adjust interval as needed (1000ms = 1 frame per second)
};

module.exports = { startFFmpegForFrame };
