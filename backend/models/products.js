const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    rate: {type: Number, default: 0, min: 0, max: 5, require: false},
    p_brand: {type: String, require: true},
    price: { type: Number, required: true },
    description: {type: String, required: true},
    image: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

// variation: {type: String, require: true},