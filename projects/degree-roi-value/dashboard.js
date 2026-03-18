(function () {
  "use strict";

  const DATA_FILE = "./data/college_scorecard_roi.csv";

  const state = {
    allRows: [],
    filteredRows: [],
    currentRegion: "all",
    currentControl: "all",
  };

  const miss = (v) => v === undefined || v === null || String(v).trim() === "";
  const num = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const fmt = (v, d = 2) =>
    v === null || v === undefined
      ? "-"
      : Number(v).toLocaleString(undefined, { maximumFractionDigits: d });
  const money = (v) =>
    v === null || v === undefined ? "-" : `$${Math.round(v).toLocaleString()}`;

  const mean = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : null);
  const median = (a) => {
    if (!a.length) return null;
    const s = [...a].sort((x, y) => x - y);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  };

  const values = (rows, col) =>
    rows.map((r) => num(r[col])).filter((v) => v !== null);

  function baseLayout(extra) {
    return {
      margin: { l: 60, r: 20, t: 20, b: 50 },
      paper_bgcolor: "#fcfeff",
      plot_bgcolor: "transparent",
      font: { family: "Segoe UI, sans-serif", size: 12, color: "#1a2332" },
      ...extra,
    };
  }

  function plot(id, data, config) {
    Plotly.newPlot(id, data, baseLayout(config), {
      responsive: true,
      displayModeBar: false,
    });
  }

  function updateKPIs() {
    const rows = state.allRows;
    const roiScores = values(rows, "roi_value_score");
    const earnings = values(rows, "median_earnings_10yr");
    const completion = values(rows, "completion_rate");

    document.getElementById("kpi-institutions").textContent = rows.length.toLocaleString();
    document.getElementById("kpi-max-roi").textContent = fmt(Math.max(...roiScores), 1);
    document.getElementById("kpi-avg-earnings").textContent = money(mean(earnings));
    document.getElementById("kpi-completion").textContent = 
      fmt(median(completion) * 100, 1) + "%";
  }

  function renderSummary() {
    const rows = state.allRows;

    // ROI histogram
    plot(
      "chart-roi-hist",
      [
        {
          type: "histogram",
          x: values(rows, "roi_value_score"),
          marker: { color: "#2563eb" },
          nbinsx: 16,
        },
      ],
      {
        xaxis: { title: "ROI Value Score" },
        yaxis: { title: "Number of Institutions" },
      }
    );

    // Earnings to Cost Ratio scatter
    const costAndEarnings = rows
      .map((r) => ({
        cost: num(r.cost_of_attendance),
        earnings: num(r.median_earnings_10yr),
      }))
      .filter((d) => d.cost && d.earnings);

    const x = costAndEarnings.map((d) => d.cost);
    const y = costAndEarnings.map((d) => d.earnings);

    plot(
      "chart-earnings-cost",
      [
        {
          type: "scatter",
          mode: "markers",
          x,
          y,
          marker: {
            color: "#8b5cf6",
            size: 5,
            opacity: 0.6,
          },
          hovertemplate: "Cost: %{x:$,.0f}<br>10-Year Earnings: %{y:$,.0f}<extra></extra>",
        },
      ],
      {
        xaxis: { title: "Cost of Attendance", tickformat: "$,.0f" },
        yaxis: { title: "Median 10-Year Earnings", tickformat: "$,.0f" },
      }
    );
  }

  function renderValueMap() {
    const rows = state.allRows;

    // ROI by degree level
    const degreeCache = {};
    rows.forEach((r) => {
      const d = r.degree_level;
      if (!degreeCache[d]) {
        degreeCache[d] = [];
      }
      const roi = num(r.roi_value_score);
      if (roi !== null) degreeCache[d].push(roi);
    });

    const degreeData = Object.entries(degreeCache).map(([d, roiValues]) => ({
      degree: d,
      roi: mean(roiValues),
    }));

    plot(
      "chart-roi-degree",
      [
        {
          type: "bar",
          x: degreeData.map((d) => d.degree),
          y: degreeData.map((d) => d.roi),
          marker: { color: "#2563eb" },
        },
      ],
      {
        xaxis: { title: "Degree Level", tickangle: -25 },
        yaxis: { title: "Average ROI Value Score" },
        margin: { l: 60, r: 20, t: 20, b: 80 },
      }
    );

    // ROI by control type
    const controlCache = {};
    rows.forEach((r) => {
      const c = r.control_label;
      if (!controlCache[c]) {
        controlCache[c] = [];
      }
      const roi = num(r.roi_value_score);
      if (roi !== null) controlCache[c].push(roi);
    });

    const controlData = Object.entries(controlCache).map(([c, roiValues]) => ({
      control: c,
      roi: mean(roiValues),
    }));

    plot(
      "chart-roi-control",
      [
        {
          type: "bar",
          x: controlData.map((d) => d.control),
          y: controlData.map((d) => d.roi),
          marker: { color: "#8b5cf6" },
        },
      ],
      {
        xaxis: { title: "Institution Type" },
        yaxis: { title: "Average ROI Value Score" },
      }
    );
  }

  function renderCostEarnings() {
    const rows = state.allRows;

    // Cost vs Earnings scatter with completion color
    const scatter = rows
      .map((r) => ({
        cost: num(r.cost_of_attendance),
        earnings: num(r.median_earnings_10yr),
        completion: num(r.completion_rate) * 100,
        name: r.institution_name,
      }))
      .filter((d) => d.cost && d.earnings && d.completion);

    plot(
      "chart-cost-earnings-scatter",
      [
        {
          type: "scatter",
          mode: "markers",
          x: scatter.map((d) => d.cost),
          y: scatter.map((d) => d.earnings),
          marker: {
            size: 6,
            color: scatter.map((d) => d.completion),
            colorscale: "Viridis",
            showscale: true,
            colorbar: {
              title: "Completion %",
              thickness: 15,
              len: 0.7,
            },
          },
          text: scatter.map((d) => d.name),
          hovertemplate: "%{text}<br>Cost: %{x:$,.0f}<br>Earnings: %{y:$,.0f}<extra></extra>",
        },
      ],
      {
        xaxis: { title: "Cost of Attendance", tickformat: "$,.0f" },
        yaxis: { title: "Median 10-Year Earnings", tickformat: "$,.0f" },
        margin: { l: 60, r: 120, t: 20, b: 50 },
      }
    );

    // Earnings box plot by control
    const controlEarnings = {};
    rows.forEach((r) => {
      const c = r.control_label;
      if (!controlEarnings[c]) controlEarnings[c] = [];
      const e = num(r.median_earnings_10yr);
      if (e) controlEarnings[c].push(e);
    });

    const boxTraces = Object.entries(controlEarnings).map(([c, earnings]) => ({
      y: earnings,
      name: c,
      type: "box",
      boxpoints: false,
    }));

    plot(
      "chart-earnings-box",
      boxTraces,
      {
        yaxis: { title: "Median 10-Year Earnings", tickformat: "$,.0f" },
      }
    );

    // Cost by region
    const regionCosts = {};
    rows.forEach((r) => {
      const reg = r.region_label;
      if (!regionCosts[reg]) regionCosts[reg] = [];
      const c = num(r.cost_of_attendance);
      if (c) regionCosts[reg].push(c);
    });

    const regionData = Object.entries(regionCosts)
      .map(([region, costs]) => ({
        region,
        median: median(costs),
      }))
      .sort((a, b) => b.median - a.median);

    plot(
      "chart-cost-region",
      [
        {
          type: "bar",
          x: regionData.map((d) => d.region),
          y: regionData.map((d) => d.median),
          marker: { color: "#ec4899" },
        },
      ],
      {
        xaxis: { title: "Region", tickangle: -25 },
        yaxis: { title: "Median Cost of Attendance", tickformat: "$,.0f" },
        margin: { l: 60, r: 20, t: 20, b: 80 },
      }
    );
  }

  function renderDebtCompletion() {
    const rows = state.allRows;

    // Debt to earnings ratio vs completion
    const debtComp = rows
      .map((r) => ({
        ratio: num(r.debt_to_earnings_ratio),
        completion: num(r.completion_rate) * 100,
      }))
      .filter((d) => d.ratio && d.completion);

    plot(
      "chart-debt-completion",
      [
        {
          type: "scatter",
          mode: "markers",
          x: debtComp.map((d) => d.ratio),
          y: debtComp.map((d) => d.completion),
          marker: { color: "#f59e0b", size: 5, opacity: 0.6 },
        },
      ],
      {
        xaxis: { title: "Debt-to-Earnings Ratio" },
        yaxis: { title: "Completion Rate (%)" },
      }
    );

    // Median debt by degree
    const debtByDegree = {};
    rows.forEach((r) => {
      const d = r.degree_level;
      if (!debtByDegree[d]) debtByDegree[d] = [];
      const debt = num(r.median_debt);
      if (debt) debtByDegree[d].push(debt);
    });

    const debtDegreeData = Object.entries(debtByDegree).map(([d, debts]) => ({
      degree: d,
      median: median(debts),
    }));

    plot(
      "chart-debt-degree",
      [
        {
          type: "bar",
          x: debtDegreeData.map((d) => d.degree),
          y: debtDegreeData.map((d) => d.median),
          marker: { color: "#ef4444" },
        },
      ],
      {
        xaxis: { title: "Degree Level", tickangle: -25 },
        yaxis: { title: "Median Student Debt", tickformat: "$,.0f" },
        margin: { l: 60, r: 20, t: 20, b: 80 },
      }
    );

    // Repayment by control
    const repayByControl = {};
    rows.forEach((r) => {
      const c = r.control_label;
      if (!repayByControl[c]) repayByControl[c] = [];
      const rep = num(r.repayment_rate_3yr);
      if (rep) repayByControl[c].push(rep * 100);
    });

    const repayData = Object.entries(repayByControl).map(([c, rates]) => ({
      control: c,
      median: median(rates),
    }));

    plot(
      "chart-repayment",
      [
        {
          type: "bar",
          x: repayData.map((d) => d.control),
          y: repayData.map((d) => d.median),
          marker: { color: "#10b981" },
        },
      ],
      {
        xaxis: { title: "Institution Type" },
        yaxis: { title: "3-Year Repayment Rate (%)" },
      }
    );
  }

  function applyFilters() {
    const region = state.currentRegion;
    const control = state.currentControl;

    state.filteredRows = state.allRows.filter((r) => {
      if (region !== "all" && r.region_label !== region) return false;
      if (control !== "all" && r.control_label !== control) return false;
      return true;
    });

    renderDrilldown();
  }

  function renderDrilldown() {
    const rows = state.filteredRows.length ? state.filteredRows : state.allRows;

    const topInst = rows
      .filter((r) => num(r.roi_value_score) !== null)
      .sort((a, b) => num(b.roi_value_score) - num(a.roi_value_score))
      .slice(0, 15);

    plot(
      "chart-top-institutions",
      [
        {
          type: "bar",
          orientation: "h",
          y: topInst.map((d) => d.institution_name),
          x: topInst.map((d) => num(d.roi_value_score)),
          marker: { color: "#2563eb" },
        },
      ],
      {
        xaxis: { title: "ROI Value Score" },
        yaxis: { tickfont: { size: 11 } },
        margin: { l: 280, r: 20, t: 20, b: 40 },
      }
    );
  }

  function populateFilters() {
    const regions = [...new Set(state.allRows.map((r) => r.region_label))].sort();
    const controls = [...new Set(state.allRows.map((r) => r.control_label))].sort();

    const regionSelect = document.getElementById("region-filter");
    regionSelect.innerHTML =
      `<option value="all">All Regions</option>` +
      regions.map((r) => `<option value="${r}">${r}</option>`).join("");

    const controlSelect = document.getElementById("control-filter");
    controlSelect.innerHTML =
      `<option value="all">All Types</option>` +
      controls.map((c) => `<option value="${c}">${c}</option>`).join("");

    regionSelect.addEventListener("change", (e) => {
      state.currentRegion = e.target.value;
      applyFilters();
    });

    controlSelect.addEventListener("change", (e) => {
      state.currentControl = e.target.value;
      applyFilters();
    });
  }

  function wireTabs() {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        // Update buttons
        document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Update panes
        const tabId = btn.dataset.tab;
        document.querySelectorAll(".tab-pane").forEach((p) => p.classList.remove("active"));
        document.getElementById(tabId)?.classList.add("active");
      });
    });
  }

  async function init() {
    try {
      if (!window.Plotly) throw new Error("Plotly did not load.");
      if (!window.Papa) throw new Error("PapaParse did not load.");

      const res = await fetch(DATA_FILE);
      if (!res.ok) throw new Error(`Could not fetch ${DATA_FILE}`);

      const csv = await res.text();
      const parsed = Papa.parse(csv, { header: true });
      state.allRows = parsed.data.filter((r) => r.unit_id);

      if (!state.allRows.length) throw new Error("No data rows found.");

      updateKPIs();
      renderSummary();
      renderValueMap();
      renderCostEarnings();
      renderDebtCompletion();
      renderDrilldown();
      populateFilters();
      wireTabs();
    } catch (e) {
      console.error("Dashboard error:", e);
      document.body.innerHTML = `<div style="padding: 2rem; color: red;">Error: ${e.message}</div>`;
    }
  }

  init();
})();
