const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const ejs = require("ejs");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// Embedded JavaScript
app.set("view engine", "ejs");

const uri = process.env.ATLAS_URI;

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

const userVerify = require("./routes/api/verify");
const userSignUp = require("./routes/api/signup");
const userSignIn = require("./routes/api/signin");
const userSignIn = require("./routes/api/signin");
const userLogOut = require("./routes/api/logout");

app.use("/users/verify", userVerify);
app.use("/users/signin", userSignIn);
app.use("/users/logout", userLogOut);
app.use("/users/signup", userSignUp);

const uploadimg = require("./routes/api/uploadimg");

app.use("/upload", uploadimg);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
