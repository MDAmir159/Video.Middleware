require("dotenv").config();
const fs = require('fs');
const path = require('path');

const FRAME_CAPTURE_DIR = process.env.FRAME_CAPTURE_DIR;
const CHUNK_CAPTURE_DIR = process.env.CHUNK_CAPTURE_DIR;
const BASE64_CAPTURE_DIR = process.env.BASE64_CAPTURE_DIR;

// Path to the captures folders
const framesFolderPath = path.join(__dirname, FRAME_CAPTURE_DIR);
const chunkedFolderPath = path.join(__dirname, CHUNK_CAPTURE_DIR);
const base64FolderPath = path.join(__dirname, BASE64_CAPTURE_DIR);

// Helper function to clear the contents of a folder
const clearFolderContents = (folderPath) => {
    if (fs.existsSync(folderPath)) {
        fs.readdir(folderPath, (err, files) => {
            if (err) {
                console.error(`Error reading folder: ${folderPath}`, err);
                return;
            }

            console.log(`Clearing contents of ${folderPath}...`);

            // Iterate over each file in the folder
            files.forEach((file) => {
                const filePath = path.join(folderPath, file);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Error deleting file: ${file}`, err);
                    }
                });
            });

            console.log(`All contents of ${folderPath} have been deleted.`);
        });
    } else {
        console.log(`Folder does not exist: ${folderPath}`);
    }
};

// Main function to clear all folders
const clearCaptures = () => {
    clearFolderContents(framesFolderPath);
    clearFolderContents(chunkedFolderPath);
    clearFolderContents(base64FolderPath);
};

// Execute the function to clear the captures folders
clearCaptures();