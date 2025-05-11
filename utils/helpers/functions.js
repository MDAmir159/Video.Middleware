const fs = require("fs");
const path = require("path");

const getCurrentTimeStamp = () => {
    return new Date().getTime();
}
// const processingFiles = new Set();

// const renameFilesWithTimestamp = (directory) => {
//     console.log("Watching directory for changes:", directory);

//     fs.watch(directory, (eventType, filename) => {
//         if (eventType === "rename" && filename.startsWith("frame_") && filename.endsWith(".jpg")) {
//             const oldPath = path.join(directory, filename);

//             // Ensure the file exists before proceeding
//             fs.stat(oldPath, (err, stats) => {
//                 if (err || !stats.isFile() || processingFiles.has(filename)) {
//                     return;
//                 }

//                 processingFiles.add(filename);

//                 const newFileName = `frame_${getCurrentTimeStamp()}.jpg`;
//                 const newPath = path.join(directory, newFileName);

//                 // Rename the file
//                 fs.rename(oldPath, newPath, (renameErr) => {
//                     if (renameErr) {
//                         console.error(`Error renaming file ${filename}:`, renameErr);
//                     } else {
//                         console.log(`File renamed: ${filename} -> ${newFileName}`);
//                     }

//                     // Remove from processing set after renaming
//                     processingFiles.delete(filename);
//                 });
//             });
//         }
//     });
// };

module.exports = {
    getCurrentTimeStamp,
    // renameFilesWithTimestamp 
}