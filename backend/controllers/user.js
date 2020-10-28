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
      "Content-Disposition": "inline; filename=" + req.profile.image.fileName,
      "Content-Type": req.profile.image.contentType,
    });
    return res.send(req.profile.image.data);
  }
  next();
};

// getAccountDetails is different as it requires authentication but 
// allows users to access privacy settings
exports.getUserAccountDetails = (req, res) => {

  User.findOne({ username: req.params.username }).exec((err, user) => {

    if (err || !user) {
      return res.send({
        message: "Profile does not exist",
      });
    }

    let data = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      firstNamePrivate: user.firstNamePrivate,
      lastNamePrivate: user.lastNamePrivate,
      emailPrivate: user.emailPrivate,
      phoneNumberPrivate: user.phoneNumberPrivate,
      profilePrivate: user.profilePrivate,
    }
    
    req.data = data;
    //console.log(req.data);
    return res.json(req.data);
  });

}

// getUserProfile displays the data that will be public on the profile page
// of the user 
exports.getUserProfile = (req, res) => {
  
  User.findOne({ username: req.params.username }).exec((err, user) => {
    if (err || !user) {
      return res.send({
        message: "Profile does not exist",
      });
    }

    let data = { 
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      aboutUser: user.aboutUser,
      photoExist: user.photoExist,
      emailPrivate: user.emailPrivate,
      phoneNumberPrivate: user.phoneNumberPrivate,
    }
    //console.log("Current Data: " + JSON.stringify(data));

    // Set any data to blank that is currently private
    if(user.firstNamePrivate == true){
      data.firstName = "";
    }
    if(user.lastNamePrivate == true){
      data.lastName = "";
    }
    if(user.emailPrivate == true){
      data.email = "";
    }
    if(user.phoneNumberPrivate == true){
      data.phoneNumber = "";
    }

    //console.log("Current Data: " + JSON.stringify(data));
    
    req.data = data;  
    
    return res.json(req.data);
  });
}

/*
getEditProfileDetails will return the data for the edit profile
statement
*/
exports.getEditProfileDetails = (req, res) => {
  User.findOne({ username: req.params.username }).exec((err, user) => {
    if (err || !user) {
      return res.send({
        message: "Profile does not exist",
      });
    }

    let data = { 
      aboutUser: user.aboutUser,
      photoExist: user.photoExist,
    }
     
    req.data = data;  
    
    return res.json(req.data);
  });
}


// get user from database
/*
exports.getUser = (req, res) => {
  
  //console.log(req.profile);
  // Filter out things that shouldnt be sent
  console.log(req.profile);
  return res.json("false");
};
*/


// get user from database
exports.getUsernameId = (req, res) => {
  // console.log("Get Username Id");
  // console.log(req);
  User.findById({ _id: req.params.id }, "username", function (err, user) {
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

  form.parse(req, (err, fields, files) => {
    if (files.userPhoto) {
      let imageObject = {
        image: {
          data: fs.readFileSync(files.userPhoto.path),
          contentType: files.userPhoto.type,
          fileName: files.userPhoto.name,
        },
      };

      fields = Object.assign(fields, imageObject);
    }

    //console.log("FIELDS: " + fields);

    User.findOneAndUpdate(
      { username: req.username },
      fields,
      { new: true },
      (err, doc) => {
        if (err) {
          console.log("Something wrong when updating data!");
          return res.send({
            error: err,
          });
        } else {
          return res.send({
            message: "Success!",
          });
        }
      }
    );
  });
};
