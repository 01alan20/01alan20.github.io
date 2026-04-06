const state = {
  students: [],
  sections: [],
  metadata: null,
  filters: {
    program: "",
    classLevel: "",
    holdStatus: "",
    auditStatus: "",
  },
  focus: {
    queue: "",
    label: "",
    holdType: "",
    auditStatus: "",
    graduationStage: "",
  },
};

const PROGRAM_ORDER = [
  "Business Administration",
  "Business Analytics",
  "Elementary Education",
  "Secondary Education",
];

const CLASS_LEVEL_ORDER = ["Freshman", "Sophomore", "Junior", "Senior"];
const REGISTRATION_STATUS_ORDER = ["registered", "blocked", "not_registered"];
const AUDIT_STATUS_ORDER = ["on_track", "near_risk", "off_track"];
const GRADUATION_STAGE_ORDER = ["not_eligible", "eligible_not_applied", "applied_pending", "ready_to_award"];

const COLORS = {
  navy: "#17324d",
  navySoft: "#274b71",
  green: "#1d6e58",
  amber: "#b36d1e",
  brick: "#a3472b",
  plum: "#6d4c7d",
  slate: "#425467",
  text: "#132235",
  muted: "#556476",
};

const REGISTRATION_COLORS = {
  registered: COLORS.green,
  blocked: COLORS.brick,
  not_registered: COLORS.amber,
};

const AUDIT_COLORS = {
  on_track: COLORS.green,
  near_risk: COLORS.amber,
  off_track: COLORS.plum,
};

const SECTION_RISK_COLORS = {
  Bottleneck: COLORS.brick,
  "Under Viability": COLORS.slate,
  Stable: COLORS.navySoft,
};

const HOLD_COLORS = {
  Financial: COLORS.brick,
  Academic: COLORS.amber,
  Administrative: COLORS.navySoft,
};

const num = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const fmt = (value, digits = 0) =>
  Number.isFinite(value)
    ? Number(value).toLocaleString(undefined, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      })
    : "-";

const pct = (value, digits = 1) =>
  Number.isFinite(value) ? `${(value * 100).toFixed(digits)}%` : "-";

const titleCaseStatus = (value) =>
  String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const htmlEscape = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

function baseLayout() {
  return {
    font: { family: "Public Sans, sans-serif", size: 12, color: COLORS.muted },
    paper_bgcolor: "rgba(255,255,255,0)",
    plot_bgcolor: "rgba(255,255,255,0)",
    margin: { l: 60, r: 20, t: 28, b: 52 },
    legend: { orientation: "h", y: 1.12, x: 0 },
    hoverlabel: { font: { family: "Public Sans, sans-serif" } },
  };
}

function plot(divId, data, layout) {
  Plotly.react(divId, data, { ...baseLayout(), ...layout }, { responsive: true, displayModeBar: false });
}

function renderEmptyPlot(divId, message) {
  plot(divId, [], {
    annotations: [
      {
        text: message,
        x: 0.5,
        y: 0.5,
        xref: "paper",
        yref: "paper",
        showarrow: false,
        font: { size: 14, color: COLORS.muted },
      },
    ],
    xaxis: { visible: false },
    yaxis: { visible: false },
  });
}

function wirePlotClick(divId, handler) {
  const node = document.getElementById(divId);
  if (!node || typeof node.on !== "function") return;
  if (typeof node.removeAllListeners === "function") {
    node.removeAllListeners("plotly_click");
  }
  node.on("plotly_click", handler);
}

async function fetchCSV(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not fetch ${path}`);
  }
  const text = await response.text();
  return Papa.parse(text, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  }).data;
}

async function fetchJSON(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not fetch ${path}`);
  }
  return response.json();
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
}

function setHTML(id, value) {
  const node = document.getElementById(id);
  if (node) node.innerHTML = value;
}

function populateSelect(selectId, values, placeholder) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = [
    `<option value="">${placeholder}</option>`,
    ...values.map((value) => `<option value="${htmlEscape(value)}">${htmlEscape(value)}</option>`),
  ].join("");
}

