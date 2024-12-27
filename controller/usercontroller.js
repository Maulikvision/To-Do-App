const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getregisterpage = (req, res) => {
	res.render('user/register', { title: 'Register' });
};

const register = async (req, res) => {
	try {
		console.log("Request body:", req.body);
		const { name, email, password, role } = req.body;
		if (!name || !email || !password || !role) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const userexists = await User.findOne({ email });
		if (userexists) {
			return res.status(400).json({ message: "User already exists" });
		}

		const hashedPassword = bcrypt.hashSync(password, 10);
		const user = new User({ name, email, password: hashedPassword, role });
		await user.save();

		res.render("user/login");
	} catch (error) {
		console.error("Error during registration:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const getloginpage = (req, res) => {
	res.render('user/login', { error: null });
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.render('user/login', { error: 'All fields are required' });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.render('user/login', { error: 'Email not found' });
		}

		const isPasswordValid = bcrypt.compareSync(password, user.password);
		if (!isPasswordValid) {
			return res.render('user/login', { error: 'Invalid password' });
		}

		const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
		res.cookie("token", token, { httpOnly: true });
		//console.log("token", token);
		//console.log("user", user);
		res.redirect('/dashboard');
	} catch (error) {
		console.error("Error during login:", error);
		res.render('user/login', { error: 'Internal server error' }); // Pass error to EJS
	}
};

const logout = (req, res) => {
	res.clearCookie("token");
	res.redirect("/user/login");
};

const getProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		res.render("user/profile", { user, success: null });
	} catch (error) {
		console.error("Error fetching profile:", error);
		res.status(500).send("Internal server error");
	}
};

const updateProfile = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const updatedData = { name, email };
		if (password) {
			updatedData.password = bcrypt.hashSync(password, 10);
		}

		await User.findByIdAndUpdate(req.user.id, updatedData);
		res.render("user/profile", {
			user: { name, email },
			success: "Your profile has been updated successfully!"
		});
		
	} catch (error) {
		console.error("Error updating profile:", error);
		res.status(500).send("Internal server error");
	}
};


module.exports = { getregisterpage, register, login, getloginpage, logout, getProfile, updateProfile };