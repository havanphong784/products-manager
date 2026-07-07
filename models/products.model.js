const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  products_category_id: {type: String, default: ""},
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: String,
  status: String,
  position: Number,
  createdBy: {
    account_id: String,
    createdAt: {type: Date, default: Date.now},
  },
  deleteAt: Date,
  deleted: {type: Boolean, default: false},
  slug: {
    type: String,
    slug: "title",
    unique: true,
  }
}, {timestamps: true});

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;