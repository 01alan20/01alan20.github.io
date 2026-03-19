const state = {
  allRows: [],
  filteredRows: [],
  currentRiskBand: '',
  currentDropout: ''
};

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(Math.max(n, 0), 100) : null; // Clamp to 0-100
};

const fmt = (v, d = 2) =>
  v === null || v === undefined
    ? '-'
    : Number(v).toLocaleString(undefined, { maximumFractionDigits: d });

const pct = (v, d = 1) =>
  v === null || v === undefined ? '-' : `${(v * 100).toFixed(d)}%`;

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
const div0 = (numValue, denValue) => (denValue ? numValue / denValue : 0);

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
  const dropouts = rows.filter((r) => num(r.actual_dropout_flag) === 1);
  
  document.getElementById('kpi-students').textContent = fmt(rows.length, 0);
  document.getElementById('kpi-dropout').textContent = pct(dropouts.length / rows.length, 1);
  document.getElementById('kpi-engagement').textContent = fmt(mean(values(rows, 'engagement_index')), 1);
  document.getElementById('kpi-risk').textContent = fmt(mean(values(rows, 'attrition_risk_score')), 1);
}

function renderSummary() {
  const rows = state.allRows;
  
  // Engagement index distribution
  const engagement = values(rows, 'engagement_index');
  plot('chart-engagement-distribution', [
    {
      x: engagement,
      type: 'histogram',
      nbinsx: 20,
      marker: { color: '#7c3aed', opacity: 0.8 },
      name: 'Students'
    }
  ], {
    title: { text: 'Distribution of Engagement Index', font: { size: 14, color: '#1f2937' } },
    xaxis: { title: 'Engagement Index' },
    yaxis: { title: 'Count of Students' }
  });
  
  // Dropout by risk band
  const riskBands = [
    { range: '0-25 (Low)', min: 0, max: 25 },
    { range: '25-50 (Moderate)', min: 25, max: 50 },
    { range: '50-75 (High)', min: 50, max: 75 },
    { range: '75-100 (Critical)', min: 75, max: 100 }
  ];
  
  const bandData = riskBands.map((b) => {
    const bandRows = rows.filter((r) => {
      const risk = num(r.attrition_risk_score) || 0;
      return risk >= b.min && risk < b.max;
    });
    const dropouts = bandRows.filter((r) => num(r.actual_dropout_flag) === 1).length;
    return {
      band: b.range,
      rate: bandRows.length > 0 ? dropouts / bandRows.length : 0,
      count: bandRows.length
    };
  });
  
  plot('chart-dropout-by-risk', [
    {
      x: bandData.map((d) => d.band),
      y: bandData.map((d) => d.rate * 100),
      type: 'bar',
      marker: { color: '#7c3aed' },
      text: bandData.map((d) => `${d.count} students`),
      textposition: 'outside',
      name: 'Dropout Rate'
    }
  ], {
    title: { text: 'Dropout Rate by Risk Band', font: { size: 14, color: '#1f2937' } },
    yaxis: { title: 'Dropout Rate (%)' }
  });
  
  // Lifecycle vs engagement scatter
  const validRows = rows.filter((r) => num(r.student_lifecycle_months) !== null && num(r.engagement_index) !== null);
  plot('chart-lifecycle-engagement', [
    {
      x: validRows.map((r) => num(r.student_lifecycle_months)),
      y: validRows.map((r) => num(r.engagement_index)),
      mode: 'markers',
      marker: {
        size: 5,
        color: validRows.map((r) => num(r.attrition_risk_score)),
        colorscale: 'Viridis',
        showscale: true,
        colorbar: { title: 'Risk Score' }
      },
      text: validRows.map((r) => `${r.student_id}`),
      hovertemplate: 'Student: %{text}<br>Months: %{x:.0f}<br>Engagement: %{y:.1f}<extra></extra>',
      name: 'Student'
    }
  ], {
    title: { text: 'Student Lifecycle vs Engagement (colored by risk)', font: { size: 14, color: '#1f2937' } },
    xaxis: { title: 'Months as Student' },
    yaxis: { title: 'Engagement Index' }
  });

  renderSummaryInsights(rows);
}

