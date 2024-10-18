const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController"); // แก้ไขให้ตรงกับ path ของ controller

const { register, login, refresh } = require("../controllers/authController");

router.post("/", async (req,res) => {
    res.sendStatus(400);
});

router.post("/register", register);
router.post("/login" , login);
router.post("/refresh" , refresh);
// Check username
router.post("/check_username", authController.check_username); // เพิ่ม route สำหรับ check_username

module.exports = router;