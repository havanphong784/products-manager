const Product = require('../../models/products.model')

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

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    const slug = req.params.slug
    try {
        const product = await Product.findOne({deleted: false, slug: slug})
        res.render('client/pages/products/detail.pug', {
            pageTitle: product.title, product: product, status: "active"
        })
    } catch (e) {
        res.redirect("/products")
    }
}