const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = showAlert.getAttribute("data-time");
  const closeAlert = showAlert.querySelector("[closeAlert]");
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  showAlert.addEventListener("click", (e) => {
    showAlert.classList.add("alert-hidden");
  })
}


const buttonsGoBack = document.querySelectorAll("[button-go-back]");
if (buttonsGoBack.length > 0) {
  buttonsGoBack.forEach(button => {
    button.addEventListener("click", (e) => {
      history.back();
    })
  })
}

// User Menu Active Link
const userMenuButtons = document.querySelectorAll(".user-menu-buttons .btn-menu");
if (userMenuButtons.length > 0) {
  const currentPath = window.location.pathname;
  userMenuButtons.forEach(button => {
    if (button.getAttribute("href") === currentPath) {
      button.classList.add("active");
    }
  });
}