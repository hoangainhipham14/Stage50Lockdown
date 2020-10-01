const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
// Embedded JavaScript
app.set("view engine", "ejs");

// Init gfs
let gfs;

const uri = process.env.ATLAS_URI;

//add { useUnifiedTopology: true } to avoid DeprecationWarning
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

const authRoutes = require("./routes/auth");

app.use("/api", authRoutes);

// // authentication

// const userVerify = require("./routes/api/verify");
// const userSignUp = require("./routes/api/signup");
// const userSignIn = require("./routes/api/signin");
// const userLogOut = require("./routes/api/logout");

// app.use("/api/users/verify", userVerify);
// app.use("/api/users/signin", userSignIn);
// app.use("/api/users/logout", userLogOut);
// app.use("/api/users/signup", userSignUp);
// app.use("/api/users/signin", userSignIn);

// // email validation

// const userEmailValidation = require("./routes/api/validation");
// const userResendValidation = require("./routes/api/resendValidation");

// app.use("/api/users/validation", userEmailValidation);
// app.use("/api/users/resendValidation", userResendValidation);

// // password recovery

// const userRequestRecovery = require("./routes/api/requestRecovery");
// const userRecoverPassword = require("./routes/api/recoverPassword");

// app.use("/recovery/requestRecovery", userRequestRecovery);
// app.use("/recovery/recoverPassword", userRecoverPassword);

// // profile urls

// const profile = require("./routes/api/profile");
// app.use("/api/users/", profile);

// // image upload

// const upload = require("./routes/api/upload");
// app.use("/api/upload", upload);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../client/build")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
//   });
// }

// production
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
