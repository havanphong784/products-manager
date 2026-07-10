const productRouter = require("./product.route");
const homeRouter = require("./home.route");
const searchRouter = require("./search.route");
const cartRouter = require("./cart.route");
const checkoutRouter = require("./checkout.route");
const categoryMiddleware = require(`../../middlewares/client/category.middleware`);
const cartMiddleware = require("../../middlewares/client/cart.middleware");

module.exports = (app) => {
  app.use(categoryMiddleware.categoryMiddleware)
  app.use(cartMiddleware.cartId)
  app.use('/', homeRouter);
  app.use('/product', productRouter)
  app.use('/search', searchRouter)
  app.use('/cart', cartRouter)
  app.use('/checkout', checkoutRouter);
}

