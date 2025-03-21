const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    cat_name: { type: String, required: true },
    category_id: { type: Number, required:true},
    description: {type: String, required: true},
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;

