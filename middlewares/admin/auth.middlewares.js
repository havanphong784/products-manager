const {prefixAdmin} = require("../../config/system");
const Account = require('../../models/account.model');
const Role = require('../../models/role.model');

module.exports.authRequire = async (req, res, next) => {
  if (!req.cookies.token) {
    res.redirect(`${prefixAdmin}/auth/login`);
  } else {
    const user = await Account.findOne({token: req.cookies.token}).select("-password");
    if (!user) {
      res.redirect(`${prefixAdmin}/auth/login`);
    } else {
      res.locals.role = await Role.findOne({
        _id: user.roleId,
        deleted: false
      }).select("permissions title") || {permissions: [], title: ""};
      res.locals.user = user;
      next();
    }
  }
}


