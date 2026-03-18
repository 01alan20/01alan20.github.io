const state = {
  allRows: [],
  filteredRows: [],
  currentState: '',
  currentControl: '',
  selectedInstitutions: []
};

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const fmt = (v, d = 2) =>
  v === null || v === undefined
    ? '-'
    : Number(v).toLocaleString(undefined, { maximumFractionDigits: d });

const pct = (v, d = 1) =>
  v === null || v === undefined ? '-' : `${(v * 100).toFixed(d)}%`;

const money = (v) =>
  v === null || v === undefined ? '-' : `$${Math.round(v).toLocaleString()}`;

const mean = (arr) => {
  const valid = arr.filter((v) => v !== null && Number.isFinite(v));
  return valid.length ? valid.reduce((a, b) => a + b) / valid.length : null;
};

const median = (arr) => {
  const valid = arr.filter((v) => v !== null && Number.isFinite(v)).sort((a, b) => a - b);
  if (!valid.length) return null;
  const mid = Math.floor(valid.length / 2);
  return valid.length % 2 !== 0 ? valid[mid] : (valid[mid - 1] + valid[mid]) / 2;
};

const values = (rows, field) => rows.map((r) => num(r[field])).filter((v) => v !== null);

function baseLayout() {
  return {
    font: { family: 'sans-serif', size: 12, color: '#4b5563' },
    plot_bgcolor: '#fafafa',
    paper_bgcolor: 'white',
    margin: { l: 60, r: 20, t: 20, b: 50 },
    hovermode: 'closest',
    showlegend: true,
    legend: { x: 0.01, y: 0.99 }
  };
}

function plot(divId, data, layout) {
  const fullLayout = { ...baseLayout(), ...layout };
  Plotly.newPlot(divId, data, fullLayout, { responsive: true });
}

function updateKPIs() {
  const rows = state.allRows;
  const positiveRevenue = rows.filter(r => num(r.optimal_revenue_change_pct) > 0);
  
  document.getElementById('kpi-institutions').textContent = fmt(rows.length, 0);
  document.getElementById('kpi-avg-discount').textContent = pct(mean(values(rows, 'optimal_discount_pct_revenue')) / 100, 0);
  document.getElementById('kpi-avg-revenue').textContent = pct(mean(values(rows, 'optimal_revenue_change_pct')), 1);
  document.getElementById('kpi-avg-enrollment').textContent = fmt(mean(values(rows, 'optimal_incremental_enrollment_revenue')), 0);
}

function renderSummary() {
  const rows = state.allRows;
  
  // Left: Distribution of REVENUE-optimal discounts
  const discountsRevenue = values(rows, 'optimal_discount_pct_revenue');
  plot('chart-optimal-discount', [
    {
      x: discountsRevenue,
      type: 'histogram',
      nbinsx: 20,
      marker: { color: '#3b82f6', opacity: 0.8 },
      name: 'Revenue Optimal'
    }
  ], {
    title: { text: 'Revenue-Optimal Scholarship Discount Distribution', font: { size: 14, color: '#1f2937' } },
    xaxis: { title: 'Discount %' },
    yaxis: { title: 'Number of Institutions' }
  });
  
  // Right: Revenue Gain/Loss breakdown
  const positiveRevenue = rows.filter(r => num(r.optimal_revenue_change_pct) > 0);
  const negativeRevenue = rows.filter(r => num(r.optimal_revenue_change_pct) < 0);
  const breakeven = rows.filter(r => Math.abs(num(r.optimal_revenue_change_pct)) <= 0.001);
  
  plot('chart-revenue-lift', [
    {
      labels: ['Revenue Gains\n(Scholarships Help)', 'Revenue Losses\n(Scholarships Hurt)', 'Breakeven'],
      values: [positiveRevenue.length, negativeRevenue.length, breakeven.length],
      type: 'pie',
      marker: { colors: ['#10b981', '#ef4444', '#f59e0b'] },
      hovertemplate: '<b>%{label}</b><br>Count: %{value} institutions<br>%{percent}<extra></extra>'
    }
  ], {
    title: { text: 'Institutions by Revenue Impact of Optimal Scholarship Strategy', font: { size: 14, color: '#1f2937' } },
    height: 450
  });
}


function renderRevenueCurves() {
  // Load full revenue curve data to show complete curves
  Papa.parse('data/scholarship_revenue_curve.csv', {
    header: true,
    skipEmptyLines: true,
    download: true,
    complete: (results) => {
      const curves = results.data;
      const top6Institutions = state.allRows
        .sort((a, b) => num(b.optimal_net_revenue) - num(a.optimal_net_revenue))
        .slice(0, 6)
        .map(r => r.unit_id);
      
      const institutionTraces = top6Institutions.map(unitId => {
        const institutionData = curves.filter(r => num(r.unit_id) === unitId);
        const instName = institutionData.length > 0 ? institutionData[0].institution_name : '';
        
        return {
          x: institutionData.map(r => num(r.scholarship_discount_pct)),
          y: institutionData.map(r => num(r.projected_net_revenue)),
          mode: 'lines+markers',
          name: instName.substring(0, 20),
          hovertemplate: '<b>' + instName + '</b><br>Discount: %{x:.0f}%<br>Net Revenue: $%{y:,.0f}<extra></extra>'
        };
      });
      
      plot('chart-revenue-curves', institutionTraces, {
        title: { text: 'Revenue Curves Across Scholarship Discount Levels (Top 6 Institutions)', font: { size: 14, color: '#1f2937' } },
        xaxis: { title: 'Scholarship Discount %' },
        yaxis: { title: 'Projected Net Revenue ($)' },
        height: 500
      });
    }
  });
}

