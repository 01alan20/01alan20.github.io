(() => {
  const $ = id => document.getElementById(id);
  const state = { selectedId: '', exposureState: 'All', exposureSize: 'All', exposureTrend: 'All', financeState: 'All', financeId: '', mapMetric: 'change' };
  const fmtInt = value => value == null ? 'Not available' : new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
  const fmtPct = value => value == null ? 'Not available' : new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1, signDisplay: 'exceptZero' }).format(value);
  const fmtMoney = value => value == null ? 'Not available' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  const fmtCompactMoney = value => value == null ? 'Not available' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(value);
  const safe = value => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

  function observedTrend(row) {
    if (!Number.isFinite(row.change)) return 'Not available';
    return row.change < -0.025 ? 'Declining' : row.change > 0.025 ? 'Growing' : 'Little change';
  }

  function diagnosticRows() { return DATA.institution_diagnostics || []; }
  function filteredRows() {
    const control = $('inst-control').value;
    return diagnosticRows().filter(row =>
      (control === 'All' || row.control === control)
      && (state.exposureState === 'All' || row.state === state.exposureState)
      && (state.exposureSize === 'All' || row.sizeBand === state.exposureSize)
      && (state.exposureTrend === 'All' || observedTrend(row) === state.exposureTrend));
  }

  function financeRows() {
    return diagnosticRows().filter(row =>
      Number.isFinite(row.currentUG) && Number.isFinite(row.tuitionPerFTE)
      && (state.financeState === 'All' || row.state === state.financeState));
  }

  function setDatalist(id, rows) {
    $(id).innerHTML = rows.slice().sort((a, b) => a.name.localeCompare(b.name)).map(row => `<option value="${safe(row.name)}"></option>`).join('');
  }

  function refreshSearchLists() {
    setDatalist('exposure-institution-options', filteredRows());
    setDatalist('finance-institution-options', financeRows());
  }

  function situation(row) {
    if (!Number.isFinite(row.change) || !Number.isFinite(row.statePoolChange2041)) return 'Insufficient comparison data';
    if (row.change >= 0 && row.statePoolChange2041 >= 0) return 'Growing institution / expanding state pool';
    if (row.change >= 0) return 'Growing institution / contracting state pool';
    if (row.statePoolChange2041 >= 0) return 'Declining institution / expanding state pool';
    return 'Declining institution / contracting state pool';
  }

  function situationColor(row) {
    const label = situation(row);
    if (label.startsWith('Growing institution / contracting')) return '#218a9a';
    if (label.startsWith('Growing institution')) return '#2f6fed';
    if (label.startsWith('Declining institution / expanding')) return '#8b78a8';
    if (label.startsWith('Declining institution')) return '#d66a3a';
    return '#aab1bf';
  }

  function quantile(values, probability) {
    const sorted = values.filter(Number.isFinite).slice().sort((a, b) => a - b);
    if (!sorted.length) return 0;
    const index = (sorted.length - 1) * probability;
    const lower = Math.floor(index);
    const fraction = index - lower;
    return sorted[lower + 1] == null ? sorted[lower] : sorted[lower] + fraction * (sorted[lower + 1] - sorted[lower]);
  }

  function selectInstitution(unitid) {
    state.selectedId = String(unitid || '');
    const row = diagnosticRows().find(item => String(item.unitid) === state.selectedId);
    $('exposure-institution').value = row?.name || '';
    renderInstitutionViews();
  }

  function renderQuadrant() {
    const rows = filteredRows().filter(row => Number.isFinite(row.change) && Number.isFinite(row.statePoolChange2041));
    const selected = rows.find(row => String(row.unitid) === state.selectedId);
    const yLow = quantile(rows.map(row => row.change), 0.01);
    const yHigh = quantile(rows.map(row => row.change), 0.99);
    const yPad = Math.max(0.05, (yHigh - yLow) * 0.08);
    const yMin = yLow - yPad;
    const yMax = yHigh + yPad;
    const xLow = quantile(rows.map(row => row.statePoolChange2041), 0.01);
    const xHigh = quantile(rows.map(row => row.statePoolChange2041), 0.99);
    const xPad = Math.max(0.02, (xHigh - xLow) * 0.08);
    const traces = [{
      type: 'scattergl', mode: 'markers', x: rows.map(row => row.statePoolChange2041), y: rows.map(row => row.change), text: rows.map(row => row.name),
      customdata: rows.map(row => [row.unitid, row.peerMedian, row.relativePerformance, situation(row), row.currentUG]),
      marker: { size: rows.map(row => Math.max(7, Math.min(25, Math.sqrt(row.currentUG || 0) / 4))), color: rows.map(situationColor), opacity: 0.68, line: { color: '#fff', width: 0.5 } },
      hovertemplate: '<b>%{text}</b><br>Observed institution change: %{y:.1%}<br>Projected state entrant change: %{x:.1%}<br>Peer median: %{customdata[1]:.1%}<br>%{customdata[3]}<br>Current UG: %{customdata[4]:,.0f}<extra></extra>',
    }];
    if (selected) traces.push({ type: 'scatter', mode: 'markers', x: [selected.statePoolChange2041], y: [selected.change], marker: { size: 30, color: 'rgba(255,255,255,0)', line: { color: '#14213d', width: 4 } }, hoverinfo: 'skip', showlegend: false });
    Plotly.react('competition-quadrant', traces, {
      margin: { l: 78, r: 25, t: 35, b: 70 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: { family: 'DM Sans', color: '#14213d' }, showlegend: false,
      xaxis: { title: 'Projected state four-year entrant change, 2026–2041', range: [xLow - xPad, xHigh + xPad], tickformat: '.0%', gridcolor: '#e5e8ef', zeroline: true, zerolinecolor: '#14213d', zerolinewidth: 1.5 },
      yaxis: { title: 'Observed institution UG change, 2015–16 to 2024–25', range: [yMin, yMax], tickformat: '.0%', gridcolor: '#e5e8ef', zeroline: true, zerolinecolor: '#14213d', zerolinewidth: 1.5 },
      annotations: [
        { xref: 'paper', yref: 'paper', x: .02, y: .98, text: 'Growing despite contraction', showarrow: false, font: { color: '#218a9a', size: 11 } },
        { xref: 'paper', yref: 'paper', x: .98, y: .98, text: 'Growing with expansion', showarrow: false, xanchor: 'right', font: { color: '#2f6fed', size: 11 } },
        { xref: 'paper', yref: 'paper', x: .02, y: .02, text: 'Combined contraction', showarrow: false, font: { color: '#b44e2a', size: 11 } },
        { xref: 'paper', yref: 'paper', x: .98, y: .02, text: 'Declining despite expansion', showarrow: false, xanchor: 'right', font: { color: '#7c6799', size: 11 } },
      ],
    }, plotConfig());
    const chart = $('competition-quadrant');
    chart.removeAllListeners?.('plotly_click');
    chart.on('plotly_click', event => { const unitid = event.points[0]?.customdata?.[0]; if (unitid) selectInstitution(unitid); });
  }

  function mapScale(rows, metric) {
    const meta = EnrollmentDiagnosticsCore.institutionMetricMeta(metric);
    const values = rows.map(row => row[metric]).filter(Number.isFinite);
    if (meta.scale === 'diverging') {
      const limit = Math.max(0.05, ...values.map(Math.abs));
      return { cmin: -limit, cmax: limit, cmid: 0, colorscale: [[0, '#d66a3a'], [.5, '#e7e2d8'], [1, '#218a9a']] };
    }
    return { cmin: Math.min(...values), cmax: Math.max(...values), colorscale: [[0, '#e6eef8'], [1, '#174f9b']] };
  }

  function renderInstitutionMap() {
    const rows = filteredRows().filter(row => row.mapX != null && row.mapY != null);
    const metric = state.mapMetric;
    const meta = EnrollmentDiagnosticsCore.institutionMetricMeta(metric);
    const valid = rows.filter(row => Number.isFinite(row[metric]));
    const missing = rows.filter(row => !Number.isFinite(row[metric]));
    const base = DATA.state_shapes.map(shape => ({ type: 'scatter', mode: 'lines', x: shape.x, y: shape.y, fill: 'toself', fillcolor: '#eef0f4', line: { color: '#fff', width: 1 }, hoverinfo: 'skip', showlegend: false }));
    const scale = mapScale(valid, metric);
    const markers = valid.length ? [{
      type: 'scattergl', mode: 'markers', x: valid.map(row => row.mapX), y: valid.map(row => row.mapY), text: valid.map(row => row.name), customdata: valid.map(row => [row.unitid, row[metric], row.currentUG, observedTrend(row)]),
      marker: { size: valid.map(row => Math.max(5, Math.min(25, Math.sqrt(row.currentUG || 0) / 3.5))), color: valid.map(row => row[metric]), ...scale, colorbar: { title: meta.label }, opacity: .76, line: { width: .4, color: '#fff' } },
      hovertemplate: `<b>%{text}</b><br>${meta.label}: %{customdata[1]${meta.format === 'percent' ? ':.1%' : meta.format === 'money' ? ':$,.0f' : ':,.0f'}}<br>Current UG: %{customdata[2]:,.0f}<br>%{customdata[3]}<extra></extra>`,
    }] : [];
    if (missing.length) markers.push({ type: 'scattergl', mode: 'markers', x: missing.map(row => row.mapX), y: missing.map(row => row.mapY), text: missing.map(row => row.name), customdata: missing.map(row => [row.unitid, row.currentUG]), marker: { size: missing.map(row => Math.max(5, Math.min(25, Math.sqrt(row.currentUG || 0) / 3.5))), color: '#aab1bf', opacity: .45 }, hovertemplate: `<b>%{text}</b><br>${meta.label}: Not available<br>Current UG: %{customdata[1]:,.0f}<extra></extra>`, showlegend: false });
    const selected = rows.find(row => String(row.unitid) === state.selectedId);
    const traces = [...base, ...markers];
    if (selected) traces.push({ type: 'scatter', mode: 'markers', x: [selected.mapX], y: [selected.mapY], marker: { size: 34, color: 'rgba(255,255,255,0)', line: { color: '#14213d', width: 4 } }, hoverinfo: 'skip', showlegend: false });
    Plotly.react('institution-map', traces, mapLayout(), plotConfig());
    const map = $('institution-map');
    map.removeAllListeners?.('plotly_click');
    map.on('plotly_click', event => { const unitid = event.points[0]?.customdata?.[0]; if (unitid) selectInstitution(unitid); });
  }

  function detailStat(label, value) { return `<div class="detail-stat"><span>${label}</span><strong>${value}</strong></div>`; }
  function profileStat(label, value) { return `<div class="profile-stat"><span>${label}</span><strong>${value}</strong></div>`; }
  function percentileItem(label, raw, percentile) {
    const width = Number.isFinite(percentile) ? percentile : 0;
    return `<div class="percentile-item"><span>${label}<br><small>${raw}</small></span><div class="percentile-track"><div class="percentile-fill" style="width:${width}%"></div></div><strong>${Number.isFinite(percentile) ? `${Math.round(percentile)}th` : '—'}</strong></div>`;
  }

  function renderProfile() {
    const row = diagnosticRows().find(item => String(item.unitid) === state.selectedId);
    if (!row) {
      $('institution-detail').innerHTML = `<p class="kicker">Institution explorer</p><h3>${fmtInt(filteredRows().length)} institutions shown</h3><p>Select a point or search for an institution to compare it with its state and peers.</p>`;
      $('institution-profile').hidden = true;
      return;
    }
    $('institution-detail').innerHTML = `<p class="kicker">${situation(row)}</p><h3>${safe(row.name)}</h3><p>${safe(row.city)}, ${safe(row.state)}</p>
      ${detailStat('Observed UG change', fmtPct(row.change))}${detailStat('Comparable-institution median', fmtPct(row.peerMedian))}${detailStat('State institution median', fmtPct(row.stateMedian))}${detailStat('Relative performance', row.relativePerformance == null ? 'Not available' : `${(row.relativePerformance * 100).toFixed(1)} pp`)}${detailStat('Projected state entrant change by 2041', fmtPct(row.statePoolChange2041))}`;
    const profile = $('institution-profile');
    profile.hidden = false;
    profile.innerHTML = `<div class="profile-header"><div><p class="kicker">Observed institution profile</p><h3>${safe(row.name)}</h3><p>${safe(row.control)} · ${safe(row.sizeBand)} · ${safe(row.admissionBand)}</p></div><p>${fmtInt(row.peerCount)} peers<br><small>${safe(row.peerDefinition)}</small></p></div>
      <div class="profile-grid">${profileStat('Current undergraduates', fmtInt(row.currentUG))}${profileStat('Current graduate students', fmtInt(row.currentPG))}${profileStat('Retention', fmtPct(row.retention))}${profileStat('Admissions rate', fmtPct(row.admitRate))}${profileStat('Adult share', fmtPct(row.adultUGShare))}${profileStat('Part-time share', fmtPct(row.partTimeUGShare))}${profileStat('International UG share', fmtPct(row.internationalUGShare))}${profileStat('Net tuition per FTE', fmtMoney(row.tuitionPerFTE))}${profileStat('Instruction per FTE', fmtMoney(row.instructionPerFTE))}</div>
      <div class="percentile-grid">${percentileItem('Observed enrollment momentum', fmtPct(row.change), row.percentiles.momentum)}${percentileItem('Retention', fmtPct(row.retention), row.percentiles.retention)}${percentileItem('Adult share', fmtPct(row.adultUGShare), row.percentiles.adultShare)}${percentileItem('Part-time share', fmtPct(row.partTimeUGShare), row.percentiles.partTimeShare)}${percentileItem('Net tuition per FTE', fmtMoney(row.tuitionPerFTE), row.percentiles.tuitionPerFTE)}</div>
      <p class="profile-description">${EnrollmentDiagnosticsCore.describeInstitution(row)}</p>`;
  }

  function renderInstitutionViews() { renderQuadrant(); renderInstitutionMap(); renderProfile(); }

  function selectedLossRate() { return Number(document.querySelector('input[name="finance-loss"]:checked')?.value || 0.10); }
  function chooseDefaultFinanceInstitution() {
    const rows = financeRows();
    if (!rows.some(row => String(row.unitid) === state.financeId)) state.financeId = String(rows.slice().sort((a, b) => b.currentUG - a.currentUG)[0]?.unitid || '');
    const row = rows.find(item => String(item.unitid) === state.financeId);
    $('finance-institution').value = row?.name || '';
  }

  function renderFinance() {
    const row = financeRows().find(item => String(item.unitid) === state.financeId);
    if (!row) {
      $('finance-chart').innerHTML = '';
      $('finance-summary').innerHTML = '<p class="kicker">No finance record selected</p><h3>Search for an institution with available tuition data.</h3>';
      return;
    }
    const result = EnrollmentDiagnosticsCore.tuitionCounterfactual(row, selectedLossRate(), 0.85);
    Plotly.react('finance-chart', [{ type: 'bar', orientation: 'h', y: ['Associated instructional expenditure', 'Gross tuition reduction', 'Current tuition base'], x: [result.associatedInstructionalExpenditure, result.grossTuitionReduction, result.currentTuitionBase], marker: { color: ['#8a94a8', '#d66a3a', '#2f6fed'] }, text: [fmtCompactMoney(result.associatedInstructionalExpenditure), fmtCompactMoney(result.grossTuitionReduction), fmtCompactMoney(result.currentTuitionBase)], textposition: 'auto', hovertemplate: '<b>%{y}</b><br>%{x:$,.0f}<extra></extra>' }], { margin: { l: 235, r: 20, t: 30, b: 55 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: { family: 'DM Sans' }, xaxis: { title: 'Estimated dollars', tickformat: '$~s', gridcolor: '#e5e8ef' } }, plotConfig());
    $('finance-summary').innerHTML = `<p class="kicker">${Math.round(result.lossRate * 100)}% enrollment-loss counterfactual</p><h3>${safe(row.name)}</h3><p>${safe(row.city)}, ${safe(row.state)}</p><div class="finance-metrics"><div class="finance-metric"><span>Students represented</span><strong>${fmtInt(result.lostStudents)}</strong></div><div class="finance-metric"><span>FTE represented</span><strong>${fmtInt(result.lostFTE)}</strong></div><div class="finance-metric"><span>Gross tuition reduction</span><strong>${fmtCompactMoney(result.grossTuitionReduction)}</strong></div><div class="finance-metric"><span>Share of tuition base</span><strong>${fmtPct(result.grossReductionPct)}</strong></div><div class="finance-metric"><span>Associated instruction</span><strong>${fmtCompactMoney(result.associatedInstructionalExpenditure)}</strong></div><div class="finance-metric"><span>Current undergraduate enrollment</span><strong>${fmtInt(row.currentUG)}</strong></div></div><p class="finance-warning"><strong>Immediately avoidable cost: Not estimated.</strong><br>Associated instructional expenditure is shown for scale and is not subtracted from the gross tuition reduction.</p>`;
  }

  function install() {
    if (typeof DATA === 'undefined' || !DATA.institution_diagnostics?.length || !DATA.state_shapes?.length || !$('finance-state')) return false;
    const states = [...new Set(diagnosticRows().map(row => row.state).filter(Boolean))].sort();
    $('exposure-state').innerHTML = '<option value="All">All states</option>' + states.map(code => `<option>${code}</option>`).join('');
    $('finance-state').innerHTML = '<option value="All">All states</option>' + states.map(code => `<option>${code}</option>`).join('');
    refreshSearchLists();
    ['inst-control', 'exposure-state', 'exposure-size', 'exposure-trend'].forEach(id => $(id).addEventListener('change', event => {
      if (id === 'exposure-state') state.exposureState = event.target.value;
      if (id === 'exposure-size') state.exposureSize = event.target.value;
      if (id === 'exposure-trend') state.exposureTrend = event.target.value;
      refreshSearchLists(); renderInstitutionViews();
    }));
    $('institution-map-metric').addEventListener('change', event => { state.mapMetric = event.target.value; renderInstitutionMap(); });
    $('exposure-institution').addEventListener('change', event => { const row = diagnosticRows().find(item => item.name === event.target.value); selectInstitution(row?.unitid || ''); });
    $('finance-state').addEventListener('change', event => { state.financeState = event.target.value; state.financeId = ''; refreshSearchLists(); chooseDefaultFinanceInstitution(); renderFinance(); });
    $('finance-institution').addEventListener('change', event => { const row = financeRows().find(item => item.name === event.target.value); state.financeId = String(row?.unitid || ''); if (!row) event.target.value = ''; renderFinance(); });
    document.querySelectorAll('input[name="finance-loss"]').forEach(input => input.addEventListener('change', renderFinance));
    chooseDefaultFinanceInstitution();
    renderInstitutionViews();
    renderFinance();
    return true;
  }

  const wait = setInterval(() => { if (install()) clearInterval(wait); }, 50);
})();
