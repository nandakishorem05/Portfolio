// js/github.js – Fetch repos, render reference-style project cards + contribution stats
(() => {
  const grid       = document.getElementById('project-grid');
  const featGrid   = document.getElementById('feat-grid');
  const CACHE_KEY  = 'gh_repos_nanda05';
  const CACHE_TTL  = 60 * 60 * 1000; // 1 hour

  const langColors = {
    JavaScript:'#f1e05a', Python:'#3572A5', HTML:'#e34c26',
    CSS:'#563d7c', TypeScript:'#3178c6', Java:'#b07219',
    'C++':'#f34b7d', Shell:'#89e051', Vue:'#41b883',
    Jupyter:'#DA5B0B', Rust:'#dea584', Go:'#00ADD8'
  };
  const langColor = l => langColors[l] || '#874F41';

  /* ── Render FEATURED cards (reference-style horizontal) ── */
  const renderFeatured = repos => {
    if (!featGrid) return;
    const top3 = [...repos]
      .filter(r => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 3);

    featGrid.innerHTML = top3.map((r, i) => {
      const isEven = i % 2 === 1;
      const color  = langColor(r.language);
      const name   = r.name.replace(/-|_/g, ' ');
      const desc   = r.description || 'A project built with passion and precision.';
      const num    = String(i + 1).padStart(2, '0');

      return `
      <div class="fp-card fp-card--${isEven ? 'reverse' : 'normal'} fp-reveal" data-index="${i}">
        <div class="fp-separator"></div>
        <div class="fp-inner">
          <!-- Text side -->
          <div class="fp-text">
            <div class="fp-num">${num}</div>
            <h3 class="fp-title">${name}</h3>
            <p class="fp-desc">${desc}</p>
            <div class="fp-tags">
              <span class="fp-tag" style="background:${color}18;color:${color};border-color:${color}40">
                <span style="width:8px;height:8px;border-radius:50%;background:${color};display:inline-block"></span>
                ${r.language || 'Code'}
              </span>
              <span class="fp-tag fp-tag-neutral">★ ${r.stargazers_count}</span>
              <span class="fp-tag fp-tag-neutral">⎇ ${r.forks_count}</span>
              <span class="fp-tag fp-tag-neutral">${timeAgo(r.updated_at)}</span>
            </div>
            <div class="fp-actions">
              <a href="${r.html_url}" target="_blank" rel="noopener" class="fp-btn fp-btn-ghost">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                Source Code
              </a>
              ${r.homepage ? `
              <a href="${r.homepage}" target="_blank" rel="noopener" class="fp-btn fp-btn-fill">
                Live Demo
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>` : ''}
            </div>
          </div>
          <!-- Preview side -->
          <div class="fp-preview" style="--fp-color:${color}">
            <div class="fp-preview-inner">
              <div class="fp-code-bar">
                <span class="fp-dot" style="background:#ff5f57"></span>
                <span class="fp-dot" style="background:#febc2e"></span>
                <span class="fp-dot" style="background:#28c840"></span>
                <span class="fp-code-title">${r.name}.${r.language === 'Python' ? 'py' : r.language === 'HTML' ? 'html' : 'js'}</span>
              </div>
              <div class="fp-code-body">
                <div class="fp-code-line"><span class="fp-kw">const</span> <span class="fp-var">${r.name.replace(/[^a-zA-Z]/g,'')}</span> = {</div>
                <div class="fp-code-line fp-indent"><span class="fp-kw">name:</span> <span class="fp-str">'${name}'</span>,</div>
                <div class="fp-code-line fp-indent"><span class="fp-kw">stars:</span> <span class="fp-num-lit">${r.stargazers_count}</span>,</div>
                <div class="fp-code-line fp-indent"><span class="fp-kw">lang:</span> <span class="fp-str">'${r.language || 'code'}'</span>,</div>
                <div class="fp-code-line fp-indent"><span class="fp-kw">status:</span> <span class="fp-str">'active'</span></div>
                <div class="fp-code-line">}</div>
                <div class="fp-code-line" style="margin-top:0.75rem"><span class="fp-comment">// Built with ${r.language || 'code'}</span></div>
              </div>
              <div class="fp-watermark">${num}</div>
            </div>
          </div>
        </div>
      </div>`;
    }).join('');

    // Animation: JS adds fp-visible to card; CSS handles all children
    const setupAnimations = () => {
      const cards = featGrid.querySelectorAll('.fp-card');
      if (!cards.length) return;

      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          // Stagger between cards via a small JS delay
          const delay = (+entry.target.dataset.index || 0) * 100;
          setTimeout(() => entry.target.classList.add('fp-visible'), delay);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      cards.forEach(c => obs.observe(c));
    };

    setTimeout(setupAnimations, 100);
  };

  /* ── Render project cards (reference-style) ── */
  const render = repos => {
    const sorted = [...repos]
      .filter(r => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at));
    const top = sorted.slice(0, 9);
    renderFeatured(repos);

    grid.innerHTML = top.map((r, i) => `
      <div class="proj-card reveal-up" style="animation-delay:${(i % 3) * 0.1}s">
        <div class="proj-num">${String(i + 1).padStart(2, '0')}</div>
        <div class="proj-body">
          <div class="proj-header">
            <h3 class="proj-title">${r.name.replace(/-|_/g, ' ')}</h3>
            <span class="lang-badge" style="background:${langColor(r.language)}20;color:${langColor(r.language)};border-color:${langColor(r.language)}40">
              <span class="lang-dot" style="background:${langColor(r.language)}"></span>
              ${r.language || 'Code'}
            </span>
          </div>
          <p class="proj-desc">${r.description || 'No description provided.'}</p>
          <div class="proj-meta">
            <span>★ ${r.stargazers_count}</span>
            <span>⎇ ${r.forks_count}</span>
            <span>Updated ${timeAgo(r.updated_at)}</span>
          </div>
          <div class="proj-links">
            <a href="${r.html_url}" target="_blank" rel="noopener" class="proj-btn proj-btn-outline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              View Code
            </a>
            ${r.homepage ? `<a href="${r.homepage}" target="_blank" rel="noopener" class="proj-btn proj-btn-fill">Live Demo ↗</a>` : ''}
          </div>
        </div>
      </div>`).join('');

    // trigger scroll reveal for freshly rendered cards
    requestAnimationFrame(() => {
      document.querySelectorAll('.proj-card.reveal-up').forEach(el => {
        el.classList.add('visible');
      });
    });

    populateStats(repos);
  };

  /* ── Populate stats sidebar ── */
  const populateStats = repos => {
    const langs = new Set(repos.map(r => r.language).filter(Boolean)).size;
    animCount('stat-repos', repos.length);
    animCount('stat-langs', langs);
  };

  const animCount = (id, target) => {
    const el = document.getElementById(id);
    if (!el) return;
    let start = 0;
    const step = Math.ceil(target / 40);
    const t = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = start;
      if (start >= target) clearInterval(t);
    }, 30);
  };

  const timeAgo = date => {
    const diff = Date.now() - new Date(date);
    const d = Math.floor(diff / 86400000);
    if (d < 1)  return 'today';
    if (d < 7)  return `${d}d ago`;
    if (d < 30) return `${Math.floor(d/7)}w ago`;
    if (d < 365)return `${Math.floor(d/30)}mo ago`;
    return `${Math.floor(d/365)}y ago`;
  };

  const showError = () => {
    grid.innerHTML = `
      <div class="proj-error">
        <p>Unable to load projects right now.</p>
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
