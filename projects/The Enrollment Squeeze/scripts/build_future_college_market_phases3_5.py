#!/usr/bin/env python3
"""Build Phases 3-5 of The Future College Market.

Inputs:
- Phase 1 WICHE state graduate projections
- Phase 2 county graduate allocations
- March 2024 College Scorecard elements snapshot (institution enrollment)
- April 2022 College Scorecard-derived finance snapshot (TUITFTE/INEXPFTE)

The financial output is a scenario proxy, not an audited institutional budget forecast.
"""
from __future__ import annotations

import csv
import json
import math
import os
import shutil
from collections import defaultdict
from pathlib import Path

import plotly.graph_objects as go
import plotly.io as pio

PROJECT = Path(__file__).resolve().parents[1]
DATA = PROJECT / "data"
SOURCES = PROJECT / "sources" / "raw" / "scorecard"
DASH = PROJECT / "dashboards"

PH1 = DATA / "phase1"
PH2 = DATA / "phase2"
PH3 = DATA / "phase3"
PH4 = DATA / "phase4"
PH5 = DATA / "phase5"
for p in [PH3, PH4, PH5, SOURCES, DASH]:
    p.mkdir(parents=True, exist_ok=True)

# --------------------------
# Assumptions
# --------------------------
COLLEGE_GOING = 0.628  # BLS, recent 2024 high school graduates enrolled in Oct 2024
FOUR_YEAR_SHARE = 2 / 3  # BLS: about 2 in 3 enrolled recent graduates attended 4-year colleges
LOW_COLLEGE_GOING = COLLEGE_GOING - 0.05
HIGH_COLLEGE_GOING = COLLEGE_GOING + 0.05
LOW_FOUR_YEAR_SHARE = FOUR_YEAR_SHARE - 0.05
HIGH_FOUR_YEAR_SHARE = FOUR_YEAR_SHARE + 0.05
COHORT_DIVISOR = 4.25
FTE_FACTOR = 0.85
VARIABLE_INSTRUCTIONAL_EXPENSE_SHARE = 0.30

SCOPE_STATE_WEIGHTS = {
    "National": 0.25,
    "Statewide": 0.60,
    "Regional": 0.85,
}

STATE_OUTLOOK = PH1 / "state_graduate_outlook_2026_2041.csv"
NATIONAL_OUTLOOK = PH1 / "national_graduate_outlook.csv"
COUNTY_OUTLOOK = PH2 / "county_graduate_projections_2026_2041.csv"
SCORECARD_NEW = SOURCES / "scorecard_elements_march_2024.csv"
SCORECARD_FIN = SOURCES / "scorecard_finance_snapshot_april_2022.csv"


def num(x, default=None):
    if x is None:
        return default
    s = str(x).strip()
    if s in {"", "NULL", "PrivacySuppressed", "NA", "N/A", "null"}:
        return default
    try:
        return float(s)
    except ValueError:
        return default


def integer(x, default=None):
    v = num(x, default)
    return int(v) if v is not None else default


def write_csv(path: Path, rows: list[dict], fields: list[str] | None = None):
    path.parent.mkdir(parents=True, exist_ok=True)
    if not rows:
        raise ValueError(f"No rows for {path}")
    if fields is None:
        fields = list(rows[0].keys())
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        w.writeheader()
        w.writerows(rows)


# --------------------------
# Load WICHE graduate outlook
# --------------------------
state_base_rows = []
with STATE_OUTLOOK.open(encoding="utf-8-sig", newline="") as f:
    for r in csv.DictReader(f):
        state_base_rows.append({
            "state": r["state"],
            "state_name": r["state_name"],
            "class_year": int(r["class_year"]),
            "projected_high_school_graduates": float(r["projected_high_school_graduates"]),
            "pct_change_from_2026": float(r["pct_change_from_2026"]),
        })

national_base = {}
with NATIONAL_OUTLOOK.open(encoding="utf-8-sig", newline="") as f:
    for r in csv.DictReader(f):
        national_base[int(r["class_year"])] = {
            "graduates": float(r["projected_high_school_graduates"]),
            "pct_change": float(r["pct_change_from_2026"]),
        }

state_change = {(r["state"], r["class_year"]): r["pct_change_from_2026"] for r in state_base_rows}
state_name = {r["state"]: r["state_name"] for r in state_base_rows}

# --------------------------
# Load institution snapshots
# --------------------------
new_by_id = {}
all_four_year = []
with SCORECARD_NEW.open(encoding="utf-8-sig", newline="") as f:
    for r in csv.DictReader(f):
        unitid = str(r.get("UNITID", "")).strip()
        if not unitid:
            continue
        new_by_id[unitid] = r
        control = integer(r.get("CONTROL"))
        preddeg = integer(r.get("PREDDEG"))
        ugds = num(r.get("UGDS"))
        if preddeg == 3 and control in {1, 2} and ugds is not None and ugds > 0:
            all_four_year.append(r)

