#!/usr/bin/env python3
"""Validate the static project and its calculated datasets."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def fail(message: str) -> None:
    raise AssertionError(message)


def load_payload() -> dict:
    text = (ROOT / "assets/js/data.js").read_text(encoding="utf-8").strip()
    prefix = "window.MOBILITY_DATA = "
    if not text.startswith(prefix) or not text.endswith(";"):
        fail("assets/js/data.js has an unexpected wrapper")
    return json.loads(text[len(prefix) : -1])


def validate() -> None:
    required = [
        "index.html",
        "assets/css/styles.css",
        "assets/js/data.js",
        "assets/js/app.js",
        "assets/img/world-map.svg",
        "assets/img/europe-map.svg",
        "scripts/generate_maps.py",
        "data/global_totals.csv",
        "data/global_major_corridors.csv",
        "data/global_2023_countries.csv",
        "data/ErasmusFlows.net",
        "data/naturalearth_lowres.geojson",
        "data/country_coordinates.csv",
    ]
    missing = [path for path in required if not (ROOT / path).exists()]
    if missing:
        fail(f"Missing required files: {', '.join(missing)}")

    payload = load_payload()
    totals = payload["globalTotals"]
    years = [row["year"] for row in totals]
    if years != list(range(2013, 2024)):
        fail(f"Global years are not continuous 2013–2023: {years}")
    if totals[0]["status"] != "estimated":
        fail("2013 must remain explicitly marked estimated")
    if totals[-1]["students"] != 7_300_000:
        fail("2023 global total must equal 7.3 million")

    global_metrics = payload["globalMetrics"]
    if global_metrics != {
        "absolute_growth": 2_950_000,
        "percent_growth": 67.8,
        "cagr": 5.3,
        "start": 4_350_000,
        "end": 7_300_000,
    }:
        fail(f"Unexpected global metrics: {global_metrics}")

    corridors = payload["globalCorridors"]
    if any(row["year"] < 2016 for row in corridors):
        fail("No 2013–2015 corridor should be inferred")
    if set(row["year"] for row in corridors) != set(range(2016, 2024)):
        fail("Global corridor archive must cover 2016–2023")
    if sum(row["year"] == 2016 for row in corridors) < 30:
        fail("The 2016 route layer is unexpectedly incomplete")

    erasmus_metrics = payload["erasmusMetrics"]
    expected_erasmus = {
        "cross_border_participants": 8_273_582,
        "countries": 34,
        "routes": 1_120,
    }
    for key, expected in expected_erasmus.items():
        if erasmus_metrics[key] != expected:
            fail(f"Unexpected Erasmus {key}: {erasmus_metrics[key]} != {expected}")
    if erasmus_metrics["largest_route"] != {
        "origin": "Italy",
        "destination": "Spain",
        "participants": 217_003,
    }:
        fail("Unexpected largest Erasmus route")

    coordinates = payload["coordinates"]
    countries_needed = set()
    for row in corridors:
        countries_needed.update([row["origin"], row["destination"]])
    for row in payload["erasmusSummary"]:
        countries_needed.add(row["country"])
    missing_coordinates = sorted(country for country in countries_needed if country not in coordinates)
    if missing_coordinates:
        fail(f"Missing map coordinates: {', '.join(missing_coordinates)}")

    html = (ROOT / "index.html").read_text(encoding="utf-8")
    for asset in [
        "assets/css/styles.css",
        "assets/js/data.js",
        "assets/js/app.js",
        "assets/img/world-map.svg",
        "assets/img/europe-map.svg",
    ]:
        if asset not in html:
            fail(f"index.html does not reference {asset}")

    node = subprocess.run(
        ["node", "--check", str(ROOT / "assets/js/app.js")],
        capture_output=True,
        text=True,
    )
    if node.returncode != 0:
        fail(f"JavaScript syntax error:\n{node.stderr}")


if __name__ == "__main__":
    try:
        validate()
    except Exception as exc:
        print(f"VALIDATION FAILED: {exc}", file=sys.stderr)
        sys.exit(1)
    print("Validation passed: datasets, calculations, coordinates, assets, and JavaScript are consistent.")
