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
  
  document.getElementById('kpi-institutions').textContent = fmt(rows.length, 0);
  document.getElementById('kpi-avg-discount').textContent = pct(mean(values(rows, 'optimal_discount_pct')) / 100, 0);
  document.getElementById('kpi-avg-revenue').textContent = pct(mean(values(rows, 'optimal_revenue_change_pct')), 1);
  document.getElementById('kpi-avg-enrollment').textContent = fmt(mean(values(rows, 'optimal_incremental_enrollment')), 0);
}

function renderSummary() {
  const rows = state.allRows;
  
  // Distribution of optimal discounts
  const discounts = values(rows, 'optimal_discount_pct');
  plot('chart-optimal-discount', [
    {
      x: discounts,
      type: 'histogram',
      nbinsx: 12,
      marker: { color: '#16a34a', opacity: 0.8 },
      name: 'Institutions'
    }
  ], {
    title: { text: 'Distribution of Optimal Scholarship Discounts', font: { size: 14, color: '#1f2937' } },
    xaxis: { title: 'Discount %' },
    yaxis: { title: 'Count of Institutions' }
  });
  
  // Revenue lift vs enrollment gain scatter
  const validRows = rows.filter((r) => num(r.optimal_revenue_change_pct) !== null && num(r.optimal_incremental_enrollment) !== null);
  plot('chart-revenue-lift', [
    {
      x: validRows.map((r) => num(r.optimal_revenue_change_pct) * 100),
      y: validRows.map((r) => num(r.optimal_incremental_enrollment)),
      mode: 'markers',
      marker: { size: 8, color: '#16a34a', opacity: 0.6 },
      text: validRows.map((r) => r.institution_name),
      hovertemplate: '<b>%{text}</b><br>Revenue Change: %{x:.1f}%<br>Enrollment Gain: %{y:.0f}<extra></extra>',
      name: 'Institution'
    }
  ], {
    title: { text: 'Revenue Lift vs Enrollment Gain', font: { size: 14, color: '#1f2937' } },
    xaxis: { title: 'Revenue Change %' },
    yaxis: { title: 'Additional Enrollments' }
  });
}

function renderRevenueCurves() {
  const rows = state.allRows;
  const top6 = rows.sort((a, b) => num(b.optimal_net_revenue) - num(a.optimal_net_revenue)).slice(0, 6);
  
  const traces = top6.map((row) => ({
    y: [num(row.optimal_net_revenue)],
    name: row.institution_name.substring(0, 20),
    type: 'bar'
  }));
  
  plot('chart-revenue-curves', traces, {
    title: { text: 'Optimized Net Revenue by Institution (Top 6)', font: { size: 14, color: '#1f2937' } },
    yaxis: { title: 'Net Revenue ($)' },
    barmode: 'group'
  });
}

function renderYieldResponse() {
  const rows = state.allRows;
  
  // Discount vs Yield
  const validYield = rows.filter((r) => num(r.optimal_discount_pct) !== null && num(r.optimal_projected_yield) !== null);
  plot('chart-discount-vs-yield', [
    {
      x: validYield.map((r) => num(r.optimal_discount_pct)),
      y: validYield.map((r) => num(r.optimal_projected_yield) * 100),
      mode: 'markers',
      marker: { size: 7, color: '#16a34a', opacity: 0.5 },
      text: validYield.map((r) => r.institution_name),
      hovertemplate: '<b>%{text}</b><br>Discount: %{x:.0f}%<br>Projected Yield: %{y:.1f}%<extra></extra>',
      name: 'Institution'
    }
  ], {
    title: { text: 'Optimal Discount vs Projected Yield', font: { size: 14, color: '#1f2937' } },
    xaxis: { title: 'Scholarship Discount %' },
    yaxis: { title: 'Projected Yield %' }
  });
  
  // Discount vs Enrollment
  const validEnroll = rows.filter((r) => num(r.optimal_discount_pct) !== null && num(r.optimal_projected_enrollment) !== null);
  plot('chart-discount-vs-enrollment', [
    {
      x: validEnroll.map((r) => num(r.optimal_discount_pct)),
      y: validEnroll.map((r) => num(r.optimal_projected_enrollment)),
      mode: 'markers',
      marker: { size: 7, color: '#10b981', opacity: 0.5 },
      text: validEnroll.map((r) => r.institution_name),
      hovertemplate: '<b>%{text}</b><br>Discount: %{x:.0f}%<br>Projected Enrollment: %{y:.0f}<extra></extra>',
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
  
  // Count by discount band
  const bands = [
    { range: '0%', min: 0, max: 0, count: 0 },
    { range: '1-5%', min: 1, max: 5, count: 0 },
    { range: '6-10%', min: 6, max: 10, count: 0 },
    { range: '11-20%', min: 11, max: 20, count: 0 },
    { range: '21%+', min: 21, max: 100, count: 0 }
  ];
  
  rows.forEach((r) => {
    const disc = num(r.optimal_discount_pct) || 0;
    bands.forEach((b) => {
      if (disc >= b.min && disc <= b.max) b.count++;
    });
  });
  
  plot('chart-discount-distribution', [
    {
      x: bands.map((b) => b.range),
      y: bands.map((b) => b.count),
      type: 'bar',
      marker: { color: '#16a34a' },
      name: 'Institutions'
    }
  ], {
    title: { text: 'Distribution by Discount Band', font: { size: 14, color: '#1f2937' } },
    yaxis: { title: 'Number of Institutions' }
  });
  
  // Outcomes by band
  const bandOutcomes = bands.map((b) => {
    const bandRows = rows.filter((r) => {
      const disc = num(r.optimal_discount_pct) || 0;
      return disc >= b.min && disc <= b.max;
    });
    return {
      band: b.range,
      revenue: mean(values(bandRows, 'optimal_revenue_change_pct')) * 100,
      enrollment: mean(values(bandRows, 'optimal_incremental_enrollment'))
    };
  });
  
  plot('chart-band-outcomes', [
    {
      x: bandOutcomes.map((b) => b.band),
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
