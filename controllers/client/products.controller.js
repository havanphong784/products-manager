const Product = require('../../models/products.model')
const ProductCategory = require('../../models/products-category.model')
const productCategoryHelper = require('../../helpers/product-category')
const productHelper = require('../../helpers/products')

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active", deleted: false,
  }).sort({position: "desc"});

  products.forEach(product => {
    product.newPrice = (product.price * (100 - product.discountPercentage) / 100).toFixed(0)
  })

  res.render('client/pages/products/index.pug', {
    pageTitle: 'Products', products: products,
  })
}

// [GET] /products/detail/:slugProduct
module.exports.detail = async (req, res) => {
  const slug = req.params.slugProduct
  try {
    const product = await Product.findOne({deleted: false, slug: slug})
    product.newPrice = productHelper.priceNewProduct(product);
    if (product.products_category_id) {
      product.category = await ProductCategory.findOne({
        deleted: false,
        _id: product.products_category_id,
        status: "active"
      })
    }
    res.render('client/pages/products/detail.pug', {
      pageTitle: product.title, product: product
    })
  } catch (e) {
    res.redirect(res.get("referer"))
  }
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  const category = await ProductCategory.findOne({deleted: false, slug: req.params.slugCategory});
  if (!category) {
    return res.status(404).render('client/pages/errors/404.pug');
  }

  const chillCategoryIds = await productCategoryHelper.getAllChildCategoryIds(category.id)

  const products = await Product.find({
    deleted: false,
    status: "active",
    products_category_id: {$in: chillCategoryIds}
  }).sort({position: "desc"});

  res.render('client/pages/products/index.pug', {
    pageTitle: category.title,
    products: products,
  });
}