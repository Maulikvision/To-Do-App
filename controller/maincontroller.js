const Project = require("../model/project");
const Task = require("../model/task");

const getDashboard = async (req, res) => {
	try {
		let projects = [];
		if (req.user.role === "Admin") {
			projects = await Project.find().populate({ path: "assignedTo", });
		} else if (req.user.role === "Manager") {
			projects = await Project.find({ assignedTo: req.user.id }).populate({ path: "assignedTo", });
		} else if (req.user.role === "Team Member") {
			const tasks = await Task.find({ taskassignedTo: req.user.id }).populate("project_id");
			const projectIds = tasks.map((task) => task.project_id?._id).filter(Boolean);
			projects = await Project.find({ _id: { $in: projectIds } }).populate({ path: "assignedTo" });
		}

		let tasks = [];
		if (req.user.role === "Team Member") {
			tasks = await Task.find({ taskassignedTo: req.user.id }).populate("project_id taskassignedTo");
		} else {
			tasks = await Task.find().populate("project_id taskassignedTo");
		}

		res.render("dashboard", {
			title: "Dashboard",
			tasks: tasks,
			projects: projects,
			user: req.user,
		});
	} catch (error) {
		console.error("Error fetching dashboard data:", error);
		res.status(500).json({ message: "Server Error" });
	}
};


module.exports = { getDashboard };