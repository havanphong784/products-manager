const systemConfig = require('../../config/system');
const dashboardRouter = require('./dashboard.route');
const productRouter = require('./product.route');
const productCategoryRouter = require('./product-category.route')
const roleRouter = require('./role.route');
const accountRouter = require('./account.route');
const myAccountRouter = require('./my-account.route');
const authRouter = require('./auth.route');
const authMiddlewares = require('../../middlewares/admin/auth.middlewares');

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(PATH_ADMIN + '/dashboard', authMiddlewares.authRequire, dashboardRouter);
  app.use(PATH_ADMIN + '/product', authMiddlewares.authRequire, productRouter)
  app.use(PATH_ADMIN + '/product-category', authMiddlewares.authRequire, productCategoryRouter)
  app.use(PATH_ADMIN + '/role', authMiddlewares.authRequire, roleRouter)
  app.use(PATH_ADMIN + '/account', authMiddlewares.authRequire, accountRouter)
  app.use(PATH_ADMIN + '/my-account', authMiddlewares.authRequire, myAccountRouter)
  app.use(PATH_ADMIN + '/auth', authRouter)
}

