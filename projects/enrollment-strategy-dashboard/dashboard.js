const state = {
  institution: null,
  metadata: null,
  students: [],
  activeRows: [],
  historicalRows: [],
  filteredRows: [],
  filteredHistoricalRows: [],
  programSummary: [],
  sourceSummary: [],
  segmentSummary: [],
  aidCurve: [],
  activeCounts: null,
};

const FILTER_IDS = {
  studentType: "student-type-filter",
  geography: "geography-filter",
  program: "program-filter",
  source: "source-filter",
};

const STAGE_LABELS = [
  "Inquiry",
  "App Started",
  "App Completed",
  "Admit",
  "Deposit",
  "Matriculate",
];

document.addEventListener("DOMContentLoaded", async () => {
  await loadAllData();
  initializeFilters();
  initializeScenarioControls();
  applyFilters();
});

async function loadAllData() {
  const [
    students,
    institutionRows,
    programSummary,
    sourceSummary,
    segmentSummary,
    aidCurve,
    metadata,
  ] = await Promise.all([
    loadCsv("data/student_funnel_synthetic.csv"),
    loadCsv("data/institution_profile.csv"),
    loadCsv("data/program_summary.csv"),
    loadCsv("data/source_summary.csv"),
    loadCsv("data/segment_summary.csv"),
    loadCsv("data/aid_tradeoff_curve.csv"),
    fetch("data/metadata.json").then((response) => response.json()),
  ]);

  state.students = students.map(normalizeStudentRow);
  state.institution = institutionRows[0];
  state.programSummary = programSummary.map(normalizeNumericRow);
  state.sourceSummary = sourceSummary.map(normalizeNumericRow);
  state.segmentSummary = segmentSummary.map(normalizeNumericRow);
  state.aidCurve = aidCurve.map(normalizeNumericRow);
  state.metadata = metadata;
  state.activeRows = state.students.filter((row) => Number(row.cycle_year) === Number(metadata.active_cycle));
  state.historicalRows = state.students.filter((row) => Number(row.cycle_year) !== Number(metadata.active_cycle));
  state.activeCounts = getCounts(state.activeRows);

  const heroInstitution = document.getElementById("hero-institution");
  if (heroInstitution && metadata.institution_name) {
    heroInstitution.textContent = metadata.institution_name;
  }
}

async function loadCsv(url) {
  const response = await fetch(url);
  const csvText = await response.text();
  return Papa.parse(csvText, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  }).data;
}

function normalizeNumericRow(row) {
  const out = { ...row };
  Object.keys(out).forEach((key) => {
    const value = out[key];
    if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
      out[key] = Number(value);
    }
  });
  return out;
}

function normalizeStudentRow(row) {
  const numericFields = [
    "cycle_year",
    "first_gen_flag",
    "need_aid_flag",
    "visit_flag",
    "counselor_meeting_flag",
    "academic_index",
    "affordability_index",
    "engagement_score",
    "completeness_score",
    "offer_fit_score",
    "app_started_flag",
    "app_completed_flag",
    "admit_flag",
    "deposit_flag",
    "melt_flag",
    "matriculated_flag",
    "orientation_rsvp_flag",
    "housing_contract_flag",
    "late_deposit_flag",
    "melt_risk_score",
    "price_sensitivity_score",
    "recoverability_score",
    "recoverable_flag",
    "counselor_priority_score",
    "counselor_priority_flag",
    "sticker_price",
    "total_institutional_aid",
    "net_price",
    "discount_rate_individual",
    "scholarship_priority_score",
  ];

  const out = { ...row };
  numericFields.forEach((field) => {
    out[field] = Number(out[field] || 0);
  });
  return out;
}

function initializeFilters() {
  populateSelect(
    FILTER_IDS.studentType,
    ["All", ...uniqueValues(state.activeRows, "student_type")]
  );
  populateSelect(
    FILTER_IDS.geography,
    ["All", ...uniqueValues(state.activeRows, "market_geography")]
  );
  populateSelect(
    FILTER_IDS.program,
    ["All", ...uniqueValues(state.activeRows, "academic_program")]
  );
  populateSelect(
    FILTER_IDS.source,
    ["All", ...uniqueValues(state.activeRows, "source_channel")]
  );

  Object.values(FILTER_IDS).forEach((id) => {
    document.getElementById(id).addEventListener("change", applyFilters);
  });

  document.getElementById("reset-filters-btn").addEventListener("click", () => {
    Object.values(FILTER_IDS).forEach((id) => {
      document.getElementById(id).value = "All";
    });
    applyFilters();
  });
}

function initializeScenarioControls() {
  const sliderIds = [
    "scenario-inquiry-multiplier",
    "scenario-completion-lift",
    "scenario-admit-lift",
    "scenario-award-delta",
    "scenario-melt-improvement",
    "scenario-yield-lift",
  ];
  sliderIds.forEach((id) => {
    document.getElementById(id).addEventListener("input", updateScenarioSection);
  });
  document.getElementById("scenario-reset-btn").addEventListener("click", () => {
    document.getElementById("scenario-inquiry-multiplier").value = 100;
    document.getElementById("scenario-completion-lift").value = 0;
    document.getElementById("scenario-admit-lift").value = 0;
    document.getElementById("scenario-award-delta").value = 0;
    document.getElementById("scenario-melt-improvement").value = 0;
    document.getElementById("scenario-yield-lift").value = 0;
    updateScenarioSection();
  });
}

function populateSelect(id, values) {
  const select = document.getElementById(id);
  select.innerHTML = values
    .map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)
    .join("");
}

function applyFilters() {
  const studentType = document.getElementById(FILTER_IDS.studentType).value;
  const geography = document.getElementById(FILTER_IDS.geography).value;
  const program = document.getElementById(FILTER_IDS.program).value;
  const source = document.getElementById(FILTER_IDS.source).value;
  const selections = { studentType, geography, program, source };

  state.filteredRows = state.activeRows.filter((row) => matchesFilters(row, selections));
  state.filteredHistoricalRows = state.historicalRows.filter((row) => matchesFilters(row, selections));

  updateDashboard();
}

