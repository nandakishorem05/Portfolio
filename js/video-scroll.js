// js/video-scroll.js
// Sticky scroll-driven video: the section is tall, the video sticks to the viewport
// and scrubs frame-by-frame as the user scrolls through the wrapper.
(() => {
  const wrapper = document.getElementById('video-scroll');
  const video   = document.getElementById('scroll-video');
  if (!wrapper || !video) return;

  let ready = false;

  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

  const sync = () => {
    if (!ready || !video.duration) return;
    const rect     = wrapper.getBoundingClientRect();
    const vh       = window.innerHeight;
    // progress 0 → 1 as wrapper scrolls fully through viewport
    const progress = clamp((vh - rect.top) / (rect.height + vh - vh), 0, 1);
    // better: use scroll position relative to wrapper
    const scrolled = clamp(-rect.top / (rect.height - vh), 0, 1);
    video.currentTime = scrolled * video.duration;
  };

  video.addEventListener('loadedmetadata', () => { ready = true; sync(); });
  if (video.readyState >= 1) { ready = true; }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(() => { sync(); ticking = false; }); ticking = true; }
  }, { passive: true });
})();
