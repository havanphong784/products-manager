// Lắng nghe sự kiện click trên toàn trang (Event Delegation)
document.addEventListener("click", (e) => {
  const btnAdd = e.target.closest("[button-add-friend]");
  if (btnAdd) {
    const userId = btnAdd.getAttribute("button-add-friend");
    socket.emit("CLIENT_ADD_FRIEND", userId);
    return;
  }

  const btnCancel = e.target.closest("[button-cancel-friend]");
  if (btnCancel) {
    const userId = btnCancel.getAttribute("button-cancel-friend");
    socket.emit("CLIENT_CANCEL_FRIEND", userId);
    return;
  }

  const btnAccept = e.target.closest("[button-accept-friend]");
  if (btnAccept) {
    const userId = btnAccept.getAttribute("button-accept-friend");
    socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    return;
  }

  const btnRefuse = e.target.closest("[button-refuse-friend]");
  if (btnRefuse) {
    const userId = btnRefuse.getAttribute("button-refuse-friend");
    socket.emit("CLIENT_REFUSE_FRIEND", userId);
  }
});

// Bắt sự kiện cập nhật cục nút bấm
socket.on("SERVER_RETURN_UPDATE_BUTTONS", (data) => {
  const userCard = document.querySelector(`[data-id="${data.targetUserId}"]`);
  if (userCard) {
    const buttonContainer = userCard.querySelector(".inner-buttons");
    if (buttonContainer) {
      buttonContainer.innerHTML = data.html;
    }
  }
});

// Lắng nghe gửi lời mời
socket.on("SERVER_RETURN_RECEIVED_FRIEND_REQUEST", (data) => {
  const listRequestContainer = document.querySelector("[list-friend-requests]");
  if (listRequestContainer) {
    listRequestContainer.insertAdjacentHTML("afterbegin", data.html);
  }
});

// Lắng nghe hủy lời mời
socket.on("SERVER_RETURN_CANCEL_FRIEND_REQUEST", (data) => {
  const listRequestContainer = document.querySelector("[list-friend-requests]");
  if (listRequestContainer) {
    const cardToDelete = listRequestContainer.querySelector(`[data-id="${data.senderId}"]`);
    if (cardToDelete) {
      listRequestContainer.removeChild(cardToDelete);
    }
  }
});