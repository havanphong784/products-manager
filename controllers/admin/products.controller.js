// [GET] /admin/products

const Product = require('../../models/products.model')
const filterStatusHelper = require('../../helpers/filterStatus')
const searchObjectHelper = require('../../helpers/search')
const paginationHelper = require('../../helpers/pagination')
const {prefixAdmin} = require("../../config/system");
const {parse} = require("dotenv");
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);
  let find = {
    deleted: false,
  }
  if (req.query.status) {
    find.status = req.query.status;
  }
  const search = searchObjectHelper(req.query);
  if (search.regex) {
    find.title = search.regex;
  }

  const countProducts = await Product.countDocuments(find)
  let paginationObject = paginationHelper(
    {
      currentPage: 1,
      limit: 10,
    }, req.query, countProducts
  );

  const products = await Product.find(find).limit(paginationObject.limit).skip(paginationObject.skip);
  products.forEach(product => {
    product.newPrice = (product.price * (100 - product.discountPercentage) / 100).toFixed(0)
  })
  console.log(products);
  res.render('admin/pages/products/index.pug', {
    pageTitle: 'Products',
    products: products,
    filterStatus: filterStatus,
    keyword: search.keyword,
    pagination: paginationObject
  })
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({_id: id}, {status: status})

  res.redirect(req.get('referer'))
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await Product.updateMany({_id: {$in: ids}}, {status: "active"})
      break;
    case "inactive":
      await Product.updateMany({_id: {$in: ids}}, {status: "inactive"})
      break;
    case "delete":
      await Product.updateMany({_id: {$in: ids}}, {deleted: true})
      break;
    default:
      break;
  }

  res.redirect(req.get('referer'));

}
