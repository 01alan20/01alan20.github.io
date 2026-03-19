const CSV_PATH = "pmi_roi_agg.csv";
const YEARS = [2020, 2021, 2022, 2023, 2024, 2025];
const COLS = {
  project: "project",
  area: "area_bucket",
  district: "district",
  tenure: "tenure",
  type: "propertyType",
  recentBuy: "most_recent_buy",
  recentRent: "most_recent_rent",
  roi: "ROI"
};

const state = {
  rows: [],
  projectSummary: [],
  districtOptions: [],
  areaOptions: [],
  tenureOptions: [],
  activeTab: "roi",
  trendMetric: "buy",
  trendSelection: new Set(),
  compareDistrictA: "",
  compareDistrictB: "",
  compareArea: "",
  trendSearch: ""
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function toNum(value) {
  if (value === null || value === undefined || value === "") return NaN;
  if (typeof value === "number") return value;
  const normalized = String(value).replace(/[, ]+/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : NaN;
}

function mean(values) {
  const valid = values.filter(Number.isFinite);
  if (!valid.length) return NaN;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function fmtMoney(value) {
  if (!Number.isFinite(value)) return "-";
  return `S$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function fmtPercent(value, digits = 2) {
  if (!Number.isFinite(value)) return "-";
  return `${value.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })}%`;
}

function fmtYears(value, digits = 1) {
  if (!Number.isFinite(value)) return "-";
  return `${value.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })} yrs`;
}

function fmtDelta(value, digits = 1) {
  if (!Number.isFinite(value)) return "-";
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${Math.abs(value).toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })}`;
}

function roiClass(paybackYears) {
  if (!Number.isFinite(paybackYears)) return "roi-low";
  if (paybackYears <= 20) return "roi-high";
  if (paybackYears <= 30) return "roi-mid";
  return "roi-low";
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function sortDistricts(values) {
  return values.slice().sort((a, b) => districtNumber(a) - districtNumber(b));
}

function districtNumber(label) {
  const match = String(label).match(/(\d+)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function districtLabel(value) {
  const num = toNum(value);
  return Number.isFinite(num) ? `District ${Math.round(num)}` : "Unknown";
}

function parseAreaBucket(bucket) {
  const matches = String(bucket ?? "").match(/\d+(\.\d+)?/g) || [];
  const numbers = matches.map(Number);
  if (!numbers.length) return { min: NaN, max: NaN, mid: NaN };
  if (numbers.length === 1) return { min: numbers[0], max: numbers[0], mid: numbers[0] };
  return { min: numbers[0], max: numbers[1], mid: (numbers[0] + numbers[1]) / 2 };
}

function estimateBedrooms(mid) {
  if (!Number.isFinite(mid)) return "Unknown";
  if (mid < 55) return "1";
  if (mid < 85) return "2";
  if (mid < 120) return "3";
  if (mid < 170) return "4";
  return "5+";
}

function wrapLabel(label, max = 18) {
  const words = String(label).split(" ");
  const lines = [];
  let current = "";
  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });
  if (current) lines.push(current);
  return lines.join("<br>");
}

function mostCommon(values) {
  const counts = new Map();
  values.filter(Boolean).forEach((value) => {
    counts.set(value, (counts.get(value) || 0) + 1);
  });
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
}

function plotLayout(extra = {}) {
  return {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: { family: "Manrope, Segoe UI, sans-serif", size: 13, color: "#1f2933" },
    margin: { l: 60, r: 20, t: 20, b: 45 },
    ...extra
  };
}

function renderEmptyPlot(id, message) {
  Plotly.newPlot(id, [], plotLayout({
    annotations: [{
      text: message,
      x: 0.5,
      y: 0.5,
      xref: "paper",
      yref: "paper",
      showarrow: false,
      font: { size: 16, color: "#667085" }
    }],
    xaxis: { visible: false },
    yaxis: { visible: false }
  }), { responsive: true, displayModeBar: false });
}

function fitLine(points) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const xMean = mean(xs);
  const yMean = mean(ys);
  let numerator = 0;
  let xVariance = 0;
  let yVariance = 0;
  points.forEach((point) => {
    const dx = point.x - xMean;
    const dy = point.y - yMean;
    numerator += dx * dy;
    xVariance += dx * dx;
    yVariance += dy * dy;
  });
  const slope = xVariance ? numerator / xVariance : 0;
  const intercept = yMean - slope * xMean;
  const correlation = xVariance && yVariance ? numerator / Math.sqrt(xVariance * yVariance) : 0;
  return { slope, intercept, correlation };
}

