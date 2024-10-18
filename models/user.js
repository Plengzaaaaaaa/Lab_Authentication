// models/user.js
const mongoose = require('mongoose');

const userschema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
        role: { type: String, required: true, enum: ['user', 'admin'] } // เพิ่มฟิลด์ role
    },
    { timestamps: true, versionKey: false }
);
const Users = mongoose.model('Users', userschema);
module.exports = Users;

// module.exports = mongoose.model('Users', users);