const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    const cart = new Cart();
    await cart.save();
    const time = 1000 * 60 * 60 * 24 * 365;
    res.cookie("cartId", cart.id, {expires: new Date(Date.now() + time)});
    // nhét trực tiếp vào req , tránh lỗi lần chạy đầu
    req.cookies.cartId = cart.id;
    res.locals.miniCart = cart;
    cart.totalQuantity = 0;
  } else {
    const cart = await Cart.findOne({_id: req.cookies.cartId});
    if (cart) {
      cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
      res.locals.miniCart = cart;
    } else {
      const cart = new Cart();
      await cart.save();
      const time = 1000 * 60 * 60 * 24 * 365;
      res.cookie("cartId", cart.id, {expires: new Date(Date.now() + time)});
      req.cookies.cartId = cart.id;
      res.locals.miniCart = cart;
      cart.totalQuantity = 0;
    }
  }
  next();
}