# Raw source files

This folder contains the raw and source files currently available for **The Enrollment Squeeze**.

## Original raw-source archive

`The Enrollment Squeeze - Copy.rar` is the original project archive supplied in the conversation. It contains:

- WICHE raw projection workbook:
  - `sources/raw/wiche/wiche_knocking_11th.xlsx`
- College Scorecard raw/reference files:
  - `sources/raw/scorecard/CollegeScorecardDataDictionary.xlsx`
  - `sources/raw/scorecard/scorecard_elements_march_2024.csv`
  - `sources/raw/scorecard/scorecard_finance_snapshot_april_2022.csv`
- Census raw files:
  - `sources/raw/census_county_broad_age_2020_2025.csv`
  - state-level single-age Census CSVs under `sources/raw/census_single_age/`
- Source manifest and data notes
- Derived phase 1–5 CSV and JSON outputs
- Original scripts, tests, methodology, and website files

The archive is included unchanged so no source material is lost.

## IPEDS

The official raw IPEDS ZIP files are **not present** in the available project files.

Included instead:

- `ipeds_download_manifest_expanded.csv`
- `download_ipeds_expanded.py`

These identify and download the required IPEDS components when run in an environment with NCES access.

## Inventory

- `RAW_SOURCE_INVENTORY.csv` lists every file in the original RAR archive and its stored size.
- `RAW_SOURCE_CONTENTS.txt` provides a plain-text path listing.

## Website data

The `website/data/` directory contains the compact JSON and JavaScript data files used directly by the offline prototype.

The prototype data include illustrative fallback records and should not be treated as the final reconciled IPEDS production dataset.
