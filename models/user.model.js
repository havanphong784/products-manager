const mongoose = require('mongoose')
const generate = require("../helpers/generate");

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    tokenUser: {type: String, default: generate.generateRandomString(20)},
    status: {
      type: String,
      default: "active",
    },
    acceptFriends: [{ type: String }],
    requestFriends: [{ type: String }],
    friends: [
      {
        userId: String,
        roomChatId: String,
      }
    ],
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date,
  }, {timestamps: true}
);

const User = mongoose.model("User", userSchema, "users");
module.exports = User;