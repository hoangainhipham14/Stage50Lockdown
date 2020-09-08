// Navigate to /upload route, images uploaded should be found in the upload directory
const multer = require("multer");
const path = require("path");
const uploadimg = require("express").Router();

const uploadpath = path.join("./upload/");
const uploadview = path.join("../routes/views/uploadimage");

uploadimg.route("/").post((req, res) => {
  // Set Storage Engine
  const storage = multer.diskStorage({
    destination: uploadpath,
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

  // Init Upload
  const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  }).single("myImage");

  // Check File Type
  function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;

    // Check extension
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    // Check MIME type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images Only");
    }
  }

  upload(req, res, (err) => {
    if (err) {
      res.render(uploadview, {
        msg: err,
      });
    } else {
      if (req.file == undefined) {
        res.render(uploadview, {
          msg: "Error: No File Selected!",
        });
      } else {
        res.render(uploadview, {
          msg: "File Uploaded!",
          file: `${uploadpath}${req.file.filename}`,
        });
      }
    }
  });
});

uploadimg.route("/").get((req, res) => {
  res.render(uploadview);
});

module.exports = uploadimg;
