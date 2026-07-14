(() => {
  const {
    filterInstitutions,
    listStates,
    listInstitutionNames,
    calculateTuitionPressure,
    annualizeEndpointChange,
    projectEnrollment,
    enrollmentBand,
    combineAnnualRates,
    regularizeTrendRate,
    dampedPeerAdjustment,
    internationalScenarioChange,
  } = EnrollmentFilterCore;
  const $ = id => document.getElementById(id);
  const state = { financeState: 'All', financeInstitutionId: '', financePressureBand: 'All', exposureInstitutionId: '', exposurePressureBand: 'All' };
  const fmtInt = n => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n || 0);
  const fmtMoney = n => n == null ? '—' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(n);
  const fmtPct = n => n == null ? '—' : new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1, signDisplay: 'exceptZero' }).format(n);
  const limit = (x, a, b) => Math.max(a, Math.min(b, x));
  const pressureBand = change => change >= 0 ? 'Low' : change > -0.10 ? 'Medium' : change > -0.25 ? 'High' : 'Very high';
  const scenarioSettings = () => ({ share: Number($('share-slider')?.value || 0) / 100, recovery: $('institution-international-recovery')?.value || $('international-recovery')?.value || 'normal' });
  const pressureMatches = (row, selected) => {
    const scenario = scenarioSettings();
    return selected === 'All' || pressureBand(projectRow(row, scenario.share, scenario.recovery).projectedChange) === selected;
  };

  function exposureRows() {
    return filterInstitutions(DATA.institutions, { year: +$('inst-year').value, control: $('inst-control').value, scope: $('inst-scope').value, institutionId: state.exposureInstitutionId }).filter(row => row.mapX != null && row.mapY != null && pressureMatches(row, state.exposurePressureBand || 'All'));
  }

  function financeRows() {
    return filterInstitutions(DATA.institutions, { year: +$('inst-year').value, control: $('inst-control').value, scope: $('inst-scope').value, state: state.financeState, institutionId: state.financeInstitutionId, financeOnly: true }).filter(row => pressureMatches(row, state.financePressureBand || 'All'));
  }

  const selectivityBand = rate => {
    if (!Number.isFinite(Number(rate))) return '80%+ (assumed)';
    const value = Number(rate);
    if (value < 0.10) return '<10%';
    if (value < 0.25) return '10–24%';
    if (value < 0.50) return '25–49%';
    if (value < 0.80) return '50–79%';
    return '80%+';
  };

  function projectRow(row, share = 0, internationalRecovery = 'normal') {
    const currentUG = Number(row.latestScorecardUG || row.currentUG) || 0;
    const currentPG = Number(row.latestScorecardPG || row.currentPG) || 0;
    const horizon = Math.max(1, Number(row.year) - 2025);
    // The user scenario is a separate, visible waterfall component below. Do
    // not fold it into the market baseline or it would be applied twice.
    const demographicEndpoint = Number(row.marketChange) || 0;
    const demographicAnnual = annualizeEndpointChange(demographicEndpoint, horizon);
    const peerAnnual = dampedPeerAdjustment(row.historicalResidual, row.historyYears, horizon);
    const internationalChange = internationalScenarioChange({ currentShare: row.internationalUGShare, preCovidShare: row.preCovidInternationalUGShare, year: row.year, recovery: internationalRecovery });
    const marketUG = projectEnrollment(currentUG, demographicAnnual, horizon);
    const peerAdjustedUG = projectEnrollment(marketUG, peerAnnual, horizon);
    const peerStudentsChange = peerAdjustedUG - marketUG;
    const internationalStudentsChange = currentUG * internationalChange;
    const userStudentsChange = currentUG * Number(share || 0);
    const blendedUG = Math.max(0, peerAdjustedUG + internationalStudentsChange + userStudentsChange);
    const pgBaseline = currentPG > 0 && Number.isFinite(Number(row.graduateCagr)) ? projectEnrollment(currentPG, Number(row.graduateCagr), horizon) : null;
    const pgBand = pgBaseline == null ? null : enrollmentBand(pgBaseline, 0.05);
    return { ...row, currentUG, currentPG, marketUG, demographicUG: marketUG, blendedUG, projectedChange: currentUG ? (blendedUG / currentUG) - 1 : 0, demographicAnnual, peerAnnual, peerStudentsChange, internationalChange, internationalStudentsChange, userStudentsChange, selectivity: selectivityBand(row.latestAdmissionRate ?? row.admitRate), pgBaseline, pgBand };
  }

  function setOptions(id, names) {
    $(id).innerHTML = names.map(name => `<option value="${name.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"></option>`).join('');
  }

  function refreshSearchLists() {
    const year = +$('inst-year').value, control = $('inst-control').value, scope = $('inst-scope').value;
    setOptions('exposure-institution-options', listInstitutionNames(DATA.institutions, { year, control, scope }));
    setOptions('finance-institution-options', listInstitutionNames(DATA.institutions, { year, state: state.financeState, financeOnly: true }));
  }

  function showExposureDetail(row, count) {
    const model = row && projectRow(row);
    $('institution-detail').innerHTML = row
      ? `<p class="kicker">${row.control} · ${row.scope}</p><h3>${row.name}</h3><p>${row.city}, ${row.state}</p><div class="detail-stat"><span>Current undergraduate / graduate</span><strong>${fmtInt(model.currentUG)} / ${fmtInt(model.currentPG)}</strong></div><div class="detail-stat"><span>Population-market UG estimate</span><strong>${fmtInt(model.demographicUG)}</strong></div><div class="detail-stat"><span>Projected undergraduate enrollment</span><strong>${fmtInt(model.blendedUG)} · ${fmtPct(model.projectedChange)}</strong></div><div class="detail-stat"><span>Graduate estimate</span><strong>${model.pgBaseline == null ? 'Not available' : `${fmtInt(model.pgBaseline)} · range ${fmtInt(model.pgBand.lower)}–${fmtInt(model.pgBand.upper)}`}</strong></div><div class="detail-stat"><span>Historical UG trend</span><strong>${row.historyYears ? fmtPct(row.enrollmentCagr) : 'Not available'}</strong></div><div class="detail-stat"><span>Enrollment pressure</span><strong>${pressureBand(model.projectedChange)} · ${fmtPct(model.projectedChange)}</strong></div>`
      : `<p class="kicker">Institution explorer</p><h3>Search for an institution.</h3><p>${count} institutions are shown on the map. Point size reflects current undergraduate enrollment; color reflects projected undergraduate change.</p>`;
  }

  function showInstitutionStory(row, count, share, recovery) {
    const model = row && projectRow(row, share, recovery);
    $('institution-detail').innerHTML = row
      ? `<p class="kicker">${row.control} · ${row.scope}</p><h3>${row.name}</h3><p>${row.city}, ${row.state}</p><div class="detail-stat"><span>Current undergraduate / graduate</span><strong>${fmtInt(model.currentUG)} / ${fmtInt(model.currentPG)}</strong></div><div class="detail-stat"><span>Market-reach proxy</span><strong>${row.scope}</strong></div><div class="detail-stat"><span>Selectivity category</span><strong>${model.selectivity}</strong></div><div class="detail-stat"><span>International UG exposure</span><strong>${model.internationalUGShare == null ? 'Not reported' : fmtPct(model.internationalUGShare)}</strong></div><div class="detail-stat"><span>Projected undergraduate enrollment</span><strong>${fmtInt(model.blendedUG)} · ${fmtPct(model.projectedChange)}</strong></div><div class="detail-stat"><span>Graduate estimate</span><strong>${model.pgBaseline == null ? 'Not available' : `${fmtInt(model.pgBaseline)} · range ${fmtInt(model.pgBand.lower)}–${fmtInt(model.pgBand.upper)}`}</strong></div><div class="detail-stat"><span>Enrollment pressure</span><strong>${pressureBand(model.projectedChange)} · ${fmtPct(model.projectedChange)}</strong></div>`
      : `<p class="kicker">Institution explorer</p><h3>Search for an institution.</h3><p>${count} institutions are shown on the map. Point size reflects current undergraduate enrollment; color reflects projected undergraduate change.</p>`;
  }

  function renderExposure() {
    const { share, recovery } = scenarioSettings();
    const rows = exposureRows(), models = rows.map(row => projectRow(row, share, recovery)), selected = rows.find(row => String(row.unitid) === state.exposureInstitutionId);
    if (state.exposureInstitutionId && !selected) { state.exposureInstitutionId = ''; $('exposure-institution').value = ''; }
    const base = DATA.state_shapes.map(shape => ({ type: 'scatter', mode: 'lines', x: shape.x, y: shape.y, fill: 'toself', fillcolor: '#eef0f4', line: { color: '#fff', width: 1 }, hoverinfo: 'skip', showlegend: false }));
    const markerValues = models.map(row => row.projectedChange);
    const markers = { type: 'scattergl', mode: 'markers', x: models.map(row => row.mapX), y: models.map(row => row.mapY), text: models.map(row => row.name), customdata: models.map(row => [row.unitid, pressureBand(row.projectedChange), row.projectedChange]), marker: { size: models.map(row => limit(Math.sqrt(row.currentUG) / 3, 4, 24)), color: markerValues, colorscale: [[0, '#b53f3f'], [.5, '#f6e7d4'], [1, '#1e9b72']], cmin: -.75, cmax: .75, cmid: 0, colorbar: { title: 'Projected UG change', tickvals: [-.75, -.5, -.25, 0, .25, .5, .75], ticktext: ['-75%', '-50%', '-25%', '0%', '25%', '50%', '75%'] }, opacity: .76, line: { width: .4, color: '#fff' } }, hovertemplate: '<b>%{text}</b><br>Enrollment pressure: %{customdata[1]} (%{customdata[2]:.1%})<extra></extra>' };
    const traces = [...base, markers];
    if (selected) traces.push({ type: 'scatter', mode: 'markers', x: [selected.mapX], y: [selected.mapY], marker: { size: 34, color: 'rgba(255,255,255,0)', line: { color: '#ff6b35', width: 4 } }, hoverinfo: 'skip', showlegend: false });
    Plotly.react('institution-map', traces, mapLayout(), plotConfig());
    const map = $('institution-map');
    map.removeAllListeners?.('plotly_click');
    map.on('plotly_click', event => { const point = event.points[0]; if (!point?.customdata) return; state.exposureInstitutionId = String(point.customdata[0]); const row = rows.find(item => String(item.unitid) === state.exposureInstitutionId); $('exposure-institution').value = row?.name || ''; renderExposure(); });
    showInstitutionStory(selected, rows.length, share, recovery);
    renderInstitutionDecomposition(selected ? projectRow(selected, share, recovery) : null);
  }

  function renderInstitutionDecomposition(model) {
    const panel = $('institution-decomposition');
    const analysis = $('institution-analysis');
    if (!model) {
      analysis.hidden = true;
      panel.innerHTML = '<p>Selected institution scenario.</p><div id="institution-decomposition-chart" class="plot"></div>';
      return;
    }
    analysis.hidden = false;
    panel.querySelector('p:first-child').textContent = `${model.name}: how the selected scenario changes current undergraduate enrollment.`;
    const components = [model.marketUG - model.currentUG, model.peerStudentsChange, model.internationalStudentsChange, model.userStudentsChange];
    Plotly.react('institution-decomposition-chart', [{ type: 'waterfall', measure: ['absolute', 'relative', 'relative', 'relative', 'relative', 'total'], x: ['Current UG', 'Domestic market', 'Peer position', 'International', 'User change', 'Projected UG'], y: [model.currentUG, ...components, 0], connector: { line: { color: '#9aa7bb' } }, increasing: { marker: { color: '#1e9b72' } }, decreasing: { marker: { color: '#b53f3f' } }, totals: { marker: { color: '#2f6fed' } }, hovertemplate: '<b>%{x}</b><br>%{y:,.0f} undergraduate students<extra></extra>' }], { margin: { l: 50, r: 20, t: 24, b: 80 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: { family: 'DM Sans', color: '#14213d' }, yaxis: { title: { text: 'Undergraduate students' }, gridcolor: '#e5e8ef' } }, plotConfig());
  }

  function renderFinance() {
    const { share, recovery } = scenarioSettings(), tuitionFeeChange = +$('tuition-slider').value / 100;
    const rows = financeRows().map(row => { const model = projectRow(row, share, recovery), pressure = calculateTuitionPressure(model, model.projectedChange, tuitionFeeChange); return { ...model, ...pressure, scenarioGap: pressure.annualTuitionPressure, scenarioGapPct: pressure.annualTuitionPressure / Math.max(1, model.currentUG * model.tuitionPerFTE) }; });
    const chartRows = rows.sort((a, b) => b.scenarioGap - a.scenarioGap).slice(0, 20);
    Plotly.react('finance-chart', [{ type: 'bar', orientation: 'h', name: 'Current undergraduate', y: chartRows.map(row => row.name).reverse(), x: chartRows.map(row => row.currentUG).reverse(), marker: { color: '#c7cfdd' }, customdata: chartRows.map(row => [row.blendedUG, row.projectedChange, row.annualTuitionPressure]).reverse(), hovertemplate: '<b>%{y}</b><br>Current undergraduate: %{x:,.0f}<br>Projected undergraduate: %{customdata[0]:,.0f}<br>Change: %{customdata[1]:.1%}<br>Annual tuition pressure: $%{customdata[2]:,.0f}<extra></extra>' }, { type: 'bar', orientation: 'h', name: 'Projected undergraduate', y: chartRows.map(row => row.name).reverse(), x: chartRows.map(row => row.blendedUG).reverse(), marker: { color: '#2f6fed' }, customdata: chartRows.map(row => [row.currentUG, row.projectedChange, row.annualTuitionPressure]).reverse(), hovertemplate: '<b>%{y}</b><br>Current undergraduate: %{customdata[0]:,.0f}<br>Projected undergraduate: %{x:,.0f}<br>Change: %{customdata[1]:.1%}<br>Annual tuition pressure: $%{customdata[2]:,.0f}<extra></extra>' }], { title: { text: 'Current undergraduate enrollment → projected undergraduate enrollment', x: .02 }, barmode: 'group', margin: { l: 230, r: 20, t: 55, b: 70 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: { family: 'DM Sans' }, xaxis: { title: { text: 'Undergraduate students' }, separatethousands: true, gridcolor: '#e5e8ef' }, yaxis: { automargin: true }, legend: { orientation: 'h', y: -0.2 } }, plotConfig());
    $('risk-table').innerHTML = rows.sort((a, b) => b.annualTuitionPressure - a.annualTuitionPressure).slice(0, 25).map(row => `<tr><td>${row.name}</td><td>${row.state}</td><td>${fmtPct(row.projectedChange)}</td><td>${fmtInt(row.studentsChange)}</td><td>${fmtMoney(row.annualTuitionPressure)}</td><td><span class="band">${pressureBand(row.projectedChange)}</span></td></tr>`).join('');
    $('share-out').textContent = `${(+ $('share-slider').value).toFixed(1)}%`;
    $('tuition-out').textContent = `${(+ $('tuition-slider').value).toFixed(1)}%`;
  }

  function install() {
    if (typeof DATA === 'undefined' || !DATA.institutions?.length || !DATA.state_shapes?.length || !$('finance-state')) return false;
    $('finance-state').innerHTML = '<option value="All">All states</option>' + listStates(DATA.institutions).map(code => `<option value="${code}">${code}</option>`).join('');
    refreshSearchLists();
    ['inst-year', 'inst-control', 'inst-scope'].forEach(id => $(id).addEventListener('change', () => { refreshSearchLists(); renderExposure(); renderFinance(); }));
    $('exposure-score').addEventListener('change', event => { state.exposurePressureBand = event.target.value; refreshSearchLists(); renderExposure(); });
    $('finance-exposure').addEventListener('change', event => { state.financePressureBand = event.target.value; renderFinance(); });
    ['share-slider', 'tuition-slider'].forEach(id => $(id).addEventListener('input', () => { renderFinance(); renderExposure(); }));
    ['international-recovery', 'institution-international-recovery'].forEach(id => $(id)?.addEventListener('change', () => { renderFinance(); renderExposure(); }));
    $('reset-institution-scenario').addEventListener('click', () => { $('share-slider').value = '0'; $('institution-international-recovery').value = 'normal'; renderFinance(); renderExposure(); });
    $('finance-state').addEventListener('change', event => { state.financeState = event.target.value; state.financeInstitutionId = ''; $('finance-institution').value = ''; refreshSearchLists(); renderFinance(); });
    $('finance-institution').addEventListener('change', event => { const row = DATA.institutions.find(item => item.name === event.target.value && (state.financeState === 'All' || item.state === state.financeState)); state.financeInstitutionId = row ? String(row.unitid) : ''; if (!row) event.target.value = ''; renderFinance(); });
    $('exposure-institution').addEventListener('change', event => { const row = exposureRows().find(item => item.name === event.target.value); state.exposureInstitutionId = row ? String(row.unitid) : ''; if (!row) event.target.value = ''; renderExposure(); });
    renderExposure();
    renderFinance();
    return true;
  }

  const wait = setInterval(() => { if (install()) clearInterval(wait); }, 50);
})();
