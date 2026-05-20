const STATS = {
  totalRows:      '10,728',
  rowsPerSector:  '1,788',
  sectors:        '6',
  dateRange:      'Jan 2019 – Apr 2026',
};

function animateCounter(el, target, duration) {
  const raw = target.replace(/,/g, '');
  if (!/^\d+$/.test(raw)) return;
  const end = parseInt(raw, 10);
  const origin = performance.now();
  (function tick(now) {
    const p = Math.min((now - origin) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(end * eased).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  })(performance.now());
}

document.addEventListener('DOMContentLoaded', () => {
  // Active nav
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === page) link.classList.add('active');
  });

  // Inject stats
  document.querySelectorAll('[data-stat]').forEach(el => {
    const key = el.getAttribute('data-stat');
    if (STATS[key] !== undefined) el.textContent = STATS[key];
  });

  // Viz tab switching
  document.querySelectorAll('.viz-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = tab.dataset.tab;
      document.querySelectorAll('.viz-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.viz-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.querySelector(`.viz-panel[data-panel="${idx}"]`);
      if (panel) panel.classList.add('active');
    });
  });

  // Animated stat counters — fires once when stats row enters viewport
  const statsRow = document.querySelector('.home-stats');
  if (statsRow) {
    const counters = Array.from(statsRow.querySelectorAll('.home-stat-num'));
    const targets = counters.map(el => el.textContent.trim());
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        counters.forEach((el, i) => animateCounter(el, targets[i], 1400));
        observer.disconnect();
      }
    }, { threshold: 0.6 });
    observer.observe(statsRow);
  }
});
