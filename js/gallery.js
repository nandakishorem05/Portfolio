// js/gallery.js – Touch-enabled photo carousel for About section
(() => {
  const images = [
    'assets/Nandu 2.png',
    'assets/Nandu coding.png',
    'assets/photo1.jpeg',
    'assets/photo2.jpeg',
    'assets/photo3.jpeg',
    'assets/photo4.jpeg'
  ];
  const container = document.getElementById('gallery');
  let idx = 0;
  let touchStartX = 0;
  let autoTimer = null;

  const render = () => {
    container.innerHTML = `
      <div class="gallery-wrapper" id="gallery-wrapper">
        <img src="${images[idx]}" alt="Photo ${idx + 1}" class="gallery-image" />
        <button class="gallery-btn prev-btn" id="gallery-prev" aria-label="Previous">&#8249;</button>
        <button class="gallery-btn next-btn" id="gallery-next" aria-label="Next">&#8250;</button>
        <div class="gallery-dots">
          ${images.map((_, i) => `<span class="dot ${i === idx ? 'active' : ''}" data-i="${i}"></span>`).join('')}
        </div>
      </div>`;

    document.getElementById('gallery-prev').addEventListener('click', () => change(-1));
    document.getElementById('gallery-next').addEventListener('click', () => change(1));
    container.querySelectorAll('.dot').forEach(dot => {
      dot.addEventListener('click', () => go(+dot.dataset.i));
    });

    // Touch swipe support
    const wrapper = document.getElementById('gallery-wrapper');
    wrapper.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    wrapper.addEventListener('touchend', e => {
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 40) change(delta < 0 ? 1 : -1);
    }, { passive: true });

    // Pause auto-play on hover
    wrapper.addEventListener('mouseenter', () => clearInterval(autoTimer));
    wrapper.addEventListener('mouseleave', startAuto);
  };

  const go = i => {
    idx = (i + images.length) % images.length;
    render();
  };

  const change = delta => go(idx + delta);

  const startAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => change(1), 3000);
  };

  render();
  startAuto();
})();
