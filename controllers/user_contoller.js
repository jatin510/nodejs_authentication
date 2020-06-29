const User = require("../models/user.js");
const bcrypt = require("bcrypt");

// module.exports = (req, res) => res.render("users");

// signup controller
module.exports.signUp = (req, res) => res.render("user_sign_up");

// signin controller
module.exports.signIn = (req, res) => {
  if (req.isAuthenticated()) return res.redirect("profile");

  return res.render("user_sign_in");
};

// profile controller
module.exports.profile = (req, res) => {
  //TODO
  // User.findById(req.user.id, (err, user) => {
  //   return res.render("user_profile", {
  //     title: "Profile",
  //     profile_user: user,
  //   });
  // });
  // console.log(req.user);
  // return res.render("user_profile",);
  console.log(req.user.name);
  req.flash("success", `Welcome ${req.user.name}`);

  User.findById(req.user.id, (err, user) => {
    return res.render("user_profile", {
      user_profile: user,
    });
  });
};

// create new user
module.exports.create = async (req, res) => {
  if (req.body.password != req.body.confirm_password) {
    req.flash("error", "password does not match");
    return res.redirect("back");
  }

  try {
    let user = await User.findOne({ email: req.body.email });

    // if email already registered
    if (user) {
      req.flash("error", "email already registered");
      return res.redirect("back");
    }

    // create new user
    const saltRounds = 10;

    bcrypt.hash(req.body.password, saltRounds).then((hash) => {
      User.create({
        email: req.body.email,
        password: hash,
        name: req.body.name,
      }).then(() => {
        req.flash("success", " user created");
        res.redirect("/users/signin");
      });
    });
  } catch (err) {
    console.log("error creating user", err);
  }
};

module.exports.createSession = (req, res) => {
  console.log("login successful");
  req.flash("success", "Logged in Successfully");
  res.redirect("/users/profile");
};

module.exports.destroySession = (req, res) => {
  req.logout();
  req.flash("success", "logout successfull");
  return res.redirect("/");
};

module.exports.updatePassword = async (req, res) => {
  try {
    if (req.body.password !== req.body.confirm_password) {
      // error flash message
      req.flash("error", "password does not match");
      return res.redirect("back");
    }
    // req.user created at local passport strategy
    console.log("user data", req.user);
    let user = await User.findOne({ email: req.user.email });

    if (!user) {
      // flash message
      req.flash("error", "user not registered");
      return res.redirect("back");
    }
    // set new Password
    bcrypt.hash(req.body.password, 10).then((hash) => {
      user.password = hash;
      user.save().then(() => {
        console.log("updated password saved successfully");
        req.flash("success", "user password updated successfully");
        return res.redirect("back");
      });
    });
  } catch (err) {
    // error updating password
    console.log("error updating password");
    req.flash("error", "error updating password");
    return res.redirect("back");
  }
};
