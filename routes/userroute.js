const express = require("express");
const router = express.Router();
const { register, login, getregisterpage, getloginpage, logout, getProfile, updateProfile } = require("../controller/usercontroller");

router.get("/register", getregisterpage);
router.post("/register", register);

router.get("/login", getloginpage);
router.post("/login", login);

router.get('/logout', logout);

router.get('/profile', getProfile);
router.post('/profile', updateProfile);

module.exports = router;