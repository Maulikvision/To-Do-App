const express = require("express");
const router = express.Router();
const { createTask, getsingletask, getTask, getupdateTask, updatetask, deleteTask, } = require("../controller/taskcontroller");

const auth = require("../middleware/auth");
const roleAuth = require("../middleware/roleauth");

router.post("/createtask", auth, roleAuth(["Admin", "Manager"]), createTask);
router.get("/tasks", auth, roleAuth(["Admin", "Manager"]), getTask);
router.get("/task/:id", auth, roleAuth(["Admin", "Manager", "Team Member"]), getsingletask);
router.get("/:id", auth, roleAuth(["Admin", "Manager", "Team Member"]), getupdateTask);
router.post("/:id/edit", auth, roleAuth(["Admin", "Manager"]), updatetask);
router.post("/:id/delete", auth, roleAuth(["Admin", "Manager"]), deleteTask);
// router.post("/assign", auth, roleAuth(["Manager"]), assignTask);
// router.get("/assigned-tasks", auth, roleAuth(["Team Member"]), getAssignedTasks);

router.get("/task/:id", getsingletask);
module.exports = router;