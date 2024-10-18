const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Corrected from Product to User

// Register
exports.register = async (req, res) => {
    const { username, password,name,role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword,name,role  });
        await user.save();
        res.status(201).send("User registered");
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// Login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).send("User not found");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send("Invalid credentials");

        const accessToken = jwt.sign(
            { userId: user._id, role: user.role }, // เพิ่ม role
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "3h" }
        );

        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.REFRESH_TOKEN_SECRET
        );
        res.json({user, accessToken, refreshToken, role: user.role }); // ส่งคืน role ด้วย
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Refresh
exports.refresh = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = jwt.sign(
            { userId: user.userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );
        res.json({ accessToken });
    });
};

// Check username
exports.check_username = async (req, res) => {
    const { username } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user) {
            // ถ้า username มีอยู่ในฐานข้อมูล
            return res.json({ exists: true });
        }
        // ถ้า username ไม่มีในฐานข้อมูล
        return res.json({ exists: false });
    } catch (err) {
        res.status(500).send(err.message);
    }
};