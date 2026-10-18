/* Open destination pages separately; preserve in-page navigation and downloads. */
document.querySelectorAll('a[href]').forEach((link) => {
  if (link.hasAttribute('download')) return;
  const destination = new URL(link.getAttribute('href'), document.baseURI);
  if (!['http:', 'https:'].includes(destination.protocol)) return;
  const current = new URL(window.location.href);
  if (destination.origin === current.origin && destination.pathname === current.pathname && destination.search === current.search) return;
  link.setAttribute('target', '_blank');
  const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
  rel.add('noopener');
  rel.add('noreferrer');
  link.setAttribute('rel', [...rel].join(' '));
  if (!link.hasAttribute('title')) link.setAttribute('title', 'Opens in a new tab');
});
