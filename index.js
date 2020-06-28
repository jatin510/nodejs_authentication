const express = require("express");
const PORT = process.env.PORT || 8000;
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const mongoose = require("./config/mongoose.js");
const expressLayouts = require("express-ejs-layouts");

const app = express();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// EJS
app.set("view engine", "ejs");
app.set("views", "./views");
//// ejs layouts
app.use(expressLayouts);
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

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