fin_by_id = {}
with SCORECARD_FIN.open(encoding="utf-8-sig", newline="") as f:
    for r in csv.DictReader(f):
        fin_by_id[str(r["id"]).strip()] = r

# Current four-year enrollment by institutional location
state_current_ugds = defaultdict(float)
state_inst_count = defaultdict(int)
for r in all_four_year:
    state_current_ugds[r["STABBR"]] += float(r["UGDS"])
    state_inst_count[r["STABBR"]] += 1

# --------------------------
# Phase 3: state market demand
# --------------------------
state_market = []
for r in state_base_rows:
    grads = r["projected_high_school_graduates"]
    year = r["class_year"]
    likely_college = grads * COLLEGE_GOING
    likely_four = likely_college * FOUR_YEAR_SHARE
    low_four = grads * LOW_COLLEGE_GOING * LOW_FOUR_YEAR_SHARE
    high_four = grads * HIGH_COLLEGE_GOING * HIGH_FOUR_YEAR_SHARE
    ugds = state_current_ugds.get(r["state"], 0.0)
    annual_capacity = ugds / COHORT_DIVISOR if ugds else 0.0
    coverage = likely_four / annual_capacity if annual_capacity else None
    state_market.append({
        "state": r["state"],
        "state_name": r["state_name"],
        "class_year": year,
        "projected_high_school_graduates": round(grads, 3),
        "pct_change_from_2026": r["pct_change_from_2026"],
        "college_going_rate_assumption": COLLEGE_GOING,
        "likely_college_entrants": round(likely_college, 3),
        "four_year_share_assumption": FOUR_YEAR_SHARE,
        "likely_four_year_entrants": round(likely_four, 3),
        "likely_four_year_entrants_low": round(low_four, 3),
        "likely_four_year_entrants_high": round(high_four, 3),
        "current_four_year_undergraduate_enrollment": round(ugds, 3),
        "four_year_institution_count": state_inst_count.get(r["state"], 0),
        "annual_new_student_capacity_proxy": round(annual_capacity, 3),
        "local_pool_coverage_proxy": round(coverage, 6) if coverage is not None else None,
        "coverage_interpretation": (
            "Below 1.0 implies the projected local four-year entrant pool is smaller than the state's current annualized undergraduate scale; imported, transfer, adult, or increased participation demand is required."
        ),
    })
write_csv(PH3 / "state_college_market_2026_2041.csv", state_market)

national_market = []
for year in sorted(national_base):
    grads = national_base[year]["graduates"]
    national_market.append({
        "class_year": year,
        "projected_high_school_graduates": round(grads, 3),
        "likely_college_entrants": round(grads * COLLEGE_GOING, 3),
        "likely_four_year_entrants": round(grads * COLLEGE_GOING * FOUR_YEAR_SHARE, 3),
        "likely_four_year_entrants_low": round(grads * LOW_COLLEGE_GOING * LOW_FOUR_YEAR_SHARE, 3),
        "likely_four_year_entrants_high": round(grads * HIGH_COLLEGE_GOING * HIGH_FOUR_YEAR_SHARE, 3),
        "pct_change_from_2026": national_base[year]["pct_change"],
    })
write_csv(PH3 / "national_college_market_2026_2041.csv", national_market)

county_market = []
with COUNTY_OUTLOOK.open(encoding="utf-8-sig", newline="") as f:
    for r in csv.DictReader(f):
        grads = float(r["projected_high_school_graduates"])
        county_market.append({
            "county_fips": r["county_fips"],
            "state": r["state"],
            "state_name": r["state_name"],
            "county_name": r["county_name"],
            "class_year": int(r["class_year"]),
            "projected_high_school_graduates": round(grads, 3),
            "likely_college_entrants": round(grads * COLLEGE_GOING, 3),
            "likely_four_year_entrants": round(grads * COLLEGE_GOING * FOUR_YEAR_SHARE, 3),
            "likely_four_year_entrants_low": round(grads * LOW_COLLEGE_GOING * LOW_FOUR_YEAR_SHARE, 3),
            "likely_four_year_entrants_high": round(grads * HIGH_COLLEGE_GOING * HIGH_FOUR_YEAR_SHARE, 3),
            "demographic_confidence": r["confidence"],
            "county_share_of_state_pool": r["county_share_of_state_pool"],
        })
write_csv(PH3 / "county_college_market_2026_2041.csv", county_market)

# --------------------------
# Phase 4: institution exposure
# --------------------------
def classify_scope(ugds, admission, control):
    if (admission is not None and admission <= 0.35) or ugds >= 25000:
        return "National", "Admission rate <=35% or undergraduate enrollment >=25,000"
    if ugds >= 8000 or (control == 1 and ugds >= 5000):
        return "Statewide", "Large institution or mid-sized public institution"
    return "Regional", "Smaller institution; local/state market assumed to dominate"

