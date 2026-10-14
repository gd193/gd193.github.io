/* Small progressive enhancement: contact links remain visible without JS. */
(() => {
  const header = document.querySelector('[data-contact-header]');
  if (!header) return;
  const toggle = header.querySelector('.contact-menu-toggle');
  const menu = header.querySelector('#contact-section-menu');
  const desktop = window.matchMedia('(min-width: 1100px)');

  const setExpanded = (expanded) => {
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
    menu.hidden = !desktop.matches && !expanded;
  };
  const syncViewport = () => {
    // A breakpoint change must never leave keyboard focus in hidden content.
    if (!desktop.matches) {
      toggle.hidden = false;
      if (menu.contains(document.activeElement)) toggle.focus();
    }
    if (desktop.matches && document.activeElement === toggle) menu.querySelector('a')?.focus();
    toggle.hidden = desktop.matches;
    setExpanded(false);
  };

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') !== 'true';
    setExpanded(expanded);
    if (expanded) menu.querySelector('a')?.focus();
  });
  menu.addEventListener('click', (event) => {
    if (!desktop.matches && event.target.closest('a')) {
      setExpanded(false);
      toggle.focus({ preventScroll: true });
    }
  });
  header.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') header.setAttribute('data-tooltip-dismissed', '');
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      event.preventDefault();
      setExpanded(false);
      toggle.focus();
    }
  });
  header.addEventListener('focusin', () => header.removeAttribute('data-tooltip-dismissed'));
  header.addEventListener('pointerover', () => header.removeAttribute('data-tooltip-dismissed'));
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) setExpanded(false);
  });
  desktop.addEventListener('change', syncViewport);
  syncViewport();
})();
