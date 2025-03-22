const session = require("express-session");

const sessionConfig = session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
});

module.exports = sessionConfig;
