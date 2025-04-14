// middleware/isAdmin.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'mysecretkey';

const isAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Chưa đăng nhập' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 1) {  // Kiểm tra nếu role không phải admin (role === 1 là admin)
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
    next();  // Nếu là admin, cho phép truy cập vào route tiếp theo
  } catch (err) {
    res.status(403).json({ message: 'Token không hợp lệ' });
  }
};

module.exports = isAdmin;
