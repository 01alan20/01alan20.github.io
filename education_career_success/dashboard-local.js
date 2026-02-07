(function () {
  "use strict";

  const DATA_FILE = "./education_career_success.csv";
  const OUTCOMES = ["Job_Offers", "Career_Satisfaction", "Starting_Salary"];
  const FACTORS = [
    "Age",
    "High_School_GPA",
    "SAT_Score",
    "University_GPA",
    "Internships_Completed",
    "Projects_Completed",
    "Certifications",
    "Soft_Skills_Score",
    "Networking_Score",
    "Work_Life_Balance",
  ];
  const READINESS = [
    "Internships_Completed",
    "Projects_Completed",
    "Certifications",
    "Soft_Skills_Score",
    "Networking_Score",
  ];

  const LABEL = {
    Age: "Age",
    High_School_GPA: "HS GPA",
    SAT_Score: "SAT",
    University_GPA: "University GPA",
    Internships_Completed: "Internships",
    Projects_Completed: "Projects",
    Certifications: "Certifications",
    Soft_Skills_Score: "Soft Skills",
    Networking_Score: "Networking",
    Work_Life_Balance: "Work-Life",
    Job_Offers: "Job Offers",
    Career_Satisfaction: "Career Satisfaction",
    Starting_Salary: "Starting Salary",
  };

  const el = {
    status: document.getElementById("status"),
    kpiCards: document.getElementById("kpi-cards"),
    tabs: document.getElementById("outcome-tabs"),
    factorSelect: document.getElementById("factor-select"),
    rankedTitle: document.getElementById("ranked-title"),
    scatterTitle: document.getElementById("scatter-title"),
    boxFieldTitle: document.getElementById("box-field-title"),
    boxLevelTitle: document.getElementById("box-level-title"),
    journeyBody: document.querySelector("#journey-table tbody"),
    journeyUplift: document.getElementById("journey-uplift"),
  };

  const state = {
    headers: [],
    rows: [],
    numeric: [],
    currentOutcome: "Job_Offers",
    top: {},
    readyRows: [],
    readySummary: [],
    readinessThresholds: {},
  };

  const missingDom = Object.entries(el)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  if (missingDom.length) {
    throw new Error(`Dashboard DOM mismatch. Missing elements: ${missingDom.join(", ")}`);
  }

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

  function mean(a) {
    return a.length ? a.reduce((s, v) => s + v, 0) / a.length : null;
  }

  function median(a) {
    if (!a.length) {
      return null;
    }
    const s = [...a].sort((x, y) => x - y);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  }

  function quantile(a, p) {
    if (!a.length) {
      return null;
    }
    const s = [...a].sort((x, y) => x - y);
    const pos = (s.length - 1) * p;
    const b = Math.floor(pos);
    const r = pos - b;
    return s[b + 1] !== undefined ? s[b] + r * (s[b + 1] - s[b]) : s[b];
  }

  function sd(a) {
    if (a.length < 2) {
      return 0;
    }
    const m = mean(a);
    return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / a.length);
  }

  function corr(x, y) {
    if (!x.length || x.length !== y.length) {
      return 0;
    }
    const mx = mean(x);
    const my = mean(y);
    let n = 0;
    let vx = 0;
    let vy = 0;
    for (let i = 0; i < x.length; i += 1) {
      const dx = x[i] - mx;
      const dy = y[i] - my;
      n += dx * dy;
      vx += dx * dx;
      vy += dy * dy;
    }
    return vx && vy ? n / Math.sqrt(vx * vy) : 0;
  }

  function slope(x, y) {
    if (!x.length || x.length !== y.length) {
      return 0;
    }
    const mx = mean(x);
    const my = mean(y);
    let n = 0;
    let d = 0;
    for (let i = 0; i < x.length; i += 1) {
      n += (x[i] - mx) * (y[i] - my);
      d += (x[i] - mx) ** 2;
    }
    return d ? n / d : 0;
  }

  function parseCSV(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let inQ = false;
    for (let i = 0; i < text.length; i += 1) {
      const c = text[i];
      const n = text[i + 1];
      if (c === '"') {
        if (inQ && n === '"') {
          cell += '"';
          i += 1;
        } else {
          inQ = !inQ;
        }
        continue;
      }
      if (c === "," && !inQ) {
        row.push(cell);
        cell = "";
        continue;
      }
      if ((c === "\n" || c === "\r") && !inQ) {
        if (c === "\r" && n === "\n") {
          i += 1;
        }
        row.push(cell);
        if (row.length > 1 || row[0] !== "") {
          rows.push(row);
        }
        row = [];
        cell = "";
        continue;
      }
      cell += c;
    }
    if (cell.length || row.length) {
      row.push(cell);
      rows.push(row);
    }

    const headers = rows[0];
    const data = rows.slice(1).map((cells) => {
      const o = {};
      headers.forEach((h, i) => {
        o[h] = cells[i] ?? "";
      });
      return o;
    });
    return { headers, data };
  }

  function values(rows, col) {
    return rows.map((r) => num(r[col])).filter((v) => v !== null);
  }

  function describe(rows, col) {
    const v = values(rows, col);
    return {
      mean: mean(v),
      median: median(v),
      min: v.length ? Math.min(...v) : null,
      max: v.length ? Math.max(...v) : null,
      q10: quantile(v, 0.1),
      q90: quantile(v, 0.9),
    };
  }

  function counts(rows, col) {
    const m = new Map();
    rows.forEach((r) => {
      const k = miss(r[col]) ? "Missing" : String(r[col]);
      m.set(k, (m.get(k) || 0) + 1);
    });
    return Array.from(m.entries()).map(([label, count]) => ({ label, count }));
  }

  function baseLayout(extra) {
    return {
      margin: { l: 72, r: 24, t: 26, b: 58 },
      paper_bgcolor: "#fcfeff",
      plot_bgcolor: "#fcfeff",
      font: { family: "Segoe UI, Tahoma, sans-serif", size: 13, color: "#0f1f29" },
      xaxis: { automargin: true, tickfont: { size: 12 } },
      yaxis: { automargin: true, tickfont: { size: 12 } },
      ...extra,
    };
  }

  function plot(id, data, extra) {
    Plotly.newPlot(id, data, baseLayout(extra), {
      responsive: true,
      displayModeBar: false,
    });
  }

  function renderStage1() {
    const rows = state.rows;
    const age = describe(rows, "Age");
    const cert = describe(rows, "Certifications");
    const intern = describe(rows, "Internships_Completed");
    const proj = describe(rows, "Projects_Completed");
    const offers = describe(rows, "Job_Offers");
    const salary = describe(rows, "Starting_Salary");
    const sat = describe(rows, "Career_Satisfaction");

    const cards = [
      ["People", fmt(rows.length, 0)],
      ["Age Range", `${fmt(age.min, 0)}-${fmt(age.max, 0)}`],
      ["Avg Certifications", fmt(cert.mean, 2)],
      ["Avg Internships", fmt(intern.mean, 2)],
      ["Avg Projects", fmt(proj.mean, 2)],
      ["Avg Job Offers", fmt(offers.mean, 2)],
      ["Avg Starting Salary", money(salary.mean)],
      ["Median Starting Salary", money(salary.median)],
      ["Avg Satisfaction", `${fmt(sat.mean, 2)}/10`],
    ];

    el.kpiCards.innerHTML = cards
      .map(
        (c) =>
          `<article class="card"><p class="label">${c[0]}</p><p class="value">${c[1]}</p></article>`
      )
      .join("");

    plot("chart-age-hist", [
      {
        type: "histogram",
        x: values(rows, "Age"),
        marker: { color: "#0b8a8f" },
        nbinsx: 6,
      },
    ], {
      xaxis: { title: "Age (years)" },
      yaxis: { title: "Students" },
    });

    plot("chart-salary-hist", [
      {
        type: "histogram",
        x: values(rows, "Starting_Salary"),
        marker: { color: "#1766b1" },
        nbinsx: 16,
      },
    ], {
      xaxis: { title: "Starting Salary", tickformat: "$,.0f" },
      yaxis: { title: "Students" },
    });

    plot("chart-offers-hist", [
      {
        type: "histogram",
        x: values(rows, "Job_Offers"),
        marker: { color: "#ef8354" },
        nbinsx: 6,
      },
    ], {
      xaxis: { title: "Number of Offers" },
      yaxis: { title: "Students" },
    });

    const byField = counts(rows, "Field_of_Study").sort((a, b) => b.count - a.count);
    plot("chart-field-bar", [
      {
        type: "bar",
        x: byField.map((d) => d.label),
        y: byField.map((d) => d.count),
        marker: { color: "#2a9d8f" },
      },
    ], {
      xaxis: { title: "Field of Study", tickangle: -28 },
      yaxis: { title: "Students" },
      margin: { l: 72, r: 24, t: 26, b: 110 },
    });
  }

  function computeTop() {
    OUTCOMES.forEach((outcome) => {
      state.top[outcome] = FACTORS.map((f) => {
        const valid = state.rows
          .map((r) => ({ x: num(r[f]), y: num(r[outcome]) }))
          .filter((d) => d.x !== null && d.y !== null);
        return {
          factor: f,
          r: corr(
            valid.map((d) => d.x),
            valid.map((d) => d.y)
          ),
        };
      })
        .sort((a, b) => Math.abs(b.r) - Math.abs(a.r))
        .slice(0, 8);
    });
  }

  function renderHeatmap() {
    const cols = state.numeric.filter((c) => c !== "Student_ID");
    const z = cols.map((c1) =>
      cols.map((c2) => {
        const valid = state.rows
          .map((r) => ({ a: num(r[c1]), b: num(r[c2]) }))
          .filter((d) => d.a !== null && d.b !== null);
        return corr(
          valid.map((d) => d.a),
          valid.map((d) => d.b)
        );
      })
    );

    const labels = cols.map((c) => LABEL[c] || c);
    plot("chart-heatmap", [
      {
        type: "heatmap",
        x: labels,
        y: labels,
        z,
        zmin: -1,
        zmax: 1,
        colorscale: [
          [0, "#b3001b"],
          [0.5, "#f6f8fa"],
          [1, "#0b8a8f"],
        ],
      },
    ], {
      xaxis: { tickangle: -35, tickfont: { size: 12 } },
      yaxis: { tickfont: { size: 12 } },
      margin: { l: 160, r: 24, t: 24, b: 130 },
    });
  }

  function renderBox(outcome) {
    const fieldX = [];
    const fieldY = [];
    const levelX = [];
    const levelY = [];

    state.rows.forEach((r) => {
      const y = num(r[outcome]);
      if (y === null) {
        return;
      }
      if (!miss(r.Field_of_Study)) {
        fieldX.push(r.Field_of_Study);
        fieldY.push(y);
      }
      if (!miss(r.Current_Job_Level)) {
        levelX.push(r.Current_Job_Level);
        levelY.push(y);
      }
    });

    plot("chart-box-field", [
      {
        type: "box",
        x: fieldX,
        y: fieldY,
        boxpoints: false,
        marker: { color: "#0b8a8f" },
        line: { color: "#0b8a8f" },
      },
    ], {
      xaxis: { title: "Field of Study", tickangle: -28 },
      yaxis: { title: LABEL[outcome] || outcome },
      margin: { l: 72, r: 24, t: 24, b: 110 },
    });

    plot("chart-box-level", [
      {
        type: "box",
        x: levelX,
        y: levelY,
        boxpoints: false,
        marker: { color: "#1766b1" },
        line: { color: "#1766b1" },
      },
    ], {
      xaxis: {
        title: "Current Job Level",
        categoryorder: "array",
        categoryarray: ["Entry", "Mid", "Senior"],
      },
      yaxis: { title: LABEL[outcome] || outcome },
    });
  }

  function renderScatter(outcome, factor) {
    el.scatterTitle.textContent = `${LABEL[factor] || factor} vs ${LABEL[outcome] || outcome}`;

    const valid = state.rows
      .map((r) => ({ x: num(r[factor]), y: num(r[outcome]) }))
      .filter((d) => d.x !== null && d.y !== null);
    const x = valid.map((d) => d.x);
    const y = valid.map((d) => d.y);
    const m = slope(x, y);
    const b = mean(y) - m * mean(x);
    const minX = Math.min(...x);
    const maxX = Math.max(...x);
    const r = corr(x, y);

    plot("chart-scatter", [
      {
        type: "scatter",
        mode: "markers",
        x,
        y,
        marker: { size: 6, opacity: 0.65, color: "#1766b1" },
        name: "Students",
      },
      {
        type: "scatter",
        mode: "lines",
        x: [minX, maxX],
        y: [b + m * minX, b + m * maxX],
        line: { color: "#ef8354", width: 3 },
        name: `Trend (r=${r.toFixed(3)})`,
        hoverinfo: "skip",
      },
    ], {
      xaxis: { title: LABEL[factor] || factor },
      yaxis: {
        title:
          outcome === "Starting_Salary" ? "Starting Salary ($)" : LABEL[outcome] || outcome,
        tickformat: outcome === "Starting_Salary" ? "$,.0f" : undefined,
      },
    });
  }

  function renderOutcome(outcome) {
    state.currentOutcome = outcome;
    const top = state.top[outcome] || [];

    el.rankedTitle.textContent = `Top Associated Factors for ${LABEL[outcome] || outcome}`;
    el.boxFieldTitle.textContent = `${LABEL[outcome] || outcome} by Field of Study`;
    el.boxLevelTitle.textContent = `${LABEL[outcome] || outcome} by Current Job Level`;

    plot("chart-ranked-factors", [
      {
        type: "bar",
        orientation: "h",
        y: [...top].reverse().map((d) => LABEL[d.factor] || d.factor),
        x: [...top].reverse().map((d) => d.r),
        marker: {
          color: [...top].reverse().map((d) => (d.r >= 0 ? "#0b8a8f" : "#b3001b")),
        },
      },
    ], {
      xaxis: { title: "Correlation (r)" },
      yaxis: { tickfont: { size: 13 } },
      margin: { l: 190, r: 24, t: 24, b: 48 },
    });

    const options = top.map((d) => d.factor);
    el.factorSelect.innerHTML = options
      .map((o) => `<option value="${o}">${LABEL[o] || o}</option>`)
      .join("");
    const selected = options[0] || "Certifications";
    el.factorSelect.value = selected;

    renderScatter(outcome, selected);
    renderBox(outcome);
  }

  function computeReadiness() {
    const stats = {};
    READINESS.forEach((f) => {
      const v = values(state.rows, f);
      stats[f] = { m: mean(v), s: sd(v) || 1 };
    });

    const rows = state.rows.map((r) => {
      const score = mean(
        READINESS.map((f) => {
          const v = num(r[f]);
          return v === null ? 0 : (v - stats[f].m) / stats[f].s;
        })
      );
      return { ...r, __score: score };
    });

    const scores = rows.map((r) => r.__score);
    const q20 = quantile(scores, 0.2);
    const q40 = quantile(scores, 0.4);
    const q60 = quantile(scores, 0.6);
    const q80 = quantile(scores, 0.8);
    state.readinessThresholds = { q20, q40, q60, q80 };

    state.readyRows = rows.map((r) => {
      let q = "Q5";
      if (r.__score <= q20) {
        q = "Q1";
      } else if (r.__score <= q40) {
        q = "Q2";
      } else if (r.__score <= q60) {
        q = "Q3";
      } else if (r.__score <= q80) {
        q = "Q4";
      }
      return { ...r, __q: q };
    });

    const order = ["Q1", "Q2", "Q3", "Q4", "Q5"];
    state.readySummary = order.map((q) => {
      const g = state.readyRows.filter((r) => r.__q === q);
      const sal = values(g, "Starting_Salary");
      const offers = values(g, "Job_Offers");
      return {
        q,
        band:
          q === "Q1"
            ? "Lowest Readiness"
            : q === "Q5"
            ? "Highest Readiness"
            : "Middle Readiness",
        n: g.length,
        offersMean: mean(offers),
        offersP10: quantile(offers, 0.1),
        offersP90: quantile(offers, 0.9),
        satMean: mean(values(g, "Career_Satisfaction")),
        salaryMean: mean(sal),
        salaryP10: quantile(sal, 0.1),
        salaryP90: quantile(sal, 0.9),
        salaryQ25: quantile(sal, 0.25),
        salaryQ75: quantile(sal, 0.75),
      };
    });
  }

  function renderJourney() {
    el.journeyBody.innerHTML = state.readySummary
      .map(
        (d) =>
          `<tr><td>${d.q}</td><td>${d.band}</td><td>${fmt(d.n, 0)}</td><td>${fmt(
            d.offersMean,
            2
          )}</td><td>${fmt(d.satMean, 2)}</td><td>${money(d.salaryMean)}</td><td>${money(
            d.salaryQ25
          )} - ${money(d.salaryQ75)}</td></tr>`
      )
      .join("");

    const q1 = state.readySummary[0];
    const q5 = state.readySummary[4];
    el.journeyUplift.innerHTML =
      `Definition: Q1 = Lowest Readiness, Q5 = Highest Readiness. ` +
      `Q5 vs Q1 uplift: <strong>+${fmt(q5.offersMean - q1.offersMean, 2)}</strong> job offers, ` +
      `<strong>+${fmt(q5.satMean - q1.satMean, 2)}</strong> satisfaction points, ` +
      `<strong>+${money(q5.salaryMean - q1.salaryMean)}</strong> average salary.`;

    const x = state.readySummary.map((d) => `${d.q} (${d.band.split(" ")[0]})`);
    plot("chart-quintile-progress", [
      {
        type: "scatter",
        mode: "lines+markers",
        x,
        y: state.readySummary.map((d) => d.offersMean),
        name: "Job Offers",
        line: { color: "#0b8a8f", width: 3 },
      },
      {
        type: "scatter",
        mode: "lines+markers",
        x,
        y: state.readySummary.map((d) => d.satMean),
        name: "Satisfaction",
        line: { color: "#ef8354", width: 3 },
      },
      {
        type: "scatter",
        mode: "lines+markers",
        x,
        y: state.readySummary.map((d) => d.salaryMean),
        name: "Salary",
        yaxis: "y2",
        line: { color: "#1766b1", width: 3 },
      },
    ], {
      xaxis: { title: "Readiness Quintile" },
      yaxis: { title: "Offers / Satisfaction" },
      yaxis2: {
        title: "Salary ($)",
        overlaying: "y",
        side: "right",
        tickformat: "$,.0f",
      },
      margin: { l: 72, r: 74, t: 24, b: 62 },
    });
  }

  function renderGuidanceCharts() {
    const rows = state.rows;

    const actionCols = [
      "Internships_Completed",
      "Projects_Completed",
      "Certifications",
      "Networking_Score",
    ];
    const actionData = actionCols.map((a) => ({
      action: a,
      byOutcome: OUTCOMES.map((o) => {
        const valid = rows
          .map((r) => ({ x: num(r[a]), y: num(r[o]) }))
          .filter((d) => d.x !== null && d.y !== null);
        return corr(
          valid.map((d) => d.x),
          valid.map((d) => d.y)
        );
      }),
    }));

    plot("insight-chart-actions", OUTCOMES.map((o, idx) => ({
      type: "bar",
      name: LABEL[o],
      x: actionData.map((d) => LABEL[d.action]),
      y: actionData.map((d) => d.byOutcome[idx]),
    })), {
      barmode: "group",
      xaxis: { title: "Action" },
      yaxis: { title: "Correlation Strength (r)" },
      legend: { orientation: "h", y: 1.12 },
      margin: { l: 72, r: 24, t: 38, b: 62 },
    });

    const allMeans = {
      internships: mean(values(rows, "Internships_Completed")),
      projects: mean(values(rows, "Projects_Completed")),
      certs: mean(values(rows, "Certifications")),
      networking: mean(values(rows, "Networking_Score")),
      gpa: mean(values(rows, "University_GPA")),
    };
    const good = rows.filter((r) => num(r.Job_Offers) >= 3);
    const goodThreshold = {
      internships: quantile(values(good, "Internships_Completed"), 0.25),
      projects: quantile(values(good, "Projects_Completed"), 0.25),
      certs: quantile(values(good, "Certifications"), 0.25),
      networking: quantile(values(good, "Networking_Score"), 0.25),
      gpa: quantile(values(good, "University_GPA"), 0.25),
    };

    plot("insight-chart-min-profile", [
      {
        type: "bar",
        name: "All Students Avg",
        x: ["Internships", "Projects", "Certifications", "Networking", "University GPA"],
        y: [
          allMeans.internships,
          allMeans.projects,
          allMeans.certs,
          allMeans.networking,
          allMeans.gpa,
        ],
        marker: { color: "#9fb9cc" },
      },
      {
        type: "bar",
        name: "Lower-Bound for >=3 Offers",
        x: ["Internships", "Projects", "Certifications", "Networking", "University GPA"],
        y: [
          goodThreshold.internships,
          goodThreshold.projects,
          goodThreshold.certs,
          goodThreshold.networking,
          goodThreshold.gpa,
        ],
        marker: { color: "#1766b1" },
      },
    ], {
      barmode: "group",
      yaxis: { title: "Typical Value" },
      legend: { orientation: "h", y: 1.12 },
      margin: { l: 72, r: 24, t: 38, b: 62 },
    });

    const balance = counts(rows, "Field_of_Study").map((d) => {
      const g = rows.filter((r) => r.Field_of_Study === d.label);
      return {
        field: d.label,
        n: g.length,
        salary: mean(values(g, "Starting_Salary")),
        sat: mean(values(g, "Career_Satisfaction")),
      };
    });
    plot("insight-chart-balance", [
      {
        type: "scatter",
        mode: "markers+text",
        x: balance.map((d) => d.salary),
        y: balance.map((d) => d.sat),
        text: balance.map((d) => d.field),
        textposition: "top center",
        marker: {
          color: "#0b8a8f",
          size: balance.map((d) => Math.max(9, d.n / 4)),
          opacity: 0.75,
        },
      },
    ], {
      xaxis: { title: "Average Salary", tickformat: "$,.0f" },
      yaxis: { title: "Average Satisfaction" },
      margin: { l: 72, r: 24, t: 24, b: 62 },
    });

    const effortRows = rows.map((r) => {
      const effort = mean([
        num(r.Internships_Completed),
        num(r.Projects_Completed),
        num(r.Certifications),
      ]);
      const salary = num(r.Starting_Salary);
      const offers = num(r.Job_Offers);
      return { effort, salary, lowReturn: offers <= 2 || salary < 84000 };
    });

    plot("insight-chart-effort-return", [
      {
        type: "scatter",
        mode: "markers",
        x: effortRows.filter((d) => !d.lowReturn).map((d) => d.effort),
        y: effortRows.filter((d) => !d.lowReturn).map((d) => d.salary),
        name: "Normal Return",
        marker: { color: "#0b8a8f", size: 6, opacity: 0.6 },
      },
      {
        type: "scatter",
        mode: "markers",
        x: effortRows.filter((d) => d.lowReturn).map((d) => d.effort),
        y: effortRows.filter((d) => d.lowReturn).map((d) => d.salary),
        name: "Low Return",
        marker: { color: "#b3001b", size: 7, opacity: 0.72 },
      },
    ], {
      xaxis: { title: "Effort Index (Internships + Projects + Certifications)" },
      yaxis: { title: "Starting Salary", tickformat: "$,.0f" },
      legend: { orientation: "h", y: 1.12 },
      margin: { l: 72, r: 24, t: 38, b: 62 },
    });

    const socialRows = rows.map((r) => ({
      gpa: num(r.University_GPA),
      social: mean([num(r.Soft_Skills_Score), num(r.Networking_Score)]),
      offers: num(r.Job_Offers),
    }));
    const bands = [
      { name: "Lower GPA", lo: -Infinity, hi: 3.25 },
      { name: "Mid GPA", lo: 3.25, hi: 3.55 },
      { name: "Upper GPA", lo: 3.55, hi: Infinity },
    ];
    const socialBars = bands.map((b) => {
      const g = socialRows.filter((r) => r.gpa !== null && r.gpa >= b.lo && r.gpa < b.hi);
      const med = median(g.map((r) => r.social));
      const high = g.filter((r) => r.social >= med);
      const low = g.filter((r) => r.social < med);
      return {
        band: b.name,
        highOffers: mean(high.map((r) => r.offers)),
        lowOffers: mean(low.map((r) => r.offers)),
      };
    });

    plot("insight-chart-social-gpa", [
      {
        type: "bar",
        name: "High Soft-Skills/Networking",
        x: socialBars.map((d) => d.band),
        y: socialBars.map((d) => d.highOffers),
        marker: { color: "#1766b1" },
      },
      {
        type: "bar",
        name: "Lower Soft-Skills/Networking",
        x: socialBars.map((d) => d.band),
        y: socialBars.map((d) => d.lowOffers),
        marker: { color: "#9fb9cc" },
      },
    ], {
      barmode: "group",
      xaxis: { title: "University GPA Band" },
      yaxis: { title: "Average Job Offers" },
      legend: { orientation: "h", y: 1.12 },
      margin: { l: 72, r: 24, t: 38, b: 62 },
    });

    const risk = counts(rows, "Field_of_Study")
      .map((d) => {
        const g = rows.filter((r) => r.Field_of_Study === d.label);
        const rate =
          g.filter((x) => num(x.Job_Offers) <= 1 || num(x.Career_Satisfaction) <= 6).length /
          g.length;
        return { field: d.label, n: g.length, rate };
      })
      .filter((d) => d.n >= 20)
      .sort((a, b) => b.rate - a.rate);

    const riskDefinition =
      "Student-level flag<br>" +
      "A student is marked at-risk if either condition is true:<br>" +
      "Job_Offers <= 1 OR Career_Satisfaction <= 6";
    plot("insight-chart-risk", [
      {
        type: "bar",
        x: risk.map((d) => d.field),
        y: risk.map((d) => d.rate * 100),
        marker: { color: "#b3001b" },
      },
    ], {
      xaxis: { title: "Field of Study", tickangle: -28 },
      yaxis: { title: "At-Risk Rate (%)" },
      annotations: [
        {
          xref: "paper",
          yref: "paper",
          x: 0,
          y: 1.16,
          text: riskDefinition,
          showarrow: false,
          align: "left",
          font: { size: 12, color: "#426071" },
        },
      ],
      margin: { l: 72, r: 24, t: 58, b: 110 },
    });

    const levelOrder = ["Entry", "Mid", "Senior"];
    const levelData = levelOrder.map((lv) => {
      const g = rows.filter((r) => r.Current_Job_Level === lv);
      return {
        lv,
        offers: mean(values(g, "Job_Offers")),
        sat: mean(values(g, "Career_Satisfaction")),
        salary: mean(values(g, "Starting_Salary")),
      };
    });

    plot("insight-chart-levels", [
      {
        type: "bar",
        x: levelData.map((d) => d.lv),
        y: levelData.map((d) => d.offers),
        name: "Offers",
        marker: { color: "#0b8a8f" },
      },
      {
        type: "bar",
        x: levelData.map((d) => d.lv),
        y: levelData.map((d) => d.sat),
        name: "Satisfaction",
        marker: { color: "#ef8354" },
      },
      {
        type: "scatter",
        mode: "lines+markers",
        x: levelData.map((d) => d.lv),
        y: levelData.map((d) => d.salary),
        name: "Salary",
        yaxis: "y2",
        line: { color: "#1766b1", width: 3 },
      },
    ], {
      barmode: "group",
      xaxis: { title: "Current Job Level" },
      yaxis: { title: "Offers / Satisfaction" },
      yaxis2: {
        title: "Salary ($)",
        overlaying: "y",
        side: "right",
        tickformat: "$,.0f",
      },
      legend: { orientation: "h", y: 1.16 },
      margin: { l: 72, r: 74, t: 38, b: 62 },
    });

    const q1 = state.readySummary[0];
    const q5 = state.readySummary[4];
    plot("insight-chart-range", [
      {
        type: "scatter",
        mode: "markers+lines",
        x: ["Q1 (Lowest)", "Q5 (Highest)"],
        y: [q1.offersMean, q5.offersMean],
        name: "Offers Mean",
        error_y: {
          type: "data",
          symmetric: false,
          array: [q1.offersP90 - q1.offersMean, q5.offersP90 - q5.offersMean],
          arrayminus: [q1.offersMean - q1.offersP10, q5.offersMean - q5.offersP10],
        },
        marker: { color: "#0b8a8f", size: 9 },
      },
      {
        type: "scatter",
        mode: "markers+lines",
        x: ["Q1 (Lowest)", "Q5 (Highest)"],
        y: [q1.salaryMean, q5.salaryMean],
        name: "Salary Mean",
        yaxis: "y2",
        error_y: {
          type: "data",
          symmetric: false,
          array: [q1.salaryP90 - q1.salaryMean, q5.salaryP90 - q5.salaryMean],
          arrayminus: [q1.salaryMean - q1.salaryP10, q5.salaryMean - q5.salaryP10],
        },
        marker: { color: "#1766b1", size: 9 },
      },
    ], {
      xaxis: { title: "Readiness Pathway" },
      yaxis: { title: "Job Offers (mean with P10-P90 range)" },
      yaxis2: {
        title: "Salary ($, mean with P10-P90 range)",
        overlaying: "y",
        side: "right",
        tickformat: "$,.0f",
      },
      legend: { orientation: "h", y: 1.16 },
      margin: { l: 72, r: 95, t: 38, b: 62 },
    });
  }

  function wire() {
    el.tabs.addEventListener("click", (ev) => {
      const b = ev.target.closest("button[data-outcome]");
      if (!b) {
        return;
      }
      el.tabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      b.classList.add("active");
      renderOutcome(b.dataset.outcome);
    });

    el.factorSelect.addEventListener("change", () => {
      renderScatter(state.currentOutcome, el.factorSelect.value);
    });
  }

  async function init() {
    try {
      if (!window.Plotly) {
        throw new Error("Plotly did not load. Check internet access.");
      }

      const res = await fetch(DATA_FILE);
      if (!res.ok) {
        throw new Error(`Could not load ${DATA_FILE}. HTTP ${res.status}`);
      }

      const csv = await res.text();
      const parsed = parseCSV(csv);
      state.headers = parsed.headers;
      state.rows = parsed.data;
      state.numeric = state.headers.filter((h) => {
        const obs = state.rows.map((r) => r[h]).filter((v) => !miss(v));
        return obs.length && obs.every((v) => Number.isFinite(Number(v)));
      });

      computeTop();
      computeReadiness();
      renderStage1();
      renderOutcome("Job_Offers");
      renderHeatmap();
      renderJourney();
      renderGuidanceCharts();
      wire();

      el.status.textContent = `Loaded ${state.rows.length} records. Dashboard ready.`;
    } catch (e) {
      el.status.textContent = `Error: ${e.message}`;
      el.status.style.color = "#b3001b";
    }
  }

  init();
})();
