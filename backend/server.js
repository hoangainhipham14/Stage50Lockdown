const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
// Embedded JavaScript
app.set("view engine", "ejs");

const uri =
  "mongodb+srv://Rowan:CloudPassword1@cluster0.xwvij.mongodb.net/itproject?retryWrites=true&w=majority";

//add { useUnifiedTopology: true } to avoid DeprecationWarning
mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// authentication

const userVerify = require("./routes/api/verify");
const userSignUp = require("./routes/api/signup");
const userSignIn = require("./routes/api/signin");
const userLogOut = require("./routes/api/logout");

app.use("/users/verify", userVerify);
app.use("/users/signin", userSignIn);
app.use("/users/logout", userLogOut);
app.use("/users/signup", userSignUp);
app.use("/users/signin", userSignIn);

// email validation

const userEmailValidation = require("./routes/api/validation");
const userResendValidation = require("./routes/api/resendValidation");

app.use("/users/validation", userEmailValidation);
app.use("/users/resendValidation", userResendValidation);

// profile urls

const profile = require("./routes/api/profile");
app.use("/users/", profile);

// image upload

const uploadimg = require("./routes/api/uploadimg");
app.use("/upload", uploadimg);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("../client/build"));
}

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