function updateDashboard() {
  const rows = state.filteredRows;
  const counts = getCounts(rows);
  const sliceTarget = getSliceTarget(counts.inquiries);

  updateHero(counts, sliceTarget);
  updateKpis(counts, sliceTarget, rows);
  updateDecisionCards(counts, sliceTarget, rows);
  updateBenchmarkNotes(rows, counts, sliceTarget);

  renderAttainmentChart(counts, sliceTarget);
  renderCycleTrendChart();
  renderStageConversionChart(counts);
  renderLeakageCountChart(counts);
  renderSourceEfficiencyChart(rows);
  renderRecoverableProgramsChart(rows);
  renderProgramGapChart(rows);
  renderSegmentOpportunityChart(rows);
  renderCounselorTable(rows);
  renderRecoverableTable(rows);
  renderAidTradeoffChart();
  renderAidSegmentsChart(rows);
  renderMeltRiskChart(rows);
  renderMeltDriversChart(rows);
  renderMeltWatchlist(rows);
  updateScenarioSection();
}

function updateHero(counts, sliceTarget) {
  const gap = sliceTarget - counts.matric;
  setText("brief-target", formatNumber(Math.round(sliceTarget)));
  setText("brief-projected", formatNumber(counts.matric));
  setText("brief-gap", formatSignedNumber(gap));

  const headline =
    gap <= 0
      ? "Current slice is on pace to meet or exceed target."
      : gap <= sliceTarget * 0.08
      ? "Current slice is close to target but still needs targeted lift."
      : "Current slice is materially behind target and needs intervention.";
  setText("brief-headline", headline);

  const copy =
    gap <= 0
      ? `${formatNumber(counts.deposit)} deposits and ${formatCurrency(getNetRevenue(state.filteredRows))} in projected net tuition keep this slice ahead of pace inside the calibrated benchmark envelope.`
      : `${formatNumber(counts.deposit)} deposits translate to ${formatNumber(counts.matric)} projected matriculants. The slice still needs ${formatNumber(Math.max(0, Math.round(gap)))} more students to reach its current target allocation inside the calibrated benchmark envelope.`;
  setText("brief-copy", copy);
}

function updateKpis(counts, sliceTarget, rows) {
  const gross = getGrossTuition(rows);
  const aid = getAid(rows);
  const net = gross - aid;
  const discount = gross > 0 ? aid / gross : 0;
  const gap = sliceTarget - counts.matric;
  const highRiskDeposits = rows.filter((row) => row.deposit_flag === 1 && row.melt_risk_score >= 63).length;
  const counselor = rows.filter((row) => row.counselor_priority_flag === 1).length;
  const recoverable = rows.filter((row) => row.recoverable_flag === 1).length;

  setText("kpi-matriculants", formatNumber(counts.matric));
  setText(
    "kpi-target-gap",
    gap <= 0
      ? `${formatNumber(Math.abs(Math.round(gap)))} ahead of slice target`
      : `${formatNumber(Math.round(gap))} short of slice target`
  );

  setText("kpi-deposits", formatNumber(counts.deposit));
  setText("kpi-melt-exposure", `${formatNumber(highRiskDeposits)} high-risk deposits`);

  setText("kpi-net-revenue", formatCurrency(net));
  setText("kpi-discount-rate", `${formatPct(discount)} average institutional discount`);

  setText("kpi-counselor", formatNumber(counselor));
  setText("kpi-recoverable", `${formatNumber(recoverable)} recoverable incompletes`);
}

function updateDecisionCards(counts, sliceTarget, rows) {
  const stageRates = getStageRates(counts);
  const benchmarkRates = getStageRates(getBenchmarkCounts());
  const stageDiffs = [
    { key: "startRate", label: "Inquiry to app start" },
    { key: "completionRate", label: "Start to completion" },
    { key: "admitRate", label: "Complete to admit" },
    { key: "depositRate", label: "Admit to deposit" },
    { key: "matricRate", label: "Deposit to matriculate" },
  ].map((stage) => ({
    ...stage,
    delta: stageRates[stage.key] - benchmarkRates[stage.key],
  }));
  const weakestStage = stageDiffs.sort((a, b) => a.delta - b.delta)[0];

  setText("decision-leak-title", weakestStage.label);
  const leakCopy =
    Math.abs(weakestStage.delta) < 0.002
      ? "This is still the largest absolute drop-off point in the funnel, even though the current slice is running close to the historical benchmark."
      : `This slice is running ${formatSignedPct(weakestStage.delta)} versus the historical benchmark, which is where the largest avoidable drop-off is happening right now.`;
  setText("decision-leak-copy", leakCopy);

  const bestOpportunity = getTopOpportunity(rows);
  setText("decision-opportunity-title", bestOpportunity.title);
  setText("decision-opportunity-copy", bestOpportunity.copy);

  const action = getImmediateAction(rows, counts, sliceTarget);
  setText("decision-action-title", action.title);
  setText("decision-action-copy", action.copy);
}

