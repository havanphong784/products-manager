const User = require('../../models/user.model');
const {parseCookies} = require("../../helpers/parseCookies");
const chatHandler = require('./handlers/chat.handler');
const typingHandler = require('./handlers/typing.handler');
const usersHandler = require('./handlers/users.handler');

module.exports = (io) => {
  io.on('connection', async (socket) => {
    const cookieHeader = socket.handshake.headers.cookie;
    const cookies = parseCookies(cookieHeader);
    const tokenUser = cookies.tokenUser;
    if (!tokenUser) return;

    const user = await User.findOne({
      tokenUser: tokenUser,
      deleted: false
    }).select("fullName");
    if (!user) return;

    socket.user = user;
    socket.join(user.id);
    chatHandler(io, socket);
    typingHandler(io, socket);
    usersHandler(io, socket);
  });
}