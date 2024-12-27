const express = require("express");
const router = express.Router();
const taskroute = require("./taskroute");
const projectroute = require("./projectroute");
const userRoute = require("./userRoute");
const { getDashboard } = require("../controller/maincontroller");
const auth = require("../middleware/auth");

router.get("/dashboard", auth, getDashboard);

router.use("/task", auth, taskroute);
router.use("/project", auth, projectroute);
router.use("/user", userRoute);

module.exports = router;	