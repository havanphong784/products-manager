const Product = require('../../models/product.model')
const ProductCategory = require('../../models/product-category.model')
const productCategoryHelper = require('../../helpers/product-category')
const productHelper = require('../../helpers/products')

// [GET] /product
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active", deleted: false,
  }).sort({position: "desc"});

  products.forEach(product => {
    product.newPrice = (product.price * (100 - product.discountPercentage) / 100).toFixed(0)
  })

  res.render('client/pages/product/index.pug', {
    pageTitle: 'Products', products: products,
  })
}

// [GET] /product/detail/:slugProduct
module.exports.detail = async (req, res) => {
  const slug = req.params.slugProduct
  try {
    const product = await Product.findOne({deleted: false, slug: slug})
    product.newPrice = productHelper.priceNewProduct(product);
    if (product.productCategoryId) {
      product.category = await ProductCategory.findOne({
        deleted: false,
        _id: product.productCategoryId,
        status: "active"
      })
    }
    res.render('client/pages/product/detail.pug', {
      pageTitle: product.title, product: product
    })
  } catch (e) {
    res.redirect(res.get("referer"))
  }
}

// [GET] /product/:slugCategory
module.exports.category = async (req, res) => {
  const category = await ProductCategory.findOne({deleted: false, slug: req.params.slugCategory});
  if (!category) {
    return res.status(404).render('client/pages/errors/404.pug');
  }

  const chillCategoryIds = await productCategoryHelper.getAllChildCategoryIds(category.id)

  const products = await Product.find({
    deleted: false,
    status: "active",
    productCategoryId: {$in: chillCategoryIds}
  }).sort({position: "desc"});

  res.render('client/pages/product/index.pug', {
    pageTitle: category.title,
    products: products,
  });
}

