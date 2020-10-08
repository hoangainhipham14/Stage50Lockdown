const Project = require("../models/project");

const formidable = require("formidable");
const fs = require("fs");

// Creates the project
exports.createProject = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        image: "There was a problem creating your project",
      });
    }

    console.log("Fields\n", fields);
    console.log("Got", Object.keys(files).length, "files.");
    console.log(Object.keys(files));

    // number of additional files in the project
    // all the files in the request are "additional files" except the main image
    const numFiles = Object.keys(files).length - (files.image ? 1 : 0);
    for (var i = 0; i < numFiles; i++) {
      console.log(files[`file-${i}`]);
    }

    // NEED TO WORK OUT HOW TO SAVE THE FILES

    // create the new project
    let project = new Project(fields);

    // add the image to the project

    if (files.image) {
      project.image.data = fs.readFileSync(files.image.path);
      project.image.contentType = files.image.type;
      project.image.fileName = files.image.name;
    }

    // save the new project
    project.save((err, result) => {
      if (err) {
        return res.status(500).json({
          image: "Image could not be saved",
        });
      } else {
        res.json(result);
      }
    });
  });
};

// Project parameter field, finds the project in the database
exports.projectById = (req, res, next, id) => {
  Project.findById(id)
    .populate("postedBy", "_id name")
    .exec((err, project) => {
      if (err || !project) {
        return res.status(400).json({
          error: err,
        });
      }
      req.project = project;

      next();
    });
};

// Image Response
exports.image = (req, res, next) => {
  res.set({
    "Content-Disposition": "inline; filename=" + req.project.image.fileName,
    "Content-Type": req.project.image.contentType,
  });
  return res.send(req.project.image.data);
};

// Responds with the project containing the data inside
exports.singleProject = (req, res) => {
  const data = {
    title: req.project.title,
    body: req.project.body,
  };

  return res.json(data);
};
