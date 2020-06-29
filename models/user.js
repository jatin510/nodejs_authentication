const mongoose = require("mongoose");
var crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
