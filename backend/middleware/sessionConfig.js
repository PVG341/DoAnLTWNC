const session = require("express-session"); 

app.use(session({
    secret: "mysecretkey",  
    resave: false,          
    saveUninitialized: true,
    cookie: { secure: false } 
}));