const Chat = require('../../models/chat.model');
const User = require('../../models/user.model');
const RoomChat = require('../../models/roomChat.model');

// [GET] /chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;

  const roomChats = await RoomChat.find({
    "users.userId": userId,
    typeRoom: "friend",
    deleted: false
  }).lean();

  const friendUserIds = [];
  for (const roomChat of roomChats) {
    const friendUserId = roomChat.users.find(u => u.userId !== userId)?.userId;
    if (friendUserId) friendUserIds.push(friendUserId);
  }

  const friendsInfo = await User.find({
    _id: { $in: friendUserIds },
    status: "active",
    deleted: false
  }).select("fullName avatar lastOnline").lean();

  const friendsWithRoom = [];
  for (const roomChat of roomChats) {
    const friendUserId = roomChat.users.find(u => u.userId !== userId)?.userId;
    const friendInfo = friendsInfo.find(u => u._id.toString() === friendUserId);
    
    if (friendInfo) {
      friendsWithRoom.push({
        _id: friendInfo._id,
        fullName: friendInfo.fullName,
        avatar: friendInfo.avatar,
        lastOnline: friendInfo.lastOnline,
        roomChatId: roomChat._id,
        latestMessage: roomChat.lastMessage
      });
    }
  }

  res.render("client/pages/chat/index", {
    pageTitle: "Tin nhắn",
    friends: friendsWithRoom,
  });
};

// [GET] /chat/:roomChatId
module.exports.roomChat = async (req, res) => {
  const roomChatId = req.params.roomChatId;
  const userId = res.locals.user.id;

  // kiểm tra room chat
  const roomChat = await RoomChat.findOne({
    _id: roomChatId,
    deleted: false
  }).lean();

  if (!roomChat) {
    return res.redirect('/chat');
  }

  const isInRoom = roomChat.users.some(u => u.userId === userId);
  if (!isInRoom) {
    return res.redirect('/chat');
  }

  const friendUserId = roomChat.users.find(u => u.userId !== userId);
  let friendInfo = null;
  if (friendUserId) {
    friendInfo = await User.findOne({
      _id: friendUserId.userId,
      deleted: false
    }).select("fullName avatar lastOnline").lean();
  }

  const chats = await Chat.find({
    roomChatId: roomChatId,
    deleted: false
  }).sort({createdAt: -1}).limit(50).lean();
  
  chats.reverse();

  for (const chat of chats) {
    if (chat.userId === userId) {
      chat.infoUser = { fullName: res.locals.user.fullName, avatar: res.locals.user.avatar };
    } else if (friendInfo && chat.userId === friendUserId.userId) {
      chat.infoUser = { fullName: friendInfo.fullName, avatar: friendInfo.avatar };
    }
  }

  res.render("client/pages/chat/room", {
    pageTitle: friendInfo ? `Chat với ${friendInfo.fullName}` : "Chat",
    roomChatId: roomChatId,
    friendInfo: friendInfo,
    chats: chats,
  });
};

// [GET] /chat/community
module.exports.community = async (req, res) => {
  const chats = await Chat.find({
    deleted: false,
    roomChatId: "community"
  }).sort({createdAt: -1}).limit(50).lean();
  
  chats.reverse();

  const userIds = [...new Set(chats.map(chat => chat.userId))];
  
  const usersInfo = await User.find({
    _id: { $in: userIds }
  }).select("fullName avatar").lean();

  const userMap = {};
  for (const user of usersInfo) {
    userMap[user._id.toString()] = user;
  }

  for (const chat of chats) {
    chat.infoUser = userMap[chat.userId];
  }

  res.render("client/pages/chat/community", {
    pageTitle: "Chat tổng",
    chats: chats,
  });
};

module.exports.uploadImages = (req, res) => {
  res.json({
    urls: req.body.images || []
  });
};
