const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  signout,
  recoverPassword,
  requestRecovery,
  validation,
  resendValidation,
  deleteUser,
} = require("../controllers/auth");

const { requireAuthentication } = require("../controllers/auth");

// Sign up/in/out
router.post("/signin", signin);
router.post("/signup", signup);
router.get("/signout", signout);

// Password recovery
router.post("/requestRecovery", requestRecovery);
router.post("/recoverPassword", recoverPassword);

// Email validation
router.get("/validation/:token", validation);
router.post("/resendValidation", resendValidation);

// Account deletion
router.delete("/deleteuser", requireAuthentication, deleteUser);

module.exports = router;
