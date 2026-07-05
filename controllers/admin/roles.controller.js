const Roles = require("../../models/roles.model");
//[GET] /admin/roles
module.exports.index = async (red, res) => {
  const roles = await Roles.find({deleted: false});
  res.render("admin/pages/roles/index", {
    pageTitle: "Nhóm quyền",
    roles: roles,
  });
};

//[GET] /admin/roles/create
module.exports.create = async (red, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Tạo nhóm quyền",
  });
};

//[PATCH] /admin/roles/create
module.exports.createPost = async (req, res) => {
  try {
    const role = new Roles(req.body);
    await role.save();
    res.redirect(`${prefixAdmin}/roles`);
  } catch (error) {
    res.redirect(res.get("referer"));
  }
};

//[GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const role = await Roles.findOne({_id: id})
    res.render("admin/pages/roles/edit", {
      pageTitle: "Chỉnh sủa phân quyền",
      role: role
    })
  } catch (error) {
    res.redirect(res.get("referer"));
  }
};

//[PATCH] /admin/roles/edit/:id
module.exports.editPost = async (req, res) => {
  const id = req.params.id;
  try {
    await Roles.updateOne({_id: id}, req.body);
    req.flash("success", "Cập nhật nhóm quyền thành công");
  } catch (error) {
    req.flash("error", "Cập nhật nhóm quyền thất bại");
    res.redirect(res.get("referer"));
  }
};
