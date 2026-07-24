const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonsChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");

  buttonsChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");
      let statusChange = status === "active" ? "inactive" : "active";

      const action = path + `${statusChange}/${id}?_method=PATCH`;
      formChangeStatus.action = action;
      formChangeStatus.submit();
    })
  })
}

const buttonDeletes = document.querySelectorAll("[button-delete]");
if (buttonDeletes.length > 0) {
  const formDelete = document.querySelector("#form-delete-item");
  const path = formDelete.getAttribute("data-path");

  buttonDeletes.forEach(button => {
    button.addEventListener("click", (e) => {
      const cf = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
      if (cf) {
        const id = button.getAttribute("data-id");
        formDelete.action = path + `${id}?_method=DELETE`;
        formDelete.submit();
      }
    })
  })
}