const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const productHelper = require("../../helpers/products");


// [GET] /checkout
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId
  const cart = await Cart.findOne({_id: cartId});
  if (cart.products.length > 0) {
    cart.totalPrice = 0;
    for (const item of cart.products) {
      item.productInfo = await Product.findOne({_id: item.productId, deleted: false, status: "active"});
      item.productInfo.priceNew = productHelper.priceNewProduct(item.productInfo);
      cart.totalPrice += item.productInfo.priceNew * item.quantity;
    }
  }

  res.render("client/pages/checkout/index", {
    pageTitle: "Giỏ hàng",
    cart: cart,
  });
}

// [POST] /checkout/order
module.exports.orderPost = async (req, res) => {
  const cartId = req.cookies.cartId
  const userInfo = req.body;

  const cart = await Cart.findOne({_id: cartId});
  let products = [];
  for (const item of cart.products) {
    const objectProduct = {
      productId: item.productId,
      price: 0,
      discountPercentage: 0,
      quantity: item.quantity,
    }

    const productInfo = await Product.findOne({
      _id: item.productId
    })
    objectProduct.price = productInfo.price;
    objectProduct.discountPercentage = productInfo.discountPercentage;
    products.push(objectProduct);
  }

  const objectOrder = {
    cartId: cartId,
    userInfo: userInfo,
    products: products
  }

  const order = new Order(objectOrder);
  await order.save()

  await Cart.updateOne({_id: cartId}, {
    products: [],
  })

  res.redirect(`/checkout/success/${order.id}`);
}

// [GET] /checkout/success
module.exports.success = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.orderId,
  });

  let plainOrder = order;
  if (order) {
    plainOrder = order.toObject();
    plainOrder.id = plainOrder._id;

    for (const product of plainOrder.products) {
      const productInfo = await Product.findOne({_id: product.productId}).select("title thumbnail");
      product.productInfo = productInfo;
      product.priceNew = productHelper.priceNewProduct(product);
      product.totalPrice = product.priceNew * product.quantity;
    }
    plainOrder.totalPrice = plainOrder.products.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  res.render("client/pages/checkout/success", {pageTitle: "Đặt hàng thành công ", order: plainOrder});
}

