const inputsQuantity = document.querySelectorAll("input[name=quantity]");
if (inputsQuantity.length > 0) {
  inputsQuantity.forEach(item => {
    item.addEventListener("change", (e) => {
      const productId = item.getAttribute("productId");
      const quantity = parseInt(item.value, 10);
      const max = parseInt(item.getAttribute("max"), 10) || Infinity;
      if (quantity > 0 && quantity <= max) {
        window.location.href = `/cart/update/${productId}/${quantity}`;
      } else if (quantity > max) {
        item.value = max;
        window.location.href = `/cart/update/${productId}/${max}`;
      } else {
        item.value = 1;
        window.location.href = `/cart/update/${productId}/1`;
      }
    })
  })
}

