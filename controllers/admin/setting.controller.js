const SettingGeneral = require("../../models/setting-general.model")
const {prefixAdmin} = require("../../config/system");

// [GET] /admin/setting/general
module.exports.general = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});
  res.render('admin/pages/setting/general', {
    pageTitle: "Cài đặt chung",
    settingGeneral: settingGeneral
  });
}

// [PATCH] /admin/setting/general
module.exports.generalPatch = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});
  if (!settingGeneral) {
    const record = new SettingGeneral(req.body);
    await record.save();
  } else {
    await SettingGeneral.updateOne({_id: settingGeneral.id}, req.body)
  }
  req.flash("success", "Đã lưu cài đặt");
  res.redirect(`${prefixAdmin}/setting/general`)
}
