const systemConfig = require('../../config/system');
const dashboardRouter = require('./dashboard.route');
const productsRouter = require('./products.route');
const productsCategoryRouter = require('./products-category.route')
const rolesRouter = require('./roles.route');
const accountsRouter = require('./accounts.route');
const myAccountRouter = require('./my-account.route');
const authRouter = require('./auth.route');
const authMiddlewares = require('../../middlewares/admin/auth.middlewares');

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(PATH_ADMIN + '/dashboard', authMiddlewares.authRequire, dashboardRouter);
  app.use(PATH_ADMIN + '/products', authMiddlewares.authRequire, productsRouter)
  app.use(PATH_ADMIN + '/products-category', authMiddlewares.authRequire, productsCategoryRouter)
  app.use(PATH_ADMIN + '/roles', authMiddlewares.authRequire, rolesRouter)
  app.use(PATH_ADMIN + '/accounts', authMiddlewares.authRequire, accountsRouter)
  app.use(PATH_ADMIN + '/my-account', authMiddlewares.authRequire, myAccountRouter)
  app.use(PATH_ADMIN + '/auth', authRouter)
}