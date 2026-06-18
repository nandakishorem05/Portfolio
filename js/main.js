// js/main.js – Core site behavior: scroll reveals, nav, mobile menu
(() => {
  /* ─── Navbar: shrink on scroll + active link highlighting ─── */
  const navbar = document.getElementById('navbar');

  const updateNav = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ─── Active nav link tracking ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

  /* ─── Smooth scroll for all internal links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        // Close mobile menu if open
        document.getElementById('nav-links').classList.remove('open');
        document.getElementById('hamburger').classList.remove('open');
      }
    });
  });

  /* ─── Mobile hamburger menu ─── */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });

  /* ─── Scroll reveal: fade in on enter viewport ─── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // trigger once
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ─── Canvas particles (hero) ─── */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const colors = ['#E64833', '#90AEAD', '#FBE9D0', '#874F41'];
    let particles = [];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const rand = (min, max) => Math.random() * (max - min) + min;

    const spawn = () => {
      particles.push({
        x: rand(0, canvas.width),
        y: rand(0, canvas.height),
        r: rand(2, 6),
        vx: rand(-0.4, 0.4),
        vy: rand(-0.8, -0.2),
        alpha: rand(0.3, 0.7),
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.alpha > 0.01);
      particles.forEach(p => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.003;
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    };

    setInterval(spawn, 200);
    draw();
  }
})();
