const { fstat } = require("fs");
// Navigate to /upload route, images uploaded should be found in the upload directory
const multer = require("multer");
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose = require("mongoose");
// const bodyParser = require('body-parser')
// const methodOverride = require('method-override');
const path = require("path");
const resendValidation = require("./resendValidation");
const upload = require("express").Router();
const crypto = require("crypto");

// const uploadPath = path.join("./upload/");

// const uploadView = path.join("../routes/views/uploadimage");

const uri = process.env.ATLAS_URI;

mongoose
  .connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

const conn = mongoose.connection;
conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

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
  
  file = req.file;
  fileName = file.originalname;
  
  gfs.files.findOne({ fileName: fileName}, (err, file) => {
    // Check if file
    // console.log(req.params.filename);
    if (!file || file.length === 0) {
      return res.send({
        err: 'No file exists'
      });
    }

    console.log(file.contentType);
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

upload.route("/").get((req, res) => {
  return res.send("Good");
});

module.exports = upload;