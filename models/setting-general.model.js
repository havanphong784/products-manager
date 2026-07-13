const mongoose = require('mongoose')

const settingGeneralSchema = new mongoose.Schema(
  {
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    copyright: String,
  },
);

const settingGeneral = mongoose.model("settingGeneral", settingGeneralSchema, "settingGenerals");
module.exports = settingGeneral;