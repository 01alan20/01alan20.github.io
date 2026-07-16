const fmtInt = value => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number(value) || 0);
const fmtPct = value => value == null ? '—' : new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1, signDisplay: 'exceptZero' }).format(value);
const fmtPoints = value => value == null ? '—' : `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1, signDisplay: 'exceptZero' }).format(value)} pp`;
const clamp = (value, lower, upper) => Math.max(lower, Math.min(upper, value));
const DATA_VERSION = '20260716-1';
let DATA = {};

async function load() {
  const names = ['national', 'national_enrollment', 'states', 'state_diagnostics', 'counties', 'institutions', 'institution_diagnostics', 'international', 'context', 'state_shapes', 'map_meta'];
  for (const name of names) DATA[name] = await fetch(`data/${name}.json?v=${DATA_VERSION}`).then(response => response.json());
  init();
}

function plotConfig() { return { displayModeBar: false, responsive: true, scrollZoom: false }; }
function mapLayout() {
  const extent = DATA.map_meta.extent;
  return {
    margin: { l: 0, r: 0, t: 10, b: 0 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'DM Sans, Arial, sans-serif' },
    xaxis: { visible: false, range: [extent[0], extent[2]], fixedrange: true },
    yaxis: { visible: false, range: [extent[1], extent[3]], scaleanchor: 'x', scaleratio: 1, fixedrange: true },
    showlegend: false, hovermode: 'closest',
  };
}

