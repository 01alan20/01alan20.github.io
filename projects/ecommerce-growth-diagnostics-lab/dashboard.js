const data = {
  kpis: {
    sessions: 128430,
    views: 61240,
    cart: 16210,
    purchases: 6240,
    revenue: 417380,
    aov: 66.89
  },
  funnel: [
    { step: 'Session', value: 128430 },
    { step: 'View Item', value: 61240 },
    { step: 'Add to Cart', value: 16210 },
    { step: 'Begin Checkout', value: 9820 },
    { step: 'Purchase', value: 6240 }
  ],
  channel: [
    { name: 'Organic Search', sessions: 40220, conv: 0.058, revenue: 143600 },
    { name: 'Direct', sessions: 33410, conv: 0.064, revenue: 132800 },
    { name: 'Paid Search', sessions: 24500, conv: 0.041, revenue: 76200 },
    { name: 'Referral', sessions: 18400, conv: 0.053, revenue: 49600 },
    { name: 'Email', sessions: 11900, conv: 0.072, revenue: 15200 }
  ],
  categories: [
    { name: 'Apparel', revenue: 122400, viewToPurchase: 0.092 },
    { name: 'Accessories', revenue: 96400, viewToPurchase: 0.081 },
    { name: 'Drinkware', revenue: 74120, viewToPurchase: 0.076 },
    { name: 'Office', revenue: 61480, viewToPurchase: 0.062 },
    { name: 'Lifestyle', revenue: 52980, viewToPurchase: 0.055 }
  ],
  pareto: [18.2, 33.4, 45.9, 56.1, 64.6, 71.3, 76.8, 81.1, 84.9, 88.6, 91.4, 93.8, 95.6, 97.1, 98.3, 99.2, 99.7, 100.0],
  device: [
    { name: 'Desktop', conv: 0.067 },
    { name: 'Mobile', conv: 0.039 },
    { name: 'Tablet', conv: 0.051 }
  ],
  geo: [
    { country: 'United States', revenue: 173400 },
    { country: 'India', revenue: 42600 },
    { country: 'United Kingdom', revenue: 37200 },
    { country: 'Canada', revenue: 31500 },
    { country: 'Germany', revenue: 24800 }
  ],
  loyalty: [
    { segment: 'No Purchase', users: 56200 },
    { segment: 'One-Time Buyer', users: 4830 },
    { segment: 'Repeat Buyer', users: 1410 }
  ]
};

const fmtInt = new Intl.NumberFormat('en-US');
const fmtMoney = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const fmtPct = (n) => `${(n * 100).toFixed(1)}%`;

const palette = {
  channel: ['#1d4ed8', '#7c3aed', '#db2777', '#ea580c', '#0f766e'],
  channelBars: ['#1d4ed8', '#6d28d9', '#be185d', '#c2410c', '#0f766e'],
  device: ['#0f766e', '#0284c7', '#8b5cf6'],
  geo: ['#1e3a8a', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa'],
  loyalty: ['#94a3b8', '#f59e0b', '#16a34a']
};

function setText(id, value) { document.getElementById(id).textContent = value; }

function initTabs() {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      document.querySelector(`.tab-pane[data-tab="${btn.dataset.tab}"]`).classList.add('active');
      window.dispatchEvent(new Event('resize'));
    });
  });
}

function renderKpis() {
  const k = data.kpis;
  setText('kpi-sessions', fmtInt.format(k.sessions));
  setText('kpi-views', fmtInt.format(k.views));
  setText('kpi-cart', fmtInt.format(k.cart));
  setText('kpi-purchase', fmtInt.format(k.purchases));
  setText('kpi-revenue', fmtMoney.format(k.revenue));
  setText('kpi-aov', `$${k.aov.toFixed(2)}`);

  setText('kpi-sessions-foot', 'Top of funnel traffic volume');
  setText('kpi-views-foot', `${fmtPct(k.views / k.sessions)} of sessions reached product pages`);
  setText('kpi-cart-foot', `${fmtPct(k.cart / k.views)} view-to-cart rate`);
  setText('kpi-purchase-foot', `${fmtPct(k.purchases / k.sessions)} session-to-purchase rate`);
  setText('kpi-revenue-foot', 'Estimated total purchase revenue');
  setText('kpi-aov-foot', 'Revenue per purchase event');
}

function baseLayout() {
  return {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: '#ffffff',
    margin: { l: 44, r: 18, t: 8, b: 44 },
    font: { family: 'Fira Sans, sans-serif', color: '#1e293b', size: 12 }
  };
}

