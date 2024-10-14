const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Register ลงทะเบียน
exports.register = async (req, res) => {
    const { user_name, password, name, role } = req.body;
    try {
        // ตรวจสอบว่าผู้ใช้งานนี้มีอยู่แล้วหรือไม่
        const existingUser = await User.findOne({ user_name });
        if (existingUser) {
            return res.status(400).send("Username already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ user_name, password: hashedPassword, name, role });
        await user.save();
        res.status(201).send("User registered");
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// Login ยืนยันตัวตน
exports.login = async (req, res) => {
    const { user_name, password } = req.body;
    try {
        const tmpuser = await User.findOne({ user_name });
        if (!tmpuser) return res.status(400).send("User not found");
        const isMatch = await bcrypt.compare(password, tmpuser.password);
        if (!isMatch) return res.status(400).send("Invalid credentials");
        
        // ตรวจสอบ role
        if (!tmpuser.role) return res.status(400).send("Role not found");

        const accessToken = jwt.sign(
            { userId: tmpuser._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" } 
        );

        const refreshToken = jwt.sign(
            { userId: tmpuser._id },
            process.env.REFRESH_TOKEN_SECRET
        );

        tmpuser.refreshToken = refreshToken; // บันทึก refreshToken ในฐานข้อมูล
        await tmpuser.save();

        res.json({ user: tmpuser, accessToken, refreshToken });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Refresh access token มาใหม่
exports.refresh = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send("Invalid or expired token");
        const accessToken = jwt.sign(
            { userId: user.userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );
        res.json({ accessToken });
    });
};

// Logout
exports.logout = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.sendStatus(401);

    const user = await User.findOne({ refreshToken: token });
    if (!user) return res.sendStatus(403);

    user.refreshToken = null; // ลบ refreshToken
    await user.save();
    res.sendStatus(204);
};
