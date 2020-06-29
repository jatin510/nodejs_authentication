const express = require("express");
const PORT = process.env.PORT || 8000;
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const db = require("./config/mongoose.js");
const expressLayouts = require("express-ejs-layouts");
// create session on user LOGIN
const session = require("express-session");
// passport require
const passport = require("passport");
const passortLocal = require("./config/passport_local_strategy");
const passportGoogle = require("./config/passport-google-oauth2-stratergy");
const MongoStore = require("connect-mongo")(session);
//flash
const flash = require("connect-flash");
const customMware = require("./config/middleware");

const app = express();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// static files
app.use(express.static("./assets"));

// session
app.use(
  session({
    name: "nodejs",
    //TODO change the secret before deployment in production mode
    secret: "secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      (err) => console.log(err || "connect-mongodb setup ok")
    ),
  })
);

// EJS
app.set("view engine", "ejs");
app.set("views", "./views");
//// ejs layouts
app.use(expressLayouts);
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

// passport
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// setup flash message
app.use(flash());
app.use(customMware.setFlash);

// routes
app.use("/", require("./routes"));

app.get("/", (req, res) => {
  console.log("hello");
  return res.send("hello");
});

app.listen(PORT, (err) => {
  if (err) console.log("Error starting server", err);

  console.log("server started on port ", PORT);
});