function renderYieldResponse() {
  const rows = state.allRows;
  
  // Left: Revenue-Optimal vs Enrollment-Optimal discount comparison
  const validRows = rows.filter((r) => num(r.optimal_discount_pct_revenue) !== null && num(r.optimal_discount_pct_enrollment) !== null);
  
  const colors = validRows.map(r => {
    const revDisc = num(r.optimal_discount_pct_revenue);
    const enrollDisc = num(r.optimal_discount_pct_enrollment);
    if (revDisc === enrollDisc) return '#9ca3af'; // Same = gray
    return revDisc < enrollDisc ? '#3b82f6' : '#10b981'; // Blue if enroll higher, green if revenue higher
  });
  
  plot('chart-discount-vs-yield', [
    {
      x: validRows.map((r) => num(r.optimal_discount_pct_revenue)),
      y: validRows.map((r) => num(r.optimal_discount_pct_enrollment)),
      mode: 'markers',
      marker: { size: 8, color: colors, opacity: 0.6, line: { width: 1, color: '#4b5563' } },
      text: validRows.map((r) => `<b>${r.institution_name}</b><br>Revenue-Opt: ${num(r.optimal_discount_pct_revenue).toFixed(0)}%<br>Enrollment-Opt: ${num(r.optimal_discount_pct_enrollment).toFixed(0)}%`),
      hovertemplate: '%{text}<extra></extra>',
      name: 'Institution'
    },
    {
      x: [0, 100],
      y: [0, 100],
      mode: 'lines',
      line: { color: '#d1d5db', dash: 'dash', width: 2 },
      hoverinfo: 'none',
      showlegend: false
    }
  ], {
    title: { text: 'Revenue vs Enrollment Optimization: Finding Your Strategy', font: { size: 14, color: '#1f2937' } },
    xaxis: { title: 'Revenue-Optimal Discount %', range: [-5, 105] },
    yaxis: { title: 'Enrollment-Optimal Discount %', range: [-5, 105] },
    annotations: [
      {
        x: 50, y: 50, xref: 'x domain', yref: 'y domain',
        text: 'Equal',
        showarrow: false,
        opacity: 0.3,
        font: { size: 12, color: '#9ca3af' }
      }
    ]
  });
  
  // Right: Discount strategy categorization
  const strategies = {};
  validRows.forEach(r => {
    const strat = r.discount_strategy || 'Unknown';
    if (!strategies[strat]) strategies[strat] = 0;
    strategies[strat]++;
  });
  
  plot('chart-discount-vs-enrollment', [
    {
      x: Object.keys(strategies),
      y: Object.values(strategies),
      type: 'bar',
      marker: { 
        color: ['#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'],
        opacity: 0.8
      },
      text: Object.values(strategies),
      textposition: 'auto',
      hovertemplate: '<b>%{x}</b><br>Institutions: %{y}<extra></extra>'
    }
  ], {
    title: { text: 'Distribution by Scholarship Strategy', font: { size: 14, color: '#1f2937' } },
    yaxis: { title: 'Number of Institutions' },
    xaxis: { tickangle: -45 }
  });
}
      name: 'Institution'
    }
  ], {
    title: { text: 'Optimal Discount vs Projected Enrollment', font: { size: 14, color: '#1f2937' } },
    xaxis: { title: 'Scholarship Discount %' },
    yaxis: { title: 'Projected Enrollment' }
  });
}

