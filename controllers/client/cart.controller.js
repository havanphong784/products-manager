const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helpers/products");


// [GET] /cart
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

  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng",
    cart: cart,
  });
}

//[POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);

  const cart = await Cart.findOne({_id: cartId})

  const item = {
    productId: productId,
    quantity: quantity,
  }

  const existProduct = cart.products.find(item => item.productId == productId);
  if (existProduct) {
    const newQuantity = quantity + existProduct.quantity;
    await Cart.updateOne(
      {_id: cartId, 'products.productId': productId},
      {'products.$.quantity': newQuantity}
    );
  } else {
    await Cart.updateOne({_id: cartId}, {$push: {products: item}});
  }
  req.flash("success", "Đã thêm vào giỏ hàng");
  res.redirect(res.get("referer") || "/product");
}

//[GET] /cart/delele/:productId
module.exports.delete = async (req, res) => {
  const id = req.params.productId;
  const cartId = req.cookies.cartId;
  await Cart.updateOne({_id: cartId}, {"$pull": {products: {"productId": id}}});
  req.flash("success", "Xóa thành công")
  res.redirect(res.get("referer") || "/cart");
}

//[GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
  const id = req.params.productId;
  const quantity = parseInt(req.params.quantity);
  const cartId = req.cookies.cartId;
  await Cart.updateOne({_id: cartId, 'products.productId': id}, {'products.$.quantity': quantity});
  req.flash("success", "Cập nhật số lượng thành công ")
  res.redirect(res.get("referer") || "/cart");
}
