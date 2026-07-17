const User = require('../../models/user.model')

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  const userId = res.locals.user.id;
  const requestFriends = res.locals.user.requestFriends || [];
  const acceptFriends = res.locals.user.acceptFriends || [];
  const friendsList = res.locals.user.friends ? res.locals.user.friends.map(f => f.userId) : [];

  const users = await User.find({
    $and: [
      {_id: {$ne: userId}},
      {_id: {$nin: requestFriends}},
      {_id: {$nin: acceptFriends}},
      {_id: {$nin: friendsList}}
    ],
    status: "active",
    deleted: false
  }).select("avatar fullName");

  res.render('client/pages/users/not-friend', {
    pageTitle: 'Danh sách người dùng',
    users: users
  });
}

// [GET] /users/request
module.exports.request = async (req, res) => {
  const requestFriends = res.locals.user.requestFriends || [];

  const users = await User.find({
    _id: {$in: requestFriends},
    status: "active",
    deleted: false
  }).select("avatar fullName");

  res.render('client/pages/users/request', {
    pageTitle: 'Lời mời đã gửi',
    users: users
  });
}

// [GET] /users/friend
module.exports.friends = async (req, res) => {
  const friendsList = res.locals.user.friends ? res.locals.user.friends.map(f => f.userId) : [];

  const users = await User.find({
    _id: {$in: friendsList},
    status: "active",
    deleted: false
  }).select("avatar fullName");

  res.render('client/pages/users/friends', {
    pageTitle: 'Danh sách bạn bè',
    users: users
  });
}

// [GET] /users/accept
module.exports.accept = async (req, res) => {
  const acceptFriends = res.locals.user.acceptFriends ? res.locals.user.acceptFriends : [];

  const users = await User.find({
    _id: {$in: acceptFriends},
    status: "active",
    deleted: false
  }).select("avatar fullName");

  res.render('client/pages/users/accept', {
    pageTitle: 'Lời mời kết bạn',
    users: users
  });
}
