const Project = require("../model/project");
const Task = require("../model/task");
const User = require("../model/user");

// const renderProjectsPage = async (req, res) => {
// 	try {
// 		const projects = await Project.find().populate("assignedTo");
// 		res.render("projects", { projects, user: req.user });
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ message: "Internal server error" });
// 	}
// };

const createproject = async (req, res) => {
	try {
		//console.log(req.body);
		const { name, dueDate, description } = req.body;
		if (!name || !dueDate || !description) {
			return res.status(400).json({ message: "All fields are required" });
		}
		const project = new Project({ name, dueDate, description });
		await project.save();
		//res.status(201).json({ message: "Project created successfully", project });
		res.redirect("/dashboard");
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const getprojecttasks = async (req, res) => {
	try {
		console.log(req.params);
		const { id } = req.params;
		const project = await Project.findById(id);
		if (!project) {
			return res.status(404).json({ message: "Project not found" });
		}
		let tasks;

		if (req.user.role === "Team Member") {
			tasks = await Task.find({ project_id: id, taskassignedTo: req.user.id }).populate("taskassignedTo");
		} else {
			tasks = await Task.find({ project_id: id }).populate("taskassignedTo");
		}

		res.render("tasks", {
			title: `Tasks for ${project.name}`,
			project: project,
			tasks: tasks,
			user: req.user,
		});

		//return res.status(200).json({ message: "Tasks fetched successfully", tasks });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const geteditproject = async (req, res) => {
	try {
		const { id } = req.params;
		console.log("id", id);
		const project = await Project.findById(id);
		const managers = await User.find({ role: "Manager" });
		if (!project) {
			return res.status(404).json({ message: "Project not found" });
		}
		res.render('editproject', { title: 'Edit Project', project: project, managers: managers, user: req.user });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const updateProject = async (req, res) => {
	try {
		const { id } = req.params;
		console.log("id", id);
		const { name, dueDate, description, assignedTo } = req.body;
		console.log("req.body", req.body);

		const manager = await User.findById(assignedTo);
		if (!manager) {
			return res.status(404).json({ message: "User is not a manager" });
		}

		const project = await Project.findById(id);
		if (!project) {
			return res.status(404).json({ message: "Project not found" });
		}
		project.name = name;
		project.dueDate = dueDate;
		project.description = description;
		project.assignedTo = assignedTo;
		await project.save();

		manager.assignedProjects.push(id);
		await manager.save();

		res.redirect("/dashboard");
		//return res.status(200).json({ message: "Project updated successfully", project });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const deleteProject = async (req, res) => {
	try {
		const { id } = req.params;
		console.log("id", id);

		const deleteproject = await Project.findByIdAndDelete(id);
		if (!deleteproject) {
			return res.status(404).json({ message: "Project not found" });
		}
		res.redirect("/dashboard");
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
}

// const assignProject = async (req, res) => {
// 	try {
// 		const { projectId, managerId } = req.body;
// 		const project = await Project.findById(projectId);
// 		const manager = await User.findById(managerId);
// 		if (!manager) {
// 			return res.status(404).json({ message: "User is not a manager" });
// 		}

// 		project.assignedTo = managerId;
// 		await project.save();

// 		manager.assignedProjects.push(projectId);
// 		await manager.save();

// 		res.redirect("/projects");
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ message: "Internal server error" });
// 	}
// }

module.exports = { createproject, getprojecttasks, geteditproject, updateProject, deleteProject, };