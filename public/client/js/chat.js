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
