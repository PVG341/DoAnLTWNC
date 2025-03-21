const cors = require("cors");

app.use(cors({
    origin: "http://localhost:3001",  // Địa chỉ frontend
    credentials: true  // Cho phép gửi cookie/session
}));