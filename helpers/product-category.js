const ProductCategory = require('../models/products-category.model')


const getAllChildCategoryIds = async (parentId) => {
  let ids = [parentId];

  const childCategories = await ProductCategory.find({
    parent_id: parentId,
    deleted: false,
    status: "active"
  });

  for (const child of childCategories) {
    const childIds = await getAllChildCategoryIds(child.id);
    // ids = ids.concat(childIds); gộp các list lại -> có thể trùng id
    ids = [...new Set([...ids, ...childIds])]; // k trùng id
  }
  return ids;
}

module.exports.getAllChildCategoryIds = getAllChildCategoryIds;