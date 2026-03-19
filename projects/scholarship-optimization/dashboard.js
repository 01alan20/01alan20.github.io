const state = {
  data: null,
  currentView: 'enrollment'
};

const fmt = (v) => {
  if (v === null || v === undefined) return '-';
  if (v > 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v > 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${Math.round(v).toLocaleString()}`;
};

const pct = (v) => {
  if (v === null || v === undefined) return '-';
  return `${(v).toFixed(1)}%`;
};

function baseLayout() {
  return {
    font: { family: 'sans-serif', size: 12, color: '#4b5563' },
    plot_bgcolor: '#fafafa',
    paper_bgcolor: 'white',
    margin: { l: 70, r: 40, t: 30, b: 50 },
    hovermode: 'x unified',
    showlegend: true,
    legend: { x: 0.01, y: 0.99, bgcolor: 'rgba(255, 255, 255, 0.8)', bordercolor: '#e5e7eb', borderwidth: 1 }
  };
}

function plot(divId, data, layout) {
  const fullLayout = { ...baseLayout(), ...layout };
  Plotly.newPlot(divId, data, fullLayout, { responsive: true });
}

function updateKPIs() {
  if (!state.data || state.data.length === 0) return;
  
  const baseline = state.data[0];
  const optimal = state.data.reduce((best, row) => {
    // Optimal = maximizes enrollment gain while keeping revenue impact < 1.5%
    if (row.revenue_change_pct > -1.5 && row.enrollment_change > best.enrollment_change) {
      return row;
    }
    return best;
  });
  
  document.getElementById('kpi-baseline-enroll').textContent = Math.round(baseline.total_enrollments).toLocaleString();
  document.getElementById('kpi-baseline-revenue').textContent = fmt(baseline.total_revenue);
  document.getElementById('kpi-optimal-amount').textContent = `$${Math.round(optimal.scholarship_amount).toLocaleString()}`;
  document.getElementById('kpi-students-reached').textContent = Math.round(optimal.students_receiving_aid).toLocaleString();
}

function renderTradeoff() {
  if (!state.data) return;
  
  const data = [
    // Enrollments (primary axis)
    {
      x: state.data.map(r => r.scholarship_amount),
      y: state.data.map(r => r.enrollment_change),
      name: 'Enrollment Gain',
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#3b82f6', width: 3 },
      marker: { size: 8 },
      yaxis: 'y1',
      hovertemplate: 'Aid: $%{x:,.0f}<br>Enrollment Gain: %{y:.0f} students<extra></extra>'
    },
    // Revenue (secondary axis)
    {
      x: state.data.map(r => r.scholarship_amount),
      y: state.data.map(r => r.revenue_change_pct),
      name: 'Revenue Change %',
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#ef4444', width: 3 },
      marker: { size: 8 },
      yaxis: 'y2',
      hovertemplate: 'Aid: $%{x:,.0f}<br>Revenue Impact: %{y:.2f}%<extra></extra>'
    }
  ];
  
  plot('chart-tradeoff', data, {
    title: { text: 'Core Trade-off: How Much Enrollment Growth for Revenue Cost?', font: { size: 14, color: '#1f2937' } },
    xaxis: { title: 'Scholarship per Recipient ($)', tickformat: '$,.0f' },
    yaxis: { title: 'Additional Enrollments', titlefont: { color: '#3b82f6' }, tickfont: { color: '#3b82f6' } },
    yaxis2: { title: 'Revenue Change (%)', titlefont: { color: '#ef4444' }, tickfont: { color: '#ef4444' }, overlaying: 'y', side: 'right' },
    height: 500
  });
}

function renderROI() {
  if (!state.data) return;
  
  // Cost per additional enrollment
  const costPerEnroll = state.data.map((r, i) => {
    if (i === 0) return null; // No aid = undefined
    const aidBudget = r.total_scholarships_spent;
    const gain = r.enrollment_change;
    return gain > 0 ? aidBudget / gain : null;
  });
  
  // Left chart: Cost per enrollment
  plot('chart-cost-per-enroll', [
    {
      x: state.data.map(r => r.scholarship_amount),
      y: costPerEnroll,
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#10b981', width: 3 },
      marker: { size: 8 },
      fill: 'tozeroy',
      fillcolor: 'rgba(16, 185, 129, 0.1)',
      hovertemplate: 'Award Size: $%{x:,.0f}<br>Cost per Student: $%{y:,.0f}<extra></extra>'
    }
  ], {
    title: { text: 'How Much You Spend to Attract One Student', font: { size: 14, color: '#1f2937' } },
    xaxis: { title: 'Scholarship per Recipient ($)', tickformat: '$,.0f' },
    yaxis: { title: 'Cost per Additional Enrollment ($)', tickformat: '$,.0f' },
    height: 400
  });
  
  // Right chart: Aid penetration
  plot('chart-aid-penetration', [
    {
      x: state.data.map(r => r.scholarship_amount),
      y: state.data.map(r => (r.students_receiving_aid / 5000) * 100),
      type: 'bar',
      marker: { color: '#8b5cf6', opacity: 0.8 },
      text: state.data.map(r => `${Math.round(r.students_receiving_aid)} students`),
      textposition: 'auto',
      hovertemplate: 'Award: $%{x:,.0f}<br>Market Penetration: %{y:.1f}%<extra></extra>'
    }
  ], {
    title: { text: 'Aid Market Penetration (% of Cohort Served)', font: { size: 14, color: '#1f2937' } },
    xaxis: { title: 'Scholarship per Recipient ($)', tickformat: '$,.0f' },
    yaxis: { title: '% of 5,000-Student Cohort' },
    height: 400
  });
}

function renderScenarios() {
  const tbody = document.getElementById('scenarios-tbody');
  tbody.innerHTML = '';
  
  state.data.forEach(row => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid #e5e7eb';
    tr.innerHTML = `
      <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: 600;">$${Math.round(row.scholarship_amount).toLocaleString()}</td>
      <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: right;">${Math.round(row.total_enrollments).toLocaleString()}</td>
      <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: right; color: ${row.enrollment_change > 0 ? '#059669' : '#9ca3af'};">+${Math.round(row.enrollment_change)}</td>
      <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${fmt(row.total_revenue)}</td>
      <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: right; color: ${row.revenue_change_pct < -0.5 ? '#dc2626' : '#f59e0b'};">${pct(row.revenue_change_pct)}</td>
      <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: right;">${fmt(row.total_scholarships_spent)}</td>
      <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: right;">${Math.round(row.students_receiving_aid).toLocaleString()}</td>
    `;
    tbody.appendChild(tr);
  });
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
    if (!window.Plotly) throw new Error('Plotly not loaded.');
    if (!window.Papa) throw new Error('Papa Parse not loaded.');
    
    const res = await fetch('./data/scholarship_optimization_summary_v2.csv');
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    
    const csv = await res.text();
    const parsed = Papa.parse(csv, { header: true, dynamicTyping: true });
    
    // Validate data
    if (!parsed.data || parsed.data.length === 0) {
      throw new Error('No data rows found in CSV.');
    }
    
    // Filter valid rows
    state.data = parsed.data.filter(row => 
      row.scholarship_amount !== undefined && 
      row.scholarship_amount !== null &&
      Number.isFinite(row.total_enrollments)
    );
    
    if (state.data.length === 0) {
      throw new Error('All rows were filtered out. Check CSV format.');
    }
    
    console.log(`Loaded ${state.data.length} scenarios`);
    
    updateKPIs();
    renderTradeoff();
    renderROI();
    renderScenarios();
    wireTabs();
    
  } catch (e) {
    console.error('Init error:', e);
    alert('Error loading dashboard: ' + e.message);
    document.body.innerHTML += `<div style="padding: 40px; color: red;"><h2>Error</h2><p>${e.message}</p></div>`;
  }
}

document.addEventListener('DOMContentLoaded', init);
