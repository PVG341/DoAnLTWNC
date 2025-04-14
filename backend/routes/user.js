const express = require("express");
const router = express.Router();
const User = require("../models/users");  // Import model User

// API: Lấy tất cả người dùng
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API: Thêm người dùng mới
router.post("/", async (req, res) => {
  const { username, password, email, phone, address, age, role } = req.body;

  const newUser = new User({
    username,
    password,
    email,
    phone,
    address,
    age,
    role,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API: Lấy thông tin người dùng theo ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tìm thấy" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API: Cập nhật người dùng
// PUT cập nhật người dùng
router.put("/:id", async (req, res) => {
  try {
      const { username, email, phone, address, age, role } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          { username, email, phone, address, age, role },
          { new: true }
      );

      if (!updatedUser) {
          return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      res.json({ message: "Đã cập nhật người dùng", user: updatedUser });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server" });
  }
});


// API: Xóa người dùng
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    res.json({ message: "Người dùng đã được xóa", user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
