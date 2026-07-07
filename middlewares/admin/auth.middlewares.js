const {prefixAdmin} = require("../../config/system");
const Accounts = require('../../models/account.model');
const Roles = require('../../models/roles.model');

module.exports.authRequire = async (req, res, next) => {
  if (!req.cookies.token) {
    res.redirect(`${prefixAdmin}/auth/login`);
  } else {
    const user = await Accounts.findOne({token: req.cookies.token}).select("-password");
    if (!user) {
      res.redirect(`${prefixAdmin}/auth/login`);
    } else {
      res.locals.role = await Roles.findOne({
        _id: user.role_id,
        deleted: false
      }).select("permissions title") || {permissions: [], title: ""};
      res.locals.user = user;
      next();
    }
  }
}