function csvRowsToObjects(rawRows) {
  const metaByProject = new Map();

  rawRows.forEach((row) => {
    const project = String(row.project ?? "").trim();
    if (!project) return;
    if (!metaByProject.has(project)) metaByProject.set(project, {});
    const meta = metaByProject.get(project);
    if (row.district) meta.district = row.district;
    if (row.tenure) meta.tenure = row.tenure;
    if (row.propertyType) meta.propertyType = row.propertyType;
  });

  return rawRows
    .map((row) => {
      const project = String(row.project ?? "").trim();
      const areaBucket = String(row.area_bucket ?? "").trim();
      if (!project || !areaBucket) return null;

      const meta = metaByProject.get(project) || {};
      const areaInfo = parseAreaBucket(areaBucket);
      const annualBuy = {};
      const annualRent = {};
      const annualYield = {};

      YEARS.forEach((year) => {
        annualBuy[year] = toNum(row[`avg_buy_${year}`]);
        annualRent[year] = toNum(row[`avg_rent_${year}`]);
        annualYield[year] = Number.isFinite(annualBuy[year]) && Number.isFinite(annualRent[year])
          ? (annualRent[year] * 12 / annualBuy[year]) * 100
          : NaN;
      });

      const district = districtLabel(row.district || meta.district);
      const tenureRaw = String(row.tenure || meta.tenure || "").trim();
      const tenureGroup = /freehold/i.test(tenureRaw) ? "Freehold" : tenureRaw ? "Leasehold" : "Unknown";

      return {
        project,
        areaBucket,
        district,
        districtNumber: districtNumber(district),
        tenure: tenureRaw || "Unknown",
        tenureGroup,
        propertyType: String(row.propertyType || meta.propertyType || "Unknown").trim() || "Unknown",
        mostRecentBuy: toNum(row.most_recent_buy),
        mostRecentRent: toNum(row.most_recent_rent),
        roi: toNum(row.ROI),
        sizeMin: areaInfo.min,
        sizeMax: areaInfo.max,
        sizeMid: areaInfo.mid,
        estimatedBedrooms: estimateBedrooms(areaInfo.mid),
        annualBuy,
        annualRent,
        annualYield
      };
    })
    .filter(Boolean);
}

function buildProjectSummary(rows) {
  const grouped = new Map();
  rows.forEach((row) => {
    if (!grouped.has(row.project)) grouped.set(row.project, []);
    grouped.get(row.project).push(row);
  });

  return Array.from(grouped.entries()).map(([project, items]) => {
    const annual = { buy: {}, rent: {}, payback: {} };
    YEARS.forEach((year) => {
      annual.buy[year] = mean(items.map((item) => item.annualBuy[year]));
      annual.rent[year] = mean(items.map((item) => item.annualRent[year]));
      annual.payback[year] = Number.isFinite(annual.buy[year]) && Number.isFinite(annual.rent[year])
        ? annual.buy[year] / (annual.rent[year] * 12)
        : NaN;
    });

    return {
      project,
      district: mostCommon(items.map((item) => item.district)),
      tenureGroup: mostCommon(items.map((item) => item.tenureGroup)),
      propertyType: mostCommon(items.map((item) => item.propertyType)),
      avgRoi: mean(items.map((item) => item.roi)),
      avgBuy: mean(items.map((item) => item.mostRecentBuy)),
      avgRent: mean(items.map((item) => item.mostRecentRent)),
      trendCoverage: YEARS.filter((year) => Number.isFinite(annual.buy[year]) || Number.isFinite(annual.rent[year])).length,
      annual,
      items
    };
  });
}

