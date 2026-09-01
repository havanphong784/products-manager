const ProductCategory = require("../../models/product-category.model");
const {prefixAdmin} = require("../../config/system");
const createTreeHelpers = require("../../helpers/create-tree");

// [GET] /admin/product-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  }

  const records = await ProductCategory.find(find);
  const newRecords = createTreeHelpers.tree(records);
  res.render('admin/pages/product-category/index', {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
  });
}

// [GET] /admin/product-category/create
module.exports.create = async (req, res) => {
  let records = await ProductCategory.find({deleted: false});
  const newRecords = createTreeHelpers.tree(records);

  res.render('admin/pages/product-category/create', {
    pageTitle: "Tạo danh mục",
    records: newRecords,
  });
}

// [POST] /admin/product-category/create
module.exports.createPost = async (req, res) => {
  if (!req.body.position) {
    const countProduct = await ProductCategory.countDocuments();
    req.body.position = countProduct + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const record = new ProductCategory(req.body);
  await record.save();
  res.redirect(`${prefixAdmin}/product-category`);
}

// [GET] /admin/product-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ProductCategory.findOne({_id: id});
    let records = await ProductCategory.find({deleted: false});
    const newRecords = createTreeHelpers.tree(records);

    res.render('admin/pages/product-category/edit', {
      pageTitle: "Chỉnh sửa danh mục",
      data: data,
      records: newRecords,
    })
  } catch (err) {
    res.redirect(`${prefixAdmin}/product-category`);
  }
}

// [PATCH] /admin/product-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.position = parseInt(req.body.position);
  try {
    await ProductCategory.updateOne({_id: id}, req.body)
    req.flash("success", "Cập nhật danh mục thành công")
  } catch (err) {
    req.flash("error", "Cập nhật danh mục thất bại")
  }
  res.redirect(req.get("referer"));
}