function renderSummaryInsights(rows) {
  const total = rows.length;
  const dropoutCount = rows.filter((r) => num(r.actual_dropout_flag) === 1).length;
  const dropoutRate = div0(dropoutCount, total);

  const criticalRows = rows.filter((r) => (num(r.attrition_risk_score) || 0) >= 75);
  const criticalDropoutRate = div0(
    criticalRows.filter((r) => num(r.actual_dropout_flag) === 1).length,
    criticalRows.length
  );

  const lowRiskRows = rows.filter((r) => (num(r.attrition_risk_score) || 0) < 25);
  const lowRiskDropoutRate = div0(
    lowRiskRows.filter((r) => num(r.actual_dropout_flag) === 1).length,
    lowRiskRows.length
  );

  const commitmentStats = [...new Set(rows.map((r) => r.enrollment_commitment_type).filter(Boolean))]
    .map((label) => {
      const subset = rows.filter((r) => r.enrollment_commitment_type === label);
      return {
        label,
        count: subset.length,
        dropoutRate: div0(subset.filter((r) => num(r.actual_dropout_flag) === 1).length, subset.length)
      };
    })
    .sort((a, b) => b.dropoutRate - a.dropoutRate);

  const paymentStats = [...new Set(rows.map((r) => r.payment_plan_type).filter(Boolean))]
    .map((label) => {
      const subset = rows.filter((r) => r.payment_plan_type === label);
      return {
        label,
        count: subset.length,
        dropoutRate: div0(subset.filter((r) => num(r.actual_dropout_flag) === 1).length, subset.length)
      };
    })
    .sort((a, b) => b.dropoutRate - a.dropoutRate);

  const atRiskActive = rows.filter((r) => (num(r.attrition_risk_score) || 0) >= 50 && num(r.actual_dropout_flag) === 0);
  const avgEngagement = mean(values(rows, 'engagement_index')) || 0;
  const belowAvgEngagement = rows.filter((r) => (num(r.engagement_index) || 0) < avgEngagement);

  const strongestCommitment = commitmentStats[commitmentStats.length - 1];
  const weakestCommitment = commitmentStats[0];
  const strongestPayment = paymentStats[paymentStats.length - 1];
  const weakestPayment = paymentStats[0];

  const keyInsights = [
    `Dropout is ${pct(dropoutRate, 1)} overall (${fmt(dropoutCount, 0)} of ${fmt(total, 0)} students).`,
    `Risk stratification is strong: critical-risk dropout is ${pct(criticalDropoutRate, 1)} vs low-risk at ${pct(lowRiskDropoutRate, 1)}.`,
    weakestCommitment && strongestCommitment
      ? `Commitment matters: ${weakestCommitment.label} has the highest dropout at ${pct(weakestCommitment.dropoutRate, 1)}, while ${strongestCommitment.label} is lowest at ${pct(strongestCommitment.dropoutRate, 1)}.`
      : 'Commitment segmentation is unavailable in the current data.',
    weakestPayment && strongestPayment
      ? `Payment pattern spread is material: ${weakestPayment.label} dropout is ${pct(weakestPayment.dropoutRate, 1)} vs ${strongestPayment.label} at ${pct(strongestPayment.dropoutRate, 1)}.`
      : 'Payment method segmentation is unavailable in the current data.'
  ];

  const nextSteps = [
    `Launch a priority intervention list for ${fmt(atRiskActive.length, 0)} at-risk active students (${pct(div0(atRiskActive.length, total), 1)} of population).`,
    `Run an engagement campaign for students below average engagement (${fmt(belowAvgEngagement.length, 0)} students).`,
    weakestCommitment
      ? `Design a conversion path from ${weakestCommitment.label} into longer commitments to lower retention risk.`
      : 'Promote longer-term commitment options to improve retention stability.',
    weakestPayment
      ? `Target ${weakestPayment.label} users with payment support and auto-pay migration prompts.`
      : 'Reduce billing friction at renewal and payment touchpoints.'
  ];

  const keyContainer = document.getElementById('summary-key-insights');
  const nextContainer = document.getElementById('summary-next-steps');
  if (!keyContainer || !nextContainer) return;

  keyContainer.innerHTML = `<ul>${keyInsights.map((item) => `<li>${item}</li>`).join('')}</ul>`;
  nextContainer.innerHTML = `<ul>${nextSteps.map((item) => `<li>${item}</li>`).join('')}</ul>`;
}

