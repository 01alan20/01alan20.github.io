(() => {
  const { filterInstitutions, listStates, listInstitutionNames } = EnrollmentFilterCore;
  const $ = id => document.getElementById(id);
  const state = { financeState: 'All', financeInstitutionId: '', exposureInstitutionId: '', exposureMin: null, exposureMax: null };
  const fmtInt = n => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n || 0);
  const fmtMoney = n => n == null ? '—' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(n);
  const fmtPct = n => n == null ? '—' : new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1, signDisplay: 'exceptZero' }).format(n);
  const limit = (x, a, b) => Math.max(a, Math.min(b, x));

  function exposureRows() {
    return filterInstitutions(DATA.institutions, { year: +$('inst-year').value, control: $('inst-control').value, scope: $('inst-scope').value, institutionId: state.exposureInstitutionId, exposureMin: state.exposureMin, exposureMax: state.exposureMax }).filter(row => row.mapX != null && row.mapY != null);
  }
  function financeRows() {
    return filterInstitutions(DATA.institutions, { year: +$('inst-year').value, control: $('inst-control').value, scope: $('inst-scope').value, state: state.financeState, institutionId: state.financeInstitutionId, financeOnly: true });
  }
  function setOptions(id, names) {
    $(id).innerHTML = names.map(name => `<option value="${name.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"></option>`).join('');
  }
  function refreshSearchLists() {
    const year = +$('inst-year').value;
    const control = $('inst-control').value;
    const scope = $('inst-scope').value;
    setOptions('exposure-institution-options', listInstitutionNames(DATA.institutions, { year, control, scope, exposureMin: state.exposureMin, exposureMax: state.exposureMax }));
    setOptions('finance-institution-options', listInstitutionNames(DATA.institutions, { year, state: state.financeState, financeOnly: true }));
  }
  function showExposureDetail(row, count) {
    $('institution-detail').innerHTML = row
      ? `<p class="kicker">${row.control} · ${row.scope}</p><h3>${row.name}</h3><p>${row.city}, ${row.state}</p><div class="detail-stat"><span>Current undergraduate enrollment</span><strong>${fmtInt(row.currentUG)}</strong></div><div class="detail-stat"><span>Projected enrollment</span><strong>${fmtInt(row.projectedUG)}</strong></div><div class="detail-stat"><span>Modeled market change</span><strong>${fmtPct(row.marketChange)}</strong></div><div class="detail-stat"><span>Exposure score</span><strong>${row.exposureScore}/100</strong></div><p>This score combines market contraction, tuition-pressure proxy, size, retention and admissions characteristics.</p>`
      : `<p class="kicker">Institution explorer</p><h3>Search for an institution.</h3><p>${count} institutions are shown on the map. Point size reflects current undergraduate enrollment; color reflects modeled market change.</p>`;
  }
  function renderExposureRanking(rows) {
    const top = [...rows].sort((a, b) => b.exposureScore - a.exposureScore).slice(0, 20);
    Plotly.react('exposure-ranking-chart', [{ type: 'bar', orientation: 'h', x: top.map(row => row.exposureScore).reverse(), y: top.map(row => row.name).reverse(), text: top.map(row => row.exposureScore.toFixed(1)).reverse(), textposition: 'outside', marker: { color: top.map(row => row.exposureScore).reverse(), colorscale: [[0, '#69b88e'], [.5, '#f2c46d'], [1, '#d84a4a']], cmin: 0, cmax: 100 }, hovertemplate: '<b>%{y}</b><br>Exposure score: %{x:.1f}<extra></extra>' }], { margin: { l: 230, r: 55, t: 20, b: 55 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: { family: 'DM Sans' }, xaxis: { title: 'Exposure score', range: [0, 105], gridcolor: '#e5e8ef' }, yaxis: { title: 'Institution', automargin: true }, height: Math.max(420, top.length * 26) }, plotConfig());
  }
  function renderExposure() {
    let rows = exposureRows();
    const selected = rows.find(row => String(row.unitid) === state.exposureInstitutionId);
    if (state.exposureInstitutionId && !selected) { state.exposureInstitutionId = ''; $('exposure-institution').value = ''; }
    const base = DATA.state_shapes.map(shape => ({ type: 'scatter', mode: 'lines', x: shape.x, y: shape.y, fill: 'toself', fillcolor: '#eef0f4', line: { color: '#fff', width: 1 }, hoverinfo: 'skip', showlegend: false }));
    const markers = { type: 'scattergl', mode: 'markers', x: rows.map(row => row.mapX), y: rows.map(row => row.mapY), text: rows.map(row => row.name), customdata: rows.map(row => [row.unitid, row.state, row.currentUG, row.projectedUG, row.marketChange, row.scope]), marker: { size: rows.map(row => limit(Math.sqrt(row.currentUG) / 3, 4, 24)), color: rows.map(row => row.marketChange), colorscale: [[0, '#b53f3f'], [.5, '#f6e7d4'], [1, '#1e9b72']], cmid: 0, colorbar: { title: 'Market change' }, opacity: .76, line: { width: .4, color: '#fff' } }, hovertemplate: '<b>%{text}</b><br>%{customdata[1]} · %{customdata[5]}<br>Current UG: %{customdata[2]:,.0f}<br>Projected UG: %{customdata[3]:,.0f}<br>Market change: %{customdata[4]:.1%}<extra></extra>' };
    const traces = [...base, markers];
    if (selected) traces.push({ type: 'scattergl', mode: 'markers', x: [selected.mapX], y: [selected.mapY], marker: { size: 34, color: 'rgba(255,255,255,0)', line: { color: '#ff6b35', width: 4 } }, hoverinfo: 'skip', showlegend: false });
    Plotly.react('institution-map', traces, mapLayout(), plotConfig());
    const map = $('institution-map');
    map.removeAllListeners?.('plotly_click');
    map.on('plotly_click', event => { const point = event.points[0]; if (!point?.customdata) return; state.exposureInstitutionId = String(point.customdata[0]); const row = DATA.institutions.find(item => String(item.unitid) === state.exposureInstitutionId); $('exposure-institution').value = row?.name || ''; renderExposure(); });
    showExposureDetail(selected, rows.length);
    renderExposureRanking(rows);
  }
  function renderFinance() {
    const share = +$('share-slider').value / 100;
    const variable = +$('variable-slider').value / 100;
    const rows = financeRows().map(row => { const change = row.marketChange + share; const fte0 = row.currentUG * .85; const fte1 = row.currentUG * (1 + change) * .85; const deltaFte = fte1 - fte0; const revenue = deltaFte * row.tuitionPerFTE; const expense = deltaFte * row.instructionPerFTE * variable; const gap = Math.max(0, -(revenue - expense)); return { ...row, scenarioGap: gap, scenarioGapPct: gap / (fte0 * row.tuitionPerFTE || 1) }; });
    const chartRows = rows.filter(row => row.scenarioGap > 0);
    Plotly.react('finance-chart', [{ type: 'scatter', mode: 'markers', x: chartRows.map(row => row.currentUG), y: chartRows.map(row => row.scenarioGapPct), text: chartRows.map(row => row.name), customdata: chartRows.map(row => [row.state, row.scenarioGap, row.exposureBand, row.scope]), marker: { size: chartRows.map(row => limit(Math.sqrt(row.scenarioGap) / 130, 5, 28)), color: chartRows.map(row => row.exposureScore), colorscale: [[0, '#69b88e'], [.5, '#f2c46d'], [1, '#d84a4a']], colorbar: { title: 'Exposure' }, opacity: .75, line: { color: '#fff', width: .5 } }, hovertemplate: '<b>%{text}</b><br>%{customdata[0]} · %{customdata[3]}<br>Gap: $%{customdata[1]:,.0f}<br>Gap / tuition: %{y:.1%}<br>Exposure: %{customdata[2]}<extra></extra>' }], { title: { text: 'Modeled tuition-contribution pressure', x: .02 }, margin: { l: 80, r: 20, t: 55, b: 70 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: { family: 'DM Sans' }, xaxis: { title: { text: 'Current undergraduate enrollment' }, type: 'log', gridcolor: '#e5e8ef' }, yaxis: { title: { text: 'Funding gap as share of tuition proxy' }, tickformat: '.0%', gridcolor: '#e5e8ef' } }, plotConfig());
    $('risk-table').innerHTML = rows.sort((a, b) => b.exposureScore - a.exposureScore).slice(0, 25).map(row => `<tr><td>${row.name}</td><td>${row.state}</td><td>${fmtMoney(row.scenarioGap)}</td><td><span class="band ${row.exposureBand}">${row.exposureBand}</span></td></tr>`).join('');
  }
  function install() {
    if (typeof DATA === 'undefined' || !DATA.institutions?.length || !DATA.state_shapes?.length || !$('finance-state')) return false;
    $('finance-state').innerHTML = '<option value="All">All states</option>' + listStates(DATA.institutions).map(code => `<option value="${code}">${code}</option>`).join('');
    refreshSearchLists();
    ['inst-year', 'inst-control', 'inst-scope'].forEach(id => $(id).addEventListener('change', () => { refreshSearchLists(); renderExposure(); renderFinance(); }));
    $('exposure-score').addEventListener('change', event => { const [min, max] = event.target.value === 'All' ? [null, null] : event.target.value.split('-').map(Number); state.exposureMin = min; state.exposureMax = max; const current = DATA.institutions.find(row => String(row.unitid) === state.exposureInstitutionId); if (current && min !== null && (current.exposureScore < min || current.exposureScore > max)) { state.exposureInstitutionId = ''; $('exposure-institution').value = ''; } refreshSearchLists(); renderExposure(); });
    ['share-slider', 'variable-slider'].forEach(id => $(id).addEventListener('input', renderFinance));
    $('finance-state').addEventListener('change', event => { state.financeState = event.target.value; const current = DATA.institutions.find(row => String(row.unitid) === state.financeInstitutionId); if (current && state.financeState !== 'All' && current.state !== state.financeState) { state.financeInstitutionId = ''; $('finance-institution').value = ''; } refreshSearchLists(); renderFinance(); });
    $('finance-institution').addEventListener('change', event => { const row = DATA.institutions.find(item => item.name === event.target.value && (state.financeState === 'All' || item.state === state.financeState)); state.financeInstitutionId = row ? String(row.unitid) : ''; if (!row) event.target.value = ''; renderFinance(); });
    $('exposure-institution').addEventListener('change', event => { const rows = filterInstitutions(DATA.institutions, { year: +$('inst-year').value, control: $('inst-control').value, scope: $('inst-scope').value }); const row = rows.find(item => item.name === event.target.value); state.exposureInstitutionId = row ? String(row.unitid) : ''; if (!row) event.target.value = ''; renderExposure(); });
    renderExposure(); renderFinance(); return true;
  }
  const wait = setInterval(() => { if (install()) clearInterval(wait); }, 50);
})();
