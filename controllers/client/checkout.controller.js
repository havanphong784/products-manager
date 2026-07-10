const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
consr Order = require("../../models/order.model");
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

// [GET] /checkout
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

    const objectOrder = {
      cartId: cartId,
      userInfo: userInfo,
      products: products
    }

    const order = new Order(objectOrder);
    await order.save()
    await Cart.updateOne({_id: cartId},{
      products: [],
    })
  }
  res.redirect(`client/pages/checkout/${order.id}`);
}
