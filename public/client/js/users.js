const setButtonLoading = (btn) => {
  btn.disabled = true;
  btn.dataset.originalText = btn.textContent;
  btn.textContent = "Đang gửi...";
}

const removeCardFromContainer = (container, userId) => {
  if (!container) return;
  const cards = container.querySelectorAll(`[data-id="${userId}"]`);
  cards.forEach(card => {
    const wrapper = card.closest('.mb-4');
    (wrapper || card).remove();
  });
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
  if (!container) return;
  removeCardFromContainer(container, data.senderId); // deduplication
  container.insertAdjacentHTML("afterbegin", data.html);
});

socket.on("SERVER_RETURN_REMOVE_REQUEST_CARD", (data) => {
  removeCardFromContainer(document.querySelector("[list-friend-requests]"), data.userId);
});

socket.on("SERVER_RETURN_REMOVE_FRIEND_CARD", (data) => {
  removeCardFromContainer(document.querySelector("[list-friends]"), data.userId);
});