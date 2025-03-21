const connectDB = require("./config/db"); // Import kết nối MongoDB
const cartRoutes = require("./routes/cart");


//Middleware
const cartMiddleware = require("./middleware/cartMiddleware");
const errorHandler = require("./middleware/errorHandler");
const staticMiddleware = require("./middleware/staticMiddleware");
const bodyParserMiddleware = require("./middleware/bodyParserMiddleware");
const authMiddleware = require("./middleware/authMiddleware");
const corsMiddleware = require("./middleware/corsMiddleware");
const sessionMiddleware = require("./middleware/sessionMiddleware");
const customMiddleware = require("./middleware/customMiddleware");

const app = express();

connectDB();

// ✅ Middleware để đọc JSON từ request body
app.use(bodyParserMiddleware);

app.use(corsMiddleware);

// Cấu hình session
app.use(sessionMiddleware);

// Sử dụng thư mục public để chứa file tĩnh
app.use(staticMiddleware);

// Middleware để đếm số lượng sản phẩm trong giỏ
app.use(cartMiddleware);

//Middleware check lỗi
app.use(errorHandler);

// Import routes
const indexRoutes = require("./routes/index");
const productRoutes = require("./routes/product");

app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/home", indexRoutes);

// Khởi động server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server chạy tại: http://localhost:${PORT}`);
});