function aggregateProjectLevel(projectSummary, key) {
  const grouped = new Map();
  projectSummary
    .filter((item) => item[key] && Number.isFinite(item.avgRoi))
    .forEach((item) => {
      if (!grouped.has(item[key])) grouped.set(item[key], []);
      grouped.get(item[key]).push(item);
    });

  return Array.from(grouped.entries()).map(([label, items]) => ({
    label,
    avgRoi: mean(items.map((item) => item.avgRoi)),
    avgBuy: mean(items.map((item) => item.avgBuy)),
    avgRent: mean(items.map((item) => item.avgRent)),
    count: items.length
  }));
}

function areaSummary(rows) {
  const grouped = new Map();
  rows
    .filter((row) => row.areaBucket && Number.isFinite(row.roi))
    .forEach((row) => {
      if (!grouped.has(row.areaBucket)) grouped.set(row.areaBucket, []);
      grouped.get(row.areaBucket).push(row);
    });

  return Array.from(grouped.entries()).map(([label, items]) => ({
    label,
    avgRoi: mean(items.map((item) => item.roi)),
    avgBuy: mean(items.map((item) => item.mostRecentBuy)),
    avgRent: mean(items.map((item) => item.mostRecentRent)),
    count: items.length,
    sizeMid: mean(items.map((item) => item.sizeMid))
  })).sort((a, b) => a.sizeMid - b.sizeMid);
}

function tenureSummary(projectSummary) {
  return aggregateProjectLevel(
    projectSummary.filter((item) => item.tenureGroup === "Freehold" || item.tenureGroup === "Leasehold"),
    "tenureGroup"
  );
}

function topProjects(projectSummary, limit = 10) {
  return projectSummary
    .filter((item) => Number.isFinite(item.avgRoi))
    .sort((a, b) => a.avgRoi - b.avgRoi)
    .slice(0, limit);
}

function trendProjects(projectSummary) {
  return projectSummary
    .filter((item) => item.trendCoverage >= 2)
    .sort((a, b) => a.project.localeCompare(b.project));
}

function initState(rows) {
  state.rows = csvRowsToObjects(rows);
  state.projectSummary = buildProjectSummary(state.rows);
  state.districtOptions = sortDistricts(unique(state.projectSummary.map((item) => item.district).filter((value) => value !== "Unknown")));
  state.areaOptions = areaSummary(state.rows).map((item) => item.label);
  state.tenureOptions = ["Freehold", "Leasehold"].filter((value) => state.rows.some((row) => row.tenureGroup === value));

  const rankedDistricts = aggregateProjectLevel(state.projectSummary, "district")
    .filter((item) => item.label !== "Unknown")
    .sort((a, b) => a.avgRoi - b.avgRoi);
  state.compareDistrictA = rankedDistricts[0]?.label || state.districtOptions[0] || "";
  state.compareDistrictB = rankedDistricts.find((item) => item.label !== state.compareDistrictA)?.label || state.districtOptions[1] || state.compareDistrictA;
  state.compareArea = areaSummary(state.rows).sort((a, b) => b.count - a.count)[0]?.label || state.areaOptions[0] || "";
  state.trendSelection = new Set();
}

function fillSelect(selectId, items, includeAll = false, allLabel = "All") {
  const select = $(`#${selectId}`);
  if (!select) return;
  select.innerHTML = "";
  if (includeAll) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = allLabel;
    select.appendChild(option);
  }
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

function clearSelectSelection(selectId) {
  const select = $(`#${selectId}`);
  if (!select) return;
  Array.from(select.options).forEach((option) => {
    option.selected = false;
  });
}

function selectedValues(selectId) {
  const select = $(`#${selectId}`);
  if (!select) return [];
  return Array.from(select.selectedOptions).map((option) => option.value).filter(Boolean);
}

function fillControls() {
  fillSelect("compareDistrictA", state.districtOptions);
  fillSelect("compareDistrictB", state.districtOptions);
  fillSelect("compareArea", state.areaOptions);
  fillSelect("searchDistrict", state.districtOptions);
  fillSelect("searchArea", state.areaOptions);
  fillSelect("searchBeds", ["1", "2", "3", "4", "5+"]);
  fillSelect("searchTenure", state.tenureOptions);

  $("#compareDistrictA").value = state.compareDistrictA;
  $("#compareDistrictB").value = state.compareDistrictB;
  $("#compareArea").value = state.compareArea;
  ["searchDistrict", "searchArea", "searchBeds", "searchTenure"].forEach(clearSelectSelection);
}

