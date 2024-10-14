const express = require("express");
const router = express.Router();

const { register, login, refresh } = require("../controllers/authController");

// เส้นทางลงทะเบียน
router.post("/register", register);

// เส้นทางเข้าสู่ระบบ
router.post("/login", login);

// เส้นทางรีเฟรชโทเค็น
router.post("/refresh", refresh);

module.exports = router;
