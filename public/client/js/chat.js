import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';
import {FileUploadWithPreview} from 'https://unpkg.com/file-upload-with-preview/dist/index.js';

const form = document.getElementById('form-chat');
const input = document.getElementById('input-chat');
const chatBody = document.querySelector('.chat-body');
let typingTimeout;
let isTyping = false;

const upload = new FileUploadWithPreview('images-upload-preview', {
  multiple: true,
  maxFiles: 10,
});

let isUploading = false;

if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (isUploading) return;

    const content = input.value;
    const files = upload.cachedFileArray || [];

    if (content || files.length > 0) {
      isUploading = true;
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        let imageUrls = [];

        if (files.length > 0) {
          const formData = new FormData();
          files.forEach(file => {
            formData.append('images', file);
          });

          const response = await fetch('/chat/upload', {
            method: 'POST',
            body: formData
          });
          const data = await response.json();
          imageUrls = data.urls;
        }

        socket.emit('CLIENT_SEND_MESSAGE', {
          content: content,
          images: imageUrls
        });

        input.value = '';
        upload.resetPreviewPanel();

        socket.emit('CLIENT_SEND_TYPING', 'hide');
        isTyping = false;
        clearTimeout(typingTimeout);
      } catch (error) {
        console.error('Lỗi khi gửi tin nhắn:', error);
      } finally {
        isUploading = false;
        if (submitButton) {
          submitButton.disabled = false;
        }
        const chatBody = document.querySelector('.chat-body');
        const gallery = new Viewer(chatBody);
      }
    }
  });
}

// SERVER_RETURN_MESSAGE
socket.on('SERVER_RETURN_MESSAGE', (data) => {
  const chatBody = document.querySelector('.chat-body');
  const myId = chatBody.getAttribute('my-id');
  const div = document.createElement('div');

  let htmlContent = '';
  if (data.content) {
    htmlContent += `<div class="inner-text">${data.content}</div>`;
  }
  if (data.images && data.images.length > 0) {
    htmlContent += `<div class="inner-images">`;
    data.images.forEach(img => {
      htmlContent += `<img src="${img}" class="chat-image" />`;
    });
    htmlContent += `</div>`;
  }

  if (myId === data.userId) {
    div.classList.add('inner-outgoing');
    div.innerHTML = `<div class="inner-content">${htmlContent}</div>`;
  } else {
    div.classList.add('inner-incoming');
    div.innerHTML = `
      <div class="inner-name">${data.fullName}</div>
      <div class="inner-content">${htmlContent}</div>
    `;
  }
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
  // preview lại
  if (gallery) {
    gallery.update();
  }
});

let gallery;
if (chatBody) {
  // cuộn xuống dưới cùng
  chatBody.scrollTop = chatBody.scrollHeight;
  // load component Viewer lần đầu
  gallery = new Viewer(chatBody);
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

// custom-file-container
const buttonImage = document.querySelector('span[button-image]');
if (buttonImage) {
  const customFileContainer = document.querySelector('.custom-file-container');
  buttonImage.addEventListener('click', () => {
    customFileContainer.classList.toggle('show');
  });
}

