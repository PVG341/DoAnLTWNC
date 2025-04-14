// routes/session.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Cart = require('../models/Cart'); // Import model Cart
const router = express.Router();

const JWT_SECRET = 'mysecretkey';  // Đảm bảo bạn dùng key giống trong quá trình tạo token

// Kiểm tra session
router.get('/', (req, res) => {
  const token = req.cookies.token;  // Lấy token từ cookie

  if (!token) {
    return res.status(401).json({ isLoggedIn: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);  // Giải mã token
    // Kiểm tra người dùng trong cơ sở dữ liệu (nếu cần)
    User.findById(decoded.id).then(user => {
      if (user) {
        // Lấy giỏ hàng của người dùng
        Cart.findOne({ userId: user._id })
          .then(cart => {
            res.json({
              isLoggedIn: true,
              user: { username: user.username, role: user.role },
              cart: cart ? cart.items : []  // Nếu có giỏ hàng thì trả về, không có thì trả về mảng rỗng
            });
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({ isLoggedIn: false });
          });
      } else {
        res.status(401).json({ isLoggedIn: false });
      }
    }).catch(err => {
      console.error(err);
      res.status(500).json({ isLoggedIn: false });
    });
  } catch (err) {
    res.status(403).json({ isLoggedIn: false });
  }
});

module.exports = router;
