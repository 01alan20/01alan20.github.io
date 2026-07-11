#!/usr/bin/env python3
"""Build browser-ready opportunity data from the official metro source CSV.

Run:
    python scripts/fetch_official_data.py   # refresh source inputs when needed
    python scripts/build_dataset.py

Outputs:
    data/metro_opportunity.csv
    data/metro-data.js
"""
from __future__ import annotations

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data" / "metro_source.csv"
OUTPUT_CSV = ROOT / "data" / "metro_opportunity.csv"
OUTPUT_JS = ROOT / "data" / "metro-data.js"

NUMERIC_FIELDS = {
    "latitude",
    "longitude",
    "population",
    "population_m",
    "resident_employment_growth_pct",
    "employment_population_ratio_pct",
    "median_worker_earnings",
    "median_gross_rent",
    "bachelor_share_pct",
    "population_growth_pct",
    "broadband_subscription_pct",
}

REQUIRED_FIELDS = {"metro", "state", "cbsa_code", *NUMERIC_FIELDS}


def percentile_scores(rows: list[dict], field: str, reverse: bool = False) -> dict[str, float]:
    """Return 0–100 percentile ranks keyed by metro name."""
    ordered = sorted(rows, key=lambda row: row[field], reverse=reverse)
    count = len(ordered)
    if count == 1:
        return {ordered[0]["metro"]: 50.0}
    return {
        row["metro"]: 100.0 * index / (count - 1)
        for index, row in enumerate(ordered)
    }


def clamp(value: float, low: float = 0.0, high: float = 100.0) -> float:
    return max(low, min(high, value))


def score_label(value: float) -> str:
    if value >= 78:
        return "leading"
    if value >= 62:
        return "strong"
    if value >= 45:
        return "mixed"
    return "under pressure"


def build_headline(row: dict) -> str:
    dimensions = {
        "career strength": row["career_score"],
        "affordability": row["affordability_score"],
        "education depth": row["education_score"],
        "population momentum": row["momentum_score"],
        "digital access": row["connectivity_score"],
    }
    strongest = sorted(dimensions, key=dimensions.get, reverse=True)[:2]
    weakest = min(dimensions, key=dimensions.get)
    if dimensions[weakest] < 35:
        return (
            f"{strongest[0].title()} and {strongest[1]} stand out, "
            f"while {weakest} remains the main constraint."
        )
    return f"A balanced profile led by {strongest[0]} and {strongest[1]}."


def main() -> None:
    with SOURCE.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        missing = REQUIRED_FIELDS - set(reader.fieldnames or [])
        if missing:
            raise SystemExit(f"Missing required columns: {', '.join(sorted(missing))}")

        rows: list[dict] = []
        seen: set[str] = set()
        for line_number, raw in enumerate(reader, start=2):
            metro = (raw.get("metro") or "").strip()
            if not metro:
                raise SystemExit(f"Blank metro name on line {line_number}")
            if metro in seen:
                raise SystemExit(f"Duplicate metro '{metro}' on line {line_number}")
            seen.add(metro)

            row = {
                key: (value.strip() if isinstance(value, str) else value)
                for key, value in raw.items()
            }
            for field in NUMERIC_FIELDS:
                try:
                    row[field] = float(row[field])
                except (TypeError, ValueError) as exc:
                    raise SystemExit(
                        f"Invalid number for {field} on line {line_number}: {row.get(field)!r}"
                    ) from exc

            row["population"] = int(round(row["population"]))
            row["median_worker_earnings"] = int(round(row["median_worker_earnings"]))
            row["median_gross_rent"] = int(round(row["median_gross_rent"]))
            row["earnings_after_rent"] = (
                row["median_worker_earnings"] - 12 * row["median_gross_rent"]
            )
            row["rent_to_earnings_pct"] = (
                100 * (12 * row["median_gross_rent"]) / row["median_worker_earnings"]
            )
            rows.append(row)

    percentile_fields = {
        "resident_employment_growth_pct": False,
        "employment_population_ratio_pct": False,
        "earnings_after_rent": False,
        "rent_to_earnings_pct": True,
        "bachelor_share_pct": False,
        "population_growth_pct": False,
        "broadband_subscription_pct": False,
        "median_worker_earnings": False,
    }
    percentiles = {
        field: percentile_scores(rows, field, reverse=reverse)
        for field, reverse in percentile_fields.items()
    }

    for row in rows:
        key = row["metro"]
        row["career_score"] = (
            0.55 * percentiles["resident_employment_growth_pct"][key]
            + 0.45 * percentiles["employment_population_ratio_pct"][key]
        )
        row["affordability_score"] = (
            0.55 * percentiles["earnings_after_rent"][key]
            + 0.45 * percentiles["rent_to_earnings_pct"][key]
        )
        row["education_score"] = percentiles["bachelor_share_pct"][key]
        row["momentum_score"] = percentiles["population_growth_pct"][key]
        row["connectivity_score"] = percentiles["broadband_subscription_pct"][key]
        row["income_score"] = percentiles["median_worker_earnings"][key]
        row["opportunity_score"] = clamp(
            0.30 * row["career_score"]
            + 0.25 * row["affordability_score"]
            + 0.20 * row["education_score"]
            + 0.15 * row["momentum_score"]
            + 0.10 * row["connectivity_score"]
        )

        for field in [
            "earnings_after_rent",
            "rent_to_earnings_pct",
            "career_score",
            "affordability_score",
            "education_score",
            "momentum_score",
            "connectivity_score",
            "income_score",
            "opportunity_score",
        ]:
            row[field] = round(row[field], 1)

        row["profile"] = score_label(row["opportunity_score"])
        row["headline"] = build_headline(row)

    rows.sort(key=lambda row: row["opportunity_score"], reverse=True)
    for rank, row in enumerate(rows, start=1):
        row["rank"] = rank

    output_fields = [
        "rank",
        "metro",
        "state",
        "cbsa_code",
        "latitude",
        "longitude",
        "population",
        "population_m",
        "opportunity_score",
        "career_score",
        "affordability_score",
        "education_score",
        "momentum_score",
        "connectivity_score",
        "income_score",
        "resident_employment_growth_pct",
        "employment_population_ratio_pct",
        "median_worker_earnings",
        "median_gross_rent",
        "earnings_after_rent",
        "rent_to_earnings_pct",
        "bachelor_share_pct",
        "population_growth_pct",
        "broadband_subscription_pct",
        "profile",
        "headline",
    ]

    with OUTPUT_CSV.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=output_fields)
        writer.writeheader()
        writer.writerows(rows)

    browser_rows = [{field: row[field] for field in output_fields} for row in rows]
    OUTPUT_JS.write_text(
        "// Generated by scripts/build_dataset.py. Do not edit manually.\n"
        + "window.METRO_DATA = "
        + json.dumps(browser_rows, ensure_ascii=False, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )

    print(f"Built {len(rows)} metros")
    print(f"  {OUTPUT_CSV.relative_to(ROOT)}")
    print(f"  {OUTPUT_JS.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
