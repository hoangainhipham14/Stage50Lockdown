const { fstat } = require("fs");
// Navigate to /upload route, images uploaded should be found in the upload directory
const multer = require("multer");
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
// const bodyParser = require('body-parser')
// const methodOverride = require('method-override');
const path = require("path");
const resendValidation = require("./resendValidation");
const upload = require("express").Router();
const crypto = require("crypto");

// const uploadPath = path.join("./upload/");

// const uploadView = path.join("../routes/views/uploadimage");

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.ATLAS_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

const uploading = multer({ storage });

upload.route("/").post(uploading.single('file'), (req, res) => {
});

// @route GET /image/:filename
// @desc Display Image
upload.get('/', (req, res) => {
  
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

module.exports = upload;
