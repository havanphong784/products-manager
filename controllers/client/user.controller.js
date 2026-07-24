const User = require('../../models/user.model');
const ForgotPassword = require('../../models/forgot-password.model');
const Cart = require('../../models/cart.model');
const md5 = require('md5');
const generateHelper = require('../../helpers/generate');
const sendMailHelper = require('../../helpers/sendMail');

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
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
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

  res.cookie("tokenUser", user.tokenUser);
  await Cart.updateOne({_id: req.cookies.cartId}, {
    userId: user.id,
  })

  res.redirect("/");
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
}

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password")
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({email: email, deleted: false})

  if (!user) {
    req.flash("error", "Email không tồn tại")
    res.redirect(req.get("referer"));
    return;
  }

  const otp = generateHelper.generateRandomNumber(8);
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now(),
  };
  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  await sendMailHelper.sendMail(
    email,
    "Mã OTP",
    `<h3>Đây là mã otp của bạn <b>${otp}</b></h3>`
  );

  res.redirect("/user/password/otp?email=" + email);
}

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;
  res.render("client/pages/user/otp-password", {
    pageTitle: "Nhập mã OTP",
    email: email,
  });
}

// [GET] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });

  if (!result) {
    req.flash("error", "OTP không tồn tại")
    res.redirect(req.get("referer"));
    return;
  }
  const user = await User.findOne({email: email})
  res.cookie("tokenUser", user.tokenUser)
  res.redirect("/user/password/reset");
}

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Đổi mật khẩu"
  })
}

// [GET] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = md5(req.body.password);
  const tokenUser = req.cookies.tokenUser;
  await User.updateOne({
    tokenUser: tokenUser
  }, {
    password: password,
  })
  res.redirect("/");
}

// [GET] /user/info
module.exports.info = async (req, res) => {
  res.render("client/pages/user/info", {
    pageTitle: "Thông tin cá nhân"
  })
}
