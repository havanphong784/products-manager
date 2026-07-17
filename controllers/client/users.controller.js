const User = require('../../models/user.model')

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  const userId = res.locals.user.id;
  const requestFriends = res.locals.user.requestFriends || [];
  const acceptFriends = res.locals.user.acceptFriends || [];
  const friendsList = res.locals.user.friends ? res.locals.user.friends.map(f => f.userId) : [];

  const users = await User.find({
    $and: [
      { _id: { $ne: userId } },
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } },
      { _id: { $nin: friendsList } }
    ],
    status: "active",
    deleted: false
  }).select("avatar fullName");

  res.render('client/pages/users/not-friend', {
    pageTitle: 'Danh sách người dùng',
    users: users
  });
}