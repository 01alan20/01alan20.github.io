// Global state
let flowData = [];
let currentYear = 2023;
let selectedCountry = "";
let flowDirection = "inbound";
let allCountries = new Map(); // country_code -> country_name
let isoToCoords = {};

// Country coordinates (centroids) - expanded list covering ~200 countries
const countryCoordinates = {
  AFG: [67.71, 33.94], ALA: [19.95, 60.11], ALB: [20.17, 41.15], DZA: [2.63, 56.16],
  ASM: [-170.56, -13.76], AND: [1.58, 42.55], AGO: [17.87, -11.20], AIA: [-63.07, 18.22],
  ATA: [0, -90], ATG: [-61.79, 17.07], ARG: [-63.62, -38.42], ARM: [45.04, 40.07],
  ABW: [-69.96, 12.18], AUS: [133.78, -25.29], AUT: [14.55, 47.52], AZE: [47.58, 40.14],
  BHS: [-76.80, 24.21], BHR: [50.55, 26.07], BGD: [90.36, 23.68], BRB: [-59.54, 13.19],
  BLR: [27.95, 53.71], BEL: [4.48, 50.50], BLZ: [-88.75, 17.19], BEN: [2.32, 9.31],
  BMU: [-64.77, 32.29], BTN: [90.43, 27.51], BOL: [-63.59, -16.29], BIH: [17.68, 43.92],
  BWA: [24.68, -22.33], BVT: [3.40, -54.42], BRA: [-51.93, -14.24], BRN: [114.73, 4.55],
  BGR: [25.49, 42.73], BFA: [-1.56, 12.24], BDI: [29.92, -3.37], KHM: [104.99, 12.57],
  CMR: [12.35, 3.85], CAN: [-95.71, 56.13], CPV: [-23.64, 16.04], CYM: [-81.37, 19.29],
  CAF: [20.94, 6.61], TCD: [19.00, 15.47], CHL: [-71.54, -35.68], CHN: [104.20, 35.86],
  CXR: [105.69, -10.50], CCK: [96.82, -12.16], COL: [-74.30, 4.57], COM: [43.33, -11.88],
  COG: [21.76, -4.04], COD: [23.67, -4.04], CRI: [-83.75, 9.75], HRV: [15.20, 45.10],
  CUB: [-77.78, 21.52], CYP: [33.43, 34.92], CZE: [15.47, 49.82], DNK: [9.50, 56.26],
  DJI: [42.60, 11.30], DMA: [-61.37, 15.42], DOM: [-70.16, 18.74], ECU: [-78.18, -1.83],
  EGY: [30.80, 26.82], SLV: [-88.90, 13.79], GNQ: [10.27, 1.65], ERI: [39.15, 15.18],
  EST: [25.75, 58.60], ETH: [40.49, 9.15], FLK: [-59.52, -51.75], FRO: [-6.97, 61.89],
  FJI: [177.97, -17.71], FIN: [25.75, 61.92], FRA: [2.21, 46.23], GUF: [-53.13, 3.93],
  PYF: [-149.41, -17.68], ATF: [69.35, -49.28], GAB: [11.61, -0.80], GMB: [-15.31, 13.45],
  GEO: [43.36, 42.32], DEU: [10.45, 51.17], GHA: [-2.04, 7.37], GIB: [-5.35, 36.14],
  GRC: [21.82, 39.07], GRL: [-42.60, 71.71], GRD: [-61.61, 12.12], GLP: [-61.55, 16.27],
  GUM: [144.79, 13.44], GTM: [-90.25, 15.50], GGY: [-2.13, 49.46], GIN: [-10.27, 9.95],
  GNB: [-15.00, 11.80], GUY: [-58.93, 4.86], HTI: [-72.29, 18.97], HMD: [69.35, -54.63],
  VAT: [12.45, 41.90], HND: [-86.24, 15.20], HKG: [114.11, 22.40], HUN: [19.50, 47.16],
  ISL: [-19.02, 64.96], IND: [78.97, 20.59], IDN: [113.92, -2.17], IRN: [53.69, 32.43],
  IRQ: [44.36, 33.31], IRL: [-8.24, 53.41], IMN: [-4.55, 54.24], ISR: [34.85, 31.05],
  ITA: [12.57, 41.87], CIV: [-5.55, 7.54], JAM: [-77.30, 18.11], JPN: [138.25, 36.20],
  JEY: [-2.10, 49.18], JOR: [35.93, 30.59], KAZ: [66.92, 48.02], KEN: [37.91, -0.02],
  KIR: [-157.50, 1.35], PRK: [127.11, 40.34], KOR: [127.77, 35.91], KWT: [47.48, 29.31],
  KGZ: [74.77, 41.71], LAO: [104.87, 19.86], LVA: [24.60, 56.88], LBN: [35.86, 33.85],
  LSO: [28.61, -29.61], LBR: [-9.43, 6.43], LBY: [17.20, 26.34], LIE: [9.56, 47.17],
  LTU: [23.88, 55.17], LUX: [6.13, 49.82], MAC: [113.54, 22.20], MDG: [46.87, -18.73],
  MWI: [34.30, -13.25], MYS: [101.69, 4.21], MDV: [73.51, 4.18], MLI: [-3.99, 17.57],
  MLT: [14.58, 35.94], MHL: [171.18, 7.11], MTQ: [-61.02, 14.64], MRT: [-12.00, 21.01],
  MUS: [57.55, -20.35], MAY: [55.54, -21.23], MEX: [-102.55, 23.63], FSM: [151.86, 6.92],
  MDA: [28.37, 47.41], MCO: [7.41, 43.74], MNG: [103.85, 46.86], MNE: [19.37, 42.71],
  MAR: [-5.00, 31.79], MOZ: [35.30, -18.67], MMR: [95.96, 21.91], NAM: [17.08, -22.56],
  NRU: [166.93, -0.52], NPL: [84.12, 28.39], NLD: [5.29, 52.13], NCL: [165.62, -21.21],
  NZL: [174.89, -40.90], NIC: [-85.21, 12.87], NER: [2.13, 17.61], NGA: [8.68, 9.08],
  NIU: [-169.87, -19.05], NFK: [167.95, -29.04], MNP: [145.79, 15.10], NOR: [8.47, 60.47],
  OMN: [55.92, 21.51], PAK: [69.35, 30.84], PLW: [134.64, 7.34], PSE: [35.20, 31.95],
  PAN: [-80.44, 8.68], PNG: [147.18, -6.32], PRY: [-56.17, -23.67], PER: [-75.73, -9.19],
  PHL: [121.77, 12.88], PCN: [-130.10, -24.70], POL: [19.15, 51.92], PRT: [-8.22, 39.40],
  PRI: [-66.59, 18.22], QAT: [51.20, 25.35], ROU: [24.97, 45.94], RUS: [105.32, 61.52],
  RWA: [29.87, -1.95], SHN: [-5.71, -15.95], KNA: [-62.65, 17.36], LCA: [-61.17, 13.91],
  VCT: [-61.19, 12.98], WSM: [-172.11, -13.77], SMR: [12.46, 43.94], STP: [7.42, 0.02],
  SAU: [45.00, 23.89], SEN: [-14.50, 14.50], SRB: [21.01, 44.02], SYC: [55.49, -4.68],
  SLE: [-11.78, 8.46], SGP: [103.82, 1.35], SVK: [19.70, 48.67], SVN: [14.55, 46.15],
  SLB: [160.20, -9.65], SOM: [46.20, 5.00], ZAF: [24.88, -30.56], SSD: [31.31, 6.88],
  ESP: [-3.75, 40.46], LKA: [80.77, 7.87], SDN: [30.81, 12.86], SUR: [-56.03, 3.92],
  SJM: [8.47, 60.47], SWZ: [31.47, -26.52], SWE: [18.64, 60.13], CHE: [8.23, 46.82],
  SYR: [38.20, 34.92], TWN: [120.96, 23.70], TJK: [71.28, 38.86], TZA: [34.89, -6.37],
  THA: [100.99, 15.87], TLS: [124.19, -8.87], TGO: [1.17, 6.61], TKL: [-172.00, -9.20],
  TON: [-175.20, -21.18], TTO: [-61.22, 10.69], TUN: [9.52, 33.89], TUR: [35.24, 38.96],
  TKM: [59.56, 38.97], TCA: [-71.98, 21.95], TUV: [179.20, -8.52], UGA: [32.29, 1.37],
  UKR: [31.27, 48.38], ARE: [53.85, 23.42], GBR: [-3.44, 55.38], USA: [-95.71, 37.09],
  URY: [-55.77, -32.52], UZB: [64.59, 41.38], VUT: [167.84, -17.74], VEN: [-66.59, 6.42],
  VNM: [105.80, 20.96], VGB: [-64.60, 18.45], VIR: [-64.90, 18.34], WLF: [-176.17, -13.28],
  ESH: [-13.20, 24.22], YEM: [48.52, 15.55], ZMB: [28.29, -13.13], ZWE: [29.15, -19.02],
  // Additional 3-letter codes that might be in the data
  HKG: [114.11, 22.40],
};

