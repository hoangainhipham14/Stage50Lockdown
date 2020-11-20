const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  signout,
  fbSignin,
  recoverPassword,
  requestRecovery,
  validation,
  resendValidation,
  deleteUser,
  changePassword,
} = require("../controllers/auth");

const { requireAuthentication } = require("../controllers/auth");

// Sign up/in/out
router.post("/signin", signin);
router.post("/signup", signup);
router.get("/signout", signout);
router.post("/fbSignin", fbSignin);

// Password recovery
router.post("/requestRecovery", requestRecovery);
router.post("/recoverPassword", recoverPassword);

// Authenticated password changing
router.post("/changepassword", requireAuthentication, changePassword);

// Email validation
router.get("/validation/:token", validation);
router.post("/resendValidation", resendValidation);

// Account deletion
router.delete("/deleteuser", requireAuthentication, deleteUser);

module.exports = router;
