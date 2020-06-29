const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home_controller");

router.get("/", homeController.home);
// router.get("/", (req, res) => {
//   return console.log(req.session);
// });

router.get("/data", homeController.dbData);

router.use("/users", require("./users"));

module.exports = router;
