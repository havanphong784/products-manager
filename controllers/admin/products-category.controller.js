const ProductsCategory = require("../../models/products-category.model");
const {prefixAdmin} = require("../../config/system");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  }

  const records = await ProductsCategory.find(find);
  res.render('admin/pages/products-category/index', {
    pageTitle: "Danh mục sản phẩm",
    records: records,
  });
}

// [GET] /admin/products-category/create
module.exports.create = (req, res) => {
  res.render('admin/pages/products-category/create', {
    pageTitle: "Tạo danh mục",
  });
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if (!req.body.position) {
    const countProduct = await ProductsCategory.countDocuments();
    req.body.position = countProduct + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const record = new ProductsCategory(req.body);
  await record.save();
  res.redirect(`${prefixAdmin}/products-category`);
}