/* Keep theme videos separate so their synchronized frames can crossfade. */
(() => {
  const hero = document.getElementById('section-hero');
  const original = hero?.querySelector('.researcher-orbit-video');
  const button = hero?.querySelector('.researcher-orbit-toggle');
  if (!original || !button) return;
  const lightLayer = original.parentElement;
  const darkLayer = lightLayer.cloneNode(true);
  lightLayer.after(darkLayer);
  const darkVideo = darkLayer.querySelector('video');
  const players = {light: original, dark: darkVideo};
  const layers = {light: lightLayer, dark: darkLayer};
  for (const theme of ['light', 'dark']) {
    layers[theme].dataset.theme = theme;
    players[theme].poster = (theme === 'dark' && original.dataset.posterDark) || original.dataset.poster;
    players[theme].muted = true;
  }
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  let active = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  let desired = active, visible = false, userPaused = false, switching = false;
  let generation = 0, cleanupTimer;
  let seekGeneration = -1, fading = null;
  const failed = new Set();
  const pending = new Set();
  hero.dataset.renderTheme = active;
  const allowed = () => !motion.matches && !connection?.saveData;
  const canPlay = () => allowed() && visible && !document.hidden && !userPaused;
  const shouldPlay = (theme) => canPlay() && !failed.has(theme) &&
    (theme === active || theme === fading ||
      (switching && theme === desired && seekGeneration === generation));

  function buffered(theme) {
    const video = players[theme];
    // Require the whole loop in one contiguous range, rather than one decoded frame.
    return Number.isFinite(video.duration) && video.duration > 0 &&
      video.buffered.length > 0 && video.buffered.start(0) < 0.05 &&
      video.buffered.end(0) >= video.duration - 0.05;
  }

  function load(theme) {
    const video = players[theme];
    const poster = layers[theme].querySelector(`.researcher-orbit-poster--${theme}`);
    // Let the small preview finish before competing for bandwidth with the MP4.
    if (poster && !poster.complete) return;
    if (!video.getAttribute('src') && !failed.has(theme)) {
      video.preload = 'auto';
      video.src = (theme === 'dark' && original.dataset.srcDark) || original.dataset.src;
      video.load();
    }
  }
  function play(theme) {
    const video = players[theme];
    if (!shouldPlay(theme) || !buffered(theme) || pending.has(theme) || !video.paused) return;
    pending.add(theme);
    let aborted = false;
    video.play().catch(error => {
      if (error.name === 'NotAllowedError') userPaused = true;
      else if (error.name === 'AbortError') aborted = true;
      else failed.add(theme);
    }).finally(() => {
      pending.delete(theme);
      if (!shouldPlay(theme)) video.pause();
      // An interrupted play may finish after a rapid toggle back to this theme.
      if (aborted || !canPlay() || failed.has(theme)) updatePlayback();
    });
  }
  function updatePlayback() {
    button.hidden = !allowed() || failed.has(active) || !buffered(active);
    button.textContent = userPaused ? 'Play animation' : 'Pause animation';
    for (const theme of ['light', 'dark']) {
      if (!shouldPlay(theme)) players[theme].pause();
    }
    if (allowed() && visible && !document.hidden) load(desired);
    play(active);
    if (fading) play(fading);
    if (switching && seekGeneration === generation) play(desired);
  }
  function reveal(theme, ticket) {
    if (ticket !== generation || theme !== desired) return;
    const previous = active;
    active = theme;
    switching = false;
    seekGeneration = -1;
    fading = previous !== theme ? previous : null;
    // Paint the incoming decoded frame before starting the opacity transition.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (ticket !== generation) return;
      hero.dataset.renderTheme = theme;
      updatePlayback();
      clearTimeout(cleanupTimer);
      cleanupTimer = setTimeout(() => {
        if (ticket === generation && previous !== active) {
          fading = null;
          players[previous].pause();
        }
      }, 550);
    }));
  }
  function prepareSwitch() {
    const ticket = generation, target = desired, incoming = players[target];
    if (!switching) return;
    if (!allowed() || failed.has(target)) { reveal(target, ticket); return; }
    if (!buffered(target)) return;
    if (seekGeneration !== ticket) {
      seekGeneration = ticket;
      const time = players[active].currentTime % incoming.duration;
      if (Math.abs(incoming.currentTime - time) > 0.015) incoming.currentTime = time;
    }
    // play() drives decoding after a seek; waiting for canplay here can deadlock.
    // Keep the outgoing video moving and reveal only when incoming actually plays.
    if (canPlay()) play(target);
    else if (!incoming.seeking && incoming.readyState >= 2) {
      layers[target].setAttribute('data-ready', '');
      reveal(target, ticket);
    }
  }
  function sync() {
    const next = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    if (next !== desired) {
      generation++;
      clearTimeout(cleanupTimer);
      if (fading && fading !== active) players[fading].pause();
      fading = null;
      seekGeneration = -1;
      desired = next;
      switching = desired !== active;
      if (!switching) hero.dataset.renderTheme = active;
    }
    updatePlayback();
    prepareSwitch();
  }
  for (const theme of ['light', 'dark']) {
    const video = players[theme];
    for (const event of ['loadeddata', 'progress', 'canplay', 'canplaythrough', 'seeked']) video.addEventListener(event, sync);
    video.addEventListener('playing', () => {
      if (!shouldPlay(theme)) { video.pause(); return; }
      layers[theme].setAttribute('data-ready', '');
      if (switching && theme === desired && seekGeneration === generation) reveal(theme, generation);
    });
    video.addEventListener('waiting', () => { layers[theme].removeAttribute('data-ready'); });
    const poster = layers[theme].querySelector(`.researcher-orbit-poster--${theme}`);
    poster?.addEventListener('load', sync);
    poster?.addEventListener('error', sync);
    video.addEventListener('error', () => {
      failed.add(theme);
      layers[theme].removeAttribute('data-ready');
      sync();
    });
  }
  button.addEventListener('click', () => { userPaused = !userPaused; sync(); });
  new MutationObserver(sync).observe(document.documentElement, {attributes:true, attributeFilter:['class']});
  motion.addEventListener('change', sync);
  connection?.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {visible = entry.isIntersecting; sync();}).observe(hero);
  } else visible = true;
  sync();
})();
