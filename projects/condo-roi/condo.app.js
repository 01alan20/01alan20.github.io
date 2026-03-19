// ---- Config ----
const CSV_PATH = "pmi_roi_agg.csv";
const PRICE_COLUMN = "most_recent_buy";

const COLS = {
  project: "project",
  area: "area_bucket",
  district: "district",
  tenure: "tenure",
  type: "propertyType",
  avgBuy: "avg_buy",
  recentBuy: "most_recent_buy",
  recentRent: "most_recent_rent",
  roi: "ROI"
};

// ---- State ----
let RAW = [];
let VIEW = [];
let sortKey = COLS.roi;
let sortDir = "desc";

// ---- Helpers ----
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function toNum(x) {
  if (x === null || x === undefined) return NaN;
  if (typeof x === "number") return x;
  const n = String(x).replace(/[, ]+/g, "");
  const v = Number(n);
  return Number.isFinite(v) ? v : NaN;
}

function fmtMoney(n) {
  if (!Number.isFinite(n)) return "-";
  return `S$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function fmtPercent(n) {
  if (!Number.isFinite(n)) return "-";
  return `${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}%`;
}

function unique(list, key) {
  const set = new Set();
  list.forEach((r) => {
    const val = (r[key] ?? "").toString().trim();
    if (val) set.add(val);
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

function roiClass(roi) {
  if (!Number.isFinite(roi)) return "roi-low";
  if (roi < 0) return "roi-negative";
  if (roi >= 25) return "roi-high";
  if (roi >= 12) return "roi-mid";
  return "roi-low";
}

function avgOf(rows, key) {
  const vals = rows.map((r) => toNum(r[key])).filter(Number.isFinite);
  if (!vals.length) return NaN;
  return vals.reduce((sum, v) => sum + v, 0) / vals.length;
}

function uniqueProjectCount(rows) {
  return new Set(rows.map((r) => String(r[COLS.project] ?? "").trim()).filter(Boolean)).size;
}

function headerLabel(key) {
  const labels = {
    [COLS.project]: "Project",
    [COLS.type]: "Property Type",
    [COLS.area]: "Area",
    [COLS.district]: "District",
    [COLS.tenure]: "Tenure",
    [COLS.recentBuy]: "Most Recent Buy",
    [COLS.recentRent]: "Most Recent Rent",
    [COLS.roi]: "ROI"
  };
  return labels[key] || key;
}

function districtLabel(value) {
  const n = toNum(value);
  return Number.isFinite(n) ? `District ${Math.round(n)}` : "-";
}

function syncSortState() {
  $$("thead th").forEach((h) => h.classList.remove("sorted-asc", "sorted-desc"));
  const active = $(`thead th[data-key="${sortKey}"]`);
  if (active) active.classList.add(sortDir === "asc" ? "sorted-asc" : "sorted-desc");
}

// ---- CSV Load ----
function loadCSV() {
  return new Promise((resolve, reject) => {
    Papa.parse(CSV_PATH, {
      header: true,
      download: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      complete: (res) => resolve(res.data),
      error: reject
    });
  });
}

// ---- UI Build ----
function buildDropdowns() {
  fillSelect("#propertyType", unique(RAW, COLS.type));
  fillSelect("#area", unique(RAW, COLS.area));
  fillSelect("#district", unique(RAW, COLS.district));
}

function fillSelect(selector, items) {
  const sel = $(selector);
  sel.innerHTML = '<option value="">All</option>' + items.map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("");
}

// ---- Filtering ----
function getFilters() {
  return {
    search: $("#projectSearch").value.trim().toLowerCase(),
    type: $("#propertyType").value.trim(),
    area: $("#area").value.trim(),
    district: $("#district").value.trim(),
    minPrice: toNum($("#minPrice").value),
    maxPrice: toNum($("#maxPrice").value),
    minRoi: toNum($("#minRoi").value)
  };
}

function applyFilters() {
  const f = getFilters();
  VIEW = RAW.filter((r) => {
    const project = String(r[COLS.project] ?? "").toLowerCase();
    if (f.search && !project.includes(f.search)) return false;
    if (f.type && r[COLS.type] !== f.type) return false;
    if (f.area && r[COLS.area] !== f.area) return false;
    if (f.district && r[COLS.district] !== f.district) return false;

    const price = toNum(r[PRICE_COLUMN]);
    if (Number.isFinite(f.minPrice) && !Number.isNaN(price) && price < f.minPrice) return false;
    if (Number.isFinite(f.maxPrice) && !Number.isNaN(price) && price > f.maxPrice) return false;

    const roi = toNum(r[COLS.roi]);
    if (Number.isFinite(f.minRoi) && !Number.isNaN(roi) && roi < f.minRoi) return false;

    return true;
  });

  applySort();
  renderTable();
  updateStatus();
}

function resetFilters() {
  $("#projectSearch").value = "";
  $("#propertyType").value = "";
  $("#area").value = "";
  $("#district").value = "";
  $("#minPrice").value = "";
  $("#maxPrice").value = "";
  $("#minRoi").value = "";
  applyFilters();
}

// ---- Sorting ----
function applySort() {
  const key = sortKey;
  const dir = sortDir === "asc" ? 1 : -1;

  VIEW.sort((a, b) => {
    const va = isNumericCol(key) ? toNum(a[key]) : String(a[key] ?? "");
    const vb = isNumericCol(key) ? toNum(b[key]) : String(b[key] ?? "");
    if (va < vb) return -1 * dir;
    if (va > vb) return 1 * dir;
    return 0;
  });
}

function isNumericCol(key) {
  return [COLS.recentBuy, COLS.recentRent, COLS.roi, COLS.avgBuy].includes(key);
}

function onHeaderClick(e) {
  const th = e.target.closest("th");
  if (!th) return;
  const key = th.dataset.key;
  if (!key) return;

  if (sortKey === key) {
    sortDir = sortDir === "asc" ? "desc" : "asc";
  } else {
    sortKey = key;
    sortDir = isNumericCol(key) ? "desc" : "asc";
  }

  syncSortState();
  applySort();
  renderTable();
  updateStatus();
}

// ---- Rendering ----
function renderTable() {
  const tb = $("#tableBody");
  const rows = VIEW.map((r) => {
    const area = escapeHtml(r[COLS.area] ?? "-");
    const price = fmtMoney(toNum(r[COLS.recentBuy]));
    const rent = fmtMoney(toNum(r[COLS.recentRent]));
    const roiValue = toNum(r[COLS.roi]);
    const roi = fmtPercent(roiValue);

    return `
      <tr>
        <td class="project-cell">
          <div class="project-name">${escapeHtml(r[COLS.project] ?? "")}</div>
          <div class="project-meta">${area} size band</div>
        </td>
        <td><span class="cell-pill type-pill">${escapeHtml(r[COLS.type] ?? "-")}</span></td>
        <td>${area}</td>
        <td>${escapeHtml(districtLabel(r[COLS.district]))}</td>
        <td><span class="cell-pill tenure-pill">${escapeHtml(r[COLS.tenure] ?? "-")}</span></td>
        <td class="num money">${price}</td>
        <td class="num money">${rent}</td>
        <td class="num"><span class="roi-badge ${roiClass(roiValue)}">${roi}</span></td>
      </tr>
    `;
  }).join("");

  tb.innerHTML = rows || `<tr><td colspan="8" class="empty-state">No results match the current filters.</td></tr>`;
}

function updateStatus() {
  const projectCount = uniqueProjectCount(VIEW);
  const avgRoi = avgOf(VIEW, COLS.roi);
  const avgBuy = avgOf(VIEW, COLS.recentBuy);
  const avgRent = avgOf(VIEW, COLS.recentRent);

  $("#rowCount").textContent = `${VIEW.length.toLocaleString()} row${VIEW.length === 1 ? "" : "s"}`;
  $("#projectCount").textContent = projectCount.toLocaleString();
  $("#avgRoi").textContent = Number.isFinite(avgRoi) ? fmtPercent(avgRoi) : "-";
  $("#avgBuy").textContent = Number.isFinite(avgBuy) ? fmtMoney(avgBuy) : "-";
  $("#avgRent").textContent = Number.isFinite(avgRent) ? fmtMoney(avgRent) : "-";
  $("#tableSummary").textContent =
    `Showing ${VIEW.length.toLocaleString()} row${VIEW.length === 1 ? "" : "s"} across ` +
    `${projectCount.toLocaleString()} project${projectCount === 1 ? "" : "s"}, sorted by ` +
    `${headerLabel(sortKey)} ${sortDir === "asc" ? "ascending" : "descending"}.`;
}

// ---- Download filtered CSV ----
function downloadFiltered() {
  if (!VIEW.length) {
    alert("Nothing to download.");
    return;
  }

  const cols = [
    COLS.project, COLS.type, COLS.area, COLS.district, COLS.tenure,
    COLS.recentBuy, COLS.recentRent, COLS.roi
  ];

  const data = VIEW.map((r) => {
    const obj = {};
    cols.forEach((c) => {
      obj[c] = r[c];
    });
    return obj;
  });

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "condo_roi_filtered.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---- Init ----
async function init() {
  try {
    RAW = await loadCSV();
    buildDropdowns();
    syncSortState();
    applyFilters();

    $("#projectSearch").addEventListener("input", debounce(applyFilters, 180));
    $("#propertyType").addEventListener("change", applyFilters);
    $("#area").addEventListener("change", applyFilters);
    $("#district").addEventListener("change", applyFilters);
    $("#minPrice").addEventListener("input", debounce(applyFilters, 180));
    $("#maxPrice").addEventListener("input", debounce(applyFilters, 180));
    $("#minRoi").addEventListener("input", debounce(applyFilters, 180));
    $("#resetBtn").addEventListener("click", resetFilters);
    $("#downloadBtn").addEventListener("click", downloadFiltered);
    $("#resultsTable thead").addEventListener("click", onHeaderClick);
  } catch (err) {
    console.error(err);
    alert("Failed to load CSV. Make sure pmi_roi_agg.csv is in the same folder.");
  }
}

function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), ms);
  };
}

document.addEventListener("DOMContentLoaded", init);
