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
  
  renderRiskDrivers(rows);

  renderSummaryInsights(rows);
}

function renderRiskDrivers(rows) {
  const overallDropoutRate = div0(
    rows.filter((r) => num(r.actual_dropout_flag) === 1).length,
    rows.length
  );

  const drivers = [];
  const addDriver = (groupName, label, subset) => {
    if (!subset.length) return;
    const rate = div0(subset.filter((r) => num(r.actual_dropout_flag) === 1).length, subset.length);
    const delta = (rate - overallDropoutRate) * 100;
    drivers.push({
      label: `${groupName}: ${label} (n=${fmt(subset.length, 0)})`,
      delta
    });
  };

  [...new Set(rows.map((r) => r.enrollment_commitment_type).filter(Boolean))]
    .forEach((value) => addDriver('Commitment', value, rows.filter((r) => r.enrollment_commitment_type === value)));
  [...new Set(rows.map((r) => r.payment_plan_type).filter(Boolean))]
    .forEach((value) => addDriver('Payment', value, rows.filter((r) => r.payment_plan_type === value)));
  [...new Set(rows.map((r) => r.digital_access_type).filter(Boolean))]
    .forEach((value) => addDriver('Digital Access', value, rows.filter((r) => r.digital_access_type === value)));

  addDriver('Service Depth', '0-2 Services', rows.filter((r) => (num(r.engagement_services_count) || 0) <= 2));
  addDriver('Service Depth', '3-5 Services', rows.filter((r) => {
    const count = num(r.engagement_services_count) || 0;
    return count >= 3 && count <= 5;
  }));
  addDriver('Service Depth', '6-8 Services', rows.filter((r) => (num(r.engagement_services_count) || 0) >= 6));

  addDriver('Engagement Band', 'Low (<30)', rows.filter((r) => (num(r.engagement_index) || 0) < 30));
  addDriver('Engagement Band', 'Medium (30-59)', rows.filter((r) => {
    const value = num(r.engagement_index) || 0;
    return value >= 30 && value < 60;
  }));
  addDriver('Engagement Band', 'High (>=60)', rows.filter((r) => (num(r.engagement_index) || 0) >= 60));

  const ordered = drivers.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)).slice(0, 12);
  const colors = ordered.map((item) => (item.delta >= 0 ? '#dc2626' : '#16a34a'));
  plot('chart-risk-drivers', [
    {
      type: 'bar',
      orientation: 'h',
      x: ordered.map((item) => item.delta).reverse(),
      y: ordered.map((item) => item.label).reverse(),
      marker: { color: colors.reverse() },
      text: ordered.map((item) => `${item.delta >= 0 ? '+' : ''}${item.delta.toFixed(1)} pp`).reverse(),
      textposition: 'outside',
      hovertemplate: '<b>%{y}</b><br>Dropout delta vs overall: %{x:.1f} pp<extra></extra>'
    }
  ], {
    title: { text: 'Risk Driver Impact (Dropout Rate Delta vs Overall)', font: { size: 14, color: '#1f2937' } },
    xaxis: { title: 'Delta vs Overall Dropout Rate (percentage points)', zeroline: true, zerolinewidth: 2, zerolinecolor: '#9ca3af' },
    yaxis: { automargin: true }
  });
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

function assignRiskTheme(row, avgEngagement) {
  const services = num(row.engagement_services_count) || 0;
  const engagement = num(row.engagement_index) || 0;
  const isLowService = services <= 3;
  const hasEngagementGap = engagement < avgEngagement;
  const isPaymentFriction = row.payment_plan_type === 'Electronic check';
  const isOpenEnrollment = row.enrollment_commitment_type === 'Open enrollment';

  if (isLowService && hasEngagementGap) return 'Low Service Engagement';
  if (isPaymentFriction) return 'Payment Friction Profile';
  if (isOpenEnrollment) return 'Open Enrollment Exposure';
  if (hasEngagementGap) return 'Engagement Gap Profile';
  return 'Other Risk Pattern';
}

function themeRecommendation(theme) {
  if (theme === 'Low Service Engagement') return 'Assign advisor outreach + academic support nudges in week 1.';
  if (theme === 'Payment Friction Profile') return 'Offer billing counseling and auto-pay migration support.';
  if (theme === 'Open Enrollment Exposure') return 'Promote annual or multi-year commitment conversion path.';
  if (theme === 'Engagement Gap Profile') return 'Launch targeted engagement campaign and monitor weekly activity lift.';
  return 'Review case-by-case with student success team.';
}

