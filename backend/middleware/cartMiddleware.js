const session = require("express-session"); 

const cartMiddleware = (req, res, next) => {
    // Kiểm tra nếu người dùng đã đăng nhập
    if (!req.session.user) {
        res.locals.cartMessage = "Bạn cần phải đăng nhập để sử dụng chức năng này";
        res.locals.showLoginButton = true;
    } else {
        req.session.cart = req.session.cart || [];
        res.locals.cartCount = req.session.cart.reduce((sum, item) => sum + item.quantity, 0);
    }
    next();
};

module.exports = cartMiddleware;
