"use strict";
const $ = (id) => document.getElementById(id);
const fmt = new Intl.NumberFormat("en-US");
const pct = (value) =>
  Number.isFinite(Number(value)) && value !== null
    ? `${Number(value).toFixed(1)}%`
    : "Unavailable";
const count = (value) =>
  Number.isFinite(Number(value)) && value !== null ? fmt.format(value) : "—";
const ns = "http://www.w3.org/2000/svg";
const domesticUFs = new Set(
  "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(
    " ",
  ),
);
const svgEl = (tag, attrs = {}, content = "") => {
  const node = document.createElementNS(ns, tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  node.textContent = content;
  return node;
};
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
let data,
  metric = "active_share",
  selected = "",
  timer;
for (let i = 0; i < 100; i++) {
  $("cohort-dots").append(document.createElement("i"));
}
function curveData() {
  return (
    data?.ibge?.national_curve_with_origin ||
    data?.ibge?.national_curve ||
    []
  )
    .filter(
      (d) =>
        Number.isFinite(Number(d.age)) &&
        Number.isFinite(Number(d.survival_pct)),
    )
    .sort((a, b) => a.age - b.age);
}
function updateCohort() {
  const age = Number($("cohort-age").value),
    point = curveData().find((d) => Number(d.age) === age);
  $("age-value").textContent = age;
  $("cohort-calendar").textContent = (data.ibge?.cohort_year || 2017) + age;
  document
    .querySelectorAll("[data-cohort-year]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        Number(button.dataset.cohortYear) === age,
      ),
    );
  const value = point?.survival_pct;
  $("cohort-percent").textContent = point ? pct(value) : "—";
  $("cohort-caption").textContent = point
    ? `of the original employer enterprises surviving at year ${age}`
    : "Official cohort result unavailable";
  [...$("cohort-dots").children].forEach((dot, i) =>
    dot.classList.toggle("off", !point || i >= Math.round(value)),
  );
  $("cohort-live").textContent = point
    ? `Year ${age}: ${pct(value)} of the original employer enterprises surviving.`
    : "No official result available for this year.";
}
function stopPlayback() {
  clearInterval(timer);
  timer = null;
  $("play-cohort").firstChild.textContent = "Play the years ";
}
$("cohort-age").addEventListener("input", () => {
  stopPlayback();
  updateCohort();
});
$("play-cohort").addEventListener("click", () => {
  if (timer) {
    stopPlayback();
    return;
  }
  const points = curveData();
  if (!points.length) return;
  $("cohort-age").value = 0;
  updateCohort();
  if (reduced) {
    $("cohort-age").value = points.at(-1).age;
    updateCohort();
    return;
  }
  $("play-cohort").firstChild.textContent = "Pause ";
  timer = setInterval(() => {
    const next = Number($("cohort-age").value) + 1;
    $("cohort-age").value = next;
    updateCohort();
    if (next >= Number($("cohort-age").max)) stopPlayback();
  }, 1100);
});
function renderCurve() {
  const points = curveData();
  if (!points.length) {
    $("survival-curve").textContent =
      "Official longitudinal cohort results are unavailable.";
    $("play-cohort").disabled = true;
    $("cohort-age").disabled = true;
    updateCohort();
    return;
  }
  const maxAge = Math.max(...points.map((p) => Number(p.age)));
  $("cohort-age").max = maxAge;
  const width = Math.max(250, Math.min(1000, $("survival-curve").clientWidth)),
    height = width < 600 ? 260 : 320,
    left = 45,
    right = 20,
    top = 25,
    bottom = 40,
    plotHeight = height - top - bottom;
  const svg = svgEl("svg", {
    viewBox: `0 0 ${width} ${height}`,
    "aria-hidden": "true",
  });
  const x = (a) =>
      left + (Number(a) / Math.max(1, maxAge)) * (width - left - right),
    y = (v) => height - bottom - (Number(v) / 100) * plotHeight;
  for (let v = 0; v <= 100; v += 25) {
    svg.append(
      svgEl("line", {
        x1: left,
        x2: width - right,
        y1: y(v),
        y2: y(v),
        class: "chart-grid",
      }),
      svgEl(
        "text",
        {
          x: left - 10,
          y: y(v) + 4,
          "text-anchor": "end",
          class: "chart-text",
        },
        `${v}%`,
      ),
    );
  }
  points.forEach((p) =>
    svg.append(
      svgEl(
        "text",
        {
          x: x(p.age),
          y: height - 12,
          "text-anchor": "middle",
          class: "chart-text",
        },
        width < 450 ? `${p.age}` : `Year ${p.age}`,
      ),
    ),
  );
  svg.append(
    svgEl("path", {
      d: points
        .map((p, i) => `${i ? "L" : "M"}${x(p.age)} ${y(p.survival_pct)}`)
        .join(" "),
      class: "chart-line",
    }),
  );
  points.forEach((p) => {
    const dot = svgEl("circle", {
      cx: x(p.age),
      cy: y(p.survival_pct),
      r: 6,
      class: "chart-point",
    });
    dot.append(svgEl("title", {}, `Year ${p.age}: ${pct(p.survival_pct)}`));
    svg.append(dot);
  });
  $("survival-curve").replaceChildren(svg);
  $("survival-curve").setAttribute(
    "aria-label",
    points.map((p) => `Year ${p.age}: ${pct(p.survival_pct)}`).join("; "),
  );
  const last = points.at(-1);
  $("survival-takeaway").textContent =
    `By year ${last.age}, ${pct(last.survival_pct)} of the original employer enterprises remained in the surviving cohort. This is an observed outcome, not a forecast for a business opening today.`;
  $("curve-source").textContent =
    `Employer enterprises · ${data.ibge.cohort_year || "entry cohort"}–${data.ibge.end_year || data.ibge.observation_years?.at(-1) || ""} · original cohort denominator`;
  $("cohort-description").textContent =
    `Each vertical mark is one percentage point of the ${data.ibge.cohort_year || ""} employer-enterprise cohort. Shortened rust marks represent departures. The exact percentage is shown above the marks.`;
  $("year-stations").replaceChildren(
    ...points.map((point) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.cohortYear = point.age;
      button.textContent = (data.ibge?.cohort_year || 2017) + Number(point.age);
      button.setAttribute(
        "aria-label",
        `${button.textContent}: year ${point.age}, ${pct(point.survival_pct)} surviving`,
      );
      button.addEventListener("click", () => {
        stopPlayback();
        $("cohort-age").value = point.age;
        updateCohort();
      });
      return button;
    }),
  );
  updateCohort();
}
function renderNational() {
  const n = data.national || {};
  $("national-total").textContent = count(n.establishments);
  $("national-active").textContent = count(n.active);
  $("national-share").textContent = Number.isFinite(n.active_share)
    ? pct(n.active_share * 100)
    : "—";
  (data.statuses || []).forEach((s) => {
    const row = document.createElement("div");
    row.className = "status-row";
    const label = document.createElement("span");
    label.textContent = s.label;
    const track = document.createElement("span");
    track.className = "status-track";
    const bar = document.createElement("i");
    const share = s.share ?? s.count / n.establishments;
    bar.style.width = `${Math.max(0, Math.min(100, share * 100))}%`;
    track.append(bar);
    const val = document.createElement("span");
    val.textContent = pct(share * 100);
    row.append(label, track, val);
    $("status-bars").append(row);
  });
  const cohorts = (data.cohorts || []).filter(
    (c) => c.year >= 1990 && c.year <= 2025 && Number.isFinite(c.active_share),
  );
  if (cohorts.length) {
    cohorts.forEach((c, i) => {
      const bar = document.createElement("div");
      bar.className = "opening-bar";
      bar.title = `Opened ${c.year}: ${pct(c.active_share * 100)} active, ${count(c.total)} registrations`;
      const rect = document.createElement("i");
      rect.style.height = `${c.active_share * 85}%`;
      const label = document.createElement("span");
      label.textContent = i % 5 === 0 || i === cohorts.length - 1 ? c.year : "";
      bar.append(rect, label);
      $("opening-cohorts").append(bar);
    });
    $("opening-cohorts").setAttribute("role", "img");
    $("opening-cohorts").setAttribute(
      "aria-label",
      cohorts
        .map((c) => `${c.year}: ${pct(c.active_share * 100)} active`)
        .join("; "),
    );
  } else $("opening-cohorts").textContent = "Opening-year results unavailable.";
}
function stateValue(uf) {
  if (metric === "active_share") {
    const s = (data.states || []).find((s) => s.uf === uf);
    return s && Number.isFinite(s.active_share) ? s.active_share * 100 : null;
  }
  if (metric === "standardised") {
    const s = (data.ibge?.standardised_states || []).find((s) => s.uf === uf);
    return s?.standardised_five_year_pct ?? null;
  }
  const s = (data.ibge?.states || []).find((s) => s.uf === uf);
  return s?.survival_pct ?? s?.five_year_survival_pct ?? null;
}
function nationalValue() {
  return metric === "active_share"
    ? Number.isFinite(data.national?.domestic_active_share)
      ? data.national.domestic_active_share * 100
      : Number.isFinite(data.national?.active_share)
        ? data.national.active_share * 100
        : null
    : metric === "standardised"
      ? (data.ibge?.sector_standardisation?.national_common_five_year_pct ??
        null)
      : (data.ibge?.local_units_national_survival_pct ??
        data.ibge?.local_units_national?.five_year_survival_pct ??
        data.ibge?.local_units?.national_survival_pct ??
        null);
}
function updateMap() {
  updateStateSupport();
  const values = (data.states || [])
    .filter((s) => domesticUFs.has(s.uf))
    .map((s) => stateValue(s.uf))
    .filter((v) => v !== null);
  const min = Math.min(...values),
    max = Math.max(...values);
  $("brazil-map")
    .querySelectorAll("path")
    .forEach((path) => {
      const value = stateValue(path.dataset.uf),
        ratio = (value - min) / (max - min || 1);
      path.style.fill =
        value === null
          ? "var(--line)"
          : `color-mix(in srgb, var(--cobalt) ${Math.round(25 + ratio * 75)}%, var(--soft))`;
      path.classList.toggle("selected", path.dataset.uf === selected);
      const title = path.querySelector("title");
      title.textContent = `${path.dataset.name}: ${pct(value)}`;
    });
  const state = (data.states || []).find((s) => s.uf === selected);
  $("state-name").textContent = state?.name || "Brazil";
  $("state-value").textContent = pct(
    selected ? stateValue(selected) : nationalValue(),
  );
  $("state-national").textContent = pct(nationalValue());
  $("state-metric-label").textContent =
    metric === "active_share"
      ? "Currently active / registered establishments"
      : metric === "standardised"
        ? "Sector-standardised five-year survival / local units"
        : "Five-year survival / employer local units";
  $("map-legend").textContent =
    `Lighter → darker: lower → higher ${metric === "active_share" ? "current active share · CNPJ establishments" : "five-year survival · Employer local units"}`;
  $("state-context").textContent =
    metric === "active_share"
      ? state
        ? `${count(state.active)} active out of ${count(state.total)} registered establishments. Current administrative status; not a survival rate. Comparator: Brazilian states + Federal District.`
        : "Brazilian states + Federal District comparison. The national comparator excludes registrations outside these 27 jurisdictions."
      : metric === "standardised"
        ? "The same national weights for 17 industry sections are applied to every state. The common-support cohort excludes sectors without births in every state. Sector adjustment alone does not control for firm size, age or local conditions; small cells make comparisons sensitive."
        : "Employer local units, including branches: a different unit from the employer enterprises in the national curve. 2017 entry cohort, observed through 2022. Comparison uses the national local-unit rate.";
}
const baseUpdateMap = updateMap;
updateMap = function () {
  baseUpdateMap();
  renderGeographySummary();
  const values = (data.states || [])
    .filter((s) => domesticUFs.has(s.uf))
    .map((s) => stateValue(s.uf))
    .filter(Number.isFinite);
  if (values.length)
    $("map-legend").textContent +=
      ` · range ${pct(Math.min(...values))} to ${pct(Math.max(...values))}`;
  const place =
    (data.states || []).find((s) => s.uf === selected)?.name || "Brazil";
  const label =
    metric === "active_share"
      ? "current active share"
      : metric === "standardised"
        ? "sector-standardised five-year survival"
        : "five-year employer local-unit survival";
  $("map-live").textContent =
    `${place}: ${label} ${pct(selected ? stateValue(selected) : nationalValue())}. National comparison ${pct(nationalValue())}.`;
};
async function renderMap() {
  let geo = window.BRAZIL_GEOMETRY;
  if (!geo) {
    const res = await fetch("assets/brazil-states.geojson");
    if (!res.ok) throw Error("State boundaries unavailable");
    geo = await res.json();
  }
  const all = [];
  geo.features.forEach((f) => {
    const polys =
      f.geometry.type === "Polygon"
        ? [f.geometry.coordinates]
        : f.geometry.coordinates;
    polys.forEach((poly) =>
      poly.forEach((ring) => ring.forEach((p) => all.push(p))),
    );
  });
  const xs = all.map((p) => p[0]),
    ys = all.map((p) => p[1]);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs),
    minY = Math.min(...ys),
    maxY = Math.max(...ys);
  const scale = Math.min(550 / (maxX - minX), 545 / (maxY - minY));
  const project = (p) => [
    25 + (p[0] - minX) * scale,
    20 + (maxY - p[1]) * scale,
  ];
  geo.features.forEach((f) => {
    const uf = f.properties.sigla || f.properties.uf;
    const polys =
      f.geometry.type === "Polygon"
        ? [f.geometry.coordinates]
        : f.geometry.coordinates;
    const d = polys
      .map((poly) =>
        poly
          .map(
            (ring) =>
              ring
                .map(
                  (p, i) =>
                    `${i ? "L" : "M"}${project(p)
                      .map((v) => v.toFixed(2))
                      .join(" ")}`,
                )
                .join(" ") + " Z",
          )
          .join(" "),
      )
      .join(" ");
    const path = svgEl("path", {
      d,
      "data-uf": uf,
      "data-name": f.properties.name,
      "fill-rule": "evenodd",
    });
    path.append(svgEl("title", {}, f.properties.name));
    path.addEventListener("click", () => {
      selected = uf;
      $("state-select").value = uf;
      updateMap();
    });
    $("brazil-map").append(path);
  });
  updateMap();
  renderAtlas(project);
}

