// Source/generated-output checks and a DOM stub for unit-testing menu state.
// This is not a browser or a substitute for screenshot inspection.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('public/index.html', 'utf8');
const css = fs.readFileSync('assets/css/custom.css', 'utf8');
const js = fs.readFileSync('static/js/contact-header.js', 'utf8');
const headerMarkup = html.match(/<header class="contact-header"[\s\S]*?<\/header>/)?.[0];
assert(headerMarkup, 'Contact header rendered');
assert(!/id="profiles"/.test(html), 'Standalone profiles section removed');
const links = [...headerMarkup.matchAll(/href="([^"]+)"/g)].map((m) => m[1].replaceAll('&amp;', '&'));
for (const href of [
  '/#research', '/#cv', '/#selected-work', '/#presentations', 'mailto:volkmann@ml.jku.at',
  'https://github.com/gd193',
  'https://scholar.google.com/citations?user=BTpkGgEAAAAJ&hl=en&oi=ao',
  'https://orcid.org/0009-0001-3931-3771', 'https://x.com/e_volkmann',
  'https://www.linkedin.com/in/eric-volkmann-34b027205/',
]) assert(links.includes(href), `Preserved link: ${href}`);
assert(links.indexOf('/#research') < links.indexOf('/#cv'));
assert(links.indexOf('/#cv') < links.indexOf('/#selected-work'));
assert(links.indexOf('/#selected-work') < links.indexOf('/#presentations'));
assert.equal((headerMarkup.match(/rel="noopener noreferrer"/g) || []).length, 5);
for (const id of ['github', 'scholar', 'orcid', 'x', 'linkedin', 'email']) {
  assert(headerMarkup.includes(`aria-describedby="contact-tooltip-${id}"`));
  assert(headerMarkup.includes(`id="contact-tooltip-${id}" role="tooltip"`));
}
assert(/contact-menu-toggle[^>]+aria-label="Open navigation"[\s\S]*?aria-expanded="false"/.test(headerMarkup));
assert(html.includes('<script src="/js/contact-header.js" defer></script>'));
assert(css.includes('min-width: 44px;') && css.includes('min-height: 44px;'));
assert(css.includes(':focus-visible') && css.includes('prefers-reduced-motion'));
assert(css.includes('scroll-margin-top: 8rem') && css.includes('scroll-margin-top: 6rem'));
assert(css.includes('(min-width: 1100px)') && js.includes('(min-width: 1100px)'));
const themeSlot = css.match(/\.contact-icon\.contact-theme \{([^}]+)\}/)?.[1];
assert(themeSlot?.includes('width: 44px;') && themeSlot.includes('height: 44px;'));
assert(themeSlot.includes('grid-template: 22px / 22px;') && themeSlot.includes('flex-basis: 44px;'));
assert(css.includes('grid-area: 1 / 1;'));
assert(css.includes('.contact-theme > .contact-theme-sun { visibility: hidden; }'));
assert(css.includes('.dark .contact-theme > .contact-theme-moon { visibility: hidden; }'));
assert(css.includes('.dark .contact-theme > .contact-theme-sun { visibility: visible; }'));
for (const page of ['phd_seminar_ss2026', 'tu-vienna-presentation', 'ai4simulation_vibecoding']) {
  const markup = fs.readFileSync(`public/slides/${page}/index.html`, 'utf8');
  assert(markup.includes('data-contact-header'), `Header included on ${page}`);
}

// Contrast includes normal and hover backgrounds in both themes.
const luminance = (hex) => {
  const rgb = hex.replace('#', '').match(/../g).map((channel) => {
    const value = parseInt(channel, 16) / 255;
    return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
  });
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
};
let minimumIconContrast = Infinity;
for (const [colors, backgrounds] of [
  [['#2457a7', '#5d7809', '#111827', '#0a66c2'], ['#ffffff', '#edf2f8']],
  [['#8ab4f8', '#b7df4a', '#f8fafc', '#70b7ff'], ['#000000', '#171b22']],
]) for (const foreground of colors) for (const background of backgrounds) {
  assert(css.includes(foreground));
  const a = luminance(foreground), b = luminance(background);
  const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
  minimumIconContrast = Math.min(minimumIconContrast, ratio);
  assert(ratio >= 3, `${foreground} on ${background}: ${ratio.toFixed(2)}`);
}
for (const [foreground, background] of [['#42516a', '#ffffff'], ['#cbd5e1', '#000000'], ['#2457a7', '#eef4ff'], ['#dbeafe', '#121c2c']]) {
  const a = luminance(foreground), b = luminance(background);
  assert((Math.max(a, b) + .05) / (Math.min(a, b) + .05) >= 4.5);
}

const listeners = () => new Map();
const doc = { events: listeners(), activeElement: null, addEventListener(type, fn) { this.events.set(type, fn); } };
const element = (name) => ({
  name, hidden: false, attrs: {}, events: listeners(),
  setAttribute(key, value) { this.attrs[key] = value; },
  getAttribute(key) { return this.attrs[key]; },
  removeAttribute(key) { delete this.attrs[key]; },
  addEventListener(type, fn) { this.events.set(type, fn); },
  focus() { doc.activeElement = this; header.events.get('focusin')?.(); },
});
const toggle = element('toggle'), firstLink = element('first-link'), menu = element('menu'), header = element('header');
menu.contains = (target) => target === firstLink;
menu.querySelector = () => firstLink;
header.contains = (target) => [header, toggle, firstLink, menu].includes(target);
header.querySelector = (selector) => selector === '.contact-menu-toggle' ? toggle : menu;
doc.querySelector = () => header;
const media = { matches: false, events: listeners(), addEventListener(type, fn) { this.events.set(type, fn); } };
vm.runInNewContext(js, { document: doc, window: { matchMedia: () => media } });
assert.equal(menu.hidden, true);
assert.equal(toggle.hidden, false);
toggle.events.get('click')();
assert.equal(menu.hidden, false);
assert.equal(toggle.getAttribute('aria-expanded'), 'true');
assert.equal(doc.activeElement, firstLink);
let prevented = false;
header.events.get('keydown')({ key: 'Escape', preventDefault() { prevented = true; } });
assert(prevented);
assert.equal(menu.hidden, true);
assert.equal(doc.activeElement, toggle);
header.events.get('keydown')({ key: 'Escape' });
assert.equal(header.getAttribute('data-tooltip-dismissed'), '');
header.events.get('focusin')();
assert.equal(header.getAttribute('data-tooltip-dismissed'), undefined);
toggle.events.get('click')();
menu.events.get('click')({ target: { closest: () => firstLink } });
assert.equal(menu.hidden, true);
toggle.events.get('click')();
doc.events.get('click')({ target: {} });
assert.equal(menu.hidden, true);
toggle.focus();
media.matches = true;
media.events.get('change')();
assert.equal(menu.hidden, false);
assert.equal(toggle.hidden, true);
assert.equal(doc.activeElement, firstLink);
media.matches = false;
media.events.get('change')();
assert.equal(menu.hidden, true);
assert.equal(toggle.hidden, false);
assert.equal(doc.activeElement, toggle);

console.log(`PASS: generated header links, accessible markup, theme colours (minimum icon contrast ${minimumIconContrast.toFixed(2)}:1), and mobile-menu state transitions.`);
console.log('Visual responsive verification remains unperformed because browser access is blocked.');