function updateBenchmarkNotes(rows, counts, sliceTarget) {
  const benchmarkMethod = state.metadata?.benchmark_method || "official-source matched benchmark";
  const classTarget = Number(state.metadata?.class_target || state.institution?.class_target || 0);
  const admitGuardrail = Number(state.institution?.benchmark_complete_to_admit_rate || 0);
  const depositGuardrail = Number(state.institution?.benchmark_admit_to_deposit_rate || 0);
  const matricGuardrail = Number(state.institution?.benchmark_deposit_to_matric_rate || 0);
  const netPriceGuardrail =
    mean(state.activeRows.filter((row) => row.admit_flag === 1).map((row) => row.net_price)) || 0;
  const topPrograms = [...state.programSummary]
    .sort((a, b) => Number(b.target_matriculants || 0) - Number(a.target_matriculants || 0))
    .slice(0, 2);
  const topProgramText = topPrograms
    .map((row) => `${row.academic_program} (${formatNumber(row.target_matriculants)})`)
    .join(" and ");

  setText(
    "hero-benchmark-note",
    `Benchmark anchor: ${benchmarkMethod}. Full-class target ${formatNumber(classTarget)}, complete-to-admit ${formatPct(admitGuardrail)}, admit-to-deposit ${formatPct(depositGuardrail)}, and deposit-to-matric ${formatPct(matricGuardrail)}.`
  );
  setText(
    "provenance-note",
    `Calibrated to IPEDS admissions, College Scorecard pricing, and CDS profile guardrails. Historical comparisons are synthetic; the target envelope is benchmarked.`
  );
  setText(
    "note-overview",
    `This slice rolls up to a calibrated full-class target of ${formatNumber(classTarget)}. The current filtered allocation is ${formatNumber(Math.round(sliceTarget))} students, and admitted net price is anchored near ${formatCurrency(netPriceGuardrail)}.`
  );
  setText(
    "note-conversion",
    `Current bars compare against the historical synthetic benchmark. The conversion envelope is constrained by ${formatPct(admitGuardrail)} complete-to-admit, ${formatPct(depositGuardrail)} admit-to-deposit, and ${formatPct(matricGuardrail)} deposit-to-matric guardrails.`
  );
  setText(
    "note-programs",
    `Program targets are benchmark-calibrated rather than evenly split. The largest full-class allocations currently sit in ${topProgramText || "the leading program groups"}.`
  );
  setText(
    "note-aid",
    `This award strategy tradeoff is interpreted against a benchmark net-price target near ${formatCurrency(netPriceGuardrail)}. Award changes are useful only if class lift is worth the additional discount pressure.`
  );
  setText(
    "note-melt",
    `Melt risk is simulated, but no-show exposure is bounded inside an ${formatPct(matricGuardrail)} deposit-to-matric guardrail. Late deposits, missing orientation, and missing housing remain the main intervention triggers.`
  );
  setText(
    "note-scenario",
    `Scenario levers move inside the calibrated target envelope first. Any remaining shortfall after operational changes is treated as market-driven or still unmet demand.`
  );
}

function getTopOpportunity(rows) {
  const byProgram = groupBy(rows, "academic_program");
  const globalByProgram = groupBy(state.activeRows, "academic_program");
  const entries = Object.keys(byProgram).map((program) => {
    const filteredProgramRows = byProgram[program];
    const globalProgramRows = globalByProgram[program] || [];
    const target = getProgramTarget(program, filteredProgramRows.length, globalProgramRows.length);
    const matric = filteredProgramRows.filter((row) => row.matriculated_flag === 1).length;
    return { program, gap: target - matric };
  });
  const topGap = entries.sort((a, b) => b.gap - a.gap)[0];
  if (topGap && topGap.gap > 0) {
    return {
      title: `${topGap.program} is the clearest class-shaping opportunity`,
      copy: `${topGap.program} is ${formatNumber(Math.round(topGap.gap))} students under its current target allocation in this slice. That makes it the first place to push yield, recovery, or tactical aid.`,
    };
  }

  return {
    title: "Current mix is broadly in line with target",
    copy: "The filtered slice is not showing a major program gap right now, so the next gain likely comes from broad completion and deposit lift rather than one isolated program.",
  };
}

function getImmediateAction(rows, counts, sliceTarget) {
  const counselor = rows.filter((row) => row.counselor_priority_flag === 1).length;
  const recoverable = rows.filter((row) => row.recoverable_flag === 1).length;
  const highRiskDeposits = rows.filter((row) => row.deposit_flag === 1 && row.melt_risk_score >= 63).length;
  const gap = sliceTarget - counts.matric;

  if (highRiskDeposits >= counselor && highRiskDeposits >= recoverable) {
    return {
      title: "Protect the deposited class first",
      copy: `${formatNumber(highRiskDeposits)} deposits are already high-risk. Tightening orientation, housing, and summer-touch follow-up is the fastest way to defend current volume.`,
    };
  }
  if (recoverable > counselor) {
    return {
      title: "Push application recovery now",
      copy: `${formatNumber(recoverable)} incomplete applicants still look recoverable in this slice. If the class gap stays open, this is the cheapest near-term lift.`,
    };
  }
  return {
    title: gap > 0 ? "Focus counselor time on high-value admits" : "Use counselor time to protect yield quality",
    copy: `${formatNumber(counselor)} admits are flagged for senior outreach. These are the records most likely to move deposit volume without opening broad discount pressure.`,
  };
}

function renderAttainmentChart(counts, sliceTarget) {
  const gap = sliceTarget - counts.matric;
  plot("chart-attainment", [
    {
      type: "bar",
      x: ["Slice Target", "Projected Matriculants", "Deposits"],
      y: [sliceTarget, counts.matric, counts.deposit],
      customdata: [
        ["Allocated slice target from the calibrated class target", 1],
        ["Projected share of slice target", div0(counts.matric, sliceTarget)],
        ["Current deposits relative to projected matriculants", div0(counts.matric, counts.deposit)],
      ],
      marker: {
        color: ["#cbd5e1", gap <= 0 ? "#0f9d73" : "#2563eb", "#f97316"],
      },
      text: [sliceTarget, counts.matric, counts.deposit].map((value) => formatNumber(Math.round(value))),
      textposition: "outside",
      hovertemplate: "%{x}: %{y:,.0f}<br>%{customdata[0]}<br>Reference rate: %{customdata[1]:.1%}<extra></extra>",
    },
  ], {
    height: 360,
    yaxis: { title: "Students" },
    margin: { l: 60, r: 20, t: 10, b: 50 },
  });
}

function renderCycleTrendChart() {
  const grouped = {};
  state.students.forEach((row) => {
    const year = row.cycle_year;
    if (!grouped[year]) grouped[year] = getCounts([]);
    grouped[year].inquiries += 1;
    grouped[year].started += row.app_started_flag;
    grouped[year].completed += row.app_completed_flag;
    grouped[year].admit += row.admit_flag;
    grouped[year].deposit += row.deposit_flag;
    grouped[year].matric += row.matriculated_flag;
    grouped[year].melt += row.melt_flag;
  });
  const years = Object.keys(grouped).sort();
  plot("chart-cycle-trend", [
    lineTrace(years, years.map((year) => grouped[year].inquiries), "Inquiries", "#94a3b8"),
    lineTrace(years, years.map((year) => grouped[year].completed), "Completed Apps", "#2563eb"),
    lineTrace(years, years.map((year) => grouped[year].admit), "Admits", "#f97316"),
    lineTrace(years, years.map((year) => grouped[year].matric), "Matriculants", "#0f9d73"),
  ], {
    height: 360,
    yaxis: { title: "Students" },
    margin: { l: 60, r: 20, t: 10, b: 50 },
  });
}

