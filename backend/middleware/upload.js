const multer = require("multer");
const path = require("path");

// Configure storage for all files in the 'public' directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "image") {
      cb(null, "public/images"); // Store images in public/images
    } else if (file.fieldname === "files") {
      cb(null, "public/files"); // Store multiple files in public/files
    } else {
      cb(new Error("Invalid field name"));
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const uploadMiddleware = (req, res, next) => {
  console.log("in middleware");

  //check if files or image already uploaded
  if (req.file || (req.files && Object.keys(req.files).length > 0)) {
    console.log("File(s) already uploaded, skipping multer");
    return next();
  }
  console.log(req.body);

  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "files", maxCount: 10 },
  ])(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res
        .status(400)
        .json({ status: "failed", msg: "File upload error: " + err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).json({
        status: "failed",
        msg: "Unknown error occurred: " + err.message,
      });
    }

    // If no files were provided, just continue to the next middleware
    next();
  });
};

module.exports = uploadMiddleware;