institution_base = []
for nr in all_four_year:
    uid = str(nr["UNITID"])
    fr = fin_by_id.get(uid)
    ugds = float(nr["UGDS"])
    control = int(float(nr["CONTROL"]))
    admission = num(fr.get("admission_rate.overall")) if fr else None
    scope, reason = classify_scope(ugds, admission, control)
    institution_base.append({
        "unitid": uid,
        "institution_name": nr["INSTNM"],
        "city": nr.get("CITY", ""),
        "state": nr["STABBR"],
        "control": control,
        "control_label": {1: "Public", 2: "Private nonprofit"}.get(control, "Other"),
        "current_undergraduate_enrollment": ugds,
        "admission_rate": admission,
        "market_scope_proxy": scope,
        "scope_reason": reason,
        "state_weight": SCOPE_STATE_WEIGHTS[scope],
        "national_weight": 1 - SCOPE_STATE_WEIGHTS[scope],
        "latitude": num(fr.get("lat")) if fr else None,
        "longitude": num(fr.get("lon")) if fr else None,
        "has_finance_snapshot": bool(fr),
        "tuition_revenue_per_fte": num(fr.get("tuition_revenue_per_fte")) if fr else None,
        "instructional_expenditure_per_fte": num(fr.get("instructional_expenditure_per_fte")) if fr else None,
        "retention_rate_full_time": num(fr.get("retention_rate.four_year.full_time")) if fr else None,
    })

exposure_rows = []
for base in institution_base:
    for year in [2030, 2035, 2041]:
        st_change = state_change.get((base["state"], year), national_base[year]["pct_change"])
        nat_change = national_base[year]["pct_change"]
        market_change = base["state_weight"] * st_change + base["national_weight"] * nat_change
        projected = base["current_undergraduate_enrollment"] * (1 + market_change)
        exposure_rows.append({
            **base,
            "projection_year": year,
            "state_graduate_pool_change": st_change,
            "national_graduate_pool_change": nat_change,
            "blended_market_change": market_change,
            "projected_undergraduate_enrollment": round(projected, 3),
            "projected_undergraduate_change": round(projected - base["current_undergraduate_enrollment"], 3),
            "model_statement": "Constant institutional market share within a blended state/national recruitment market.",
        })
write_csv(PH4 / "institution_market_exposure_2030_2041.csv", exposure_rows)

# State summary of institutional exposure
state_exposure = defaultdict(lambda: {"current": 0.0, "projected": 0.0, "institutions": 0})
for r in exposure_rows:
    key = (r["state"], r["projection_year"])
    state_exposure[key]["current"] += r["current_undergraduate_enrollment"]
    state_exposure[key]["projected"] += r["projected_undergraduate_enrollment"]
    state_exposure[key]["institutions"] += 1
state_exposure_rows = []
for (st, year), x in sorted(state_exposure.items()):
    state_exposure_rows.append({
        "state": st,
        "state_name": state_name.get(st, st),
        "projection_year": year,
        "institution_count": x["institutions"],
        "current_undergraduate_enrollment": round(x["current"], 3),
        "projected_undergraduate_enrollment": round(x["projected"], 3),
        "projected_change": round(x["projected"] - x["current"], 3),
        "projected_pct_change": (x["projected"] / x["current"] - 1) if x["current"] else None,
    })
write_csv(PH4 / "state_institution_exposure_2030_2041.csv", state_exposure_rows)

