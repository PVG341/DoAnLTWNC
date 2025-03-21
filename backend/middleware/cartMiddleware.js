const session = require("express-session"); 

const cartMiddleware = (req, res, next) => {
    req.session.cart = req.session.cart || [];
    res.locals.cartCount = req.session.cart.reduce((sum, item) => sum + item.quantity, 0);
    next();
};
app.use(cartMiddleware);