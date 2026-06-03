// [GET] /admin/products

const Product = require('../../models/products.model')
const filterStatusHelper = require('../../helpers/filterStatus')
const searchObjectHelper = require('../../helpers/search')
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
  const products = await Product.find(find);
  products.forEach(product => {
    product.newPrice = (product.price * (100 - product.discountPercentage) / 100).toFixed(0)
  })
  console.log(products);
  res.render('admin/pages/products/index.pug', {
    pageTitle: 'Products',
    products: products,
    filterStatus: filterStatus,
    keyword: search.keyword,
  })
}