function renderStageConversionChart(counts) {
  const stageRates = getStageRates(counts);
  const benchmarkRates = getStageRates(getBenchmarkCounts());
  const labels = [
    "Inquiry to Start",
    "Start to Complete",
    "Complete to Admit",
    "Admit to Deposit",
    "Deposit to Matric",
  ];
  plot("chart-stage-conversion", [
    {
      type: "bar",
      name: "Current Slice",
      x: labels,
      y: [
        stageRates.startRate * 100,
        stageRates.completionRate * 100,
        stageRates.admitRate * 100,
        stageRates.depositRate * 100,
        stageRates.matricRate * 100,
      ],
      customdata: [
        benchmarkRates.startRate * 100,
        benchmarkRates.completionRate * 100,
        benchmarkRates.admitRate * 100,
        benchmarkRates.depositRate * 100,
        benchmarkRates.matricRate * 100,
      ],
      marker: { color: "#2563eb" },
      hovertemplate: "%{x}<br>Current slice: %{y:.1f}%<br>Historical benchmark: %{customdata:.1f}%<extra></extra>",
    },
    {
      type: "bar",
      name: "Historical Benchmark",
      x: labels,
      y: [
        benchmarkRates.startRate * 100,
        benchmarkRates.completionRate * 100,
        benchmarkRates.admitRate * 100,
        benchmarkRates.depositRate * 100,
        benchmarkRates.matricRate * 100,
      ],
      customdata: [
        stageRates.startRate * 100,
        stageRates.completionRate * 100,
        stageRates.admitRate * 100,
        stageRates.depositRate * 100,
        stageRates.matricRate * 100,
      ],
      marker: { color: "#cbd5e1" },
      hovertemplate: "%{x}<br>Historical benchmark: %{y:.1f}%<br>Current slice: %{customdata:.1f}%<extra></extra>",
    },
  ], {
    barmode: "group",
    height: 360,
    yaxis: { title: "Rate (%)" },
    margin: { l: 60, r: 20, t: 10, b: 80 },
  });
}

function renderLeakageCountChart(counts) {
  // Use business-facing drop-off buckets instead of raw transition labels.
  const values = [
    counts.inquiries - counts.completed,
    counts.completed - counts.admit,
    counts.admit - counts.deposit,
    Math.max(counts.deposit - counts.matric - counts.melt, 0),
    counts.melt,
  ];
  plot("chart-leakage-count", [
    {
      type: "waterfall",
      measure: ["relative", "relative", "relative", "relative", "relative"],
      x: ["No Application", "No Admit", "No Deposit", "No Start", "Melt / No Show"],
      y: values.map((value) => -value),
      text: values.map((value) => formatNumber(value)),
      textposition: "outside",
      connector: { line: { color: "#94a3b8" } },
      decreasing: { marker: { color: "#f97316" } },
      increasing: { marker: { color: "#0f9d73" } },
      hovertemplate: "%{x}: %{text} students<extra></extra>",
    },
  ], {
    height: 360,
    yaxis: { title: "Count change" },
    margin: { l: 60, r: 20, t: 10, b: 70 },
  });
}

function renderSourceEfficiencyChart(rows) {
  const bySource = groupBy(rows, "source_channel");
  const totalRows = rows.length || 1;
  const totalMatric = rows.filter((row) => row.matriculated_flag === 1).length || 1;

  const data = Object.keys(bySource)
    .map((source) => {
      const sourceRows = bySource[source];
      const inquiries = sourceRows.length;
      const matric = sourceRows.filter((row) => row.matriculated_flag === 1).length;
      const efficiency = matric / totalMatric - inquiries / totalRows;
      return { source, efficiency };
    })
    .sort((a, b) => a.efficiency - b.efficiency);

  plot("chart-source-efficiency", [
    {
      type: "bar",
      orientation: "h",
      y: data.map((item) => item.source),
      x: data.map((item) => item.efficiency * 100),
      marker: {
        color: data.map((item) => (item.efficiency >= 0 ? "#0f9d73" : "#dc2626")),
      },
      text: data.map((item) => `${item.efficiency >= 0 ? "+" : ""}${(item.efficiency * 100).toFixed(1)} pp`),
      textposition: "outside",
      hovertemplate: "%{y}: %{x:.1f} percentage-point efficiency gap<extra></extra>",
    },
  ], {
    height: 360,
    xaxis: { title: "Enrollment share minus inquiry share (pp)", zeroline: true, zerolinecolor: "#94a3b8" },
    margin: { l: 110, r: 20, t: 10, b: 50 },
  });
}

function renderRecoverableProgramsChart(rows) {
  const byProgram = groupBy(rows.filter((row) => row.recoverable_flag === 1), "academic_program");
  const data = Object.keys(byProgram)
    .map((program) => ({
      program,
      count: byProgram[program].length,
    }))
    .sort((a, b) => b.count - a.count);

  plot("chart-recoverable-programs", [
    {
      type: "bar",
      x: data.map((item) => item.program),
      y: data.map((item) => item.count),
      marker: { color: "#334155" },
      text: data.map((item) => formatNumber(item.count)),
      textposition: "outside",
      hovertemplate: "%{x}: %{y} recoverable applicants<extra></extra>",
    },
  ], {
    height: 360,
    yaxis: { title: "Applicants" },
    margin: { l: 60, r: 20, t: 10, b: 80 },
  });
}

