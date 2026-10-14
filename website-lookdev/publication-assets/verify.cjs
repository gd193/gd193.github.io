const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const root = '/tmp/hugo-slides-build-OIq96w/site';
const html = fs.readFileSync(`${root}/index.html`, 'utf8');
const about = html.match(/<section id="about"[\s\S]*?<\/section>/)?.[0];
assert(about?.includes('Geometry Team') && about.includes('Braid Technologies'));
assert(!about.includes('at the intersection of'));
assert(html.includes('class="contact-icon contact-github" href="https://github.com/gd193"'));
assert(html.includes('href="/#selected-work"') && html.includes('href="#selected-work">Publications'));
const publications = html.match(/<ul class="publication-list"[\s\S]*?<\/ul>/)?.[0];
assert(publications);
assert.equal((publications.match(/<li class="publication-row"/g) || []).length, 5);
assert.equal((publications.match(/<strong>Eric Volkmann<\/strong>/g) || []).length, 5);
assert.equal((publications.match(/>Paper<\/a>/g) || []).length, 5);
assert.equal((publications.match(/>Code<\/a>/g) || []).length, 4);
const ids = ['gyaradax', 'tom', 'ginns', 'diverse-solutions', 'neuroimaging'];
for (const id of ids) {
  assert(publications.includes(`aria-controls="bibtex-${id}"`));
  assert(publications.includes(`id="bibtex-${id}"`));
  const bib = fs.readFileSync(`static/bibtex/${id}.bib`, 'utf8');
  assert(bib.includes('Volkmann, Eric'));
  assert(bib.startsWith('@inproceedings{'));
  assert.equal((bib.match(/\{/g) || []).length, (bib.match(/\}/g) || []).length);
  assert(fs.existsSync(`${root}/bibtex/${id}.bib`));
}
for (const src of [...publications.matchAll(/<img src="([^"]+)"/g)].map((m) => m[1])) {
  assert(fs.existsSync(root + src), src);
}
for (const name of ['Gianluca Galletti', 'Andreas Radler', 'Johannes Brandstetter', 'Arturs Berzins', 'Sebastian Sanokowski', 'Sepp Hochreiter', 'Alena Brändle', 'Daniel Durstewitz', 'Georgia Koppe']) assert(publications.includes(name), name);
const research = html.match(/<section id="research"[\s\S]*?<\/section>/)?.[0];
assert(research);
assert(!research.includes('+2 more'));
for (const keyword of ['Gyrokinetics', 'JAX', 'CUDA', 'Differentiable physics', 'Inverse problems']) assert(research.includes(keyword), keyword);
assert(!fs.readFileSync('layouts/_partials/hbx/blocks/research-areas/block.html', 'utf8').includes('range first 3'));

// Unit test the actual citation script against a small DOM stub, not a live browser.
async function testCopy(clipboardWorks) {
  const listeners = new Map();
  const code = { textContent: ' @inproceedings{test, author = {Volkmann, Eric}}\n' };
  const pre = { focused: false, focus() { this.focused = true; } };
  const summary = { hidden: false };
  const status = { textContent: '' };
  const details = { open: false, querySelector(selector) { return { code, pre, summary }[selector]; } };
  const button = {
    hidden: true, attrs: { 'aria-controls': 'bibtex-test' },
    getAttribute(key) { return this.attrs[key]; },
    setAttribute(key, value) { this.attrs[key] = value; },
    closest() { return { querySelector: () => status }; },
    addEventListener(type, fn) { listeners.set(type, fn); },
  };
  let copied;
  const clipboard = clipboardWorks ? { async writeText(text) { copied = text; } } : { async writeText() { throw new Error('Permission denied'); } };
  vm.runInNewContext(fs.readFileSync('static/js/publications.js', 'utf8'), {
    document: { querySelectorAll: () => [button], getElementById: () => details },
    navigator: { clipboard },
  });
  assert.equal(button.hidden, false);
  assert.equal(summary.hidden, true);
  await listeners.get('click')();
  assert.equal(details.open, true);
  assert.equal(button.attrs['aria-expanded'], 'true');
  if (clipboardWorks) {
    assert.equal(copied, code.textContent.trim());
    assert.equal(status.textContent, 'BibTeX copied.');
  } else {
    assert(pre.focused);
    assert(status.textContent.includes('Select the citation'));
  }
  await listeners.get('click')();
  assert.equal(details.open, false);
  assert.equal(button.attrs['aria-expanded'], 'false');
  assert.equal(status.textContent, '');
}
Promise.all([testCopy(true), testCopy(false)]).then(() => {
  console.log('PASS: five complete author lists/teasers/citations; GitHub and Publications navigation; current Braid bio; all keywords; BibTeX copy, close, and permission-denied fallback.');
  console.log('Browser visual verification was not performed.');
}).catch((error) => { console.error(error); process.exitCode = 1; });
