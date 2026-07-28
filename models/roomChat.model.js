const mongoose = require('mongoose')

const roomChatSchema = new mongoose.Schema(
  {
    title: String,
    avatar: String,
    typeRoom: String,
    status: String,
    users: [{
      userId: String,
      role: String,
    }],
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date,
    lastMessage: {
      userId: String,
      content: String,
      images: Array,
      createdAt: { type: Date, default: Date.now }
    }
  }, {timestamps: true}
);

const roomChat = mongoose.model("RoomChat", roomChatSchema, "roomChats");
module.exports = roomChat;