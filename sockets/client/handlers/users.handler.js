const pug = require('pug');
const path = require('path');
const User = require('../../../models/user.model');

module.exports = (io, socket) => {
  socket.on('CLIENT_ADD_FRIEND', async (targetUserId) => {
    const senderId = socket.user.id;

    try {
      //  2 người cùng gửi lời mời
      const existUserA = await User.findOne({
        _id: senderId,
        acceptFriends: targetUserId
      });

      if (existUserA) {
        const mongoose = require('mongoose');
        const roomChatId = new mongoose.Types.ObjectId();

        await User.updateOne({_id: targetUserId}, {
          $pull: {requestFriends: senderId, acceptFriends: senderId},
          $addToSet: {friends: {userId: senderId, roomChatId: roomChatId.toString()}}
        });

        await User.updateOne({_id: senderId}, {
          $pull: {acceptFriends: targetUserId, requestFriends: targetUserId},
          $addToSet: {friends: {userId: targetUserId, roomChatId: roomChatId.toString()}}
        });

        const buttonsHtmlForSender = pug.renderFile(
          path.join(__dirname, '../../../views/client/partials/friend-buttons.pug'),
          {userId: targetUserId, status: 'friend'}
        );
        socket.emit('SERVER_RETURN_UPDATE_BUTTONS', {
          targetUserId: targetUserId,
          html: buttonsHtmlForSender
        });

        const buttonsHtmlForTarget = pug.renderFile(
          path.join(__dirname, '../../../views/client/partials/friend-buttons.pug'),
          {userId: senderId, status: 'friend'}
        );
        socket.to(targetUserId).emit('SERVER_RETURN_UPDATE_BUTTONS', {
          targetUserId: senderId,
          html: buttonsHtmlForTarget
        });

        return;
      }

      // 2 người k cùng gửi lời mời
      await User.updateOne({_id: targetUserId}, {$addToSet: {acceptFriends: senderId}});
      await User.updateOne({_id: senderId}, {$addToSet: {requestFriends: targetUserId}});

      const buttonsHtmlForSender = pug.renderFile(
        path.join(__dirname, '../../../views/client/partials/friend-buttons.pug'),
        {userId: targetUserId, status: 'sent_request'}
      );

      socket.emit('SERVER_RETURN_UPDATE_BUTTONS', {
        targetUserId: targetUserId,
        html: buttonsHtmlForSender
      });

      const senderInfo = await User.findOne({_id: senderId}).select("avatar fullName");
      const userCardHtmlForReceiver = pug.renderFile(
        path.join(__dirname, '../../../views/client/partials/user-card.pug'),
        {
          user: senderInfo,
          userId: senderId,
          status: 'received_request'
        }
      );

      socket.to(targetUserId).emit('SERVER_RETURN_RECEIVED_FRIEND_REQUEST', {
        senderId: senderId,
        html: userCardHtmlForReceiver
      });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('CLIENT_CANCEL_FRIEND', async (targetUserId) => {
    const senderId = socket.user.id;

    try {
      await User.updateOne({_id: targetUserId}, {$pull: {acceptFriends: senderId}});
      await User.updateOne({_id: senderId}, {$pull: {requestFriends: targetUserId}});

      const buttonsHtmlForSender = pug.renderFile(
        path.join(__dirname, '../../../views/client/partials/friend-buttons.pug'),
        {userId: targetUserId, status: 'not_friend'}
      );

      socket.emit('SERVER_RETURN_UPDATE_BUTTONS', {
        targetUserId: targetUserId,
        html: buttonsHtmlForSender
      });

      socket.to(targetUserId).emit('SERVER_RETURN_CANCEL_FRIEND_REQUEST', {
        senderId: senderId
      });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('CLIENT_REFUSE_FRIEND', async (targetUserId) => {
    const senderId = socket.user.id;
    try {
      await User.updateOne({_id: targetUserId}, {$pull: {requestFriends: senderId}});
      await User.updateOne({_id: senderId}, {$pull: {acceptFriends: targetUserId}});

      const buttonsHtmlForSender = pug.renderFile(
        path.join(__dirname, '../../../views/client/partials/friend-buttons.pug'),
        {userId: targetUserId, status: 'not_friend'}
      );
      socket.emit('SERVER_RETURN_UPDATE_BUTTONS', {
        targetUserId: targetUserId,
        html: buttonsHtmlForSender
      });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('CLIENT_ACCEPT_FRIEND', async (targetUserId) => {
    const senderId = socket.user.id;
    try {
      const mongoose = require('mongoose');
      const roomChatId = new mongoose.Types.ObjectId();

      await User.updateOne(
        {_id: targetUserId},
        {
          $pull: {requestFriends: senderId},
          $addToSet: {
            friends: {userId: senderId, roomChatId: roomChatId.toString()}
          }
        }
      );

      await User.updateOne(
        {_id: senderId},
        {
          $pull: {acceptFriends: targetUserId},
          $addToSet: {
            friends: {userId: targetUserId, roomChatId: roomChatId.toString()}
          }
        }
      );

      const buttonsHtmlForSender = pug.renderFile(
        path.join(__dirname, '../../../views/client/partials/friend-buttons.pug'),
        {userId: targetUserId, status: 'not_friend'}
      );
      socket.emit('SERVER_RETURN_UPDATE_BUTTONS', {
        targetUserId: targetUserId,
        html: buttonsHtmlForSender
      });
    } catch (error) {
      console.error(error);
    }
  });
};