"""Build public state and institution diagnostic artifacts from compact data."""

from __future__ import annotations

import json
import math
from pathlib import Path
from statistics import median


PROJECT = Path(__file__).resolve().parents[1]
DATA = PROJECT / "data"
BASELINE_YEAR = "2015_16"
LATEST_YEAR = "2024_25"


def participation_requirement(
    baseline_graduates: float,
    future_graduates: float,
    current_rate: float = 0.628,
    four_year_share: float = 2 / 3,
) -> dict[str, float | bool]:
    """Return the participation rate needed to preserve baseline entrants."""
    baseline_entrants = baseline_graduates * current_rate * four_year_share
    required_rate = (
        baseline_entrants / (future_graduates * four_year_share)
        if future_graduates > 0 and four_year_share > 0
        else float("inf")
    )
    return {
        "requiredRate": required_rate,
        "increasePoints": max(0.0, required_rate - current_rate) * 100,
        "feasible": required_rate <= 1,
    }


def classify_state(
    change: float,
    increase_points: float,
    absolute_loss: float,
    median_loss: float,
) -> str:
    """Assign a descriptive state situation from transparent thresholds."""
    if change >= 0:
        return "Expanding pool"
    if increase_points <= 5:
        return "Participation opportunity"
    if change <= -0.10 and absolute_loss >= median_loss:
        return "Severe structural pressure"
    if change <= -0.10:
        return "Concentrated pressure"
    return "Large but contracting"


def endpoint_change(start: float | None, end: float | None) -> float | None:
    """Calculate total change between two positive enrollment endpoints."""
    if start is None or end is None or start <= 0:
        return None
    return end / start - 1


def percentile_rank(value: float | None, values: list[float | None]) -> float | None:
    """Return a tie-adjusted percentile among finite values."""
    if value is None or not math.isfinite(value):
        return None
    valid = [item for item in values if item is not None and math.isfinite(item)]
    if not valid:
        return None
    below = sum(item < value for item in valid)
    tied = sum(item == value for item in valid)
    return round((below + tied / 2) / len(valid) * 100, 1)


def choose_peer_values(
    target: dict,
    rows: list[dict],
    minimum: int = 10,
) -> tuple[list[float], str]:
    """Choose the narrowest sufficiently populated observed peer group."""
    levels = [
        (("control", "sizeBand", "admissionBand"), "control, size, and admissions band"),
        (("control", "sizeBand"), "control and size"),
        (("control",), "control"),
    ]
    fallback: tuple[list[float], str] = ([], "control")
    for keys, label in levels:
        values = [
            row["change"]
            for row in rows
            if all(row.get(key) == target.get(key) for key in keys)
            and row.get("change") is not None
            and math.isfinite(row["change"])
        ]
        fallback = (values, label)
        if len(values) >= minimum:
            return values, label
    return fallback


def size_band(value: float | None) -> str:
    if value is None or value < 5000:
        return "Under 5,000"
    if value < 20000:
        return "5,000–19,999"
    return "20,000 or more"


def admission_band(value: float | None) -> str:
    if value is None:
        return "Open or unavailable"
    if value >= 0.75:
        return "75% or higher"
    if value >= 0.50:
        return "50–74.9%"
    return "Below 50%"


def latest_reported(record: dict, field: str, source_years: list[str]) -> float | None:
    for year in reversed(source_years):
        value = record.get("years", {}).get(year, {}).get(field)
        if value is not None:
            return value
    return None


def valid_median(values: list[float | None]) -> float | None:
    valid = [value for value in values if value is not None and math.isfinite(value)]
    return median(valid) if valid else None


def peer_rows_for(target: dict, rows: list[dict], minimum: int = 10) -> tuple[list[dict], str]:
    levels = [
        (("control", "sizeBand", "admissionBand"), "control, size, and admissions band"),
        (("control", "sizeBand"), "control and size"),
        (("control",), "control"),
    ]
    fallback: tuple[list[dict], str] = ([], "control")
    for keys, label in levels:
        peers = [
            row
            for row in rows
            if all(row.get(key) == target.get(key) for key in keys)
            and row.get("change") is not None
            and math.isfinite(row["change"])
        ]
        fallback = (peers, label)
        if len(peers) >= minimum:
            return peers, label
    return fallback


def build_state_diagnostics(states: list[dict]) -> list[dict]:
    baselines = {row["state"]: row for row in states if row["year"] == 2026}
    output: list[dict] = []
    for year in sorted({row["year"] for row in states}):
        year_rows = [row for row in states if row["year"] == year]
        losses = [
            max(0.0, baselines[row["state"]]["fourYearEntrants"] - row["fourYearEntrants"])
            for row in year_rows
            if row["state"] in baselines and row["fourYearEntrants"] < baselines[row["state"]]["fourYearEntrants"]
        ]
        median_loss = median(losses) if losses else 0.0
        for row in year_rows:
            baseline = baselines[row["state"]]
            requirement = participation_requirement(baseline["graduates"], row["graduates"])
            graduate_loss = baseline["graduates"] - row["graduates"]
            entrant_loss = baseline["fourYearEntrants"] - row["fourYearEntrants"]
            increase_points = requirement["increasePoints"]
            output.append(
                {
                    "state": row["state"],
                    "name": row["name"],
                    "year": year,
                    "graduates": row["graduates"],
                    "fourYearEntrants": row["fourYearEntrants"],
                    "change": row["change"],
                    "graduateLoss": graduate_loss,
                    "entrantLoss": entrant_loss,
                    "requiredParticipationRate": requirement["requiredRate"] if math.isfinite(requirement["requiredRate"]) else None,
                    "requiredParticipationPoints": increase_points if math.isfinite(increase_points) else None,
                    "participationFeasible": requirement["feasible"],
                    "archetype": classify_state(row["change"], increase_points, max(0.0, entrant_loss), median_loss),
                    "medianDecliningStateEntrantLoss": median_loss,
                }
            )
    return output


