const Project = require("../models/project");
const ProjectLink = require("../models/projectLink");
const User = require("../models/user");
const File = require("../models/file");
const crypto = require("crypto");
const _ = require("lodash");
const moment = require("moment");

const formidable = require("formidable");
const fs = require("fs");
const e = require("express");

exports.hasAuthorisation = (req, res, next) => {
  const projectPublic = req.project && req.project.itemIsPublic;
  const isOwner =
    req.project && req.auth && req.project._userId._id == req.auth._id;
  if (projectPublic || isOwner) {
    next();
  } else {
    return res.status(403).json({
      error: "Project is private.",
    });
  }
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
  //console.log(JSON.stringify(req.project));

  const isOwner =
    req.project && req.auth && req.project._userId._id == req.auth._id;

  const data = {
    title: req.project.title,
    about: req.project.about,
    body: req.project.body,

    imagesNames: req.project.images.map((file) => file.fileName),
    mainImageIndex: req.project.mainImageIndex,
    additionalFilesNames: req.project.additionalFiles.map(
      (file) => file.fileName
    ),

    itemIsPublic: req.project.itemIsPublic,

    editingPrivileges: isOwner,
  };
  return res.json(data);

  // if (req.project.itemIsPublic) {
  //   const data = {
  //     title: req.project.title,
  //     about: req.project.about,
  //     body: req.project.body,

  //     imagesNames: req.project.images.map((file) => file.fileName),
  //     mainImageIndex: req.project.mainImageIndex,
  //     additionalFilesNames: req.project.additionalFiles.map(
  //       (file) => file.fileName
  //     ),

  //     itemIsPublic: req.project.itemIsPublic,
  //   };
  //   return res.json(data);
  // } else if (req.project) {
  //   return res.status(403).json({
  //     error: "Project is private.",
  //   });
  // } else {
  //   return res.status(404).json({
  //     error: "Project does not exist.",
  //   });
  // }

  // else {
  //   console.log("Project is private or does not exist.");
  //   return res.status(400).json({
  //     error: "Project does not exist",
  //   });
  // }
};

async function uploadFile(file) {
  let newFile = new File({
    data: fs.readFileSync(file.path),
    contentType: file.type,
    fileName: file.name,
  });

  await newFile.save();
  return newFile._id;
}

// Creates the project
exports.createProject = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    console.log("===================================");
    console.log(fields);
    for (i in files) console.log(i, files[i].name);
    console.log("===================================");
    if (err) {
      return res.status(400).json({
        image: "There was a problem creating your project",
      });
    }

    // create the new project
    let project = new Project({
      title: fields.title,
      about: fields.about,
      body: fields.body,
      mainImageIndex: JSON.parse(fields.mainImageIndex),
      _userId: fields._userId,
    });

    // upload the images
    const numImages = JSON.parse(fields.numImages);
    const imageRefs = [];
    for (var i = 0; i < numImages; i++) {
      const image = files[`image-${i}`];
      const id = await uploadFile(image);
      if (!id) {
        console.log("FAILURE UPLOADING FILE");
      } else {
        imageRefs.push({
          fileRef: id,
          fileName: image.name,
        });
      }
    }
    project.images = imageRefs;

    // upload the files
    const numFiles = JSON.parse(fields.numAdditionalFiles);
    const fileRefs = [];
    for (var i = 0; i < numFiles; i++) {
      const file = files[`file-${i}`];
      const id = await uploadFile(file);
      if (!id) {
        console.log("FAILURE UPLOADING FILE");
      } else {
        fileRefs.push({
          fileRef: id,
          fileName: file.name,
        });
      }
    }
    project.additionalFiles = fileRefs;

    // return res.status(400).json({ test: "success" });

    // TALK TO NHI ABOUT THIS
    // project = _.extend(project, fields);

    // add MM/DD/YYYY
    today = Date.now();
    project.created = moment(today).utc().format("MM/DD/YYYY");

    // return res.status(400).json({ success: "test" });

    // save the new project
    project.save((err, result) => {
      if (err) {
        console.log("Saving error:", err);
        return res.status(500).json({
          error: "Failed to save project.",
        });
      } else {
        console.log("Saving success! Data:");
        console.log(result);
        res.json({
          projectId: result._id,
        });
      }
    });
  });
};

