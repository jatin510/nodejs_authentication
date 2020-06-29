const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

const fetch = require("node-fetch");
const { stringify } = require("querystring");

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
  // implementing captcha
  // console.log("check authentication");

  // if (!req.body.captcha) {
  //   req.flash("error", "please select captcha");
  //   return res.redirect("/users/signin");
  // }

  // const secretKey = "6LfWKqsZAAAAADA_kILq6TjzD5ivcykn0L0bIlaY";

  // const query = stringify({
  //   secret: secretKey,
  //   response: req.body.captcha,
  //   remoteip: req.connection.remoteAddress,
  // });

  // const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

  // // Make a request to verifyURL
  // const body = await fetch(verifyURL).then((res) => res.json());

  // // if not successful
  // if (body.success !== undefined && !body.success) {
  //   req.flash("error", "failed captcha verification");
  //   return res.redirect("/users/signin");
  // }

  /////////////////////

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
