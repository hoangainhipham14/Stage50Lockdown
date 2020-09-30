const createProject = require("express").Router();
let Project = require("../../models/projectSchema");

createProject.route("/").post((req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const username = req.body.username;

  const newProject = new Project({
    title: title,
    description: description,
    username: username,
  });

  newProject
    .save()
    .then((user) => res.json(user))
    .catch((err) => console.log(err));
});

module.exports = createProject;