function renderNoDataCard(id, message) {
  const element = document.getElementById(id);
  if (!element) return;
  element.innerHTML = `<ul><li>${message}</li></ul>`;
}

function renderUnderstandingRisk() {
  const rows = state.allRows;
  const avgEngagement = mean(values(rows, 'engagement_index')) || 0;
  const atRiskActive = rows.filter((r) => (num(r.attrition_risk_score) || 0) >= 50 && num(r.actual_dropout_flag) === 0);

  if (!atRiskActive.length) {
    plot('chart-risk-themes', [], {
      annotations: [{ text: 'No at-risk active students for the current data.', x: 0.5, y: 0.5, xref: 'paper', yref: 'paper', showarrow: false }],
      xaxis: { visible: false },
      yaxis: { visible: false }
    });
    const tbody = document.getElementById('risk-theme-table-body');
    if (tbody) tbody.innerHTML = `<tr><td colspan="6">No at-risk active students found.</td></tr>`;
    renderNoDataCard('campaign-aim', 'No campaign target identified for below-average engagement.');
    return;
  }

  const activeThemeRows = atRiskActive.map((row) => ({
    row,
    theme: assignRiskTheme(row, avgEngagement)
  }));

  const fullThemeRows = rows.map((row) => ({
    row,
    theme: assignRiskTheme(row, avgEngagement)
  }));

  const themes = [...new Set(activeThemeRows.map((item) => item.theme))];
  const summary = themes.map((theme) => {
    const activeSubset = activeThemeRows.filter((item) => item.theme === theme).map((item) => item.row);
    const benchmarkSubset = fullThemeRows.filter((item) => item.theme === theme).map((item) => item.row);
    const benchmarkDropout = div0(
      benchmarkSubset.filter((r) => num(r.actual_dropout_flag) === 1).length,
      benchmarkSubset.length
    );

    return {
      theme,
      count: activeSubset.length,
      pct: div0(activeSubset.length, atRiskActive.length),
      avgRisk: mean(activeSubset.map((r) => num(r.attrition_risk_score)).filter((v) => v !== null)),
      benchmarkDropout,
      recommendation: themeRecommendation(theme)
    };
  }).sort((a, b) => b.count - a.count);

  plot('chart-risk-themes', [
    {
      type: 'bar',
      x: summary.map((item) => item.theme),
      y: summary.map((item) => item.count),
      marker: { color: '#7c3aed' },
      text: summary.map((item) => `${fmt(item.count, 0)} (${pct(item.pct, 1)})`),
      textposition: 'outside',
      hovertemplate: '<b>%{x}</b><br>At-risk active students: %{y}<extra></extra>'
    }
  ], {
    title: { text: 'At-Risk Active Students by Main Risk Theme', font: { size: 14, color: '#1f2937' } },
    yaxis: { title: 'Students' },
    xaxis: { tickangle: -15 }
  });

  const tbody = document.getElementById('risk-theme-table-body');
  if (tbody) {
    tbody.innerHTML = summary.map((item) => `
      <tr>
        <td>${item.theme}</td>
        <td>${fmt(item.count, 0)}</td>
        <td>${pct(item.pct, 1)}</td>
        <td>${fmt(item.avgRisk, 1)}</td>
        <td>${pct(item.benchmarkDropout, 1)}</td>
        <td>${item.recommendation}</td>
      </tr>
    `).join('');
  }

  const belowAvgEngagement = rows.filter((r) => (num(r.engagement_index) || 0) < avgEngagement);
  const belowAvgRisk50 = belowAvgEngagement.filter((r) => (num(r.attrition_risk_score) || 0) >= 50).length;
  const campaignAim = document.getElementById('campaign-aim');
  if (campaignAim) {
    campaignAim.innerHTML = `<ul>
      <li><strong>Objective:</strong> Move below-average engagement students into higher engagement bands and lower risk bands.</li>
      <li><strong>Target cohort:</strong> ${fmt(belowAvgEngagement.length, 0)} students below average engagement, including ${fmt(belowAvgRisk50, 0)} with risk score 50+.</li>
      <li><strong>Channel plan:</strong> advisor touchpoints, academic-support nudges, and billing support routing for high-friction payment profiles.</li>
      <li><strong>Success metrics:</strong> +5 point engagement lift, 10% migration from 50+ risk into under-50 risk, and measurable retention improvement next term.</li>
    </ul>`;
  }
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
    renderUnderstandingRisk();
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
