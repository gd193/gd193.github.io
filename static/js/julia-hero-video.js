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
  const failed = new Set();
  const pending = new Set();
  hero.dataset.renderTheme = active;
  const allowed = () => !motion.matches && !connection?.saveData;
  const canPlay = () => allowed() && visible && !document.hidden && !userPaused;

  function load(theme) {
    const video = players[theme];
    if (!video.getAttribute('src') && !failed.has(theme)) {
      video.src = (theme === 'dark' && original.dataset.srcDark) || original.dataset.src;
      video.load();
    }
  }
  function play(theme) {
    const video = players[theme];
    if (!canPlay() || failed.has(theme) || pending.has(theme) || !video.paused) return;
    pending.add(theme);
    video.play().catch(error => {
      if (error.name === 'NotAllowedError') userPaused = true;
      else if (error.name !== 'AbortError') failed.add(theme);
    }).finally(() => {
      pending.delete(theme);
      if (!canPlay() || switching || failed.has(theme)) { video.pause(); updatePlayback(); }
    });
  }
  function updatePlayback() {
    button.hidden = !allowed() || failed.has(active);
    button.textContent = userPaused ? 'Play animation' : 'Pause animation';
    for (const theme of ['light', 'dark']) {
      if (theme !== active || switching || !canPlay()) players[theme].pause();
    }
    if (allowed() && visible && !document.hidden) load(desired);
    if (!switching) play(active);
  }
  function reveal(theme, ticket) {
    if (ticket !== generation || theme !== desired) return;
    const previous = active;
    active = theme;
    switching = false;
    // Paint the incoming decoded frame before starting the opacity transition.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (ticket !== generation) return;
      hero.dataset.renderTheme = theme;
      updatePlayback();
      if (canPlay() && previous !== theme) play(previous);
      clearTimeout(cleanupTimer);
      cleanupTimer = setTimeout(() => {
        if (ticket === generation && previous !== active) players[previous].pause();
      }, 550);
    }));
  }
  function prepareSwitch() {
    const ticket = generation, target = desired, incoming = players[target];
    if (!switching) return;
    if (!allowed() || failed.has(target)) { reveal(target, ticket); return; }
    if (incoming.readyState < 2 || !Number.isFinite(incoming.duration)) return;
    const time = players[active].currentTime % incoming.duration;
    if (Math.abs(incoming.currentTime - time) > 0.015) {
      incoming.addEventListener('seeked', () => reveal(target, ticket), {once:true});
      incoming.currentTime = time;
    } else if (!incoming.seeking) reveal(target, ticket);
  }
  function sync() {
    const next = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    if (next !== desired) {
      generation++;
      clearTimeout(cleanupTimer);
      desired = next;
      switching = desired !== active;
      if (!switching) hero.dataset.renderTheme = active;
      for (const video of Object.values(players)) video.pause();
    }
    updatePlayback();
    prepareSwitch();
  }
  for (const theme of ['light', 'dark']) {
    const video = players[theme];
    video.addEventListener('loadeddata', () => {
      layers[theme].setAttribute('data-ready', '');
      prepareSwitch();
    });
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
