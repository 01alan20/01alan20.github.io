// ---- Config ----
// CSV file path relative to this condo.index.html
const CSV_PATH = "pmi_roi_agg.csv";

// Which price column to filter on
const PRICE_COLUMN = "most_recent_buy";

// Columns expected in CSV (header names must match exactly)
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
let RAW = [];            // original rows (objects)
let VIEW = [];           // filtered/sorted rows
let sortKey = COLS.roi;  // default sort
let sortDir = "desc";    // 'asc' | 'desc'

// ---- Helpers ----
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function toNum(x){
  if (x === null || x === undefined) return NaN;
  if (typeof x === "number") return x;
  const n = String(x).replace(/[, ]+/g, "");
  const v = Number(n);
  return Number.isFinite(v) ? v : NaN;
}

function fmtMoney(n){
  if (!Number.isFinite(n)) return "";
  return n.toLocaleString(undefined, {maximumFractionDigits:0});
}

function fmtPercent(n){
  if (!Number.isFinite(n)) return "";
  return n.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
}

function unique(list, key){
  const set = new Set();
  list.forEach(r => {
    const val = (r[key] ?? "").toString().trim();
    if (val) set.add(val);
  });
  return Array.from(set).sort((a,b)=>a.localeCompare(b, undefined, {numeric:true}));
}

// ---- CSV Load ----
function loadCSV(){
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
function buildDropdowns(){
  const typeOpts = unique(RAW, COLS.type);
  const areaOpts = unique(RAW, COLS.area);
  const distOpts = unique(RAW, COLS.district);

  fillSelect("#propertyType", typeOpts);
  fillSelect("#area", areaOpts);
  fillSelect("#district", distOpts);
}

function fillSelect(selector, items){
  const sel = $(selector);
  sel.innerHTML = '<option value="">All</option>' + items.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("");
}

function escapeHtml(s){ return s.replace(/[&<>"']/g, m=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m])); }

// ---- Filtering ----
function getFilters(){
  return {
    type: $("#propertyType").value.trim(),
    area: $("#area").value.trim(),
    district: $("#district").value.trim(),
    minPrice: toNum($("#minPrice").value),
    maxPrice: toNum($("#maxPrice").value),
    minRoi: toNum($("#minRoi").value)
  };
}

function applyFilters(){
  const f = getFilters();
  VIEW = RAW.filter(r => {
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

function resetFilters(){
  $("#propertyType").value = "";
  $("#area").value = "";
  $("#district").value = "";
  $("#minPrice").value = "";
  $("#maxPrice").value = "";
  $("#minRoi").value = "";
  applyFilters();
}

// ---- Sorting ----
function applySort(){
  const key = sortKey;
  const dir = sortDir === "asc" ? 1 : -1;

  VIEW.sort((a,b)=>{
    const va = isNumericCol(key) ? toNum(a[key]) : String(a[key] ?? "");
    const vb = isNumericCol(key) ? toNum(b[key]) : String(b[key] ?? "");
    if (va < vb) return -1 * dir;
    if (va > vb) return  1 * dir;
    return 0;
  });
}

function isNumericCol(key){
  return [COLS.recentBuy, COLS.recentRent, COLS.roi, COLS.avgBuy].includes(key);
}

function onHeaderClick(e){
  const th = e.target.closest("th");
  if (!th) return;
  const key = th.dataset.key;
  if (!key) return;
  if (sortKey === key) {
    sortDir = (sortDir === "asc") ? "desc" : "asc";
  } else {
    sortKey = key;
    sortDir = isNumericCol(key) ? "desc" : "asc";
  }
  $$("thead th").forEach(h => h.classList.remove("sorted-asc","sorted-desc"));
  th.classList.add(sortDir === "asc" ? "sorted-asc" : "sorted-desc");
  applySort();
  renderTable();
}

// ---- Rendering ----
function renderTable(){
  const tb = $("#tableBody");
  const rows = VIEW.map(r => {
    const price = fmtMoney(toNum(r[COLS.recentBuy]));
    const rent  = fmtMoney(toNum(r[COLS.recentRent]));
    const roi   = fmtPercent(toNum(r[COLS.roi]));
    return `
      <tr>
        <td>${escapeHtml(r[COLS.project] ?? "")}</td>
        <td>${escapeHtml(r[COLS.type] ?? "")}</td>
        <td>${escapeHtml(r[COLS.area] ?? "")}</td>
        <td>${escapeHtml(r[COLS.district] ?? "")}</td>
        <td>${escapeHtml(r[COLS.tenure] ?? "")}</td>
        <td class="num">${price}</td>
        <td class="num">${rent}</td>
        <td class="num">${roi}</td>
      </tr>
    `;
  }).join("");
  tb.innerHTML = rows || `<tr><td colspan="8" class="muted" style="text-align:center">No results.</td></tr>`;
}

function updateStatus(){
  $("#rowCount").textContent = `${VIEW.length.toLocaleString()} row${VIEW.length===1?"":"s"}`;
  const rois = VIEW.map(r => toNum(r[COLS.roi])).filter(Number.isFinite);
  const avg = rois.length ? rois.reduce((a,b)=>a+b,0)/rois.length : NaN;
  $("#avgRoi").textContent = `Avg ROI: ${Number.isFinite(avg) ? fmtPercent(avg) : "–"}`;
}

// ---- Download filtered CSV ----
function downloadFiltered(){
  if (!VIEW.length) { alert("Nothing to download."); return; }
  const cols = [
    COLS.project, COLS.type, COLS.area, COLS.district, COLS.tenure,
    COLS.recentBuy, COLS.recentRent, COLS.roi
  ];
  const data = VIEW.map(r => {
    const obj = {};
    cols.forEach(c => obj[c] = r[c]);
    return obj;
  });
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
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
async function init(){
  try{
    RAW = await loadCSV();
    buildDropdowns();
    applyFilters();

    // Events
    $("#propertyType").addEventListener("change", applyFilters);
    $("#area").addEventListener("change", applyFilters);
    $("#district").addEventListener("change", applyFilters);
    $("#minPrice").addEventListener("input", debounce(applyFilters, 200));
    $("#maxPrice").addEventListener("input", debounce(applyFilters, 200));
    $("#minRoi").addEventListener("input", debounce(applyFilters, 200));
    $("#resetBtn").addEventListener("click", resetFilters);
    $("#downloadBtn").addEventListener("click", downloadFiltered);
    $("#resultsTable thead").addEventListener("click", onHeaderClick);
  } catch(err){
    console.error(err);
    alert("Failed to load CSV. Make sure pmi_roi_agg.csv is in the same folder.");
  }
}

function debounce(fn, ms){
  let t;
  return (...args)=>{
    clearTimeout(t);
    t = setTimeout(()=>fn.apply(this,args), ms);
  };
}

document.addEventListener("DOMContentLoaded", init);
