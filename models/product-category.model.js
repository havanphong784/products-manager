const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema({
  title: String,
  parentId: {type: String, default: ""},
  description: String,
  thumbnail: String,
  status: String,
  position: Number,
  deletedAt: Date,
  deleted: {type: Boolean, default: false},
  slug: {
    type: String,
    slug: "title",
    unique: true,
  }
}, {timestamps: true});

const ProductCategory = mongoose.model("ProductCategory", productCategorySchema, "product-categories");

module.exports = ProductCategory;