# --------------------------
# Phase 5: financial pressure proxy
# --------------------------
budget_rows = []
for r in exposure_rows:
    tuit = r["tuition_revenue_per_fte"]
    inexp = r["instructional_expenditure_per_fte"]
    if tuit is None or inexp is None:
        continue
    current_fte = r["current_undergraduate_enrollment"] * FTE_FACTOR
    projected_fte = r["projected_undergraduate_enrollment"] * FTE_FACTOR
    fte_change = projected_fte - current_fte
    tuition_change = fte_change * tuit
    adjustable_expense_change = fte_change * inexp * VARIABLE_INSTRUCTIONAL_EXPENSE_SHARE
    net_operating_impact = tuition_change - adjustable_expense_change
    funding_gap = max(0.0, -net_operating_impact)
    baseline_tuition_proxy = current_fte * tuit
    baseline_instruction_proxy = current_fte * inexp
    contribution_per_fte = tuit - inexp * VARIABLE_INSTRUCTIONAL_EXPENSE_SHARE
    students_to_close = funding_gap / (FTE_FACTOR * contribution_per_fte) if funding_gap > 0 and contribution_per_fte > 0 else 0.0
    tuition_increase_pct = funding_gap / baseline_tuition_proxy if baseline_tuition_proxy > 0 else None
    gap_pct = funding_gap / baseline_tuition_proxy if baseline_tuition_proxy else 0.0
    if gap_pct >= 0.10:
        risk = "Severe"
    elif gap_pct >= 0.05:
        risk = "High"
    elif gap_pct >= 0.02:
        risk = "Moderate"
    else:
        risk = "Low"
    budget_rows.append({
        "unitid": r["unitid"],
        "institution_name": r["institution_name"],
        "city": r["city"],
        "state": r["state"],
        "control_label": r["control_label"],
        "market_scope_proxy": r["market_scope_proxy"],
        "projection_year": r["projection_year"],
        "current_undergraduate_enrollment": r["current_undergraduate_enrollment"],
        "projected_undergraduate_enrollment": r["projected_undergraduate_enrollment"],
        "projected_undergraduate_change": r["projected_undergraduate_change"],
        "blended_market_change": r["blended_market_change"],
        "fte_factor_assumption": FTE_FACTOR,
        "current_undergraduate_fte_proxy": round(current_fte, 3),
        "projected_undergraduate_fte_proxy": round(projected_fte, 3),
        "fte_change": round(fte_change, 3),
        "net_tuition_revenue_per_fte": tuit,
        "instructional_expenditure_per_fte": inexp,
        "variable_instructional_expense_share": VARIABLE_INSTRUCTIONAL_EXPENSE_SHARE,
        "baseline_undergraduate_tuition_revenue_proxy": round(baseline_tuition_proxy, 3),
        "baseline_undergraduate_instructional_expense_proxy": round(baseline_instruction_proxy, 3),
        "annual_tuition_revenue_change": round(tuition_change, 3),
        "annual_adjustable_instructional_expense_change": round(adjustable_expense_change, 3),
        "annual_net_operating_impact_proxy": round(net_operating_impact, 3),
        "annual_funding_gap_proxy": round(funding_gap, 3),
        "funding_gap_pct_of_tuition_proxy": gap_pct,
        "additional_students_to_close_gap": round(students_to_close, 3),
        "tuition_increase_pct_to_close_gap": tuition_increase_pct,
        "risk_band": risk,
        "latitude": r["latitude"],
        "longitude": r["longitude"],
        "finance_data_vintage": "April 2022 Scorecard-derived snapshot",
        "enrollment_data_vintage": "March 2024 Scorecard elements snapshot",
        "limitation": "Budget proxy covers modeled undergraduate net tuition contribution and adjustable instructional expense only; it is not total institutional revenue, expense, cash flow, or an audited budget forecast.",
    })
write_csv(PH5 / "institution_budget_pressure_2030_2041.csv", budget_rows)

# Aggregated budget pressure by state/year
budget_state = defaultdict(lambda: {"gap": 0.0, "impact": 0.0, "tuition": 0.0, "current": 0.0, "projected": 0.0, "n": 0})
for r in budget_rows:
    k = (r["state"], r["projection_year"])
    x = budget_state[k]
    x["gap"] += r["annual_funding_gap_proxy"]
    x["impact"] += r["annual_net_operating_impact_proxy"]
    x["tuition"] += r["baseline_undergraduate_tuition_revenue_proxy"]
    x["current"] += r["current_undergraduate_enrollment"]
    x["projected"] += r["projected_undergraduate_enrollment"]
    x["n"] += 1
budget_state_rows = []
for (st, year), x in sorted(budget_state.items()):
    budget_state_rows.append({
        "state": st,
        "state_name": state_name.get(st, st),
        "projection_year": year,
        "institutions_with_finance_data": x["n"],
        "current_undergraduate_enrollment": round(x["current"], 3),
        "projected_undergraduate_enrollment": round(x["projected"], 3),
        "annual_net_operating_impact_proxy": round(x["impact"], 3),
        "annual_funding_gap_proxy": round(x["gap"], 3),
        "baseline_undergraduate_tuition_revenue_proxy": round(x["tuition"], 3),
        "funding_gap_pct_of_tuition_proxy": x["gap"] / x["tuition"] if x["tuition"] else None,
    })
write_csv(PH5 / "state_budget_pressure_2030_2041.csv", budget_state_rows)

# --------------------------
# Dashboard
# --------------------------
# National market trend
fig_nat = go.Figure()
fig_nat.add_trace(go.Scatter(
    x=[r["class_year"] for r in national_market],
    y=[r["projected_high_school_graduates"] for r in national_market],
    mode="lines+markers", name="High school graduates"))
fig_nat.add_trace(go.Scatter(
    x=[r["class_year"] for r in national_market],
    y=[r["likely_college_entrants"] for r in national_market],
    mode="lines+markers", name="Likely college entrants"))
fig_nat.add_trace(go.Scatter(
    x=[r["class_year"] for r in national_market],
    y=[r["likely_four_year_entrants"] for r in national_market],
    mode="lines+markers", name="Likely four-year entrants"))
fig_nat.update_layout(
    title="National Student Market: Central Scenario",
    xaxis_title="Graduating class", yaxis_title="Students",
    height=430, legend={"orientation": "h", "y": -0.2},
    margin={"l": 70, "r": 25, "t": 65, "b": 90})

