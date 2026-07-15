const Chat = require('../../models/chat.model');
const User = require('../../models/user.model');

module.exports.index = async (req, res) => {
  const chats = await Chat.find({
    deleted: false
  })

  for await (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.userId
    }).select("fullName")
    chat.infoUser = infoUser;
  }

  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats,
  });
};