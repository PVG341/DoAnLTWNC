const jwt = require('jsonwebtoken');
const JWT_SECRET = 'mysecretkey';

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Chưa đăng nhập' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token không hợp lệ' });
  }
};
module.exports = authMiddleware;