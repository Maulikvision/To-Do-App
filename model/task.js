const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	status: {
		type: String,
	},
	dueDate: {
		type: Date,
		required: true
	},
	project_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project',
		required: true
	},
	taskassignedTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	}
});

module.exports = mongoose.model("Task", taskSchema);