# State change map dropdown
future_years = [2030, 2035, 2041]
fig_state = go.Figure()
for i, year in enumerate(future_years):
    rows = [r for r in state_market if r["class_year"] == year]
    fig_state.add_trace(go.Choropleth(
        locations=[r["state"] for r in rows],
        z=[100 * r["pct_change_from_2026"] for r in rows],
        locationmode="USA-states",
        text=[
            f"{r['state_name']}<br>Projected four-year entrants: {r['likely_four_year_entrants']:,.0f}"
            f"<br>Change from 2026: {r['pct_change_from_2026']:+.1%}"
            f"<br>Local pool coverage proxy: {r['local_pool_coverage_proxy']:.2f}x" if r["local_pool_coverage_proxy"] is not None else r["state_name"]
            for r in rows],
        hoverinfo="text", visible=(i == 0), colorbar_title="% change"))
buttons = []
for i, year in enumerate(future_years):
    vis = [False] * len(future_years); vis[i] = True
    buttons.append({"label": str(year), "method": "update", "args": [{"visible": vis}, {"title": f"Change in Four-Year Entrant Pool: 2026 to {year}"}]})
fig_state.update_layout(
    title="Change in Four-Year Entrant Pool: 2026 to 2030",
    geo={"scope": "usa"}, height=560,
    updatemenus=[{"buttons": buttons, "direction": "down", "x": 0.02, "y": 1.10}],
    margin={"l": 10, "r": 10, "t": 75, "b": 10})

# Institution budget pressure map, 2035
budget_2035 = [r for r in budget_rows if r["projection_year"] == 2035 and r["latitude"] is not None and r["longitude"] is not None]
max_ugds = max((r["current_undergraduate_enrollment"] for r in budget_2035), default=1)
fig_inst = go.Figure(go.Scattergeo(
    lon=[r["longitude"] for r in budget_2035],
    lat=[r["latitude"] for r in budget_2035],
    text=[
        f"{r['institution_name']} ({r['state']})<br>Market change: {r['blended_market_change']:+.1%}"
        f"<br>Projected enrollment change: {r['projected_undergraduate_change']:,.0f}"
        f"<br>Annual funding gap proxy: ${r['annual_funding_gap_proxy']:,.0f}"
        f"<br>Risk: {r['risk_band']}" for r in budget_2035],
    hoverinfo="text",
    mode="markers",
    marker={
        "size": [max(4, 5 + 20 * math.sqrt(r["current_undergraduate_enrollment"] / max_ugds)) for r in budget_2035],
        "color": [100 * r["funding_gap_pct_of_tuition_proxy"] for r in budget_2035],
        "colorbar": {"title": "Gap % of tuition proxy"},
        "opacity": 0.72,
    }
))
fig_inst.update_layout(
    title="Institution Financial Pressure Proxy — 2035 Central Scenario",
    geo={"scope": "usa", "showland": True}, height=600,
    margin={"l": 10, "r": 10, "t": 70, "b": 10})

# Top 30 pressure table 2035
top_2035 = sorted(budget_2035, key=lambda r: r["annual_funding_gap_proxy"], reverse=True)[:30]
fig_table = go.Figure(data=[go.Table(
    header={"values": ["Institution", "State", "Scope", "Market change", "Enrollment change", "Annual gap proxy", "Risk"]},
    cells={"values": [
        [r["institution_name"] for r in top_2035],
        [r["state"] for r in top_2035],
        [r["market_scope_proxy"] for r in top_2035],
        [f"{r['blended_market_change']:+.1%}" for r in top_2035],
        [f"{r['projected_undergraduate_change']:,.0f}" for r in top_2035],
        [f"${r['annual_funding_gap_proxy']:,.0f}" for r in top_2035],
        [r["risk_band"] for r in top_2035],
    ]}
)])
fig_table.update_layout(title="Largest Modeled Annual Funding Gaps — 2035", height=800, margin={"l": 10, "r": 10, "t": 60, "b": 10})

