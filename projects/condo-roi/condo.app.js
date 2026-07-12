(() => {
  "use strict";

  const source = window.CONDO_DATA;
  if (!source || !source.records || !source.schema) {
    document.body.innerHTML = '<p style="padding:40px;font-family:sans-serif">Dashboard data failed to load. Run <code>python scripts/build_dashboard_data.py</code>.</p>';
    return;
  }

  const finite = value => typeof value === "number" && Number.isFinite(value);
  const fieldIndex = Object.fromEntries(source.schema.map((field, index) => [field, index]));
  const records = source.records.map((row, id) => {
    const r = { id };
    source.schema.forEach((field, index) => { r[field] = row[index]; });
    r.district = Number.isFinite(r.districtNumber) ? `District ${String(r.districtNumber).padStart(2, "0")}` : "Unknown";
    return r;
  });
  const years = source.meta.years;
  const pairedRecords = records.filter(r => finite(r.latestBuy) && finite(r.latestRent) && finite(r.grossYield));

  const state = {
    activeTab: "market",
    market: { district: "", type: "", tenure: "", area: "" },
    value: { maxPrice: 2500000, minYield: 3.5, district: "", type: "", tenure: "", beds: "", evidence: "reliable", sort: "yield" },
    valueRows: [],
    selected: null,
    scatterPoints: [],
    underwriterRecord: null,
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const median = values => {
    const valid = values.filter(finite).sort((a, b) => a - b);
    if (!valid.length) return null;
    const middle = Math.floor(valid.length / 2);
    return valid.length % 2 ? valid[middle] : (valid[middle - 1] + valid[middle]) / 2;
  };
  const percentile = (values, p) => {
    const valid = values.filter(finite).sort((a, b) => a - b);
    if (!valid.length) return null;
    const index = (valid.length - 1) * p;
    const lo = Math.floor(index), hi = Math.ceil(index);
    return valid[lo] + (valid[hi] - valid[lo]) * (index - lo);
  };
  const change = (first, last) => finite(first) && finite(last) && first !== 0 ? (last / first - 1) * 100 : null;
  const fmtMoney = (value, compact = false) => {
    if (!finite(value)) return "—";
    if (compact && Math.abs(value) >= 1e6) return `S$${(value / 1e6).toFixed(value >= 1e7 ? 0 : 1)}m`;
    if (compact && Math.abs(value) >= 1e3) return `S$${(value / 1e3).toFixed(0)}k`;
    return `S$${Math.round(value).toLocaleString("en-SG")}`;
  };
  const fmtPct = (value, digits = 1) => finite(value) ? `${value.toFixed(digits)}%` : "—";
  const signedPct = (value, digits = 1) => finite(value) ? `${value > 0 ? "+" : ""}${value.toFixed(digits)}%` : "—";
  const fmtYears = value => finite(value) ? `${value.toFixed(1)} yrs` : "—";
  const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
  const unique = values => [...new Set(values.filter(Boolean))];
  const areaMid = label => {
    const nums = String(label || "").match(/\d+(?:\.\d+)?/g)?.map(Number) || [];
    if (!nums.length) return 9999;
    if (String(label).startsWith(">")) return nums[0] + 25;
    if (String(label).startsWith("<=")) return nums[0] / 2;
    return nums.length > 1 ? (nums[0] + nums[1]) / 2 : nums[0];
  };
  const svgNS = "http://www.w3.org/2000/svg";
  const svgEl = (name, attrs = {}) => {
    const node = document.createElementNS(svgNS, name);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  };
  const setText = (id, text) => { const node = $(id); if (node) node.textContent = text; };

  function initialise() {
    setText("#statusYears", `${years[0]}–${years.at(-1)} history`);
    setText("#statusProjects", `${source.meta.projects.toLocaleString()} projects · ${source.meta.pairedRows.toLocaleString()} paired records`);
    setText("#statusRecent", source.meta.recentSnapshotLoaded ? "Recent URA snapshot loaded" : `${years.at(-1)} may be partial`);
    populateControls();
    bindTabs();
    bindMarket();
    bindValue();
    bindUnderwriter();
    renderMarket();
    renderValue();
    selectInitialUnderwriter();
    window.addEventListener("resize", debounce(() => {
      if (state.activeTab === "market") renderMarketCharts();
      if (state.activeTab === "value") drawValueScatter();
      if (state.activeTab === "underwriter") updateUnderwriter();
    }, 120));
  }

  function fillSelect(id, values, allLabel = null) {
    const select = $(id);
    if (!select) return;
    const current = select.value;
    select.innerHTML = "";
    if (allLabel !== null) {
      const option = document.createElement("option");
      option.value = ""; option.textContent = allLabel; select.appendChild(option);
    }
    values.forEach(value => {
      const option = document.createElement("option");
      option.value = value; option.textContent = value; select.appendChild(option);
    });
    if ([...select.options].some(option => option.value === current)) select.value = current;
  }

  function populateControls() {
    const districts = unique(records.map(r => r.district).filter(v => v !== "Unknown")).sort();
    const types = unique(records.map(r => r.propertyType)).sort();
    const tenures = unique(records.map(r => r.tenureGroup).filter(v => v !== "Unknown")).sort();
    const areas = unique(records.map(r => r.area)).sort((a, b) => areaMid(a) - areaMid(b));
    const beds = ["1", "2", "3", "4", "5+"];
    const evidence = unique(pairedRecords.map(r => r.evidenceGrade)).sort((a, b) => evidenceRank(b) - evidenceRank(a));
    fillSelect("#marketDistrict", districts, "All districts");
    fillSelect("#marketType", types, "All condo types");
    fillSelect("#marketTenure", tenures, "All tenure");
    fillSelect("#marketArea", areas, "All sizes");
    fillSelect("#valueDistrict", districts, "All districts");
    fillSelect("#valueType", types, "All condo types");
    fillSelect("#valueTenure", tenures, "All tenure");
    fillSelect("#valueBeds", beds, "All sizes");
    const evidenceSelect = $("#valueEvidence");
    evidenceSelect.innerHTML = '<option value="">All coverage</option><option value="reliable">Moderate or stronger</option>' + evidence.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("");
    evidenceSelect.value = state.value.evidence;
  }

  function bindTabs() {
    $$(".section-tab").forEach(button => button.addEventListener("click", () => activateTab(button.dataset.tab)));
  }

  function activateTab(tab) {
    state.activeTab = tab;
    $$(".section-tab").forEach(button => button.classList.toggle("is-active", button.dataset.tab === tab));
    $$(".tab-panel").forEach(panel => {
      const active = panel.dataset.panel === tab;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
    if (tab === "market") requestAnimationFrame(renderMarketCharts);
    if (tab === "value") requestAnimationFrame(drawValueScatter);
    if (tab === "underwriter") requestAnimationFrame(updateUnderwriter);
    window.scrollTo({ top: $(".section-nav").offsetTop, behavior: "smooth" });
  }

  function bindMarket() {
    [["marketDistrict", "district"], ["marketType", "type"], ["marketTenure", "tenure"], ["marketArea", "area"]].forEach(([id, key]) => {
      $(`#${id}`).addEventListener("change", event => { state.market[key] = event.target.value; renderMarket(); });
    });
    $("#marketReset").addEventListener("click", () => {
      state.market = { district: "", type: "", tenure: "", area: "" };
      ["marketDistrict", "marketType", "marketTenure", "marketArea"].forEach(id => { $(`#${id}`).value = ""; });
      renderMarket();
    });
  }

  function marketRows() {
    return records.filter(r =>
      (!state.market.district || r.district === state.market.district) &&
      (!state.market.type || r.propertyType === state.market.type) &&
      (!state.market.tenure || r.tenureGroup === state.market.tenure) &&
      (!state.market.area || r.area === state.market.area)
    );
  }

  function aggregateYears(rows) {
    return years.map((year, index) => {
      const buys = rows.map(r => r.buy[index]).filter(finite);
      const rents = rows.map(r => r.rent[index]).filter(finite);
      const yields = rows.map(r => r.yield[index]).filter(finite);
      return { year, buy: median(buys), rent: median(rents), yield: median(yields), buyN: buys.length, rentN: rents.length, pairN: yields.length };
    });
  }

  function renderMarket() {
    const rows = marketRows();
    const annual = aggregateYears(rows);
    const valid = annual.filter(item => finite(item.buy) || finite(item.rent) || finite(item.yield));
    const first = valid[0], last = valid.at(-1);
    setText("#metricBuy", fmtMoney(last?.buy, true));
    setText("#metricRent", fmtMoney(last?.rent));
    setText("#metricYield", fmtPct(last?.yield, 2));
    setText("#metricCoverage", (last?.pairN || 0).toLocaleString());
    setText("#metricBuyDelta", first && last ? `${signedPct(change(first.buy, last.buy))} since ${first.year}` : "Insufficient trend");
    setText("#metricRentDelta", first && last ? `${signedPct(change(first.rent, last.rent))} since ${first.year}` : "Insufficient trend");
    setText("#metricYieldDelta", first && last && finite(first.yield) && finite(last.yield) ? `${last.yield - first.yield >= 0 ? "+" : ""}${(last.yield - first.yield).toFixed(2)} pts` : "Insufficient trend");
    renderMomentumNarrative(annual);
    renderMarketCharts(annual, rows);
    renderMarketSignals(rows);
  }

  function renderMomentumNarrative(annual = aggregateYears(marketRows())) {
    const paired = annual.filter(item => finite(item.buy) && finite(item.rent));
    if (paired.length < 2) {
      setText("#momentumVerdict", "Not enough paired history");
      setText("#momentumNarrative", "Widen the filters to compare price and rent growth.");
      setText("#pricePeriodChange", "—"); setText("#rentPeriodChange", "—"); return;
    }
    const first = paired[0], last = paired.at(-1);
    const priceMove = change(first.buy, last.buy), rentMove = change(first.rent, last.rent);
    const difference = rentMove - priceMove;
    let verdict, narrative;
    if (difference > 4) {
      verdict = "Rent has led price growth";
      narrative = "Rental income has grown faster than observed purchase prices, improving gross yield within this filtered universe.";
    } else if (difference < -4) {
      verdict = "Prices have outrun rents";
      narrative = "Purchase prices have grown faster than rents, compressing gross yield unless future rent catches up.";
    } else {
      verdict = "Prices and rents moved together";
      narrative = "The two series have broadly kept pace, leaving gross yield relatively stable over the period.";
    }
    setText("#momentumVerdict", verdict);
    setText("#momentumNarrative", narrative);
    setText("#pricePeriodChange", signedPct(priceMove));
    setText("#rentPeriodChange", signedPct(rentMove));
  }

  function renderMarketCharts(annual = aggregateYears(marketRows()), rows = marketRows()) {
    const pairedIndex = annual.findIndex(item => finite(item.buy) && finite(item.rent));
    const baseBuy = pairedIndex >= 0 ? annual[pairedIndex].buy : null;
    const baseRent = pairedIndex >= 0 ? annual[pairedIndex].rent : null;
    const momentumSeries = [
      { name: "Sale price", className: "series-buy", color: css("--green"), values: annual.map(item => finite(item.buy) && baseBuy ? item.buy / baseBuy * 100 : null) },
      { name: "Rent", className: "series-rent", color: css("--copper"), values: annual.map(item => finite(item.rent) && baseRent ? item.rent / baseRent * 100 : null) },
    ];
    drawLineChart("momentumChart", years, momentumSeries, { ySuffix: "", baseline: 100, yFormatter: value => value.toFixed(0) });
    drawLineChart("yieldChart", years, [{ name: "Gross yield", className: "series-yield", color: css("--blue"), values: annual.map(item => item.yield) }], { ySuffix: "%", yFormatter: value => `${value.toFixed(1)}%`, area: true });
    drawDistrictQuadrant(rows);
  }

  function drawLineChart(id, labels, series, options = {}) {
    const svg = $(`#${id}`);
    if (!svg) return;
    const width = Math.max(320, svg.clientWidth || 700), height = Math.max(220, svg.clientHeight || 360);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`); svg.innerHTML = "";
    const margin = { top: 24, right: 24, bottom: 42, left: 56 };
    const plotW = width - margin.left - margin.right, plotH = height - margin.top - margin.bottom;
    const values = series.flatMap(line => line.values).filter(finite);
    if (!values.length) return drawEmptySvg(svg, width, height, "No data for the selected filters");
    let min = Math.min(...values), max = Math.max(...values);
    if (options.baseline !== undefined) { min = Math.min(min, options.baseline); max = Math.max(max, options.baseline); }
    const pad = Math.max((max - min) * .16, max === min ? 1 : .2);
    min -= pad; max += pad;
    const x = index => margin.left + (labels.length === 1 ? plotW / 2 : index / (labels.length - 1) * plotW);
    const y = value => margin.top + (max - value) / (max - min) * plotH;

    for (let i = 0; i <= 4; i++) {
      const value = min + (max - min) * i / 4;
      const yy = y(value);
      svg.appendChild(svgEl("line", { x1: margin.left, x2: width - margin.right, y1: yy, y2: yy, class: "grid-line" }));
      const text = svgEl("text", { x: margin.left - 10, y: yy + 4, "text-anchor": "end" });
      text.textContent = options.yFormatter ? options.yFormatter(value) : value.toFixed(1) + (options.ySuffix || ""); svg.appendChild(text);
    }
    labels.forEach((label, index) => {
      const text = svgEl("text", { x: x(index), y: height - 14, "text-anchor": "middle" }); text.textContent = label; svg.appendChild(text);
    });
    if (options.baseline !== undefined && options.baseline >= min && options.baseline <= max) {
      svg.appendChild(svgEl("line", { x1: margin.left, x2: width - margin.right, y1: y(options.baseline), y2: y(options.baseline), stroke: css("--line-dark"), "stroke-dasharray": "5 5" }));
    }
    series.forEach(line => {
      const segments = []; let current = [];
      line.values.forEach((value, index) => {
        if (finite(value)) current.push([x(index), y(value), index, value]);
        else if (current.length) { segments.push(current); current = []; }
      });
      if (current.length) segments.push(current);
      segments.forEach(points => {
        const d = points.map((point, i) => `${i ? "L" : "M"}${point[0]},${point[1]}`).join(" ");
        if (options.area && points.length > 1) {
          const area = `${d} L${points.at(-1)[0]},${height - margin.bottom} L${points[0][0]},${height - margin.bottom} Z`;
          svg.appendChild(svgEl("path", { d: area, fill: line.color, opacity: ".08" }));
        }
        svg.appendChild(svgEl("path", { d, class: `line-series ${line.className || ""}`, stroke: line.color }));
        points.forEach(point => {
          const circle = svgEl("circle", { cx: point[0], cy: point[1], r: 4.5, fill: line.color, class: "point" });
          const title = svgEl("title"); title.textContent = `${line.name} · ${labels[point[2]]}: ${options.yFormatter ? options.yFormatter(point[3]) : point[3].toFixed(1)}`; circle.appendChild(title); svg.appendChild(circle);
        });
      });
    });
  }

  function drawEmptySvg(svg, width, height, message) {
    const text = svgEl("text", { x: width / 2, y: height / 2, "text-anchor": "middle", class: "label-strong" });
    text.textContent = message; svg.appendChild(text);
  }

  function drawDistrictQuadrant(rows) {
    const svg = $("#districtQuadrant");
    const width = Math.max(320, svg.clientWidth || 700), height = Math.max(230, svg.clientHeight || 330);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`); svg.innerHTML = "";
    const margin = { top: 20, right: 24, bottom: 45, left: 52 };
    const groups = groupBy(rows.filter(r => r.district !== "Unknown"), r => r.district);
    const points = [];
    groups.forEach((items, district) => {
      const firstBuy = median(items.map(r => r.buy[0])), lastBuy = median(items.map(r => r.buy.at(-1)));
      const firstRent = median(items.map(r => r.rent[0])), lastRent = median(items.map(r => r.rent.at(-1)));
      const xVal = change(firstBuy, lastBuy), yVal = change(firstRent, lastRent);
      if (finite(xVal) && finite(yVal) && items.length >= 8) points.push({ district, x: xVal, y: yVal, n: items.length });
    });
    if (!points.length) return drawEmptySvg(svg, width, height, "Widen filters to compare districts");
    const xAbs = Math.max(10, percentile(points.map(p => Math.abs(p.x)), .95) || 10);
    const yAbs = Math.max(10, percentile(points.map(p => Math.abs(p.y)), .95) || 10);
    const xMin = -xAbs * .25, xMax = xAbs * 1.08, yMin = -yAbs * .25, yMax = yAbs * 1.08;
    const sx = value => margin.left + (clamp(value, xMin, xMax) - xMin) / (xMax - xMin) * (width - margin.left - margin.right);
    const sy = value => margin.top + (yMax - clamp(value, yMin, yMax)) / (yMax - yMin) * (height - margin.top - margin.bottom);
    svg.appendChild(svgEl("line", { x1: sx(0), x2: sx(0), y1: margin.top, y2: height - margin.bottom, class: "axis-line" }));
    svg.appendChild(svgEl("line", { x1: margin.left, x2: width - margin.right, y1: sy(0), y2: sy(0), class: "axis-line" }));
    [-.2, 0, .2, .4, .6, .8, 1].forEach(t => {
      const value = xMin + (xMax - xMin) * t;
      if (t < 0 || t > 1) return;
      const text = svgEl("text", { x: sx(value), y: height - 14, "text-anchor": "middle" }); text.textContent = `${value.toFixed(0)}%`; svg.appendChild(text);
    });
    const xLabel = svgEl("text", { x: width - margin.right, y: height - 2, "text-anchor": "end", class: "label-strong" }); xLabel.textContent = "Price growth →"; svg.appendChild(xLabel);
    const yLabel = svgEl("text", { x: margin.left, y: 11, class: "label-strong" }); yLabel.textContent = "Rent growth ↑"; svg.appendChild(yLabel);
    const labelSet = points.slice().sort((a, b) => Math.abs(b.y - b.x) - Math.abs(a.y - a.x)).slice(0, 10);
    points.forEach(point => {
      const color = point.x < 0 && point.y < 0 ? css("--red") : point.y >= point.x ? css("--green") : css("--copper");
      const circle = svgEl("circle", { cx: sx(point.x), cy: sy(point.y), r: clamp(3 + Math.sqrt(point.n) / 3, 4, 10), fill: color, opacity: ".78", stroke: css("--paper"), "stroke-width": 2 });
      const title = svgEl("title"); title.textContent = `${point.district}: price ${signedPct(point.x)}, rent ${signedPct(point.y)}`; circle.appendChild(title); svg.appendChild(circle);
      if (labelSet.includes(point)) {
        const text = svgEl("text", { x: sx(point.x) + 7, y: sy(point.y) - 7, class: "label-strong" }); text.textContent = point.district.replace("District ", "D"); svg.appendChild(text);
      }
    });
  }

  function renderMarketSignals(rows) {
    const groups = groupBy(rows.filter(r => r.district !== "Unknown"), r => r.district);
    const signals = [];
    groups.forEach((items, district) => {
      const firstYield = median(items.map(r => r.yield[0])), lastYield = median(items.map(r => r.yield.at(-1)));
      if (!finite(firstYield) || !finite(lastYield) || items.length < 8) return;
      const firstBuy = median(items.map(r => r.buy[0])), lastBuy = median(items.map(r => r.buy.at(-1)));
      const firstRent = median(items.map(r => r.rent[0])), lastRent = median(items.map(r => r.rent.at(-1)));
      signals.push({ district, delta: lastYield - firstYield, price: change(firstBuy, lastBuy), rent: change(firstRent, lastRent), latest: lastYield, n: items.length });
    });
    const selected = [...signals].sort((a, b) => b.delta - a.delta).slice(0, 3)
      .concat([...signals].sort((a, b) => a.delta - b.delta).slice(0, 3));
    $("#marketSignals").innerHTML = selected.map(item => `
      <article class="signal-item">
        <header><h4>${escapeHtml(item.district)}</h4><strong class="${item.delta >= 0 ? "signal-positive" : "signal-negative"}">${item.delta >= 0 ? "+" : ""}${item.delta.toFixed(2)} pts</strong></header>
        <p>Latest median yield ${fmtPct(item.latest, 2)} · price ${signedPct(item.price)} · rent ${signedPct(item.rent)} · ${item.n.toLocaleString()} records</p>
      </article>`).join("") || '<p>No district signals under the selected filters.</p>';
  }

  function bindValue() {
    const bindings = [
      ["maxPrice", "maxPrice", "input", Number], ["minYield", "minYield", "input", Number],
      ["valueDistrict", "district", "change", String], ["valueType", "type", "change", String],
      ["valueTenure", "tenure", "change", String], ["valueBeds", "beds", "change", String],
      ["valueEvidence", "evidence", "change", String], ["valueSort", "sort", "change", String],
    ];
    bindings.forEach(([id, key, event, cast]) => $(`#${id}`).addEventListener(event, e => { state.value[key] = cast(e.target.value); renderValue(); }));
    $("#valueReset").addEventListener("click", () => {
      state.value = { maxPrice: 2500000, minYield: 3.5, district: "", type: "", tenure: "", beds: "", evidence: "reliable", sort: "yield" };
      $("#maxPrice").value = state.value.maxPrice; $("#minYield").value = state.value.minYield;
      ["valueDistrict", "valueType", "valueTenure", "valueBeds"].forEach(id => { $(`#${id}`).value = ""; });
      $("#valueEvidence").value = "reliable"; $("#valueSort").value = "yield"; renderValue();
    });
    $("#resultsTable tbody").addEventListener("click", event => {
      const row = event.target.closest("tr[data-id]"); if (row) openDetail(records[Number(row.dataset.id)]);
    });
    $(".drawer-close").addEventListener("click", () => $("#propertyDetail").classList.remove("is-open"));
    $("#sendToUnderwriter").addEventListener("click", () => {
      if (!state.selected) return;
      selectUnderwriterRecord(state.selected); activateTab("underwriter");
    });
  }

  function evidenceRank(label) {
    return ({"High": 6, "Medium": 5, "Strong history": 4, "Moderate history": 3, "Thin history": 2, "Low": 1, "Incomplete": 0})[label] ?? 0;
  }

  function filteredValueRows() {
    return pairedRecords.filter(r =>
      r.latestBuy <= state.value.maxPrice && r.grossYield >= state.value.minYield &&
      (!state.value.district || r.district === state.value.district) &&
      (!state.value.type || r.propertyType === state.value.type) &&
      (!state.value.tenure || r.tenureGroup === state.value.tenure) &&
      (!state.value.beds || r.bedrooms === state.value.beds) &&
      (!state.value.evidence || (state.value.evidence === "reliable" ? evidenceRank(r.evidenceGrade) >= 3 : r.evidenceGrade === state.value.evidence))
    );
  }

  function renderValue() {
    let rows = filteredValueRows();
    const sorters = {
      yield: (a, b) => b.grossYield - a.grossYield,
      premium: (a, b) => (b.districtYieldPremium ?? -999) - (a.districtYieldPremium ?? -999),
      discount: (a, b) => (b.districtPriceDiscount ?? -999) - (a.districtPriceDiscount ?? -999),
      rentGrowth: (a, b) => (b.rentGrowth ?? -999) - (a.rentGrowth ?? -999),
    };
    rows.sort(sorters[state.value.sort]); state.valueRows = rows;
    setText("#valueCount", rows.length.toLocaleString());
    setText("#valueMedianYield", fmtPct(median(rows.map(r => r.grossYield)), 2));
    setText("#valueMedianPrice", fmtMoney(median(rows.map(r => r.latestBuy)), true));
    setText("#valueBestYield", fmtPct(rows.length ? Math.max(...rows.map(r => r.grossYield)) : null, 2));
    const sortLabels = { yield: "gross yield", premium: "yield premium versus district", discount: "price discount versus district", rentGrowth: "historical rent growth" };
    setText("#resultsTitle", `Ranked by ${sortLabels[state.value.sort]}`);
    setText("#resultsCount", `${Math.min(rows.length, 40).toLocaleString()} shown · ${rows.length.toLocaleString()} eligible`);
    renderResultsTable(rows.slice(0, 40));
    requestAnimationFrame(drawValueScatter);
  }

  function renderResultsTable(rows) {
    const tbody = $("#resultsTable tbody");
    tbody.innerHTML = rows.map(r => {
      const relative = finite(r.districtYieldPremium) ? `${r.districtYieldPremium >= 0 ? "+" : ""}${r.districtYieldPremium.toFixed(2)} pts yield vs district` : "No district benchmark";
      return `<tr data-id="${r.id}">
        <td><strong>${escapeHtml(r.project)}</strong><small>${escapeHtml(r.area)} sqm · ${escapeHtml(r.propertyType)}</small></td>
        <td>${escapeHtml(r.district)}<small>${escapeHtml(r.tenureGroup)}</small></td>
        <td>${fmtMoney(r.latestBuy)}</td><td>${fmtMoney(r.latestRent)}</td>
        <td><strong>${fmtPct(r.grossYield, 2)}</strong></td><td>${fmtYears(r.payback)}</td>
        <td class="${(r.districtYieldPremium || 0) >= 0 ? "signal-positive" : "signal-negative"}">${relative}</td>
        <td><span class="evidence-pill">${escapeHtml(r.evidenceGrade)}</span><small>${r.saleCount !== null ? `${r.saleCount} sales · ${r.rentCount || 0} rents` : `${r.pairedYears} paired years`}</small></td>
      </tr>`;
    }).join("") || '<tr><td colspan="8">No combinations meet the current screen.</td></tr>';
  }

  function drawValueScatter() {
    const canvas = $("#valueScatter"); if (!canvas || canvas.offsetParent === null) return;
    const wrap = canvas.parentElement; const cssWidth = Math.max(320, wrap.clientWidth); const cssHeight = Math.max(340, wrap.clientHeight);
    const dpr = window.devicePixelRatio || 1; canvas.width = cssWidth * dpr; canvas.height = cssHeight * dpr;
    canvas.style.width = `${cssWidth}px`; canvas.style.height = `${cssHeight}px`;
    const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr); ctx.clearRect(0, 0, cssWidth, cssHeight);
    const rows = state.valueRows;
    if (!rows.length) { ctx.fillStyle = css("--muted"); ctx.font = "14px sans-serif"; ctx.fillText("No records meet this screen.", 30, 50); return; }
    const margin = { left: 72, right: 24, top: 22, bottom: 52 };
    const maxX = Math.min(state.value.maxPrice, percentile(rows.map(r => r.latestBuy), .99) || state.value.maxPrice);
    const minX = Math.max(0, percentile(rows.map(r => r.latestBuy), .01) || 0);
    const minY = Math.max(0, Math.min(state.value.minYield, percentile(rows.map(r => r.grossYield), .01) || 0));
    const maxY = Math.max(minY + 1, percentile(rows.map(r => r.grossYield), .99) || 8);
    const x = value => margin.left + (clamp(value, minX, maxX) - minX) / (maxX - minX || 1) * (cssWidth - margin.left - margin.right);
    const y = value => margin.top + (maxY - clamp(value, minY, maxY)) / (maxY - minY || 1) * (cssHeight - margin.top - margin.bottom);
    ctx.strokeStyle = css("--line"); ctx.fillStyle = css("--muted"); ctx.font = "11px sans-serif"; ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const xv = minX + (maxX - minX) * i / 5; const xx = x(xv);
      ctx.beginPath(); ctx.moveTo(xx, margin.top); ctx.lineTo(xx, cssHeight - margin.bottom); ctx.stroke();
      ctx.textAlign = "center"; ctx.fillText(fmtMoney(xv, true).replace("S$", "$"), xx, cssHeight - 24);
    }
    for (let i = 0; i <= 4; i++) {
      const yv = minY + (maxY - minY) * i / 4; const yy = y(yv);
      ctx.beginPath(); ctx.moveTo(margin.left, yy); ctx.lineTo(cssWidth - margin.right, yy); ctx.stroke();
      ctx.textAlign = "right"; ctx.fillText(`${yv.toFixed(1)}%`, margin.left - 10, yy + 4);
    }
    ctx.fillStyle = css("--ink"); ctx.font = "600 11px sans-serif"; ctx.textAlign = "right"; ctx.fillText("Purchase price →", cssWidth - margin.right, cssHeight - 5);
    ctx.save(); ctx.translate(14, margin.top); ctx.rotate(-Math.PI / 2); ctx.textAlign = "right"; ctx.fillText("Gross yield →", 0, 0); ctx.restore();

    const plotRows = rows.length > 1800 ? rows.filter((_, index) => index % Math.ceil(rows.length / 1800) === 0) : rows;
    state.scatterPoints = [];
    plotRows.forEach(r => {
      if (r.latestBuy > maxX || r.grossYield > maxY) return;
      const px = x(r.latestBuy), py = y(r.grossYield);
      const depth = r.saleCount !== null ? Math.min(20, (r.saleCount || 0) + (r.rentCount || 0)) : r.pairedYears;
      const radius = clamp(2.5 + Math.sqrt(depth || 1) * 1.2, 3.2, 10);
      const positive = (r.districtYieldPremium || 0) >= 0;
      ctx.globalAlpha = evidenceRank(r.evidenceGrade) >= 3 ? .64 : .35;
      ctx.fillStyle = positive ? css("--green") : css("--copper");
      ctx.beginPath(); ctx.arc(px, py, radius, 0, Math.PI * 2); ctx.fill();
      state.scatterPoints.push({ x: px, y: py, radius: Math.max(radius, 7), record: r });
    });
    ctx.globalAlpha = 1;
    bindScatterEvents(canvas);
  }

  let scatterBound = false;
  function bindScatterEvents(canvas) {
    if (scatterBound) return; scatterBound = true;
    const tooltip = $("#scatterTooltip");
    canvas.addEventListener("mousemove", event => {
      const rect = canvas.getBoundingClientRect(); const x = event.clientX - rect.left, y = event.clientY - rect.top;
      const found = nearestScatterPoint(x, y);
      if (!found) { tooltip.hidden = true; return; }
      tooltip.innerHTML = `<strong>${escapeHtml(found.record.project)}</strong>${escapeHtml(found.record.area)} sqm · ${escapeHtml(found.record.district)}<br>${fmtMoney(found.record.latestBuy)} · ${fmtMoney(found.record.latestRent)}/mo<br><b>${fmtPct(found.record.grossYield, 2)} gross yield</b>`;
      tooltip.style.left = `${clamp(x + 14, 4, rect.width - 245)}px`; tooltip.style.top = `${clamp(y - 55, 4, rect.height - 110)}px`; tooltip.hidden = false;
    });
    canvas.addEventListener("mouseleave", () => { tooltip.hidden = true; });
    canvas.addEventListener("click", event => {
      const rect = canvas.getBoundingClientRect(); const found = nearestScatterPoint(event.clientX - rect.left, event.clientY - rect.top);
      if (found) openDetail(found.record);
    });
  }
  function nearestScatterPoint(x, y) {
    let best = null, distance = Infinity;
    state.scatterPoints.forEach(point => { const d = Math.hypot(point.x - x, point.y - y); if (d <= point.radius + 5 && d < distance) { distance = d; best = point; } });
    return best;
  }

  function openDetail(record) {
    state.selected = record;
    setText("#detailTitle", `${record.project} · ${record.area} sqm`);
    setText("#detailMeta", `${record.district} · ${record.propertyType} · ${record.tenure}`);
    $("#detailMetrics").innerHTML = [
      ["Observed buy", fmtMoney(record.latestBuy)], ["Observed rent", `${fmtMoney(record.latestRent)} / mo`],
      ["Gross yield", fmtPct(record.grossYield, 2)], ["Payback", fmtYears(record.payback)],
      ["Yield vs district", finite(record.districtYieldPremium) ? `${record.districtYieldPremium >= 0 ? "+" : ""}${record.districtYieldPremium.toFixed(2)} pts` : "—"],
      ["Price vs district", finite(record.districtPriceDiscount) ? (record.districtPriceDiscount >= 0 ? `${record.districtPriceDiscount.toFixed(1)}% below median` : `${(-record.districtPriceDiscount).toFixed(1)}% above median`) : "—"],
      ["Historical price", signedPct(record.priceGrowth)], ["Historical rent", signedPct(record.rentGrowth)],
    ].map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("");
    const firstPair = record.buy.findIndex((v, i) => finite(v) && finite(record.rent[i]));
    const baseBuy = firstPair >= 0 ? record.buy[firstPair] : null, baseRent = firstPair >= 0 ? record.rent[firstPair] : null;
    drawLineChart("detailChart", years, [
      { name: "Price", color: css("--green"), values: record.buy.map(v => finite(v) && baseBuy ? v / baseBuy * 100 : null) },
      { name: "Rent", color: css("--copper"), values: record.rent.map(v => finite(v) && baseRent ? v / baseRent * 100 : null) },
    ], { baseline: 100, yFormatter: v => v.toFixed(0) });
    setText("#detailCaveat", record.saleCount !== null ? `${record.saleCount} trailing-year sales and ${record.rentCount || 0} rental contracts. Latest observed dates: ${record.latestBuyDate || "unknown"} / ${record.latestRentDate || "unknown"}.` : `${record.evidenceGrade}: ${record.pairedYears} paired annual observations. Exact transaction counts and dates are unavailable in the historical aggregate.`);
    $("#propertyDetail").classList.add("is-open");
  }

  function bindUnderwriter() {
    const input = $("#uwPropertySearch"), suggestions = $("#uwSuggestions");
    input.addEventListener("input", () => {
      const query = input.value.trim().toUpperCase();
      if (query.length < 2) { suggestions.hidden = true; return; }
      const matches = pairedRecords.filter(r => `${r.project} ${r.area} ${r.district}`.toUpperCase().includes(query)).slice(0, 10);
      suggestions.innerHTML = matches.map(r => `<button type="button" class="suggestion" data-id="${r.id}">${escapeHtml(r.project)} · ${escapeHtml(r.area)} sqm<small>${escapeHtml(r.district)} · ${fmtPct(r.grossYield, 2)} gross yield</small></button>`).join("");
      suggestions.hidden = !matches.length;
    });
    suggestions.addEventListener("click", event => {
      const button = event.target.closest("button[data-id]"); if (!button) return;
      selectUnderwriterRecord(records[Number(button.dataset.id)]); suggestions.hidden = true;
    });
    document.addEventListener("click", event => { if (!event.target.closest(".property-picker")) suggestions.hidden = true; });
    $$("#underwriterForm input, #underwriterForm select").forEach(control => {
      if (control.id !== "uwPropertySearch") control.addEventListener("input", updateUnderwriter);
    });
  }

  function selectInitialUnderwriter() {
    const candidates = pairedRecords.filter(r => r.latestBuy <= 1600000 && r.grossYield >= 3.5 && evidenceRank(r.evidenceGrade) >= 3).sort((a, b) => b.grossYield - a.grossYield);
    selectUnderwriterRecord(candidates[Math.min(8, candidates.length - 1)] || pairedRecords[0]);
  }

  function selectUnderwriterRecord(record) {
    if (!record) return;
    state.underwriterRecord = record;
    $("#uwPropertySearch").value = `${record.project} · ${record.area} sqm`;
    setText("#uwSelectedProperty", `${record.district} · ${record.tenureGroup} · ${record.evidenceGrade}`);
    $("#uwPrice").value = Math.round(record.latestBuy || 1200000);
    $("#uwRent").value = Math.round(record.latestRent || 4200);
    updateUnderwriter();
  }

  function readNumber(id, fallback = 0) {
    const value = Number($(id).value); return Number.isFinite(value) ? value : fallback;
  }

  function buyerStampDuty(price) {
    const tiers = [[180000, .01], [180000, .02], [640000, .03], [500000, .04], [1500000, .05], [Infinity, .06]];
    let remaining = Math.max(0, price), duty = 0;
    tiers.forEach(([width, rate]) => { if (remaining <= 0) return; const taxable = Math.min(remaining, width); duty += taxable * rate; remaining -= taxable; });
    return Math.floor(duty);
  }

  function mortgagePayment(principal, annualRatePct, years) {
    if (principal <= 0 || years <= 0) return 0;
    const months = Math.round(years * 12), rate = annualRatePct / 100 / 12;
    if (rate === 0) return principal / months;
    return principal * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
  }

  function loanBalance(principal, annualRatePct, totalYears, paidYears) {
    if (principal <= 0) return 0;
    const n = totalYears * 12, p = Math.min(n, paidYears * 12), rate = annualRatePct / 100 / 12;
    if (rate === 0) return Math.max(0, principal * (1 - p / n));
    const payment = mortgagePayment(principal, annualRatePct, totalYears);
    return Math.max(0, principal * Math.pow(1 + rate, p) - payment * (Math.pow(1 + rate, p) - 1) / rate);
  }

  function sellerStampRate(holdingYears) {
    if (holdingYears <= 1) return .16;
    if (holdingYears <= 2) return .12;
    if (holdingYears <= 3) return .08;
    if (holdingYears < 4) return .04;
    return 0;
  }

  function computeModel(overrides = {}) {
    const price = overrides.price ?? readNumber("#uwPrice", 0);
    const monthlyRent = (overrides.rentFactor ?? 1) * readNumber("#uwRent", 0);
    const absdRate = readNumber("#buyerProfile", 0) / 100;
    const downPct = readNumber("#downPayment", 25) / 100;
    const renovation = readNumber("#renovation", 0), legal = readNumber("#legalCosts", 0);
    const interest = overrides.interest ?? readNumber("#interestRate", 0);
    const loanYears = readNumber("#loanYears", 25), vacancy = clamp(readNumber("#vacancyMonths", 1) + (overrides.vacancyAdd ?? 0), 0, 12);
    const maintenance = readNumber("#maintenance", 0) * 12, propertyTax = readNumber("#propertyTax", 0), insurance = readNumber("#insurance", 0);
    const repairsPct = readNumber("#repairsPct", 0) / 100, managementPct = readNumber("#managementPct", 0) / 100;
    const holdingYears = Math.round(readNumber("#holdingYears", 5)), appreciation = readNumber("#appreciation", 0) / 100;
    const rentGrowth = readNumber("#rentGrowthAssumption", 0) / 100, sellingPct = readNumber("#sellingCostPct", 0) / 100;
    const bsd = buyerStampDuty(price), absd = Math.floor(price * absdRate), loan = price * (1 - downPct);
    const mortgage = mortgagePayment(loan, interest, loanYears), annualDebt = mortgage * 12;
    const acquisitionBasis = price + bsd + absd + renovation + legal;
    const cashRequired = price * downPct + bsd + absd + renovation + legal;
    const annualOperating = rent => {
      const collected = rent * (12 - vacancy);
      const variable = collected * (repairsPct + managementPct);
      const costs = maintenance + propertyTax + insurance + variable;
      return { collected, costs, noi: collected - costs };
    };
    const year1 = annualOperating(monthlyRent);
    const grossYield = price ? monthlyRent * 12 / price * 100 : null;
    const netYield = acquisitionBasis ? year1.noi / acquisitionBasis * 100 : null;
    const annualCash = year1.noi - annualDebt;
    const cashOnCash = cashRequired ? annualCash / cashRequired * 100 : null;
    const variableShare = repairsPct + managementPct;
    const breakEvenRent = (annualDebt + maintenance + propertyTax + insurance) / Math.max(.01, (12 - vacancy) * (1 - variableShare));

    const cashflows = [-cashRequired];
    for (let year = 1; year <= holdingYears; year++) {
      const rent = monthlyRent * Math.pow(1 + rentGrowth, year - 1);
      let flow = annualOperating(rent).noi - annualDebt;
      if (year === holdingYears) {
        const sale = price * Math.pow(1 + appreciation, holdingYears);
        const balance = loanBalance(loan, interest, loanYears, holdingYears);
        const selling = sale * sellingPct, ssd = sale * sellerStampRate(holdingYears);
        flow += sale - balance - selling - ssd;
      }
      cashflows.push(flow);
    }
    const salePrice = price * Math.pow(1 + appreciation, holdingYears);
    const balance = loanBalance(loan, interest, loanYears, holdingYears);
    const sellingCosts = salePrice * sellingPct, ssd = salePrice * sellerStampRate(holdingYears);
    const exitEquity = salePrice - balance - sellingCosts - ssd;
    const netProfit = cashflows.reduce((sum, value) => sum + value, 0);
    const irrValue = irr(cashflows);
    return { price, monthlyRent, absdRate, bsd, absd, loan, mortgage, annualDebt, acquisitionBasis, cashRequired, grossYield, netYield, annualCash, cashOnCash, breakEvenRent, holdingYears, salePrice, balance, sellingCosts, ssd, exitEquity, netProfit, irr: irrValue, cashflows, vacancy, interest };
  }

  function irr(cashflows) {
    if (!cashflows.some(v => v < 0) || !cashflows.some(v => v > 0)) return null;
    const npv = rate => cashflows.reduce((sum, value, i) => sum + value / Math.pow(1 + rate, i), 0);
    let low = -.95, high = 5, fLow = npv(low), fHigh = npv(high);
    if (fLow * fHigh > 0) return null;
    for (let i = 0; i < 120; i++) {
      const mid = (low + high) / 2, fMid = npv(mid);
      if (Math.abs(fMid) < .01) return mid * 100;
      if (fLow * fMid <= 0) { high = mid; fHigh = fMid; } else { low = mid; fLow = fMid; }
    }
    return (low + high) / 2 * 100;
  }

  function updateUnderwriter() {
    const model = computeModel();
    const cashClass = model.annualCash >= 0 ? "signal-positive" : "signal-negative";
    const cashNode = $("#uwCashFlow"); cashNode.className = cashClass; cashNode.textContent = fmtMoney(model.annualCash);
    setText("#uwCashFlowMonthly", `${fmtMoney(model.annualCash / 12)} per month after modeled operating costs and debt service`);
    setText("#outCashRequired", fmtMoney(model.cashRequired, true)); setText("#outGrossYield", fmtPct(model.grossYield, 2));
    setText("#outNetYield", fmtPct(model.netYield, 2)); setText("#outCashOnCash", fmtPct(model.cashOnCash, 2));
    setText("#outMortgage", fmtMoney(model.mortgage)); setText("#outLoanAmount", `${fmtMoney(model.loan, true)} loan principal`);
    setText("#outBreakEvenRent", `${fmtMoney(model.breakEvenRent)} / mo`); setText("#outIrr", fmtPct(model.irr, 1));
    setText("#outHoldingLabel", `${model.holdingYears}-year modeled exit${model.ssd ? ` · ${fmtPct(sellerStampRate(model.holdingYears) * 100, 0)} SSD` : " · no modeled SSD"}`);
    setText("#outNetProfit", fmtMoney(model.netProfit, true)); setText("#outExitValue", `${fmtMoney(model.salePrice, true)} sale · ${fmtMoney(model.balance, true)} loan balance`);
    setText("#ledgerBsd", fmtMoney(model.bsd)); setText("#ledgerAbsd", fmtMoney(model.absd));
    setText("#ledgerSetup", fmtMoney(readNumber("#renovation") + readNumber("#legalCosts"))); setText("#ledgerLoan", fmtMoney(model.loan)); setText("#ledgerBasis", fmtMoney(model.acquisitionBasis));
    drawCashflowChart(model.cashflows);
    renderStressCards();
  }

  function drawCashflowChart(cashflows) {
    const svg = $("#cashflowChart"); if (!svg || svg.offsetParent === null) return;
    const width = Math.max(320, svg.clientWidth || 700), height = Math.max(230, svg.clientHeight || 330); svg.setAttribute("viewBox", `0 0 ${width} ${height}`); svg.innerHTML = "";
    const margin = { top: 22, right: 20, bottom: 42, left: 66 };
    const maxAbs = Math.max(...cashflows.map(Math.abs), 1), zeroY = margin.top + (height - margin.top - margin.bottom) * .52;
    const upSpace = zeroY - margin.top, downSpace = height - margin.bottom - zeroY;
    const barGap = 10, barW = Math.max(14, (width - margin.left - margin.right - barGap * cashflows.length) / cashflows.length);
    svg.appendChild(svgEl("line", { x1: margin.left, x2: width - margin.right, y1: zeroY, y2: zeroY, class: "axis-line" }));
    cashflows.forEach((value, index) => {
      const x = margin.left + index * ((width - margin.left - margin.right) / cashflows.length) + barGap / 2;
      const h = Math.abs(value) / maxAbs * (value >= 0 ? upSpace * .88 : downSpace * .88);
      const y = value >= 0 ? zeroY - h : zeroY;
      const rect = svgEl("rect", { x, y, width: barW, height: Math.max(1, h), fill: value >= 0 ? css("--green") : css("--red"), opacity: index === cashflows.length - 1 ? 1 : .74 });
      const title = svgEl("title"); title.textContent = `Year ${index}: ${fmtMoney(value)}`; rect.appendChild(title); svg.appendChild(rect);
      const label = svgEl("text", { x: x + barW / 2, y: height - 15, "text-anchor": "middle" }); label.textContent = index; svg.appendChild(label);
    });
    const label = svgEl("text", { x: margin.left, y: 12, class: "label-strong" }); label.textContent = "Cash inflow / (outflow)"; svg.appendChild(label);
  }

  function renderStressCards() {
    const baseInterest = readNumber("#interestRate", 0);
    const scenarios = [
      { name: "Base", model: computeModel(), note: "Current assumptions" },
      { name: "Mild stress", model: computeModel({ rentFactor: .95, vacancyAdd: 1, interest: baseInterest + 1 }), note: "Rent −5% · vacancy +1 month · rate +1 pt" },
      { name: "Severe stress", model: computeModel({ rentFactor: .90, vacancyAdd: 2, interest: baseInterest + 2 }), note: "Rent −10% · vacancy +2 months · rate +2 pts" },
    ];
    $("#stressCards").innerHTML = scenarios.map(item => `<article class="stress-card"><h4>${item.name}</h4><span>Annual cash flow</span><strong class="${item.model.annualCash >= 0 ? "signal-positive" : "signal-negative"}">${fmtMoney(item.model.annualCash)}</strong><p>${item.note}<br>Cash-on-cash ${fmtPct(item.model.cashOnCash, 2)}</p></article>`).join("");
  }

  function groupBy(values, keyFn) {
    const map = new Map(); values.forEach(value => { const key = keyFn(value); if (!map.has(key)) map.set(key, []); map.get(key).push(value); }); return map;
  }
  function css(variable) { return getComputedStyle(document.documentElement).getPropertyValue(variable).trim(); }
  function debounce(fn, wait) { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), wait); }; }

  initialise();
})();
