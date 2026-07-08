const ProductsCategory = require('../../models/products-category.model');
const createTree = require("../../helpers/create-tree");

module.exports.categoryMiddleware = async (req, res, next) => {
  const records = await ProductsCategory.find({deleted: false});
  res.locals.category = createTree.tree(records);
  next();
}