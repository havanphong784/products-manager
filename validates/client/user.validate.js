module.exports.registerPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash('error', 'Vui lòng nhập họ  tên');
    res.redirect(req.get("referer"));
    return;
  }

  if (!req.body.email) {
    req.flash('error', 'Vui lòng nhập email');
    res.redirect(req.get("referer"));
    return;
  }

  if (!req.body.password) {
    req.flash('error', 'Vui lòng nhập password');
    res.redirect(req.get("referer"));
    return;
  }
  next();
}

module.exports.loginPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash('error', 'Vui lòng nhập email');
    res.redirect(req.get("referer"));
    return;
  }

  if (!req.body.password) {
    req.flash('error', 'Vui lòng nhập password');
    res.redirect(req.get("referer"));
    return;
  }
  next();
}

module.exports.forgotPassword = (req, res, next) => {
  if (!req.body.email) {
    req.flash('error', 'Vui lòng nhập email');
    res.redirect(req.get("referer"));
    return;
  }
  next();
}

module.exports.resetPasswordPost = (req, res, next) => {
  if (!req.body.password) {
    req.flash('error', 'Mật khẩu không được để trống');
    res.redirect(req.get("referer"));
    return;
  }

  if (!req.body.confirmPassword) {
    req.flash('error', 'Nhập lại mật khẩu');
    res.redirect(req.get("referer"));
    return;
  }

  if (req.body.password !== req.body.confirmPassword) {
    req.flash('error', 'Mật khẩu không trùng khớp');
    res.redirect(req.get("referer"));
    return;
  }

  next();
}
