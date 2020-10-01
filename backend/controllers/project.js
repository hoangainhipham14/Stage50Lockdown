const Project = require("../models/project");

const formidable = require("formidable");
const fs = require("fs");

exports.createProject = (req, res, next) => {
  console.log("createProject controller");

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        image: "Image could not be uploaded",
      });
    }

    // create the new project
    let project = new Project(fields);

    // add the image to the project
    if (files.image) {
      project.image.data = fs.readFileSync(files.image.path);
      project.image.contentType = files.image.type;
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