parts = [
    pio.to_html(fig_nat, full_html=False, include_plotlyjs=True),
    pio.to_html(fig_state, full_html=False, include_plotlyjs=False),
    pio.to_html(fig_inst, full_html=False, include_plotlyjs=False),
    pio.to_html(fig_table, full_html=False, include_plotlyjs=False),
]
html = f"""<!doctype html>
<html><head><meta charset='utf-8'><title>The Future College Market</title>
<style>
body{{font-family:Arial,Helvetica,sans-serif;max-width:1400px;margin:0 auto;padding:24px;color:#202124;background:#fff}}
h1{{margin-bottom:4px}} .sub{{color:#5f6368;margin-top:0}} .note{{background:#f5f5f5;border-left:4px solid #555;padding:14px 18px;margin:18px 0 26px;line-height:1.45}}
.chart{{margin:20px 0 36px}} .kpis{{display:grid;grid-template-columns:repeat(4,minmax(180px,1fr));gap:12px;margin:18px 0}}
.kpi{{border:1px solid #ddd;border-radius:8px;padding:14px}} .kpi b{{display:block;font-size:22px;margin-top:5px}}
@media(max-width:850px){{.kpis{{grid-template-columns:1fr 1fr}}}}
</style></head><body>
<h1>The Future College Market</h1><p class='sub'>Demographic demand, institutional exposure and financial pressure scenarios</p>
<div class='note'><b>Interpretation:</b> This is a scenario model, not an enrollment guarantee or audited budget forecast. WICHE controls the future high-school graduate totals. The central scenario assumes 62.8% immediate college enrollment and two-thirds of enrolled recent graduates attending four-year colleges. Institutional exposure assumes constant market share within a heuristic blend of state and national markets. Finance uses older per-FTE proxies.</div>
<div class='kpis'>
<div class='kpi'>2026 four-year entrants<b>{national_market[0]['likely_four_year_entrants']:,.0f}</b></div>
<div class='kpi'>2041 four-year entrants<b>{national_market[-1]['likely_four_year_entrants']:,.0f}</b></div>
<div class='kpi'>National change by 2041<b>{national_market[-1]['pct_change_from_2026']:+.1%}</b></div>
<div class='kpi'>Institutions with finance proxy<b>{len(set(r['unitid'] for r in budget_rows)):,}</b></div>
</div>
<div class='chart'>{parts[0]}</div><div class='chart'>{parts[1]}</div><div class='chart'>{parts[2]}</div><div class='chart'>{parts[3]}</div>
</body></html>"""
(DASH / "future_college_market_dashboard.html").write_text(html, encoding="utf-8")

# --------------------------
# Methodology / data dictionary / manifests
# --------------------------
method = f"""# Methodology — Phases 3–5

## Scope

This build estimates future higher-education market demand and a simplified institutional financial-pressure scenario. It deliberately replaces the more complicated county-by-grade school survival model with a transparent market model.

## Phase 3: market demand

WICHE projected high-school graduates are the demographic control totals for 2026, 2030, 2035 and 2041. County allocations come from the Phase 2 Census age-cohort model.

Central assumptions:

- Immediate college-going rate: **{COLLEGE_GOING:.1%}**
- Four-year share of enrolled recent high-school graduates: **{FOUR_YEAR_SHARE:.1%}**
- Low scenario: {LOW_COLLEGE_GOING:.1%} college-going and {LOW_FOUR_YEAR_SHARE:.1%} four-year share
- High scenario: {HIGH_COLLEGE_GOING:.1%} college-going and {HIGH_FOUR_YEAR_SHARE:.1%} four-year share

Formula:

`Likely four-year entrants = projected high-school graduates × college-going rate × four-year share`

The national assumptions are applied uniformly across states and counties. Therefore, the percentage change in estimated entrants is driven by the graduate projection. The scenario adds interpretable market size, not state-specific behavioral precision.

## Current enrollment and local-pool coverage

March 2024 College Scorecard elements provide undergraduate enrollment for public and private nonprofit bachelor's-degree institutions. A rough annual capacity proxy divides current undergraduate enrollment by {COHORT_DIVISOR:.2f}. This is not actual freshman enrollment and includes transfer, adult, international and other students.

`Local pool coverage proxy = likely local four-year entrants / annualized undergraduate capacity proxy`

A value below 1.0 indicates that the current institutional footprint cannot be supported solely by the modeled local immediate four-year entrant pool. This can be normal for states that import students or enroll many transfer/adult learners.

## Phase 4: institutional exposure

Institutional recruitment scope is a heuristic:

- National: admission rate <=35% or undergraduate enrollment >=25,000
- Statewide: enrollment >=8,000, or public enrollment >=5,000
- Regional: all other included institutions

State weights are {SCOPE_STATE_WEIGHTS['National']:.0%}, {SCOPE_STATE_WEIGHTS['Statewide']:.0%}, and {SCOPE_STATE_WEIGHTS['Regional']:.0%}, respectively. The remaining weight is assigned to the national graduate market.

`Blended market change = state weight × state graduate change + national weight × national graduate change`

The base model holds institutional market share constant. It does not model reputation changes, program mix, pricing, recruitment investment, international enrollment, closures, mergers or competitors' actions.

## Phase 5: financial pressure

The finance proxy uses April 2022 Scorecard-derived `tuition_revenue_per_fte` and `instructional_expenditure_per_fte`, joined to March 2024 undergraduate enrollment where available.

Assumptions:

- Undergraduate headcount-to-FTE factor: {FTE_FACTOR:.0%}
- Adjustable share of instructional expenditure: {VARIABLE_INSTRUCTIONAL_EXPENSE_SHARE:.0%}

`Tuition revenue change = change in modeled FTE × net tuition revenue per FTE`

`Adjustable instructional expense change = change in modeled FTE × instructional expenditure per FTE × variable share`

`Net operating impact proxy = tuition revenue change − adjustable expense change`

`Funding gap proxy = max(0, −net operating impact proxy)`

This is not total revenue or expense. It excludes appropriations, gifts, grants, auxiliary operations, hospitals, debt service, investment returns, graduate enrollment and many fixed costs. It should be used to compare exposure, not as an official budget requirement.

## Data vintage limitation

The official College Scorecard was updated June 10, 2026, but this build uses a March 2024 Scorecard elements snapshot for enrollment and an April 2022 processed Scorecard snapshot for per-FTE finance because those were the machine-readable files available to this build environment. The dashboard and files state those vintages explicitly.
"""
(PROJECT / "METHODOLOGY_PHASE3_5.md").write_text(method, encoding="utf-8")

