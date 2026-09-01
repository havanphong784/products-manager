const {prefixAdmin} = require("../../config/system");
const Account = require("../../models/account.model");
const md5 = require("md5");

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
  if (req.cookies.token) {
    res.redirect(`${prefixAdmin}/dashboard`);
  } else {
    res.render('admin/pages/auth/login', {
      pageTitle: 'Login',
    })
  }
}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const {email, password} = req.body

  const account = await Account.findOne({email: email, deleted: false});
  if (!account) {
    req.flash('error', 'Email không tồn tại');
    res.redirect(`${prefixAdmin}/auth/login`);
    return;
  }

  if (md5(password) !== account.password) {
    req.flash('error', 'Sai mật khẩu');
    res.redirect(`${prefixAdmin}/auth/login`);
    return;
  }

  if (account.status !== 'active') {
    req.flash('error', 'Tài khoản của bạn đã bị khóa');
    res.redirect(`${prefixAdmin}/auth/login`);
    return;
  }

  res.cookie("token", account.token);
  res.redirect(`${prefixAdmin}/dashboard`);
}

// [GET] /admin/auth/login
module.exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.redirect(`${prefixAdmin}/auth/login`);
}