def build_institution_diagnostics(
    compact_payload: dict,
    institutions: list[dict],
    states: list[dict],
    residence_records: list[dict] | None = None,
) -> list[dict]:
    source_years = compact_payload["sourceYears"]
    compact = {str(row["unitid"]): row for row in compact_payload["institutions"]}
    meta: dict[str, dict] = {}
    for row in sorted(institutions, key=lambda item: item.get("year", 0), reverse=True):
        meta.setdefault(str(row["unitid"]), row)
    state_2041 = {row["state"]: row["change"] for row in states if row["year"] == 2041}
    residence = {str(row["unitid"]): row for row in (residence_records or [])}
    residence_fields = (
        "firstTimeHomeStateCount", "firstTimeOtherStateCount",
        "firstTimeForeignCountryCount", "firstTimeUnknownResidenceCount",
        "firstTimeOtherUSAreaCount", "firstTimeKnownDomesticCount",
        "firstTimeHomeStateShare", "firstTimeOtherStateShare", "residenceSourceYear",
    )

    rows: list[dict] = []
    for unitid, item in meta.items():
        history = compact.get(unitid)
        if not history:
            continue
        start = history.get("years", {}).get(BASELINE_YEAR, {}).get("UGDS")
        end = history.get("years", {}).get(LATEST_YEAR, {}).get("UGDS")
        change = endpoint_change(start, end)
        admit_rate = latest_reported(history, "ADM_RATE", source_years)
        current_pg = latest_reported(history, "GRADS", source_years)
        row = {
            "unitid": unitid,
            "name": item.get("name") or history.get("name"),
            "city": item.get("city"),
            "state": item.get("state"),
            "control": item.get("control"),
            "currentUG": end or item.get("currentUG"),
            "currentPG": current_pg,
            "change": change,
            "admitRate": admit_rate,
            "retention": latest_reported(history, "RET_FT4", source_years),
            "completion": latest_reported(history, "C150_4", source_years),
            "adultUGShare": latest_reported(history, "UG25ABV", source_years),
            "partTimeUGShare": latest_reported(history, "PPTUG_EF", source_years),
            "internationalUGShare": latest_reported(history, "UGDS_NRA", source_years),
            "tuitionPerFTE": item.get("tuitionPerFTE") if item.get("hasFinance") else None,
            "instructionPerFTE": item.get("instructionPerFTE") if item.get("hasFinance") else None,
            "lat": item.get("lat"),
            "lon": item.get("lon"),
            "mapX": item.get("mapX"),
            "mapY": item.get("mapY"),
            "statePoolChange2041": state_2041.get(item.get("state")),
        }
        residence_row = residence.get(unitid, {})
        row.update({field: residence_row.get(field) for field in residence_fields})
        row["sizeBand"] = size_band(row["currentUG"])
        row["admissionBand"] = admission_band(admit_rate)
        rows.append(row)

    state_values: dict[str, list[float]] = {}
    for row in rows:
        if row["change"] is not None:
            state_values.setdefault(row["state"], []).append(row["change"])

    for row in rows:
        peers, peer_definition = peer_rows_for(row, rows)
        peer_changes = [peer["change"] for peer in peers]
        peer_median = valid_median(peer_changes)
        state_median = valid_median(state_values.get(row["state"], []))
        row["peerMedian"] = peer_median
        row["stateMedian"] = state_median
        row["relativePerformance"] = (
            row["change"] - peer_median
            if row["change"] is not None and peer_median is not None
            else None
        )
        row["peerDefinition"] = peer_definition
        row["peerCount"] = len(peers)
        metric_fields = {
            "momentum": "change",
            "retention": "retention",
            "adultShare": "adultUGShare",
            "partTimeShare": "partTimeUGShare",
            "tuitionPerFTE": "tuitionPerFTE",
        }
        row["percentiles"] = {
            name: percentile_rank(row[field], [peer.get(field) for peer in peers])
            for name, field in metric_fields.items()
        }
        row["peerMedians"] = {
            name: valid_median([peer.get(field) for peer in peers])
            for name, field in metric_fields.items()
        }
    return rows


def write_json(path: Path, payload: list[dict] | dict) -> None:
    path.write_text(json.dumps(payload, separators=(",", ":"), allow_nan=False), encoding="utf-8")


def build() -> tuple[list[dict], list[dict]]:
    compact_payload = json.loads((DATA / "scorecard_compact.json").read_text(encoding="utf-8"))
    institutions = json.loads((DATA / "institutions.json").read_text(encoding="utf-8"))
    states = json.loads((DATA / "states.json").read_text(encoding="utf-8"))
    residence_payload = json.loads((DATA / "ipeds_residence_2024.json").read_text(encoding="utf-8"))
    state_diagnostics = build_state_diagnostics(states)
    institution_diagnostics = build_institution_diagnostics(
        compact_payload, institutions, states, residence_payload["records"]
    )
    write_json(DATA / "state_diagnostics.json", state_diagnostics)
    write_json(DATA / "institution_diagnostics.json", institution_diagnostics)
    print(
        f"Built {len(state_diagnostics):,} state-year diagnostics and "
        f"{len(institution_diagnostics):,} institution diagnostics"
    )
    return state_diagnostics, institution_diagnostics


if __name__ == "__main__":
    build()
