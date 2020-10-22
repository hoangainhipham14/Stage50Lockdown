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
    // let the user create body-less project, e.g. title + image + files idk
    // required: true,
  },

  image: {
    data: Buffer,
    contentType: String,
    fileName: String,
  },

  additionalImages: [
    {
      data: Buffer,
      contentType: String,
      fileName: String,
    },
  ],

  additionalFiles: [
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
    type: String,
  },

  // Added this to determine if the item is ready for public viewing
  itemIsPublic: {
    type: Boolean,
    default: true,
  },

  // A way to connect the user to the project
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

projectSchema.index({
  _userId: 1,
});

module.exports = mongoose.model("Project", projectSchema);
