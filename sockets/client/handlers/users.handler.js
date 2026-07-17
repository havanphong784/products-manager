const pug = require('pug');
const path = require('path');
const User = require('../../../models/user.model');

const renderButtons = (userId, status) => pug.renderFile(
  path.join(__dirname, '../../../views/client/partials/friend-buttons.pug'),
  {userId, status}
);

const renderCardWrapper = (user, userId, status) => pug.renderFile(
  path.join(__dirname, '../../../views/client/partials/user-card-wrapper.pug'),
  {user, userId, status}
);

module.exports = (io, socket) => {
  socket.on('CLIENT_ADD_FRIEND', async (targetUserId) => {
    const senderId = socket.user.id;
    try {
      //2 người cùng gửi lời mời cho nhau
      const isDualRequest = await User.findOne({_id: senderId, acceptFriends: targetUserId});

      if (isDualRequest) {
        const mongoose = require('mongoose');
        const roomChatId = new mongoose.Types.ObjectId().toString();

        await User.updateOne({_id: targetUserId}, {
          $pull: {requestFriends: senderId, acceptFriends: senderId},
          $addToSet: {friends: {userId: senderId, roomChatId}}
        });
        await User.updateOne({_id: senderId}, {
          $pull: {acceptFriends: targetUserId, requestFriends: targetUserId},
          $addToSet: {friends: {userId: targetUserId, roomChatId}}
        });

        const [senderInfo, targetInfo] = await Promise.all([
          User.findOne({_id: senderId}).select('avatar fullName'),
          User.findOne({_id: targetUserId}).select('avatar fullName')
        ]);

        // Người gửi: cập nhật button, xóa card khỏi trang lời mời, thêm card bạn bè
        socket.emit('SERVER_RETURN_UPDATE_BUTTONS', {targetUserId, html: renderButtons(targetUserId, 'friend')});
        socket.emit('SERVER_RETURN_REMOVE_REQUEST_CARD', {userId: targetUserId});
        socket.emit('SERVER_RETURN_NEW_FRIEND', {html: renderCardWrapper(targetInfo, targetUserId, 'friend')});

        // Người nhận: cập nhật button, thêm card bạn bè
        socket.to(targetUserId).emit('SERVER_RETURN_UPDATE_BUTTONS', {
          targetUserId: senderId,
          html: renderButtons(senderId, 'friend')
        });
        socket.to(targetUserId).emit('SERVER_RETURN_NEW_FRIEND', {html: renderCardWrapper(senderInfo, senderId, 'friend')});

        return;
      }

      // bình thường
      await User.updateOne({_id: targetUserId}, {$addToSet: {acceptFriends: senderId}});
      await User.updateOne({_id: senderId}, {$addToSet: {requestFriends: targetUserId}});

      const senderInfo = await User.findOne({_id: senderId}).select('avatar fullName');

      //Người gửi: đổi button thành "Hủy yêu cầu"
      socket.emit('SERVER_RETURN_UPDATE_BUTTONS', {targetUserId, html: renderButtons(targetUserId, 'sent_request')});

      //Người nhận: thêm card vào trang lời mời + cập nhật button trên các trang khác
      socket.to(targetUserId).emit('SERVER_RETURN_RECEIVED_FRIEND_REQUEST', {
        senderId,
        html: renderCardWrapper(senderInfo, senderId, 'received_request')
      });
      socket.to(targetUserId).emit('SERVER_RETURN_UPDATE_BUTTONS', {
        targetUserId: senderId,
        html: renderButtons(senderId, 'received_request')
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

      //Người hủy: đổi button thành "Kết bạn"
      socket.emit('SERVER_RETURN_UPDATE_BUTTONS', {targetUserId, html: renderButtons(targetUserId, 'not_friend')});

      //Người nhận: xóa card khỏi trang lời mời + đổi button thành "Kết bạn"
      socket.to(targetUserId).emit('SERVER_RETURN_REMOVE_REQUEST_CARD', {userId: senderId});
      socket.to(targetUserId).emit('SERVER_RETURN_UPDATE_BUTTONS', {
        targetUserId: senderId,
        html: renderButtons(senderId, 'not_friend')
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

      // Người từ chối: xóa card của A khỏi trang lời mời
      socket.emit('SERVER_RETURN_REMOVE_REQUEST_CARD', {userId: targetUserId});

      //Người gửi: đổi button thành "Kết bạn"
      socket.to(targetUserId).emit('SERVER_RETURN_UPDATE_BUTTONS', {
        targetUserId: senderId,
        html: renderButtons(senderId, 'not_friend')
      });

    } catch (error) {
      console.error(error);
    }
  });

  socket.on('CLIENT_ACCEPT_FRIEND', async (targetUserId) => {
    const senderId = socket.user.id;
    try {
      const mongoose = require('mongoose');
      const roomChatId = new mongoose.Types.ObjectId().toString();

      await User.updateOne({_id: targetUserId}, {
        $pull: {requestFriends: senderId},
        $addToSet: {friends: {userId: senderId, roomChatId}}
      });
      await User.updateOne({_id: senderId}, {
        $pull: {acceptFriends: targetUserId},
        $addToSet: {friends: {userId: targetUserId, roomChatId}}
      });

      const [senderInfo, targetInfo] = await Promise.all([
        User.findOne({_id: senderId}).select('avatar fullName'),
        User.findOne({_id: targetUserId}).select('avatar fullName')
      ]);

      // Người chấp nhận: xóa card khỏi lời mời, cập nhật button, thêm card bạn bè
      socket.emit('SERVER_RETURN_REMOVE_REQUEST_CARD', {userId: targetUserId});
      socket.emit('SERVER_RETURN_UPDATE_BUTTONS', {targetUserId, html: renderButtons(targetUserId, 'friend')});
      socket.emit('SERVER_RETURN_NEW_FRIEND', {html: renderCardWrapper(targetInfo, targetUserId, 'friend')});

      // Người gửi: cập nhật button, thêm card bạn bè
      socket.to(targetUserId).emit('SERVER_RETURN_UPDATE_BUTTONS', {
        targetUserId: senderId,
        html: renderButtons(senderId, 'friend')
      });
      socket.to(targetUserId).emit('SERVER_RETURN_NEW_FRIEND', {html: renderCardWrapper(senderInfo, senderId, 'friend')});

    } catch (error) {
      console.error(error);
    }
  });

  socket.on('CLIENT_UNFRIEND', async (targetUserId) => {
    const senderId = socket.user.id;
    try {
      await User.updateOne({_id: targetUserId}, {$pull: {friends: {userId: senderId}}});
      await User.updateOne({_id: senderId}, {$pull: {friends: {userId: targetUserId}}});

      // Người xóa: xóa card B khỏi trang bạn bè, đổi button thành "Kết bạn"
      socket.emit('SERVER_RETURN_REMOVE_FRIEND_CARD', {userId: targetUserId});
      socket.emit('SERVER_RETURN_UPDATE_BUTTONS', {targetUserId, html: renderButtons(targetUserId, 'not_friend')});

      // Người bị xóa: xóa card A khỏi trang bạn bè, đổi button thành "Kết bạn"
      socket.to(targetUserId).emit('SERVER_RETURN_REMOVE_FRIEND_CARD', {userId: senderId});
      socket.to(targetUserId).emit('SERVER_RETURN_UPDATE_BUTTONS', {
        targetUserId: senderId,
        html: renderButtons(senderId, 'not_friend')
      });

    } catch (error) {
      console.error(error);
    }
  });
};