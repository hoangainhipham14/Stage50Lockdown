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

  // images: [
  //   {
  //     data: Buffer,
  //     contentType: String,
  //     fileName: String,
  //   },
  // ],

  images: [
    {
      fileRef: {
        type: ObjectId,
        ref: "File",
      },
      fileName: {
        type: String,
        required: true,
      },
    },
  ],

  mainImageIndex: {
    type: Number,
  },

  // additionalFiles: [
  //   {
  //     data: Buffer,
  //     contentType: String,
  //     fileName: String,
  //   },
  // ],

  additionalFiles: [
    {
      fileRef: {
        type: ObjectId,
        ref: "File",
      },
      fileName: {
        type: String,
        required: true,
      },
    },
  ],

  // postedBy: {
  //   type: ObjectId,
  //   ref: "User",
  // },

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

  username: {
    type: String,
  },
});

// Text indexes for search
projectSchema.index({
  title: "text",
  about: "text",
  body: "text",
});

// idk how this works but it works
projectSchema.index({
  _userId: 1,
  title: 1,
  about: 1,
  body: 1,
});

projectSchema.on("index", function (err) {
  if (err) {
    console.error("Project index error: %s", err);
  } else {
    console.info("Project indexing complete");
  }
});

module.exports = mongoose.model("Project", projectSchema);