// Initialize dashboard
document.addEventListener("DOMContentLoaded", async () => {
  const url = "data/flows_2015_2023_clean.csv";
  
  try {
    const response = await fetch(url);
    if (response.ok) {
      const csvText = await response.text();
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          flowData = results.data;
          processData();
          initializeDashboard();
        },
        error: (error) => {
          console.error("PapaParse error:", error);
        }
      });
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
});

function processData() {
  const countrySet = new Set();
  
  flowData.forEach(row => {
    if (row.origin_iso3 && row.destination_iso3) {
      countrySet.add(row.origin_iso3);
      countrySet.add(row.destination_iso3);
      
      allCountries.set(row.origin_iso3, row.origin_name);
      allCountries.set(row.destination_iso3, row.destination_name);
    }
  });
}

// Get filtered data
function getFilteredData() {
  return flowData.filter((d) => {
    if (selectedCountry !== "ALL") {
      if (flowDirection === "inbound") {
        return d.destIso === selectedCountry && d.year === currentYear;
      } else {
        return d.origIso === selectedCountry && d.year === currentYear;
      }
    }
    return d.year === currentYear;
  });
}

// Update all visualizations
function updateAllVisualizations() {
  updateFlowMap();
  updateStats();
  updateFlowsTable();
  updateActiveFiltersDisplay();
  updateTopCountriesCharts();
  updateTrendsChart();
  updateCovidComparison();
}

