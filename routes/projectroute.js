const express = require("express");
const router = express.Router();
const {
	createproject,
	getprojecttasks,
	geteditproject,
	updateProject,
	deleteProject,
} = require("../controller/projectcontroller");
const auth = require("../middleware/auth");
const roleAuth = require("../middleware/roleauth");

// router.get("/projects", auth, roleAuth(["Admin", "Manager"]), renderProjectsPage);
router.post("/createproject", auth, roleAuth(["Admin", "Manager"]), createproject);
router.get("/:id/task", auth, roleAuth(["Admin", "Manager", "Team Member"]), getprojecttasks);
router.get("/:id", auth, roleAuth(["Admin", "Manager"]), geteditproject);
router.post("/:id/edit", auth, roleAuth(["Admin", "Manager"]), updateProject);
router.post("/:id/delete", auth, roleAuth(["Admin"]), deleteProject);
// router.post("/assign", auth, roleAuth(["Admin"]), assignProject);

module.exports = router;
