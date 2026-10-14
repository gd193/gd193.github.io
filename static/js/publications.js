/* Native details work without JavaScript; clipboard failures leave selectable text. */
document.querySelectorAll('[data-bibtex-copy]').forEach((button) => {
  const details = document.getElementById(button.getAttribute('aria-controls'));
  if (!details) return;
  const status = button.closest('.publication-content').querySelector('.publication-copy-status');
  const summary = details.querySelector('summary');
  button.hidden = false;
  summary.hidden = true;
  button.addEventListener('click', async () => {
    details.open = !details.open;
    button.setAttribute('aria-expanded', String(details.open));
    status.textContent = '';
    if (!details.open) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(details.querySelector('code').textContent.trim());
      if (details.open) status.textContent = 'BibTeX copied.';
    } catch {
      if (details.open) {
        status.textContent = 'Copy unavailable. Select the citation below, or download it.';
        details.querySelector('pre').focus({ preventScroll: true });
      }
    }
  });
});