// Update world map with directional arrows using curved paths
function updateFlowMap() {
  // Filter flows based on selected country
  let filteredFlows;
  let mapTitle;
  let centerCoords = null;
  let zoomLevel = 1;
  
  if (selectedCountry !== "ALL") {
    const countryName = isoToName[selectedCountry] || selectedCountry;
    centerCoords = countryCoordinates[selectedCountry];
    
    if (flowDirection === "inbound") {
      // Show flows coming INTO selected country
      filteredFlows = flowData.filter(d => 
        d.year === currentYear && d.students > 0 && d.destIso === selectedCountry
      );
      mapTitle = `Students Coming to ${countryName} (${currentYear})`;
      zoomLevel = 2; // Zoom in more
    } else {
      // Show flows going OUT OF selected country
      filteredFlows = flowData.filter(d => 
        d.year === currentYear && d.students > 0 && d.origIso === selectedCountry
      );
      mapTitle = `Students Leaving ${countryName} (${currentYear})`;
      zoomLevel = 2;
    }
  } else {
    // Show all flows
    filteredFlows = flowData.filter(d => d.year === currentYear && d.students > 0);
    mapTitle = `International Student Mobility Flows - ${currentYear}`;
    zoomLevel = 1;
  }
  
  // Sort and limit flows
  const topFlows = filteredFlows.sort((a, b) => b.students - a.students).slice(0, 150);

  const traces = [];
  const maxStudents = Math.max(...(topFlows.length > 0 ? topFlows.map(f => f.students) : [1]));

  // Add curved flow arrows with directional indicators
  topFlows.forEach((flow) => {
    const origCoords = countryCoordinates[flow.origIso];
    const destCoords = countryCoordinates[flow.destIso];
    
    if (!origCoords || !destCoords) return;

    const originLon = origCoords[0];
    const originLat = origCoords[1];
    const destLon = destCoords[0];
    const destLat = destCoords[1];
    
    // Create curved path
    const midLon = (originLon + destLon) / 2;
    const midLat = (originLat + destLat) / 2;
    const curveFactor = 0.3;
    const curvedMidLon = midLon + (originLat - destLat) * curveFactor;
    const curvedMidLat = midLat + (destLon - originLon) * curveFactor;
    
    const opacity = 0.25 + (flow.students / maxStudents) * 0.75;
    const width = 1 + (flow.students / maxStudents) * 4;

    const trace = {
      type: "scattergeo",
      mode: "lines+markers",
      lon: [originLon, curvedMidLon, destLon],
      lat: [originLat, curvedMidLat, destLat],
      line: {
        width: width,
        color: `rgba(102, 126, 234, ${opacity})`,
      },
      marker: {
        size: [0, 0, width * 2.5],
        color: `rgba(102, 126, 234, ${opacity})`,
        symbol: "triangle-up",
        angleref: "previous",
      },
      hovertemplate: `<b>${flow.origName}</b> → <b>${flow.destName}</b><br>Students: ${flow.students.toLocaleString()}<extra></extra>`,
      showlegend: false,
    };
    traces.push(trace);
  });

  // Add country markers
  const countrySet = new Set();
  const markerLons = [];
  const markerLats = [];
  const markerText = [];
  const markerColors = [];
  const markerSizes = [];
  
  topFlows.forEach((flow) => {
    // Origin marker
    if (!countrySet.has(flow.origIso) && countryCoordinates[flow.origIso]) {
      countrySet.add(flow.origIso);
      const coords = countryCoordinates[flow.origIso];
      markerLons.push(coords[0]);
      markerLats.push(coords[1]);
      markerText.push(flow.origName);
      // Highlight selected country
      if (flow.origIso === selectedCountry) {
        markerColors.push("rgba(220, 38, 38, 0.9)"); // Red for selected
        markerSizes.push(12);
      } else {
        markerColors.push("rgba(102, 126, 234, 0.8)");
        markerSizes.push(6);
      }
    }
    
    // Destination marker
    if (!countrySet.has(flow.destIso) && countryCoordinates[flow.destIso]) {
      countrySet.add(flow.destIso);
      const coords = countryCoordinates[flow.destIso];
      markerLons.push(coords[0]);
      markerLats.push(coords[1]);
      markerText.push(flow.destName);
      // Highlight selected country
      if (flow.destIso === selectedCountry) {
        markerColors.push("rgba(220, 38, 38, 0.9)"); // Red for selected
        markerSizes.push(12);
      } else {
        markerColors.push("rgba(102, 126, 234, 0.8)");
        markerSizes.push(6);
      }
    }
  });

  if (markerLons.length > 0) {
    traces.push({
      type: "scattergeo",
      mode: "markers",
      lon: markerLons,
      lat: markerLats,
      text: markerText,
      hovertemplate: "%{text}<extra></extra>",
      marker: {
        size: markerSizes,
        color: markerColors,
        line: { width: 1.5, color: "white" },
      },
      showlegend: false,
    });
  }

  // Build geo layout with optional center/zoom
  const geoConfig = {
    scope: "world",
    projection: { type: "natural earth" },
    showland: true,
    landcolor: "#f5f5f5",
    coastcolor: "#ccc",
    countrywidth: 0.5,
    countrycolor: "#e0e0e0",
    showocean: true,
    oceancolor: "#f0f8ff",
    showcountries: true,
  };
  
  // If a specific country is selected, center and zoom
  if (centerCoords) {
    geoConfig.center = { lon: centerCoords[0], lat: centerCoords[1] };
    geoConfig.projection = { type: "natural earth", scale: zoomLevel * 150 };
  }

  const layout = {
    title: mapTitle,
    geo: geoConfig,
    height: 600,
    margin: { l: 0, r: 0, t: 40, b: 0 },
    hovermode: "closest",
  };

  Plotly.newPlot("worldMap", traces, layout, { responsive: true });
}

