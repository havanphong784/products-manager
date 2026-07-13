const SettingGeneral = require("../../models/setting-general.model")

module.exports.settingGeneral = async (req, res, next) => {
  res.locals.settingGeneral = await SettingGeneral.findOne({});
  console.log("Setting General: " + JSON.stringify(res.locals.settingGeneral));
  next();
}