const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/user_contoller.js");

router.get("/profile", passport.checkAuthentication, userController.profile);
router.get("/signup", userController.signUp);
router.get("/signin", userController.signIn);
router.post("/create", userController.create);
router.get("/profile", passport.checkAuthentication, userController.profile);
router.get("/logout", userController.destroySession);
router.post(
  "/update-password",
  passport.checkAuthentication,
  userController.updatePassword
);

// local authentication
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "signin" }),
  userController.createSession
);

// google authentication
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// TODO CREATE SESSION ON LOGIN
router.get(
  "/auth/google/callback/",
  passport.authenticate("google", { failureRedirect: "users/sign-in" }),
  userController.createSession
);
module.exports = router;
