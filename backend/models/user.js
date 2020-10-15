const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

// firstname has been changed to firstName etc.
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
  },
  password: {
    type: String,
    // required: true,
  },

  image: {
    data: Buffer,
    contentType: String,
    fileName: String,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
  isValidated: {
    type: Boolean,
    default: false,
  },
});

// Add secondary indexes to userSchema. Allows searching
userSchema.index({ firstName: "text", lastName: "text", username: "text" });

userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.on("index", function (err) {
  if (err) {
    console.error("User index error: %s", err);
  } else {
    console.info("User indexing complete");
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