function syncFiltersFromControls() {
  state.filters.program = document.getElementById("program-filter").value;
  state.filters.classLevel = document.getElementById("class-level-filter").value;
  state.filters.holdStatus = document.getElementById("hold-filter").value;
  state.filters.auditStatus = document.getElementById("audit-filter").value;
}

function setProgramFilter(value) {
  const select = document.getElementById("program-filter");
  if (!select) return;
  select.value = value;
  syncFiltersFromControls();
}

function setClassLevelFilter(value) {
  const select = document.getElementById("class-level-filter");
  if (!select) return;
  select.value = value;
  syncFiltersFromControls();
}

function clearFocus() {
  state.focus = {
    queue: "",
    label: "",
    holdType: "",
    auditStatus: "",
    graduationStage: "",
  };
}

function setFocus(nextFocus) {
  clearFocus();
  state.focus = { ...state.focus, ...nextFocus };
}

function getFilteredStudents() {
  return state.students.filter((row) => {
    const matchesProgram = !state.filters.program || row.program_name === state.filters.program;
    const matchesClass = !state.filters.classLevel || row.class_level === state.filters.classLevel;
    const matchesHold = !state.filters.holdStatus || row.hold_status === state.filters.holdStatus;
    const matchesAudit = !state.filters.auditStatus || row.audit_status === state.filters.auditStatus;
    return matchesProgram && matchesClass && matchesHold && matchesAudit;
  });
}

function getFilteredSections() {
  return state.sections.filter((row) => {
    const matchesProgram = !state.filters.program || row.program_name === state.filters.program;
    const matchesClass = !state.filters.classLevel || row.course_level_group === state.filters.classLevel;
    return matchesProgram && matchesClass;
  });
}

function sum(rows, key) {
  return rows.reduce((total, row) => total + num(row[key]), 0);
}

function groupCount(rows, key, order) {
  const map = new Map(order.map((item) => [item, 0]));
  rows.forEach((row) => {
    const value = row[key];
    if (!map.has(value)) {
      map.set(value, 0);
    }
    map.set(value, map.get(value) + 1);
  });
  return [...map.entries()].map(([label, count]) => ({ label, count }));
}

function getTopRequiredSections(sections, limit = 10) {
  return sections
    .filter((row) => row.requirement_type === "Required")
    .sort((a, b) => {
      if (num(b.waitlist_pressure) !== num(a.waitlist_pressure)) {
        return num(b.waitlist_pressure) - num(a.waitlist_pressure);
      }
      return num(b.waitlist_count) - num(a.waitlist_count);
    })
    .slice(0, limit);
}

function urgencyRank(value) {
  return { High: 0, Medium: 1, Low: 2 }[value] ?? 3;
}

function classRank(value) {
  return { Senior: 0, Junior: 1, Sophomore: 2, Freshman: 3 }[value] ?? 4;
}

function renderHero(students, sections) {
  const blocked = students.filter((row) => row.registration_status === "blocked");
  const offTrack = students.filter((row) => row.audit_status === "off_track");
  const eligibleNotApplied = students.filter((row) => row.graduation_stage === "eligible_not_applied");
  const programs = new Set(students.map((row) => row.program_name));

  setText("brief-term", state.metadata?.current_term || "Current term");
  setText(
    "brief-headline",
    `${fmt(blocked.length)} blocked, ${fmt(offTrack.length)} off track, ${fmt(eligibleNotApplied.length)} seniors awaiting graduation follow-up.`
  );
  setText(
    "brief-copy",
    `Current view covers ${fmt(students.length)} anonymized student records, ${fmt(sections.length)} sections, and ${fmt(programs.size)} modeled programs.`
  );
  setText("brief-students", fmt(students.length));
  setText("brief-blocked", fmt(blocked.length));
  setText("brief-offtrack", fmt(offTrack.length));
  setText("hero-source-note", state.metadata?.caveat || "");
  setText(
    "provenance-note",
    `Modeled rule set: ${(state.metadata?.policy_rules_modeled || []).slice(0, 3).join(" • ")}`
  );
}

