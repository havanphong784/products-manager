const User = require('../../../models/user.model');

module.exports = (io, socket, onlineUsers) => {
  socket.on('CLIENT_GET_ONLINE_FRIENDS', async () => {
    try {
      const user = await User.findById(socket.user.id).select('friends');
      const friendIds = (user?.friends || []).map(f => f.userId);
      const onlineFriendIds = friendIds.filter(id => onlineUsers.has(id));
      socket.emit('SERVER_ONLINE_FRIENDS_LIST', { onlineFriendIds });
    } catch (error) {
      console.error(error);
    }
  });
};
