(function () {
  const COLORS = {
    PSFI: '#2962ff', PSHO: '#26a69a', PSIN: '#f0b90b',
    PSPR: '#ef5350', PSSE: '#ab47bc', PSMO: '#ff9800',
  };

  const page = window.location.pathname.split('/').pop() || 'index.html';

  function loadChartJs(cb) {
    if (window.Chart) { cb(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  fetch('js/chart-data.json')
    .then(r => r.json())
    .then(data => {
      if (page === 'research.html') {
        loadChartJs(() => initResearch(data));
      } else {
        init(data);
      }
    })
    .catch(err => console.warn('[charts] chart-data.json not loaded:', err));

  function init(data) {
    if (page === 'data.html') initData(data);
  }

  // ── Research page ─────────────────────────────────────────────────────────

  function initResearch(data) {
    buildResearchPreview(data.sample_rows);

    const ctx = document.getElementById('crashChart');
    if (!ctx) return;

    Chart.defaults.color       = '#a8b4c4';
    Chart.defaults.borderColor = '#1c2030';

    const sorted = [...data.crash_metrics].sort((a, b) => a.drawdown - b.drawdown);

    const crashChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sorted.map(d => d.name),
        datasets: [{
          data:            sorted.map(d => d.drawdown),
          backgroundColor: sorted.map(d => COLORS[d.sector] + 'cc'),
          borderWidth: 0,
          borderRadius: 2,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 100,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: c => ` Drawdown: ${c.parsed.x.toFixed(1)}%`,
            },
          },
        },
        scales: {
          x: {
            max:    0,
            grid:   { color: '#1c2030' },
            ticks:  { color: '#a8b4c4', callback: v => v + '%' },
            border: { color: '#1c2030' },
          },
          y: {
            grid:   { display: false },
            ticks:  { color: '#a8b4c4' },
            border: { color: '#1c2030' },
          },
        },
      },
    });

    window.addEventListener('resize', () => crashChart.resize());
  }

  function buildResearchPreview(rows) {
    const tbody = document.getElementById('researchSampleTbody');
    if (!tbody) return;
    // one row per sector (first occurrence of each)
    const seen = new Set();
    rows.filter(r => { if (seen.has(r.sector)) return false; seen.add(r.sector); return true; })
        .forEach(r => {
          tbody.insertAdjacentHTML('beforeend', `
            <tr>
              <td style="font-family:'Roboto Mono',monospace;">${r.date}</td>
              <td>${dot(COLORS[r.sector])}<span class="ticker">${r.sector}</span></td>
              <td>${r.name}</td>
              <td style="font-family:'Roboto Mono',monospace;">${r.price.toLocaleString()}</td>
            </tr>`);
        });
  }

  // ── Data page ─────────────────────────────────────────────────────────────

  function initData(data) {
    buildSummaryTable(data.summary);
    buildSampleTable(data.sample_rows);
  }

  function dot(color) {
    return `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;`
         + `background:${color};margin-right:6px;vertical-align:middle;"></span>`;
  }

  function buildSummaryTable(summary) {
    const tbody = document.getElementById('summaryTbody');
    if (!tbody) return;
    ['PSFI', 'PSHO', 'PSIN', 'PSPR', 'PSSE', 'PSMO'].forEach(code => {
      const s     = summary[code];
      const ret   = s.total_return_pct;
      const color = ret >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
      const sign  = ret >= 0 ? '+' : '';
      tbody.insertAdjacentHTML('beforeend', `
        <tr>
          <td>${dot(COLORS[code])}<span class="ticker">${code}</span></td>
          <td>${s.name}</td>
          <td style="font-family:'Roboto Mono',monospace;">${s.start.toLocaleString()}</td>
          <td style="font-family:'Roboto Mono',monospace;">${s.end.toLocaleString()}</td>
          <td style="font-family:'Roboto Mono',monospace;">${s.min.toLocaleString()}</td>
          <td style="font-family:'Roboto Mono',monospace;">${s.max.toLocaleString()}</td>
          <td style="font-family:'Roboto Mono',monospace;color:${color};">${sign}${ret.toFixed(2)}%</td>
        </tr>`);
    });
  }

  function buildSampleTable(rows) {
    const tbody = document.getElementById('sampleTbody');
    if (!tbody) return;
    rows.forEach(r => {
      tbody.insertAdjacentHTML('beforeend', `
        <tr>
          <td style="font-family:'Roboto Mono',monospace;">${r.date}</td>
          <td>${dot(COLORS[r.sector])}<span class="ticker">${r.sector}</span></td>
          <td>${r.name}</td>
          <td style="font-family:'Roboto Mono',monospace;">${r.price.toLocaleString()}</td>
        </tr>`);
    });
  }

})();
