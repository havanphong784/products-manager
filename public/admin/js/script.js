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
