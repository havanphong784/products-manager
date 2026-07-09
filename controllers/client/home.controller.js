const Products = require('../../models/products.model');
const productHelpers = require('../../helpers/products');

// [GET] /
module.exports.index = async (req, res) => {
  const productFeatured = await Products.find({deleted: false, featured: "1", status: "active"}).limit(6);
  productHelpers.priceNewProducts(productFeatured);

  const productsNew = await Products.find({deleted: false, status: "active"}).sort({position: "desc"}).limit(6);
  productHelpers.priceNewProducts(productsNew);

  res.render('client/pages/home/index.pug',
    {
      pageTitle: 'Home',
      productFeatured: productFeatured,
      productsNew: productsNew
    })
}