function renderProgramGapChart(rows) {
  const byProgramFiltered = groupBy(rows, "academic_program");
  const byProgramTotal = groupBy(state.activeRows, "academic_program");

  const programs = state.programSummary.map((row) => row.academic_program);
  const data = programs.map((program) => {
    const filteredRows = byProgramFiltered[program] || [];
    const totalRows = byProgramTotal[program] || [];
    const target = getProgramTarget(program, filteredRows.length, totalRows.length);
    const matric = filteredRows.filter((row) => row.matriculated_flag === 1).length;
    return {
      program,
      target,
      matric,
      gap: target - matric,
    };
  }).sort((a, b) => b.gap - a.gap);

  plot("chart-program-gap", [
    {
      type: "bar",
      orientation: "h",
      y: data.map((item) => item.program),
      x: data.map((item) => item.gap),
      customdata: data.map((item) => [item.target, item.matric]),
      marker: {
        color: data.map((item) => (item.gap > 0 ? "#f97316" : "#0f9d73")),
      },
      text: data.map((item) => formatSignedNumber(Math.round(item.gap))),
      textposition: "outside",
      hovertemplate:
        "%{y}<br>Gap to target: %{x:.1f}" +
        "<br>Calibrated target: %{customdata[0]:.1f}" +
        "<br>Projected matriculants: %{customdata[1]:.1f}<extra></extra>",
    },
  ], {
    height: 360,
    xaxis: { title: "Target gap", zeroline: true, zerolinecolor: "#94a3b8" },
    margin: { l: 110, r: 20, t: 10, b: 50 },
  });
}

function renderSegmentOpportunityChart(rows) {
  const bySegment = groupBy(rows, "segment_name");
  const data = Object.keys(bySegment)
    .map((segment) => {
      const group = bySegment[segment];
      const counts = getCounts(group);
      const recoverableApplicants = group.filter((row) => row.recoverable_flag === 1).length;
      const counselorPriorityAdmits = group.filter((row) => row.counselor_priority_flag === 1).length;
      const actionCount = recoverableApplicants + counselorPriorityAdmits;
      const completionRate = counts.inquiries ? counts.completed / counts.inquiries : 0;
      const depositRate = counts.admit ? counts.deposit / counts.admit : 0;
      return {
        segment,
        actionCount,
        recoverableApplicants,
        counselorPriorityAdmits,
        completionRate,
        depositRate,
      };
    })
    .sort((a, b) => b.actionCount - a.actionCount)
    .slice(0, 8);

  plot("chart-segment-opportunity", [
    {
      type: "bar",
      orientation: "h",
      y: data.map((item) => item.segment).reverse(),
      x: data.map((item) => item.actionCount).reverse(),
      marker: { color: "#2563eb" },
      text: data.map((item) => formatNumber(item.actionCount)).reverse(),
      textposition: "outside",
      customdata: data
        .map((item) => [item.recoverableApplicants, item.counselorPriorityAdmits, item.completionRate * 100, item.depositRate * 100])
        .reverse(),
      hovertemplate:
        "%{y}<br>Actionable students: %{x}" +
        "<br>Recoverable incomplete applicants: %{customdata[0]}" +
        "<br>Priority admits without deposit: %{customdata[1]}" +
        "<br>Inquiry to complete: %{customdata[2]:.1f}%" +
        "<br>Admit to deposit: %{customdata[3]:.1f}%<extra></extra>",
    },
  ], {
    height: 360,
    xaxis: { title: "Actionable students" },
    margin: { l: 220, r: 20, t: 10, b: 50 },
  });
}

function renderCounselorTable(rows) {
  const tableRows = rows
    .filter((row) => row.counselor_priority_flag === 1)
    .sort((a, b) => b.counselor_priority_score - a.counselor_priority_score)
    .slice(0, 12);

  setText("counselor-count-badge", `${formatNumber(rows.filter((row) => row.counselor_priority_flag === 1).length)} admits`);

  renderTable("table-counselor-priority", tableRows, (row) => `
    <tr>
      <td class="mono">${escapeHtml(row.student_id)}</td>
      <td>${escapeHtml(row.academic_program)}</td>
      <td>${escapeHtml(row.market_geography)}</td>
      <td><span class="pill ${bandClass(row.counselor_priority_score, [55, 75])}">${Math.round(row.counselor_priority_score)}</span></td>
      <td class="mono">${formatCurrency(row.net_price)}</td>
      <td>${escapeHtml(row.next_best_action)}</td>
    </tr>
  `);
}

function renderRecoverableTable(rows) {
  const tableRows = rows
    .filter((row) => row.recoverable_flag === 1)
    .sort((a, b) => b.recoverability_score - a.recoverability_score)
    .slice(0, 12);

  setText("recoverable-count-badge", `${formatNumber(rows.filter((row) => row.recoverable_flag === 1).length)} applicants`);

  renderTable("table-recoverable", tableRows, (row) => `
    <tr>
      <td class="mono">${escapeHtml(row.student_id)}</td>
      <td>${escapeHtml(row.academic_program)}</td>
      <td>${escapeHtml(row.source_channel)}</td>
      <td><span class="pill ${bandClass(row.recoverability_score, [50, 70])}">${Math.round(row.recoverability_score)}</span></td>
      <td>${Math.round(row.completeness_score)}%</td>
      <td>${escapeHtml(row.next_best_action)}</td>
    </tr>
  `);
}

function renderAidTradeoffChart() {
  const curve = state.aidCurve;
  plot("chart-aid-tradeoff", [
    {
      type: "scatter",
      mode: "lines+markers",
      name: "Expected Matriculants",
      x: curve.map((row) => row.avg_award),
      y: curve.map((row) => row.expected_matriculants),
      customdata: curve.map((row) => [formatAwardChange(row.award_delta), row.award_delta]),
      line: { color: "#2563eb", width: 3 },
      marker: { size: 8 },
      yaxis: "y1",
      hovertemplate:
        "Average award: %{x:$,.0f}" +
        "<br>%{customdata[0]}" +
        "<br>Expected matriculants: %{y:,.1f}<extra></extra>",
    },
    {
      type: "scatter",
      mode: "lines+markers",
      name: "Expected Net Tuition",
      x: curve.map((row) => row.avg_award),
      y: curve.map((row) => row.expected_net_tuition),
      customdata: curve.map((row) => [formatAwardChange(row.award_delta), row.award_delta]),
      line: { color: "#f97316", width: 3 },
      marker: { size: 8 },
      yaxis: "y2",
      hovertemplate:
        "Average award: %{x:$,.0f}" +
        "<br>%{customdata[0]}" +
        "<br>Expected NTR: %{y:$,.0f}<extra></extra>",
    },
  ], {
    height: 360,
    xaxis: { title: "Average award", tickprefix: "$" },
    yaxis: { title: "Expected matriculants", titlefont: { color: "#2563eb" }, tickfont: { color: "#2563eb" } },
    yaxis2: {
      title: "Expected net tuition",
      titlefont: { color: "#f97316" },
      tickfont: { color: "#f97316" },
      overlaying: "y",
      side: "right",
      tickprefix: "$",
    },
    margin: { l: 60, r: 70, t: 10, b: 50 },
  });
}

