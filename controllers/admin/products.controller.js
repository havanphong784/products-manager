// [GET] /admin/products

const Product = require('../../models/products.model')

module.exports.index = async (req, res) => {
  const filterStatus = [
    {
      name: 'Tất cả',
      status: '',
      class: '',
    },
    {
      name: 'Hoạt đông',
      status: 'active',
      class: '',
    },
    {
      name: 'Ngừng hoạt động',
      status: 'inactive',
      class: '',
    }
  ]
  let find = {
    deleted: false,
  }
  if (req.query.status) {
    find.status = req.query.status;
    const index = filterStatus.findIndex(item => item.status === req.query.status);
    filterStatus[index].class = "active";
  } else {
    filterStatus[0].class = "active";
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
  })
}