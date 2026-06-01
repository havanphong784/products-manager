const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  rating: Number,
  brand: String,
  thumbnail: String,
  deleted: Boolean,
})

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;