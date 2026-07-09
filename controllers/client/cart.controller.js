const Cart = require("../../models/cart.model");

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