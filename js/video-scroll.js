// js/video-scroll.js
// Sticky scroll-driven video: scrubs through the video as user scrolls.
(() => {
  const wrapper = document.getElementById('video-scroll');
  const video   = document.getElementById('scroll-video');
  if (!wrapper || !video) return;

  let ready = false;
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

  const sync = () => {
    if (!ready || !video.duration) return;
    const rect = wrapper.getBoundingClientRect();
    const scrolled = clamp(-rect.top / (rect.height - window.innerHeight), 0, 1);
    video.currentTime = scrolled * video.duration;
  };

  video.addEventListener('loadedmetadata', () => { ready = true; sync(); });
  if (video.readyState >= 1) { ready = true; }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(sync);
  }, { passive: true });
})();