function renderAidSegmentsChart(rows) {
  const admits = rows.filter((row) => row.admit_flag === 1);
  const bySegment = groupBy(admits, "segment_name");
  const data = Object.keys(bySegment)
    .map((segment) => {
      const group = bySegment[segment];
      const aidResponsiveAdmits = group.filter(
        (row) => row.deposit_flag === 0 && row.scholarship_priority_band === "Increase Aid"
      ).length;
      return {
        segment,
        aidResponsiveAdmits,
        avgPriceSensitivity: mean(group.map((row) => row.price_sensitivity_score)),
        avgAward: mean(group.map((row) => row.total_institutional_aid)),
        avgNetPrice: mean(group.map((row) => row.net_price)),
      };
    })
    .sort((a, b) => b.aidResponsiveAdmits - a.aidResponsiveAdmits)
    .slice(0, 8);

  plot("chart-aid-segments", [
    {
      type: "bar",
      orientation: "h",
      y: data.map((item) => item.segment).reverse(),
      x: data.map((item) => item.aidResponsiveAdmits).reverse(),
      marker: { color: "#334155" },
      text: data.map((item) => formatNumber(item.aidResponsiveAdmits)).reverse(),
      textposition: "outside",
      customdata: data
        .map((item) => [item.avgPriceSensitivity, item.avgAward, item.avgNetPrice])
        .reverse(),
      hovertemplate:
        "%{y}<br>High-priority non-deposited admits: %{x}" +
        "<br>Average price sensitivity: %{customdata[0]:.1f}" +
        "<br>Average current award: %{customdata[1]:$,.0f}" +
        "<br>Average net price: %{customdata[2]:$,.0f}<extra></extra>",
    },
  ], {
    height: 360,
    xaxis: { title: "High-priority non-deposited admits" },
    margin: { l: 220, r: 20, t: 10, b: 50 },
  });
}

function renderMeltRiskChart(rows) {
  const deposits = rows.filter((row) => row.deposit_flag === 1);
  const counts = [
    deposits.filter((row) => row.melt_risk_score < 38).length,
    deposits.filter((row) => row.melt_risk_score >= 38 && row.melt_risk_score < 63).length,
    deposits.filter((row) => row.melt_risk_score >= 63).length,
  ];
  plot("chart-melt-risk", [
    {
      type: "bar",
      x: ["Low", "Medium", "High"],
      y: counts,
      marker: { color: ["#0f9d73", "#d97706", "#dc2626"] },
      text: counts.map((value) => formatNumber(value)),
      textposition: "outside",
      hovertemplate: "%{x} risk: %{y} deposits<extra></extra>",
    },
  ], {
    height: 360,
    yaxis: { title: "Deposits" },
    margin: { l: 60, r: 20, t: 10, b: 50 },
  });
}

function renderMeltDriversChart(rows) {
  const deposits = rows.filter((row) => row.deposit_flag === 1);
  const driverData = [
    { label: "Late deposit", value: deposits.filter((row) => row.late_deposit_flag === 1).length },
    { label: "No orientation", value: deposits.filter((row) => row.orientation_rsvp_flag === 0).length },
    { label: "No housing", value: deposits.filter((row) => row.housing_contract_flag === 0).length },
    { label: "High price sensitivity", value: deposits.filter((row) => row.price_sensitivity_score >= 64).length },
    { label: "Low engagement", value: deposits.filter((row) => row.engagement_score < 55).length },
    { label: "International friction", value: deposits.filter((row) => row.residency === "International").length },
  ].sort((a, b) => b.value - a.value);

  plot("chart-melt-drivers", [
    {
      type: "bar",
      orientation: "h",
      y: driverData.map((item) => item.label).reverse(),
      x: driverData.map((item) => item.value).reverse(),
      marker: { color: "#dc2626" },
      text: driverData.map((item) => formatNumber(item.value)).reverse(),
      textposition: "outside",
      hovertemplate: "%{y}: %{x} deposits<extra></extra>",
    },
  ], {
    height: 360,
    xaxis: { title: "Affected deposits" },
    margin: { l: 150, r: 20, t: 10, b: 50 },
  });
}

function renderMeltWatchlist(rows) {
  const tableRows = rows
    .filter((row) => row.deposit_flag === 1 && row.melt_risk_score >= 63)
    .sort((a, b) => b.melt_risk_score - a.melt_risk_score)
    .slice(0, 12);

  setText("melt-count-badge", `${formatNumber(rows.filter((row) => row.deposit_flag === 1 && row.melt_risk_score >= 63).length)} high-risk deposits`);

  renderTable("table-melt-watchlist", tableRows, (row) => `
    <tr>
      <td class="mono">${escapeHtml(row.student_id)}</td>
      <td>${escapeHtml(row.academic_program)}</td>
      <td><span class="pill ${bandClass(row.melt_risk_score, [38, 63])}">${Math.round(row.melt_risk_score)}</span></td>
      <td>${escapeHtml(getMeltDrivers(row).join(", "))}</td>
      <td class="mono">${escapeHtml(row.deposit_date || "-")}</td>
      <td>${escapeHtml(row.next_best_action)}</td>
    </tr>
  `);
}