// Update statistics
function updateStats() {
  const filtered = getFilteredData();
  const totalStudents = filtered.reduce((sum, d) => sum + d.students, 0);

  let topSource = "N/A";
  let topSourceCount = 0;
  let topDest = "N/A";
  let topDestCount = 0;

  if (selectedCountry === "ALL") {
    // Global view
    const sources = {};
    const dests = {};
    filtered.forEach((d) => {
      sources[d.origName] = (sources[d.origName] || 0) + d.students;
      dests[d.destName] = (dests[d.destName] || 0) + d.students;
    });
    const topSourceEntry = Object.entries(sources).sort((a, b) => b[1] - a[1])[0];
    const topDestEntry = Object.entries(dests).sort((a, b) => b[1] - a[1])[0];

    if (topSourceEntry) {
      topSource = topSourceEntry[0];
      topSourceCount = topSourceEntry[1];
    }
    if (topDestEntry) {
      topDest = topDestEntry[0];
      topDestCount = topDestEntry[1];
    }
  } else {
    // Country-specific view
    if (flowDirection === "inbound") {
      const topFlow = filtered.sort((a, b) => b.students - a.students)[0];
      if (topFlow) {
        topSource = topFlow.origName;
        topSourceCount = topFlow.students;
      }
      topDest = selectedCountry;
    } else {
      const topFlow = filtered.sort((a, b) => b.students - a.students)[0];
      if (topFlow) {
        topDest = topFlow.destName;
        topDestCount = topFlow.students;
      }
      topSource = selectedCountry;
    }
  }

  document.getElementById("topSource").textContent = topSource;
  document.getElementById("topSourceCount").textContent =
    topSourceCount > 0 ? `${topSourceCount.toLocaleString()} students` : "0 students";
  document.getElementById("topDest").textContent = topDest;
  document.getElementById("topDestCount").textContent =
    topDestCount > 0 ? `${topDestCount.toLocaleString()} students` : "0 students";
  document.getElementById("totalStudents").textContent = totalStudents.toLocaleString();
  document.getElementById("corridorCount").textContent = filtered.length;
}

