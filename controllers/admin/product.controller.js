const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const ProductCategory = require("../../models/product-category.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchObjectHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const {prefixAdmin} = require("../../config/system");
const {parse} = require("dotenv");
const createTree = require("../../helpers/create-tree");

// [GET] /admin/product
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);
  let find = {
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }
  const search = searchObjectHelper(req.query);
  if (search.regex) {
    find.title = search.regex;
  }

  const countProducts = await Product.countDocuments(find);
  let paginationObject = paginationHelper(
    {
      currentPage: 1,
      limit: 10,
    },
    req.query,
    countProducts,
  );

  const sort = {}
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue
  } else {
    sort.position = "desc"
  }

  const products = await Product.find(find).sort(sort)
    .limit(paginationObject.limit)
    .skip(paginationObject.skip)
    .sort({position: "desc"});
  for (const product of products) {
    product.newPrice = (
      (product.price * (100 - product.discountPercentage)) /
      100
    ).toFixed(0);
    const categoryDoc = product.productCategoryId
      ? await ProductCategory.findOne({_id: product.productCategoryId})
      : null;
    product.category_name = categoryDoc ? categoryDoc.title : null;

    if (product.createdBy && product.createdBy.accountId) {
      const account = await Account.findOne({_id: product.createdBy.accountId});
      product.accountFullName = account ? account.fullName : null;
    } else {
      product.accountFullName = null;
    }

    if (product.updatedBy && product.updatedBy.length > 0) {
      const updatedBy = product.updatedBy[product.updatedBy.length - 1];
      const account = await Account.findOne({
        _id: updatedBy.accountId,
      });
      updatedBy.accountFullName = account ? account.fullName : "";
    }
  }
  res.render("admin/pages/product/index.pug", {
    pageTitle: "Products",
    products: products,
    filterStatus: filterStatus,
    keyword: search.keyword,
    pagination: paginationObject,
  });
};

// [PATCH] /admin/product/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({_id: id}, {status: status});

  req.flash("success", "Cập nhật trạng thái thành công");
  res.redirect(req.get("referer"));
};

// [PATCH] /admin/product/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await Product.updateMany({_id: {$in: ids}}, {status: "active"});
      req.flash(
        "success",
        `Cập nhật trạng thái ${ids.length} sản phẩm thành công`,
      );
      break;
    case "inactive":
      await Product.updateMany({_id: {$in: ids}}, {status: "inactive"});
      req.flash(
        "success",
        `Cập nhật trạng thái ${ids.length} sản phẩm thành công`,
      );
      break;
    case "delete":
      await Product.updateMany(
        {_id: {$in: ids}},
        {
          deleted: true,
          // deletedAt: new Date(),
          deletedBy: {
            accountId: res.locals.user.id,
            deletedAt: new Date()
          }
        },
      );
      req.flash("success", `Đã xóa ${ids.length} sản phẩm thành công`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({_id: id}, {position: position});
      }
      req.flash("success", `Thay đổi vị trí ${ids.length} sản phẩm thành công`);
      break;
    default:
      break;
  }

  res.redirect(req.get("referer"));
};

// [DELETE] /admin/product/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // xóa cứng
  // await Product.deleteOne({_id: id});
  // xóa mền
  await Product.updateOne(
    {_id: id},
    {
      deleted: true,
      // deletedAt: new Date(),
      deletedBy: {
        accountId: res.locals.user.id,
        deletedAt: new Date()
      }
    },
  );
  req.flash("success", `Đã xóa sản phẩm thành công`);
  res.redirect(req.get("referer"));
};

// [GET] /admin/prodcuts/create
module.exports.create = async (req, res) => {
  let records = await ProductCategory.find({deleted: false});
  const newRecords = createTree.tree(records);
  res.render("admin/pages/product/create.pug", {
    pageTitle: "Thêm mới sản ",
    records: newRecords,
  });
};

// [POST] /admin/prodcuts/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseFloat(req.body.price);
  req.body.discountPercentage = parseFloat(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  if (!req.body.position) {
    const countProduct = await Product.countDocuments();
    req.body.position = countProduct + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  // if (req.file) {
  //     req.body.thumbnail = `/uploads/${req.file.filename}`;
  // }
  req.body.createdBy = {accountId: res.locals.user.id};
  const product = new Product(req.body);
  await product.save();
  res.redirect(`${prefixAdmin}/product`);
};

// [GET] /admin/prodcuts/edit/:id
module.exports.edit = async (req, res) => {
  const find = {
    deleted: false,
    _id: req.params.id,
  };

  let records = await ProductCategory.find({deleted: false});
  const newRecords = createTree.tree(records);

  const product = await Product.findOne(find);

  res.render("admin/pages/product/edit.pug", {
    pageTitle: "Chỉnh sửa sản phẩm",
    product: product,
    records: newRecords
  });
};

// [PATCH] /admin/prodcuts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.price = parseFloat(req.body.price);
  req.body.discountPercentage = parseFloat(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  if (!req.body.position) {
    const countProduct = await Product.countDocuments();
    req.body.position = countProduct + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  // if (req.file) {
  //     req.body.thumbnail = `/uploads/${req.file.filename}`;
  // }

  try {
    const updatedBy = {
      accountId: res.locals.user.id,
      updatedAt: new Date()
    }
    await Product.updateOne({_id: id},
      {
        ...req.body,
        $push: {updatedBy: updatedBy}
      }
    );
    req.flash("success", "Cập nhật sản phẩm thành công !");
  } catch (e) {
    req.flash("error", "Cập nhật sản phẩm thất bại !");
  }

  res.redirect(`${prefixAdmin}/product`);
};

// [GET] /admin/prodcuts/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    }
    const product = await Product.findOne(find);

    if (product.price && product.discountPercentage) {
      product.newPrice = (
        (product.price * (100 - product.discountPercentage)) / 100
      ).toFixed(0);
    }

    res.render("admin/pages/product/detail.pug", {
      pageTitle: "Chi tiết sản phẩm",
      product: product,
    })
  } catch (e) {
    res.redirect(`${prefixAdmin}/product`);
  }
}



