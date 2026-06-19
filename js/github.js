// js/github.js – GitHub repo cards with staggered scroll-reveal animation
(() => {
  const grid      = document.getElementById('project-grid');
  const CACHE_KEY = 'gh_repos_nanda05';
  const CACHE_TTL = 60 * 60 * 1000; // 1 hour

  const langColors = {
    JavaScript:'#f1e05a', Python:'#3572A5', HTML:'#e34c26',
    CSS:'#563d7c', TypeScript:'#3178c6', Java:'#b07219',
    'C++':'#f34b7d', Shell:'#89e051', Vue:'#41b883',
    Jupyter:'#DA5B0B', Rust:'#dea584', Go:'#00ADD8'
  };
  const langColor = l => langColors[l] || '#874F41';

  const timeAgo = date => {
    const d = Math.floor((Date.now() - new Date(date)) / 86400000);
    if (d < 1)   return 'today';
    if (d < 7)   return `${d}d ago`;
    if (d < 30)  return `${Math.floor(d/7)}w ago`;
    if (d < 365) return `${Math.floor(d/30)}mo ago`;
    return `${Math.floor(d/365)}y ago`;
  };

  /* ── Render project cards ── */
  const render = repos => {
    const sorted = [...repos]
      .filter(r => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 12);

    grid.innerHTML = sorted.map((r, i) => {
      const color = langColor(r.language);
      const name  = r.name.replace(/-|_/g, ' ');
      return `
      <div class="proj-card proj-anim" data-index="${i}">
        <div class="proj-num">${String(i + 1).padStart(2, '0')}</div>
        <div class="proj-body">
          <div class="proj-header">
            <h3 class="proj-title">${name}</h3>
            <span class="lang-badge" style="background:${color}20;color:${color};border-color:${color}40">
              <span class="lang-dot" style="background:${color}"></span>
              ${r.language || 'Code'}
            </span>
          </div>
          <p class="proj-desc">${r.description || 'No description provided.'}</p>
          <div class="proj-meta">
            <span>★ ${r.stargazers_count}</span>
            <span>⎇ ${r.forks_count}</span>
            <span>${timeAgo(r.updated_at)}</span>
          </div>
          <div class="proj-links">
            <a href="${r.html_url}" target="_blank" rel="noopener" class="proj-btn proj-btn-outline">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              Code
            </a>
            ${r.homepage ? `<a href="${r.homepage}" target="_blank" rel="noopener" class="proj-btn proj-btn-fill">Live ↗</a>` : ''}
          </div>
        </div>
      </div>`;
    }).join('');

    /* ── Staggered scroll-reveal via IntersectionObserver ── */
    animateCards();

    /* ── GitHub stats ── */
    const langs = new Set(repos.map(r => r.language).filter(Boolean)).size;
    animCount('stat-repos', repos.length);
    animCount('stat-langs', langs);
  };

  /* Scroll-triggered card animation */
  const animateCards = () => {
    const cards = grid.querySelectorAll('.proj-anim');
    if (!cards.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const idx   = +entry.target.dataset.index;
        const col   = idx % 3;          // column position (0, 1, 2)
        const delay = col * 80;         // stagger by column
        setTimeout(() => {
          entry.target.classList.add('proj-anim--in');
        }, delay);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    cards.forEach(c => obs.observe(c));
  };

  const animCount = (id, target) => {
    const el = document.getElementById(id);
    if (!el) return;
    let n = 0;
    const step = Math.ceil(target / 40);
    const t = setInterval(() => {
      n = Math.min(n + step, target);
      el.textContent = n;
      if (n >= target) clearInterval(t);
    }, 30);
  };

  const showError = () => {
    grid.innerHTML = `
      <div class="proj-error">
        <p>Unable to load projects.</p>
        <a href="https://github.com/nandakishorem05" target="_blank" class="proj-btn proj-btn-fill" style="margin-top:1rem;display:inline-flex">View on GitHub ↗</a>
      </div>`;
  };

  const fetchRepos = async () => {
    const res = await fetch('https://api.github.com/users/nandakishorem05/repos?per_page=100&sort=updated');
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const data = await res.json();
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
    return data;
  };

  const load = async () => {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (cached && Date.now() - cached.ts < CACHE_TTL) {
        render(cached.data);
      } else {
        render(await fetchRepos());
      }
    } catch (e) {
      console.error(e);
      showError();
    }
  };

  load();
})();
