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

  User.findById(req.user.id, (err, user) => {
    return res.render("user_profile", {
      user_profile: user,
    });
  });
};

// create new user
module.exports.create = async (req, res) => {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }

  try {
    let user = await User.findOne({ email: req.body.email });

    // if email already registered
    if (user) return res.redirect("back");

    // create new user
    const saltRounds = 10;

    bcrypt.hash(req.body.password, saltRounds).then((hash) => {
      User.create({
        email: req.body.email,
        password: hash,
        name: req.body.name,
      }).then(() => res.redirect("/users/signin"));
    });
  } catch (err) {
    console.log("error creating user", err);
  }
};

module.exports.createSession = (req, res) => {
  console.log("login successful");
  // console.log("user info", req);
  res.redirect("/");
};

module.exports.destroySession = (req, res) => {
  req.logout();

  return res.redirect("/");
};

module.exports.updatePassword = async (req, res) => {
  try {
  } catch (err) {}
};
