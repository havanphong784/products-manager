const {prefixAdmin} = require("../../config/system");
const Accounts = require('../../models/account.model');

module.exports.authRequire = async (req, res, next) => {
  if (!req.cookies.token) {
    res.redirect(`${prefixAdmin}/auth/login`);
  } else {
    const user = await Accounts.findOne({token: req.cookies.token});
    if (!user) {
      res.redirect(`${prefixAdmin}/auth/login`);
    } else {
      next();
    }
  }
}