const setButtonLoading = (btn) => {
  btn.disabled = true;
  btn.dataset.originalText = btn.textContent;
  btn.textContent = "Đang gửi...";
}

function removeCardFromContainer(container, userId) {
  if (!container) return;
  const cards = container.querySelectorAll(`[data-id="${userId}"]`);
  cards.forEach(card => {
    const wrapper = card.closest('.mb-4');
    (wrapper || card).remove();
  });
}

function updateBadgeRequest(amount) {
  const badge = document.querySelector("[badge-users-accept]");
  if (badge) {
    let count = parseInt(badge.getAttribute("badge-users-accept")) || 0;
    count += amount;
    if (count < 0) count = 0;
    badge.setAttribute("badge-users-accept", count);
    badge.textContent = count;
  }
}

document.addEventListener("click", (e) => {
  const btnAdd = e.target.closest("[button-add-friend]");
  if (btnAdd) {
    setButtonLoading(btnAdd);
    socket.emit("CLIENT_ADD_FRIEND", btnAdd.getAttribute("button-add-friend"));
    return;
  }

  const btnCancel = e.target.closest("[button-cancel-friend]");
  if (btnCancel) {
    setButtonLoading(btnCancel);
    socket.emit("CLIENT_CANCEL_FRIEND", btnCancel.getAttribute("button-cancel-friend"));
    return;
  }

  const btnAccept = e.target.closest("[button-accept-friend]");
  if (btnAccept) {
    setButtonLoading(btnAccept);
    socket.emit("CLIENT_ACCEPT_FRIEND", btnAccept.getAttribute("button-accept-friend"));
    return;
  }

  const btnRefuse = e.target.closest("[button-refuse-friend]");
  if (btnRefuse) {
    setButtonLoading(btnRefuse);
    socket.emit("CLIENT_REFUSE_FRIEND", btnRefuse.getAttribute("button-refuse-friend"));
    return;
  }

  const btnUnfriend = e.target.closest("[button-unfriend]");
  if (btnUnfriend) {
    if (confirm("Bạn có chắc chắn muốn xóa kết bạn?")) {
      setButtonLoading(btnUnfriend);
      socket.emit("CLIENT_UNFRIEND", btnUnfriend.getAttribute("button-unfriend"));
    }

  }
});

socket.on("SERVER_RETURN_UPDATE_BUTTONS", (data) => {
  document.querySelectorAll(`[data-id="${data.targetUserId}"]`).forEach(card => {
    const btnContainer = card.querySelector(".inner-buttons");
    if (btnContainer) btnContainer.innerHTML = data.html;
  });
});

socket.on("SERVER_RETURN_NEW_FRIEND", (data) => {
  const container = document.querySelector("[list-friends]");
  if (container) container.insertAdjacentHTML("afterbegin", data.html);
});

socket.on("SERVER_RETURN_RECEIVED_FRIEND_REQUEST", (data) => {
  const container = document.querySelector("[list-friend-requests]");
  if (container) {
    removeCardFromContainer(container, data.senderId); // deduplication
    container.insertAdjacentHTML("afterbegin", data.html);
  }
  updateBadgeRequest(1);
});

socket.on("SERVER_RETURN_REMOVE_REQUEST_CARD", (data) => {
  removeCardFromContainer(document.querySelector("[list-friend-requests]"), data.userId);
  updateBadgeRequest(-1);
});

socket.on("SERVER_RETURN_REMOVE_FRIEND_CARD", (data) => {
  removeCardFromContainer(document.querySelector("[list-friends]"), data.userId);
});

socket.emit('CLIENT_GET_ONLINE_FRIENDS');

socket.on('SERVER_ONLINE_FRIENDS_LIST', ({onlineFriendIds}) => {
  onlineFriendIds.forEach(userId => setUserOnline(userId, true));
});

socket.on('SERVER_FRIEND_STATUS_CHANGED', ({userId, isOnline, lastOnline}) => {
  setUserOnline(userId, isOnline, lastOnline);
});

function timeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return 'Vừa mới truy cập';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Hoạt động ${minutes} phút trước`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hoạt động ${hours} giờ trước`;

  const days = Math.floor(hours / 24);
  return `Hoạt động ${days} ngày trước`;
}

const setUserOnline = (userId, isOnline, lastOnline = null) => {
  document.querySelectorAll(`[data-user-id="${userId}"] .status-indicator`).forEach(el => {
    el.classList.toggle('online', isOnline);
    el.classList.toggle('offline', !isOnline);
  });

  document.querySelectorAll(`[data-id="${userId}"] .inner-status`).forEach(el => {
    if (isOnline) {
      el.textContent = 'Đang hoạt động';
      el.removeAttribute('data-last-online');
    } else {
      if (lastOnline) el.setAttribute('data-last-online', lastOnline);
      el.textContent = timeAgo(el.getAttribute('data-last-online'));
    }
  });
}

// Cập nhật tthd mỗi 60 giây
setInterval(() => {
  document.querySelectorAll('.inner-status[data-last-online]').forEach(el => {
    const time = el.getAttribute('data-last-online');
    if (time) el.textContent = timeAgo(time);
  });
}, 60000);

// Init lần đầu khi vừa render xong Pug
document.querySelectorAll('.inner-status[data-last-online]').forEach(el => {
  const time = el.getAttribute('data-last-online');
  if (time) el.textContent = timeAgo(time);
});