const Project = require("../models/project");

const formidable = require("formidable");
const fs = require("fs");

exports.createProject = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        image: "Image could not be uploaded",
      });
    }

    console.log(fields);
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

exports.image = (req, res, next) => {
  res.set({
    "Content-Disposition": "inline; filename=" + req.project.image.fileName,
    "Content-Type": req.project.image.contentType,
  });
  return res.send(req.project.image.data);
};

exports.singleProject = (req, res) => {
  const data = {
    title: req.project.title,
    body: req.project.body,
  };

  return res.json(data);
};
