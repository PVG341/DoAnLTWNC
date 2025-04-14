const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Cart = require('../models/cart');
const Product = require('../models/products');

// Thêm sản phẩm vào giỏ hàng (theo ID, với số lượng)
router.post('/add', authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    res.json({ message: 'Đã thêm vào giỏ hàng', cart: cart.items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Xem giỏ hàng
router.get('/', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart) return res.json({ cart: [] });

    res.json({
      message: 'Giỏ hàng của bạn',
      cart: cart.items.map(item => ({
        id: item.productId._id,
        name: item.productId.name,
        image: item.productId.image,
        price: item.productId.price,
        quantity: item.quantity,
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng' });
  }
});

// Xoá 1 sản phẩm khỏi giỏ hàng
router.post('/remove', authMiddleware, async (req, res) => {
  const { productId } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.json({ message: 'Đã xóa sản phẩm khỏi giỏ hàng', cart: cart.items });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
