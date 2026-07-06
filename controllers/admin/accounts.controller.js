const Accounts = require("../../models/account.model");
const {prefixAdmin} = require("../../config/system");
const md5 = require("md5");
const Roles = require("../../models/roles.model");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  }
  const accounts = await Accounts.find(find).select("-password-token");
  for (let account of accounts) {
    if (account.role_id) {
      let role = await Roles.findOne({_id: account.role_id, deleted: false})
      account.role = role ? role : {title: ""};
    } else {
      account.role = {title: ""};
    }
  }
  res.render("admin/pages/accounts/index", {
    pageTitle: "Quản lí tài khoản",
    accounts: accounts
  });
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const role = await Roles.find({deleted: false});
  console.log(req)
  res.render("admin/pages/accounts/create", {
    pageTitle: "Tạo tài khoản",
    roles: role
  });
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  req.body.password = md5(req.body.password);
  const emailExist = await Accounts.findOne({email: req.body.email, deleted: false});
  if (emailExist) {
    req.flash("error", "Email đã tồn tại !")
    res.redirect(req.get("referer") || `${prefixAdmin}/accounts/create`);
    return;
  }
  try {
    const account = new Accounts(req.body);
    await account.save();
    req.flash("success", "Tạo tài khoản thành công !");
    res.redirect(`${prefixAdmin}/accounts`);
  } catch (err) {
    req.flash("error", "Tạo tài khoản thất bại !")
    res.redirect(req.get("referer") || `${prefixAdmin}/accounts/create`);
  }
}