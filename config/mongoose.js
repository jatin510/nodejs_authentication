// import mongoose from "mongoose";
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/nodejs_authentication_test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) =>
  console.log("error in establishing db connection", err)
);

db.on("connected", (err, res) => {
  console.log("Connected to MongoDB");
});

module.exports = db;
