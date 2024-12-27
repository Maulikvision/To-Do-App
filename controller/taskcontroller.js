const Task = require("../model/task");
const Project = require("../model/project");
const User = require("../model/user");

const createTask = async (req, res) => {
	try {
		console.log(req.body);
		const { title, description, status, dueDate, project_id } = req.body;
		if (!title || !description || !status || !dueDate || !project_id) {
			return res.status(400).json({ message: "All fields are required" });
		}
		const task = new Task({ title, description, status, dueDate, project_id });
		await task.save();
		res.redirect(`/project/${project_id}/task`);
		//res.status(201).json({ message: "Task created successfully", task });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const getsingletask = async (req, res) => {
	try {
		const { id } = req.params;
		const task = await Task.findById(id).populate("assignedTo project_id");
		res.status(200).json({ message: "Task fetched successfully", task });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const getTask = async (req, res) => {
	try {
		let tasks = [];
		let projects = [];

		if (req.user.role === "Admin") {
			tasks = await Task.find().populate("assignedTo project_id");
			projects = await Project.find();
		} else if (req.user.role === "Manager") {
			const assignedProjects = await Project.find({ assignedTo: req.user._id });
			const projectIds = assignedProjects.map((project) => project._id);
			tasks = await Task.find({ project_id: { $in: projectIds } }).populate("assignedTo project_id");
			projects = assignedProjects;
		} else if (req.user.role === "Team Member") {
			tasks = await Task.find({ assignedTo: req.user._id }).populate("assignedTo project_id");
			const projectIds = [...new Set(tasks.map((task) => task.project_id?._id).filter(Boolean))];
			projects = await Project.find({ _id: { $in: projectIds } });
		}
		projects = projects || [];
		tasks = tasks || [];

		res.render("tasks", {
			title: "Tasks",
			tasks: tasks,
			projects: projects,
			user: req.user,
		});
	} catch (error) {
		console.error("Error fetching tasks:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};


const getupdateTask = async (req, res) => {
	try {
		const { id } = req.params;
		console.log("id", id);
		const task = await Task.findById(id);
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}
		const project_id = task.project_id;
		const project = await Project.findById(project_id);
		if (!project) {
			return res.status(404).json({ message: "Project not found" });
		}
		const teamMembers = await User.find({ role: "Team Member" });
		res.render('edittask', { title: 'Edit Task', task: task, project: project, teamMembers: teamMembers, user: req.user });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const updatetask = async (req, res) => {
	try {
		const { id } = req.params;
		console.log("id", id);
		const { title, description, status, dueDate, assignedTo } = req.body;
		const task = await Task.findById(id);
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}

		const TeamMember = await User.findById(assignedTo);
		if (!TeamMember) {
			return res.status(404).json({ message: "User is not a team member" });
		}

		const project = await Project.findById(task.project_id);
		if (!project) {
			return res.status(404).json({ message: "Project not found" });
		}

		task.title = title;
		task.description = description;
		task.status = status;
		task.dueDate = dueDate;
		task.taskassignedTo = assignedTo;
		await task.save();

		TeamMember.assignedTasks.push(id);
		TeamMember.assignedProjects.push(project._id);
		await TeamMember.save();

		res.redirect(`/project/${task.project_id}/task`);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const deleteTask = async (req, res) => {
	try {
		const { id } = req.params;
		console.log("id", id);
		const task = await Task.findByIdAndDelete(id);
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}
		res.redirect(`/project/${task.project_id}/task`);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// const assignTask = async (req, res) => {
// 	try {
// 		const { taskId, memberId } = req.body;
// 		const task = await Task.findById(taskId);
// 		const member = await User.findById(memberId);
// 		if (member.role !== "Team Member") {
// 			return res.status(400).send("User is not a team member");
// 		}

// 		task.assignedTo = memberId;
// 		await task.save();

// 		member.assignedTasks.push(taskId);
// 		await member.save();
// 		res.redirect(`/project/${task.project_id}/task`);
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ message: "Internal server error" });
// 	}
// };

// const getAssignedTasks = async (req, res) => {
// 	try {
// 		const tasks = await Task.find({ assignedTo: req.user._id });
// 		res.render("assignedTasks", { tasks, user: req.user });
// 		//res.status(200).json({ message: "Tasks fetched successfully", tasks });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ message: "Internal server error" });
// 	}
// };

module.exports = { createTask, getsingletask, getTask, getupdateTask, updatetask, deleteTask, };