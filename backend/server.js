const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 7000;


app.use(cors());
app.use(express.json());


const uri = process.env.ATLAS_URI;

//add { useUnifiedTopology: true } to avoid DeprecationWarning
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

const userSignUp = require("./routes/api/signup");

app.use("/users/signup", userSignUp);

/*
app.post('/confirmation', userController.confirmationPost);
app.post('/resend', userController.resendTokenPost);
*/

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
