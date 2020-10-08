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

    // create the new project
    let project = new Project(fields);

    // add the main image to the project
    if (files.image) {
      project.image = {
        data: fs.readFileSync(files.image.path),
        contentType: files.image.type,
        fileName: files.image.name,
      };
    }

    // add the additional files to the project
    const numAdditionalFiles =
      Object.keys(files).length - (files.image ? 1 : 0);
    const additionalFiles = [];
    for (var i = 0; i < numAdditionalFiles; i++) {
      const file = files[`file-${i}`];
      additionalFiles.push({
        data: fs.readFileSync(file.path),
        contentType: file.type,
        fileName: file.name,
      });
    }
    project.additionalFiles = additionalFiles;

    // save the new project
    console.log("Saving...");
    project.save((err, result) => {
      if (err) {
        console.log("Saving error:", err);
        return res.status(500).json({
          image: "Image could not be saved",
        });
      } else {
        console.log("Saving success:", result);
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
    about: req.project.about,
    body: req.project.body,
  };

  return res.json(data);
};
