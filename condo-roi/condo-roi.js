/* global Papa, Plotly */

const CSV_PATH = 'pmi_roi_agg.csv';
let data = [];                // full dataset
let filtered = [];            // after sidebar filters

// DOM shortcuts
const $ = id => document.getElementById(id);
const controls = {
  maxPrice: $('maxPrice'),
  area: $('area'),
  propertyType: $('propertyType'),
  project: $('project'),
  size: $('size')
};

// 1️⃣ Load CSV then bootstrap UI
Papa.parse(CSV_PATH, {
  download: true,
  header: true,
  complete: res => {
    // numeric casting
    data = res.data.filter(row => row.project).map(r => ({
      ...r,
      most_recent_buy: +r.most_recent_buy.replace(/,/g, ''),
      ROI: +r.ROI
    }));
    buildSelectors();
    applyFilters();           // initial render
  }
});

// 2️⃣ Build multiselects
function buildSelectors () {
  // Areas
  const areas = [...new Set(data.map(d => d.area_bucket))].sort(
    (a, b) => +a.split('-')[0] - +b.split('-')[0]
  );
  areas.forEach(a => controls.area.add(new Option(a, a, false, true))); // pre-select all

  // Property types (default 'Condominium')
  const props = [...new Set(data.map(d => d.propertyType))].sort();
  props.forEach(p => {
    const opt = new Option(p, p, false, p === 'Condominium');
    controls.propertyType.add(opt);
  });

  // listen
  Object.values(controls).forEach(el => el.addEventListener('input', applyFilters));
}

// 3️⃣ Apply sidebar filters & refresh dropdowns / chart
function applyFilters () {
  const price = +controls.maxPrice.value || Infinity;
  const areas = [...controls.area.options].filter(o => o.selected).map(o => o.value);
  const props = [...controls.propertyType.options].filter(o => o.selected).map(o => o.value);

  filtered = data.filter(d =>
    d.most_recent_buy <= price &&
    areas.includes(d.area_bucket) &&
    props.includes(d.propertyType)
  );

  // ---- project dropdown ----
  const projects = [...new Set(filtered.map(d => d.project))].sort();
  controls.project.innerHTML = '<option value="">— choose —</option>';
  projects.forEach(p => controls.project.add(new Option(p, p)));
  controls.project.onchange = refreshSizes;

  // trigger chart reset
  Plotly.purge('chart');
}

function refreshSizes () {
  const proj = controls.project.value;
  const sizes = [...new Set(filtered.filter(d => d.project === proj).map(d => d.area_bucket))];
  controls.size.innerHTML = '';
  sizes.forEach(s => controls.size.add(new Option(s, s)));
  controls.size.onchange = drawChart;
}

function drawChart () {
  if (!controls.size.value) return;

  const row = filtered.find(
    d => d.project === controls.project.value && d.area_bucket === controls.size.value
  );
  if (!row) return;

  // collect series
  const years = Array.from({ length: 6 }, (_, i) => 2020 + i);
  const buy = years.map(y => +row[`avg_buy_${y}`] || null);
  const rent = years.map(y => +row[`avg_rent_${y}`] || null);

  const traces = [
    {
      x: years, y: buy, name: 'Avg Buy (SGD)', mode: 'lines+markers',
      yaxis: 'y1'
    },
    {
      x: years, y: rent, name: 'Avg Rent (SGD)', mode: 'lines+markers',
      yaxis: 'y2', line: { color: 'red' }
    }
  ];

  const layout = {
    title: `${row.project} — ${row.area_bucket} sqm`,
    xaxis: { tickformat: 'd' },
    yaxis: { title: 'Buy (SGD)', tickformat: ',d' },
    yaxis2: {
      title: 'Rent (SGD)',
      tickformat: ',d',
      overlaying: 'y',
      side: 'right'
    },
    legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.2 }
  };

  Plotly.newPlot('chart', traces, layout, { responsive: true });
}