function updateScenarioSection() {
  updateScenarioLabels();
  if (!state.filteredRows.length) return;

  const baselineCounts = getCounts(state.filteredRows);
  const baselineRates = getStageRates(baselineCounts);
  const avgNetPrice = mean(
    state.filteredRows.filter((row) => row.matriculated_flag === 1).map((row) => row.net_price)
  ) || mean(state.filteredRows.filter((row) => row.admit_flag === 1).map((row) => row.net_price)) || 0;
  const avgSticker = mean(
    state.filteredRows.filter((row) => row.admit_flag === 1).map((row) => row.sticker_price)
  ) || 0;
  const avgPriceSensitivity = mean(
    state.filteredRows.filter((row) => row.admit_flag === 1).map((row) => row.price_sensitivity_score)
  ) || 50;
  const sliceTarget = getSliceTarget(baselineCounts.inquiries);

  const inquiryMultiplier = Number(document.getElementById("scenario-inquiry-multiplier").value) / 100;
  const completionLift = Number(document.getElementById("scenario-completion-lift").value) / 100;
  const admitLift = Number(document.getElementById("scenario-admit-lift").value) / 100;
  const awardDelta = Number(document.getElementById("scenario-award-delta").value);
  const meltImprovement = Number(document.getElementById("scenario-melt-improvement").value) / 100;
  const yieldLift = Number(document.getElementById("scenario-yield-lift").value) / 100;

  const awardYieldLift = (awardDelta / 1000) * 0.0035 * (avgPriceSensitivity / 65);
  const awardMeltLift = (awardDelta / 1000) * 0.0018 * (avgPriceSensitivity / 70);

  const scenarioInquiries = baselineCounts.inquiries * inquiryMultiplier;
  const scenarioStartRate = clamp(baselineRates.startRate + completionLift * 0.6, 0.08, 0.95);
  const scenarioCompletionRate = clamp(baselineRates.completionRate + completionLift, 0.05, 0.98);
  const scenarioAdmitRate = clamp(baselineRates.admitRate + admitLift, 0.05, 0.95);
  const scenarioDepositRate = clamp(baselineRates.depositRate + yieldLift + awardYieldLift, 0.05, 0.9);
  const scenarioMatricRate = clamp(baselineRates.matricRate + meltImprovement + awardMeltLift, 0.5, 0.99);

  const scenarioStarted = scenarioInquiries * scenarioStartRate;
  const scenarioCompleted = scenarioStarted * scenarioCompletionRate;
  const scenarioAdmit = scenarioCompleted * scenarioAdmitRate;
  const scenarioDeposit = scenarioAdmit * scenarioDepositRate;
  const scenarioMatric = scenarioDeposit * scenarioMatricRate;

  const scenarioNetPrice = Math.max(4000, avgNetPrice - awardDelta);
  const scenarioNetTuition = scenarioMatric * scenarioNetPrice;
  const scenarioGross = scenarioMatric * avgSticker;
  const scenarioDiscount = scenarioGross > 0 ? 1 - scenarioNetTuition / scenarioGross : 0;
  const gap = sliceTarget - scenarioMatric;

  setText("scenario-matric", formatNumber(Math.round(scenarioMatric)));
  setText("scenario-net", formatCurrency(scenarioNetTuition));
  setText("scenario-discount", formatPct(scenarioDiscount));
  setText("scenario-gap", gap > 0 ? formatNumber(Math.round(gap)) : `${formatNumber(Math.round(Math.abs(gap)))} ahead`);

  renderScenarioFunnelChart(
    baselineCounts,
    {
      inquiries: scenarioInquiries,
      started: scenarioStarted,
      completed: scenarioCompleted,
      admit: scenarioAdmit,
      deposit: scenarioDeposit,
      matric: scenarioMatric,
    }
  );
  renderGapDecompositionChart(sliceTarget, baselineCounts.matric, scenarioMatric);
}

function updateScenarioLabels() {
  setText("scenario-inquiry-display", `${document.getElementById("scenario-inquiry-multiplier").value}%`);
  setText("scenario-completion-display", `${signedPpText(document.getElementById("scenario-completion-lift").value)} pp`);
  setText("scenario-admit-display", `${signedPpText(document.getElementById("scenario-admit-lift").value)} pp`);
  setText("scenario-award-display", formatAwardChange(Number(document.getElementById("scenario-award-delta").value)));
  setText("scenario-melt-display", `${signedPpText(document.getElementById("scenario-melt-improvement").value)} pp`);
  setText("scenario-yield-display", `${signedPpText(document.getElementById("scenario-yield-lift").value)} pp`);
}

function renderScenarioFunnelChart(baseline, scenario) {
  plot("chart-scenario-funnel", [
    {
      type: "bar",
      name: "Baseline",
      x: STAGE_LABELS,
      y: [baseline.inquiries, baseline.started, baseline.completed, baseline.admit, baseline.deposit, baseline.matric],
      marker: { color: "#cbd5e1" },
    },
    {
      type: "bar",
      name: "Scenario",
      x: STAGE_LABELS,
      y: [scenario.inquiries, scenario.started, scenario.completed, scenario.admit, scenario.deposit, scenario.matric],
      marker: { color: "#2563eb" },
    },
  ], {
    height: 360,
    barmode: "group",
    yaxis: { title: "Students" },
    margin: { l: 60, r: 20, t: 10, b: 70 },
  });
}

function renderGapDecompositionChart(target, baselineMatric, scenarioMatric) {
  const baselineGap = Math.max(0, target - baselineMatric);
  const operationalLift = Math.max(0, scenarioMatric - baselineMatric);
  const remainingGap = Math.max(0, target - scenarioMatric);

  plot("chart-gap-decomposition", [
    {
      type: "bar",
      x: ["Gap Breakdown"],
      y: [operationalLift],
      name: "Closed by operational levers",
      marker: { color: "#0f9d73" },
    },
    {
      type: "bar",
      x: ["Gap Breakdown"],
      y: [remainingGap],
      name: "Remaining market-driven or unmet gap",
      marker: { color: "#f97316" },
    },
  ], {
    height: 360,
    barmode: "stack",
    yaxis: { title: "Students" },
    annotations: [
      {
        x: "Gap Breakdown",
        y: baselineGap + Math.max(remainingGap, operationalLift) * 0.05,
        text: `Baseline gap: ${formatNumber(Math.round(baselineGap))}`,
        showarrow: false,
        yshift: 12,
        font: { size: 12, color: "#475569" },
      },
    ],
    margin: { l: 60, r: 20, t: 10, b: 50 },
  });
}