function renderCharts() {
  Plotly.newPlot('chart-funnel', [{
    type: 'funnel',
    y: data.funnel.map((d) => d.step),
    x: data.funnel.map((d) => d.value),
    marker: { color: ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'] }
  }], { ...baseLayout() }, { displayModeBar: false, responsive: true });

  const steps = data.funnel.slice(1);
  const retention = steps.map((d, i) => d.value / data.funnel[i].value);
  Plotly.newPlot('chart-leakage', [{
    type: 'bar',
    x: steps.map((d) => d.step),
    y: retention,
    marker: { color: ['#f59e0b', '#fb923c', '#f97316', '#ea580c'] },
    text: retention.map(fmtPct),
    textposition: 'outside'
  }], { ...baseLayout(), yaxis: { tickformat: '.0%', range: [0, 1] } }, { displayModeBar: false, responsive: true });

  Plotly.newPlot('chart-channel-conv', [{
    type: 'bar',
    x: data.channel.map((d) => d.name),
    y: data.channel.map((d) => d.conv),
    marker: { color: palette.channelBars },
    text: data.channel.map((d) => fmtPct(d.conv)),
    textposition: 'outside'
  }], { ...baseLayout(), yaxis: { tickformat: '.0%', range: [0, 0.09] } }, { displayModeBar: false, responsive: true });

  Plotly.newPlot('chart-channel-revenue', [{
    type: 'pie',
    labels: data.channel.map((d) => d.name),
    values: data.channel.map((d) => d.revenue),
    hole: 0.48,
    marker: { colors: palette.channel }
  }], { ...baseLayout(), margin: { l: 8, r: 8, t: 8, b: 8 } }, { displayModeBar: false, responsive: true });

  Plotly.newPlot('chart-category', [{
    type: 'bar',
    y: data.categories.map((d) => d.name),
    x: data.categories.map((d) => d.revenue),
    orientation: 'h',
    marker: { color: '#0ea5e9' }
  }], { ...baseLayout(), xaxis: { tickprefix: '$', separatethousands: true } }, { displayModeBar: false, responsive: true });

  Plotly.newPlot('chart-pareto', [
    {
      type: 'scatter',
      mode: 'lines+markers',
      x: data.pareto.map((_, i) => i + 1),
      y: data.pareto,
      line: { color: '#f97316', width: 3 }
    },
    {
      type: 'scatter',
      mode: 'lines',
      x: [1, data.pareto.length],
      y: [80, 80],
      line: { color: '#64748b', width: 1, dash: 'dot' }
    }
  ], {
    ...baseLayout(),
    xaxis: { title: 'Top Products Ranked by Revenue' },
    yaxis: { title: 'Cumulative Revenue Share', ticksuffix: '%', range: [0, 100] }
  }, { displayModeBar: false, responsive: true });

  Plotly.newPlot('chart-device', [{
    type: 'bar',
    x: data.device.map((d) => d.name),
    y: data.device.map((d) => d.conv),
    marker: { color: palette.device },
    text: data.device.map((d) => fmtPct(d.conv)),
    textposition: 'outside'
  }], { ...baseLayout(), yaxis: { tickformat: '.0%', range: [0, 0.08] } }, { displayModeBar: false, responsive: true });

  Plotly.newPlot('chart-geo', [{
    type: 'bar',
    x: data.geo.map((d) => d.country),
    y: data.geo.map((d) => d.revenue),
    marker: { color: palette.geo }
  }], { ...baseLayout(), yaxis: { tickprefix: '$', separatethousands: true } }, { displayModeBar: false, responsive: true });

  Plotly.newPlot('chart-loyalty', [{
    type: 'pie',
    labels: data.loyalty.map((d) => d.segment),
    values: data.loyalty.map((d) => d.users),
    marker: { colors: palette.loyalty }
  }], { ...baseLayout(), margin: { l: 8, r: 8, t: 8, b: 8 } }, { displayModeBar: false, responsive: true });
}

function renderNarrative() {
  const topChannel = data.channel.slice().sort((a, b) => b.revenue - a.revenue)[0];
  const worstStepDrop = (() => {
    let maxDrop = -1;
    let step = '';
    for (let i = 1; i < data.funnel.length; i++) {
      const drop = 1 - (data.funnel[i].value / data.funnel[i - 1].value);
      if (drop > maxDrop) { maxDrop = drop; step = `${data.funnel[i - 1].step} -> ${data.funnel[i].step}`; }
    }
    return { step, maxDrop };
  })();

  setText('brief-title', `${fmtPct(data.kpis.purchases / data.kpis.sessions)} Session-to-Purchase Conversion`);
  setText('brief-copy', `${topChannel.name} currently contributes the highest revenue share. The biggest funnel leakage is at ${worstStepDrop.step}.`);

  setText('insight-funnel', `The largest revenue leakage occurs from ${worstStepDrop.step} (${fmtPct(worstStepDrop.maxDrop)} drop). Prioritize checkout UX clarity and cart persistence before scaling paid traffic.`);
  setText('insight-channel', `${topChannel.name} is your strongest revenue channel. Email shows the best conversion rate but lower volume, making it a high-efficiency candidate for lifecycle expansion.`);
  setText('insight-product', 'Top categories drive a disproportionate share of revenue. Bundle high-converting accessories with top apparel SKUs and test category-level remarketing sequences.');
  setText('insight-segment', 'Mobile conversion trails desktop meaningfully. Prioritize mobile PDP speed and checkout form simplification while expanding repeat-buyer programs in top countries.');
}

function init() {
  initTabs();
  renderKpis();
  renderCharts();
  renderNarrative();
}

document.addEventListener('DOMContentLoaded', init);