function renderOverview() {
  const marketProjects = state.projectSummary.length;
  const avgRoi = mean(state.projectSummary.map((item) => item.avgRoi));
  const avgBuy = mean(state.projectSummary.map((item) => item.avgBuy));
  const avgRent = mean(state.projectSummary.map((item) => item.avgRent));

  $("#projectCount").textContent = marketProjects.toLocaleString();
  $("#avgRoi").textContent = fmtYears(avgRoi);
  $("#avgBuy").textContent = fmtMoney(avgBuy);
  $("#avgRent").textContent = fmtMoney(avgRent);
}

function renderTabs() {
  $$(".tab-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === state.activeTab);
  });
  $$(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.tab === state.activeTab);
  });
}

function renderHorizontalBarChart(id, items, config) {
  const labels = items.map(config.label);
  Plotly.newPlot(id, [{
    type: "bar",
    orientation: "h",
    x: items.map(config.value),
    y: labels,
    customdata: config.customdata ? items.map(config.customdata) : undefined,
    marker: { color: config.color },
    hovertemplate: config.hovertemplate
  }], plotLayout({
    margin: { l: config.marginLeft, r: 12, t: 10, b: 40 },
    xaxis: { title: config.xaxisTitle },
    yaxis: {
      automargin: true,
      autorange: "reversed",
      categoryorder: "array",
      categoryarray: labels
    }
  }), { responsive: true, displayModeBar: false });
}

