const Chat = require('../../models/chat.model');
const User = require('../../models/user.model');

module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  _io.once('connection', (socket) => {
    socket.on('CLIENT_SEND_MESSAGE', async (msg) => {
      const chat = new Chat({
        userId: userId,
        content: msg,
      })
      await chat.save();
    });
  });

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