const express = require("express");
const router = express.Router();
const {
  createProject,
  singleProject,
  projectById,
  image,
} = require("../controllers/project");

const { userById } = require("../controllers/user");
const { requireAuthentication } = require("../controllers/auth");

router.post("/project/create/:userId", requireAuthentication, createProject);
// router.get("/projects", getProject);
// router.get("/Projects/by/:userId", requireAuthentication, ProjectsByUser);
router.get("/project/img/:projectId", image);

router.get("/project/:projectId", singleProject);

// router.param("userId", userById);
router.param("projectId", projectById);
module.exports = router;
