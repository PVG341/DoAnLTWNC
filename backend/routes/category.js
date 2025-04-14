const express = require("express");
const router = express.Router();
const Category = require("../models/categories");

// 📌 GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().populate("parentCategory"); // Để lấy thông tin của category mẹ
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err });
  }
});

// ✅ POST - Create a new category
router.post("/", async (req, res) => {
  const { cat_name, description, parentCategory } = req.body;

  if (!cat_name) {
    return res.status(400).json({ message: "Thiếu thông tin category!" });
  }

  try {
    const newCategory = new Category({ cat_name, parentCategory });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tạo category", error: err });
  }
});

// ✏️ PUT - Update category by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { cat_name, parentCategory } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { cat_name, parentCategory },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Không tìm thấy category!" });
    }

    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật category", error: err });
  }
});

// 🗑️ DELETE - Remove category by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category không tồn tại!" });
    }

    res.json({ message: "Đã xoá category", deletedCategory });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xoá category", error: err });
  }
});

module.exports = router;
