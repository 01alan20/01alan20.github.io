#!/usr/bin/env python3
"""Static and data validation for The Geography of Opportunity project."""
from __future__ import annotations

import csv
import json
import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED_FILES = [
    "index.html",
    "README.md",
    "DATA_DICTIONARY.md",
    "assets/css/styles.css",
    "assets/js/app.js",
    "data/metro_registry.csv",
    "data/metro_source.csv",
    "data/metro_opportunity.csv",
    "data/metro-data.js",
    "data/source_manifest.json",
    "data/us-outline.js",
    "scripts/fetch_official_data.py",
    "scripts/build_dataset.py",
]

RAW_FILES = [
    "data/raw/acsdt1y2023-b01003.dat",
    "data/raw/acsdt1y2023-b23025.dat",
    "data/raw/acsdt1y2024-b01003.dat",
    "data/raw/acsdt1y2024-b15003.dat",
    "data/raw/acsdt1y2024-b20002.dat",
    "data/raw/acsdt1y2024-b23025.dat",
    "data/raw/acsdt1y2024-b25064.dat",
    "data/raw/acsdt1y2024-b28002.dat",
]

SOURCE_FIELDS = {
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
}


class ProjectHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: list[str] = []
        self.assets: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if values.get("id"):
            self.ids.append(values["id"])
        for key in ("src", "href"):
            value = values.get(key)
            if value and not value.startswith(("#", "http://", "https://", "mailto:", "../")):
                self.assets.append(value.split("?")[0])


def fail(message: str) -> None:
    raise SystemExit(f"VALIDATION FAILED: {message}")


def read_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        return list(reader.fieldnames or []), list(reader)


def main() -> None:
    missing_files = [path for path in [*REQUIRED_FILES, *RAW_FILES] if not (ROOT / path).is_file()]
    if missing_files:
        fail(f"missing files: {', '.join(missing_files)}")

    html = (ROOT / "index.html").read_text(encoding="utf-8")
    parser = ProjectHTMLParser()
    parser.feed(html)

    duplicate_ids = sorted({item for item in parser.ids if parser.ids.count(item) > 1})
    if duplicate_ids:
        fail(f"duplicate HTML ids: {', '.join(duplicate_ids)}")

    missing_assets = [asset for asset in parser.assets if not (ROOT / asset).is_file()]
    if missing_assets:
        fail(f"missing referenced assets: {', '.join(missing_assets)}")

    disallowed_copy = ["Illustrative prototype data", "job-posting growth", "current numbers are not"]
    for phrase in disallowed_copy:
        if phrase.lower() in html.lower():
            fail(f"obsolete prototype copy remains in index.html: {phrase!r}")
    if "Official ACS 2024 data" not in html:
        fail("official data badge is missing from index.html")

    javascript = (ROOT / "assets/js/app.js").read_text(encoding="utf-8")
    targeted_ids = set(re.findall(r"getElementById\(['\"]([^'\"]+)['\"]\)", javascript))
    missing_targets = sorted(targeted_ids - set(parser.ids))
    if missing_targets:
        fail(f"JavaScript targets absent from HTML: {', '.join(missing_targets)}")

    obsolete_fields = {
        "job_posting_growth_pct",
        "median_salary",
        "median_rent",
        "salary_after_rent",
        "employment_growth_pct",
        "broadband_pct",
    }
    for field in obsolete_fields:
        if re.search(rf"\b{re.escape(field)}\b", javascript):
            fail(f"obsolete data field remains in app.js: {field}")

    source_fields, source_rows = read_csv(ROOT / "data/metro_source.csv")
    missing_source_fields = SOURCE_FIELDS - set(source_fields)
    if missing_source_fields:
        fail(f"source CSV missing columns: {', '.join(sorted(missing_source_fields))}")
    if len(source_rows) != 48:
        fail(f"source dataset should contain 48 metros, found {len(source_rows)}")

    source_names = [row["metro"] for row in source_rows]
    if len(source_names) != len(set(source_names)):
        fail("source CSV contains duplicate metro names")
    cbsa_codes = [row["cbsa_code"] for row in source_rows]
    if len(cbsa_codes) != len(set(cbsa_codes)):
        fail("source CSV contains duplicate CBSA codes")
    if any(not re.fullmatch(r"\d{5}", code) for code in cbsa_codes):
        fail("every CBSA code must contain exactly five digits")

    for line_number, row in enumerate(source_rows, start=2):
        numeric_ranges = {
            "population": (100_000, 30_000_000),
            "population_m": (0.1, 30),
            "resident_employment_growth_pct": (-20, 20),
            "employment_population_ratio_pct": (30, 85),
            "median_worker_earnings": (20_000, 150_000),
            "median_gross_rent": (500, 5_000),
            "bachelor_share_pct": (10, 80),
            "population_growth_pct": (-10, 10),
            "broadband_subscription_pct": (50, 100),
        }
        for field, (low, high) in numeric_ranges.items():
            try:
                value = float(row[field])
            except (KeyError, ValueError) as exc:
                fail(f"invalid {field} on source CSV line {line_number}")
            if not low <= value <= high:
                fail(f"{field}={value} outside expected range on source CSV line {line_number}")

    processed_fields, rows = read_csv(ROOT / "data/metro_opportunity.csv")
    if len(rows) != len(source_rows):
        fail("source and processed datasets have different metro counts")
    required_processed = {
        "opportunity_score",
        "career_score",
        "affordability_score",
        "education_score",
        "momentum_score",
        "connectivity_score",
        "earnings_after_rent",
        "rent_to_earnings_pct",
    }
    if required_processed - set(processed_fields):
        fail("processed dataset is missing score or derived fields")

    score_fields = [
        "opportunity_score",
        "career_score",
        "affordability_score",
        "education_score",
        "momentum_score",
        "connectivity_score",
    ]
    for line_number, row in enumerate(rows, start=2):
        for field in score_fields:
            try:
                value = float(row[field])
            except (KeyError, ValueError) as exc:
                fail(f"invalid {field} on processed CSV line {line_number}")
            if not 0 <= value <= 100:
                fail(f"{field} outside 0–100 on processed CSV line {line_number}")

    js_data = (ROOT / "data/metro-data.js").read_text(encoding="utf-8")
    match = re.search(r"window\.METRO_DATA\s*=\s*(\[.*\]);\s*$", js_data, flags=re.S)
    if not match:
        fail("could not parse data/metro-data.js")
    browser_rows = json.loads(match.group(1))
    if len(browser_rows) != len(rows):
        fail("browser data and processed CSV have different metro counts")
    if [row["metro"] for row in browser_rows] != [row["metro"] for row in rows]:
        fail("browser data and processed CSV ordering differs")

    manifest = json.loads((ROOT / "data/source_manifest.json").read_text(encoding="utf-8"))
    if manifest.get("reference_year") != 2024 or manifest.get("comparison_year") != 2023:
        fail("source manifest reference years are incorrect")
    if manifest.get("metro_count") != 48:
        fail("source manifest metro count is incorrect")

    outline = (ROOT / "data/us-outline.js").read_text(encoding="utf-8")
    if "window.US_OUTLINE" not in outline:
        fail("us-outline.js does not define window.US_OUTLINE")

    print("Validation passed")
    print(f"  Required files: {len(REQUIRED_FILES) + len(RAW_FILES)}")
    print(f"  HTML ids: {len(parser.ids)}")
    print(f"  Metro rows: {len(rows)}")
    print(f"  JavaScript HTML targets: {len(targeted_ids)}")
    print("  Data source: ACS 2023–2024 one-year estimates")


if __name__ == "__main__":
    main()
