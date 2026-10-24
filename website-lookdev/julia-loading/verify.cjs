const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const script = fs.readFileSync('static/js/julia-hero-video.js', 'utf8');

function events(object = {}) {
  const handlers = {};
  object.addEventListener = (event, callback, options = {}) => {
    (handlers[event] ||= []).push({ callback, once: options.once });
  };
  object.emit = (event) => {
    for (const handler of [...(handlers[event] || [])]) {
      if (handler.once) handlers[event] = handlers[event].filter((h) => h !== handler);
      handler.callback();
    }
  };
  return object;
}

function harness({ reduced = false, saveData = false, rejectPlay = false, deferPlay = false } = {}) {
  const players = [], layers = [];
  let dark = false, onTheme, onVisibility;
  const motion = events({ matches: reduced });
  const connection = events({ saveData });
  const button = events({ hidden: true });
  function layer() {
    const video = events({
      dataset: { src: '/light.mp4', srcDark: '/dark.mp4', poster: '/light.webp', posterDark: '/dark.webp' },
      paused: true, readyState: 0, duration: NaN, currentTime: 0, seeking: false,
      end: 0, start: 0, playCalls: 0, loadCalls: 0, requests: [],
      getAttribute: (key) => video[key],
      load() { this.loadCalls++; },
      pause() { this.paused = true; },
      play() {
        this.playCalls++;
        if (rejectPlay) return Promise.reject(Object.assign(new Error('Blocked'), { name: 'NotAllowedError' }));
        this.paused = false;
        if (deferPlay) return new Promise((resolve, reject) => this.requests.push({ resolve, reject }));
        return Promise.resolve();
      },
    });
    video.buffered = { get length() { return video.end ? 1 : 0; }, start: () => video.start, end: () => video.end };
    const posters = { light: events({ complete: false }), dark: events({ complete: false }) };
    const result = {
      dataset: {}, posters,
      querySelector: (selector) => selector === 'video' ? video : posters[selector.endsWith('--dark') ? 'dark' : 'light'],
      cloneNode: () => layer(), after() {},
      setAttribute(key) { this[key] = true; }, removeAttribute(key) { delete this[key]; },
    };
    video.parentElement = result;
    players.push(video); layers.push(result);
    return result;
  }
  layer();
  const hero = { dataset: {}, querySelector: (selector) => selector.includes('toggle') ? button : players[0] };
  const document = events({ hidden: false, getElementById: () => hero, documentElement: { classList: { contains: () => dark } } });
  const context = {
    document, navigator: { connection }, matchMedia: () => motion,
    MutationObserver: class { constructor(callback) { onTheme = callback; } observe() {} },
    IntersectionObserver: class { constructor(callback) { onVisibility = callback; } observe() {} },
    window: { IntersectionObserver: true }, requestAnimationFrame: (callback) => callback(),
    setTimeout: () => 1, clearTimeout() {},
  };
  vm.runInNewContext(script, context);
  return {
    players, layers, button, hero, motion, document,
    visible(value = true) { onVisibility([{ isIntersecting: value }]); },
    dark(value = true) { dark = value; onTheme(); },
    poster(theme) {
      const index = theme === 'light' ? 0 : 1;
      layers[index].posters[theme].complete = true;
      layers[index].posters[theme].emit('load');
    },
    buffer(index = 0, end = 12) {
      Object.assign(players[index], { duration: 12, end, readyState: 4 });
      players[index].emit('progress');
    },
  };
}

