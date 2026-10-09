const path = require("path");
const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "";

    if (file.fieldname === "profileImage") {
      uploadPath = path.join(__dirname, "../uploads/img/");
    } else if (file.fieldname === "documents") {
      uploadPath = path.join(__dirname, "../uploads/document/");
    }

    // 🚀 Auto-create folder if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "profileImage" && file.mimetype.startsWith("image/")) {
    return cb(null, true);
  }

  if (file.fieldname === "documents" && file.mimetype === "application/pdf") {
    return cb(null, true);
  }

  cb(new Error("Invalid file type. Only images and PDF are allowed."));
};

module.exports = multer({ storage, fileFilter }).fields([
  { name: "profileImage", maxCount: 1 },
  { name: "documents", maxCount: 1 },
]);