function renderRisk() {
  const rows = state.allRows;
  
  // Risk distribution
  const riskScores = values(rows, 'attrition_risk_score');
  plot('chart-risk-distribution', [
    {
      x: riskScores,
      type: 'histogram',
      nbinsx: 10,
      marker: { color: '#a78bfa', opacity: 0.8 },
      name: 'Students'
    }
  ], {
    title: { text: 'Distribution of Attrition Risk Score', font: { size: 14, color: '#1f2937' } },
    xaxis: { title: 'Risk Score (0-100)', range: [0, 100] },
    yaxis: { title: 'Count of Students' }
  });
  
  // Risk vs actual dropout
  const riskBands = {};
  rows.forEach((r) => {
    let risk = num(r.attrition_risk_score);
    if (risk >= 100) risk = 90; // Bucket 100 into 90-100 range
    risk = Math.floor(risk / 10) * 10;
    const band = `${risk}-${risk + 10}`;
    if (!riskBands[band]) riskBands[band] = { actual: 0, total: 0 };
    riskBands[band].total++;
    if (num(r.actual_dropout_flag) === 1) riskBands[band].actual++;
  });
  
  const bands = Object.keys(riskBands).sort((a, b) => num(a.split('-')[0]) - num(b.split('-')[0]));
  plot('chart-risk-dropout-correlation', [
    {
      x: bands,
      y: bands.map((b) => riskBands[b].actual / riskBands[b].total * 100),
      type: 'scatter',
      mode: 'lines+markers',
      marker: { size: 10, color: '#7c3aed' },
      line: { color: '#7c3aed', width: 3 },
      name: 'Actual Dropout %'
    }
  ], {
    title: { text: 'Predicted Risk vs Actual Dropout', font: { size: 14, color: '#1f2937' } },
    xaxis: { title: 'Risk Score Band' },
    yaxis: { title: 'Actual Dropout Rate (%)' }
  });
  
  // Risk by service count
  const serviceByRisk = {};
  rows.forEach((r) => {
    let risk = num(r.attrition_risk_score);
    if (risk >= 100) risk = 80; // Bucket 100 into 80-100 range
    risk = Math.floor(risk / 20) * 20;
    const band = `${risk}-${risk + 20}`;
    if (!serviceByRisk[band]) serviceByRisk[band] = [];
    serviceByRisk[band].push(num(r.engagement_services_count));
  });
  
  const riskBands2 = Object.keys(serviceByRisk).sort((a, b) => num(a.split('-')[0]) - num(b.split('-')[0]));
  plot('chart-risk-service-usage', [
    {
      x: riskBands2,
      y: riskBands2.map((b) => mean(serviceByRisk[b])),
      type: 'bar',
      marker: { color: '#c084fc' },
      name: 'Avg Services Used'
    }
  ], {
    title: { text: 'Average Service Usage by Risk Band', font: { size: 14, color: '#1f2937' } },
    yaxis: { title: 'Average Services Used' }
  });
}

function renderServices() {
  const rows = state.allRows;
  
  // Service adoption rates
  const services = ['academic_support_flag', 'study_resources_flag', 'device_readiness_flag', 'advising_support_flag', 'co_curricular_content_flag', 'career_content_flag'];
  const labels = ['Academic Support', 'Study Resources', 'Device Readiness', 'Advising Support', 'Co-Curricular', 'Career Content'];
  
  const adoptionRates = services.map((svc) => {
    const adopted = rows.filter((r) => num(r[svc]) === 1).length;
    return (adopted / rows.length) * 100;
  });
  
  plot('chart-service-adoption', [
    {
      x: labels,
      y: adoptionRates,
      type: 'bar',
      marker: { color: '#7c3aed' },
      text: adoptionRates.map((r) => r.toFixed(1) + '%'),
      textposition: 'outside',
      name: 'Adoption Rate'
    }
  ], {
    title: { text: 'Service Adoption Rates', font: { size: 14, color: '#1f2937' } },
    yaxis: { title: 'Adoption Rate (%)' }
  });
  
  // Engagement index vs dropout
  const engagementBands = {};
  rows.forEach((r) => {
    const eng = Math.floor(num(r.engagement_index) / 10) * 10;
    const band = `${eng}-${eng + 10}`;
    if (!engagementBands[band]) engagementBands[band] = { dropouts: 0, total: 0 };
    engagementBands[band].total++;
    if (num(r.actual_dropout_flag) === 1) engagementBands[band].dropouts++;
  });
  
  const engBands = Object.keys(engagementBands).sort((a, b) => num(a.split('-')[0]) - num(b.split('-')[0]));
  plot('chart-engagement-vs-dropout', [
    {
      x: engBands,
      y: engBands.map((b) => engagementBands[b].dropouts / engagementBands[b].total * 100),
      type: 'scatter',
      mode: 'lines+markers',
      marker: { size: 8, color: '#a78bfa' },
      line: { color: '#a78bfa', width: 2 },
      name: 'Dropout Rate'
    }
  ], {
    title: { text: 'Engagement Level vs Dropout Risk', font: { size: 14, color: '#1f2937' } },
    xaxis: { title: 'Engagement Index Band' },
    yaxis: { title: 'Dropout Rate (%)' }
  });
  
  // Service count distribution
  const serviceCounts = values(rows, 'engagement_services_count');
  plot('chart-service-count-distribution', [
    {
      x: serviceCounts,
      type: 'histogram',
      nbinsx: 8,
      marker: { color: '#06b6d4', opacity: 0.8 },
      name: 'Students'
    }
  ], {
    title: { text: 'Distribution of Services Used per Student', font: { size: 14, color: '#1f2937' } },
    xaxis: { title: 'Count of Services' },
    yaxis: { title: 'Number of Students' }
  });
}

