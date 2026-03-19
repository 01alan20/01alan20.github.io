const state = {
  data: null,
  optimizerRows: []
};

const fmt = (v) => {
  if (v === null || v === undefined || Number.isNaN(v)) return "-";
  if (Math.abs(v) > 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) > 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${Math.round(v).toLocaleString()}`;
};

const pct = (v) => {
  if (v === null || v === undefined || Number.isNaN(v)) return "-";
  return `${v.toFixed(1)}%`;
};

function baseLayout() {
  return {
    font: { family: "sans-serif", size: 12, color: "#4b5563" },
    plot_bgcolor: "#fafafa",
    paper_bgcolor: "white",
    margin: { l: 70, r: 40, t: 30, b: 50 },
    hovermode: "x unified",
    showlegend: true,
    legend: { x: 0.01, y: 0.99, bgcolor: "rgba(255, 255, 255, 0.8)", bordercolor: "#e5e7eb", borderwidth: 1 }
  };
}

function plot(divId, data, layout) {
  const fullLayout = { ...baseLayout(), ...layout };
  Plotly.newPlot(divId, data, fullLayout, { responsive: true });
}

function numberValue(id) {
  const element = document.getElementById(id);
  return element ? Number(element.value) : NaN;
}

function updateKPIs() {
  if (!state.data || state.data.length === 0) return;

  const baseline = state.data[0];
  const optimal = state.data.reduce((best, row) => {
    if (row.revenue_change_pct > -1.5 && row.enrollment_change > best.enrollment_change) {
      return row;
    }
    return best;
  });

  document.getElementById("kpi-baseline-enroll").textContent = Math.round(baseline.total_enrollments).toLocaleString();
  document.getElementById("kpi-baseline-revenue").textContent = fmt(baseline.total_revenue);
  document.getElementById("kpi-optimal-amount").textContent = `$${Math.round(optimal.scholarship_amount).toLocaleString()}`;
  document.getElementById("kpi-students-reached").textContent = Math.round(optimal.students_receiving_aid).toLocaleString();
}

function renderTradeoff() {
  if (!state.data) return;

  plot("chart-tradeoff", [
    {
      x: state.data.map((r) => r.scholarship_amount),
      y: state.data.map((r) => r.enrollment_change),
      name: "Enrollment Gain",
      type: "scatter",
      mode: "lines+markers",
      line: { color: "#3b82f6", width: 3 },
      marker: { size: 8 },
      yaxis: "y1",
      hovertemplate: "Aid: $%{x:,.0f}<br>Enrollment Gain: %{y:.1f} students<extra></extra>"
    },
    {
      x: state.data.map((r) => r.scholarship_amount),
      y: state.data.map((r) => r.revenue_change_pct),
      name: "Revenue Change %",
      type: "scatter",
      mode: "lines+markers",
      line: { color: "#ef4444", width: 3 },
      marker: { size: 8 },
      yaxis: "y2",
      hovertemplate: "Aid: $%{x:,.0f}<br>Revenue Impact: %{y:.2f}%<extra></extra>"
    }
  ], {
    title: { text: "Core Trade-off: How Much Enrollment Growth for Revenue Cost?", font: { size: 14, color: "#1f2937" } },
    xaxis: { title: "Scholarship per Recipient ($)", tickformat: "$,.0f" },
    yaxis: { title: "Additional Enrollments", titlefont: { color: "#3b82f6" }, tickfont: { color: "#3b82f6" } },
    yaxis2: { title: "Revenue Change (%)", titlefont: { color: "#ef4444" }, tickfont: { color: "#ef4444" }, overlaying: "y", side: "right" },
    height: 500
  });
}

function readOptimizerInputs() {
  const inputs = {
    budget: numberValue("opt-budget"),
    tuition: numberValue("opt-tuition"),
    eligible: numberValue("opt-eligible"),
    minStudents: numberValue("opt-min-students"),
    maxStudents: numberValue("opt-max-students"),
    baseConv: numberValue("opt-base-conv") / 100,
    minAward: numberValue("opt-min-award"),
    maxAward: numberValue("opt-max-award"),
    awardStep: numberValue("opt-award-step"),
    liftMin: numberValue("opt-lift-min") / 100,
    liftMax: numberValue("opt-lift-max") / 100,
    curveShape: Number(document.getElementById("opt-curve-shape").value),
    objective: document.getElementById("opt-objective").value
  };

  if (inputs.maxAward < inputs.minAward) {
    [inputs.minAward, inputs.maxAward] = [inputs.maxAward, inputs.minAward];
  }
  inputs.maxStudents = Math.min(inputs.maxStudents, inputs.eligible);

  return inputs;
}

function validateOptimizerInputs(inputs) {
  const positiveChecks = [
    inputs.budget,
    inputs.tuition,
    inputs.eligible,
    inputs.maxStudents,
    inputs.minAward,
    inputs.maxAward,
    inputs.awardStep
  ];
  if (positiveChecks.some((v) => !Number.isFinite(v) || v <= 0)) {
    return "Budget, tuition, student counts, and award values must all be positive.";
  }
  if (!Number.isFinite(inputs.minStudents) || inputs.minStudents < 0) {
    return "Minimum students served must be zero or higher.";
  }
  if (inputs.maxStudents < inputs.minStudents) {
    return "Max students served must be greater than or equal to min students served.";
  }
  if (!Number.isFinite(inputs.baseConv) || inputs.baseConv < 0 || inputs.baseConv > 0.99) {
    return "Baseline conversion must be between 0% and 99%.";
  }
  if (!Number.isFinite(inputs.liftMin) || !Number.isFinite(inputs.liftMax) || inputs.liftMin < 0 || inputs.liftMax < 0) {
    return "Lift assumptions must be non-negative.";
  }
  if (inputs.liftMax < inputs.liftMin) {
    return "Lift at max award should be greater than or equal to lift at min award.";
  }
  return null;
}

function awardLift(award, inputs) {
  const denom = Math.max(inputs.maxAward - inputs.minAward, 1);
  const normalized = Math.max(0, Math.min(1, (award - inputs.minAward) / denom));
  const shaped = Math.pow(normalized, inputs.curveShape);
  return inputs.liftMin + (inputs.liftMax - inputs.liftMin) * shaped;
}

function buildOptimizerRows(inputs) {
  const rows = [];
  for (let award = inputs.minAward; award <= inputs.maxAward; award += inputs.awardStep) {
    const affordable = Math.floor(inputs.budget / award);
    const studentsServed = Math.min(affordable, inputs.maxStudents, inputs.eligible);
    if (studentsServed < inputs.minStudents) continue;

    const lift = awardLift(award, inputs);
    const convWithAid = Math.min(0.99, inputs.baseConv + lift);

    const baselineEnrollments = studentsServed * inputs.baseConv;
    const enrollmentsWithAid = studentsServed * convWithAid;
    const incrementalEnrollments = enrollmentsWithAid - baselineEnrollments;
    const aidSpend = studentsServed * award;

    const baselineNetTuition = baselineEnrollments * inputs.tuition;
    const postAidNetTuition = enrollmentsWithAid * Math.max(0, inputs.tuition - award);
    const netTuitionDelta = postAidNetTuition - baselineNetTuition;
    const costPerIncremental = incrementalEnrollments > 0 ? aidSpend / incrementalEnrollments : null;

    let objectiveScore = incrementalEnrollments;
    if (inputs.objective === "net_revenue") {
      objectiveScore = netTuitionDelta;
    } else if (inputs.objective === "balanced") {
      objectiveScore = incrementalEnrollments + (netTuitionDelta / inputs.tuition);
    }

    rows.push({
      award,
      studentsServed,
      lift,
      baseConv: inputs.baseConv,
      convWithAid,
      incrementalEnrollments,
      aidSpend,
      netTuitionDelta,
      costPerIncremental,
      objectiveScore
    });
  }
  return rows;
}

function pickBestRow(rows) {
  if (!rows || rows.length === 0) return null;
  return rows.reduce((best, row) => (row.objectiveScore > best.objectiveScore ? row : best), rows[0]);
}

function renderOptimizerSummary(best, inputs) {
  const container = document.getElementById("opt-summary");
  if (!best) {
    container.innerHTML = "<strong>No feasible strategy.</strong> Try lowering minimum students served or widening award range.";
    return;
  }

  const objectiveLabel =
    inputs.objective === "incremental"
      ? "Max Incremental Enrollments"
      : inputs.objective === "net_revenue"
      ? "Max Net Tuition Impact"
      : "Balanced";

  container.innerHTML = `
    <div class="summary-grid">
      <div><span class="summary-label">Objective</span><span class="summary-value">${objectiveLabel}</span></div>
      <div><span class="summary-label">Best Award</span><span class="summary-value">$${best.award.toLocaleString()}</span></div>
      <div><span class="summary-label">Students Served</span><span class="summary-value">${best.studentsServed.toLocaleString()}</span></div>
      <div><span class="summary-label">Incremental Enrollments</span><span class="summary-value">${best.incrementalEnrollments.toFixed(1)}</span></div>
      <div><span class="summary-label">Net Tuition Delta</span><span class="summary-value">${fmt(best.netTuitionDelta)}</span></div>
      <div><span class="summary-label">Cost / Incremental</span><span class="summary-value">${best.costPerIncremental ? fmt(best.costPerIncremental) : "-"}</span></div>
    </div>
  `;
}

function renderOptimizerCharts(rows, best) {
  plot("chart-optimizer-frontier", [
    {
      x: rows.map((r) => r.award),
      y: rows.map((r) => r.incrementalEnrollments),
      name: "Incremental Enrollments",
      type: "scatter",
      mode: "lines+markers",
      line: { color: "#2563eb", width: 3 },
      marker: { size: 7 },
      yaxis: "y1",
      hovertemplate: "Award: $%{x:,.0f}<br>Incremental: %{y:.1f} students<extra></extra>"
    },
    {
      x: rows.map((r) => r.award),
      y: rows.map((r) => r.netTuitionDelta),
      name: "Net Tuition Delta",
      type: "scatter",
      mode: "lines+markers",
      line: { color: "#ef4444", width: 3 },
      marker: { size: 7 },
      yaxis: "y2",
      hovertemplate: "Award: $%{x:,.0f}<br>Net Delta: $%{y:,.0f}<extra></extra>"
    }
  ], {
    title: { text: "Optimizer Frontier: Enrollment Lift vs Net Tuition Delta", font: { size: 14, color: "#1f2937" } },
    xaxis: { title: "Award Amount ($)", tickformat: "$,.0f" },
    yaxis: { title: "Incremental Enrollments", titlefont: { color: "#2563eb" }, tickfont: { color: "#2563eb" } },
    yaxis2: { title: "Net Tuition Delta ($)", titlefont: { color: "#ef4444" }, tickfont: { color: "#ef4444" }, overlaying: "y", side: "right" },
    height: 420,
    annotations: best
      ? [
          {
            x: best.award,
            y: best.incrementalEnrollments,
            yref: "y",
            text: `Best: $${best.award.toLocaleString()}`,
            showarrow: true,
            arrowhead: 2,
            ax: 20,
            ay: -40
          }
        ]
      : []
  });

  plot("chart-optimizer-efficiency", [
    {
      x: rows.map((r) => r.award),
      y: rows.map((r) => r.costPerIncremental),
      name: "Cost / Incremental",
      type: "scatter",
      mode: "lines+markers",
      line: { color: "#059669", width: 3 },
      marker: { size: 7 },
      hovertemplate: "Award: $%{x:,.0f}<br>Cost per Incremental: $%{y:,.0f}<extra></extra>"
    },
    {
      x: rows.map((r) => r.award),
      y: rows.map((r) => r.studentsServed),
      name: "Students Served",
      type: "bar",
      marker: { color: "rgba(99, 102, 241, 0.30)" },
      yaxis: "y2",
      hovertemplate: "Award: $%{x:,.0f}<br>Students Served: %{y:,.0f}<extra></extra>"
    }
  ], {
    title: { text: "Efficiency and Coverage by Award Level", font: { size: 14, color: "#1f2937" } },
    xaxis: { title: "Award Amount ($)", tickformat: "$,.0f" },
    yaxis: { title: "Cost per Incremental Enrollment ($)", tickformat: "$,.0f" },
    yaxis2: { title: "Students Served", overlaying: "y", side: "right" },
    barmode: "overlay",
    height: 420
  });
}

function runOptimizer() {
  const inputs = readOptimizerInputs();
  const error = validateOptimizerInputs(inputs);
  if (error) {
    alert(error);
    return;
  }

  const rows = buildOptimizerRows(inputs);
  state.optimizerRows = rows;
  const best = pickBestRow(rows);
  renderOptimizerSummary(best, inputs);
  if (!rows.length) {
    Plotly.purge("chart-optimizer-frontier");
    Plotly.purge("chart-optimizer-efficiency");
    return;
  }
  renderOptimizerCharts(rows, best);
}

function renderScenarios() {
  const tbody = document.getElementById("scenarios-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  state.data.forEach((row) => {
    const tr = document.createElement("tr");
    tr.style.borderBottom = "1px solid #e5e7eb";
    tr.innerHTML = `
      <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: 600;">$${Math.round(row.scholarship_amount).toLocaleString()}</td>
      <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: right;">${Math.round(row.total_enrollments).toLocaleString()}</td>
      <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: right; color: ${row.enrollment_change > 0 ? "#059669" : "#9ca3af"};">+${Math.round(row.enrollment_change)}</td>
      <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${fmt(row.total_revenue)}</td>
      <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: right; color: ${row.revenue_change_pct < -0.5 ? "#dc2626" : "#f59e0b"};">${pct(row.revenue_change_pct)}</td>
      <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: right;">${fmt(row.total_scholarships_spent)}</td>
      <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: right;">${Math.round(row.students_receiving_aid).toLocaleString()}</td>
    `;
    tbody.appendChild(tr);
  });
}

function wireTabs() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.dataset.tab;

      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach((p) => p.classList.remove("active"));

      btn.classList.add("active");
      document.querySelector(`.tab-pane[data-tab="${tabName}"]`).classList.add("active");
    });
  });
}

function wireOptimizerControls() {
  document.getElementById("opt-run")?.addEventListener("click", runOptimizer);
  [
    "opt-objective",
    "opt-curve-shape"
  ].forEach((id) => {
    document.getElementById(id)?.addEventListener("change", runOptimizer);
  });
}

async function init() {
  try {
    if (!window.Plotly) throw new Error("Plotly not loaded.");
    if (!window.Papa) throw new Error("Papa Parse not loaded.");

    const res = await fetch("./data/scholarship_optimization_summary_v2.csv");
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

    const csv = await res.text();
    const parsed = Papa.parse(csv, { header: true, dynamicTyping: true });
    if (!parsed.data || parsed.data.length === 0) throw new Error("No data rows found in CSV.");

    state.data = parsed.data.filter((row) =>
      row.scholarship_amount !== undefined &&
      row.scholarship_amount !== null &&
      Number.isFinite(row.total_enrollments)
    );
    if (state.data.length === 0) throw new Error("All rows were filtered out. Check CSV format.");

    updateKPIs();
    renderTradeoff();
    renderScenarios();
    wireTabs();
    wireOptimizerControls();
    runOptimizer();
  } catch (e) {
    console.error("Init error:", e);
    alert(`Error loading dashboard: ${e.message}`);
    document.body.innerHTML += `<div style="padding: 40px; color: red;"><h2>Error</h2><p>${e.message}</p></div>`;
  }
}

document.addEventListener("DOMContentLoaded", init);
