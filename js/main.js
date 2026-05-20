const STATS = {
  totalRows:      '10,728',
  rowsPerSector:  '1,788',
  sectors:        '6',
  dateRange:      'Jan 2019 – Apr 2026',
};

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
});
