#!/usr/bin/env python3
"""Download ACS table-based files and build the official metro source CSV.

The default workflow uses Census table-based summary files and therefore does
not require an API key. A Census API key can still be kept in the environment
for future API-based extensions; it is never written to project files.

Run from the project root:
    python scripts/fetch_official_data.py
    python scripts/build_dataset.py
    python scripts/validate_project.py
"""
from __future__ import annotations

import argparse
import csv
import json
import math
import shutil
import tempfile
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
RAW_DIR = DATA_DIR / "raw"
REGISTRY = DATA_DIR / "metro_registry.csv"
OUTPUT = DATA_DIR / "metro_source.csv"
MANIFEST = DATA_DIR / "source_manifest.json"

BASE_URL = (
    "https://www2.census.gov/programs-surveys/acs/summary_file/"
    "{year}/table-based-SF/data/1YRData/acsdt1y{year}-{table}.dat"
)

FILES = {
    (2024, "b01003"): "acsdt1y2024-b01003.dat",
    (2024, "b15003"): "acsdt1y2024-b15003.dat",
    (2024, "b20002"): "acsdt1y2024-b20002.dat",
    (2024, "b23025"): "acsdt1y2024-b23025.dat",
    (2024, "b25064"): "acsdt1y2024-b25064.dat",
    (2024, "b28002"): "acsdt1y2024-b28002.dat",
    (2023, "b01003"): "acsdt1y2023-b01003.dat",
    (2023, "b23025"): "acsdt1y2023-b23025.dat",
}


def download(url: str, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "Education-Opportunity-Map/1.0 (public data project)"},
    )
    try:
        with urllib.request.urlopen(request, timeout=90) as response, tempfile.NamedTemporaryFile(
            delete=False, dir=destination.parent
        ) as temporary:
            shutil.copyfileobj(response, temporary)
            temporary_path = Path(temporary.name)
    except (urllib.error.URLError, TimeoutError) as exc:
        raise SystemExit(f"Could not download {url}: {exc}") from exc
    temporary_path.replace(destination)


def read_msa_table(path: Path) -> dict[str, dict[str, str]]:
    """Return table rows keyed by five-digit CBSA code."""
    with path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle, delimiter="|")
        rows = {}
        for row in reader:
            geo_id = row.get("GEO_ID", "")
            if geo_id.startswith("310M700US"):
                rows[geo_id[-5:]] = row
    if not rows:
        raise SystemExit(f"No metropolitan records found in {path}")
    return rows


def number(row: dict[str, str], field: str, *, path: Path, cbsa: str) -> float:
    try:
        value = float(row[field])
    except (KeyError, TypeError, ValueError) as exc:
        raise SystemExit(f"Missing or invalid {field} for CBSA {cbsa} in {path.name}") from exc
    if not math.isfinite(value) or value < 0:
        raise SystemExit(f"Invalid Census estimate {value!r} for {field}, CBSA {cbsa}")
    return value


def pct_change(current: float, prior: float) -> float:
    if prior <= 0:
        raise SystemExit("Cannot calculate growth from a zero or negative prior value")
    return 100.0 * (current / prior - 1.0)


def ensure_raw_files(refresh: bool) -> dict[tuple[int, str], Path]:
    paths: dict[tuple[int, str], Path] = {}
    for (year, table), filename in FILES.items():
        destination = RAW_DIR / filename
        if refresh or not destination.is_file():
            url = BASE_URL.format(year=year, table=table)
            print(f"Downloading {year} ACS {table.upper()} …")
            download(url, destination)
        paths[(year, table)] = destination
    return paths


def load_registry() -> list[dict[str, str]]:
    with REGISTRY.open(newline="", encoding="utf-8-sig") as handle:
        rows = list(csv.DictReader(handle))
    required = {"metro", "state", "cbsa_code", "latitude", "longitude"}
    if not rows or required - set(rows[0]):
        raise SystemExit("metro_registry.csv is missing required columns")
    return rows


