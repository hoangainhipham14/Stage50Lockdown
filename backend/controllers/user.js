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
  });
};

exports.userByUsername = (req, res, next, username) => {
  User.findOne({ username: username }).exec((err, user) => {
    if (err || !user) {
      return res.send({
        message: "Profile does not exist",
      });
    }
    req.profile = user; //add
  });
};

exports.userPhoto = (req, res, next) => {
  if (req.profile.image.data) {
    res.set(("Content-Type", req.profile.image.contentType));
    return res.send(req.profile.image.data);
  }
  next();
};

exports.getUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.createUser = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields) => {
    console.log(fields);
    //save
    let newUser = new User(fields);

    newUser.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      // console.log("user after update with formdata: ", user);
      res.json(newUser);
    });
  });
};
