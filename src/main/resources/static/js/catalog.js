document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.filters');
  const submit = form?.querySelector('.filter-submit');
  form?.addEventListener('submit', () => {
    if (submit) { submit.disabled = true; submit.textContent = 'Refining…'; }
  });
});
