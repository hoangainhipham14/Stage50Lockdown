const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  about: {
    type: String,
  },

  body: {
    type: String,
    required: true,
  },

  image: {
    data: Buffer,
    contentType: String,
    fileName: String,
  },

  files: [
    {
      data: Buffer,
      contentType: String,
      fileName: String,
    },
  ],

  postedBy: {
    type: ObjectId,
  },

  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Project", projectSchema);