function renderExecutiveSnapshot(students, sections) {
  const totalStudents = Math.max(students.length, 1);
  const registered = students.filter((row) => row.registration_status === "registered");
  const blocked = students.filter((row) => row.registration_status === "blocked");
  const activeHolds = students.filter((row) => row.active_hold_flag === 1);
  const offTrack = students.filter((row) => row.audit_status === "off_track");
  const eligibleNotApplied = students.filter((row) => row.graduation_stage === "eligible_not_applied");
  const requiredSections = sections.filter((row) => row.requirement_type === "Required");
  const totalCapacity = Math.max(sum(requiredSections, "capacity"), 1);
  const waitlistPressure = sum(requiredSections, "waitlist_count") / totalCapacity;
  const continuingUnregistered = students.filter(
    (row) => row.continuing_student_flag === 1 && row.registration_status === "not_registered"
  ).length;

  setText("kpi-registration-rate", pct(registered.length / totalStudents));
  setText("kpi-registration-foot", `${fmt(continuingUnregistered)} continuing students remain unregistered without a blocking hold.`);
  setText("kpi-blocked", fmt(blocked.length));
  setText("kpi-blocked-foot", `${fmt(blocked.filter((row) => row.hold_type === "Financial").length)} financial holds are currently stopping registration.`);
  setText("kpi-hold-rate", pct(activeHolds.length / totalStudents));
  setText("kpi-hold-foot", `${fmt(activeHolds.length)} students carry an active hold in the current view.`);
  setText("kpi-waitlist-pressure", pct(waitlistPressure));
  setText("kpi-waitlist-foot", `${fmt(requiredSections.filter((row) => row.section_risk === "Bottleneck").length)} required sections are flagged as bottlenecks.`);
  setText("kpi-off-track", pct(offTrack.length / totalStudents));
  setText("kpi-off-track-foot", `${fmt(offTrack.length)} students are currently flagged off track by pace or policy rules.`);
  setText("kpi-eligible-not-applied", fmt(eligibleNotApplied.length));
  setText("kpi-eligible-foot", `${fmt(eligibleNotApplied.length)} final-year students appear academically eligible but have not applied.`);
}

function renderRegistrationSection(students) {
  const blocked = students.filter((row) => row.registration_status === "blocked");
  const visiblePrograms = state.filters.program ? [state.filters.program] : PROGRAM_ORDER;
  const blockers = groupCount(blocked, "hold_type", ["Financial", "Academic", "Administrative"]).filter(
    (row) => row.label !== "None"
  );

  if (!blocked.length) {
    renderEmptyPlot("chart-hold-blockers", "No blocked students match the current filters.");
  } else {
    plot(
      "chart-hold-blockers",
      [
        {
          type: "bar",
          orientation: "h",
          y: blockers.map((row) => row.label),
          x: blockers.map((row) => row.count),
          marker: {
            color: blockers.map((row) => HOLD_COLORS[row.label] || COLORS.slate),
            line: { color: "rgba(19,34,53,0.16)", width: 1 },
          },
          hovertemplate: "%{y}<br>%{x} blocked students<extra></extra>",
        },
      ],
      {
        margin: { l: 120, r: 20, t: 28, b: 44 },
        xaxis: { title: "Blocked students", gridcolor: "rgba(19,34,53,0.08)" },
        yaxis: { automargin: true },
      }
    );
    wirePlotClick("chart-hold-blockers", (event) => {
      const holdType = event.points?.[0]?.y;
      if (!holdType) return;
      setFocus({
        queue: "hold",
        holdType,
        label: `${holdType} hold blockers`,
      });
      renderAll();
    });
  }

  const statuses = REGISTRATION_STATUS_ORDER.map((status) => ({
    status,
    values: visiblePrograms.map(
      (program) => students.filter((row) => row.program_name === program && row.registration_status === status).length
    ),
  }));

  plot(
    "chart-registration-status",
    statuses.map((status) => ({
      type: "bar",
      name: titleCaseStatus(status.status),
      x: visiblePrograms,
      y: status.values,
      marker: { color: REGISTRATION_COLORS[status.status] },
      hovertemplate: "%{x}<br>%{y} students<extra></extra>",
    })),
    {
      barmode: "stack",
      yaxis: { title: "Students", gridcolor: "rgba(19,34,53,0.08)" },
      xaxis: { automargin: true },
    }
  );

  wirePlotClick("chart-registration-status", (event) => {
    const point = event.points?.[0];
    if (!point?.x) return;
    setProgramFilter(point.x);
    if (String(point.data?.name).toLowerCase() === "blocked") {
      setFocus({
        queue: "hold",
        label: `Blocked students in ${point.x}`,
      });
    } else {
      clearFocus();
    }
    renderAll();
  });

  const continuingUnregistered = students.filter(
    (row) => row.continuing_student_flag === 1 && row.registration_status === "not_registered"
  ).length;
  const financialBlocked = blocked.filter((row) => row.hold_type === "Financial").length;
  setText(
    "registration-explainer",
    `${fmt(financialBlocked)} students are blocked by financial holds, and ${fmt(continuingUnregistered)} continuing students remain unregistered without an active hold.`
  );
}

