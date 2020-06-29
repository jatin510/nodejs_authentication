const user = require("../models/user.js");
const User = require("../models/user.js");

module.exports.home = (req, res) => {
  console.log(req.flash);
  req.flash("success", "hello");
  return res.render("home");
};

module.exports.dbData = async (req, res) => {
  const data = await User.find({});
  console.log(data);
  return res.render("data", { data });
};
