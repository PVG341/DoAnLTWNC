const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category_id: {type: Number, require: false},
    rate: {type: Number, require: false},
    p_brand: {type: String, require: true},
    price: { type: Number, required: true },
    description: {type: String, required: true},
    image: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

// variation: {type: String, require: true},