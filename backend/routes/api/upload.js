const { fstat } = require("fs");
// Navigate to /upload route, images uploaded should be found in the upload directory
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const path = require("path");
const resendValidation = require("./resendValidation");
const upload = require("express").Router();
const crypto = require("crypto");

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
conn.once("open", () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
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
        const username = req.body.username;
        const fileInfo = {
          filename: filename,
          metadata: username,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const uploading = multer({ storage });

upload.route("/").post(uploading.single("file"), (req, res) => {});

upload.route("/display").get((req, res) => {
  const query = req.query;
  fileName = query.fileName;

  gfs.files.findOne({ filename: fileName }, (err, file) => {
    if (!file || file.length === 0) {
      return res.send({
        err: "No file exists",
      });
    }

    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.on("open", function () {
        // This just pipes the read stream to the response object (which goes to the client)
        readstream.pipe(res);
        // return res.status(200).json();
      });

      readstream.on("error", function (err) {
        res.end(err);
      });
    } else {
      return res.send({
        err: "Not an image",
      });
    }
  });
});

module.exports = upload;
