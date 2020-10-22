const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;

//add { useUnifiedTopology: true } to avoid DeprecationWarning
mongoose
  .connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Logs all mongoose calls
// turned off to avoid console logging the entire bytestream of the image
mongoose.set("debug", true);

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/project");
const userRoutes = require("./routes/user");
const searchRoutes = require("./routes/search");

app.use("/api", authRoutes);
app.use("/api", projectRoutes);
app.use("/api", userRoutes);
app.use("/api", searchRoutes);

if (process.env.NODE_ENV === "production") {
  // Turn off mongoose debug mode
  mongoose.set("debug", false);

  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
  });
}

// production
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