function renderRoiTab() {
  const projects = topProjects(state.projectSummary, 10);
  if (!projects.length) {
    renderEmptyPlot("roi-top-projects", "No project-level payback data available.");
    renderEmptyPlot("roi-districts", "No district payback data available.");
    renderEmptyPlot("roi-areas", "No area payback data available.");
    renderEmptyPlot("roi-price-scatter", "No price-to-payback data available.");
    return;
  }

  renderHorizontalBarChart("roi-top-projects", projects, {
    label: (item) => wrapLabel(item.project, 18),
    value: (item) => item.avgRoi,
    customdata: (item) => [item.project, item.district],
    color: "#1f5a45",
    hovertemplate: "<b>%{customdata[0]}</b><br>%{customdata[1]}<br>Average payback: %{x:.1f} years<extra></extra>",
    marginLeft: 160,
    xaxisTitle: "Average Payback (Years)"
  });

  const districts = aggregateProjectLevel(state.projectSummary, "district")
    .filter((item) => item.label !== "Unknown")
    .sort((a, b) => a.avgRoi - b.avgRoi);
  renderHorizontalBarChart("roi-districts", districts, {
    label: (item) => item.label,
    value: (item) => item.avgRoi,
    color: "#2f7d5d",
    hovertemplate: "<b>%{y}</b><br>Average payback: %{x:.1f} years<extra></extra>",
    marginLeft: 110,
    xaxisTitle: "Average Payback (Years)"
  });

  const areas = areaSummary(state.rows)
    .filter((item) => Number.isFinite(item.avgRoi))
    .sort((a, b) => a.avgRoi - b.avgRoi);
  renderHorizontalBarChart("roi-areas", areas, {
    label: (item) => item.label,
    value: (item) => item.avgRoi,
    color: "#b57734",
    hovertemplate: "<b>%{y}</b><br>Average payback: %{x:.1f} years<extra></extra>",
    marginLeft: 100,
    xaxisTitle: "Average Payback (Years)"
  });

  const tenure = tenureSummary(state.projectSummary).sort((a, b) => a.avgRoi - b.avgRoi);
  const tenureBox = $("#roi-tenure");
  const leasehold = tenure.find((item) => item.label === "Leasehold");
  const freehold = tenure.find((item) => item.label === "Freehold");
  const diff = (freehold?.avgRoi || NaN) - (leasehold?.avgRoi || NaN);
  tenureBox.innerHTML = [freehold, leasehold].filter(Boolean).map((item) => `
    <article class="mini-card">
      <span class="mini-label">${escapeHtml(item.label)}</span>
      <div class="mini-value">${fmtYears(item.avgRoi)}</div>
      <p class="mini-sub">Average recent buy ${fmtMoney(item.avgBuy)} across ${item.count.toLocaleString()} projects.</p>
    </article>
  `).join("") + `
    <article class="mini-card" style="grid-column: 1 / -1;">
      <span class="mini-label">Payback Gap</span>
      <div class="mini-value">${Number.isFinite(diff) ? fmtDelta(diff, 1) + " yrs" : "-"}</div>
      <p class="mini-sub">Positive means freehold projects take longer on average to recover the purchase price from rent.</p>
    </article>
  `;

  const scatterPoints = state.projectSummary
    .filter((item) => Number.isFinite(item.avgBuy) && Number.isFinite(item.avgRoi))
    .map((item) => ({ x: item.avgBuy, y: item.avgRoi, project: item.project, district: item.district }));

  if (!scatterPoints.length) {
    renderEmptyPlot("roi-price-scatter", "No price-to-payback data available.");
    return;
  }

  const lineFit = fitLine(scatterPoints);
  const xMin = Math.min(...scatterPoints.map((point) => point.x));
  const xMax = Math.max(...scatterPoints.map((point) => point.x));
  const lineTrace = {
    type: "scatter",
    mode: "lines",
    x: [xMin, xMax],
    y: [lineFit.intercept + lineFit.slope * xMin, lineFit.intercept + lineFit.slope * xMax],
    line: { color: "#b57734", width: 3, dash: "dot" },
    hoverinfo: "skip",
    showlegend: false
  };

  Plotly.newPlot("roi-price-scatter", [
    {
      type: "scatter",
      mode: "markers",
      x: scatterPoints.map((point) => point.x),
      y: scatterPoints.map((point) => point.y),
      text: scatterPoints.map((point) => point.project),
      customdata: scatterPoints.map((point) => [point.project, point.district]),
      marker: {
        size: 10,
        color: "#1f5a45",
        opacity: 0.72
      },
      hovertemplate: "<b>%{customdata[0]}</b><br>%{customdata[1]}<br>Average Buy: S$%{x:,.0f}<br>Average payback: %{y:.1f} years<extra></extra>",
      showlegend: false
    },
    lineTrace
  ], plotLayout({
    margin: { l: 70, r: 20, t: 10, b: 55 },
    xaxis: { title: "Average Recent Buy (S$)", tickformat: ",.0f" },
    yaxis: { title: "Average Payback (Years)" }
  }), { responsive: true, displayModeBar: false });

  const insight = $("#roi-price-insight");
  const corr = lineFit.correlation;
  if (Math.abs(corr) < 0.12) {
    insight.textContent = "Payback years and buy price look weakly related here. Higher prices do not clearly imply faster or slower recovery.";
  } else if (corr > 0) {
    insight.textContent = `Payback generally gets longer as price rises here, though the relationship is modest (correlation ${corr.toFixed(2)}).`;
  } else {
    insight.textContent = `Payback generally gets shorter as price rises here, though the relationship is not perfectly linear (correlation ${corr.toFixed(2)}).`;
  }
}

function districtProjectSummary(district) {
  return state.projectSummary
    .filter((item) => item.district === district && Number.isFinite(item.avgRoi))
    .sort((a, b) => a.avgRoi - b.avgRoi);
}

function renderCompareCards() {
  const districtA = $("#compareDistrictA").value;
  const districtB = $("#compareDistrictB").value;
  const summaryA = districtProjectSummary(districtA);
  const summaryB = districtProjectSummary(districtB);
  const targets = [
    { label: districtA, items: summaryA },
    { label: districtB, items: summaryB }
  ];
  $("#compare-summary").innerHTML = targets.map((target) => {
    const avgRoi = mean(target.items.map((item) => item.avgRoi));
    const avgBuy = mean(target.items.map((item) => item.avgBuy));
    const top = target.items[0];
    return `
      <article class="summary-card">
        <span class="summary-label">${escapeHtml(target.label)}</span>
        <strong class="summary-value">${fmtYears(avgRoi)}</strong>
        <div class="mini-sub">Average payback across ${target.items.length.toLocaleString()} projects.</div>
        <div class="mini-sub">Average buy ${fmtMoney(avgBuy)}.</div>
        <div class="mini-sub">Fastest project: ${escapeHtml(top ? top.project : "None")}.</div>
      </article>
    `;
  }).join("");
}

