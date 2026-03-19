(function () {
  "use strict";

  const FILES = {
    nationalChange: "./data/major_change_national_2013_2023.csv",
    stateChange: "./data/major_change_state_2013_2023.csv",
    nationalAnnual: "./data/major_trend_national_annual.csv",
    stateAnnual: "./data/major_trend_state_annual.csv"
  };

  const state = {
    nationalChange: [],
    stateChange: [],
    nationalAnnual: [],
    stateAnnual: []
  };

  const num = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const asBool = (v) => String(v).toLowerCase() === "true";
  const moneyish = (v) => (v === null || v === undefined ? "-" : Math.round(v).toLocaleString());
  const pct = (v, d = 1) => (v === null || v === undefined ? "-" : `${v.toFixed(d)}%`);
  const score = (v) => (v === null || v === undefined ? Number.NEGATIVE_INFINITY : v);

  function baseLayout(extra = {}) {
    return {
      margin: { l: 40, r: 20, t: 30, b: 40 },
      paper_bgcolor: "white",
      plot_bgcolor: "white",
      font: { family: "Segoe UI, sans-serif", size: 12, color: "#1f2937" },
      ...extra
    };
  }

  function parseRows(rows) {
    return rows.filter((r) => r && Object.keys(r).length > 0).map((r) => ({
      ...r,
      count_2013: num(r.count_2013),
      count_2023: num(r.count_2023),
      gross_change: num(r.gross_change),
      pct_change: num(r.pct_change),
      graduates: num(r.graduates),
      year: num(r.year),
      share_of_total: num(r.share_of_total),
      low_base_flag: asBool(r.low_base_flag)
    }));
  }

  async function loadCSV(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}: ${response.status}`);
    const text = await response.text();
    const parsed = Papa.parse(text, { header: true, dynamicTyping: false });
    return parseRows(parsed.data);
  }

  function filteredNational() {
    const includeLowBase = document.getElementById("include-low-base").checked;
    return state.nationalChange.filter((r) => includeLowBase || !r.low_base_flag);
  }

  function filteredStateForMajor(majorName) {
    const includeLowBase = document.getElementById("include-low-base").checked;
    return state.stateChange.filter((r) => r.major_name === majorName && (includeLowBase || !r.low_base_flag));
  }

  function getMetric() {
    return document.getElementById("metric-select").value;
  }

  function getMajor() {
    return document.getElementById("major-select").value;
  }

  function renderSlopegraph() {
    const rows = filteredNational()
      .slice()
      .sort((a, b) => score(b.count_2013) - score(a.count_2013))
      .slice(0, 20);

    const rightRank = [...rows].sort((a, b) => score(b.count_2023) - score(a.count_2023));
    const rightIndex = Object.fromEntries(rightRank.map((r, i) => [r.major_name, i + 1]));

    const traces = rows.map((r, i) => {
      const leftY = i + 1;
      const rightY = rightIndex[r.major_name] || leftY;
      const color = (r.gross_change || 0) >= 0 ? "#059669" : "#dc2626";
      return {
        x: [0, 1],
        y: [leftY, rightY],
        mode: "lines+markers",
        type: "scatter",
        line: { width: 2 + Math.min(Math.abs((r.gross_change || 0) / 100000), 5), color },
        marker: { size: 7, color },
        hovertemplate:
          `<b>${r.major_name}</b><br>` +
          `2013: ${moneyish(r.count_2013)}<br>` +
          `2023: ${moneyish(r.count_2023)}<br>` +
          `Gross: ${moneyish(r.gross_change)}<br>` +
          `Pct: ${pct(r.pct_change)}<extra></extra>`,
        showlegend: false
      };
    });

    const annotations = [];
    rows.forEach((r, i) => {
      const leftY = i + 1;
      const rightY = rightIndex[r.major_name] || leftY;
      annotations.push({
        x: -0.03,
        y: leftY,
        text: `${i + 1}. ${r.major_name} (${moneyish(r.count_2013)})`,
        xref: "x",
        yref: "y",
        xanchor: "right",
        showarrow: false,
        font: { size: 11, color: "#111827" }
      });
      annotations.push({
        x: 1.03,
        y: rightY,
        text: `${moneyish(r.count_2023)} | ${moneyish(r.gross_change)} | ${pct(r.pct_change)}`,
        xref: "x",
        yref: "y",
        xanchor: "left",
        showarrow: false,
        font: { size: 11, color: "#111827" }
      });
    });
    annotations.push({
      x: 0,
      y: 0,
      text: "<b>2013 Rank</b>",
      showarrow: false,
      xanchor: "center"
    });
    annotations.push({
      x: 1,
      y: 0,
      text: "<b>2023 Value | Gross | %</b>",
      showarrow: false,
      xanchor: "center"
    });

    Plotly.newPlot("chart-slopegraph", traces, baseLayout({
      title: { text: "Infographic Slopegraph: Top 20 Majors by 2013 Graduates" },
      xaxis: { visible: false, range: [-0.35, 1.35] },
      yaxis: { autorange: "reversed", showgrid: false, zeroline: false, ticks: "", showticklabels: false },
      annotations,
      margin: { l: 260, r: 260, t: 40, b: 30 }
    }), { responsive: true, displayModeBar: false });
  }

  function renderRankings() {
    const metric = getMetric();
    const rows = filteredNational().slice().sort((a, b) => score(b[metric]) - score(a[metric]));
    const top = rows.slice(0, 25);

    Plotly.newPlot("chart-ranking", [
      {
        type: "bar",
        orientation: "h",
        y: top.map((r) => r.major_name).reverse(),
        x: top.map((r) => r[metric]).reverse(),
        marker: { color: top.map((r) => ((r[metric] ?? 0) >= 0 ? "#059669" : "#dc2626")).reverse() },
        hovertemplate:
          "<b>%{y}</b><br>" +
          (metric === "gross_change" ? "Gross change: %{x:,.0f}" : "Percent change: %{x:.1f}%") +
          "<extra></extra>"
      }
    ], baseLayout({
      title: { text: `Top 25 Majors by ${metric === "gross_change" ? "Gross" : "Percent"} Change` },
      xaxis: { title: metric === "gross_change" ? "Graduates" : "Percent" },
      margin: { l: 250, r: 20, t: 40, b: 40 }
    }), { responsive: true, displayModeBar: false });

    const values = rows.map((r) => r[metric]).filter((v) => v !== null);
    Plotly.newPlot("chart-distribution", [
      {
        type: "histogram",
        x: values,
        nbinsx: 30,
        marker: { color: "#0ea5e9" },
        hovertemplate: "Bin count: %{y}<br>Value: %{x}<extra></extra>"
      }
    ], baseLayout({
      title: { text: `${metric === "gross_change" ? "Gross" : "Percent"} Change Distribution` },
      xaxis: { title: metric === "gross_change" ? "Graduates" : "Percent" },
      yaxis: { title: "Majors" }
    }), { responsive: true, displayModeBar: false });
  }

  function renderMap() {
    const major = getMajor();
    const rows = filteredStateForMajor(major).filter((r) => r.state_abbr && r.state_abbr !== "UNK" && r.pct_change !== null);
    const maxAbs = Math.max(...rows.map((r) => Math.abs(r.pct_change)), 10);

    Plotly.newPlot("chart-us-map", [
      {
        type: "choropleth",
        locationmode: "USA-states",
        locations: rows.map((r) => r.state_abbr),
        z: rows.map((r) => r.pct_change),
        zmin: -maxAbs,
        zmax: maxAbs,
        colorscale: "RdBu",
        reversescale: true,
        marker: { line: { color: "white", width: 0.6 } },
        colorbar: { title: "% Change" },
        customdata: rows.map((r) => [
          r.count_2013,
          r.count_2023,
          r.gross_change,
          r.low_base_flag ? "Yes" : "No"
        ]),
        hovertemplate:
          "<b>%{location}</b><br>" +
          "2013: %{customdata[0]:,.0f}<br>" +
          "2023: %{customdata[1]:,.0f}<br>" +
          "Gross: %{customdata[2]:,.0f}<br>" +
          "Percent: %{z:.1f}%<br>" +
          "Low base: %{customdata[3]}<extra></extra>"
      }
    ], baseLayout({
      title: { text: `State Percent Change for ${major} (2013 to 2023)` },
      geo: {
        scope: "usa",
        projection: { type: "albers usa" },
        showlakes: false,
        bgcolor: "rgba(0,0,0,0)"
      },
      margin: { l: 20, r: 20, t: 50, b: 10 }
    }), { responsive: true, displayModeBar: false });
  }

  function renderTrend() {
    const major = getMajor();
    const trendMetric = document.getElementById("trend-select").value;
    const overlayState = document.getElementById("state-overlay-select").value;

    const national = state.nationalAnnual
      .filter((r) => r.major_name === major)
      .sort((a, b) => a.year - b.year);

    const traces = [
      {
        type: "scatter",
        mode: "lines+markers",
        x: national.map((r) => r.year),
        y: national.map((r) => r[trendMetric]),
        name: "National",
        line: { color: "#0f766e", width: 3 },
        marker: { size: 7 }
      }
    ];

    if (overlayState !== "all") {
      const stateRows = state.stateAnnual
        .filter((r) => r.major_name === major && r.state_abbr === overlayState)
        .sort((a, b) => a.year - b.year);
      traces.push({
        type: "scatter",
        mode: "lines+markers",
        x: stateRows.map((r) => r.year),
        y: stateRows.map((r) => r[trendMetric]),
        name: overlayState,
        line: { color: "#0369a1", width: 2, dash: "dot" },
        marker: { size: 6 }
      });
    }

    Plotly.newPlot("chart-trend", traces, baseLayout({
      title: { text: `${major}: ${trendMetric === "graduates" ? "Graduate Count" : "Share of Total"} Trend` },
      xaxis: { title: "Year", dtick: 1 },
      yaxis: { title: trendMetric === "graduates" ? "Graduates" : "Share", tickformat: trendMetric === "graduates" ? ",.0f" : ".2%" }
    }), { responsive: true, displayModeBar: false });
  }

  function renderStateTable() {
    const metric = getMetric();
    const major = getMajor();
    const rows = filteredStateForMajor(major).slice().sort((a, b) => score(b[metric]) - score(a[metric]));
    const tbody = document.getElementById("state-table-body");
    tbody.innerHTML = "";

    rows.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.state_abbr}</td>
        <td>${moneyish(r.count_2013)}</td>
        <td>${moneyish(r.count_2023)}</td>
        <td style="color:${(r.gross_change ?? 0) >= 0 ? "#059669" : "#dc2626"}">${moneyish(r.gross_change)}</td>
        <td style="color:${(r.pct_change ?? 0) >= 0 ? "#059669" : "#dc2626"}">${pct(r.pct_change)}</td>
        <td>${r.low_base_flag ? "Yes" : "No"}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderAll() {
    renderSlopegraph();
    renderRankings();
    renderMap();
    renderTrend();
    renderStateTable();
  }

  function wireTabs() {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
        document.querySelectorAll(".tab-pane").forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        document.querySelector(`.tab-pane[data-tab="${tab}"]`).classList.add("active");
      });
    });
  }

  function wireControls() {
    ["major-select", "metric-select", "trend-select", "state-overlay-select", "include-low-base"].forEach((id) => {
      document.getElementById(id).addEventListener("change", renderAll);
    });
  }

  function populateControls() {
    const majorSelect = document.getElementById("major-select");
    const majors = [...new Set(state.nationalChange.map((r) => r.major_name))].sort((a, b) => a.localeCompare(b));
    majorSelect.innerHTML = "";
    majors.forEach((m) => {
      const option = document.createElement("option");
      option.value = m;
      option.textContent = m;
      majorSelect.appendChild(option);
    });

    // Default major: top growing major nationally
    const defaultMajorRow = state.nationalChange
      .filter((r) => !r.low_base_flag)
      .sort((a, b) => score(b.gross_change) - score(a.gross_change))[0];
    if (defaultMajorRow) majorSelect.value = defaultMajorRow.major_name;

    const stateSelect = document.getElementById("state-overlay-select");
    const stateCodes = [...new Set(state.stateAnnual.map((r) => r.state_abbr))]
      .filter((s) => s && s !== "UNK")
      .sort();
    stateSelect.innerHTML = `<option value="all">National Only</option>` + stateCodes.map((s) => `<option value="${s}">${s}</option>`).join("");
  }

  async function init() {
    try {
      const [nationalChange, stateChange, nationalAnnual, stateAnnual] = await Promise.all([
        loadCSV(FILES.nationalChange),
        loadCSV(FILES.stateChange),
        loadCSV(FILES.nationalAnnual),
        loadCSV(FILES.stateAnnual)
      ]);
      state.nationalChange = nationalChange;
      state.stateChange = stateChange;
      state.nationalAnnual = nationalAnnual;
      state.stateAnnual = stateAnnual;

      populateControls();
      wireTabs();
      wireControls();
      renderAll();
    } catch (err) {
      console.error(err);
      alert(`Dashboard failed to initialize: ${err.message}`);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
