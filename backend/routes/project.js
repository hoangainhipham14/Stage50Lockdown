const express = require("express");
const router = express.Router();
const {
  createProject,
  singleProject,
  projectById,
  image,
  postProjectList,
  toggleProjectPrivacy,
} = require("../controllers/project");

const { userById } = require("../controllers/user");
const { requireAuthentication } = require("../controllers/auth");

router.post("/project/create/:userId", requireAuthentication, createProject);
// router.get("/projects", getProject);
// router.get("/Projects/by/:userId", requireAuthentication, ProjectsByUser);
router.get("/project/img/:projectId", image);

router.get("/project/:projectId", singleProject);

// this should post to exports.getProject
router.post("/project/list", postProjectList);
router.post("/project/togglePrivacy/:projectId", toggleProjectPrivacy);

// router.param("userId", userById);
router.param("projectId", projectById);
module.exports = router;
