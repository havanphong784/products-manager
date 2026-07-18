module.exports = (io, socket) => {
  socket.on('CLIENT_SEND_TYPING', async (data) => {
    const type = data.type;
    const roomChatId = data.roomChatId || 'community';

    const typingData = {
      userId: socket.user.id,
      fullName: socket.user.fullName,
      type: type
    };

    if (roomChatId !== 'community') {
      socket.to(roomChatId).emit('SERVER_RETURN_TYPING', typingData);
    } else {
      socket.broadcast.emit('SERVER_RETURN_TYPING', typingData);
    }
  });
};