function renderBilling() {
  const rows = state.allRows;
  
  // Commitment type vs dropout
  const commitments = [...new Set(rows.map((r) => r.enrollment_commitment_type))].filter((c) => c);
  const commitmentData = commitments.map((c) => {
    const cRows = rows.filter((r) => r.enrollment_commitment_type === c);
    const dropouts = cRows.filter((r) => num(r.actual_dropout_flag) === 1).length;
    return {
      type: c,
      rate: (dropouts / cRows.length) * 100,
      count: cRows.length
    };
  });
  
  plot('chart-commitment-dropout', [
    {
      x: commitmentData.map((d) => d.type),
      y: commitmentData.map((d) => d.rate),
      type: 'bar',
      marker: { color: '#7c3aed' },
      text: commitmentData.map((d) => `n=${d.count}`),
      textposition: 'outside',
      name: 'Dropout Rate'
    }
  ], {
    title: { text: 'Dropout Rate by Commitment Type', font: { size: 14, color: '#1f2937' } },
    yaxis: { title: 'Dropout Rate (%)' }
  });
  
  // Payment method vs dropout
  const payMethods = [...new Set(rows.map((r) => r.payment_plan_type))].filter((p) => p);
  const paymentData = payMethods.map((p) => {
    const pRows = rows.filter((r) => r.payment_plan_type === p);
    const dropouts = pRows.filter((r) => num(r.actual_dropout_flag) === 1).length;
    return {
      type: p,
      rate: (dropouts / pRows.length) * 100,
      count: pRows.length
    };
  });
  
  plot('chart-payment-method-dropout', [
    {
      x: paymentData.map((d) => d.type),
      y: paymentData.map((d) => d.rate),
      type: 'bar',
      marker: { color: '#a78bfa' },
      text: paymentData.map((d) => `n=${d.count}`),
      textposition: 'outside',
      name: 'Dropout Rate'
    }
  ], {
    title: { text: 'Dropout Rate by Payment Method', font: { size: 14, color: '#1f2937' } },
    yaxis: { title: 'Dropout Rate (%)' }
  });
  
  // Monthly bill vs engagement
  const validRows = rows.filter((r) => num(r.monthly_student_bill) !== null && num(r.engagement_index) !== null);
  plot('chart-bill-vs-engagement', [
    {
      x: validRows.map((r) => num(r.monthly_student_bill)),
      y: validRows.map((r) => num(r.engagement_index)),
      mode: 'markers',
      marker: {
        size: 5,
        color: validRows.map((r) => num(r.attrition_risk_score)),
        colorscale: 'Viridis',
        showscale: true,
        colorbar: { title: 'Risk' }
      },
      hovertemplate: 'Bill: $%{x:.2f}<br>Engagement: %{y:.1f}<extra></extra>',
      name: 'Student'
    }
  ], {
    title: { text: 'Monthly Bill vs Engagement Index', font: { size: 14, color: '#1f2937' } },
    xaxis: { title: 'Monthly Bill ($)' },
    yaxis: { title: 'Engagement Index' }
  });
}

