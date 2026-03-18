// Global state
let flowData = [];
let currentYear = 2023;
let selectedCountry = "ALL";
let flowDirection = "inbound";
let allCountries = new Set();

// Initialize dashboard
document.addEventListener("DOMContentLoaded", async () => {
  // Load CSV data
  const url = "data/flows_2015_2023_clean.csv";
  try {
    // Try to fetch from the data folder first
    const response = await fetch(url);
    if (response.ok) {
      Papa.parse(response.body, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          flowData = processData(results.data);
          initializeDashboard();
        },
        error: (error) => {
          console.warn("Could not load local data, using synthetic data:", error);
          flowData = generateSyntheticData();
          initializeDashboard();
        },
      });
    } else {
      console.log("Data file not found, using synthetic data");
      flowData = generateSyntheticData();
      initializeDashboard();
    }
  } catch (e) {
    console.log("Using synthetic data:", e.message);
    flowData = generateSyntheticData();
    initializeDashboard();
  }
});

// Process raw CSV data
function processData(rawData) {
  const processed = [];
  rawData.forEach((row) => {
    if (
      row.year &&
      row.origin_iso3 &&
      row.destination_iso3 &&
      parseFloat(row.students) > 0
    ) {
      allCountries.add(row.origin_iso3);
      allCountries.add(row.destination_iso3);
      processed.push({
        year: parseInt(row.year),
        origIso: row.origin_iso3,
        origName: row.origin_name || row.origin_iso3,
        destIso: row.destination_iso3,
        destName: row.destination_name || row.destination_iso3,
        students: parseFloat(row.students) || 0,
      });
    }
  });
  return processed;
}

// Generate synthetic data for demonstration
function generateSyntheticData() {
  const countries = [
    { iso: "CHN", name: "China" },
    { iso: "IND", name: "India" },
    { iso: "USA", name: "United States" },
    { iso: "GBR", name: "United Kingdom" },
    { iso: "AUS", name: "Australia" },
    { iso: "CAN", name: "Canada" },
    { iso: "DEU", name: "Germany" },
    { iso: "FRA", name: "France" },
    { iso: "JPN", name: "Japan" },
    { iso: "KOR", name: "South Korea" },
    { iso: "SGP", name: "Singapore" },
    { iso: "ARE", name: "United Arab Emirates" },
    { iso: "BRA", name: "Brazil" },
    { iso: "MEX", name: "Mexico" },
    { iso: "NZL", name: "New Zealand" },
  ];

  const flows = [
    { from: "CHN", to: "USA", base: 360000 },
    { from: "IND", to: "USA", base: 240000 },
    { from: "CHN", to: "JPN", base: 120000 },
    { from: "CHN", to: "AUS", base: 150000 },
    { from: "CHN", to: "GBR", base: 140000 },
    { from: "IND", to: "GBR", base: 110000 },
    { from: "KOR", to: "USA", base: 80000 },
    { from: "CHN", to: "CAN", base: 85000 },
    { from: "IND", to: "CAN", base: 60000 },
    { from: "BRA", to: "USA", base: 45000 },
    { from: "MEX", to: "USA", base: 50000 },
    { from: "DEU", to: "AUS", base: 30000 },
    { from: "FRA", to: "AUS", base: 25000 },
    { from: "CHN", to: "SGP", base: 40000 },
    { from: "IND", to: "SGP", base: 35000 },
  ];

  const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
  const data = [];

  // COVID multiplier: normal in 2015-2019, drop in 2020-2021, partial recovery 2022-2023
  const covidMultipliers = {
    2015: 1.0,
    2016: 1.05,
    2017: 1.08,
    2018: 1.1,
    2019: 1.12,
    2020: 0.65,
    2021: 0.55,
    2022: 0.8,
    2023: 0.95,
  };

  flows.forEach((flow) => {
    const origCountry = countries.find((c) => c.iso === flow.from);
    const destCountry = countries.find((c) => c.iso === flow.to);

    years.forEach((year) => {
      const multiplier = covidMultipliers[year];
      const students = Math.round(flow.base * multiplier);

      data.push({
        year,
        origIso: flow.from,
        origName: origCountry.name,
        destIso: flow.to,
        destName: destCountry.name,
        students,
      });

      allCountries.add(flow.from);
      allCountries.add(flow.to);
    });
  });

  return data;
}

// Initialize dashboard
function initializeDashboard() {
  populateCountryDropdown();
  setupEventListeners();
  updateAllVisualizations();
}

