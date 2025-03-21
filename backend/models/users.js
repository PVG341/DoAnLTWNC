const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: {type: String, require: true},
    email: {type: String, require: true},
    phone: {type: String, require: true},
    address: {type: String, require: false},
    age: { type: Number, required: true },
    image: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

