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

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  const account = await Accounts.findOne({_id: id, deleted: false});

  const roles = await Roles.find({deleted: false})
  res.render("admin/pages/accounts/edit", {
    pageTitle: "Sửa tài khoản",
    account: account,
    roles: roles
  })
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  if (req.body.password) {
    req.body.password = md5(req.body.password);
  } else {
    delete req.body.password;
  }
  const emailExist = await Accounts.findOne({
    email: req.body.email,
    _id: { $ne: id },
    deleted: false
  });
  if (emailExist) {
    req.flash("error", "Email đã tồn tại !")
    res.redirect(req.get("referer"));
    return;
  }
  try {
    await Accounts.updateOne({_id: id}, req.body)
    req.flash("success", "Cập nhật tài khoản thành công")
  } catch {
    req.flash("error", "Cập nhật tài khoản thất bại")
  }
  res.redirect(req.get("referer") || `${prefixAdmin}/accounts`);
}
