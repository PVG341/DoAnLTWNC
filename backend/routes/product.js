const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Product = require("../models/products");
const multer = require("multer");

const router = express.Router();
const uploadDir = path.join(__dirname, "../public/images/");
const Category = require('../models/categories')

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


// GET - Lấy sản phẩm theo danh mục, bao gồm cả sản phẩm của các danh mục con
router.get("/category", async (req, res) => {
    try {
      const { category } = req.query;  // Lấy category từ query string
  
      // Tìm tất cả các danh mục con
      const categories = await Category.find({ parentCategory: category });
  
      // Tạo danh sách các category con bao gồm cả category chính
      const allCategories = [category, ...categories.map(cat => cat._id)];
  
      // Lấy sản phẩm theo tất cả các danh mục
      const products = await Product.find({
        category_id: { $in: allCategories }
      });
  
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error: err });
    }
  });

// GET - Tìm kiếm sản phẩm theo tên
router.get("/search", async (req, res) => {
    try {
        const { q } = req.query; // Lấy query từ URL (?q=)
        if (!q) return res.status(400).json({ message: "Thiếu từ khóa tìm kiếm" });

        const products = await Product.find({
            name: { $regex: q, $options: 'i' } // Tìm tên chứa chuỗi q, không phân biệt hoa thường
        });

        res.json(products);
    } catch (err) {
        console.error("Lỗi tìm kiếm sản phẩm:", err);
        res.status(500).json({ message: "Lỗi server khi tìm kiếm", error: err.message });
    }
});


// Route thêm sản phẩm
router.post("/add", upload.single("imageFile"), async (req, res) => {
    try {
        const { name, category_id, rate, p_brand, price, description, imageName } = req.body;

        // Log ra dữ liệu nhận được từ frontend
        console.log("Received data:", req.body);
        console.log("Received file:", req.file);

        // Kiểm tra từng trường hợp cụ thể và trả về thông báo lỗi chi tiết
        if (!name) {
            return res.status(400).json({ message: "Thiếu tên sản phẩm" });
        }
        if (!category_id) {
            return res.status(400).json({ message: "Thiếu ID danh mục" });
        }
        if (rate === undefined) {
            return res.status(400).json({ message: "Thiếu đánh giá sản phẩm" });
        }
        if (!p_brand) {
            return res.status(400).json({ message: "Thiếu thương hiệu sản phẩm" });
        }
        if (!price) {
            return res.status(400).json({ message: "Thiếu giá sản phẩm" });
        }
        if (!description) {
            return res.status(400).json({ message: "Thiếu mô tả sản phẩm" });
        }
        if (!req.file) {
            return res.status(400).json({ message: "Thiếu file ảnh sản phẩm" });
        }
        if (!imageName) {
            return res.status(400).json({ message: "Thiếu tên ảnh" });
        }

        // Đường dẫn ảnh sau khi upload
        const imagePath = `/images/${imageName}${path.extname(req.file.originalname)}`;

        // Lưu sản phẩm vào MongoDB
        const newProduct = new Product({ name, category_id, rate, p_brand, price, description, image: imagePath });
        await newProduct.save();

        res.json({ message: "Sản phẩm đã được thêm", product: newProduct });
    } catch (error) {
        console.error("Error saving product:", error);
        res.status(500).json({ message: "Lỗi server: " + error.message });
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
        const { name, category_id, rate, p_brand, price, description, imageName } = req.body;
        const productId = req.params.id;

        // Kiểm tra sản phẩm tồn tại
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        // Cập nhật dữ liệu mới
        let updateData = {
            name: name || existingProduct.name,
            category_id: category_id || existingProduct.category_id,
            rate: rate !== undefined ? rate : existingProduct.rate,
            p_brand: p_brand || existingProduct.p_brand,
            price: price || existingProduct.price,
            description: description || existingProduct.description
        };

        // Nếu có ảnh mới được upload
        if (req.file && imageName) {
            const ext = path.extname(req.file.originalname);
            const newFileName = `${imageName}${ext}`;
            const newPath = path.join(uploadDir, newFileName);

            // Di chuyển ảnh và cập nhật đường dẫn
            fs.renameSync(req.file.path, newPath);
            updateData.image = `/images/${newFileName}`;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updateData,
            { new: true }
        );

        res.json({ message: "Cập nhật sản phẩm thành công", product: updatedProduct });
    } catch (error) {
        console.error("Lỗi cập nhật sản phẩm:", error);
        res.status(500).json({ message: "Lỗi server: " + error.message });
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