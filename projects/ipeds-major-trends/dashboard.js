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

  function majorKey(row, index = 0) {
    return `${row.major_4digit || "major"}-${index}`;
  }

  function signedNumber(value, digits = 0) {
    if (value === null || value === undefined) return "-";
    const sign = value > 0 ? "+" : value < 0 ? "-" : "";
    const abs = Math.abs(value);
    return `${sign}${abs.toLocaleString(undefined, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    })}`;
  }

  function metricLabel(metric, value) {
    if (metric === "pct_change") {
      return value === null || value === undefined ? "-" : `${signedNumber(value, 1)}%`;
    }
    return signedNumber(value, 0);
  }

  function movementClass(delta) {
    if (delta > 0) return "positive";
    if (delta < 0) return "negative";
    return "neutral";
  }

  function movementText(delta) {
    return delta > 0 ? `+${delta}` : `${delta}`;
  }

  function movementTitle(delta) {
    if (delta > 0) return `Moved up ${delta} rank${delta === 1 ? "" : "s"}`;
    if (delta < 0) return `Dropped ${Math.abs(delta)} rank${Math.abs(delta) === 1 ? "" : "s"}`;
    return "No rank change";
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
      font: { family: "Manrope, Segoe UI, sans-serif", size: 14, color: "#1f2937" },
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
    const container = document.getElementById("chart-slopegraph");
    if (!container) return;

    const top20 = state.nationalChange
      .slice()
      .sort((a, b) => score(b.count_2013) - score(a.count_2013))
      .slice(0, 20);

    const rank2013 = Object.fromEntries(top20.map((r, i) => [r.major_name, i + 1]));
    const top20By2023 = [...top20].sort((a, b) => score(b.count_2023) - score(a.count_2023));
    const rank2023 = Object.fromEntries(top20By2023.map((r, i) => [r.major_name, i + 1]));

    container.classList.add("infographic-shell");
    container.innerHTML = "";

    const board = document.createElement("div");
    board.className = "rank-dumbbell";

    const head = document.createElement("div");
    head.className = "rank-dumbbell-head";
    ["2013 Rank", "Major", "Shift", "2023 Rank"].forEach((label) => {
      const span = document.createElement("span");
      span.textContent = label;
      head.appendChild(span);
    });
    board.appendChild(head);

    top20.forEach((row, index) => {
      const rankStart = rank2013[row.major_name];
      const rankEnd = rank2023[row.major_name];
      const delta = rankStart - rankEnd;
      const moveClass = movementClass(delta);

      const rowEl = document.createElement("div");
      rowEl.className = "rank-dumbbell-row";
      rowEl.dataset.majorKey = majorKey(row, index);
      rowEl.title = `${row.major_name}: 2013 rank ${rankStart}, 2023 rank ${rankEnd}`;

      const leftPill = document.createElement("div");
      leftPill.className = "rank-pill rank-pill-left";
      leftPill.innerHTML = `<span class="rank-label">2013</span><span class="rank-value">${rankStart}</span>`;

      const nameEl = document.createElement("div");
      nameEl.className = "rank-major-name";
      nameEl.textContent = row.major_name;

      const movementWrap = document.createElement("div");
      movementWrap.className = "rank-movement";
      const movementChip = document.createElement("span");
      movementChip.className = `movement-chip ${moveClass}`;
      movementChip.textContent = movementText(delta);
      movementChip.title = movementTitle(delta);
      movementWrap.appendChild(movementChip);

      const trackWrap = document.createElement("div");
      trackWrap.className = "rank-track-wrap";
      const track = document.createElement("div");
      track.className = "rank-track";
      const fill = document.createElement("div");
      fill.className = `rank-track-fill ${moveClass}`;
      track.appendChild(fill);

      const rightPill = document.createElement("div");
      rightPill.className = "rank-pill rank-pill-right";
      rightPill.innerHTML = `<span class="rank-label">2023</span><span class="rank-value">${rankEnd}</span>`;

      trackWrap.appendChild(track);
      trackWrap.appendChild(rightPill);

      rowEl.appendChild(leftPill);
      rowEl.appendChild(nameEl);
      rowEl.appendChild(movementWrap);
      rowEl.appendChild(trackWrap);
      board.appendChild(rowEl);
    });

    container.appendChild(board);
  }

  function renderNationalRankings() {
    const container = document.getElementById("chart-ranking");
    if (!container) return;

    const metricEl = document.getElementById("ranking-metric-select");
    const metric = metricEl ? metricEl.value : "gross_change";
    const rows = state.nationalChange.slice().sort((a, b) => score(b[metric]) - score(a[metric]));

    container.classList.add("ranking-shell");
    container.innerHTML = "";

    const values = rows.map((r) => r[metric]).filter((v) => v !== null && v !== undefined);
    const maxAbs = Math.max(1, ...values.map((v) => Math.abs(v)));

    const board = document.createElement("div");
    board.className = "ranking-board";

    const axis = document.createElement("div");
    axis.className = "ranking-axis";

    const labelHead = document.createElement("div");
    labelHead.className = "ranking-axis-label";
    labelHead.textContent = "Major";

    const scale = document.createElement("div");
    scale.className = "ranking-axis-scale";
    const scaleMeta = document.createElement("div");
    scaleMeta.className = "ranking-axis-meta";
    scaleMeta.innerHTML = "<span>Negative change</span><span>0</span><span>Positive change</span>";
    scale.appendChild(scaleMeta);

    const valueHead = document.createElement("div");
    valueHead.className = "ranking-axis-label ranking-value-head";
    valueHead.textContent = metric === "gross_change" ? "Gross Change" : "Percent Change";

    axis.appendChild(labelHead);
    axis.appendChild(scale);
    axis.appendChild(valueHead);
    board.appendChild(axis);

    rows.forEach((row, index) => {
      const value = row[metric] ?? 0;
      const magnitude = Math.abs(value);
      const widthPct = magnitude === 0 ? 0 : Math.max(1.25, (magnitude / maxAbs) * 50);
      const signClass = movementClass(value);

      const rowEl = document.createElement("div");
      rowEl.className = "ranking-row";
      rowEl.dataset.majorKey = majorKey(row, index);
      rowEl.title = `${row.major_name}: ${metricLabel(metric, value)}`;

      const label = document.createElement("div");
      label.className = "ranking-label";
      label.textContent = row.major_name;

      const barArea = document.createElement("div");
      barArea.className = "ranking-bar-area";
      const bar = document.createElement("div");
      bar.className = `ranking-bar ${value === 0 ? "neutral" : signClass}`;
      if (value !== 0) {
        bar.style.setProperty("--bar-width", widthPct.toFixed(2));
      }
      barArea.appendChild(bar);

      const valueEl = document.createElement("div");
      valueEl.className = `ranking-value ${value === 0 ? "neutral" : signClass}`;
      valueEl.textContent = metricLabel(metric, value);

      rowEl.appendChild(label);
      rowEl.appendChild(barArea);
      rowEl.appendChild(valueEl);
      board.appendChild(rowEl);
    });

    container.appendChild(board);
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

    if (rows.length === 0) {
      Plotly.newPlot("chart-us-map", [], baseLayout({
        title: { text: `State Percent Change: ${major === "ALL" ? "All Majors" : major}` },
        annotations: [{
          text: "No map data available for this selection.",
          x: 0.5,
          y: 0.5,
          xref: "paper",
          yref: "paper",
          showarrow: false,
          font: { size: 18, color: "#6b7280" }
        }],
        margin: { l: 6, r: 6, t: 52, b: 8 },
        height: 900
      }), { responsive: true, displayModeBar: false });
      return;
    }

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
        projection: { type: "albers usa", scale: 1.4 },
        showlakes: false,
        bgcolor: "rgba(0,0,0,0)",
        fitbounds: "locations",
        domain: { x: [0.01, 0.99], y: [0, 1] }
      },
      margin: { l: 6, r: 6, t: 50, b: 8 },
      height: 900
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
      legend: { orientation: "h", y: 1.1, x: 0 },
      hovermode: "x unified",
      height: 690
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

  function renderTab(tab) {
    if (tab === "main") {
      renderMainInfographic();
      return;
    }
    if (tab === "rankings") {
      renderNationalRankings();
      return;
    }
    if (tab === "map") {
      renderMap();
      return;
    }
    if (tab === "trend") {
      renderTrend();
      return;
    }
    if (tab === "states") {
      renderStateTrends();
    }
  }

  function wireTabs() {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
        document.querySelectorAll(".tab-pane").forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        document.querySelector(`.tab-pane[data-tab="${tab}"]`).classList.add("active");
        requestAnimationFrame(() => renderTab(tab));
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
      renderTrend();
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
    const rankingMetric = document.getElementById("ranking-metric-select");
    if (rankingMetric) rankingMetric.addEventListener("change", renderNationalRankings);

    const mapMajor = document.getElementById("map-major-select");
    if (mapMajor) mapMajor.addEventListener("change", renderMap);

    const trendMetric = document.getElementById("trend-select");
    if (trendMetric) trendMetric.addEventListener("change", renderTrend);

    const stateMajor = document.getElementById("state-major-select");
    if (stateMajor) stateMajor.addEventListener("change", renderStateTrends);

    const stateMetric = document.getElementById("state-metric-select");
    if (stateMetric) stateMetric.addEventListener("change", renderStateTrends);

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
      renderMainInfographic();
    } catch (err) {
      console.error(err);
      alert(`Dashboard failed to initialize: ${err.message}`);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
