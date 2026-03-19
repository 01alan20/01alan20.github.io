(function () {
  "use strict";

  const FILES = {
    nationalChange: "./data/major_change_national_2013_2023.csv",
    stateChange: "./data/major_change_state_2013_2023.csv",
    nationalAnnual: "./data/major_trend_national_annual.csv"
  };

  const VALID_STATES = new Set([
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
  ]);

  const state = {
    nationalChange: [],
    stateChange: [],
    nationalAnnual: [],
    trendSelection: new Set(["ALL"])
  };

  const num = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const score = (v) => (v === null || v === undefined ? Number.NEGATIVE_INFINITY : v);
  const moneyish = (v) => (v === null || v === undefined ? "-" : Math.round(v).toLocaleString());
  const pct = (v, d = 1) => (v === null || v === undefined ? "-" : `${v.toFixed(d)}%`);

  function toTitleCase(input) {
    const lowerWords = new Set(["and", "or", "of", "the", "in", "to", "for", "on", "with", "by"]);
    return String(input || "")
      .toLowerCase()
      .split(" ")
      .map((word, idx) => {
        if (idx > 0 && lowerWords.has(word)) return word;
        if (!word) return word;
        return word[0].toUpperCase() + word.slice(1);
      })
      .join(" ")
      .replace(/\bUsa\b/g, "USA")
      .replace(/\bIpeds\b/g, "IPEDS");
  }

  function shortName(name, max = 56) {
    if (!name) return "";
    return name.length <= max ? name : `${name.slice(0, max - 1)}…`;
  }

  function isValidYear(y) {
    return Number.isInteger(y) && y >= 2013 && y <= 2023;
  }

  function parseRows(rows) {
    return rows
      .filter((r) => r && Object.keys(r).length > 0)
      .map((r) => ({
        ...r,
        major_name: toTitleCase(r.major_name),
        state_abbr: (r.state_abbr || "").toUpperCase(),
        count_2013: num(r.count_2013),
        count_2023: num(r.count_2023),
        gross_change: num(r.gross_change),
        pct_change: num(r.pct_change),
        year: num(r.year),
        graduates: num(r.graduates),
        share_of_total: num(r.share_of_total)
      }));
  }

  async function loadCSV(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}: ${response.status}`);
    const text = await response.text();
    const parsed = Papa.parse(text, { header: true, dynamicTyping: false });
    return parseRows(parsed.data);
  }

  function baseLayout(extra = {}) {
    return {
      margin: { l: 60, r: 20, t: 50, b: 40 },
      paper_bgcolor: "white",
      plot_bgcolor: "white",
      font: { family: "Segoe UI, sans-serif", size: 13, color: "#1f2937" },
      ...extra
    };
  }

  function majorList() {
    return [...new Set(state.nationalChange.map((r) => r.major_name))].sort((a, b) => a.localeCompare(b));
  }

  function getMapMajor() {
    const el = document.getElementById("map-major-select");
    return el ? el.value : "ALL";
  }

  function getStateMajor() {
    const el = document.getElementById("state-major-select");
    return el ? el.value : "ALL";
  }

  function getTrendMajors() {
    const selected = [...state.trendSelection];
    if (selected.length === 0 || selected.includes("ALL")) return ["ALL"];
    return selected;
  }

  function renderMainInfographic() {
    const top20 = state.nationalChange
      .slice()
      .sort((a, b) => score(b.count_2013) - score(a.count_2013))
      .slice(0, 20);

    const rank2013 = Object.fromEntries(top20.map((r, i) => [r.major_name, i + 1]));
    const top20By2023 = [...top20].sort((a, b) => score(b.count_2023) - score(a.count_2023));
    const rank2023 = Object.fromEntries(top20By2023.map((r, i) => [r.major_name, i + 1]));

    const traces = top20.map((r) => {
      const y0 = rank2013[r.major_name];
      const y1 = rank2023[r.major_name];
      const color = (r.gross_change ?? 0) >= 0 ? "#059669" : "#dc2626";
      return {
        type: "scatter",
        mode: "lines+markers",
        x: [0.22, 0.78],
        y: [y0, y1],
        line: { color, width: 2.5 },
        marker: { color, size: 7 },
        hovertemplate:
          `<b>${r.major_name}</b><br>` +
          `2013 Rank: ${y0}<br>` +
          `2023 Rank: ${y1}<br>` +
          `Gross Change: ${moneyish(r.gross_change)}<br>` +
          `Percent Change: ${pct(r.pct_change)}<extra></extra>`,
        showlegend: false
      };
    });

    const annotations = [];
    top20.forEach((r) => {
      annotations.push({
        x: 0.02,
        xref: "paper",
        y: rank2013[r.major_name],
        yref: "y",
        text: shortName(r.major_name),
        xanchor: "left",
        showarrow: false,
        font: { size: 12 }
      });
      annotations.push({
        x: 0.98,
        xref: "paper",
        y: rank2023[r.major_name],
        yref: "y",
        text: shortName(r.major_name),
        xanchor: "right",
        showarrow: false,
        font: { size: 12 }
      });
    });
    annotations.push({ x: 0.02, xref: "paper", y: 0, text: "<b>2013 Ranking</b>", showarrow: false, xanchor: "left" });
    annotations.push({ x: 0.98, xref: "paper", y: 0, text: "<b>2023 Ranking</b>", showarrow: false, xanchor: "right" });

    Plotly.newPlot("chart-slopegraph", traces, baseLayout({
      title: { text: "Major Ranking Shift: Top 20 (2013 to 2023)" },
      xaxis: { visible: false, range: [0, 1] },
      yaxis: { autorange: "reversed", showgrid: false, zeroline: false, showticklabels: false },
      annotations,
      margin: { l: 70, r: 70, t: 50, b: 20 },
      height: 1020
    }), { responsive: true, displayModeBar: false });
  }

  function renderNationalRankings() {
    const metricEl = document.getElementById("ranking-metric-select");
    const metric = metricEl ? metricEl.value : "gross_change";
    const rows = state.nationalChange.slice().sort((a, b) => score(b[metric]) - score(a[metric]));

    const x = rows.map((r) => r[metric]);
    const y = rows.map((r) => r.major_name);
    const colors = x.map((v) => (v >= 0 ? "#059669" : "#dc2626"));
    const maxAbs = Math.max(10, ...x.filter((v) => v !== null).map((v) => Math.abs(v)));

    Plotly.newPlot("chart-ranking", [
      {
        type: "bar",
        orientation: "h",
        x,
        y,
        marker: { color: colors },
        hovertemplate:
          "<b>%{y}</b><br>" +
          (metric === "gross_change" ? "Gross Change: %{x:,.0f}" : "Percent Change: %{x:.1f}%") +
          "<extra></extra>"
      }
    ], baseLayout({
      title: { text: `All Majors by ${metric === "gross_change" ? "Gross Change" : "Percent Change"} (2013 to 2023)` },
      xaxis: {
        title: metric === "gross_change" ? "Graduates" : "Percent",
        zeroline: true,
        zerolinecolor: "#111827",
        range: [-maxAbs * 1.05, maxAbs * 1.05]
      },
      yaxis: { automargin: true, autorange: "reversed" },
      margin: { l: 500, r: 30, t: 50, b: 40 },
      height: Math.max(900, rows.length * 22)
    }), { responsive: true, displayModeBar: false });
  }

  function mapRowsForMajor(major) {
    const baseRows = state.stateChange.filter((r) => VALID_STATES.has(r.state_abbr));
    if (major === "ALL") {
      const grouped = {};
      baseRows.forEach((r) => {
        if (!grouped[r.state_abbr]) grouped[r.state_abbr] = { state_abbr: r.state_abbr, count_2013: 0, count_2023: 0 };
        grouped[r.state_abbr].count_2013 += r.count_2013 || 0;
        grouped[r.state_abbr].count_2023 += r.count_2023 || 0;
      });
      return Object.values(grouped).map((r) => {
        const gross = r.count_2023 - r.count_2013;
        const pctChange = r.count_2013 > 0 ? (gross / r.count_2013) * 100 : null;
        return { ...r, gross_change: gross, pct_change: pctChange };
      });
    }
    return baseRows.filter((r) => r.major_name === major);
  }

  function renderMap() {
    const major = getMapMajor();
    const rows = mapRowsForMajor(major).filter((r) => r.pct_change !== null);
    const maxAbs = Math.max(10, ...rows.map((r) => Math.abs(r.pct_change)));

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
        marker: { line: { color: "white", width: 0.7 } },
        colorbar: { title: "% Change", len: 0.86, thickness: 20 },
        customdata: rows.map((r) => [r.count_2013, r.count_2023, r.gross_change]),
        hovertemplate:
          "<b>%{location}</b><br>" +
          "2013: %{customdata[0]:,.0f}<br>" +
          "2023: %{customdata[1]:,.0f}<br>" +
          "Gross: %{customdata[2]:,.0f}<br>" +
          "Percent: %{z:.1f}%<extra></extra>"
      }
    ], baseLayout({
      title: { text: `State Percent Change: ${major === "ALL" ? "All Majors" : major}` },
      geo: {
        scope: "usa",
        projection: { type: "albers usa" },
        showlakes: false,
        bgcolor: "rgba(0,0,0,0)",
        fitbounds: "locations",
        domain: { x: [0, 1], y: [0, 1] }
      },
      margin: { l: 6, r: 6, t: 50, b: 8 },
      height: 760
    }), { responsive: true, displayModeBar: false });
  }

  function renderTrend() {
    const majors = getTrendMajors();
    const trendEl = document.getElementById("trend-select");
    const trendMetric = trendEl ? trendEl.value : "graduates";

    const traces = majors.map((major) => {
      let rows;
      if (major === "ALL") {
        const grouped = {};
        state.nationalAnnual.forEach((r) => {
          if (!isValidYear(r.year)) return;
          if (!grouped[r.year]) grouped[r.year] = { year: r.year, graduates: 0 };
          grouped[r.year].graduates += r.graduates || 0;
        });
        rows = Object.values(grouped).sort((a, b) => a.year - b.year);
      } else {
        rows = state.nationalAnnual
          .filter((r) => r.major_name === major && isValidYear(r.year))
          .sort((a, b) => a.year - b.year);
      }

      return {
        type: "scatter",
        mode: "lines+markers",
        x: rows.map((r) => r.year),
        y: rows.map((r) => {
          if (trendMetric === "graduates") return r.graduates;
          if (major === "ALL") return 1;
          return r.share_of_total;
        }),
        name: major === "ALL" ? "All Majors" : major
      };
    }).filter((t) => t.y.some((v) => v !== null && v !== undefined));

    Plotly.newPlot("chart-trend", traces, baseLayout({
      title: { text: `Trend Over Time (${trendMetric === "graduates" ? "Count" : "Share"})` },
      xaxis: { title: "Year", dtick: 1, tickmode: "linear", tick0: 2013, range: [2012.5, 2023.5] },
      yaxis: {
        title: trendMetric === "graduates" ? "Graduates" : "Share of Total",
        tickformat: trendMetric === "graduates" ? ",.0f" : ".2%"
      },
      height: 560
    }), { responsive: true, displayModeBar: false });
  }

  function stateRowsForMajor(major) {
    const baseRows = state.stateChange.filter((r) => VALID_STATES.has(r.state_abbr));
    if (major === "ALL") {
      const grouped = {};
      baseRows.forEach((r) => {
        if (!grouped[r.state_abbr]) grouped[r.state_abbr] = { state_abbr: r.state_abbr, count_2013: 0, count_2023: 0 };
        grouped[r.state_abbr].count_2013 += r.count_2013 || 0;
        grouped[r.state_abbr].count_2023 += r.count_2023 || 0;
      });
      return Object.values(grouped).map((r) => {
        const gross = r.count_2023 - r.count_2013;
        const p = r.count_2013 > 0 ? (gross / r.count_2013) * 100 : null;
        return { ...r, gross_change: gross, pct_change: p };
      });
    }
    return baseRows.filter((r) => r.major_name === major);
  }

  function renderStateTrends() {
    const major = getStateMajor();
    const metricEl = document.getElementById("state-metric-select");
    const metric = metricEl ? metricEl.value : "gross_change";
    const rows = stateRowsForMajor(major).slice().sort((a, b) => score(b[metric]) - score(a[metric]));

    Plotly.newPlot("chart-state-trends", [
      {
        type: "bar",
        orientation: "h",
        y: rows.map((r) => r.state_abbr),
        x: rows.map((r) => r[metric]),
        marker: { color: rows.map((r) => ((r[metric] ?? 0) >= 0 ? "#059669" : "#dc2626")) },
        hovertemplate:
          "<b>%{y}</b><br>" +
          (metric === "gross_change" ? "Gross Change: %{x:,.0f}" : "Percent Change: %{x:.1f}%") +
          "<extra></extra>"
      }
    ], baseLayout({
      title: { text: `State ${metric === "gross_change" ? "Gross" : "Percent"} Change: ${major === "ALL" ? "All Majors" : major}` },
      xaxis: { zeroline: true, zerolinecolor: "#111827" },
      yaxis: { autorange: "reversed" },
      margin: { l: 90, r: 20, t: 50, b: 40 },
      height: Math.max(600, rows.length * 12)
    }), { responsive: true, displayModeBar: false });

    const tbody = document.getElementById("state-table-body");
    if (!tbody) return;
    tbody.innerHTML = "";
    rows.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.state_abbr}</td>
        <td>${moneyish(r.count_2013)}</td>
        <td>${moneyish(r.count_2023)}</td>
        <td style="color:${(r.gross_change ?? 0) >= 0 ? "#059669" : "#dc2626"}">${moneyish(r.gross_change)}</td>
        <td style="color:${(r.pct_change ?? 0) >= 0 ? "#059669" : "#dc2626"}">${pct(r.pct_change)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderAll() {
    renderMainInfographic();
    renderNationalRankings();
    renderMap();
    renderTrend();
    renderStateTrends();
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

  function wireTrendChecklistBehavior() {
    const container = document.getElementById("trend-major-list");
    if (!container) return;
    container.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || !target.classList.contains("trend-major-check")) return;

      if (target.value === "ALL") {
        if (target.checked) {
          state.trendSelection = new Set(["ALL"]);
          container.querySelectorAll(".trend-major-check").forEach((cb) => {
            if (cb.value !== "ALL") cb.checked = false;
          });
        } else {
          target.checked = true;
        }
      } else {
        if (target.checked) {
          state.trendSelection.delete("ALL");
          state.trendSelection.add(target.value);
          const allBox = container.querySelector('.trend-major-check[value="ALL"]');
          if (allBox) allBox.checked = false;
        } else {
          state.trendSelection.delete(target.value);
        }
        if (state.trendSelection.size === 0) {
          state.trendSelection = new Set(["ALL"]);
          const allBox = container.querySelector('.trend-major-check[value="ALL"]');
          if (allBox) allBox.checked = true;
          container.querySelectorAll(".trend-major-check").forEach((cb) => {
            if (cb.value !== "ALL") cb.checked = false;
          });
        }
      }
      renderAll();
    });
  }

  function wireTrendSearch() {
    const input = document.getElementById("trend-major-search");
    if (!input) return;
    input.addEventListener("input", () => {
      buildTrendChecklist(majorList(), input.value.trim());
    });
  }

  function wireControls() {
    ["ranking-metric-select", "map-major-select", "trend-select", "state-major-select", "state-metric-select"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("change", renderAll);
    });
    wireTrendChecklistBehavior();
    wireTrendSearch();
  }

  function fillSelectWithAll(selectId, majors) {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = "";
    const allOpt = document.createElement("option");
    allOpt.value = "ALL";
    allOpt.textContent = "All";
    select.appendChild(allOpt);
    majors.forEach((m) => {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      select.appendChild(opt);
    });
  }

  function buildTrendChecklist(majors, search = "") {
    const container = document.getElementById("trend-major-list");
    if (!container) return;
    container.innerHTML = "";

    const mkItem = (value, label, checked = false) => {
      const wrap = document.createElement("label");
      wrap.className = "major-check-item";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.className = "trend-major-check";
      input.value = value;
      input.checked = checked;
      const text = document.createElement("span");
      text.textContent = label;
      wrap.appendChild(input);
      wrap.appendChild(text);
      return wrap;
    };

    const q = search.toLowerCase();
    const filtered = majors.filter((m) => m.toLowerCase().includes(q));
    if (state.trendSelection.size === 0) state.trendSelection = new Set(["ALL"]);

    container.appendChild(mkItem("ALL", "All", state.trendSelection.has("ALL")));
    filtered.forEach((m) => container.appendChild(mkItem(m, m, state.trendSelection.has(m))));
  }

  function initializeControls() {
    const majors = majorList();
    fillSelectWithAll("map-major-select", majors);
    fillSelectWithAll("state-major-select", majors);
    buildTrendChecklist(majors, "");
  }

  async function init() {
    try {
      const [nationalChange, stateChange, nationalAnnual] = await Promise.all([
        loadCSV(FILES.nationalChange),
        loadCSV(FILES.stateChange),
        loadCSV(FILES.nationalAnnual)
      ]);

      state.nationalChange = nationalChange;
      state.stateChange = stateChange.filter((r) => VALID_STATES.has(r.state_abbr));
      state.nationalAnnual = nationalAnnual.filter((r) => isValidYear(r.year));

      initializeControls();
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
