const ProductCategory = require('../../models/product-category.model');
const createTree = require("../../helpers/create-tree");

module.exports.categoryMiddleware = async (req, res, next) => {
  const records = await ProductCategory.find({deleted: false});
  res.locals.category = createTree.tree(records);
  next();
}

