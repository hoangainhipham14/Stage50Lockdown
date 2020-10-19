const express = require("express");
const router = express.Router();
const {
  createProject,
  singleProject,
  projectById,
  image,
  ProjectList,
  toggleProjectPrivacy,
  generateProjectLink,
  connectLinkToProject,
  singleFile,
} = require("../controllers/project");

const { userById } = require("../controllers/user");
const { requireAuthentication } = require("../controllers/auth");

router.post("/project/create/:userId", requireAuthentication, createProject);
// router.get("/projects", getProject);
// router.get("/Projects/by/:userId", requireAuthentication, ProjectsByUser);
router.get("/project/:projectId/img", image);
router.get("/project/:projectId/file/:index", singleFile);

router.get("/project/:projectId", singleProject);

// this should post to exports.getProject
router.post("/project/list", ProjectList);
router.post("/project/togglePrivacy/:projectId", toggleProjectPrivacy);

// This should connect a link to a project for a user
router.post("/project/generateLink", generateProjectLink);
router.get("/project/link/:link", connectLinkToProject);

// router.post("/upload", uploadFile);

// router.param("userId", userById);
router.param("projectId", projectById);
module.exports = router;
