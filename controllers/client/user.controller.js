const User = require('../../models/user.model');
const md5 = require('md5');

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register")
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false
  })

  if (existEmail) {
    req.flash('error', 'Email đã tồn tại');
    res.redirect(req.get("referer"));
    return;
  }

  req.body.password = await md5(req.body.password);
  const user = new User(req.body);
  await user.save();
  res.cookie("token", user.token);
  console.log(user)
}

// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login")
}

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  const {email, password} = req.body;
  const user = await User.findOne({
    email: email,
    deleted: false
  })
  if (!user) {
    req.flash('error', 'Email không tồn tại');
    res.redirect(req.get("referer"));
    return;
  }
  if (md5(password) !== user.password) {
    req.flash('error', 'Sai mật khẩu');
    res.redirect(req.get("referer"));
    return;
  }
  if (user.status !== "active") {
    req.flash('error', 'Tài khoản đang bị khóa');
    res.redirect(req.get("referer"));
    return;
  }

  res.cookie("token", user.token);
  res.redirect("/");
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
}