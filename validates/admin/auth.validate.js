const {prefixAdmin} = require("../../config/system");
module.exports.login = (req, res, next) => {
  const {email, password} = req.body
  if (!email || !password) {
    req.flash('error', 'Please enter a valid email address!')
    res.redirect(`${prefixAdmin}/auth/login`)
    return
  }
  next();
}
