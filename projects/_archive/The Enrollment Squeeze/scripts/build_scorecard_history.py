"""Refresh the institution market panel from the compact Scorecard artifact."""

from __future__ import annotations

import json
from statistics import median
from pathlib import Path


PROJECT = Path(__file__).resolve().parents[1]
DATA = PROJECT / "data"
SCORECARD_COMPACT = DATA / "scorecard_compact.json"
INSTITUTIONS = DATA / "institutions.json"
YEARS = [f"{year}_{str(year + 1)[-2:]}" for year in range(2015, 2025)]


def number(value):
    try:
        if value in (None, "", "NULL", "PrivacySuppressed"):
            return None
        return float(value)
    except (TypeError, ValueError):
        return None


def clamp(value, lower, upper):
    return max(lower, min(upper, value))


def latest_reported(item, field):
    for year in reversed(YEARS):
        value = item["years"].get(year, {}).get(field)
        if value is not None:
            return value
    return None


def build():
    payload = json.loads(SCORECARD_COMPACT.read_text(encoding="utf-8"))
    if payload.get("sourceYears") != YEARS:
        raise ValueError("scorecard_compact.json does not contain the expected 2015-16 through 2024-25 years")
    history = {str(row["unitid"]): row for row in payload.get("institutions", [])}

    institutions = json.loads(INSTITUTIONS.read_text(encoding="utf-8"))
    institution_meta = {}
    for row in institutions:
        institution_meta.setdefault(str(row["unitid"]), {"state": row.get("state"), "scope": row.get("scope")})

    national = {}
    compact = {}
    for unitid, record in history.items():
        observations = [(year, record["years"].get(year, {}).get("UGDS")) for year in YEARS]
        valid = [(year, value) for year, value in observations if value is not None and value > 0]
        first_year, first_value = valid[0] if valid else (None, None)
        last_year, last_value = valid[-1] if valid else (None, None)
        span = YEARS.index(last_year) - YEARS.index(first_year) if first_year and last_year else 0
        cagr = ((last_value / first_value) ** (1 / span) - 1) if first_value and last_value and span > 0 else None
        graduate_observations = [(year, record["years"].get(year, {}).get("GRADS")) for year in YEARS]
        graduate_valid = [(year, value) for year, value in graduate_observations if value is not None and value > 0]
        graduate_first_year, graduate_first_value = graduate_valid[0] if graduate_valid else (None, None)
        graduate_last_year, graduate_last_value = graduate_valid[-1] if graduate_valid else (None, None)
        graduate_span = YEARS.index(graduate_last_year) - YEARS.index(graduate_first_year) if graduate_first_year and graduate_last_year else 0
        graduate_cagr = ((graduate_last_value / graduate_first_value) ** (1 / graduate_span) - 1) if graduate_first_value and graduate_last_value and graduate_span > 0 else None
        pre_covid_international_shares = [record["years"].get(year, {}).get("UGDS_NRA") for year in ("2018_19", "2019_20")]
        pre_covid_international_shares = [value for value in pre_covid_international_shares if value is not None and value >= 0]
        compact[unitid] = {
            "unitid": unitid,
            "name": record["name"],
            "historyYears": len(valid),
            "historyStart": first_year,
            "historyEnd": last_year,
            "enrollmentStart": first_value,
            "enrollmentEnd": last_value,
            "enrollmentCagr": cagr,
            "graduateHistoryYears": len(graduate_valid),
            "graduateHistoryStart": graduate_first_year,
            "graduateHistoryEnd": graduate_last_year,
            "graduateEnrollmentStart": graduate_first_value,
            "graduateEnrollmentEnd": graduate_last_value,
            "graduateCagr": graduate_cagr,
            "preCovidInternationalUGShare": median(pre_covid_international_shares) if pre_covid_international_shares else None,
            "years": record["years"],
        }

    for year in YEARS:
        undergraduate_total = 0.0
        graduate_total = 0.0
        undergraduate_coverage = 0
        graduate_coverage = 0
        for item in compact.values():
            values = item["years"].get(year, {})
            ug = values.get("UGDS")
            pg = values.get("GRADS")
            if ug is not None and ug > 0:
                undergraduate_total += ug
                undergraduate_coverage += 1
            if pg is not None and pg > 0:
                graduate_total += pg
                graduate_coverage += 1
        national[year] = {
            "undergraduate": round(undergraduate_total),
            "graduate": round(graduate_total),
            "undergraduateCoverage": undergraduate_coverage,
            "graduateCoverage": graduate_coverage,
        }

    def balanced_series(field):
        panel = [item for item in compact.values() if (item["years"].get(YEARS[0], {}).get(field) or 0) > 0 and (item["years"].get(YEARS[-1], {}).get(field) or 0) > 0]
        return {
            "institutionCount": len(panel),
            "years": {
                year: {
                    "enrollment": round(sum((item["years"].get(year, {}).get(field) or 0) for item in panel)),
                    "coverage": sum(1 for item in panel if (item["years"].get(year, {}).get(field) or 0) > 0),
                }
                for year in YEARS
            },
        }

    balanced = {
        "definition": "Institutions reporting the measure in both 2015-16 and 2024-25",
        "undergraduate": balanced_series("UGDS"),
        "graduate": balanced_series("GRADS"),
    }

    state_scope_cagrs = {}
    state_cagrs = {}
    scope_cagrs = {}
    for unitid, item in compact.items():
        cagr = item["enrollmentCagr"]
        meta = institution_meta.get(unitid, {})
        if cagr is None:
            continue
        state = meta.get("state")
        scope = meta.get("scope") or "Unknown"
        state_scope_cagrs.setdefault((state, scope), []).append(cagr)
        state_cagrs.setdefault(state, []).append(cagr)
        scope_cagrs.setdefault(scope, []).append(cagr)

    for unitid, item in compact.items():
        cagr = item["enrollmentCagr"]
        meta = institution_meta.get(unitid, {})
        state = meta.get("state")
        scope = meta.get("scope") or "Unknown"
        peer_values = state_scope_cagrs.get((state, scope), [])
        peer_basis = "state and scope median"
        if len(peer_values) < 5:
            peer_values = state_cagrs.get(state, [])
            peer_basis = "state median"
        if len(peer_values) < 5:
            peer_values = scope_cagrs.get(scope, [])
            peer_basis = "scope median"
        peer_cagr = median(peer_values) if peer_values else 0.0
        residual = cagr - peer_cagr if cagr is not None else 0.0
        item["peerMarketCagr"] = peer_cagr
        item["historicalResidual"] = residual if cagr is not None else None
        blended_behavior = (0.5 * cagr) + (0.5 * residual) if cagr is not None else 0.0
        item["historicalAdjustment"] = clamp(blended_behavior, -0.03, 0.03)
        item["behaviorBasis"] = f"50% own trend + 50% {peer_basis}" if cagr is not None else "no usable history"

    for row in institutions:
        item = compact.get(str(row["unitid"]))
        row["historyYears"] = item["historyYears"] if item else 0
        row["historyStart"] = item["historyStart"] if item else None
        row["historyEnd"] = item["historyEnd"] if item else None
        row["enrollmentCagr"] = item["enrollmentCagr"] if item else None
        row["peerMarketCagr"] = item["peerMarketCagr"] if item else None
        row["historicalResidual"] = item["historicalResidual"] if item else None
        row["historicalAdjustment"] = item["historicalAdjustment"] if item else 0.0
        row["behaviorBasis"] = item["behaviorBasis"] if item else "no usable history"
        row["latestScorecardUG"] = item["enrollmentEnd"] if item else None
        row["latestScorecardPG"] = item["graduateEnrollmentEnd"] if item else None
        row["graduateHistoryYears"] = item["graduateHistoryYears"] if item else 0
        row["graduateHistoryStart"] = item["graduateHistoryStart"] if item else None
        row["graduateHistoryEnd"] = item["graduateHistoryEnd"] if item else None
        row["graduateCagr"] = item["graduateCagr"] if item else None
        row["latestAdmissionRate"] = latest_reported(item, "ADM_RATE") if item else None
        row["latestTuitionInState"] = latest_reported(item, "TUITIONFEE_IN") if item else None
        row["latestTuitionOutOfState"] = latest_reported(item, "TUITIONFEE_OUT") if item else None
        row["internationalUGShare"] = latest_reported(item, "UGDS_NRA") if item else None
        row["preCovidInternationalUGShare"] = item["preCovidInternationalUGShare"] if item else None
        row["partTimeUGShare"] = latest_reported(item, "PPTUG_EF") if item else None
        row["adultUGShare"] = latest_reported(item, "UG25ABV") if item else None
        row["latestLatitude"] = latest_reported(item, "LATITUDE") if item else None
        row["latestLongitude"] = latest_reported(item, "LONGITUDE") if item else None
        if row["latestLatitude"] is not None and row["latestLongitude"] is not None:
            row["lat"] = row["latestLatitude"]
            row["lon"] = row["latestLongitude"]
        if item and item["enrollmentEnd"] is not None:
            row["currentUG"] = item["enrollmentEnd"]
            row["projectedUG"] = round(item["enrollmentEnd"] * (1 + (row.get("marketChange") or 0)), 1)
            row["projectedChange"] = round(item["enrollmentEnd"] * (row.get("marketChange") or 0), 1)
        row["currentPG"] = item["graduateEnrollmentEnd"] if item else None
        adjustment = item["historicalAdjustment"] if item else 0.0
        row["projectedUGBehavioral"] = round((row.get("currentUG") or 0) * (1 + (row.get("marketChange") or 0) + adjustment), 1)
    INSTITUTIONS.write_text(json.dumps(institutions, separators=(",", ":")), encoding="utf-8")
    print(f"Built history for {len(compact):,} institutions and enriched {len(institutions):,} institution-year rows")


if __name__ == "__main__":
    build()