function renderCourseDemandSection(sections) {
  const requiredSections = getTopRequiredSections(sections, 10);
  if (!requiredSections.length) {
    renderEmptyPlot("chart-waitlist-pressure", "No required sections match the current filters.");
    renderEmptyPlot("chart-seat-risk", "No sections match the current filters.");
    setHTML("table-courses", `<tr><td colspan="7" class="muted-copy">No required sections match the current filters.</td></tr>`);
    setText("courses-count-badge", "0 rows");
    setText("course-explainer", "No sections match the current filters.");
    return;
  }

  plot(
    "chart-waitlist-pressure",
    [
      {
        type: "bar",
        orientation: "h",
        y: [...requiredSections].reverse().map((row) => `${row.course_code} · ${row.program_name}`),
        x: [...requiredSections].reverse().map((row) => num(row.waitlist_pressure) * 100),
        marker: {
          color: [...requiredSections].reverse().map((row) => SECTION_RISK_COLORS[row.section_risk] || COLORS.slate),
        },
        hovertemplate:
          "%{y}<br>Waitlist pressure: %{x:.1f}%<br>Waitlist count: %{customdata}<extra></extra>",
        customdata: [...requiredSections].reverse().map((row) => num(row.waitlist_count)),
      },
    ],
    {
      margin: { l: 170, r: 20, t: 28, b: 44 },
      xaxis: { title: "Waitlist pressure", ticksuffix: "%", gridcolor: "rgba(19,34,53,0.08)" },
      yaxis: { automargin: true },
    }
  );

  wirePlotClick("chart-waitlist-pressure", (event) => {
    const label = String(event.points?.[0]?.y || "");
    const program = label.split("·").slice(1).join("·").trim();
    if (!program) return;
    setProgramFilter(program);
    clearFocus();
    renderAll();
  });

  const courseMap = new Map();
  sections.forEach((row) => {
    const key = `${row.program_name}|||${row.course_code}|||${row.course_title}`;
    if (!courseMap.has(key)) {
      courseMap.set(key, {
        label: `${row.course_code} · ${row.program_name}`,
        program: row.program_name,
        courseTitle: row.course_title,
        capacity: 0,
        enrolled: 0,
        waitlist: 0,
      });
    }
    const item = courseMap.get(key);
    item.capacity += num(row.capacity);
    item.enrolled += num(row.enrolled);
    item.waitlist += num(row.waitlist_count);
  });

  const courseRows = [...courseMap.values()]
    .map((row) => {
      const capacity = Math.max(row.capacity, 1);
      const fillPct = (row.enrolled / capacity) * 100;
      const pressurePct = (row.waitlist / capacity) * 100;
      return {
        ...row,
        fillPct,
        pressurePct,
        totalDemandPct: fillPct + pressurePct,
      };
    })
    .sort((a, b) => b.totalDemandPct - a.totalDemandPct);

  const maxDemandPct = Math.max(...courseRows.map((row) => row.totalDemandPct), 110);
  const chartHeight = Math.max(360, 26 * courseRows.length + 120);

  plot(
    "chart-seat-risk",
    [
      {
        type: "bar",
        orientation: "h",
        name: "Filled Capacity",
        y: [...courseRows].reverse().map((row) => row.label),
        x: [...courseRows].reverse().map((row) => row.fillPct),
        customdata: [...courseRows].reverse().map((row) => row.program),
        marker: { color: COLORS.navySoft },
        hovertemplate:
          "%{y}<br>Filled capacity: %{x:.1f}%<extra></extra>",
      },
      {
        type: "bar",
        orientation: "h",
        name: "Pressure Above Capacity",
        y: [...courseRows].reverse().map((row) => row.label),
        x: [...courseRows].reverse().map((row) => row.pressurePct),
        base: [...courseRows].reverse().map(() => 100),
        customdata: [...courseRows].reverse().map((row) => row.program),
        marker: { color: COLORS.brick },
        hovertemplate:
          "%{y}<br>Pressure above 100%: %{x:.1f}%<extra></extra>",
      },
    ],
    {
      barmode: "overlay",
      height: chartHeight,
      margin: { l: 190, r: 24, t: 30, b: 52 },
      xaxis: {
        title: "Course demand as % of capacity",
        ticksuffix: "%",
        range: [0, Math.ceil(maxDemandPct / 10) * 10 + 5],
        gridcolor: "rgba(19,34,53,0.08)",
      },
      yaxis: { automargin: true },
      shapes: [
        {
          type: "line",
          x0: 100,
          x1: 100,
          y0: 0,
          y1: 1,
          xref: "x",
          yref: "paper",
          line: { color: "rgba(163,71,43,0.38)", dash: "dot", width: 1.6 },
        },
      ],
      annotations: [
        {
          x: 100,
          y: 1.04,
          xref: "x",
          yref: "paper",
          showarrow: false,
          text: "100% capacity",
          font: { size: 11, color: COLORS.muted },
        },
      ],
    }
  );

  wirePlotClick("chart-seat-risk", (event) => {
    const program = event.points?.[0]?.customdata;
    if (!program) return;
    setProgramFilter(program);
    clearFocus();
    renderAll();
  });

  setText("courses-count-badge", `${fmt(requiredSections.length)} rows`);
  setHTML(
    "table-courses",
    requiredSections
      .map(
        (row) => `
          <tr>
            <td>
              <div class="mono">${htmlEscape(row.course_code)}</div>
              <div class="muted-copy">${htmlEscape(row.course_title)}</div>
            </td>
            <td>${htmlEscape(row.program_name)}</td>
            <td>${fmt(num(row.capacity))}</td>
            <td>${fmt(num(row.enrolled))}</td>
            <td>${fmt(num(row.waitlist_count))}</td>
            <td>${pct(num(row.waitlist_pressure))}</td>
            <td>${htmlEscape(row.section_risk)}</td>
          </tr>
        `
      )
      .join("")
  );

  const bottleneckCount = sections.filter((row) => row.section_risk === "Bottleneck").length;
  const topSection = requiredSections[0];
  setText(
    "course-explainer",
    `${fmt(bottleneckCount)} sections are currently flagged as bottlenecks. ${topSection.course_code} in ${topSection.program_name} has the highest required-course waitlist pressure in the current view.`
  );
}

