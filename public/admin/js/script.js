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