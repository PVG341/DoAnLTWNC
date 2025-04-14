const session = require('express-session');

const sessionConfig = session({
    secret: 'your-secret-key', // Bạn có thể thay đổi secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true },
});

module.exports = sessionConfig;