function renderAuditSection(students) {
  if (!students.length) {
    renderEmptyPlot("chart-audit-program", "No students match the current filters.");
    renderEmptyPlot("chart-audit-class", "No students match the current filters.");
    renderEmptyPlot("chart-graduation-funnel", "No senior students match the current filters.");
    setText("audit-explainer", "No students match the current filters.");
    return;
  }

  const visiblePrograms = state.filters.program ? [state.filters.program] : PROGRAM_ORDER;

  plot(
    "chart-audit-program",
    AUDIT_STATUS_ORDER.map((status) => ({
      type: "bar",
      name: titleCaseStatus(status),
      x: visiblePrograms,
      y: visiblePrograms.map(
        (program) => students.filter((row) => row.program_name === program && row.audit_status === status).length
      ),
      marker: { color: AUDIT_COLORS[status] },
      hovertemplate: "%{x}<br>%{y} students<extra></extra>",
    })),
    {
      barmode: "stack",
      yaxis: { title: "Students", gridcolor: "rgba(19,34,53,0.08)" },
      xaxis: { automargin: true },
    }
  );

  wirePlotClick("chart-audit-program", (event) => {
    const point = event.points?.[0];
    if (!point?.x || !point?.data?.name) return;
    setProgramFilter(point.x);
    setFocus({
      queue: "audit",
      auditStatus: String(point.data.name).toLowerCase().replaceAll(" ", "_"),
      label: `${point.data.name} students in ${point.x}`,
    });
    renderAll();
  });

  plot(
    "chart-audit-class",
    AUDIT_STATUS_ORDER.map((status) => ({
      type: "bar",
      name: titleCaseStatus(status),
      x: CLASS_LEVEL_ORDER,
      y: CLASS_LEVEL_ORDER.map(
        (level) => students.filter((row) => row.class_level === level && row.audit_status === status).length
      ),
      marker: { color: AUDIT_COLORS[status] },
      hovertemplate: "%{x}<br>%{y} students<extra></extra>",
    })),
    {
      barmode: "stack",
      yaxis: { title: "Students", gridcolor: "rgba(19,34,53,0.08)" },
      xaxis: { automargin: true },
    }
  );

  wirePlotClick("chart-audit-class", (event) => {
    const point = event.points?.[0];
    if (!point?.x || !point?.data?.name) return;
    setClassLevelFilter(point.x);
    setFocus({
      queue: "audit",
      auditStatus: String(point.data.name).toLowerCase().replaceAll(" ", "_"),
      label: `${point.data.name} students in ${point.x}`,
    });
    renderAll();
  });

  const seniorStudents = students.filter((row) => row.class_level === "Senior");
  if (!seniorStudents.length) {
    renderEmptyPlot("chart-graduation-funnel", "No senior students match the current filters.");
  } else {
    const stageCounts = GRADUATION_STAGE_ORDER.map((stage) => ({
      stage,
      count: seniorStudents.filter((row) => row.graduation_stage === stage).length,
    })).filter((row) => row.count > 0);

    plot(
      "chart-graduation-funnel",
      [
        {
          type: "funnel",
          y: stageCounts.map((row) => titleCaseStatus(row.stage)),
          x: stageCounts.map((row) => row.count),
          textposition: "inside",
          textinfo: "value+percent initial",
          marker: {
            color: [COLORS.slate, COLORS.brick, COLORS.amber, COLORS.green],
          },
          hovertemplate: "%{label}<br>%{value} students<extra></extra>",
        },
      ],
      {
        margin: { l: 130, r: 20, t: 18, b: 28 },
      }
    );

    wirePlotClick("chart-graduation-funnel", (event) => {
      const label = String(event.points?.[0]?.y || "").toLowerCase().replaceAll(" ", "_");
      if (!label) return;
      if (label === "eligible_not_applied") {
        setClassLevelFilter("Senior");
        setFocus({
          queue: "graduation",
          graduationStage: "eligible_not_applied",
          label: "Eligible seniors without a graduation application",
        });
      } else if (label === "not_eligible") {
        setClassLevelFilter("Senior");
        setFocus({
          queue: "audit",
          auditStatus: "off_track",
          label: "Senior students who are not yet eligible",
        });
      }
      renderAll();
    });
  }

  const topReason = groupCount(students, "audit_reason", [])
    .sort((a, b) => b.count - a.count)
    .find((row) => row.label !== "Pace and policy checks satisfied");
  const eligibleNotApplied = seniorStudents.filter((row) => row.graduation_stage === "eligible_not_applied").length;
  setText(
    "audit-explainer",
    `${fmt(students.filter((row) => row.audit_status === "off_track").length)} students are off track. The most common risk driver in the current view is ${topReason ? topReason.label.toLowerCase() : "audit policy review"}, and ${fmt(eligibleNotApplied)} seniors still need graduation application follow-up.`
  );
}

