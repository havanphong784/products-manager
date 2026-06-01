const Product = require('../../models/products.model')

module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  });

  products.forEach(product => {
    product.newPrice = (product.price * (100 - product.discountPercentage) / 100).toFixed(0)
  })

  console.log(products)

  res.render('client/page/products/index.pug', {
    pageTitle: 'Products',
    products: products,
  })
}