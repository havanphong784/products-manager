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

// Product Detail Quantity Picker
const qtyMinus = document.querySelector(".btn-qty-minus");
const qtyPlus = document.querySelector(".btn-qty-plus");
const qtyInput = document.querySelector(".quantity-input");

if (qtyMinus && qtyPlus && qtyInput) {
  qtyMinus.addEventListener("click", () => {
    let current = parseInt(qtyInput.value) || 1;
    const min = parseInt(qtyInput.getAttribute("min")) || 1;
    if (current > min) {
      qtyInput.value = current - 1;
    }
  });

  qtyPlus.addEventListener("click", () => {
    let current = parseInt(qtyInput.value) || 1;
    const max = parseInt(qtyInput.getAttribute("max")) || 999;
    if (current < max) {
      qtyInput.value = current + 1;
    }
  });
}