const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	dueDate: {
		type: Date,
	},
	description: {
		type: String,
	},
	assignedTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
});

module.exports = mongoose.model("Project", projectSchema);