// Edit a project
exports.editProject = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    console.log("===================================");
    console.log(fields);
    for (i in files) console.log(i, files[i].name);
    console.log("===================================");
    if (err) {
      return res.status(400).json({
        image: "There was a problem updated your project",
      });
    }

    // the project to be edited
    let project = req.project;

    project.title = fields.title;
    project.about = fields.about;
    project.body = fields.body;

    // update the index of the main image
    // yes, i know this is fucking disgusting.
    const mainImageIndexRel = JSON.parse(fields.mainImageIndex);
    const mainImageIsNew = JSON.parse(fields.mainImageIsNew);
    const imagesToDelete = JSON.parse(fields.imagesToDelete);
    let mainImageIndex;
    if (mainImageIndexRel === null) {
      mainImageIndex = null;
    } else {
      if (mainImageIsNew) {
        const numOldImagesAfterUpdate =
          project.images.length - imagesToDelete.length;
        mainImageIndex = numOldImagesAfterUpdate + mainImageIndexRel;
      } else {
        mainImageIndex = mainImageIndexRel;
      }
    }
    project.mainImageIndex = mainImageIndex;

    // remove additional images removed by the user
    imagesToDelete.forEach((i) => {
      // need to genuinely delete this image from the database, not just its
      // reference in the project
      const id = project.images[i].fileRef;
      File.findByIdAndDelete(id, (err) => {
        if (err) {
          console.log("Error deleting image:", err);
          // no need to alert the user here.
        }
      });
    });
    project.images = project.images.filter(
      (_, i) => !imagesToDelete.includes(i)
    );

    // add any new additional images
    const numNewImages = parseInt(fields.numNewImages);
    for (var i = 0; i < numNewImages; i++) {
      const image = files[`image-${i}`];
      const id = await uploadFile(image);
      if (!id) {
        console.log("FAILURE UPLOADING FILE");
      } else {
        project.images.push({
          fileRef: id,
          fileName: image.name,
        });
      }
    }

    // remove additional images removed by the user
    const filesToDelete = JSON.parse(fields.filesToDelete);
    filesToDelete.forEach((i) => {
      const id = project.additionalFiles[i].fileRef;
      File.findByIdAndDelete(id, (err) => {
        if (err) {
          console.log("Error deleting file:", err);
          // no need to alert the user here.
        }
      });
    });
    project.additionalFiles = project.additionalFiles.filter(
      (_, i) => !filesToDelete.includes(i)
    );

    // add any new additional files
    const numNewFiles = parseInt(fields.numNewAdditionalFiles);
    for (var i = 0; i < numNewFiles; i++) {
      const file = files[`file-${i}`];
      const id = await uploadFile(file);
      if (!id) {
        console.log("FAILURE UPLOADING FILE");
      } else {
        project.additionalFiles.push({
          fileRef: id,
          fileName: file.name,
        });
      }
    }

    // return res.status(400).json({ test: "success" });
    console.log("Saving...");
    project.save((err, result) => {
      if (err) {
        console.log("Saving error:", err);
        return res.status(500).json({
          image: "Project could not be updated",
        });
      } else {
        console.log("Saving success!");
        res.json(result);
      }
    });
  });
};

exports.isOwner = (req, res, next) => {
  console.log("isOwner?");
  console.log("req.auth:", req.auth);
  let isOwner =
    req.project && req.auth && req.project._userId._id == req.auth._id;
  if (!isOwner) {
    return res.status(403).json({
      error: "Unauthorised.",
    });
  }
  next();
};

// Project parameter field, finds the project in the database
exports.projectById = (req, res, next, id) => {
  try {
    Project.findById(id)
      .populate("postedBy", "_id name")
      .exec((err, project) => {
        if (!project) {
          return res.status(400).json({
            error: "Project not found.",
          });
        } else if (err) {
          console.log("ERROR:\n", err);
          return res.stats(500).json({
            error: "Server error.",
          });
        }
        req.project = project;
        next();
      });
  } catch (err) {
    return res.status(400).json({
      error: "Project not found.",
    });
  }
};

// Return main image of project
exports.image = (req, res, next) => {
  const mainImageIndex = req.project.mainImageIndex;
  if (mainImageIndex === null) {
    return res.status(400).json({
      error: "Project has no main image",
    });
  }
  const imageId = req.project.images[mainImageIndex].fileRef;
  File.findById(imageId).exec((err, image) => {
    if (err) {
      return res.status(500).json({
        error: "Server error.",
      });
    } else if (!image) {
      return res.status(400).json({
        error: "Image not found.",
      });
    }

    // no problems! send the image
    res.set({
      "Content-Disposition": `filename="${image.fileName}"`,
      "Content-Type": image.contentType,
    });
    return res.send(image.data);
  });
};

// Send the ith additional file as an attachment
exports.singleFile = (req, res, next) => {
  const fileId =
    req.project.additionalFiles[parseInt(req.params.index)].fileRef;
  File.findById(fileId).exec((err, file) => {
    if (err) {
      return res.status(500).json({
        error: "Server error.",
      });
    } else if (!file) {
      return res.status(400).json({
        error: "File not found.",
      });
    }

    // no problems! send the file
    res.set({
      "Content-Disposition": `attachment; filename="${file.fileName}"`,
      "Content-Type": file.contentType,
    });
    return res.send(file.data);
  });
};

exports.singleImage = (req, res, next) => {
  const imageId = req.project.images[parseInt(req.params.index)].fileRef;
  File.findById(imageId).exec((err, image) => {
    if (err) {
      return res.status(500).json({
        error: "Server error.",
      });
    } else if (!image) {
      return res.status(400).json({
        error: "Image not found.",
      });
    }

    // no problems! send the image
    res.set({
      "Content-Disposition": `filename="${image.fileName}"`,
      "Content-Type": image.contentType,
    });
    return res.send(image.data);
  });
};

