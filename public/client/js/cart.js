const inputsQuantity = document.querySelectorAll("input[name=quantity]");
if (inputsQuantity.length > 0) {
  inputsQuantity.forEach(item => {
    item.addEventListener("change", (e) => {
      const productId = item.getAttribute("productId");
      const quantity = item.value;
      if (quantity > 0) {
        window.location.href = `/cart/update/${productId}/${quantity}`;
      }
    })
  })
}