// Update flows table
function updateFlowsTable() {
  const filtered = getFilteredData().sort((a, b) => b.students - a.students);
  const totalStudents = filtered.reduce((sum, d) => sum + d.students, 0);

  // Update title dynamically
  let title = "Student Mobility Corridors";
  let subtitle = "All flows for selected year and direction.";

  if (selectedCountry !== "ALL") {
    const countryName = isoToName[selectedCountry] || selectedCountry;
    if (flowDirection === "inbound") {
      title = `Countries Sending Students TO ${countryName}`;
      subtitle = `Showing all flows into ${countryName} (${currentYear})`;
    } else {
      title = `Countries WHERE ${countryName} Students Go`;
      subtitle = `Showing where ${countryName} students study (${currentYear})`;
    }
  }

  document.getElementById("tableTitleDynamic").textContent = title;
  document.getElementById("tableSubtitle").textContent = subtitle;

  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: #999;">No flows found.</td></tr>`;
    return;
  }

  filtered.forEach((flow, idx) => {
    const percent = totalStudents > 0 ? ((flow.students / totalStudents) * 100).toFixed(2) : "0.00";
    const row = `
      <tr>
        <td class="rank">${idx + 1}</td>
        <td class="flow-country" onclick="selectCountry('${flow.origIso}')">${flow.origName}</td>
        <td class="flow-arrow">to</td>
        <td class="flow-country" onclick="selectCountry('${flow.destIso}')">${flow.destName}</td>
        <td class="flow-count">${flow.students.toLocaleString()}</td>
        <td class="flow-percent">${percent}%</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// Filter table
function filterTable(e) {
  const searchTerm = e.target.value.toLowerCase();
  const rows = document.querySelectorAll("#tableBody tr");
  rows.forEach((row) => {
    row.style.display = row.textContent.toLowerCase().includes(searchTerm) ? "" : "none";
  });
}

// Select country
function selectCountry(countryIso) {
  document.getElementById("countrySelect").value = countryIso;
  selectedCountry = countryIso;
  updateAllVisualizations();
}

// Update active filters
function updateActiveFiltersDisplay() {
  const filtersContainer = document.getElementById("activeFilters");
  if (selectedCountry === "ALL") {
    filtersContainer.style.display = "none";
  } else {
    filtersContainer.style.display = "block";
    const name = isoToName[selectedCountry] || selectedCountry;
    const directionText = flowDirection === "inbound" ? `Incoming to ${name}` : `Outgoing from ${name}`;
    document.getElementById("filterText").textContent = `${directionText} (${currentYear})`;
  }
}

// Clear filters
function clearFilters() {
  document.getElementById("countrySelect").value = "ALL";
  selectedCountry = "ALL";
  updateAllVisualizations();
}

// Switch tabs
function switchTab(tabName) {
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.getElementById(`${tabName}-tab`).classList.add("active");
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");
  
  // Load comparison table data when Compare Years tab is opened
  if (tabName === "compare-years") {
    updateComparisonTable();
  }
}

// Update top countries charts
function updateTopCountriesCharts() {
  const allYearData = flowData.filter((d) => d.year === currentYear);

  // Top sources
  const sources = {};
  allYearData.forEach((d) => {
    sources[d.origName] = (sources[d.origName] || 0) + d.students;
  });
  const topSources = Object.entries(sources)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .reverse();

  Plotly.newPlot(
    "topSourcesChart",
    [{
      x: topSources.map((s) => s[1]),
      y: topSources.map((s) => s[0]),
      type: "bar",
      orientation: "h",
      marker: { color: "rgba(102, 126, 234, 0.7)" },
    }],
    { margin: { l: 150, r: 20, t: 20, b: 20 }, xaxis: { title: "Students" }, showlegend: false },
    { responsive: true }
  );

  // Top destinations
  const destinations = {};
  allYearData.forEach((d) => {
    destinations[d.destName] = (destinations[d.destName] || 0) + d.students;
  });
  const topDests = Object.entries(destinations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .reverse();

  Plotly.newPlot(
    "topDestsChart",
    [{
      x: topDests.map((d) => d[1]),
      y: topDests.map((d) => d[0]),
      type: "bar",
      orientation: "h",
      marker: { color: "rgba(118, 75, 162, 0.7)" },
    }],
    { margin: { l: 150, r: 20, t: 20, b: 20 }, xaxis: { title: "Students" }, showlegend: false },
    { responsive: true }
  );
}

// Update trends chart
function updateTrendsChart() {
  const yearTotals = {};
  flowData.forEach((d) => {
    if (!yearTotals[d.year]) yearTotals[d.year] = 0;
    yearTotals[d.year] += d.students;
  });

  const years = Object.keys(yearTotals)
    .map(Number)
    .sort((a, b) => a - b);
  const totals = years.map((y) => yearTotals[y]);

  Plotly.newPlot(
    "trendsChart",
    [{
      x: years,
      y: totals,
      type: "scatter",
      mode: "lines+markers",
      fill: "tozeroy",
      line: { color: "rgba(102, 126, 234, 0.8)", width: 3 },
      marker: { size: 8 },
    }],
    { title: "Global Student Flow Trends", xaxis: { title: "Year" }, yaxis: { title: "Total Students" }, showlegend: false },
    { responsive: true }
  );
}

// Update COVID comparison
function updateCovidComparison() {
  const data2019 = flowData.filter((d) => d.year === 2019).reduce((sum, d) => sum + d.students, 0);
  const data2023 = flowData.filter((d) => d.year === 2023).reduce((sum, d) => sum + d.students, 0);

  Plotly.newPlot(
    "covidComparisonChart",
    [{
      x: ["2019", "2023"],
      y: [data2019, data2023],
      type: "bar",
      marker: { color: ["rgba(102, 126, 234, 0.7)", "rgba(118, 75, 162, 0.7)"] },
    }],
    { title: "Pre-COVID vs Post-COVID", yaxis: { title: "Total Students" }, showlegend: false },
    { responsive: true }
  );

  // YoY change
  const yearTotals = {};
  flowData.forEach((d) => {
    if (!yearTotals[d.year]) yearTotals[d.year] = 0;
    yearTotals[d.year] += d.students;
  });

  const years = Object.keys(yearTotals).map(Number).sort((a, b) => a - b);
  const changes = [];
  for (let i = 1; i < years.length; i++) {
    const yoy = ((yearTotals[years[i]] - yearTotals[years[i - 1]]) / yearTotals[years[i - 1]]) * 100;
    changes.push(yoy);
  }

  Plotly.newPlot(
    "yoyChangeChart",
    [{
      x: years.slice(1),
      y: changes,
      type: "bar",
      marker: { color: changes.map((c) => (c >= 0 ? "rgba(76, 175, 80, 0.7)" : "rgba(244, 67, 54, 0.7)")) },
    }],
    { title: "Year-over-Year Change", yaxis: { title: "% Change" }, showlegend: false },
    { responsive: true }
  );
}

// Update comparison table
function updateComparisonTable() {
  const year1 = parseInt(document.getElementById("compareYear1").value);
  const year2 = parseInt(document.getElementById("compareYear2").value);

  const data1 = flowData.filter((d) => d.year === year1);
  const data2 = flowData.filter((d) => d.year === year2);

  const flows1 = {};
  const flows2 = {};

  data1.forEach((d) => {
    flows1[`${d.origIso}|${d.destIso}`] = d.students;
  });
  data2.forEach((d) => {
    flows2[`${d.origIso}|${d.destIso}`] = d.students;
  });

  const allFlows = new Set([...Object.keys(flows1), ...Object.keys(flows2)]);
  const comparisonData = Array.from(allFlows).map((key) => {
    const [origIso, destIso] = key.split("|");
    const count1 = flows1[key] || 0;
    const count2 = flows2[key] || 0;
    const diff = count2 - count1;
    const pctChange = count1 > 0 ? ((diff / count1) * 100) : (count2 > 0 ? 100 : 0);

    return {
      origName: isoToName[origIso] || origIso,
      destName: isoToName[destIso] || destIso,
      count1,
      count2,
      diff,
      pctChange,
    };
  }).filter((d) => d.count1 + d.count2 > 0).sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));

  document.getElementById("year1Header").textContent = `${year1} Students`;
  document.getElementById("year2Header").textContent = `${year2} Students`;

  const tbody = document.getElementById("comparisonTableBody");
  tbody.innerHTML = "";
  comparisonData.forEach((flow) => {
    tbody.innerHTML += `
      <tr>
        <td>${flow.origName}</td>
        <td>${flow.destName}</td>
        <td>${flow.count1.toLocaleString()}</td>
        <td>${flow.count2.toLocaleString()}</td>
        <td>${flow.diff >= 0 ? "+" : ""}${flow.diff.toLocaleString()}</td>
        <td>${flow.pctChange >= 0 ? "+" : ""}${flow.pctChange.toFixed(1)}%</td>
      </tr>
    `;
  });
}

// Filter comparison table
function filterComparisonTable(e) {
  const searchTerm = e.target.value.toLowerCase();
  const rows = document.querySelectorAll("#comparisonTableBody tr");
  rows.forEach((row) => {
    row.style.display = row.textContent.toLowerCase().includes(searchTerm) ? "" : "none";
  });
}
