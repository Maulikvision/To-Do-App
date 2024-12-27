const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
	const token = req.cookies.token;
	//console.log("Token in auth middleware:", token);

	if (token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = decoded;
			res.locals.user = decoded;
			//console.log("User decoded from token:", decoded);
			next();
		} catch (error) {
			//console.error("Error verifying token:", error.message);
			if (error.name === "TokenExpiredError") {
				res.clearCookie("token");
				return res.redirect("/user/login");
			}
			res.locals.user = null;
			return res.redirect("/user/login");
		}
	} else {
		res.locals.user = null;
		if (req.path === "/user/login" || req.path === "/user/register") {
			return next();
		}
		return res.redirect("/user/login");
	}
};

module.exports = auth;