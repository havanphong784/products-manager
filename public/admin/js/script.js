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

    if (inputChecked.length > 0) {
      let ids = [];
      const inputsId = formChangeMulti.querySelector("input[name='ids']");
      inputChecked.forEach(input => {
        ids.push(input.value);
      })
      inputsId.value = ids.join(", ");
      formChangeMulti.submit()
    } else {
      alert('Vui lòng chọn ít nhất 1 sản phẩm để thực hiện thao tác này');
    }
  })
}
