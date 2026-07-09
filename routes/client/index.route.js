const categoryMiddleware = require(`../../middlewares/client/category.middleware`);
const productRouter = require("./product.route");
const homeRouter = require("./home.route");
const searchRouter = require("./search.route");

module.exports = (app) => {
  app.use(categoryMiddleware.categoryMiddleware)
  app.use('/', homeRouter);
  app.use('/product', productRouter)
  app.use('/search', searchRouter)
}

