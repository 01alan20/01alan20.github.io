"use strict";
(() => {
  const story = window.BRAZIL_STORY,
    depth = story?.depth;
  if (!depth) return;
  const el = (tag, text, attrs = {}) => {
    const n = document.createElement(tag);
    if (text !== undefined) n.textContent = text;
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    return n;
  };
  const percent = (x) =>
    Number.isFinite(x) ? x.toFixed(1) + "%" : "Undefined";
  const number = (x) => new Intl.NumberFormat("en-US").format(x);
  const time = depth.time,
    final = time.at(-1),
    first = time[1];
  const section = (id, markup, before) => {
    const n = el("section", undefined, { id, class: "wrap depth-section" });
    n.innerHTML = markup;
    document.querySelector(before).before(n);
    return n;
  };
  const questions = section(
    "reader-questions",
    '<h2>Common questions</h2><p class="depth-intro">Answers to six common questions about business survival in Brazil.</p><div id="question-list" class="question-list"></div>',
    ".question",
  );
  const sectors = story.ibge.sectors
    .filter((s) => s.births > 0)
    .slice()
    .sort((a, b) => b.five_year_survival_pct - a.five_year_survival_pct);
  const labels = {
    A: "Agriculture, forestry & fishing",
    B: "Mining & quarrying",
    C: "Manufacturing",
    D: "Electricity & gas",
    E: "Water, waste & remediation",
    F: "Construction",
    G: "Trade & vehicle repair",
    H: "Transport & storage",
    I: "Accommodation & food",
    J: "Information & communication",
    K: "Finance & insurance",
    L: "Real estate",
    M: "Professional, scientific & technical",
    N: "Administrative & support services",
    O: "Public administration",
    P: "Education",
    Q: "Health & social work",
    R: "Arts, entertainment & recreation",
    S: "Other services",
  };
  const publicQuestions = [
    [
      "Out of 100 entrants, how many remain after one, three and five years?",
      `${percent(time[1].survival_pct)}, ${percent(time[3].survival_pct)} and ${percent(final.survival_pct)}, respectively, in the 2017 employer-enterprise cohort. Entry can mean becoming or returning as an employer; these are not necessarily newly registered businesses.`,
      "#five-years",
    ],
    [
      "When is the biggest drop-off?",
      `The first year: ${percent(first.annual_attrition_pct)} of the starting cohort departed. Later annual attrition uses the remaining cohort as its denominator. Departure from this survival cohort does not necessarily mean legal closure.`,
      "#time-and-survival",
    ],
    [
      "Does reaching year one change the outlook for reaching year five?",
      `Among those who reached year one, ${percent(first.conditional_to_horizon_pct)} reached year five. At entry, the five-year proportion was ${percent(final.survival_pct)}. This conditions on an observed milestone; it does not show that ageing itself causes better outcomes.`,
      "#time-and-survival",
    ],
    [
      "Which industries have higher and lower observed survival?",
      `Published enterprise rates range from ${percent(sectors.at(-1).five_year_survival_pct)} to ${percent(sectors[0].five_year_survival_pct)} among positive-birth sections. Original cohort sizes vary greatly. Compare rates alongside their denominators, especially small industries.`,
      "#industry-states",
    ],
    [
      "How does my state compare with Brazil?",
      `Use the state map for overall local-unit survival, then compare states within the same industry. State comparisons use employer local units, including branches, rather than the enterprise population above.`,
      "#geography",
    ],
    [
      "Does an active registration mean the business is actually operating?",
      `No. Active is an administrative CNPJ status. It does not establish revenue, employment or uninterrupted operation. The register's current active share is not a five-year survival probability.`,
      "#methods",
    ],
  ];
  publicQuestions.forEach(([q, a, href], i) => {
    const d = el("details");
    d.append(el("summary", q), el("p", a));
    const link = el("a", "View details", { href });
    d.append(link);
    if (i === 0) d.open = true;
    questions.querySelector("#question-list").append(d);
  });
  const timeSection = section(
    "time-and-survival",
    `<div class="section-heading"><h2>Annual attrition and conditional survival</h2><p>Two ways to follow the same 2017 employer-enterprise cohort through 2022. Annual attrition conditions on the preceding surviving cohort. Conditional survival asks who reaches the fixed five-year milestone.</p></div><div class="time-grid"><figure><h3>Annual attrition</h3><p class="fine">Percentage departing from the surviving cohort since the preceding observation.</p><div id="annual-losses"></div><figcaption>Employer-cohort attrition, not a legal closure rate.</figcaption></figure><figure><h3>Survival after reaching an earlier year</h3><label for="conditional-age">Condition on reaching</label><select id="conditional-age"></select><div class="conditional-answer"><strong id="conditional-value"></strong><p id="conditional-sentence" aria-live="polite"></p></div><div class="conditional-track" aria-hidden="true"><i id="conditional-fill"></i></div><p class="fine">The target stays year five, rather than five additional years. Reaching year five itself would give 100% by definition.</p></figure></div><details class="workings"><summary>Show the formulas and all annual values</summary><p>Let S(t) be the percentage of the original cohort surviving to t. Annual attrition = 100 × [1 − S(t)/S(t−1)]. Conditional survival to year five = 100 × S(5)/S(t). Original-cohort loss = S(t−1) − S(t) percentage points. These derived rates inherit source rounding; no event counts or confidence intervals are reconstructed.</p><div class="table-scroll"><table><caption>2017 employer enterprises, followed through 2022</caption><thead><tr><th>Age</th><th>Surviving</th><th>Annual attrition</th><th>Original-cohort loss (pp)</th><th>Reach year 5, given age</th></tr></thead><tbody id="time-values"></tbody></table></div></details>`,
    ".factors",
  );
  time.slice(1).forEach((row) => {
    const n = el("div", undefined, { class: "annual-row" });
    n.append(el("span", `Year ${row.age}`));
    const track = el("span", undefined, { class: "annual-track" }),
      bar = el("i");
    bar.style.width = row.annual_attrition_pct + "%";
    track.append(bar);
    n.append(track, el("strong", percent(row.annual_attrition_pct)));
    timeSection.querySelector("#annual-losses").append(n);
  });
  const select = timeSection.querySelector("#conditional-age");
  time
    .slice(0, -1)
    .forEach((r) =>
      select.append(
        el(
          "option",
          r.age === 0 ? "Entry · 2017" : `Year ${r.age} · ${r.year}`,
          { value: r.age },
        ),
      ),
    );
  select.value = "1";
  const updateConditional = () => {
    const row = time[Number(select.value)];
    document.getElementById("conditional-value").textContent = percent(
      row.conditional_to_horizon_pct,
    );
    document.getElementById("conditional-sentence").textContent =
      `of those in the surviving cohort ${row.age === 0 ? "at entry" : `at year ${row.age}`} reached year five (2022). Historical conditional outcome, not an individual forecast.`;
    document.getElementById("conditional-fill").style.width =
      row.conditional_to_horizon_pct + "%";
  };
  select.addEventListener("change", updateConditional);
  updateConditional();
  time.forEach((r) => {
    const tr = el("tr");
    [
      r.age,
      percent(r.survival_pct),
      r.age ? percent(r.annual_attrition_pct) : "Not applicable",
      r.age ? r.original_cohort_loss_pp.toFixed(1) : "Not applicable",
      percent(r.conditional_to_horizon_pct),
    ].forEach((v) => tr.append(el("td", String(v))));
    document.getElementById("time-values").append(tr);
  });
  const industry = section(
    "industry-states",
    `<div class="section-heading"><h2>State comparisons within an industry</h2><p>Compare the 2017 employer-local-unit cohort within a CNAE section. These are descriptive historical rates. The same sector does not mean the same employment size, business model or local conditions.</p></div><div class="industry-controls"><div><label for="industry-select">Industry section</label><select id="industry-select"></select></div><div><label for="industry-min">Minimum state cohort</label><select id="industry-min"><option value="1">All positive cohorts</option><option value="10">At least 10 entrants</option><option value="30" selected>At least 30 entrants</option><option value="100">At least 100 entrants</option></select></div></div><p id="industry-summary" aria-live="polite" class="industry-summary"></p><p class="fine">National benchmark includes the full industry cohort. The filter changes displayed states, not that benchmark. With no entrants a rate is undefined; small positive cohorts can have unstable percentages.</p><div class="table-scroll"><table><caption id="industry-caption"></caption><thead><tr><th>State</th><th>Original entrants</th><th>Five-year survival</th><th>Gap to national industry (pp)</th></tr></thead><tbody id="industry-rows"></tbody></table></div>`,
    ".cohort-register",
  );
  const industrySelect = document.getElementById("industry-select");
  depth.within_industry.forEach((s) =>
    industrySelect.append(
      el("option", `${s.section} · ${labels[s.section] || s.label}`, {
        value: s.section,
      }),
    ),
  );
  industrySelect.value = "G";
  let sortKey = "five_year_survival_pct",
    sortDirection = -1;
  const sortColumns = [
    ["name", "State"],
    ["births", "Entrants"],
    ["five_year_survival_pct", "5-year survival"],
    ["gap", "Gap (pp)"],
  ];
  industry.querySelectorAll("thead th").forEach((header, index) => {
    const [key, label] = sortColumns[index];
    const button = el("button", label, { type: "button", "data-sort": key });
    header.replaceChildren(button);
    button.addEventListener("click", () => {
      sortDirection =
        sortKey === key ? -sortDirection : key === "name" ? 1 : -1;
      sortKey = key;
      updateIndustry();
    });
  });
  function updateIndustry() {
    const s = depth.within_industry.find(
        (s) => s.section === industrySelect.value,
      ),
      threshold = Number(document.getElementById("industry-min").value),
      rows = s.states
        .filter(
          (r) =>
            r.births >= threshold && Number.isFinite(r.five_year_survival_pct),
        )
        .sort((a, b) => {
          const compare =
            sortKey === "name"
              ? a.name.localeCompare(b.name, "en", { sensitivity: "base" })
              : sortKey === "gap"
                ? a.five_year_survival_pct - b.five_year_survival_pct
                : a[sortKey] - b[sortKey];
          return sortDirection * compare || a.name.localeCompare(b.name, "en");
        }),
      body = document.getElementById("industry-rows");
    body.replaceChildren();
    industry.querySelectorAll("thead th").forEach((header, index) => {
      const [key, label] = sortColumns[index];
      const active = sortKey === key;
      header.setAttribute(
        "aria-sort",
        active ? (sortDirection === 1 ? "ascending" : "descending") : "none",
      );
      const button = header.querySelector("button");
      button.textContent =
        label + (active ? (sortDirection === 1 ? " ↑" : " ↓") : " ↕");
      const nextDirection = active ? -sortDirection : key === "name" ? 1 : -1;
      button.setAttribute(
        "aria-label",
        `Sort by ${label}, ${nextDirection === 1 ? "ascending" : "descending"}`,
      );
    });
    const retained = rows.reduce((n, r) => n + r.births, 0);
    document.getElementById("industry-summary").textContent =
      `National industry survival: ${percent(s.national_five_year_pct)} · ${number(s.national_births)} original entrants. Showing ${rows.length} of 27 jurisdictions, covering ${percent((100 * retained) / s.national_births)} of industry entrants. ${27 - rows.length} state cells excluded by the minimum or zero births.`;
    document.getElementById("industry-caption").textContent =
      `${labels[s.section] || s.label} · 2017–2022 employer local units`;
    rows.forEach((r) => {
      const tr = el("tr");
      const gap = r.five_year_survival_pct - s.national_five_year_pct;
      [
        `${r.name} (${r.uf})`,
        number(r.births),
        percent(r.five_year_survival_pct),
        `${gap >= 0 ? "+" : ""}${gap.toFixed(1)}`,
      ].forEach((v) => tr.append(el("td", v)));
      body.append(tr);
    });
    if (!rows.length) {
      const tr = el("tr");
      tr.append(
        el(
          "td",
          "No state meets this minimum. Lower the cohort threshold to inspect available cells.",
          { colspan: "4" },
        ),
      );
      body.append(tr);
    }
  }
  industrySelect.addEventListener("change", updateIndustry);
  document
    .getElementById("industry-min")
    .addEventListener("change", updateIndustry);
  updateIndustry();
  document
    .querySelectorAll(".depth-section .table-scroll")
    .forEach((region) => {
      region.tabIndex = 0;
      region.setAttribute("role", "region");
      region.setAttribute(
        "aria-label",
        "Detailed data table; scroll horizontally if needed",
      );
    });
})();
