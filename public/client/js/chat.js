import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';

const form = document.getElementById('form-chat');
const input = document.getElementById('input-chat');
let typingTimeout;
let isTyping = false;

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('CLIENT_SEND_MESSAGE', input.value);
      input.value = '';

      socket.emit('CLIENT_SEND_TYPING', 'hide');
      isTyping = false;
      clearTimeout(typingTimeout);
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


// EMOJI-PICKER
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
  const tooltip = document.querySelector('.tooltip')
  Popper.createPopper(button, tooltip)
  button.onclick = () => {
    tooltip.classList.toggle('shown')
  }
}


// TYPING
if (input) {
  input.addEventListener('input', () => {
    if (!isTyping) {
      socket.emit('CLIENT_SEND_TYPING', 'show');
      isTyping = true;
    }

    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      socket.emit('CLIENT_SEND_TYPING', 'hide');
      isTyping = false;
    }, 1000);
  });
}

const listTyping = document.querySelector('.list-typing');
if (listTyping) {
  socket.on("SERVER_RETURN_TYPING", (data) => {
    if (data.type === "show") {
      const existBox = listTyping.querySelector(`[user-id="${data.userId}"]`);
      if (!existBox) {
        const boxTyping = document.createElement('div');
        boxTyping.classList.add('box-typing');
        boxTyping.setAttribute('user-id', data.userId);
        boxTyping.innerHTML = `
          <div class="inner-name">${data.fullName}</div>
          <div class="inner-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        `;
        listTyping.appendChild(boxTyping);

        const chatBody = document.querySelector('.chat-body');
        if (chatBody) {
          chatBody.scrollTop = chatBody.scrollHeight;
        }
      }
    } else {
      const existBox = listTyping.querySelector(`[user-id="${data.userId}"]`);
      if (existBox) {
        listTyping.removeChild(existBox);
      }
    }
  });
}