// [GET] /admin/products

const Product = require('../../models/products.model')

module.exports.index = async (req, res) => {
  res.render('admin/pages/products/index.pug', {
    pageTitle: 'Products',
  })
}