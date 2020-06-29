const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

// SOME CONFUSION
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      console.log("local");
      User.findOne({ email: email }, async function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }

        const match = await bcrypt.compare(password, user.password);
        console.log("match", match);
        if (!match) {
          return done(null, false);
        }
        return done(null, user);
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function (err, user) {
    if (err) {
      console.log("Error in finding user in Passport");
      return done(err);
    }

    return done(null, user);
  });
});

//check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  // if the user is signed in, then pass on the request to the next function(controller's action)
  console.log("check if user is already signin");
  if (req.isAuthenticated()) {
    return next();
  }
  // if the user is not signed in
  else {
    console.log("user session is not there");

    return res.redirect("/users/signin");
  }
};

passport.setAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) res.locals.user = req.user;
  // console.log("res locals", res.locals.user);

  next();
};
module.exports = passport;
