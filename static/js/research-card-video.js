(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-card-motion]').forEach((card) => {
    if (card.dataset.initialized) return;
    card.dataset.initialized = 'true';
    const video = card.querySelector('video');
    let visible = false;
    let failed = false;
    const update = () => {
      const active = visible && !document.hidden && !reduced.matches && !failed;
      if (active) {
        if (!video.getAttribute('src')) video.src = video.dataset.src;
        video.muted = true;
        video.play().catch(() => {
          // Keep the poster visible if the browser blocks autoplay.
          if (video.paused) card.removeAttribute('data-ready');
        });
      } else {
        video.pause();
        if (reduced.matches || failed) card.removeAttribute('data-ready');
      }
    };
    video.addEventListener('playing', () => card.setAttribute('data-ready', ''));
    video.addEventListener('error', () => { failed = true; update(); });
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }, { threshold: 0.1 }).observe(card);
    reduced.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    update();
  });
})();