function renderRankList(containerId, items) {
  const container = $(`#${containerId}`);
  if (!container) return;
  if (!items.length) {
    container.innerHTML = `<div class="empty-state">No project-level payback data for this district.</div>`;
    return;
  }

  container.innerHTML = items.slice(0, 6).map((item, index) => `
    <article class="rank-item">
      <div class="rank-index">${index + 1}</div>
      <div class="rank-copy">
        <div class="rank-title">${escapeHtml(item.project)}</div>
        <div class="rank-meta">${escapeHtml(item.propertyType)} | ${escapeHtml(item.tenureGroup)} | ${fmtMoney(item.avgBuy)} buy | ${fmtMoney(item.avgRent)} rent | ${fmtYears(item.avgRoi)}</div>
      </div>
    </article>
  `).join("");
}

function renderCompareTable() {
  const districtA = $("#compareDistrictA").value;
  const districtB = $("#compareDistrictB").value;
  const area = $("#compareArea").value;
  $("#compare-title-a").textContent = districtA || "District A";
  $("#compare-title-b").textContent = districtB || "District B";

  renderCompareCards();
  renderRankList("compare-top-a", districtProjectSummary(districtA));
  renderRankList("compare-top-b", districtProjectSummary(districtB));

  const filtered = state.rows
    .filter((row) => (row.district === districtA || row.district === districtB))
    .filter((row) => !area || row.areaBucket === area)
    .filter((row) => Number.isFinite(row.roi) && Number.isFinite(row.mostRecentBuy) && Number.isFinite(row.mostRecentRent))
    .sort((a, b) => a.mostRecentBuy - b.mostRecentBuy || a.roi - b.roi)
    .slice(0, 16);

  const tbody = $("#compare-area-body");
  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No comparable rows for the selected districts and area bucket.</td></tr>`;
    $("#compare-area-summary").textContent = "No comparable rows for the selected districts and area bucket.";
    return;
  }

  tbody.innerHTML = filtered.map((row) => `
    <tr>
      <td>${escapeHtml(row.project)}</td>
      <td>${escapeHtml(row.district)}</td>
      <td>${escapeHtml(row.areaBucket)}</td>
      <td class="num">${fmtMoney(row.mostRecentBuy)}</td>
      <td class="num">${fmtMoney(row.mostRecentRent)}</td>
      <td class="num"><span class="roi-badge ${roiClass(row.roi)}">${fmtYears(row.roi)}</span></td>
    </tr>
  `).join("");

  $("#compare-area-summary").textContent = `Showing similarly sized rows in ${area} across ${districtA} and ${districtB}, sorted first by recent buy price and then by faster payback.`;
}

function selectedTrendProjects() {
  return trendProjects(state.projectSummary).filter((item) => state.trendSelection.has(item.project));
}

function buildTrendChecklist() {
  const container = $("#trendProjectList");
  const query = state.trendSearch.toLowerCase();
  const items = trendProjects(state.projectSummary)
    .filter((item) => item.project.toLowerCase().includes(query));

  container.innerHTML = items.map((item) => `
    <label class="project-check">
      <input type="checkbox" class="trend-check" value="${escapeHtml(item.project)}" ${state.trendSelection.has(item.project) ? "checked" : ""}>
      <span>${escapeHtml(item.project)}</span>
    </label>
  `).join("") || `<div class="empty-state">No projects match this search.</div>`;
}

function trendMetricMeta() {
  if (state.trendMetric === "rent") {
    return {
      title: "Average Rent",
      format: "money",
      source: (item, year) => item.annual.rent[year]
    };
  }
  if (state.trendMetric === "payback") {
    return {
      title: "Estimated Payback",
      format: "years",
      source: (item, year) => item.annual.payback[year]
    };
  }
  return {
    title: "Average Buy Price",
    format: "money",
    source: (item, year) => item.annual.buy[year]
  };
}

function formatMetricValue(metric, value) {
  if (metric === "percent") return fmtPercent(value);
  if (metric === "years") return fmtYears(value);
  return fmtMoney(value);
}

function renderTrendSummary(projects, meta) {
  const container = $("#trend-summary");
  if (!projects.length) {
    container.innerHTML = `<div class="summary-card"><span class="summary-label">Selection</span><strong class="summary-value">0</strong><div class="mini-sub">Choose at least one project.</div></div>`;
    return;
  }

  container.innerHTML = projects.map((item) => {
    const start = meta.source(item, 2020);
    const end = meta.source(item, 2025);
    const delta = Number.isFinite(start) && Number.isFinite(end) ? end - start : NaN;
    return `
      <article class="summary-card">
        <span class="summary-label">${escapeHtml(item.project)}</span>
        <strong class="summary-value">${formatMetricValue(meta.format, end)}</strong>
        <div class="mini-sub">2020 to 2025 change ${
          meta.format === "years"
            ? fmtDelta(delta, 1) + " yrs"
            : meta.format === "percent"
              ? fmtDelta(delta, 2) + "%"
              : fmtDelta(delta, 0)
        }</div>
      </article>
    `;
  }).join("");
}

function renderTrendsTab() {
  buildTrendChecklist();
  const projects = selectedTrendProjects();
  const meta = trendMetricMeta();
  $("#trend-chart-title").textContent = meta.title;
  renderTrendSummary(projects, meta);

  if (!projects.length) {
    renderEmptyPlot("trend-chart", "Choose at least one project to view trends.");
    return;
  }

  const traces = projects.map((item) => ({
    type: "scatter",
    mode: "lines+markers",
    name: item.project,
    x: YEARS,
    y: YEARS.map((year) => meta.source(item, year)),
    connectgaps: false,
    hovertemplate: `<b>${escapeHtml(item.project)}</b><br>Year: %{x}<br>Value: %{y}<extra></extra>`
  }));

  Plotly.newPlot("trend-chart", traces, plotLayout({
    margin: { l: 70, r: 20, t: 10, b: 50 },
    xaxis: { title: "Year", dtick: 1 },
    yaxis: meta.format === "years"
      ? { title: "Years to Payback" }
      : meta.format === "percent"
        ? { title: "Estimated Yield (%)" }
        : { title: meta.title, tickprefix: "S$", separatethousands: true },
    legend: { orientation: "h", y: 1.15, x: 0 }
  }), { responsive: true, displayModeBar: false });
}

function searchRows() {
  const beds = selectedValues("searchBeds");
  const area = selectedValues("searchArea");
  const tenure = selectedValues("searchTenure");
  const district = selectedValues("searchDistrict");
  const budgetMin = toNum($("#searchBudgetMin").value);
  const budgetMax = toNum($("#searchBudgetMax").value);
  const lowerBudget = Number.isFinite(budgetMin) && Number.isFinite(budgetMax) ? Math.min(budgetMin, budgetMax) : budgetMin;
  const upperBudget = Number.isFinite(budgetMin) && Number.isFinite(budgetMax) ? Math.max(budgetMin, budgetMax) : budgetMax;

  return state.rows
    .filter((row) => Number.isFinite(row.roi) && Number.isFinite(row.mostRecentBuy) && Number.isFinite(row.mostRecentRent))
    .filter((row) => !beds.length || beds.includes(row.estimatedBedrooms))
    .filter((row) => !area.length || area.includes(row.areaBucket))
    .filter((row) => !tenure.length || tenure.includes(row.tenureGroup))
    .filter((row) => !district.length || district.includes(row.district))
    .filter((row) => !Number.isFinite(lowerBudget) || row.mostRecentBuy >= lowerBudget)
    .filter((row) => !Number.isFinite(upperBudget) || row.mostRecentBuy <= upperBudget)
    .sort((a, b) => a.roi - b.roi || a.mostRecentBuy - b.mostRecentBuy)
    .slice(0, 10);
}

function renderSearchTab() {
  const rows = searchRows();
  $("#search-summary").textContent = rows.length
    ? `Top ${rows.length} matching rows ranked by shortest payback.`
    : "No results match the current search inputs.";

  const container = $("#search-results");
  if (!rows.length) {
    container.innerHTML = `<div class="empty-state">Try widening the budget or clearing one of the filters.</div>`;
    return;
  }

  container.innerHTML = rows.map((row, index) => `
    <article class="search-card">
      <div class="search-rank">${index + 1}</div>
      <div class="search-main">
        <div class="search-title">${escapeHtml(row.project)}</div>
        <div class="search-meta">${escapeHtml(row.district)} | ${escapeHtml(row.areaBucket)} | ${escapeHtml(row.estimatedBedrooms)} bed estimate | ${escapeHtml(row.tenureGroup)}</div>
      </div>
      <div class="search-stat">
        <span class="search-stat-label">Buy</span>
        <span class="search-stat-value">${fmtMoney(row.mostRecentBuy)}</span>
      </div>
      <div class="search-stat">
        <span class="search-stat-label">Rent</span>
        <span class="search-stat-value">${fmtMoney(row.mostRecentRent)}</span>
      </div>
      <div class="search-stat">
        <span class="search-stat-label">Payback</span>
        <span class="roi-badge ${roiClass(row.roi)}">${fmtYears(row.roi)}</span>
      </div>
    </article>
  `).join("");
}

function renderActiveTab() {
  renderTabs();
  if (state.activeTab === "roi") {
    renderRoiTab();
    return;
  }
  if (state.activeTab === "compare") {
    renderCompareTable();
    return;
  }
  if (state.activeTab === "trends") {
    renderTrendsTab();
    return;
  }
  renderSearchTab();
}

function wireTabs() {
  $$(".tab-btn").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tab;
      requestAnimationFrame(renderActiveTab);
    });
  });
}

function wireCompareControls() {
  $("#compareDistrictA").addEventListener("change", renderCompareTable);
  $("#compareDistrictB").addEventListener("change", renderCompareTable);
  $("#compareArea").addEventListener("change", renderCompareTable);
}

function wireTrendControls() {
  $("#trendProjectSearch").addEventListener("input", (event) => {
    state.trendSearch = event.target.value || "";
    buildTrendChecklist();
  });

  $(".metric-switch").addEventListener("click", (event) => {
    const button = event.target.closest(".metric-btn");
    if (!button) return;
    state.trendMetric = button.dataset.metric;
    $$(".metric-btn").forEach((item) => item.classList.toggle("active", item === button));
    renderTrendsTab();
  });

  $("#trendProjectList").addEventListener("change", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !input.classList.contains("trend-check")) return;
    if (input.checked && state.trendSelection.size >= 4) {
      input.checked = false;
      alert("Select up to 4 projects at a time.");
      return;
    }
    if (input.checked) state.trendSelection.add(input.value);
    else state.trendSelection.delete(input.value);
    renderTrendsTab();
  });
}

function wireSearchControls() {
  ["searchBeds", "searchArea", "searchTenure", "searchDistrict"].forEach((id) => {
    $(`#${id}`).addEventListener("change", renderSearchTab);
  });
  ["searchBudgetMin", "searchBudgetMax"].forEach((id) => {
    $(`#${id}`).addEventListener("input", debounce(renderSearchTab, 150));
  });
}

function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(null, args), ms);
  };
}

function parseCsvRows() {
  return new Promise((resolve, reject) => {
    Papa.parse(CSV_PATH, {
      header: true,
      download: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      complete: (result) => resolve(result.data),
      error: reject
    });
  });
}

async function init() {
  try {
    const rows = await parseCsvRows();
    initState(rows);
    fillControls();
    renderOverview();
    wireTabs();
    wireCompareControls();
    wireTrendControls();
    wireSearchControls();
    renderActiveTab();
  } catch (error) {
    console.error(error);
    alert("Failed to load the condo payback dataset.");
  }
}

document.addEventListener("DOMContentLoaded", init);
