/* global Papa, DataTable, Plotly */
const CSV_PATH = 'pmi_roi_agg.csv';

let rawData = [];     // full CSV rows
let filtered = [];    // rows after sidebar filters
let dataTable = null;

// DOM helpers
const $ = id => document.getElementById(id);
const controls = {
  maxPrice: $('maxPrice'),
  area: $('area'),
  propertyType: $('propertyType'),
  project: $('project'),
  size: $('size')
};

// 1. Load CSV & bootstrap UI -----------------------------------
Papa.parse(CSV_PATH, {
  download: true,
  header: true,
  complete: res => {
    rawData = res.data.filter(r => r.project); // drop potential blank row
    rawData.forEach(r => {
      r.most_recent_buy = +String(r.most_recent_buy).replace(/,/g, '');
      r.ROI = +r.ROI;
    });

    buildSelectors();
    applyFilters();   // initial render
  }
});

// 2. Build sidebar multiselects -------------------------------
function buildSelectors () {
  // areas
  const areas = [...new Set(rawData.map(d => d.area_bucket))]
    .filter(Boolean)
    .sort((a, b) => +a.split('-')[0] - +b.split('-')[0]);
  areas.forEach(a => controls.area.add(new Option(a, a, false, true))); // preselect all

  // property types (default “Condominium”)
  const props = [...new Set(rawData.map(d => d.propertyType))].filter(Boolean).sort();
  props.forEach(p =>
    controls.propertyType.add(new Option(p, p, false, p === 'Condominium'))
  );

  // set sensible default for max price
  const prices = rawData.map(d => d.most_recent_buy);
  controls.maxPrice.value = Math.round(
    prices.sort((a, b) => a - b)[Math.floor(prices.length * 0.75)]
  );

  // listeners
  ['maxPrice', 'area', 'propertyType'].forEach(id =>
    controls[id].addEventListener('input', applyFilters)
  );
}

// 3. Filter data & update table / pickers ----------------------
function applyFilters () {
  const maxPrice = +controls.maxPrice.value || Infinity;
  const selAreas = [...controls.area.options].filter(o => o.selected).map(o => o.value);
  const selProps = [...controls.propertyType.options].filter(o => o.selected).map(o => o.value);

  filtered = rawData.filter(d =>
    d.most_recent_buy <= maxPrice &&
    selAreas.includes(d.area_bucket) &&
    selProps.includes(d.propertyType) &&
   d.ROI > 0                      // ➊ exclude zero-ROI rows
  );

  renderTable();
  rebuildProjectDropdown();
  clearChart(); // reset chart when filters change
}

function renderTable () {
  // Destroy old DataTable (if any)
  if (dataTable) dataTable.destroy();

  // Rebuild tbody
  const tbody = $('results').querySelector('tbody');
  tbody.innerHTML = filtered.map(row => `
    <tr>
      <td>${row.project}</td>
      <td>${row.district}</td>
      <td>${row.most_recent_buy.toLocaleString()}</td>
      <td>${row.ROI.toFixed(2)}</td>
      <td>${row.propertyType}</td>
    </tr>
  `).join('');

  // Init DataTable
  dataTable = new DataTable('#results', {
   paging: false,
    scrollY: 300,
    info: false,
    order: [[3, 'desc']]           // ➋ default sort by ROI (col 3)
 });
}

function rebuildProjectDropdown () {
  const projects = [...new Set(filtered.map(d => d.project))].sort();
  controls.project.innerHTML = '<option value="">— choose —</option>';
  projects.forEach(p => controls.project.add(new Option(p, p)));

  controls.project.onchange = rebuildSizeDropdown;
  controls.size.innerHTML = ''; // reset
}

function rebuildSizeDropdown () {
  const proj = controls.project.value;
  if (!proj) return;

  const sizes = [...new Set(filtered.filter(d => d.project === proj).map(d => d.area_bucket))];
  controls.size.innerHTML = '<option value="">— choose —</option>';
  sizes.forEach(s => controls.size.add(new Option(s, s)));

  controls.size.onchange = drawChart;
}

function clearChart () {
  Plotly.purge('chart');
  controls.project.value = '';
  controls.size.innerHTML = '';
}

// 4. Draw dual-axis chart -------------------------------------
function drawChart () {
  const proj = controls.project.value;
  const size = controls.size.value;
  if (!proj || !size) return;

  const row = filtered.find(d => d.project === proj && d.area_bucket === size);
  if (!row) return;

  const years = Array.from({ length: 6 }, (_, i) => 2020 + i);
  const buy = years.map(y => +row[`avg_buy_${y}`] || null);
  const rent = years.map(y => +row[`avg_rent_${y}`] || null);

  const traces = [
    {
      x: years, y: buy, name: 'Avg Buy (SGD)',
      mode: 'lines+markers', yaxis: 'y1'
    },
    {
      x: years, y: rent, name: 'Avg Rent (SGD)',
      mode: 'lines+markers', line: { color: 'red' }, yaxis: 'y2'
    }
  ];

  const layout = {
    title: `${proj} — ${size} sqm`,
    xaxis: { tickformat: 'd' },
    yaxis: { title: 'Buy (SGD)', tickformat: ',d' },
    yaxis2: {
      title: 'Rent (SGD)',
      tickformat: ',d',
      overlaying: 'y',
      side: 'right'
    },
    legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.2 },
    margin: { t: 60 }
  };

  Plotly.newPlot('chart', traces, layout, { responsive: true });
}