# preserve previous README
old_readme = PROJECT / "README_PHASE2.md"
if not old_readme.exists() and (PROJECT / "README.md").exists():
    shutil.copy2(PROJECT / "README.md", old_readme)

# Findings
nat_2041 = next(r for r in national_market if r["class_year"] == 2041)
state_2041 = sorted([r for r in state_market if r["class_year"] == 2041], key=lambda x: x["pct_change_from_2026"])
top_gap_2035 = sorted([r for r in budget_rows if r["projection_year"] == 2035], key=lambda x: x["annual_funding_gap_proxy"], reverse=True)[:10]
readme = f"""# The Future College Market

## Current cumulative build: Phases 1–5

This package now contains the original demographic work plus a simplified higher-education market and finance model.

## Headline central scenario

- 2026 estimated four-year entrants: **{national_market[0]['likely_four_year_entrants']:,.0f}**
- 2041 estimated four-year entrants: **{nat_2041['likely_four_year_entrants']:,.0f}**
- National change by 2041: **{nat_2041['pct_change_from_2026']:+.1%}**
- Institutions modeled for market exposure: **{len(institution_base):,}**
- Institutions with observed finance proxies: **{len(set(r['unitid'] for r in budget_rows)):,}**

## What is new

- State and county estimates of likely college and four-year entrants
- State comparison of future local demand against current four-year undergraduate scale
- Institution-level 2030, 2035 and 2041 market exposure
- Institutional annual net-tuition and instructional-expense pressure proxies
- Interactive dashboard
- Scenario financial-model workbook

## Largest projected state graduate-pool contractions by 2041

{chr(10).join(f"- {r['state_name']}: {r['pct_change_from_2026']:+.1%}" for r in state_2041[:10])}

## Largest modeled annual institution gaps in 2035

These figures are scenario proxies and should not be treated as official institutional deficits.

{chr(10).join(f"- {r['institution_name']} ({r['state']}): ${r['annual_funding_gap_proxy']:,.0f}" for r in top_gap_2035)}

## Folder guide

- `data/phase1/` — state demographic projections and early validation
- `data/phase2/` — county demographic allocations
- `data/phase3/` — college-going and four-year entrant market estimates
- `data/phase4/` — institutional market exposure
- `data/phase5/` — financial-pressure proxy
- `dashboards/` — interactive HTML dashboards
- `financial_model/` — editable Excel scenario model
- `sources/` — source files and manifests
- `scripts/` — reproducible build scripts

## Critical limitation

The official College Scorecard is newer than the institutional snapshots used here. Enrollment is from a March 2024 elements file; finance proxies are from an April 2022 processed file. The WICHE and Census demographic sources are more current. See `METHODOLOGY_PHASE3_5.md`.
"""
(PROJECT / "README.md").write_text(readme, encoding="utf-8")

source_manifest = [
    {"source": "WICHE Knocking at the College Door, 11th Edition", "use": "State high-school graduate projections", "vintage": "11th edition; projections through 2041", "url": "https://www.wiche.edu/knocking/data/", "local_location": "sources/raw/wiche/wiche_knocking_11th.xlsx"},
    {"source": "U.S. Census Bureau Vintage 2025 county single-year age estimates", "use": "County allocation of future graduate cohorts", "vintage": "2020-2025", "url": "https://www.census.gov/data/tables/time-series/demo/popest/2020s-counties-detail.html", "local_location": "sources/raw/census_single_age/"},
    {"source": "BLS College Enrollment and Work Activity of Recent High School and College Graduates", "use": "62.8% college-going assumption and approximately two-thirds four-year share", "vintage": "October 2024 outcomes; released April 22, 2025", "url": "https://www.bls.gov/news.release/hsgec.htm", "local_location": "External source; assumptions documented in outputs"},
    {"source": "College Scorecard elements snapshot", "use": "Institution location, control and undergraduate enrollment", "vintage": "Dataset mirror updated March 25, 2024", "url": "https://catalog.data.gov/dataset/most-recent-cohorts-scorecard-elements", "local_location": "sources/raw/scorecard/scorecard_elements_march_2024.csv"},
    {"source": "Processed College Scorecard institution snapshot", "use": "Net tuition revenue per FTE, instructional expenditure per FTE and admission rate", "vintage": "Source file dated April 20, 2022", "url": "https://github.com/LastMileNow/opendata", "local_location": "sources/raw/scorecard/scorecard_finance_snapshot_april_2022.csv"},
    {"source": "Official College Scorecard Data Home", "use": "Current-release reference and variable documentation", "vintage": "Updated June 10, 2026", "url": "https://collegescorecard.ed.gov/data/", "local_location": "Current 2026 archive not ingested in this build"},
]
write_csv(PROJECT / "sources" / "source_manifest.csv", source_manifest)

