const User = require("../models/user");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Backend; User not found",
      });
    }
    req.profile = user; //add
    console.log(req.profile);
  });
};

// find user from databse by username
exports.userByUsername = (req, res, next, username) => {
  User.findOne({ username: username }).exec((err, user) => {
    if (err || !user) {
      return res.send({
        message: "Profile does not exist",
      });
    }
    req.profile = user; //add
    req.username = username;
    next();
  });
};

exports.userPhoto = (req, res, next) => {
  if (req.profile.image.data) {
    res.set({
      "Content-Disposition": "inline; filename=" + req.project.image.fileName,
      "Content-Type": req.project.image.contentType,
    });
    return res.send(req.profile.image.data);
  }
  next();
};

// get user from database
exports.getUser = (req, res) => {
  // console.log(req.profile);
  return res.json(req.profile);
};

// get user from database
exports.getUsernameId = (req, res) => {
  // console.log("Get Username Id");
  // console.log(req);
  User.findOne({ _id: req.params.id }, function (err, user) {
    if (!user) {
      return res.status(400).send({
        msg: "This user does not exist",
      });
    } else {
      // console.log("Profile details: " + user);
      return res.json(user.username);
    }
  });
};

// Update use information
exports.updateUser = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields) => {
    User.findOneAndUpdate(
      { username: req.username },
      fields,
      { new: true },
      (err, doc) => {
        if (err) {
          console.log("Something wrong when updating data!");
        }
      }
    );
  });
};
