const cors = require("cors");

const corsMiddleware = cors({
    origin: "http://localhost:3001", // Địa chỉ frontend
    credentials: true // Cho phép gửi cookie/session
});

module.exports = corsMiddleware;