assumption_rows = [
    {"assumption": "College-going rate", "central": COLLEGE_GOING, "low": LOW_COLLEGE_GOING, "high": HIGH_COLLEGE_GOING, "source_or_reason": "BLS October 2024 recent high-school graduate enrollment"},
    {"assumption": "Four-year share", "central": FOUR_YEAR_SHARE, "low": LOW_FOUR_YEAR_SHARE, "high": HIGH_FOUR_YEAR_SHARE, "source_or_reason": "BLS: about two in three enrolled recent graduates attended four-year colleges"},
    {"assumption": "Undergraduate cohort divisor", "central": COHORT_DIVISOR, "low": 4.0, "high": 4.5, "source_or_reason": "Scenario proxy converting current undergraduate stock to annual scale"},
    {"assumption": "Headcount-to-FTE factor", "central": FTE_FACTOR, "low": 0.75, "high": 0.95, "source_or_reason": "Editable scenario assumption"},
    {"assumption": "Variable instructional expense share", "central": VARIABLE_INSTRUCTIONAL_EXPENSE_SHARE, "low": 0.20, "high": 0.40, "source_or_reason": "Editable fixed/variable cost scenario"},
    {"assumption": "National recruiter state weight", "central": SCOPE_STATE_WEIGHTS["National"], "low": 0.10, "high": 0.40, "source_or_reason": "Heuristic recruitment-market proxy"},
    {"assumption": "Statewide recruiter state weight", "central": SCOPE_STATE_WEIGHTS["Statewide"], "low": 0.45, "high": 0.75, "source_or_reason": "Heuristic recruitment-market proxy"},
    {"assumption": "Regional recruiter state weight", "central": SCOPE_STATE_WEIGHTS["Regional"], "low": 0.75, "high": 0.95, "source_or_reason": "Heuristic recruitment-market proxy"},
]
write_csv(PH3 / "model_assumptions.csv", assumption_rows)

# Data dictionary focused on new outputs
fields = [
    {"file": "state_college_market_2026_2041.csv", "field": "likely_four_year_entrants", "definition": "Projected graduates multiplied by the central college-going and four-year-share assumptions"},
    {"file": "state_college_market_2026_2041.csv", "field": "local_pool_coverage_proxy", "definition": "Likely local four-year entrants divided by current undergraduate enrollment / cohort divisor"},
    {"file": "institution_market_exposure_2030_2041.csv", "field": "blended_market_change", "definition": "Weighted combination of state and national graduate-pool change"},
    {"file": "institution_market_exposure_2030_2041.csv", "field": "projected_undergraduate_enrollment", "definition": "Current undergraduate enrollment scaled by blended market change under constant market share"},
    {"file": "institution_budget_pressure_2030_2041.csv", "field": "annual_funding_gap_proxy", "definition": "Positive amount of modeled tuition contribution decline remaining after adjustable instructional expense change"},
    {"file": "institution_budget_pressure_2030_2041.csv", "field": "additional_students_to_close_gap", "definition": "Additional undergraduate headcount needed to offset the modeled gap at current per-FTE contribution"},
]
write_csv(PROJECT / "data_dictionary_phase3_5.csv", fields)

manifest = {
    "project": "The Future College Market",
    "build": "Phases 1-5 cumulative",
    "assumptions": {
        "college_going": COLLEGE_GOING,
        "four_year_share": FOUR_YEAR_SHARE,
        "cohort_divisor": COHORT_DIVISOR,
        "fte_factor": FTE_FACTOR,
        "variable_instructional_expense_share": VARIABLE_INSTRUCTIONAL_EXPENSE_SHARE,
    },
    "counts": {
        "states_and_dc": len({r['state'] for r in state_market}),
        "county_year_rows": len(county_market),
        "four_year_institutions": len(institution_base),
        "institution_year_exposure_rows": len(exposure_rows),
        "institutions_with_finance_proxy": len({r['unitid'] for r in budget_rows}),
        "finance_year_rows": len(budget_rows),
    },
    "institution_vintages": {
        "enrollment": "March 2024 Scorecard elements snapshot",
        "finance": "April 2022 Scorecard-derived snapshot",
        "official_latest_reference": "College Scorecard updated June 10, 2026; not ingested",
    }
}
(PROJECT / "manifest_phases3_5.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
print(json.dumps(manifest, indent=2))
