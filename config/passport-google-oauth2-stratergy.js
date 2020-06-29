const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: "-.com",
      clientSecret: "",
      callbackURL: "http://localhost:8000/users/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      // find a user
      User.findOne({ email: profile.emails[0].value }).exec((err, user) => {
        if (err) {
          console.log("error in google strategy ", err);
          return;
        }
        if (user) {
          return cb(null, user);
        } else {
          // create the new user
          User.create(
            {
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString("hex"),
            },
            (err, user) => {
              if (err) {
                console.log("error creating user");
                return;
              }
              console.log("google");
              return cb(null, user);
            }
          );
        }
      });
    }
  )
);

module.exports = passport;