exports.allImages = (req, res, next) => {
  res.send(req.project.images);
};

// Returns an array of projects the user has made (Provided it has the userId attached to it)
exports.ProjectList = (req, res) => {
  const username = req.body.username;

  User.findOne({ username: username }).exec((err, user) => {
    if (err) {
      console.log("ERROR:", err);
      return res.status(500).json({
        error: "Server error.",
      });
    } else if (!user) {
      console.log("FAILED TO FIND USER");
      return res.status(400).json({
        error: "User does not exist.",
      });
    }
    Project.find(
      { _userId: user._id },
      "_id title about created itemIsPublic"
    ).exec((err, projects) => {
      // console.log("user", user._id);
      // console.log("projects", projects);
      if (err || projects.length === 0) {
        return res.send({
          message: "Projects do not exist",
        });
      }

      req.projects = projects; //add
      console.log(projects);
      return res.json(req.projects);
    });
  });
};

// toggles the privacy setting of a particular project
exports.toggleProjectPrivacy = (req, res) => {
  console.log("toggle!");
  try {
    req.project.itemIsPublic = !req.project.itemIsPublic;
    req.project.save();
    console.log(req.project);
    return res.status(200).json({});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error." });
  }
};

// Generate a link for the user to reference a project even if it is private
exports.generateProjectLink = (req, res) => {
  /*Accepts parameters including:
  The user id
  The project id
  The time that they want the link to work for 
  */
  const projectID = req.body.projectID;
  const isPermanent = req.body.isPermanent;
  let requiredTime = req.body.requiredTime;

  // Infinate time (Might be a problem in 100 years)
  const infiniteTime = 52560000;

  // Set the permenant time if it is a constant link
  if (isPermanent == true) {
    requiredTime = infiniteTime;
  }

  // Generate a link
  let projectLink = crypto.randomBytes(10).toString("hex");

  // Check to make sure link hasnt been used before
  if (ProjectLink.findOne({ link: projectLink }) == true) {
    return res.status(400).json({ msg: "Link generated was already used" });
  }

  // Create that link in the database
  let newProjectLink = new ProjectLink({
    _projectId: projectID,
    link: projectLink,
    requiredTime: requiredTime,
  });

  console.log("NEW LINK: " + newProjectLink);

  // Save the Schema and return a link
  newProjectLink
    .save()
    .catch((err) => console.log("Error saving user session:", err));
  console.log("Link saved...");

  let fullLink =
    "https://" + req.headers.host + "/projects/link/" + newProjectLink.link;
  return res.status(200).json(fullLink);
};

////
// This accepts a link provided by a user and returns a project even if it is private
////
exports.connectLinkToProject = (req, res) => {
  // Extract the project link from the end of the line
  // Note here the req.headers.host will change weather it is local or public
  const projectLink = req.params.link;

  console.log("Searching database with: " + projectLink);

  // Provided the link is valid, pass on the link to the particular project
  ProjectLink.findOne({ link: projectLink }).exec((err, link) => {
    //console.log("link: " + link);

    // Custom error for an expired link (To be tested)
    // Convert the minutes into miliseconds 1*60*1000
    const validTill = link.createdAt.getTime() + link.requiredTime * 60000;
    const currTime = Date.now();

    //console.log("validTill :" + validTill);
    //console.log("currTime: " + currTime);
    if (validTill < currTime) {
      console.log("Link has expired");
      return res.json({ error: "Expired Link" });
    }

    /*** Links are matching when they shouldnt ***/
    // Check for errors
    if (err) {
      console.log("error....");
      return res.status(400).json({
        error: err,
      });
    } else {
      const projectId = link._projectId;

      /*
      console.log(
        "Matching link has been found... Searching for project with id: " +
          projectId
      );
      */

      // Essentially backing frontend queries on the backend
      // Find the project
      Project.findById(projectId).exec((err, project) => {
        if (err) {
          console.log(JSON.stringify(err));
          return res.status(400).json({ error: "Error occured" });
        }
        /*
        Changed this so were not sending data to the front end that is private
        */
        //console.log(JSON.stringify(project));
        if (project) {
          const data = {
            title: project.title,
            about: project.about,
            body: project.body,

            imagesNames: project.images.map((file) => file.fileName),
            mainImageIndex: project.mainImageIndex,
            additionalFilesNames: project.additionalFiles.map(
              (file) => file.fileName
            ),
            itemIsPublic: true,
            // Pass through the id as well as it doesnt come inately
            _id: projectId,
          };

          return res.json(data);
        } else {
          console.log("Project is private or does not exist.");
          return res.status(400).json({
            error: "Project does not exist",
          });
        }
      });
    }
  });
};

// Exported differently as there is never an API call for this
// function from the frontend
function deleteAllUserProjects(userId) {
  console.log("Deleting Projects with: " + userId);
  Project.deleteMany({ _userId: userId }, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Project deletion success for: " + userId);
    }
  });
}

module.exports.deleteAllUserProjects = deleteAllUserProjects;
