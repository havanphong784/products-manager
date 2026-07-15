const Chat = require('../../../models/chat.model');

module.exports = (io, socket) => {
  socket.on('CLIENT_SEND_MESSAGE', async (data) => {
    const chat = new Chat({
      userId: socket.user.id,
      content: data.content,
      images: data.images
    });
    await chat.save();

    io.emit('SERVER_RETURN_MESSAGE', {
      userId: socket.user.id,
      fullName: socket.user.fullName,
      content: data.content,
      images: data.images
    });
  });
};