(async () => {
  const h = harness(); h.visible();
  assert.equal(h.players[0].loadCalls, 0, 'Poster has bandwidth priority');
  h.poster('light');
  assert.equal(h.players[0].preload, 'auto');
  assert.equal(h.players[0].loadCalls, 1);
  h.buffer(0, 1); h.players[0].emit('loadeddata'); h.players[0].emit('canplaythrough');
  assert.equal(h.players[0].playCalls, 0, 'A single frame or estimated readiness must not replace the still');
  assert.equal(h.layers[0]['data-ready'], undefined);
  h.buffer();
  assert.equal(h.players[0].playCalls, 1);
  assert.equal(h.layers[0]['data-ready'], undefined, 'Wait for actual playback');
  h.players[0].emit('playing');
  assert.equal(h.layers[0]['data-ready'], true);
  h.button.emit('click'); assert(h.players[0].paused);
  await Promise.resolve(); await Promise.resolve();
  h.button.emit('click');
  assert.equal(h.players[0].playCalls, 2);
  h.players[0].currentTime = 3;
  await Promise.resolve(); await Promise.resolve();
  h.dark();
  assert.equal(h.players[0].paused, false, 'Keep outgoing animation moving while the new theme loads');
  h.poster('dark'); h.buffer(1);
  assert.equal(h.players[1].currentTime, 3, 'Theme videos remain synchronized');
  h.players[1].readyState = 2;
  h.players[1].emit('seeked');
  h.players[1].readyState = 3;
  h.players[1].emit('canplay');
  assert.equal(h.hero.dataset.renderTheme, 'light', 'Do not reveal a frozen incoming frame');
  h.players[1].emit('playing');
  assert.equal(h.hero.dataset.renderTheme, 'dark');
  assert.equal(h.players[1].paused, false, 'Resume after seeked precedes canplay');
  h.players[1].emit('playing'); h.players[1].emit('waiting');
  assert.equal(h.layers[1]['data-ready'], undefined, 'Buffer underrun returns to the poster');
  h.players[1].emit('playing'); h.players[1].emit('error');
  assert.equal(h.layers[1]['data-ready'], undefined, 'Failure retains the still');
  assert(h.button.hidden);
  for (const settings of [{ reduced: true }, { saveData: true }]) {
    const quiet = harness(settings); quiet.visible(); quiet.poster('light');
    assert.equal(quiet.players[0].loadCalls, 0);
    assert(quiet.button.hidden);
    quiet.dark(); assert.equal(quiet.hero.dataset.renderTheme, 'dark');
  }
  const blocked = harness({ rejectPlay: true }); blocked.visible(); blocked.poster('light'); blocked.buffer();
  await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
  assert.equal(blocked.layers[0]['data-ready'], undefined);
  assert.equal(blocked.button.textContent, 'Play animation');
  const race = harness({ deferPlay: true });
  race.visible(); race.poster('light'); race.buffer();
  race.players[0].currentTime = 3;
  race.dark(); race.poster('dark'); race.buffer(1);
  assert.equal(race.players[0].paused, false, 'Outgoing remains playing throughout incoming seeking');
  race.visible(false);
  race.dark(false);
  race.visible();
  race.players[0].requests[0].reject(Object.assign(new Error('Interrupted'), { name: 'AbortError' }));
  for (let i = 0; i < 6; i++) await Promise.resolve();
  assert.equal(race.players[0].playCalls, 2, 'Interrupted pending playback retries after toggling back');
  assert.equal(race.players[0].paused, false);
  const repeated = harness(); repeated.visible(); repeated.poster('light'); repeated.buffer();
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 4; j++) await Promise.resolve();
    const isDark = i % 2 === 0, index = isDark ? 1 : 0, theme = isDark ? 'dark' : 'light';
    repeated.players[1 - index].currentTime = i + 1;
    repeated.dark(isDark); repeated.poster(theme); repeated.buffer(index);
    repeated.players[index].readyState = 2;
    repeated.players[index].emit('seeked');
    repeated.players[index].readyState = 3;
    repeated.players[index].emit('canplay');
    repeated.players[index].emit('playing');
    assert.equal(repeated.hero.dataset.renderTheme, theme);
    assert.equal(repeated.players[index].paused, false, `Playback resumes on toggle ${i + 1}`);
  }
  const metadataOnly = harness(); metadataOnly.visible(); metadataOnly.poster('light'); metadataOnly.buffer();
  for (let i = 0; i < 4; i++) await Promise.resolve();
  metadataOnly.players[0].currentTime = 5;
  metadataOnly.dark(); metadataOnly.poster('dark');
  Object.assign(metadataOnly.players[1], { duration: 12, end: 12, readyState: 1, seeking: true });
  metadataOnly.players[1].emit('progress');
  assert.equal(metadataOnly.players[1].playCalls, 1, 'Start decoding even when seek drops readyState to HAVE_METADATA');
  assert.equal(metadataOnly.players[0].paused, false);
  assert.equal(metadataOnly.hero.dataset.renderTheme, 'light');
  metadataOnly.players[1].readyState = 4;
  metadataOnly.players[1].seeking = false;
  metadataOnly.players[1].emit('playing');
  assert.equal(metadataOnly.hero.dataset.renderTheme, 'dark');
  const markup = fs.readFileSync('blox/portrait-hero/block.html', 'utf8');
  assert(markup.includes('researcher-orbit-poster--light') && markup.includes('researcher-orbit-poster--dark'));
  assert(markup.includes('muted loop playsinline'));
  console.log('PASS: poster priority, full buffering, actual-play reveal, pause/resume, theme sync, seeked-before-canplay, repeated toggles, interrupted-play retry, buffering/error fallback, reduced motion, data saving and autoplay denial.');
  console.log('Simulated DOM tests only; no live browser verification.');
})().catch((error) => { console.error(error); process.exitCode = 1; });
