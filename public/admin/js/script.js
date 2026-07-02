const btnFilter = document.querySelectorAll('.btn-filter');

btnFilter.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const url = new URL(window.location.href);
    const status = btn.getAttribute('button-status');
    if (status) {
      url.searchParams.set('status', status);
    } else {
      url.searchParams.delete('status');
    }
    window.location.href = url.href;
  })
})

const formSearch = document.getElementById('form-search');
if (formSearch) {
  formSearch.addEventListener('submit', (e) => {
    const url = new URL(window.location.href);
    e.preventDefault();
    const key = e.target.elements.keyword.value;
    if (key) {
      url.searchParams.set('keyword', key);
    } else {
      url.searchParams.delete('keyword');
    }
    window.location.href = url.href;
  })
}

const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkAll']");
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

  inputCheckAll.addEventListener('change', (e) => {
    if (inputCheckAll.checked) {
      inputsId.forEach(input => {
        input.checked = true;
      })
    } else {
      inputsId.forEach(input => {
        input.checked = false;
      })
    }
  })

  inputsId.forEach(input => {
    input.addEventListener('change', () => {
      const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
      if (countChecked === inputsId.length) {
        inputCheckAll.checked = true
      } else {
        inputCheckAll.checked = false
      }
    })
  })
}

const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener('submit', (e) => {
    e.preventDefault();
    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");

    const typeChange = e.target.elements.type.value;

    if (typeChange === "delete") {
      let cf = confirm('Bạn có chắc chắn muốn xóa các sản phẩm đã chọn không?');
      if (!cf) {
        return;
      }
    }

    if (inputChecked.length > 0) {
      let ids = [];
      const inputsId = formChangeMulti.querySelector("input[name='ids']");
      inputChecked.forEach(input => {
        if (typeChange === "change-position") {
          const position = input.closest('tr').querySelector("input[name='position']").value;
          console.log(position);
          ids.push(`${input.value}-${position}`);
          console.log(ids);
        } else {
          ids.push(input.value);
        }
      })
      inputsId.value = ids.join(", ");

      formChangeMulti.submit()
    } else {
      alert('Vui lòng chọn ít nhất 1 sản phẩm để thực hiện thao tác này');
    }
  })
}

const buttonPagination = document.querySelectorAll("[button-pagination]");
if (buttonPagination.length > 0) {
  let url = new URL(window.location.href);
  buttonPagination.forEach(button => {
    button.addEventListener('click', (e) => {
      const page = button.getAttribute('button-pagination');
      url.searchParams.set('page', page);
      window.location.href = url.href;
    })
  })
}

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

const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadPreview = uploadImage.querySelector("[upload-preview]");
  const uploadPreviewInput = uploadImage.querySelector("[upload-preview-input]");
  const closePreview = uploadImage.querySelector("[close-preview]");

  uploadPreviewInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadPreview.src = URL.createObjectURL(file);
      const previewContainer = uploadImage.querySelector(".image-preview-container");
      if (previewContainer) {
        previewContainer.classList.remove("d-none");
      }
    } else {
      uploadPreview.src = "";
      const previewContainer = uploadImage.querySelector(".image-preview-container");
      if (previewContainer) {
        previewContainer.classList.add("d-none");
      }
    }
  });

  if (closePreview) {
    closePreview.addEventListener("click", () => {
      uploadPreviewInput.value = "";
      uploadPreview.src = "";
      const previewContainer = uploadImage.querySelector(".image-preview-container");
      if (previewContainer) {
        previewContainer.classList.add("d-none");
      }
    });
  }
}