function renderBands() {
  const rows = state.allRows;
  
  // Count by discount band (using revenue-optimal)
  const bands = [
    { range: 'No Discount (0%)', min: 0, max: 0, count: 0 },
    { range: 'Light (1-10%)', min: 1, max: 10, count: 0 },
    { range: 'Moderate (11-20%)', min: 11, max: 20, count: 0 },
    { range: 'Aggressive (21-30%)', min: 21, max: 30, count: 0 },
    { range: 'Deep (31%+)', min: 31, max: 100, count: 0 }
  ];
  
  rows.forEach((r) => {
    const disc = num(r.optimal_discount_pct_revenue) || 0;
    bands.forEach((b) => {
      if (disc >= b.min && disc <= b.max) b.count++;
    });
  });
  
  // Left chart: Distribution by discount strategy band
  plot('chart-discount-distribution', [
    {
      x: bands.map((b) => b.range),
      y: bands.map((b) => b.count),
      type: 'bar',
      marker: { color: ['#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'], opacity: 0.8 },
      text: bands.map((b) => b.count),
      textposition: 'auto',
      hovertemplate: '<b>%{x}</b><br>Institutions: %{y}<extra></extra>'
    }
  ], {
    title: { text: 'Institutions by Revenue-Optimal Discount Strategy', font: { size: 14, color: '#1f2937' } },
    yaxis: { title: 'Number of Institutions' },
    height: 450
  });
  
  // Right chart: Outcomes by control type
  const controlTypes = {};
  rows.forEach(r => {
    const control = r.control_label || 'Unknown';
    if (!controlTypes[control]) {
      controlTypes[control] = { revenue: [], enrollment: [], count: 0 };
    }
    controlTypes[control].revenue.push(num(r.optimal_revenue_change_pct) * 100);
    controlTypes[control].enrollment.push(num(r.optimal_incremental_enrollment));
    controlTypes[control].count++;
  });
  
  const controlData = [
    {
      x: Object.keys(controlTypes),
      y: Object.keys(controlTypes).map(k => mean(controlTypes[k].revenue)),
      name: 'Avg Revenue Gain %',
      type: 'bar',
      marker: { color: '#3b82f6', opacity: 0.8 }
    }
  ];
  
  plot('chart-band-outcomes', controlData, {
    title: { text: 'Average Scholarship Revenue Impact by Institution Type', font: { size: 14, color: '#1f2937' } },
    yaxis: { title: 'Average Revenue Change %' },
    height: 450,
    hovermode: 'x unified'
  });
}
      y: bandOutcomes.map((b) => b.revenue),
      type: 'bar',
      marker: { color: '#16a34a' },
      name: 'Avg Revenue %',
      yaxis: 'y'
    },
    {
      x: bandOutcomes.map((b) => b.band),
      y: bandOutcomes.map((b) => b.enrollment),
      type: 'bar',
      marker: { color: '#6ee7b7' },
      name: 'Avg Enrollment Gain',
      yaxis: 'y2'
    }
  ], {
    title: { text: 'Average Outcomes by Discount Band', font: { size: 14, color: '#1f2937' } },
    yaxis: { title: 'Revenue Change %' },
    yaxis2: { title: 'Enrollment Gain', overlaying: 'y', side: 'right' },
    barmode: 'group'
  });
}

function renderDrilldown() {
  const rows = state.filteredRows.length > 0 ? state.filteredRows : state.allRows;
  const sorted = rows.sort((a, b) => num(b.optimal_net_revenue) - num(a.optimal_net_revenue)).slice(0, 15);
  
  plot('chart-top-institutions', [
    {
      y: sorted.map((r) => r.institution_name),
      x: sorted.map((r) => num(r.optimal_net_revenue)),
      type: 'bar',
      orientation: 'h',
      marker: { color: '#16a34a' },
      text: sorted.map((r) => `${fmt(num(r.optimal_discount_pct), 0)}% discount`),
      textposition: 'inside',
      textfont: { color: 'white', size: 11 },
      hovertemplate: '<b>%{y}</b><br>Net Revenue: $%{x:,.0f}<br>Optimal Discount: %{text}<extra></extra>'
    }
  ], {
    title: { text: 'Top 15 Institutions by Optimized Net Revenue', font: { size: 14, color: '#1f2937' } },
    xaxis: { title: 'Net Revenue ($)' },
    margin: { l: 280 }
  });
}

function applyFilters() {
  const state_val = document.getElementById('state-select').value;
  const control_val = document.getElementById('control-select').value;
  
  state.filteredRows = state.allRows.filter((r) => {
    const matchState = !state_val || r.state === state_val;
    const matchControl = !control_val || r.control_label === control_val;
    return matchState && matchControl;
  });
  
  renderDrilldown();
}

function populateFilters() {
  const states = [...new Set(state.allRows.map((r) => r.state))].filter((s) => s).sort();
  const stateSelect = document.getElementById('state-select');
  
  states.forEach((s) => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    stateSelect.appendChild(opt);
  });
  
  document.getElementById('state-select').addEventListener('change', applyFilters);
  document.getElementById('control-select').addEventListener('change', applyFilters);
}

function wireTabs() {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach((p) => p.classList.remove('active'));
      
      btn.classList.add('active');
      document.querySelector(`.tab-pane[data-tab="${tabName}"]`).classList.add('active');
    });
  });
}

async function init() {
  try {
    if (!window.Plotly) throw new Error('Plotly did not load.');
    if (!window.Papa) throw new Error('PapaParse did not load.');
    
    const res = await fetch('./data/scholarship_optimal_discount_summary.csv');
    if (!res.ok) throw new Error('Could not fetch scholarship data.');
    
    const csv = await res.text();
    const parsed = Papa.parse(csv, { header: true });
    state.allRows = parsed.data.filter((r) => r.unit_id && !r.unit_id.startsWith('__'));
    
    if (!state.allRows.length) throw new Error('No data rows found.');
    
    updateKPIs();
    renderSummary();
    renderRevenueCurves();
    renderYieldResponse();
    renderBands();
    renderDrilldown();
    populateFilters();
    wireTabs();
  } catch (e) {
    console.error('Init error:', e);
    alert('Error loading dashboard: ' + e.message);
  }
}

init();