function renderNationalPipeline() {
  const start = DATA.national.find(row => row.year === 2026);
  const end = DATA.national.find(row => row.year === 2041);
  const labels = ['High-school graduates', 'Immediate college entrants', 'Likely four-year entrants'];
  const startValues = [start.graduates, start.collegeEntrants, start.fourYearEntrants];
  const endValues = [end.graduates, end.collegeEntrants, end.fourYearEntrants];
  const losses = startValues.map((value, index) => value - endValues[index]);
  Plotly.react('national-chart', [
    { type: 'scatter', mode: 'lines+markers+text', name: '2026', x: labels, y: startValues, text: startValues.map(fmtInt), textposition: 'top center', line: { color: '#68758a', width: 3 }, marker: { color: '#68758a', size: 11 }, hovertemplate: '<b>%{x}</b><br>2026: %{y:,.0f}<extra></extra>' },
    { type: 'scatter', mode: 'lines+markers+text', name: '2041', x: labels, y: endValues, text: endValues.map(fmtInt), textposition: 'bottom center', line: { color: '#d66a3a', width: 3 }, marker: { color: '#d66a3a', size: 11 }, hovertemplate: '<b>%{x}</b><br>2041: %{y:,.0f}<extra></extra>' },
  ], {
    margin: { l: 80, r: 25, t: 45, b: 100 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: { family: 'DM Sans', color: '#14213d' },
    yaxis: { tickformat: '~s', gridcolor: '#e7eaf0' }, legend: { orientation: 'h', y: -0.22 },
    annotations: labels.map((label, index) => ({ x: label, y: Math.min(startValues[index], endValues[index]), text: `−${fmtInt(losses[index])}`, showarrow: false, yshift: -30, font: { color: '#b44e2a', size: 12 } })),
  }, plotConfig());
}

function renderEnrollmentTrends() {
  const panel = DATA.national_enrollment.balancedPanel;
  const years = Object.keys(panel.undergraduate.years).sort();
  const displayYears = years.map(year => year.slice(0, 4));
  const undergraduate = years.map(year => panel.undergraduate.years[year].enrollment);
  const graduate = years.map(year => panel.graduate.years[year].enrollment);
  const startIndex = 0;
  const endIndex = years.length - 1;
  const change = values => values[startIndex] ? values[endIndex] / values[startIndex] - 1 : null;
  const periodLabel = `from ${displayYears[startIndex]} to ${displayYears[endIndex]}`;
  document.querySelector('#undergraduate-history-change').textContent = `${fmtPct(change(undergraduate))} ${periodLabel}`;
  document.querySelector('#graduate-history-change').textContent = `${fmtPct(change(graduate))} ${periodLabel}`;
  const changeAnnotation = values => ({ x: displayYears[endIndex], y: values[endIndex], text: `<b>${fmtPct(change(values))}</b><br>${periodLabel}`, showarrow: true, arrowcolor: '#d66a3a', arrowhead: 2, ax: -65, ay: -50, bgcolor: '#fff', bordercolor: '#d66a3a', borderwidth: 1, borderpad: 7 });
  const common = {
    margin: { l: 78, r: 22, t: 35, b: 52 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: { family: 'DM Sans', color: '#14213d' },
    xaxis: { dtick: 2, gridcolor: '#e7eaf0' }, hovermode: 'x unified',
    shapes: [{ type: 'rect', xref: 'x', yref: 'paper', x0: '2020', x1: '2021', y0: 0, y1: 1, fillcolor: 'rgba(104,117,138,.10)', line: { width: 0 }, layer: 'below' }],
  };
  const chartRange = values => { const minValue = Math.min(...values); const maxValue = Math.max(...values); const padding = (maxValue - minValue) * 0.15; return [Math.max(0, minValue - padding), maxValue + padding]; };
  Plotly.react('undergraduate-trend-chart', [{ x: displayYears, y: undergraduate, type: 'scatter', mode: 'lines+markers', line: { color: '#2f6fed', width: 4 }, marker: { size: 7, color: '#14213d' }, hovertemplate: 'Year %{x}<br>%{y:,.0f} undergraduates<extra></extra>' }], { ...common, annotations: [changeAnnotation(undergraduate), { x: '2020', yref: 'paper', y: 1, text: 'Pandemic period', showarrow: false, font: { color: '#697386', size: 10 } }], yaxis: { range: chartRange(undergraduate), tickformat: '~s', gridcolor: '#e7eaf0' } }, plotConfig());
  Plotly.react('graduate-trend-chart', [{ x: displayYears, y: graduate, type: 'scatter', mode: 'lines+markers', line: { color: '#d66a3a', width: 4 }, marker: { size: 7, color: '#14213d' }, hovertemplate: 'Year %{x}<br>%{y:,.0f} graduate students<extra></extra>' }], { ...common, annotations: [changeAnnotation(graduate), { x: '2020', yref: 'paper', y: 1, text: 'Pandemic period', showarrow: false, font: { color: '#697386', size: 10 } }], yaxis: { range: chartRange(graduate), tickformat: '~s', gridcolor: '#e7eaf0' } }, plotConfig());
}

function renderInternational() {
  const openDoors = DATA.international.openDoors2025;
  const fall = DATA.international.fall2025Snapshot;
  const metrics = [
    ['1.18m', 'international students in 2024/25'], ['6%', 'share of U.S. higher-education enrollment'],
    [fmtPct(openDoors.newStudentsChange), 'new international students in 2024/25'], [fmtPct(fall.newStudentsChange), 'new international enrollment in Fall 2025 snapshot'],
  ];
  document.querySelector('#international-metrics').innerHTML = metrics.map(([value, label]) => `<article class="metric"><strong>${value}</strong><span>${label}</span></article>`).join('');
  document.querySelector('#policy-timeline').innerHTML = DATA.international.policy.map(item => `<article class="timeline-item"><time>${new Date(`${item.date}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</time><h4>${item.title}</h4><p>${item.detail}</p></article>`).join('');
  const origin = DATA.international.originConcentration2024_25;
  if (!origin) return;
  const colors = ['#ff8a5b', '#7ea2ff', '#6d7890'];
  Plotly.react('international-concentration-chart', origin.groups.map((group, index) => ({
    type: 'bar', orientation: 'h', name: group.name, y: ['International students'], x: [group.students], marker: { color: colors[index] }, text: [`${group.name}<br>${fmtInt(group.students)}`], textposition: 'inside', insidetextanchor: 'middle', hovertemplate: `<b>${group.name}</b><br>%{x:,.0f} students<br>%{customdata:.1%} of total<extra></extra>`, customdata: [group.students / origin.total],
  })), { barmode: 'stack', margin: { l: 20, r: 20, t: 35, b: 55 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: { family: 'DM Sans', color: '#fff' }, xaxis: { tickformat: '~s', gridcolor: 'rgba(255,255,255,.12)' }, yaxis: { visible: false }, legend: { orientation: 'h', y: -0.25 } }, plotConfig());
  const topShare = (origin.groups[0].students + origin.groups[1].students) / origin.total;
  document.querySelector('#international-concentration-note').textContent = `${fmtPct(topShare)} of the 2024/25 international-student stock came from India and China. These are enrolled-student counts, not new-intake cohorts.`;
}

function hexToRgb(hex) { const value = hex.replace('#', ''); return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)]; }
function mixColor(a, b, amount) { const A = hexToRgb(a); const B = hexToRgb(b); return `rgb(${Math.round(A[0] + (B[0] - A[0]) * amount)},${Math.round(A[1] + (B[1] - A[1]) * amount)},${Math.round(A[2] + (B[2] - A[2]) * amount)})`; }
function divergingColor(value, limit) { const normalized = clamp((value + limit) / (2 * limit || 1), 0, 1); return normalized < 0.5 ? mixColor('#d66a3a', '#e7e2d8', normalized * 2) : mixColor('#e7e2d8', '#218a9a', (normalized - 0.5) * 2); }
function sequentialColor(value, min, max) { return mixColor('#e6eef8', '#174f9b', clamp((value - min) / (max - min || 1), 0, 1)); }

function stateRows() { return DATA.state_diagnostics.filter(row => row.year === Number(document.querySelector('#state-year').value)); }
function formatStateMetric(row, metric) {
  const value = row[metric];
  const format = EnrollmentDiagnosticsCore.stateMetricMeta(metric).format;
  if (format === 'percent') return fmtPct(value);
  if (format === 'points') return fmtPoints(value);
  return `${value > 0 ? '−' : value < 0 ? '+' : ''}${fmtInt(Math.abs(value))}`;
}

function renderStateDetail(row) {
  document.querySelector('#state-detail').innerHTML = `<p class="kicker">${row.archetype}</p><h3>${row.name}, ${row.year}</h3>
    <div class="detail-stat"><span>Projected high-school graduates</span><strong>${fmtInt(row.graduates)}</strong></div>
    <div class="detail-stat"><span>Likely four-year entrants</span><strong>${fmtInt(row.fourYearEntrants)}</strong></div>
    <div class="detail-stat"><span>Entrant change from 2026</span><strong>${fmtPct(row.change)}</strong></div>
    <div class="detail-stat"><span>Absolute entrants lost</span><strong>${row.entrantLoss > 0 ? '−' : '+'}${fmtInt(Math.abs(row.entrantLoss))}</strong></div>
    <div class="detail-stat"><span>Required participation increase</span><strong>${fmtPoints(row.requiredParticipationPoints)}</strong></div>
    <p>${row.participationFeasible ? 'Mathematically possible under the fixed four-year-share assumption.' : 'Would require a college-going rate above 100% under the fixed four-year-share assumption.'}</p>`;
}

function renderStateMap() {
  const rows = stateRows();
  const metric = document.querySelector('#state-metric').value;
  const meta = EnrollmentDiagnosticsCore.stateMetricMeta(metric);
  const values = rows.map(row => row[metric]).filter(Number.isFinite);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const limit = Math.max(Math.abs(min), Math.abs(max));
  const rowMap = new Map(rows.map(row => [row.state, row]));
  const colorFor = value => meta.scale === 'sequential' ? sequentialColor(value, min, max) : divergingColor(meta.scale === 'diverging-loss' ? -value : value, limit);
  const labels = meta.scale === 'sequential' ? ['Smaller increase', 'Moderate', 'Larger increase'] : meta.scale === 'diverging-loss' ? ['Larger loss', 'Little change', 'Gain'] : ['Decline', 'Little change', 'Growth'];
  ['left', 'mid', 'right'].forEach((key, index) => { document.querySelector(`#state-key-${key}`).textContent = labels[index]; });
  const swatches = meta.scale === 'sequential' ? ['#e6eef8', '#7fa3cf', '#174f9b'] : ['#d66a3a', '#e7e2d8', '#218a9a'];
  ['left', 'mid', 'right'].forEach((key, index) => { document.querySelector(`#state-key-swatch-${key}`).style.background = swatches[index]; });
  const traces = DATA.state_shapes.map(shape => {
    const row = rowMap.get(shape.state);
    if (!row) return null;
    return { type: 'scatter', mode: 'lines', x: shape.x, y: shape.y, fill: 'toself', fillcolor: colorFor(row[metric]), line: { color: '#fff', width: 1 }, hoveron: 'fills+points', text: `<b>${row.name}</b><br>${row.year}<br>${meta.label}: ${formatStateMetric(row, metric)}<br>Situation: ${row.archetype}`, hovertemplate: '%{text}<extra></extra>', meta: row.state, name: row.name };
  }).filter(Boolean);
  Plotly.react('state-map', traces, { ...mapLayout(), showlegend: false }, plotConfig());
  const map = document.querySelector('#state-map');
  map.removeAllListeners?.('plotly_click');
  map.on('plotly_click', event => { const row = rowMap.get(event.points[0].data.meta); if (row) renderStateDetail(row); });
  const largest = rows.slice().sort((a, b) => b.entrantLoss - a.entrantLoss)[0];
  document.querySelector('#state-finding').innerHTML = `<strong>${largest.name} has the largest projected absolute entrant loss in ${largest.year}.</strong><span>${fmtInt(Math.max(0, largest.entrantLoss))} fewer likely four-year entrants than in 2026, while the map can also show proportional change and the participation response required.</span>`;
}

function populateStateSelects() {
  const states = [...new Map(DATA.state_diagnostics.filter(row => row.year === 2026).map(row => [row.state, row.name])).entries()].sort((a, b) => a[1].localeCompare(b[1]));
  const options = states.map(([code, name]) => `<option value="${code}" ${code === 'GA' ? 'selected' : ''}>${name}</option>`).join('');
  document.querySelector('#county-state').innerHTML = options;
  document.querySelector('#replacement-state').innerHTML = options;
}

function renderCountyComparison() {
  const state = document.querySelector('#county-state').value;
  const year = Number(document.querySelector('#county-year').value);
  const currentRows = DATA.counties.filter(row => row.state === state && row.year === year);
  const baseline = new Map(DATA.counties.filter(row => row.state === state && row.year === 2026).map(row => [row.fips, row]));
  const sortMode = document.querySelector('#county-sort').value;
  const top = currentRows.sort((a, b) => sortMode === 'decline'
    ? (a.fourYearEntrants / (baseline.get(a.fips)?.fourYearEntrants || a.fourYearEntrants) - 1) - (b.fourYearEntrants / (baseline.get(b.fips)?.fourYearEntrants || b.fourYearEntrants) - 1)
    : b.fourYearEntrants - a.fourYearEntrants).slice(0, 15).reverse();
  const names = top.map(row => row.county.replace(' County', ''));
  const baseValues = top.map(row => baseline.get(row.fips)?.fourYearEntrants || 0);
  const selectedValues = top.map(row => row.fourYearEntrants);
  const segmentX = []; const segmentY = [];
  top.forEach((row, index) => { segmentX.push(baseValues[index], selectedValues[index], null); segmentY.push(names[index], names[index], null); });
  Plotly.react('county-chart', [
    { type: 'scatter', mode: 'lines', x: segmentX, y: segmentY, line: { color: '#c9d0dc', width: 3 }, hoverinfo: 'skip', showlegend: false },
    { type: 'scatter', mode: 'markers', name: '2026', x: baseValues, y: names, marker: { color: '#68758a', size: 10 }, hovertemplate: '<b>%{y}</b><br>2026: %{x:,.0f}<extra></extra>' },
    { type: 'scatter', mode: 'markers', name: String(year), x: selectedValues, y: names, marker: { color: '#2f6fed', size: 11 }, customdata: top.map((row, index) => [row.graduates, row.confidence, baseValues[index] ? row.fourYearEntrants / baseValues[index] - 1 : 0]), hovertemplate: `<b>%{y}</b><br>${year}: %{x:,.0f}<br>Change from 2026: %{customdata[2]:.1%}<br>Projected graduates: %{customdata[0]:,.0f}<extra></extra>` },
  ], { margin: { l: 145, r: 25, t: 55, b: 65 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: { family: 'DM Sans' }, xaxis: { gridcolor: '#e4e8ef', title: 'Likely four-year entrants' }, legend: { orientation: 'h', y: -0.14 } }, plotConfig());
  const currentTotal = currentRows.reduce((sum, row) => sum + row.fourYearEntrants, 0);
  const baselineTotal = [...baseline.values()].reduce((sum, row) => sum + row.fourYearEntrants, 0);
  document.querySelector('#county-summary').innerHTML = `<p class="kicker">${sortMode === 'decline' ? 'Largest declines' : 'Largest markets'}</p><h3>${currentRows[0]?.stateName || state}</h3><p>Likely four-year entrant pool in ${year}: <strong>${fmtInt(currentTotal)}</strong>.</p><p>Change from 2026: <strong>${baselineTotal ? fmtPct(currentTotal / baselineTotal - 1) : '—'}</strong>.</p>`;
}

function replacementInputs() {
  return {
    participation: document.querySelector('#replacement-participation'),
    outOfState: document.querySelector('#replacement-out-state'),
    international: document.querySelector('#replacement-international'),
    transferAdult: document.querySelector('#replacement-transfer-adult'),
  };
}

function renderReplacementTool(reset = false) {
  const state = document.querySelector('#replacement-state').value;
  const year = Number(document.querySelector('#replacement-year').value);
  const row = DATA.state_diagnostics.find(item => item.state === state && item.year === year);
  const required = Math.max(0, Math.round(row?.entrantLoss || 0));
  const inputs = replacementInputs();
  if (reset) Object.values(inputs).forEach(input => { input.value = 0; });
  Object.values(inputs).forEach(input => { input.max = required; input.step = Math.max(1, Math.round(required / 200)); input.disabled = required === 0; });
  const requested = Object.fromEntries(Object.entries(inputs).map(([key, input]) => [key, Number(input.value)]));
  const result = EnrollmentDiagnosticsCore.clampAllocation(required, requested);
  Object.entries(inputs).forEach(([key, input]) => { input.value = result.channels[key]; });
  const outputIds = { participation: 'replacement-participation-out', outOfState: 'replacement-out-state-out', international: 'replacement-international-out', transferAdult: 'replacement-transfer-adult-out' };
  Object.entries(result.channels).forEach(([key, value]) => { document.querySelector(`#${outputIds[key]}`).textContent = fmtInt(value); });
  document.querySelector('#replacement-required').textContent = fmtInt(required);
  document.querySelector('#replacement-summary').innerHTML = required === 0
    ? `<span>${row?.name || state}, ${year}</span><strong>0</strong><p>No replacement required because the projected entrant pool does not fall below 2026.</p>`
    : `<span>Unfilled students</span><strong>${fmtInt(result.unfilled)}</strong><p>${fmtInt(result.allocated)} of ${fmtInt(required)} projected missing entrants allocated. This is a user scenario, not an estimate of achievable recruitment.</p>`;
}

function init() {
  const latest = DATA.national.find(row => row.year === 2041);
  document.querySelector('#hero-grad').textContent = fmtInt(latest.graduates);
  document.querySelector('#hero-change').textContent = fmtPct(latest.change);
  renderNationalPipeline();
  renderEnrollmentTrends();
  renderInternational();
  populateStateSelects();
  renderStateMap();
  renderCountyComparison();
  renderReplacementTool(true);
  document.querySelector('#state-year').addEventListener('change', renderStateMap);
  document.querySelector('#state-metric').addEventListener('change', renderStateMap);
  document.querySelector('#county-state').addEventListener('change', renderCountyComparison);
  document.querySelector('#county-year').addEventListener('change', renderCountyComparison);
  document.querySelector('#county-sort').addEventListener('change', renderCountyComparison);
  document.querySelector('#replacement-state').addEventListener('change', () => renderReplacementTool(true));
  document.querySelector('#replacement-year').addEventListener('change', () => renderReplacementTool(true));
  Object.values(replacementInputs()).forEach(input => input.addEventListener('input', () => renderReplacementTool(false)));
}

load().catch(error => {
  console.error(error);
  document.body.insertAdjacentHTML('beforeend', '<p class="load-error">The project data could not be loaded. Please refresh the page.</p>');
});
