const express = require("express");
// const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");
const multer = require("multer");

const router = express.Router();
const uploadDir = path.join(__dirname, "../public/images/");

// Đảm bảo thư mục images tồn tại
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer để lưu ảnh vào thư mục /public/images/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/images/")); // Lưu vào thư mục
    },
    filename: function (req, file, cb) {
        cb(null, req.body.imageName + path.extname(file.originalname)); // Đặt tên theo người dùng nhập
    },
});

const upload = multer({ storage: storage });


router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products); // ✅ Trả về JSON (đúng)
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
});

// Route thêm sản phẩm
router.post("/add", upload.single("imageFile"), async (req, res) => {
    try {
        const { name, category_id, rate, p_brand, price, description, imageName } = req.body;

        if (!name || !category_id || !rate || !p_brand || !price || !description || !req.file || !imageName) {
            return res.status(400).json({ message: "Thiếu thông tin sản phẩm hoặc file ảnh" });
        }

        // Đường dẫn ảnh sau khi upload
        const imagePath = `/images/${imageName}${path.extname(req.file.originalname)}`;

        // Lưu sản phẩm vào MongoDB
        const newProduct = new Product({ name, category_id, rate, p_brand, price, description, image: imagePath });
        await newProduct.save();

        res.json({ message: "Sản phẩm đã được thêm", product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
});


// Lấy chi tiết sản phẩm
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product); // ✅ Trả về JSON thay vì HTML
        } else {
            res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
});

// API thêm sản phẩm vào giỏ hàng
router.post("/add-to-cart/:id", async (req, res) => {
    const productId = req.params.id;
    console.log("Nhận request thêm vào giỏ hàng:", productId); // ✅ Debug

    if (!req.session) {
        return res.status(500).json({ message: "Lỗi session không tồn tại!" });
    }

    if (!req.session.cart) {
        req.session.cart = [];
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        // Tìm xem sản phẩm đã có trong giỏ hàng chưa
        const cartItem = req.session.cart.find((item) => item.id == productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            req.session.cart.push({ 
                id: product.id, 
                name: product.name, 
                price: product.price, 
                image: product.image, 
                quantity: 1 
            });
        }

        console.log("Giỏ hàng hiện tại:", req.session.cart); // ✅ Debug
        res.json({ message: "Đã thêm vào giỏ hàng", cart: req.session.cart });
    } catch (error) {
        console.error("Lỗi server:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// API cập nhật sản phẩm
router.put("/:id", upload.single("imageFile"), async (req, res) => {
    try {
        const { name, category_id, rate, p_brand, price, description, filename } = req.body;
        let updateData = { name, category_id, rate, p_brand, price, description };

        // Nếu có ảnh mới
        if (req.file) {
            updateData.image = `/images/${req.file.filename}`;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true } // Trả về sản phẩm sau khi cập nhật
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        res.json({ message: "Sản phẩm đã được cập nhật", product: updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server");
    }
});

// API xóa sản phẩm
router.delete("/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        res.json({ message: "Sản phẩm đã được xóa", product: deletedProduct });
    } catch (error) {
        res.status(500).send("Lỗi server");
    }
});


module.exports = router;

// curl -X POST http://localhost:3000/products/add \ -H "Content-Type: multipart/form-data" \ -F "name=Laptop Dell" \ -F "price=25000000" \ -F "imageName=laptop_dell" \ -F "imageFile=@D:\Download\18763_dell_inspiron_7440_2in1__3.jpg"