function renderDrilldown() {
  const rows = state.filteredRows.length > 0 ? state.filteredRows : state.allRows;
  
  // Summary by risk band
  const riskBandCounts = {};
  rows.forEach((r) => {
    const risk = Math.floor(num(r.attrition_risk_score) / 25) * 25;
    const band = `${risk}-${Math.min(risk + 25, 100)}`;
    if (!riskBandCounts[band]) riskBandCounts[band] = 0;
    riskBandCounts[band]++;
  });
  
  const bands = Object.keys(riskBandCounts).sort((a, b) => num(a.split('-')[0]) - num(b.split('-')[0]));
  plot('chart-segment-summary', [
    {
      x: bands,
      y: bands.map((b) => riskBandCounts[b]),
      type: 'bar',
      marker: { color: '#7c3aed' },
      name: 'Count'
    }
  ], {
    title: { text: 'Students by Risk Band', font: { size: 14, color: '#1f2937' } },
    yaxis: { title: 'Number of Students' }
  });
  
  // High-risk insights
  const highRiskRows = rows.filter((r) => num(r.attrition_risk_score) >= 75);
  const lowRiskRows = rows.filter((r) => num(r.attrition_risk_score) < 25);
  
  const highRiskInsight = document.getElementById('insight-high-risk');
  highRiskInsight.innerHTML = `<ul style="margin: 0; padding-left: 1.25rem; line-height: 1.8;">
    <li>Count: ${highRiskRows.length}</li>
    <li>Dropout Rate: ${pct(highRiskRows.filter((r) => num(r.actual_dropout_flag) === 1).length / highRiskRows.length)}</li>
    <li>Avg Engagement: ${fmt(mean(values(highRiskRows, 'engagement_index')), 1)}</li>
    <li>Avg Services: ${fmt(mean(values(highRiskRows, 'engagement_services_count')), 1)}</li>
    <li>Avg Bill: $${fmt(mean(values(highRiskRows, 'monthly_student_bill')), 2)}</li>
  </ul>`;
  
  const lowRiskInsight = document.getElementById('insight-low-risk');
  lowRiskInsight.innerHTML = `<ul style="margin: 0; padding-left: 1.25rem; line-height: 1.8;">
    <li>Count: ${lowRiskRows.length}</li>
    <li>Dropout Rate: ${pct(lowRiskRows.filter((r) => num(r.actual_dropout_flag) === 1).length / lowRiskRows.length)}</li>
    <li>Avg Engagement: ${fmt(mean(values(lowRiskRows, 'engagement_index')), 1)}</li>
    <li>Avg Services: ${fmt(mean(values(lowRiskRows, 'engagement_services_count')), 1)}</li>
    <li>Avg Bill: $${fmt(mean(values(lowRiskRows, 'monthly_student_bill')), 2)}</li>
  </ul>`;
  
  // Intervention opportunities
  const atRiskActive = rows.filter((r) => num(r.attrition_risk_score) >= 50 && num(r.actual_dropout_flag) === 0);
  const lowEngagement = rows.filter((r) => num(r.engagement_index) < mean(values(rows, 'engagement_index')));
  
  const interventionInsight = document.getElementById('insight-intervention');
  interventionInsight.innerHTML = `<ul style="margin: 0; padding-left: 1.25rem; line-height: 1.8;">
    <li>At-risk but active: ${atRiskActive.length} students (${pct(atRiskActive.length / rows.length)})</li>
    <li>Below-avg engagement: ${lowEngagement.length} students (${pct(lowEngagement.length / rows.length)})</li>
    <li>No engagement service: ${rows.filter((r) => num(r.engagement_services_count) === 0).length} students</li>
    <li>Open enrollment: ${rows.filter((r) => r.enrollment_commitment_type === 'Open enrollment').length} students</li>
  </ul>`;
}

function applyFilters() {
  const riskBand = document.getElementById('risk-band-select').value;
  const dropoutStatus = document.getElementById('dropout-select').value;
  
  state.filteredRows = state.allRows.filter((r) => {
    let matchRisk = true;
    if (riskBand) {
      const risk = num(r.attrition_risk_score) || 0;
      if (riskBand === 'low') matchRisk = risk < 25;
      else if (riskBand === 'moderate') matchRisk = risk >= 25 && risk < 50;
      else if (riskBand === 'high') matchRisk = risk >= 50 && risk < 75;
      else if (riskBand === 'critical') matchRisk = risk >= 75;
    }
    
    let matchDropout = true;
    if (dropoutStatus) {
      const dropout = num(r.actual_dropout_flag);
      if (dropoutStatus === 'active') matchDropout = dropout === 0;
      else if (dropoutStatus === 'dropout') matchDropout = dropout === 1;
    }
    
    return matchRisk && matchDropout;
  });
  
  renderDrilldown();
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
    
    const res = await fetch('./data/student_crm_engagement_translated.csv');
    if (!res.ok) throw new Error('Could not fetch student data.');
    
    const csv = await res.text();
    const parsed = Papa.parse(csv, { header: true });
    state.allRows = parsed.data.filter((r) => r.student_id && !r.student_id.startsWith('CRM-00000'));
    
    if (!state.allRows.length) throw new Error('No data rows found.');
    
    updateKPIs();
    renderSummary();
    renderRisk();
    renderServices();
    renderBilling();
    renderDrilldown();
    wireTabs();
    
    document.getElementById('risk-band-select').addEventListener('change', applyFilters);
    document.getElementById('dropout-select').addEventListener('change', applyFilters);
  } catch (e) {
    console.error('Init error:', e);
    alert('Error loading dashboard: ' + e.message);
  }
}

init();
