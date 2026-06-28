// js/typing.js – Rotating typewriter effect for hero subtitle
(() => {
  const roles = [
    'Founder of GrabU',
    'Full-Stack MERN Developer',
    'AI-Powered Developer',
    'Web & Web App Developer',
    'Data Scientist'
  ];
  const subtitle = document.getElementById('typed-text');
  let idx = 0;
  let typeTimer = null;

  const type = text => {
    subtitle.textContent = '';
    let i = 0;
    if (typeTimer) clearInterval(typeTimer);
    typeTimer = setInterval(() => {
      subtitle.textContent += text[i];
      i++;
      if (i === text.length) clearInterval(typeTimer);
    }, 80);
  };

  const next = () => {
    type(roles[idx]);
    idx = (idx + 1) % roles.length;
  };

  next();
  setInterval(next, 4000);
})();
