// [GET] /admin/products

const Product = require('../../models/products.model')

module.exports.index = async (req, res) => {
  const products = await Product.find({
    deleted: false,
  });

  products.forEach(product => {
    product.newPrice = (product.price * (100 - product.discountPercentage) / 100).toFixed(0)
  })

  console.log(products)

  res.render('admin/pages/products/index.pug', {
    pageTitle: 'Products',
    products: products,
  })
}