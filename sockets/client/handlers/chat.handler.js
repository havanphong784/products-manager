const Chat = require('../../../models/chat.model');
const RoomChat = require('../../../models/romChat.model');

module.exports = (io, socket) => {
  socket.on('CLIENT_JOIN_ROOM', async (roomChatId) => {
    if (roomChatId && roomChatId !== 'community') {
      const room = await RoomChat.findOne({
        _id: roomChatId,
        "users.userId": socket.user.id,
        deleted: false
      });
      if (room) {
        socket.join(roomChatId);
      }
    }
  });

  socket.on('CLIENT_SEND_MESSAGE', async (data) => {
    const roomChatId = data.roomChatId || 'community';

    const chat = new Chat({
      roomChatId: roomChatId,
      userId: socket.user.id,
      content: data.content,
      images: data.images
    });
    await chat.save();

    if (roomChatId !== 'community') {
      await RoomChat.updateOne(
        { _id: roomChatId },
        {
          lastMessage: {
            userId: socket.user.id,
            content: data.content,
            images: data.images,
            createdAt: new Date()
          }
        }
      );
    }

    const messageData = {
      userId: socket.user.id,
      fullName: socket.user.fullName,
      content: data.content,
      images: data.images,
      roomChatId: roomChatId
    };

    if (roomChatId !== 'community') {
      io.to(roomChatId).emit('SERVER_RETURN_MESSAGE', messageData);
    } else {
      io.emit('SERVER_RETURN_MESSAGE', messageData);
    }
  });
};
