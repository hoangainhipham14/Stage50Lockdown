const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
    unique: true,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
