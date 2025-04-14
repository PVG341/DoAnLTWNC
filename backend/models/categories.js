const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    cat_name: { type: String, required: true },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }, // Liên kết với category mẹ
});


const Category = mongoose.model("Category", categorySchema);

module.exports = Category;