// Populate country dropdown
function populateCountryDropdown() {
  const select = document.getElementById("countrySelect");
  const countries = Array.from(allCountries)
    .sort()
    .map((iso) => {
      const flow = flowData.find((f) => f.origIso === iso || f.destIso === iso);
      const name = flow ? (flow.origIso === iso ? flow.origName : flow.destName) : iso;
      return { iso, name };
    });

  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country.iso;
    option.textContent = `${country.name} (${country.iso})`;
    select.appendChild(option);
  });
}

// Setup event listeners
function setupEventListeners() {
  document.getElementById("countrySelect").addEventListener("change", (e) => {
    selectedCountry = e.target.value;
    updateAllVisualizations();
  });

  document.querySelectorAll('input[name="direction"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      flowDirection = e.target.value;
      updateAllVisualizations();
    });
  });

  document.getElementById("yearSlider").addEventListener("input", (e) => {
    currentYear = parseInt(e.target.value);
    document.getElementById("yearDisplay").textContent = currentYear;
    updateAllVisualizations();
  });

  document.getElementById("compareButton").addEventListener("click", showCovidComparison);
  document.getElementById("tableSearch").addEventListener("input", filterTable);
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
  updateTopCountriesCharts();
  updateTrendsChart();
  updateFlowsTable();
  updateActiveFiltersDisplay();
}

// Update flow map
function updateFlowMap() {
  const filtered = getFilteredData();
  const topFlows = filtered.sort((a, b) => b.students - a.students).slice(0, 20);

  // Create SVG-based flow visualization
  let html = `<svg width="100%" height="100%" viewBox="0 0 1000 500" style="border: 1px solid #eee;" id="flowMapSvg">`;

  // Add title
  const title =
    selectedCountry === "ALL"
      ? `Global Student Flows - ${currentYear}`
      : `${flowDirection === "inbound" ? "Incoming to" : "Outgoing from"} ${selectedCountry} - ${currentYear}`;

  const maxStudents = Math.max(...(topFlows.length > 0 ? topFlows.map((f) => f.students) : [1]));

  // Draw flows as arcs/paths
  topFlows.forEach((flow, idx) => {
    const y = 50 + (idx * (400 / topFlows.length));
    const thickness = Math.max(2, (flow.students / maxStudents) * 12);
    const opacity = 0.3 + (flow.students / maxStudents) * 0.7;
    const color = `rgba(102, 126, 234, ${opacity})`;
    
    // Determine which country is origin/destination for click handling
    const originIso = flow.origIso;
    const destIso = flow.destIso;
    const originName = flow.origName;
    const destName = flow.destName;

    html += `
      <g class="flow-corridor" style="cursor: pointer;" data-origin="${originIso}" data-destination="${destIso}">
        <line x1="50" y1="${y}" x2="900" y2="${y}" stroke="${color}" stroke-width="${thickness}" />
        <text x="10" y="${y + 4}" font-size="12" fill="#666" class="country-label" data-country="${originIso}" data-country-name="${originName}" style="cursor: pointer; user-select: none;">${originIso}</text>
        <text x="920" y="${y + 4}" font-size="12" fill="#666" class="country-label" data-country="${destIso}" data-country-name="${destName}" style="cursor: pointer; user-select: none;">${destIso}</text>
        <text x="500" y="${y - 10}" font-size="11" fill="#999" text-anchor="middle">${flow.students.toLocaleString()}</text>
      </g>
    `;
  });

  html += `</svg>`;

  document.getElementById("flowMap").innerHTML = html;
  
  // Add click handlers for country labels
  document.querySelectorAll(".country-label").forEach((label) => {
    label.addEventListener("click", (e) => {
      e.stopPropagation();
      const countryIso = label.getAttribute("data-country");
      document.getElementById("countrySelect").value = countryIso;
      selectedCountry = countryIso;
      updateAllVisualizations();
    });
  });
  
  // Add hover effects
  document.querySelectorAll(".flow-corridor").forEach((corridor) => {
    corridor.addEventListener("mouseenter", function() {
      this.style.opacity = "1";
      this.querySelector("line").style.strokeWidth = (parseFloat(this.querySelector("line").style.strokeWidth) + 2) + "";
    });
    corridor.addEventListener("mouseleave", function() {
      this.style.opacity = "1";
      updateFlowMap(); // Redraw to reset styling
    });
  });
}

