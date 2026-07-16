const productRouter = require("./product.route");
const homeRouter = require("./home.route");
const searchRouter = require("./search.route");
const cartRouter = require("./cart.route");
const checkoutRouter = require("./checkout.route");
const userRouter = require("./user.route");
const usersRouter = require("./users.route");
const chatRouter = require("./chat.route");
const categoryMiddleware = require(`../../middlewares/client/category.middleware`);
const middleware = require('../../middlewares/client/user.middleware')
const settingMiddleware = require("../../middlewares/client/setting.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const authMiddleware = require("../../middlewares/client/auth.middleware");

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
  app.use('/chat', authMiddleware.authRequire, chatRouter);
  app.use('/users', authMiddleware.authRequire, usersRouter);
}