// The opening map uses the same geometry and official local-unit rates as the explorer.
// Label anchors are display positions, not analytical centroids.
function renderAtlas(project) {
  const map = $("atlas-map");
  const rows = data.ibge?.states || [];
  const valid = rows.filter((s) => Number.isFinite(s.five_year_survival_pct));
  if (!valid.length) {
    map.replaceChildren(
      svgEl(
        "text",
        { x: 30, y: 100, fill: "white" },
        "Official state cohort unavailable",
      ),
    );
    return;
  }
  const min = Math.min(...valid.map((s) => s.five_year_survival_pct));
  const max = Math.max(...valid.map((s) => s.five_year_survival_pct));
  const anchors = {
    AC: [-70, -9.5],
    AM: [-64, -4.5],
    RR: [-61, 2.1],
    AP: [-51.8, 1.2],
    PA: [-53, -4],
    RO: [-63, -11.3],
    MT: [-56, -13],
    TO: [-48.3, -9.7],
    MA: [-45, -5],
    PI: [-43, -8],
    CE: [-39.5, -5.2],
    RN: [-36, -5.5],
    PB: [-36, -7.2],
    PE: [-38, -8.5],
    AL: [-36.5, -9.5],
    SE: [-37.3, -10.7],
    BA: [-41.5, -12.3],
    MG: [-44.5, -18.5],
    ES: [-40.5, -19.5],
    RJ: [-42.5, -22.5],
    SP: [-48.5, -22.2],
    MS: [-54.8, -20.4],
    GO: [-49.7, -16],
    DF: [-47.8, -15.8],
    PR: [-51, -24.7],
    SC: [-50, -27.2],
    RS: [-53.2, -30],
  };
  const offsets = {
    RN: [48, -8],
    PB: [48, 0],
    PE: [68, 7],
    AL: [73, 20],
    SE: [75, 34],
    ES: [48, 6],
    RJ: [42, 26],
    DF: [30, -13],
  };
  const labelLayer = svgEl("g", { "aria-hidden": "true" });
  function preview(uf) {
    const row = rows.find((s) => s.uf === uf);
    const rate =
      row?.five_year_survival_pct ??
      data.ibge.local_units_national.five_year_survival_pct;
    $("atlas-place").textContent = row?.geography || row?.name || "Brazil";
    $("atlas-rate").textContent = pct(rate);
    $("atlas-support").textContent =
      `${count(row?.births ?? data.ibge.local_units_national.births)} employer local-unit entrants · 2017 → 2022`;
    map
      .querySelectorAll(".atlas-state")
      .forEach((p) => p.classList.toggle("chosen", p.dataset.uf === uf));
    $("atlas-explore").dataset.uf = uf || "";
  }
  $("atlas-explore").addEventListener("click", (e) =>
    choose(e.currentTarget.dataset.uf),
  );
  function choose(uf) {
    selected = uf || "";
    metric = "survival_pct";
    $("state-select").value = selected;
    document
      .querySelectorAll("[data-metric]")
      .forEach((b) =>
        b.setAttribute("aria-pressed", b.dataset.metric === metric),
      );
    updateMap();
  }
  $("brazil-map")
    .querySelectorAll("path")
    .forEach((source) => {
      const uf = source.dataset.uf;
      const row = rows.find((s) => s.uf === uf);
      const rate = row?.five_year_survival_pct;
      const link = svgEl("a", {
        href: "#geography",
        "aria-label": `${source.dataset.name}, five-year employer local-unit survival ${pct(rate)}. Explore state comparison.`,
      });
      const path = source.cloneNode(true);
      path.removeAttribute("style");
      path.setAttribute("class", "atlas-state");
      const ratio = Number.isFinite(rate) ? (rate - min) / (max - min || 1) : 0;
      path.style.fill = `color-mix(in srgb, white ${Math.round(32 + ratio * 65)}%, var(--cobalt))`;
      path.querySelector("title").textContent =
        `${source.dataset.name}: ${pct(rate)}`;
      link.append(path);
      link.addEventListener("pointerenter", () => preview(uf));
      link.addEventListener("focus", () => preview(uf));
      link.addEventListener("click", () => {
        preview(uf);
        choose(uf);
      });
      map.append(link);
      if (anchors[uf]) {
        const [x, y] = project(anchors[uf]);
        const [dx, dy] = offsets[uf] || [0, 0];
        if (dx)
          labelLayer.append(
            svgEl("path", {
              d: `M${x} ${y} L${x + dx - 10} ${y + dy}`,
              class: "atlas-leader",
            }),
          );
        labelLayer.append(
          svgEl(
            "text",
            {
              x: x + dx,
              y: y + dy + 3,
              "text-anchor": "middle",
              class: `atlas-label${dx ? " outer" : ""}`,
            },
            uf,
          ),
        );
      }
    });
  map.append(labelLayer);
  preview("");
}
$("state-select").addEventListener("change", (e) => {
  selected = e.target.value;
  updateMap();
});
document.querySelectorAll("[data-metric]").forEach((b) =>
  b.addEventListener("click", () => {
    metric = b.dataset.metric;
    document
      .querySelectorAll("[data-metric]")
      .forEach((button) => button.setAttribute("aria-pressed", button === b));
    updateMap();
  }),
);
async function init() {
  try {
    if (window.BRAZIL_STORY) {
      data = window.BRAZIL_STORY;
    } else {
      const res = await fetch("data/story.json");
      if (!res.ok) throw Error("Analysis data unavailable");
      data = await res.json();
    }
    renderNational();
    renderCurve();
    revealCurve();
    (data.states || [])
      .filter((s) => domesticUFs.has(s.uf))
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((s) => {
        const option = document.createElement("option");
        option.value = s.uf;
        option.textContent = `${s.name} (${s.uf})`;
        $("state-select").append(option);
      });
    $("survival-map-button").disabled = !data.ibge?.states?.length;
    $("standardised-map-button").disabled =
      !data.ibge?.standardised_states?.length;
    try {
      await renderMap();
    } catch (error) {
      $("map-legend").textContent =
        "Map geometry could not load. State comparisons remain available in the menu.";
      updateMap();
    }
  } catch (error) {
    $("data-message").textContent =
      "The analysis data could not be loaded. Serve this page over HTTP and confirm data/story.json is present. No demonstration statistics are displayed.";
    $("survival-curve").textContent = "Analysis unavailable";
    $("play-cohort").disabled = true;
    $("cohort-age").disabled = true;
    $("survival-map-button").disabled = true;
    $("standardised-map-button").disabled = true;
  }
}
function renderFactors() {
  const names = {
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
    T: "Household activities",
    U: "Extraterritorial organisations",
  };
  function rows(target, items, label) {
    if (!items.length) {
      $(target).textContent = "Published results unavailable.";
      return;
    }
    items.forEach((item) => {
      const value = item.five_year_survival_pct ?? item.survival_pct;
      if (!Number.isFinite(value) || !(item.births > 0)) return;
      const row = document.createElement("div");
      row.className = "factor-row";
      const head = document.createElement("div");
      head.className = "factor-row-head";
      const name = document.createElement("span");
      name.textContent = label(item);
      const number = document.createElement("strong");
      number.textContent = pct(value);
      head.append(name, number);
      const track = document.createElement("div");
      track.className = "factor-track";
      const bar = document.createElement("i");
      bar.style.width = `${Math.max(0, Math.min(100, value))}%`;
      track.append(bar);
      const small = document.createElement("small");
      small.textContent = `Original cohort: ${count(item.births)} employer enterprises`;
      row.append(head, track, small);
      $(target).append(row);
    });
  }
  rows(
    "size-comparisons",
    data.ibge?.sizes || [],
    (item) =>
      ({
        "1 a 9": "1–9 salaried employees",
        "10 a 49": "10–49 salaried employees",
        "50 ou mais": "50 or more salaried employees",
      })[item.label] || item.label,
  );
  rows(
    "sector-comparisons",
    data.ibge?.sectors || [],
    (item) => names[item.section] || item.label,
  );
  $("sector-comparisons").setAttribute("tabindex", "0");
  $("sector-comparisons").setAttribute("role", "region");
  $("sector-comparisons").setAttribute(
    "aria-label",
    "Industry survival comparisons. Scroll to explore all sections.",
  );
  const sizes = data.ibge?.sizes || [];
  if (sizes.length > 1) {
    const rates = sizes
      .map((s) => s.five_year_survival_pct ?? s.survival_pct)
      .filter(Number.isFinite);
    if (rates.length)
      $("factor-takeaway").textContent =
        `Across the published employment-size groups, five-year employer-enterprise survival ranges from ${pct(Math.min(...rates))} to ${pct(Math.max(...rates))}. That difference is descriptive: size, sector and other business characteristics move together.`;
  }
}
const originalRenderNational = renderNational;
renderNational = function () {
  originalRenderNational();
  renderFactors();
};
let curveResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(curveResizeTimer);
  curveResizeTimer = setTimeout(() => {
    if (data) renderCurve();
  }, 160);
});
function revealCurve() {
  const line = $("survival-curve").querySelector(".chart-line");
  if (!line || reduced) return;
  const length = line.getTotalLength();
  line.style.strokeDasharray = length;
  line.style.strokeDashoffset = length;
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        line.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], {
          duration: 1400,
          easing: "cubic-bezier(.2,.65,.3,1)",
          fill: "forwards",
        });
        observer.disconnect();
      }
    },
    { threshold: 0.35 },
  );
  observer.observe($("survival-curve"));
}
function updateStateSupport() {
  const target = $("state-support");
  if (!target) return;
  if (metric === "active_share") {
    target.textContent = "";
    return;
  }
  const raw = (data.ibge?.states || []).find((s) => s.uf === selected);
  const adjusted = (data.ibge?.standardised_states || []).find(
    (s) => s.uf === selected,
  );
  if (!selected) {
    target.textContent =
      "2017 employer-local-unit entrants, followed through 2022. Local units can include branches.";
    return;
  }
  let text =
    raw?.births !== undefined
      ? `Original local-unit cohort: ${count(raw.births)} entrants. `
      : "";
  if (metric === "standardised" && adjusted) {
    text += `Common-sector cohort: ${count(adjusted.common_births)} entrants (${pct(adjusted.state_cohort_coverage_pct)} of this state's cohort). Smallest included state-sector cell: ${count(adjusted.min_included_sector_births)}. `;
    if (
      Number.isFinite(adjusted.raw_common_five_year_pct) &&
      Number.isFinite(adjusted.standardised_five_year_pct)
    ) {
      const shift =
        adjusted.standardised_five_year_pct - adjusted.raw_common_five_year_pct;
      text += `Within the same included sectors, the observed rate is ${pct(adjusted.raw_common_five_year_pct)}; common national weights change it by ${shift >= 0 ? "+" : ""}${shift.toFixed(1)} percentage points.`;
    }
  }
  target.textContent = text;
}
function renderGeographySummary() {
  const target = $("geography-summary");
  if (!target) return;
  const entries = (data.states || [])
    .filter((s) => domesticUFs.has(s.uf))
    .map((s) => ({ ...s, rate: stateValue(s.uf) }))
    .filter((s) => Number.isFinite(s.rate))
    .sort((a, b) => b.rate - a.rate);
  if (!entries.length) {
    target.textContent =
      metric === "active_share"
        ? "The complete CNPJ acquisition is in progress; state active-share comparisons will appear when its results are available."
        : "Published state comparisons are unavailable for this measure.";
    return;
  }
  const high = entries[0],
    low = entries.at(-1);
  const cohortYear = data.ibge?.cohort_year || 2017;
  const endYear =
    data.ibge?.end_year || data.ibge?.observation_years?.at(-1) || 2022;
  const n = (state) => {
    const source =
      metric === "standardised"
        ? (data.ibge?.standardised_states || []).find((s) => s.uf === state.uf)
        : (data.ibge?.states || []).find((s) => s.uf === state.uf);
    const value =
      metric === "standardised" ? source?.common_births : source?.births;
    return Number.isFinite(value) ? `, cohort n=${count(value)}` : "";
  };
  if (metric === "active_share") {
    target.textContent = `Across Brazilian states and the Federal District, ${high.name} has the highest current registered active share (${pct(high.rate)}; ${count(high.total)} registrations), and ${low.name} the lowest (${pct(low.rate)}; ${count(low.total)} registrations). These are current administrative statuses, not survival rates or recommendations for where to operate.`;
  } else if (metric === "standardised") {
    target.textContent = `With the same common-sector national weights, ${high.name} has the highest five-year local-unit survival (${pct(high.rate)}${n(high)}), and ${low.name} the lowest (${pct(low.rate)}${n(low)}) in the ${cohortYear}–${endYear} employer cohort. This is a historical comparison, not a location recommendation; small cells can make the comparison sensitive.`;
  } else {
    target.textContent = `In the ${cohortYear}–${endYear} employer-local-unit cohort, ${high.name} has the highest observed five-year survival (${pct(high.rate)}${n(high)}), and ${low.name} the lowest (${pct(low.rate)}${n(low)}). These historical differences include industry-mix differences and do not identify the best place to operate.`;
  }
}
init();
