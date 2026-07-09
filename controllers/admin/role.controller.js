const Role = require("../../models/role.model");
const {prefixAdmin} = require("../../config/system");
//[GET] /admin/roles
module.exports.index = async (red, res) => {
  const roles = await Role.find({deleted: false});
  res.render(`admin/pages/role/index`, {
    pageTitle: "Nhóm quyền",
    roles: roles,
  });
};

//[GET] /admin/roles/create
module.exports.create = async (red, res) => {
  res.render(`admin/pages/role/create`, {
    pageTitle: "Tạo nhóm quyền",
  });
};

//[PATCH] /admin/roles/create
module.exports.createPost = async (req, res) => {
  try {
    const role = new Roles(req.body);
    await role.save();
    res.redirect(`${prefixAdmin}/role`);
  } catch (error) {
    res.redirect(req.get("referer"));
  }
};

//[GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const role = await Role.findOne({_id: id})
    res.render(`admin/pages/role/edit`, {
      pageTitle: "Chỉnh sủa phân quyền",
      role: role
    })
  } catch (error) {
    res.redirect(req.get("referer"));
  }
};

//[PATCH] /admin/roles/edit/:id
module.exports.editPost = async (req, res) => {
  const id = req.params.id;
  try {
    await Role.updateOne({_id: id}, req.body);
    req.flash("success", "Cập nhật nhóm quyền thành công");
  } catch (error) {
    req.flash("error", "Cập nhật nhóm quyền thất bại");
    res.redirect(req.get("referer"));
  }
};

//[PATCH] /admin/roles/delete/:id
module.exports.deletePatch = async (req, res) => {
  const id = req.params.id;
  try {
    await Role.updateOne({_id: id}, {deleted: true, deletedAt: new Date()});
    req.flash("success", "Xóa nhóm quyền thành công");
    res.redirect(req.get("referer"));
  } catch (error) {
    req.flash("error", "Xóa nhóm quyền thất bại");
    res.redirect(req.get("referer"));
  }
};

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false
  }
  const records = await Role.find(find);

  res.render(`admin/pages/role/permissions`, {
    pageTitle: "Phân quyền",
    records: records
  })
}

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  try {
    const permissions = JSON.parse(req.body.permissions);

    for (const item of permissions) {
      await Role.updateOne({_id: item.id}, {permissions: item.permissions})
    }
    req.flash("success", "Cập nhật phân quyền thành công")
    res.redirect(`${prefixAdmin}/role/permissions`);
  } catch (error) {
    res.redirect(`${prefixAdmin}/role/permissions`);
  }
}

