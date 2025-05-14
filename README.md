
# 🎥 Video.Middleware

Video.Middleware is an Express.js-based middleware designed to capture RTSP streams and process them into various formats, including JPEG images, Base64 strings, and MP4 videos.

### 🚀 Features

- RTSP Stream Capture: Connect to RTSP streams and capture frames.

- Image Processing: Save frames as JPEG images.

- Base64 Encoding: Convert frames to Base64 strings for easy transmission.

- Video Recording: Record streams and save them as MP4 videos.

- Configurable Intervals: Set custom intervals for frame capturing.

- RESTful API: Control streaming operations via API endpoints.

### 🛠️ Prerequisites
- Node.js (v14 or higher)

- FFmpeg installed and added to system PATH

- An RTSP stream source

### 📦 Installation
## Installation

Install dependencies with npm

```bash
git clone https://github.com/MDAmir159/Video.Middleware.git
cd Video.Middleware
```
    
Install dependencies:
```bash
npm install
```

Configure environment variables:
- Rename .env.example to .env:
```bash
cp .env.example .env
```
- Update the .env file with your configurations

Start the server:
```bash
npm start
```
The server will start on the port specified in the .env file (default is 3000).

## 📂 Directory Structure

```bash
Video.Middleware/
├── controllers/       # Route handlers
├── public/            # Static files and outputs
├── routes/            # API routes
├── services/          # Core processing logic
├── utils/             # Utility functions
├── app.js             # Main application file
├── package.json       # Project metadata and scripts
└── .env               # Environment configurations

```

## 📡 API Endpoints
- GET /start: Initiates the RTSP stream processing.

- GET /stop: Stops the RTSP stream processing.

- GET /status: Retrieves the current status of the stream processing.

Note: Ensure proper authentication and validation in production environments.

## 🧪 Testing
To test the application:

Start the server.

- Access http://localhost:3000/start to begin processing.

- Access http://localhost:3000/status to check the status.

- Access http://localhost:3000/stop to end processing.

- Processed files will be saved in the public/outputs directory.

## 📝 License
This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License.

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.
