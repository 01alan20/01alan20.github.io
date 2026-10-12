const data = window.ga4LiveSummary;

const fmtInt = new Intl.NumberFormat('en-US');
const fmtMoney = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const fmtPct = (n) => `${((n || 0) * 100).toFixed(1)}%`;
const fmtNumber = (n, digits = 1) => Number(n || 0).toFixed(digits);

const palette = {
  channel: ['#1d4ed8', '#7c3aed', '#db2777', '#ea580c', '#0f766e', '#64748b', '#0891b2', '#9333ea'],
  channelBars: ['#1d4ed8', '#6d28d9', '#be185d', '#c2410c', '#0f766e', '#475569', '#0891b2', '#7e22ce'],
  device: ['#0f766e', '#0284c7', '#8b5cf6'],
  geo: ['#1e3a8a', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bae6fd', '#dbeafe'],
  loyalty: ['#94a3b8', '#f59e0b', '#16a34a']
};

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function publicName(value) {
  const text = String(value || '').trim();
  if (!text) return 'this segment';
  if (text.toLowerCase().includes('data deleted')) return 'a redacted high-quality channel';
  if (text.includes('<Other>')) return 'other referral traffic';
  return text;
}

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

function largestFunnelDrop() {
  let maxDrop = -1;
  let step = '';
  for (let i = 1; i < data.funnel.length; i++) {
    const drop = 1 - (data.funnel[i].value / data.funnel[i - 1].value);
    if (drop > maxDrop) {
      maxDrop = drop;
      step = `${data.funnel[i - 1].step} to ${data.funnel[i].step}`;
    }
  }
  return { step, maxDrop };
}

function getAnalysis() {
  return data.optimization_analysis || {};
}

function productByQuadrant(quadrant) {
  return (getAnalysis().product_opportunity_matrix || []).find((row) => row.quadrant === quadrant);
}

function renderKpis() {
  const k = data.kpis;
  setText('kpi-sessions', fmtInt.format(k.sessions));
  setText('kpi-views', fmtInt.format(k.product_views));
  setText('kpi-cart', fmtInt.format(k.cart_events));
  setText('kpi-purchase', fmtInt.format(k.purchases));
  setText('kpi-revenue', fmtMoney.format(k.revenue));
  setText('kpi-aov', `$${k.aov.toFixed(2)}`);

  setText('kpi-sessions-foot', `${fmtInt.format(k.users)} users, ${k.days} days`);
  setText('kpi-views-foot', 'Product-detail views');
  setText('kpi-cart-foot', `${fmtPct(k.view_to_cart_rate)} view-to-cart`);
  setText('kpi-purchase-foot', `${fmtPct(k.session_to_purchase_rate)} of sessions`);
  setText('kpi-revenue-foot', 'Sample revenue');
  setText('kpi-aov-foot', 'Per purchase');
}

function renderNarrative() {
  const topChannel = data.channel.slice().sort((a, b) => b.revenue - a.revenue)[0];
  const worstStepDrop = largestFunnelDrop();

  setText('brief-title', `${fmtPct(data.kpis.session_to_purchase_rate)} session-to-purchase`);
  setText(
    'brief-copy',
    `${worstStepDrop.step} is the main leak. ${publicName(topChannel.name)} is the largest revenue source, so the next move is conversion work before broader traffic scaling.`
  );

  setText('insight-funnel', `${worstStepDrop.step} loses ${fmtPct(worstStepDrop.maxDrop)} of eligible sessions. Start with product-page clarity, offer confidence, and cart intent.`);
  setText('insight-channel', `${publicName(topChannel.name)} leads sample revenue. Compare channel quality before increasing spend, because volume and conversion quality are not the same question.`);
  setText('insight-product', 'Category performance separates two jobs: protect products that already convert, and improve pages that attract attention but underperform at purchase.');
  setText('insight-segment', 'Device and geography are useful checks, but the public sample does not justify overclaiming a single mobile or market problem.');
}

function renderSolutions() {
  const list = document.getElementById('solution-list');
  if (!list) return;

  const analysis = getAnalysis();
  const worstStepDrop = largestFunnelDrop();
  const topQualityChannel = (analysis.channel_quality_scorecard || [])[0] || {};
  const productToFix = productByQuadrant('Fix conversion') || (analysis.product_opportunity_matrix || [])[0] || {};
  const productToPromote = productByQuadrant('Increase visibility') || productToFix;

  const cards = [
    {
      title: 'Fix the product-page to cart decision',
      metric: `${worstStepDrop.step} loses ${fmtPct(worstStepDrop.maxDrop)} of sessions.`,
      body: 'Before buying more traffic, improve the moment where product interest fails to become cart intent. Review product detail content, shipping clarity, reviews, bundles, and offer confidence.'
    },
    {
      title: `Resolve the ${publicName(productToFix.name)} conversion gap`,
      metric: `${publicName(productToFix.name)} is marked for conversion work in the product matrix.`,
      body: 'Treat attention and purchase intent separately. High-attention categories that do not convert need page, price, assortment, or trust fixes before they get more placement.'
    },
    {
      title: 'Scale only after quality is protected',
      metric: `${publicName(topQualityChannel.name)} has the strongest channel quality score.`,
      body: `Use channel quality to decide where to test growth. If ${publicName(productToPromote.name)} already converts well, give it more visibility through homepage, email, or remarketing modules.`
    }
  ];

  list.innerHTML = cards.map((card) => `
    <article class="solution-card">
      <h3>${escapeHtml(card.title)}</h3>
      <p>${escapeHtml(card.body)}</p>
      <div class="card-metric">${escapeHtml(card.metric)}</div>
    </article>
  `).join('');
}

function renderExperimentCards() {
  const list = document.getElementById('experiment-card-list');
  if (!list) return;

  const worstStepDrop = largestFunnelDrop();
  const productToFix = productByQuadrant('Fix conversion') || {};
  const productToPromote = productByQuadrant('Increase visibility') || {};

  const cards = [
    {
      title: 'Product-page confidence test',
      body: `Change the product-detail experience at the ${worstStepDrop.step} step: clearer delivery expectations, stronger product proof, and a more visible add-to-cart path.`,
      metric: 'Primary metric: product view to add-to-cart rate.'
    },
    {
      title: 'Cart-friction test',
      body: 'Reduce uncertainty after cart add with clearer shipping, returns, payment reassurance, and checkout start prompts.',
      metric: 'Primary metric: add-to-cart to begin-checkout rate.'
    },
    {
      title: 'Merchandising visibility test',
      body: `${publicName(productToPromote.name || productToFix.name)} is the category to test for better placement or sharper offer framing.`,
      metric: 'Primary metric: category revenue per exposed session.'
    }
  ];

  list.innerHTML = cards.map((card, index) => `
    <article class="experiment-card">
      <div class="experiment-number">${index + 1}</div>
      <h3>${escapeHtml(card.title)}</h3>
      <p>${escapeHtml(card.body)}</p>
      <div class="card-metric">${escapeHtml(card.metric)}</div>
    </article>
  `).join('');
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

  const channelMax = Math.max(...data.channel.map((d) => d.conv), 0.01);
  Plotly.newPlot('chart-channel-conv', [{
    type: 'bar',
    x: data.channel.map((d) => d.name),
    y: data.channel.map((d) => d.conv),
    marker: { color: palette.channelBars },
    text: data.channel.map((d) => fmtPct(d.conv)),
    textposition: 'outside'
  }], { ...baseLayout(), yaxis: { tickformat: '.0%', range: [0, channelMax * 1.35] } }, { displayModeBar: false, responsive: true });

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

  const deviceMax = Math.max(...data.device.map((d) => d.conv), 0.01);
  Plotly.newPlot('chart-device', [{
    type: 'bar',
    x: data.device.map((d) => d.name),
    y: data.device.map((d) => d.conv),
    marker: { color: palette.device },
    text: data.device.map((d) => fmtPct(d.conv)),
    textposition: 'outside'
  }], { ...baseLayout(), yaxis: { tickformat: '.0%', range: [0, deviceMax * 1.45] } }, { displayModeBar: false, responsive: true });

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

function init() {
  if (!data) {
    throw new Error('GA4 live summary data was not loaded.');
  }
  initTabs();
  renderKpis();
  renderNarrative();
  renderSolutions();
  renderExperimentCards();
  renderCharts();
}

document.addEventListener('DOMContentLoaded', init);
