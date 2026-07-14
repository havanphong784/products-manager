const form = document.getElementById('form-chat');
const input = document.getElementById('input-chat');


if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('CLIENT_SEND_MESSAGE', input.value);
      input.value = '';
    }
  });
}

// SERVER_RETURN_MESSAGE
socket.on('SERVER_RETURN_MESSAGE', (data) => {
  const chatBody = document.querySelector('.chat-body');
  const myId = chatBody.getAttribute('my-id');
  const div = document.createElement('div');

  if (myId === data.userId) {
    div.classList.add('inner-outgoing');
    div.innerHTML = `<div class="inner-content">${data.content}</div>`;
  } else {
    div.classList.add('inner-incoming');
    div.innerHTML = `
      <div class="inner-name">${data.fullName}</div>
      <div class="inner-content">${data.content}</div>
    `;
  }
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
});
