module.exports = (io, socket) => {
  socket.on('CLIENT_SEND_TYPING', async (type) => {
    socket.broadcast.emit('SERVER_RETURN_TYPING', {
      userId: socket.user.id,
      fullName: socket.user.fullName,
      type: type
    });
  });
};