function renderQueueCardFocus() {
  ["hold", "audit", "graduation"].forEach((queue) => {
    const node = document.getElementById(`queue-card-${queue}`);
    if (!node) return;
    node.classList.toggle("focused", state.focus.queue === queue);
  });

  if (!state.focus.queue) {
    setText(
      "action-focus-note",
      "Queues are sorted by urgency and current filters. Click a relevant KPI or chart to focus one queue."
    );
    return;
  }
  setText("action-focus-note", `Focused queue: ${state.focus.label}.`);
}

function renderTableRows(tableId, rows, emptyMessage, buildRow, colspan) {
  if (!rows.length) {
    setHTML(tableId, `<tr><td colspan="${colspan}" class="muted-copy">${htmlEscape(emptyMessage)}</td></tr>`);
    return;
  }
  setHTML(tableId, rows.map(buildRow).join(""));
}

function renderActionQueues(students) {
  renderQueueCardFocus();

  let holdRows = students.filter((row) => row.queue_name === "Hold Resolution");
  if (state.focus.queue === "hold" && state.focus.holdType) {
    holdRows = holdRows.filter((row) => row.hold_type === state.focus.holdType);
  }
  holdRows = holdRows.sort((a, b) => {
    if (urgencyRank(a.urgency) !== urgencyRank(b.urgency)) return urgencyRank(a.urgency) - urgencyRank(b.urgency);
    if (classRank(a.class_level) !== classRank(b.class_level)) return classRank(a.class_level) - classRank(b.class_level);
    return String(a.hold_type).localeCompare(String(b.hold_type));
  });

  let auditRows = students.filter((row) => ["Degree Audit Intervention", "Watchlist"].includes(row.queue_name));
  if (state.focus.queue === "audit" && state.focus.auditStatus) {
    auditRows = auditRows.filter((row) => row.audit_status === state.focus.auditStatus);
  }
  auditRows = auditRows.sort((a, b) => {
    if (urgencyRank(a.urgency) !== urgencyRank(b.urgency)) return urgencyRank(a.urgency) - urgencyRank(b.urgency);
    if (classRank(a.class_level) !== classRank(b.class_level)) return classRank(a.class_level) - classRank(b.class_level);
    return String(a.audit_reason).localeCompare(String(b.audit_reason));
  });

  let graduationRows = students.filter((row) => row.graduation_stage === "eligible_not_applied");
  if (state.focus.queue === "graduation" && state.focus.graduationStage) {
    graduationRows = graduationRows.filter((row) => row.graduation_stage === state.focus.graduationStage);
  }
  graduationRows = graduationRows.sort((a, b) => {
    if (classRank(a.class_level) !== classRank(b.class_level)) return classRank(a.class_level) - classRank(b.class_level);
    return num(a.credits_completed) - num(b.credits_completed);
  });

  setText("holds-count-badge", `${fmt(holdRows.length)} students`);
  setText("audit-count-badge", `${fmt(auditRows.length)} students`);
  setText("graduation-count-badge", `${fmt(graduationRows.length)} students`);

  renderTableRows(
    "table-holds",
    holdRows.slice(0, 12),
    "No blocked students match the current filter and focus state.",
    (row) => `
      <tr>
        <td>
          <div class="mono">${htmlEscape(row.student_id)}</div>
          <span class="pill ${String(row.urgency).toLowerCase()}">${htmlEscape(row.urgency)}</span>
        </td>
        <td>${htmlEscape(row.program_name)}</td>
        <td>${htmlEscape(row.class_level)}</td>
        <td>${htmlEscape(row.hold_type)}</td>
        <td>${htmlEscape(row.issue_summary)}</td>
        <td>${htmlEscape(row.recommended_action)}</td>
      </tr>
    `,
    6
  );

  renderTableRows(
    "table-audit",
    auditRows.slice(0, 12),
    "No audit-intervention students match the current filter and focus state.",
    (row) => `
      <tr>
        <td>
          <div class="mono">${htmlEscape(row.student_id)}</div>
          <span class="pill ${String(row.urgency).toLowerCase()}">${htmlEscape(row.urgency)}</span>
        </td>
        <td>${htmlEscape(row.program_name)}</td>
        <td>${htmlEscape(row.class_level)}</td>
        <td>${titleCaseStatus(row.audit_status)}</td>
        <td>${htmlEscape(row.audit_reason)}</td>
        <td>${htmlEscape(row.recommended_action)}</td>
      </tr>
    `,
    6
  );

  renderTableRows(
    "table-graduation",
    graduationRows.slice(0, 12),
    "No graduation follow-up students match the current filter and focus state.",
    (row) => `
      <tr>
        <td>
          <div class="mono">${htmlEscape(row.student_id)}</div>
          <span class="pill high">High</span>
        </td>
        <td>${htmlEscape(row.program_name)}</td>
        <td>${htmlEscape(row.class_level)}</td>
        <td>${fmt(num(row.credits_completed))}</td>
        <td>${num(row.osu_gpa).toFixed(2)}</td>
        <td>${htmlEscape(row.recommended_action)}</td>
      </tr>
    `,
    6
  );
}

