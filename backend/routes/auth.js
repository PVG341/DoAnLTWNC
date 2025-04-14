// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();
const JWT_SECRET = 'mysecretkey';

router.get('/admin-dashboard', isAdmin, (req, res) => {
  res.json({ message: 'Chào mừng bạn đến trang Admin!' });
});


// Đăng nhập
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) return res.status(401).json({ message: 'Sai tên đăng nhập' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Sai mật khẩu' });
  
      const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  
      // Lưu token vào cookie
      res.cookie('token', token, {
        httpOnly: true, // Chỉ có thể truy cập qua HTTP, không truy cập từ JavaScript
        secure: false,  // set `secure: true` trong môi trường sản phẩm (production) nếu dùng HTTPS
        sameSite: 'Strict',
      });
  
      res.json({ message: 'Đăng nhập thành công', user: { username: user.username, role: user.role } });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err });
    }
  });

// Đăng ký
router.post('/register', async (req, res) => {
  const { username, password, email, phone, address, age } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      phone,
      address,
      age,
      role: 0, // Mặc định là user bình thường
    });
    await newUser.save();
    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi đăng ký', error: err });
  }
});

// Kiểm tra người dùng đã đăng nhập chưa
router.get('/me', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Chưa đăng nhập' });
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.json({ user: { username: decoded.username, role: decoded.role } });
    } catch (err) {
      res.status(403).json({ message: 'Token không hợp lệ' });
    }
  });

// Đăng xuất
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false, // Đặt true nếu dùng HTTPS
    sameSite: 'Strict'
  });
  res.json({ message: 'Đăng xuất thành công' });
});

module.exports = router;
