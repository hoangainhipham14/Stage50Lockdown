const Project = require("../models/project");
const _ = require("lodash");
const moment = require("moment");
const formidable = require("formidable");
const fs = require("fs");

// Creates the project
exports.createProject = (req, res, next) => {
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
      project.image.fileName = files.image.name;
    }

    project = _.extend(project, fields);

    // add MM/DD/YYYY
    today = Date.now();
    project.created = moment(today).utc().format("MM/DD/YYYY");

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
  /*
Changed this so were not sending data to the front end that is private
*/
  if (req.project.itemIsPublic) {
    const data = {
      title: req.project.title,
      about: req.project.about,
      body: req.project.body,
      itemIsPublic: req.project.itemIsPublic,
    };
    return res.json(data);
  } else {
    const falseData = {
      title: "",
      about: "",
      body: "",
      itemIsPublic: req.project.itemIsPublic,
    };
    return res.json(falseData);
  }
};

// Returns an array of projects the user has made (Provided it has the userId attached to it)
exports.ProjectList = (req, res) => {
  const userID = req.body.userID;

  Project.find({ _userId: userID }).exec((err, projects) => {
    if (err || projects.length === 0) {
      return res.send({
        message: "Projects do not exist",
      });
    }
    req.projects = projects; //add
    return res.json(req.projects);
  });
};

// toggles the privacy setting of a particular project
exports.toggleProjectPrivacy = (req, res) => {
  const projectID = req.body.projectID;

  Project.findById(projectID).exec((err, project) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    } else {
      if (project.itemIsPublic) {
        //console.log("Item is now private");
        project.itemIsPublic = false;
        project.save();
        return res.status(200);
      } else if (!project.itemIsPublic) {
        //console.log("Item is now public");
        project.itemIsPublic = true;
        project.save();
        return res.status(200);
      }
    }
  });
};
