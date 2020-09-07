const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

const userSignUp = require("./routes/api/signup");
const userLogOut = require("./routes/api/logout");
const userSignIn = require("./routes/api/signin");
const profile = require("./routes/api/profile");

app.use("/users/signup", userSignUp);
app.use("/users/logout/", userLogOut);
app.use("/users/signin", userSignIn);
app.use("/users/", profile);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
