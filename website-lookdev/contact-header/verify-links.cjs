const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function link(href, extra = {}) {
  return {
    attrs: { href, ...extra },
    getAttribute(key) { return this.attrs[key] ?? null; },
    hasAttribute(key) { return key in this.attrs; },
    setAttribute(key, value) { this.attrs[key] = value; },
  };
}
const links = [
  link('https://arxiv.org/abs/2604.06085', { rel: 'author' }),
  link('/present/slides/tu-vienna-presentation/'),
  link('#research'),
  link('/#cv'),
  link('/'),
  link('mailto:volkmann@ml.jku.at'),
  link('/bibtex/tom.bib', { download: '' }),
];
vm.runInNewContext(fs.readFileSync('static/js/link-targets.js', 'utf8'), {
  document: { baseURI: 'https://gd193.github.io/', querySelectorAll: () => links },
  window: { location: { href: 'https://gd193.github.io/' } }, URL,
});
for (const a of links.slice(0, 2)) {
  assert.equal(a.attrs.target, '_blank');
  assert(a.attrs.rel.includes('noopener') && a.attrs.rel.includes('noreferrer'));
}
assert(links[0].attrs.rel.includes('author'));
for (const a of links.slice(2)) assert.equal(a.attrs.target, undefined);
assert(fs.readFileSync('layouts/_partials/components/headers/navbar-simple.html', 'utf8').includes('js/link-targets.js'));
console.log('PASS: external and presentation links open in new tabs; section links, homepage, email and downloads unchanged.');
