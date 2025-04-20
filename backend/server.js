const connectDB = require("./config/db"); // Import kết nối MongoDB
const cartRoutes = require("./routes/cart");
const productRoutes = require("./routes/product");
const categoryRoutes = require("./routes/category");
const sessionRoutes = require('./routes/session');
const authRoutes = require("./routes/auth");
const userRoutes = require('./routes/user');
const adminRoutes = require("./routes/admin");



const cookieParser = require('cookie-parser');
const express = require("express");
const cors = require('cors');
const path = require("path");

//Middleware
const cartMiddleware = require("./middleware/cartMiddleware");
const errorHandler = require("./middleware/errorHandler");
const staticMiddleware = require("./middleware/staticMiddleware");
const bodyParserMiddleware = require("./middleware/bodyParserMiddleware");
const authMiddleware = require("./middleware/authMiddleware");
const sessionConfig = require("./middleware/sessionConfig");
const customMiddleware = require("./middleware/customMiddleware");

const app = express();

connectDB();

// ✅ Middleware để đọc JSON từ request body
app.use(bodyParserMiddleware);
app.use(cookieParser());  // Để sử dụng cookies
app.use(cors({
    origin: 'http://localhost:3001', // Cho phép frontend truy cập từ localhost:3001
    methods: 'GET, POST, PUT, DELETE',  // Chỉ định các phương thức HTTP được phép
    credentials: true,
}));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Cấu hình session
app.use(sessionConfig);

// Middleware để đếm số lượng sản phẩm trong giỏ
app.use(cartMiddleware);

// Import routes

app.use("/api/auth", authRoutes);
app.use('/api/session', sessionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.use("/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);

//Middleware check lỗi
app.use(errorHandler);

// Khởi động server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server chạy tại: http://localhost:${PORT}`);
});
