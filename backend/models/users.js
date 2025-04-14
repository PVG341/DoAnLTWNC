const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    address: {type: String, required: false},
    age: { type: Number, required: true },
    role: {type: Number, default: 0}
});

const User = mongoose.model("User", userSchema);

module.exports = User;

