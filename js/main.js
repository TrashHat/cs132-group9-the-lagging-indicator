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

  // Inject stats into any element with data-stat attribute
  document.querySelectorAll('[data-stat]').forEach(el => {
    const key = el.getAttribute('data-stat');
    if (STATS[key] !== undefined) el.textContent = STATS[key];
  });
});
