const fmtInt = n => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n || 0);
const fmtPct = n => n == null ? '—' : new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1, signDisplay: 'exceptZero' }).format(n);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const DATA_VERSION = '20260714-2';
let DATA = {};

async function load() {
  const names = ['national', 'national_enrollment', 'states', 'counties', 'institutions', 'international', 'context', 'state_shapes', 'map_meta'];
  for (const name of names) DATA[name] = await fetch(`data/${name}.json?v=${DATA_VERSION}`).then(response => response.json());
  init();
}

function plotConfig() { return { displayModeBar: false, responsive: true, scrollZoom: false }; }
function mapLayout() { const extent = DATA.map_meta.extent; return { margin: { l: 0, r: 0, t: 10, b: 0 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: { family: 'Arial, sans-serif' }, xaxis: { visible: false, range: [extent[0], extent[2]], fixedrange: true }, yaxis: { visible: false, range: [extent[1], extent[3]], scaleanchor: 'x', scaleratio: 1, fixedrange: true }, showlegend: false, hovermode: 'closest' }; }

function renderNational(step) {
  const years = DATA.national.map(row => row.year);
  const key = step === 2 ? 'fourYearEntrants' : step === 1 ? 'collegeEntrants' : 'graduates';
  const title = step === 2 ? 'Likely four-year entrants' : step === 1 ? 'Likely immediate college entrants' : 'Projected high-school graduates';
  const values = DATA.national.map(row => row[key]);
  document.querySelector('#national-title').textContent = title;
  Plotly.react('national-chart', [{ x: years, y: values, type: 'scatter', mode: 'lines+markers', line: { color: '#ff6b35', width: 5, shape: 'spline' }, marker: { size: 11, color: '#14213d' }, hovertemplate: 'Class of %{x}<br>%{y:,.0f}<extra></extra>' }], { margin: { l: 80, r: 20, t: 35, b: 55 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: { family: 'DM Sans', color: '#14213d' }, xaxis: { dtick: 5, gridcolor: '#e7eaf0' }, yaxis: { range: [1000000, Math.max(...values) * 1.04], tickformat: '~s', gridcolor: '#e7eaf0' }, annotations: [{ x: 2041, y: values.at(-1), text: `${fmtPct(DATA.national.at(-1).change)} vs 2026`, showarrow: true, arrowcolor: '#ff6b35', ax: -65, ay: -55, bgcolor: '#fff', borderpad: 7 }] }, plotConfig());
}

function renderNationalPipeline() {
  const start = DATA.national.find(row => row.year === 2026);
  const end = DATA.national.find(row => row.year === 2041);
  const labels = ['High-school graduates', 'Immediate college entrants', 'Likely four-year entrants'];
  const startValues = [start.graduates, start.collegeEntrants, start.fourYearEntrants];
  const endValues = [end.graduates, end.collegeEntrants, end.fourYearEntrants];
  document.querySelector('#national-title').textContent = 'A smaller pipeline from high school to four-year college';
  Plotly.react('national-chart', [
    { type: 'bar', name: '2026', x: labels, y: startValues, marker: { color: '#c7cfdd' }, hovertemplate: '<b>%{x}</b><br>2026: %{y:,.0f}<extra></extra>' },
    { type: 'bar', name: '2041', x: labels, y: endValues, marker: { color: '#ff6b35' }, hovertemplate: '<b>%{x}</b><br>2041: %{y:,.0f}<extra></extra>' },
  ], { margin: { l: 80, r: 20, t: 35, b: 85 }, barmode: 'group', paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: { family: 'DM Sans', color: '#14213d' }, yaxis: { tickformat: '~s', gridcolor: '#e7eaf0' }, legend: { orientation: 'h', y: -0.18 }, annotations: [{ x: labels[2], y: endValues[2], text: `${fmtPct(end.change)} from 2026`, showarrow: true, arrowcolor: '#ff6b35', ax: -45, ay: -48, bgcolor: '#fff', borderpad: 7 }] }, plotConfig());
}

function renderEnrollmentTrends() {
  const panel = DATA.national_enrollment.balancedPanel;
  const years = Object.keys(panel.undergraduate.years).sort();
  const displayYears = years.map(year => year.slice(0, 4));
  const undergraduate = years.map(year => panel.undergraduate.years[year].enrollment);
  const graduate = years.map(year => panel.graduate.years[year].enrollment);
  const startIndex = years.findIndex(year => year.startsWith('2015'));
  const endIndex = years.findIndex(year => year.startsWith('2023'));
  const change = values => startIndex >= 0 && endIndex >= 0 && values[startIndex] ? values[endIndex] / values[startIndex] - 1 : null;
  document.querySelector('#undergraduate-history-change').textContent = `${fmtPct(change(undergraduate))} from 2015 to 2023`;
  document.querySelector('#graduate-history-change').textContent = `${fmtPct(change(graduate))} from 2015 to 2023`;
  const changeAnnotation = values => ({ x: displayYears[endIndex], y: values[endIndex], text: `<b>${fmtPct(change(values))}</b><br>from 2015 to 2023`, showarrow: true, arrowcolor: '#ff6b35', arrowhead: 2, ax: -58, ay: -48, bgcolor: '#fff', bordercolor: '#ff6b35', borderwidth: 1, borderpad: 7, font: { family: 'DM Sans', color: '#14213d' } });
  const common = { margin: { l: 78, r: 20, t: 35, b: 50 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: { family: 'DM Sans', color: '#14213d' }, xaxis: { dtick: 2, gridcolor: '#e7eaf0' }, hovermode: 'x unified' };
  Plotly.react('undergraduate-trend-chart', [{ x: displayYears, y: undergraduate, type: 'scatter', mode: 'lines+markers', line: { color: '#2f6fed', width: 4 }, marker: { size: 7, color: '#14213d' }, hovertemplate: 'Year %{x}<br>%{y:,.0f} undergraduates<extra></extra>' }], { ...common, annotations: [changeAnnotation(undergraduate)], yaxis: { range: [1000000, Math.max(...undergraduate) * 1.04], tickformat: '~s', gridcolor: '#e7eaf0' } }, plotConfig());
  Plotly.react('graduate-trend-chart', [{ x: displayYears, y: graduate, type: 'scatter', mode: 'lines+markers', line: { color: '#ff6b35', width: 4 }, marker: { size: 7, color: '#14213d' }, hovertemplate: 'Year %{x}<br>%{y:,.0f} graduate students<extra></extra>' }], { ...common, annotations: [changeAnnotation(graduate)], yaxis: { tickformat: '~s', gridcolor: '#e7eaf0' } }, plotConfig());
}

function renderInternational() { const openDoors = DATA.international.openDoors2025; const fall = DATA.international.fall2025Snapshot; const metrics = [['1.18m', 'international students in 2024/25'], ['6%', 'share of U.S. higher-education enrollment'], [fmtPct(openDoors.newStudentsChange), 'new international students in fall 2024'], [fmtPct(fall.newStudentsChange), 'new international enrollment in fall 2025 snapshot']]; document.querySelector('#international-metrics').innerHTML = metrics.map(([value, label]) => `<article class="metric"><strong>${value}</strong><span>${label}</span></article>`).join(''); document.querySelector('#policy-timeline').innerHTML = DATA.international.policy.map(item => `<article class="timeline-item"><time>${new Date(`${item.date}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</time><h4>${item.title}</h4><p>${item.detail}</p></article>`).join(''); }
function stateRows() { return DATA.states.filter(row => row.year === +document.querySelector('#state-year').value); }
function hexToRgb(hex) { const value = hex.replace('#', ''); return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)]; }
function mixColor(a, b, t) { const A = hexToRgb(a), B = hexToRgb(b); return `rgb(${Math.round(A[0] + (B[0] - A[0]) * t)},${Math.round(A[1] + (B[1] - A[1]) * t)},${Math.round(A[2] + (B[2] - A[2]) * t)})`; }
function valueColor(value, min, max, mode) { const limit = mode === 'change' ? Math.max(Math.abs(min), Math.abs(max)) : null; const t = clamp(mode === 'change' ? (value + limit) / (2 * limit || 1) : (value - min) / (max - min || 1), 0, 1); if (mode === 'blue') return mixColor('#dbe8f7', '#174f9b', t); if (mode === 'coverage') return t < .5 ? mixColor('#b53f3f', '#f6e7d4', t * 2) : mixColor('#f6e7d4', '#1e9b72', (t - .5) * 2); return t < .5 ? mixColor('#b53f3f', '#f6e7d4', t * 2) : mixColor('#f6e7d4', '#1e9b72', (t - .5) * 2); }
function renderStateMap() { const rows = stateRows(), metric = document.querySelector('#state-metric').value, values = rows.map(row => row[metric]).filter(Number.isFinite), min = Math.min(...values), max = Math.max(...values), rowMap = new Map(rows.map(row => [row.state, row])); const traces = DATA.state_shapes.map(shape => { const row = rowMap.get(shape.state); if (!row) return null; const label = metric === 'change' ? 'Change from 2026' : metric === 'coverage' ? 'Local pool coverage' : 'Likely four-year entrants'; return { type: 'scatter', mode: 'lines', x: shape.x, y: shape.y, fill: 'toself', fillcolor: valueColor(row[metric], min, max, metric === 'fourYearEntrants' ? 'blue' : metric), line: { color: '#fff', width: 1 }, hoveron: 'fills+points', text: `<b>${row.name}</b><br>Class of ${row.year}<br>${label}: ${metric === 'fourYearEntrants' ? fmtInt(row[metric]) : metric === 'coverage' ? row[metric].toFixed(2) + 'x' : fmtPct(row[metric])}`, hovertemplate: '%{text}<extra></extra>', meta: row.state, name: row.name }; }).filter(Boolean); Plotly.react('state-map', traces, { ...mapLayout(), showlegend: false }, plotConfig()); const map = document.querySelector('#state-map'); map.removeAllListeners?.('plotly_click'); map.on('plotly_click', event => { const row = rowMap.get(event.points[0].data.meta); if (row) document.querySelector('#state-detail').innerHTML = `<p class="kicker">${row.name}</p><h3>Class of ${row.year}</h3><div class="detail-stat"><span>Projected graduates</span><strong>${fmtInt(row.graduates)}</strong></div><div class="detail-stat"><span>Likely four-year entrants</span><strong>${fmtInt(row.fourYearEntrants)}</strong></div><div class="detail-stat"><span>Change from 2026</span><strong>${fmtPct(row.change)}</strong></div><div class="detail-stat"><span>Local pool coverage</span><strong>${row.coverage.toFixed(2)}x</strong></div>`; }); }
function populateStateSelect() { const states = [...new Map(DATA.states.filter(row => row.year === 2026).map(row => [row.state, row.name])).entries()].sort((a, b) => a[1].localeCompare(b[1])); document.querySelector('#county-state').innerHTML = states.map(([code, name]) => `<option value="${code}" ${code === 'GA' ? 'selected' : ''}>${name}</option>`).join(''); }
function renderCounty() { const state = document.querySelector('#county-state').value, year = +document.querySelector('#county-year').value, rows = DATA.counties.filter(row => row.state === state && row.year === year).sort((a, b) => b.fourYearEntrants - a.fourYearEntrants), top = rows.slice(0, 15).reverse(); Plotly.react('county-chart', [{ type: 'bar', orientation: 'h', y: top.map(row => row.county.replace(' County', '')), x: top.map(row => row.fourYearEntrants), marker: { color: '#2f6fed' }, customdata: top.map(row => [row.graduates, row.confidence]), hovertemplate: '<b>%{y}</b><br>Likely four-year entrants: %{x:,.0f}<br>Projected graduates: %{customdata[0]:,.0f}<br>Confidence: %{customdata[1]}<extra></extra>' }], { title: { text: `Largest local student markets — ${rows[0]?.stateName || state}, ${year}`, x: .02 }, margin: { l: 135, r: 20, t: 55, b: 45 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: { family: 'DM Sans' }, xaxis: { gridcolor: '#e4e8ef' } }, plotConfig()); const total = rows.reduce((sum, row) => sum + row.fourYearEntrants, 0); document.querySelector('#county-summary').innerHTML = `<p class="kicker">County view</p><h3>${rows[0]?.stateName || state}</h3><p>Estimated four-year entrant pool in ${year}: <strong>${fmtInt(total)}</strong>.</p>`; }
function renderCountyComparison() {
  const state = document.querySelector('#county-state').value, year = +document.querySelector('#county-year').value;
  const currentRows = DATA.counties.filter(row => row.state === state && row.year === year);
  const baseline = new Map(DATA.counties.filter(row => row.state === state && row.year === 2026).map(row => [row.fips, row]));
  const top = currentRows.sort((a, b) => b.fourYearEntrants - a.fourYearEntrants).slice(0, 15).reverse();
  const countyNames = top.map(row => row.county.replace(' County', ''));
  const baseValues = top.map(row => baseline.get(row.fips)?.fourYearEntrants || 0);
  const selectedValues = top.map(row => row.fourYearEntrants);
  const segmentX = [], segmentY = [];
  top.forEach((row, index) => { segmentX.push(baseValues[index], selectedValues[index], null); segmentY.push(countyNames[index], countyNames[index], null); });
  Plotly.react('county-chart', [
    { type: 'scatter', mode: 'lines', x: segmentX, y: segmentY, line: { color: '#c7cfdd', width: 3 }, hoverinfo: 'skip', showlegend: false },
    { type: 'scatter', mode: 'markers', name: '2026', x: baseValues, y: countyNames, marker: { color: '#68758a', size: 9 }, hovertemplate: '<b>%{y}</b><br>2026 likely four-year entrants: %{x:,.0f}<extra></extra>' },
    { type: 'scatter', mode: 'markers', name: String(year), x: selectedValues, y: countyNames, marker: { color: '#2f6fed', size: 10 }, hovertemplate: `<b>%{y}</b><br>${year} likely four-year entrants: %{x:,.0f}<extra></extra>` },
  ], { title: { text: `Local student markets — 2026 compared with ${year}`, x: .02 }, margin: { l: 135, r: 20, t: 55, b: 45 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: { family: 'DM Sans' }, xaxis: { gridcolor: '#e4e8ef' }, legend: { orientation: 'h', y: -0.15 } }, plotConfig());
  const currentTotal = currentRows.reduce((sum, row) => sum + row.fourYearEntrants, 0);
  const baselineTotal = [...baseline.values()].reduce((sum, row) => sum + row.fourYearEntrants, 0);
  document.querySelector('#county-summary').innerHTML = `<p class="kicker">County view</p><h3>${currentRows[0]?.stateName || state}</h3><p>Estimated four-year entrant pool in ${year}: <strong>${fmtInt(currentTotal)}</strong>, ${fmtPct(currentTotal / baselineTotal - 1)} from 2026.</p>`;
}

function init() { const latest = DATA.national.find(row => row.year === 2041); document.querySelector('#hero-grad').textContent = fmtInt(latest.graduates); document.querySelector('#hero-change').textContent = fmtPct(latest.change); renderNationalPipeline(); renderEnrollmentTrends(); renderInternational(); populateStateSelect(); renderStateMap(); renderCountyComparison(); document.querySelector('#state-year').addEventListener('change', renderStateMap); document.querySelector('#state-metric').addEventListener('change', renderStateMap); document.querySelector('#county-state').addEventListener('change', renderCountyComparison); document.querySelector('#county-year').addEventListener('change', renderCountyComparison); }
load();
