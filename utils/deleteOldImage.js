const fs = require('fs');

// Helper function to delete old images from the server
const deleteOldImage = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error(`Error deleting file: ${filePath}`, err);
    else console.log(`Deleted file: ${filePath}`);
  });
};

module.exports = deleteOldImage;
