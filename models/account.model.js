const mongoose = require('mongoose');
const generate = require('../helpers/generate');

const accountSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  token: {type: String, default: generate.generateRandomString(20)},
  phone: String,
  avatar: String,
  roleId: String,
  status: String,
  deletedAt: Date,
  deleted: {type: Boolean, default: false},
}, {timestamps: true});

const Accounts = mongoose.model("Account", accountSchema, "accounts");

module.exports = Accounts;