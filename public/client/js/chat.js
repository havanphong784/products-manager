import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';

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

const chatBody = document.querySelector('.chat-body');
if (chatBody) {
  chatBody.scrollTop = chatBody.scrollHeight;
}

document.querySelector('emoji-picker')
  .addEventListener('emoji-click', event => console.log(event.detail));

const emojiPicker = document.querySelector('emoji-picker');
if (emojiPicker) {
  const input = document.getElementById('input-chat');
  emojiPicker.addEventListener('emoji-click', (e) => {
    input.value = input.value + e.detail.unicode
  });
}


const button = document.querySelector('span[chat-icon]');
if (button) {
  console.log("ok")
  const tooltip = document.querySelector('.tooltip')
  Popper.createPopper(button, tooltip)
  button.onclick = () => {
    tooltip.classList.toggle('shown')
  }
}