// Update statistics cards
function updateStats() {
  const filtered = getFilteredData();
  const totalStudents = filtered.reduce((sum, d) => sum + d.students, 0);
  const topFlow = filtered.length > 0 ? filtered.sort((a, b) => b.students - a.students)[0] : null;

  if (selectedCountry === "ALL") {
    document.getElementById("topSource").textContent = topFlow ? topFlow.origName : "N/A";
    document.getElementById("topSourceCount").textContent = topFlow
      ? `${topFlow.students.toLocaleString()} students`
      : "0 students";
    document.getElementById("topDest").textContent = topFlow ? topFlow.destName : "N/A";
  } else {
    if (flowDirection === "inbound") {
      document.getElementById("topSource").textContent = topFlow ? topFlow.origName : "N/A";
      document.getElementById("topSourceCount").textContent = topFlow
        ? `${topFlow.students.toLocaleString()} students`
        : "0 students";
      document.getElementById("topDest").textContent = selectedCountry;
    } else {
      document.getElementById("topSource").textContent = selectedCountry;
      document.getElementById("topDest").textContent = topFlow ? topFlow.destName : "N/A";
      document.getElementById("topDestCount").textContent = topFlow
        ? `${topFlow.students.toLocaleString()} students`
        : "0 students";
    }
  }

  document.getElementById("totalStudents").textContent = totalStudents.toLocaleString();
  document.getElementById("corridorCount").textContent = filtered.length;
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
    .slice(0, 15);

  const sourcesTrace = {
    x: topSources.map((s) => s[1]),
    y: topSources.map((s) => s[0]),
    type: "bar",
    orientation: "h",
    marker: { color: "rgba(102, 126, 234, 0.7)" },
  };

  Plotly.newPlot(
    "topSourcesChart",
    [sourcesTrace],
    {
      margin: { l: 150, r: 20, t: 20, b: 20 },
      xaxis: { title: "Number of Students" },
      yaxis: { automargin: true },
      showlegend: false,
    },
    { responsive: true }
  );

  // Top destinations
  const destinations = {};
  allYearData.forEach((d) => {
    destinations[d.destName] = (destinations[d.destName] || 0) + d.students;
  });
  const topDests = Object.entries(destinations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  const destsTrace = {
    x: topDests.map((d) => d[1]),
    y: topDests.map((d) => d[0]),
    type: "bar",
    orientation: "h",
    marker: { color: "rgba(118, 75, 162, 0.7)" },
  };

  Plotly.newPlot(
    "topDestsChart",
    [destsTrace],
    {
      margin: { l: 150, r: 20, t: 20, b: 20 },
      xaxis: { title: "Number of Students" },
      yaxis: { automargin: true },
      showlegend: false,
    },
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

  const trace = {
    x: years,
    y: totals,
    type: "scatter",
    mode: "lines+markers",
    fill: "tozeroy",
    line: { color: "rgba(102, 126, 234, 0.8)", width: 3 },
    marker: { size: 8, color: "rgba(102, 126, 234, 1)" },
  };

  // Add COVID period annotation
  const shapes = [
    {
      type: "rect",
      x0: 2019.5,
      x1: 2021.5,
      y0: 0,
      y1: 1,
      yref: "paper",
      fillcolor: "rgba(255, 0, 0, 0.1)",
      line: { width: 0 },
    },
  ];

  Plotly.newPlot(
    "trendsChart",
    [trace],
    {
      title: "Global Student Flow Trends with COVID-19 Period",
      xaxis: { title: "Year" },
      yaxis: { title: "Total Students" },
      shapes: shapes,
      showlegend: false,
      hovermode: "x unified",
    },
    { responsive: true }
  );
}

// Show COVID comparison
function showCovidComparison() {
  const data2019 = flowData
    .filter((d) => d.year === 2019)
    .reduce((sum, d) => sum + d.students, 0);
  const data2023 = flowData
    .filter((d) => d.year === 2023)
    .reduce((sum, d) => sum + d.students, 0);

  const change = ((data2023 - data2019) / data2019) * 100;

  // COVID comparison chart
  const comparisonTrace = {
    x: ["2019 (Pre-COVID)", "2023 (Post-COVID)"],
    y: [data2019, data2023],
    type: "bar",
    marker: { color: ["rgba(102, 126, 234, 0.7)", "rgba(118, 75, 162, 0.7)"] },
  };

  Plotly.newPlot(
    "covidComparisonChart",
    [comparisonTrace],
    {
      title: "Pre-COVID vs Post-COVID (Global)",
      yaxis: { title: "Total Students" },
      showlegend: false,
    },
    { responsive: true }
  );

  // Year-over-year change
  const yearTotals = {};
  flowData.forEach((d) => {
    if (!yearTotals[d.year]) yearTotals[d.year] = 0;
    yearTotals[d.year] += d.students;
  });

  const years = Object.keys(yearTotals)
    .map(Number)
    .sort((a, b) => a - b);
  const changes = [];

  for (let i = 1; i < years.length; i++) {
    const yoy = ((yearTotals[years[i]] - yearTotals[years[i - 1]]) / yearTotals[years[i - 1]]) * 100;
    changes.push(yoy);
  }

  const yoyTrace = {
    x: years.slice(1).map((y) => y.toString()),
    y: changes,
    type: "bar",
    marker: {
      color: changes.map((c) => (c >= 0 ? "rgba(76, 175, 80, 0.7)" : "rgba(244, 67, 54, 0.7)")),
    },
  };

  Plotly.newPlot(
    "yoyChangeChart",
    [yoyTrace],
    {
      title: "Year-over-Year Growth Rate",
      yaxis: { title: "% Change" },
      showlegend: false,
      hovermode: "x",
    },
    { responsive: true }
  );

  alert(`COVID-19 Impact: Global student flows decreased ${change.toFixed(1)}% from 2019 to 2023.`);
}

// Update flows table
function updateFlowsTable() {
  const filtered = getFilteredData().sort((a, b) => b.students - a.students);
  const totalStudents = filtered.reduce((sum, d) => sum + d.students, 0);

  // Update table title and subtitle dynamically
  let tableTitle = "Top Student Mobility Corridors";
  let tableSubtitle = "Global flows. Click on any country name to filter flows for that country.";
  
  if (selectedCountry !== "ALL") {
    if (flowDirection === "inbound") {
      tableTitle = `Countries Sending Students TO ${selectedCountry}`;
      tableSubtitle = `Showing flows into ${selectedCountry} in ${currentYear}. Click to explore bilateral corridors.`;
    } else {
      tableTitle = `Countries WHERE ${selectedCountry} Students Go`;
      tableSubtitle = `Showing where ${selectedCountry} students study (${currentYear}). Click to explore bilateral corridors.`;
    }
  } else {
    tableTitle = "Global Student Mobility Corridors";
    tableSubtitle = "Showing global flows. Click on any country name to filter flows for that country.";
  }
  
  // Find and update table heading
  const tableSection = document.querySelector(".table-section");
  let heading = tableSection.querySelector("h2");
  if (heading) {
    heading.textContent = tableTitle;
  }
  
  let subtitle = document.getElementById("tableSubtitle");
  if (subtitle) {
    subtitle.textContent = tableSubtitle;
  }

  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: #999;">No flows found for this selection.</td></tr>`;
    return;
  }

  filtered.slice(0, 50).forEach((flow, idx) => {
    const percent = ((flow.students / totalStudents) * 100).toFixed(2);
    
    // Make origin and destination clickable
    const originClick = `onclick="selectCountry('${flow.origIso}')" style="cursor: pointer; color: #667eea; text-decoration: underline; user-select: none;"`;
    const destClick = `onclick="selectCountry('${flow.destIso}')" style="cursor: pointer; color: #667eea; text-decoration: underline; user-select: none;"`;
    
    const row = `
      <tr>
        <td class="rank">${idx + 1}</td>
        <td class="flow-country" ${originClick}>${flow.origName}</td>
        <td class="flow-arrow">→</td>
        <td class="flow-country" ${destClick}>${flow.destName}</td>
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
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? "" : "none";
  });
}

// Select country from map or table click
function selectCountry(countryIso) {
  document.getElementById("countrySelect").value = countryIso;
  selectedCountry = countryIso;
  updateAllVisualizations();
  // Scroll to top so user can see the map
  document.querySelector(".visualization-section").scrollIntoView({ behavior: "smooth" });
}

// Update active filters display badge
function updateActiveFiltersDisplay() {
  const filtersContainer = document.getElementById("activeFilters");
  
  if (selectedCountry === "ALL") {
    filtersContainer.style.display = "none";
  } else {
    filtersContainer.style.display = "block";
    const countryName = flowData.find(
      (d) => d.origIso === selectedCountry || d.destIso === selectedCountry
    );
    const name = countryName
      ? countryName.origIso === selectedCountry
        ? countryName.origName
        : countryName.destName
      : selectedCountry;
    
    const directionText =
      flowDirection === "inbound"
        ? `Showing students coming TO ${name}`
        : `Showing where ${name} students go`;
    
    document.getElementById("filterText").textContent = `📍 ${directionText} (${currentYear})`;
  }
}

// Clear filters
function clearFilters() {
  document.getElementById("countrySelect").value = "ALL";
  selectedCountry = "ALL";
  updateAllVisualizations();
}
