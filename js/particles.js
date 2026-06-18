// js/particles.js – Floating geometric particle system for hero section
(() => {
  const hero = document.getElementById('hero');

  const colors = ['#E64833', '#90AEAD', '#FBE9D0', '#874F41'];
  const shapes = ['circle', 'triangle', 'square'];

  const createParticle = () => {
    const p = document.createElement('div');
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 6 + Math.random() * 10;
    const duration = 3 + Math.random() * 4;

    p.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      opacity: ${0.3 + Math.random() * 0.5};
      border-radius: ${shape === 'circle' ? '50%' : shape === 'square' ? '3px' : '0'};
      animation: drift ${duration}s linear forwards;
      pointer-events: none;
      z-index: 1;
      ${shape === 'triangle' ? `
        width: 0; height: 0;
        background: transparent;
        border-left: ${size/2}px solid transparent;
        border-right: ${size/2}px solid transparent;
        border-bottom: ${size}px solid ${color};
      ` : ''}
    `;

    hero.appendChild(p);
    setTimeout(() => p.remove(), duration * 1000);
  };

  setInterval(createParticle, 600);
})();
