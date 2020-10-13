const Project = require("../models/project");
const ProjectLink = require("../models/projectLink");

const crypto = require("crypto");
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

/* 3 Possibilies:
    Project is private
    Project is public
    Project is accesed with a link
*/
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
  }
  else {
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
exports.postProjectList = (req, res) => {
  const userID = req.body.userID;
  console.log("entering getProjectList: " + userID);

  Project.find({ _userId: userID }).exec((err, projects) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    } else {
      console.log(projects);
      return res.status(200).json(projects);
    }
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

// Generate a link for the user to reference a project even if it is private
exports.generateProjectLink= (req, res) => {
  
  /*Accepts parameters including:
  The user id
  The project id
  The time that they want the link to work for 
  */
  const userID = req.body.userID;
  const projectID = req.body.projectID;
  const requiredTime = req.body.requiredTime;

  // Generate a link
  const projectLinkString = req.headers.host + "/projects/link/" + crypto.randomBytes(32).toString("hex");

  // Check to make sure link hasnt been used before
  if(ProjectLink.findOne({link: projectLinkString}) == true){
    return res.status(400).json({msg: "Link generated was already used"});
  }

  // Create that link in the database
  let newProjectLink = new ProjectLink({
    _userId: userID,
    _projectId: projectID,
    link: projectLinkString,
  });
  newProjectLink.createdAt.expires = requiredTime;

  // Save the Schema and return a link
  newProjectLink.save();
  return res.status(200);
}

// This accepts a link provided by a user and returns a project even if it is private
exports.connectLinkToProject = (req, res) => {

  // Extract the project link from the end of the line
  const projectLink = req.params.link;

  console.log("Searching database with: " + projectLink);

  // Provided the link is valid, pass on the link to the particular project
  ProjectLink.findOne({link: projectLink}).exec((err, link) => {
    
    console.log("Matching link has been found");
    // Check for errors
    if(err){
      return res.status(400).json({
        error: err,
      });
    }
    else 
    {
      const projectId = link._projectId;
      // Find the project
      Project.findOne({link: projectLink}).exec((err, projects) => {
        console.log("Project has been connected to the link");
        if(err){
          return res.status(400).json({
          error: err,
        })} else {
          // Return the project values that are relevant
          const data = {
          title: project.title,
          about: project.about,
          body: project.body,
          // Preset this value to true so that the item can be viewed by the person
          // with the link
          itemIsPublic: true,
          // Pass the id through as well as it doesnt come through inately with the link
         };
         return res.json(data);
        }
      });
    }
  });
}