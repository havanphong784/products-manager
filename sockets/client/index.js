const User = require('../../models/user.model');
const {parseCookies} = require("../../helpers/parseCookies");
const chatHandler = require('./handlers/chat.handler');
const typingHandler = require('./handlers/typing.handler');
const usersHandler = require('./handlers/users.handler');
const onlineStatusHandler = require('./handlers/online-status.handler');

const onlineUsers = new Map(); // Map<userId, Set<socketId>>

module.exports = (io) => {
  io.on('connection', async (socket) => {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) return;
    const cookies = parseCookies(cookieHeader);
    const tokenUser = cookies.tokenUser;
    if (!tokenUser) return;

    const user = await User.findOne({
      tokenUser: tokenUser,
      deleted: false
    }).select("fullName id friends");
    if (!user) return;

    socket.user = user;
    socket.join(user.id);
    
    const RoomChat = require('../../models/roomChat.model');
    const roomChats = await RoomChat.find({ "users.userId": user.id, deleted: false }).select("_id");
    roomChats.forEach(r => socket.join(r._id.toString()));

    const userId = user.id;
    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);

    const friendIds = (user.friends || []).map(f => f.userId);

    friendIds.forEach(friendId => {
      socket.to(friendId).emit('SERVER_FRIEND_STATUS_CHANGED', {
        userId,
        isOnline: true
      });
    });

    const onlineFriendIds = friendIds.filter(id => onlineUsers.has(id));
    socket.emit('SERVER_ONLINE_FRIENDS_LIST', {onlineFriendIds});

    chatHandler(io, socket);
    typingHandler(io, socket);
    usersHandler(io, socket, onlineUsers);
    onlineStatusHandler(io, socket, onlineUsers);

    socket.on('disconnect', async () => {
      const sockets = onlineUsers.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          
          const lastOnline = new Date();
          await User.updateOne({ _id: userId }, { lastOnline: lastOnline });

          friendIds.forEach(friendId => {
            socket.to(friendId).emit('SERVER_FRIEND_STATUS_CHANGED', {
              userId,
              isOnline: false,
              lastOnline: lastOnline.toISOString()
            });
          });
        }
      }
    });
  });
}