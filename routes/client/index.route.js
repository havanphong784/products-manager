const productRouter = require("./product.route");
const homeRouter = require("./home.route");
const searchRouter = require("./search.route");
const cartRouter = require("./cart.route");
const checkoutRouter = require("./checkout.route");
const userRouter = require("./user.route");
const categoryMiddleware = require(`../../middlewares/client/category.middleware`);
const middleware = require('../../middlewares/client/user.middleware')
const settingMiddleware = require("../../middlewares/client/setting.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");

module.exports = (app) => {
  app.use(categoryMiddleware.categoryMiddleware)
  app.use(cartMiddleware.cartId)
  app.use(middleware.infoUser)
  app.use(settingMiddleware.settingGeneral)
  app.use('/', homeRouter);
  app.use('/product', productRouter)
  app.use('/search', searchRouter)
  app.use('/cart', cartRouter)
  app.use('/checkout', checkoutRouter);
  app.use('/user', userRouter);
}