function getCounts(rows) {
  return {
    inquiries: rows.length,
    started: sum(rows.map((row) => row.app_started_flag)),
    completed: sum(rows.map((row) => row.app_completed_flag)),
    admit: sum(rows.map((row) => row.admit_flag)),
    deposit: sum(rows.map((row) => row.deposit_flag)),
    matric: sum(rows.map((row) => row.matriculated_flag)),
    melt: sum(rows.map((row) => row.melt_flag)),
  };
}

function getStageRates(counts) {
  return {
    startRate: div0(counts.started, counts.inquiries),
    completionRate: div0(counts.completed, counts.started),
    admitRate: div0(counts.admit, counts.completed),
    depositRate: div0(counts.deposit, counts.admit),
    matricRate: div0(counts.matric, counts.deposit),
  };
}

function getBenchmarkCounts() {
  const benchmarkRows = state.filteredHistoricalRows && state.filteredHistoricalRows.length
    ? state.filteredHistoricalRows
    : state.historicalRows;
  return getCounts(benchmarkRows);
}

function getSliceTarget(filteredInquiries) {
  const institutionTarget = Number(state.metadata.class_target || state.institution.class_target || 0);
  const totalInquiries = state.activeCounts?.inquiries || 1;
  return institutionTarget * (filteredInquiries / totalInquiries);
}

function getProgramTarget(program, filteredInquiryCount, totalProgramInquiryCount) {
  const programRow = state.programSummary.find((row) => row.academic_program === program);
  const overallTarget = Number(programRow?.target_matriculants || 0);
  if (!totalProgramInquiryCount) return overallTarget;
  return overallTarget * (filteredInquiryCount / totalProgramInquiryCount);
}

function getGrossTuition(rows) {
  return sum(rows.filter((row) => row.matriculated_flag === 1).map((row) => row.sticker_price));
}

function getAid(rows) {
  return sum(rows.filter((row) => row.matriculated_flag === 1).map((row) => row.total_institutional_aid));
}

function getNetRevenue(rows) {
  return getGrossTuition(rows) - getAid(rows);
}

function getMeltDrivers(row) {
  const drivers = [];
  if (row.late_deposit_flag === 1) drivers.push("Late deposit");
  if (row.orientation_rsvp_flag === 0) drivers.push("No orientation");
  if (row.housing_contract_flag === 0) drivers.push("No housing");
  if (row.price_sensitivity_score >= 64) drivers.push("High price sensitivity");
  if (row.engagement_score < 55) drivers.push("Low engagement");
  if (row.residency === "International") drivers.push("Intl friction");
  return drivers.length ? drivers : ["General watch"];
}

function renderTable(targetId, rows, renderer) {
  const tbody = document.getElementById(targetId);
  tbody.innerHTML = rows.length
    ? rows.map((row) => renderer(row)).join("")
    : `<tr><td colspan="6">No records in the current slice.</td></tr>`;
}

function groupBy(rows, key) {
  return rows.reduce((acc, row) => {
    const groupKey = row[key] || "Unknown";
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(row);
    return acc;
  }, {});
}

function matchesFilters(row, selections) {
  if (selections.studentType !== "All" && row.student_type !== selections.studentType) return false;
  if (selections.geography !== "All" && row.market_geography !== selections.geography) return false;
  if (selections.program !== "All" && row.academic_program !== selections.program) return false;
  if (selections.source !== "All" && row.source_channel !== selections.source) return false;
  return true;
}

function uniqueValues(rows, key) {
  return [...new Set(rows.map((row) => row[key]).filter(Boolean))].sort();
}

function lineTrace(x, y, name, color) {
  return {
    type: "scatter",
    mode: "lines+markers",
    name,
    x,
    y,
    line: { color, width: 3 },
    marker: { size: 8 },
    hovertemplate: `${name}: %{y:,.0f}<extra></extra>`,
  };
}

function plot(targetId, data, layout) {
  const base = {
    font: { family: "Fira Sans, sans-serif", size: 12, color: "#475569" },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    margin: { l: 60, r: 20, t: 10, b: 50 },
    showlegend: true,
    legend: { orientation: "h", y: 1.12 },
    xaxis: { gridcolor: "rgba(148, 163, 184, 0.12)" },
    yaxis: { gridcolor: "rgba(148, 163, 184, 0.12)" },
  };
  Plotly.newPlot(targetId, data, { ...base, ...layout }, { responsive: true, displayModeBar: false });
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function bandClass(value, thresholds) {
  if (value >= thresholds[1]) return "pill-high";
  if (value >= thresholds[0]) return "pill-medium";
  return "pill-low";
}

function signedPpText(value) {
  const number = Number(value);
  return `${number >= 0 ? "+" : ""}${number}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function sum(values) {
  return values.reduce((acc, value) => acc + Number(value || 0), 0);
}

function mean(values) {
  const valid = values.filter((value) => Number.isFinite(value));
  return valid.length ? sum(valid) / valid.length : 0;
}

function div0(num, den) {
  return den ? num / den : 0;
}

function formatNumber(value) {
  return Math.round(Number(value || 0)).toLocaleString();
}

function formatSignedNumber(value) {
  const rounded = Math.round(Number(value || 0));
  return `${rounded >= 0 ? "+" : ""}${rounded.toLocaleString()}`;
}

function formatCurrency(value) {
  const number = Number(value || 0);
  if (Math.abs(number) >= 1000000) return `$${(number / 1000000).toFixed(1)}M`;
  if (Math.abs(number) >= 1000) return `$${Math.round(number / 1000)}K`;
  return `$${Math.round(number).toLocaleString()}`;
}

function formatAwardChange(value) {
  const number = Number(value || 0);
  if (number > 0) return `Increase average award by ${formatCurrency(number)}`;
  if (number < 0) return `Lower average award by ${formatCurrency(Math.abs(number))}`;
  return "Current average award";
}

function formatPct(value) {
  return `${(Number(value || 0) * 100).toFixed(1)}%`;
}

function formatSignedPct(value) {
  const number = Number(value || 0) * 100;
  return `${number >= 0 ? "+" : ""}${number.toFixed(1)} pp`;
}