function renderMethodology() {
  const sources = (state.metadata?.official_source_basis || [])
    .map((source) => `<li><a href="${htmlEscape(source.url)}" target="_blank" rel="noopener">${htmlEscape(source.label)}</a></li>`)
    .join("");
  const rules = (state.metadata?.policy_rules_modeled || [])
    .map((rule) => `<li>${htmlEscape(rule)}</li>`)
    .join("");
  const modeled = (state.metadata?.local_modeled_layer || [])
    .map((item) => `<li>${htmlEscape(item)}</li>`)
    .join("");

  setHTML("source-list", sources);
  setHTML("rule-list", rules);
  setHTML("model-list", modeled);
  setText("method-caveat", state.metadata?.caveat || "");
}

function renderAll() {
  const students = getFilteredStudents();
  const sections = getFilteredSections();

  renderHero(students, sections);
  renderExecutiveSnapshot(students, sections);
  renderRegistrationSection(students);
  renderCourseDemandSection(sections);
  renderAuditSection(students);
  renderActionQueues(students);
  renderMethodology();
}

function wireControls() {
  ["program-filter", "class-level-filter", "hold-filter", "audit-filter"].forEach((id) => {
    const node = document.getElementById(id);
    if (!node) return;
    node.addEventListener("change", () => {
      syncFiltersFromControls();
      clearFocus();
      renderAll();
    });
  });

  document.getElementById("reset-filters-btn")?.addEventListener("click", () => {
    ["program-filter", "class-level-filter", "hold-filter", "audit-filter"].forEach((id) => {
      const node = document.getElementById(id);
      if (node) node.value = "";
    });
    syncFiltersFromControls();
    clearFocus();
    renderAll();
  });

  document.getElementById("clear-focus-btn")?.addEventListener("click", () => {
    clearFocus();
    renderAll();
  });

  document.querySelectorAll(".kpi-card").forEach((node) => {
    node.addEventListener("click", () => {
      const queue = node.getAttribute("data-focus-queue");
      const value = node.getAttribute("data-focus-value");
      if (queue === "hold") {
        setFocus({ queue: "hold", label: "Blocked students with unresolved holds" });
      } else if (queue === "audit") {
        setFocus({
          queue: "audit",
          auditStatus: value || "off_track",
          label: "Students needing degree-audit intervention",
        });
      } else if (queue === "graduation") {
        setClassLevelFilter("Senior");
        setFocus({
          queue: "graduation",
          graduationStage: value || "eligible_not_applied",
          label: "Eligible seniors without a graduation application",
        });
      } else if (queue === "course") {
        document.getElementById("seat-pressure")?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      renderAll();
    });
  });
}

async function init() {
  try {
    const [students, sections, metadata] = await Promise.all([
      fetchCSV("data/student_status.csv"),
      fetchCSV("data/section_status.csv"),
      fetchJSON("data/metadata.json"),
    ]);

    state.students = students;
    state.sections = sections;
    state.metadata = metadata;

    populateSelect("program-filter", PROGRAM_ORDER, "All programs");
    populateSelect("class-level-filter", CLASS_LEVEL_ORDER, "All class levels");
    populateSelect("hold-filter", ["Active Hold", "No Hold"], "All hold states");
    populateSelect("audit-filter", AUDIT_STATUS_ORDER, "All audit states");

    const auditSelect = document.getElementById("audit-filter");
    if (auditSelect) {
      auditSelect.innerHTML = [
        `<option value="">All audit states</option>`,
        ...AUDIT_STATUS_ORDER.map((status) => `<option value="${status}">${titleCaseStatus(status)}</option>`),
      ].join("");
    }

    wireControls();
    syncFiltersFromControls();
    renderAll();
  } catch (error) {
    console.error(error);
    setText("brief-headline", "The dashboard could not load its data files.");
    setText("brief-copy", "Check the browser console and make sure the CSV and JSON exports are present.");
  }
}

document.addEventListener("DOMContentLoaded", init);