def build_source(paths: dict[tuple[int, str], Path]) -> list[dict[str, object]]:
    tables = {key: read_msa_table(path) for key, path in paths.items()}
    output_rows: list[dict[str, object]] = []

    for metro in load_registry():
        cbsa = metro["cbsa_code"].zfill(5)
        missing = [key for key, table in tables.items() if cbsa not in table]
        if missing:
            missing_text = ", ".join(f"{year} {table.upper()}" for year, table in missing)
            raise SystemExit(f"CBSA {cbsa} ({metro['metro']}) missing from: {missing_text}")

        pop24_row = tables[(2024, "b01003")][cbsa]
        pop23_row = tables[(2023, "b01003")][cbsa]
        edu_row = tables[(2024, "b15003")][cbsa]
        earnings_row = tables[(2024, "b20002")][cbsa]
        labor24_row = tables[(2024, "b23025")][cbsa]
        labor23_row = tables[(2023, "b23025")][cbsa]
        rent_row = tables[(2024, "b25064")][cbsa]
        broadband_row = tables[(2024, "b28002")][cbsa]

        population_2024 = number(pop24_row, "B01003_E001", path=paths[(2024, "b01003")], cbsa=cbsa)
        population_2023 = number(pop23_row, "B01003_E001", path=paths[(2023, "b01003")], cbsa=cbsa)
        employed_2024 = number(labor24_row, "B23025_E004", path=paths[(2024, "b23025")], cbsa=cbsa)
        employed_2023 = number(labor23_row, "B23025_E004", path=paths[(2023, "b23025")], cbsa=cbsa)
        population_16_plus = number(labor24_row, "B23025_E001", path=paths[(2024, "b23025")], cbsa=cbsa)
        adults_25_plus = number(edu_row, "B15003_E001", path=paths[(2024, "b15003")], cbsa=cbsa)
        degree_holders = sum(
            number(edu_row, field, path=paths[(2024, "b15003")], cbsa=cbsa)
            for field in ("B15003_E022", "B15003_E023", "B15003_E024", "B15003_E025")
        )
        households = number(broadband_row, "B28002_E001", path=paths[(2024, "b28002")], cbsa=cbsa)
        broadband_households = number(
            broadband_row, "B28002_E004", path=paths[(2024, "b28002")], cbsa=cbsa
        )

        output_rows.append(
            {
                "metro": metro["metro"],
                "state": metro["state"],
                "cbsa_code": cbsa,
                "latitude": float(metro["latitude"]),
                "longitude": float(metro["longitude"]),
                "population": int(population_2024),
                "population_m": round(population_2024 / 1_000_000, 3),
                "resident_employment_growth_pct": round(
                    pct_change(employed_2024, employed_2023), 2
                ),
                "employment_population_ratio_pct": round(
                    100.0 * employed_2024 / population_16_plus, 2
                ),
                "median_worker_earnings": int(
                    round(number(earnings_row, "B20002_E001", path=paths[(2024, "b20002")], cbsa=cbsa))
                ),
                "median_gross_rent": int(
                    round(number(rent_row, "B25064_E001", path=paths[(2024, "b25064")], cbsa=cbsa))
                ),
                "bachelor_share_pct": round(100.0 * degree_holders / adults_25_plus, 2),
                "population_growth_pct": round(
                    pct_change(population_2024, population_2023), 2
                ),
                "broadband_subscription_pct": round(
                    100.0 * broadband_households / households, 2
                ),
            }
        )

    return output_rows


def write_source(rows: list[dict[str, object]]) -> None:
    fields = [
        "metro",
        "state",
        "cbsa_code",
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
    ]
    with OUTPUT.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--refresh",
        action="store_true",
        help="Download fresh copies of all Census table files before rebuilding.",
    )
    args = parser.parse_args()

    paths = ensure_raw_files(args.refresh)
    rows = build_source(paths)
    write_source(rows)

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    manifest["metro_count"] = len(rows)
    manifest["generated_file"] = str(OUTPUT.relative_to(ROOT)).replace("\\", "/")
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

    print(f"Built official source data for {len(rows)} metros")
    print(f"  {OUTPUT.relative_to(ROOT)}")
    print("  Source: U.S. Census Bureau ACS 2023 and 2024 one-year estimates")


if __name__ == "__main__":
    main()
