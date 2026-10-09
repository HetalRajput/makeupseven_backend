// middleware/multerConfig.js
const multer = require('multer');
const path = require('path');

// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Uploads folder where images will be stored
  },
  filename: (req, file, cb) => {
    // Generating a unique filename with current timestamp and original file name
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

module.exports = upload.single('image'); // Use `upload.array('images')` for multiple files
