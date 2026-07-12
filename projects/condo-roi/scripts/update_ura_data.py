#!/usr/bin/env python3
"""Fetch recent URA residential sales/rentals and append 2025+ data.

Credentials are read from environment variables and never written into site assets:
  URA_ACCESS_KEY  required
  URA_TOKEN       optional; a fresh daily token is generated when omitted

The script deliberately preserves pre-2025 history in pmi_roi_agg.csv.
"""
from __future__ import annotations

import argparse
import csv
import json
import math
import os
import re
import statistics
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
from collections import defaultdict
from datetime import date, datetime
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "pmi_roi_agg.csv"
RAW_ROOT = ROOT / "data" / "raw"
RECENT_OUT = ROOT / "data" / "recent_snapshot.csv"
ALIASES = ROOT / "config" / "project_aliases.csv"
BASE = "https://eservice.ura.gov.sg/uraDataService"
ALLOWED_SALE_TYPES = {"Apartment", "Condominium", "Executive Condominium"}


def decode_json_bytes(raw: bytes, declared_charset: str | None = None) -> dict[str, Any]:
    """Decode URA JSON even when a response contains malformed or legacy bytes."""
    encodings: list[str] = []
    if declared_charset:
        encodings.append(declared_charset)
    encodings.extend(["utf-8-sig", "utf-8", "cp1252", "latin-1"])

    attempted: list[str] = []
    for encoding in dict.fromkeys(encodings):
        attempted.append(encoding)
        try:
            text = raw.decode(encoding)
        except (LookupError, UnicodeDecodeError):
            continue
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            continue

    try:
        return json.loads(raw.decode("utf-8", errors="replace"))
    except json.JSONDecodeError as exc:
        preview = raw[:300].decode("latin-1", errors="replace")
        raise RuntimeError(
            "URA returned data that could not be decoded as JSON. "
            f"Tried {', '.join(attempted)}. Response starts with: {preview!r}"
        ) from exc


def get_json(url: str, headers: dict[str, str], timeout: int = 120) -> dict[str, Any]:
    request = urllib.request.Request(
        url,
        headers={**headers, "User-Agent": "condo-roi-data-updater/1.1"},
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            raw = response.read()
            declared_charset = response.headers.get_content_charset()
            payload = decode_json_bytes(raw, declared_charset)
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"URA request failed ({exc.code}): {body[:500]}") from exc
    if str(payload.get("Status", "")).lower() != "success":
        raise RuntimeError(f"URA request unsuccessful: {payload.get('Message') or payload}")
    return payload


def token_for(access_key: str, supplied: str | None) -> str:
    if supplied:
        return supplied
    payload = get_json(f"{BASE}/insertNewToken/v1", {"AccessKey": access_key})
    token = payload.get("Result")
    if not token:
        raise RuntimeError("URA token response did not contain Result")
    return str(token)


def parse_mm_yy(value: str | None) -> date | None:
    text = str(value or "").strip()
    if not re.fullmatch(r"\d{4}", text):
        return None
    month, short_year = int(text[:2]), int(text[2:])
    if not 1 <= month <= 12:
        return None
    return date(2000 + short_year, month, 1)


def normalise_project(value: str) -> str:
    value = (value or "").upper().replace("@", " AT ")
    value = re.sub(r"[^A-Z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def load_aliases() -> dict[str, str]:
    result: dict[str, str] = {}
    if not ALIASES.exists():
        return result
    with ALIASES.open(newline="", encoding="utf-8-sig") as handle:
        for row in csv.DictReader(handle):
            source = normalise_project(row.get("source_name", ""))
            target = (row.get("canonical_name") or "").strip()
            if source and target:
                result[source] = target
    return result


def canonical(name: str, aliases: dict[str, str]) -> str:
    return aliases.get(normalise_project(name), (name or "").strip().upper())


def area_bucket_from_sqm(value: Any) -> str | None:
    try:
        area = float(str(value).replace(",", ""))
    except (TypeError, ValueError):
        return None
    if not math.isfinite(area) or area <= 0:
        return None
    if area > 800:
        return ">800"
    if area > 300:
        lower = int(area // 50) * 50
        if lower < 300:
            lower = 300
        return f"{lower}-{lower + 50}"
    lower = int(area // 10) * 10
    if area == lower and lower > 0:
        # Use lower-inclusive 10 sqm bands, matching URA rental area labels.
        return f"{lower}-{lower + 10}"
    return f"{lower}-{lower + 10}"


def clean_area_label(value: str | None) -> str | None:
    text = re.sub(r"\s+", "", str(value or ""))
    if re.fullmatch(r"\d+-\d+", text) or re.fullmatch(r">\d+", text) or re.fullmatch(r"<=\d+", text):
        return text
    return None


def number(value: Any) -> float | None:
    try:
        out = float(str(value).replace(",", ""))
        return out if math.isfinite(out) else None
    except (TypeError, ValueError):
        return None


def median(values: list[float]) -> float | None:
    return statistics.median(values) if values else None


def mean(values: list[float]) -> float | None:
    return sum(values) / len(values) if values else None


def months_before(d: date, months: int) -> date:
    index = d.year * 12 + d.month - 1 - months
    return date(index // 12, index % 12 + 1, 1)


def quarter_codes(start_year: int, through: date) -> list[str]:
    codes = []
    for year in range(start_year, through.year + 1):
        max_q = (through.month - 1) // 3 + 1 if year == through.year else 4
        for q in range(1, max_q + 1):
            codes.append(f"{str(year)[2:]}q{q}")
    return codes


def save_raw(folder: Path, name: str, payload: dict[str, Any]) -> None:
    folder.mkdir(parents=True, exist_ok=True)
    (folder / name).write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")


def fetch(access_key: str, token: str, start_year: int) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    headers = {"AccessKey": access_key, "Token": token}
    snapshot = RAW_ROOT / date.today().isoformat()
    sales_projects: list[dict[str, Any]] = []
    rentals_projects: list[dict[str, Any]] = []

    for batch in range(1, 5):
        url = f"{BASE}/invokeUraDS/v1?service=PMI_Resi_Transaction&batch={batch}"
        payload = get_json(url, headers)
        save_raw(snapshot, f"sales_batch_{batch}.json", payload)
        sales_projects.extend(payload.get("Result") or [])
        print(f"Sales batch {batch}: {len(payload.get('Result') or []):,} projects")

    for code in quarter_codes(start_year, date.today()):
        query = urllib.parse.urlencode({"service": "PMI_Resi_Rental", "refPeriod": code})
        url = f"{BASE}/invokeUraDS/v1?{query}"
        try:
            payload = get_json(url, headers)
        except RuntimeError as exc:
            # The current quarter may not yet have a published payload.
            print(f"Skipping rental {code}: {exc}")
            continue
        save_raw(snapshot, f"rentals_{code}.json", payload)
        rentals_projects.extend(payload.get("Result") or [])
        print(f"Rental {code}: {len(payload.get('Result') or []):,} projects")

    return sales_projects, rentals_projects


def flatten(sales_projects: list[dict[str, Any]], rentals_projects: list[dict[str, Any]], aliases: dict[str, str], start_year: int) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    sales: list[dict[str, Any]] = []
    rentals: list[dict[str, Any]] = []

    for project_row in sales_projects:
        project = canonical(project_row.get("project", ""), aliases)
        for tx in project_row.get("transaction") or []:
            tx_date = parse_mm_yy(tx.get("contractDate"))
            prop_type = str(tx.get("propertyType") or "").strip()
            if not tx_date or tx_date.year < start_year or prop_type not in ALLOWED_SALE_TYPES:
                continue
            price = number(tx.get("price"))
            area = area_bucket_from_sqm(tx.get("area"))
            if not price or not area:
                continue
            sales.append({
                "project": project,
                "project_key": normalise_project(project),
                "area_bucket": area,
                "date": tx_date,
                "price": price,
                "district": str(tx.get("district") or "").lstrip("0") or None,
                "tenure": str(tx.get("tenure") or "").strip() or None,
                "property_type": prop_type,
                "market_segment": str(project_row.get("marketSegment") or "").strip() or None,
                "sale_type": str(tx.get("typeOfSale") or "").strip() or None,
            })

    for project_row in rentals_projects:
        project = canonical(project_row.get("project", ""), aliases)
        for tx in project_row.get("rental") or []:
            tx_date = parse_mm_yy(tx.get("leaseDate"))
            if not tx_date or tx_date.year < start_year:
                continue
            rent = number(tx.get("rent"))
            area = clean_area_label(tx.get("areaSqm"))
            if not rent or not area:
                continue
            rental_type = str(tx.get("propertyType") or "").strip()
            if rental_type not in {"Non-landed Properties", "Executive Condominium"}:
                continue
            rentals.append({
                "project": project,
                "project_key": normalise_project(project),
                "area_bucket": area,
                "date": tx_date,
                "rent": rent,
                "district": str(tx.get("district") or "").lstrip("0") or None,
                "property_type": "Executive Condominium" if rental_type == "Executive Condominium" else None,
                "bedrooms": str(tx.get("noOfBedRoom") or "").strip() or None,
            })
    return sales, rentals


def aggregate_and_merge(sales: list[dict[str, Any]], rentals: list[dict[str, Any]], start_year: int) -> None:
    today = date.today()
    ttm_start = months_before(today.replace(day=1), 11)
    sales_group: dict[tuple[str, str], list[dict[str, Any]]] = defaultdict(list)
    rent_group: dict[tuple[str, str], list[dict[str, Any]]] = defaultdict(list)
    for row in sales:
        sales_group[(row["project_key"], row["area_bucket"])].append(row)
    for row in rentals:
        rent_group[(row["project_key"], row["area_bucket"])].append(row)

    keys = set(sales_group) | set(rent_group)
    snapshot_rows: list[dict[str, Any]] = []
    annual: dict[tuple[str, str], dict[str, Any]] = {}
    for key in keys:
        s = sales_group.get(key, [])
        r = rent_group.get(key, [])
        project = (s[0] if s else r[0])["project"]
        area = key[1]
        s_ttm = [x for x in s if x["date"] >= ttm_start]
        r_ttm = [x for x in r if x["date"] >= ttm_start]
        latest_s = max(s, key=lambda x: x["date"]) if s else None
        latest_r = max(r, key=lambda x: x["date"]) if r else None
        metadata = {
            "district": next((x.get("district") for x in reversed(sorted(s, key=lambda x: x["date"])) if x.get("district")), None) or next((x.get("district") for x in r if x.get("district")), None),
            "tenure": next((x.get("tenure") for x in reversed(sorted(s, key=lambda x: x["date"])) if x.get("tenure")), None),
            "property_type": next((x.get("property_type") for x in reversed(sorted(s, key=lambda x: x["date"])) if x.get("property_type")), None) or next((x.get("property_type") for x in r if x.get("property_type")), None),
            "market_segment": next((x.get("market_segment") for x in s if x.get("market_segment")), None),
        }
        median_buy = median([x["price"] for x in s_ttm])
        median_rent = median([x["rent"] for x in r_ttm])
        gross_yield = median_rent * 12 / median_buy * 100 if median_buy and median_rent else None
        bedrooms = [x.get("bedrooms") for x in r_ttm if x.get("bedrooms")]
        snapshot_rows.append({
            "project": project,
            "area_bucket": area,
            **metadata,
            "bedrooms_mode": statistics.mode(bedrooms) if bedrooms else None,
            "median_buy_ttm": round(median_buy, 2) if median_buy else None,
            "median_rent_ttm": round(median_rent, 2) if median_rent else None,
            "gross_yield_ttm": round(gross_yield, 4) if gross_yield else None,
            "payback_years_ttm": round(100 / gross_yield, 3) if gross_yield else None,
            "buy_count_ttm": len(s_ttm),
            "rent_count_ttm": len(r_ttm),
            "latest_buy_date": latest_s["date"].isoformat() if latest_s else None,
            "latest_rent_date": latest_r["date"].isoformat() if latest_r else None,
        })
        values: dict[str, Any] = {**metadata, "project": project, "area_bucket": area}
        for year in range(start_year, today.year + 1):
            year_sales = [x["price"] for x in s if x["date"].year == year]
            year_rents = [x["rent"] for x in r if x["date"].year == year]
            values[f"avg_buy_{year}"] = mean(year_sales)
            values[f"avg_rent_{year}"] = mean(year_rents)
        values["most_recent_buy"] = latest_s["price"] if latest_s else None
        values["most_recent_rent"] = latest_r["rent"] if latest_r else None
        values["most_recent_buy_date"] = latest_s["date"].isoformat() if latest_s else None
        values["most_recent_rent_date"] = latest_r["date"].isoformat() if latest_r else None
        values["buy_count_ttm"] = len(s_ttm)
        values["rent_count_ttm"] = len(r_ttm)
        annual[key] = values

    RECENT_OUT.parent.mkdir(parents=True, exist_ok=True)
    snapshot_fields = [
        "project", "area_bucket", "district", "market_segment", "tenure", "property_type", "bedrooms_mode",
        "median_buy_ttm", "median_rent_ttm", "gross_yield_ttm", "payback_years_ttm", "buy_count_ttm",
        "rent_count_ttm", "latest_buy_date", "latest_rent_date",
    ]
    with RECENT_OUT.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=snapshot_fields)
        writer.writeheader(); writer.writerows(snapshot_rows)

    with SOURCE.open(newline="", encoding="utf-8-sig") as handle:
        existing = list(csv.DictReader(handle))
        existing_fields = list(existing[0]) if existing else []
    row_index: dict[tuple[str, str], dict[str, str]] = {
        (normalise_project(row.get("project", "")), (row.get("area_bucket") or "").strip()): row
        for row in existing if row.get("project") and row.get("area_bucket")
    }
    for key, updates in annual.items():
        row = row_index.get(key)
        if row is None:
            row = {field: "" for field in existing_fields}
            row["project"] = updates["project"]
            row["area_bucket"] = updates["area_bucket"]
            existing.append(row)
            row_index[key] = row
        mapping = {
            "district": updates.get("district"),
            "tenure": updates.get("tenure"),
            "propertyType": updates.get("property_type"),
            "market_segment": updates.get("market_segment"),
            "most_recent_buy": updates.get("most_recent_buy"),
            "most_recent_rent": updates.get("most_recent_rent"),
            "most_recent_buy_date": updates.get("most_recent_buy_date"),
            "most_recent_rent_date": updates.get("most_recent_rent_date"),
            "buy_count_ttm": updates.get("buy_count_ttm"),
            "rent_count_ttm": updates.get("rent_count_ttm"),
        }
        for year in range(start_year, today.year + 1):
            mapping[f"avg_buy_{year}"] = updates.get(f"avg_buy_{year}")
            mapping[f"avg_rent_{year}"] = updates.get(f"avg_rent_{year}")
        for field, value in mapping.items():
            if value not in (None, ""):
                row[field] = str(round(value, 6) if isinstance(value, float) else value)

    years = sorted({int(m.group(1)) for row in existing for field in row for m in [re.match(r"avg_(?:buy|rent)_(\d{4})$", field)] if m})
    for row in existing:
        buys = [number(row.get(f"avg_buy_{year}")) for year in years]
        rents = [number(row.get(f"avg_rent_{year}")) for year in years]
        row["avg_buy"] = str(round(mean([x for x in buys if x is not None]) or 0, 6)) if any(x is not None for x in buys) else ""
        row["avg_rent"] = str(round(mean([x for x in rents if x is not None]) or 0, 6)) if any(x is not None for x in rents) else ""
        buy = number(row.get("most_recent_buy")); rent = number(row.get("most_recent_rent"))
        row["ROI"] = str(round(buy / (rent * 12), 8)) if buy and rent else ""

    required_fields = [
        "market_segment", "most_recent_buy_date", "most_recent_rent_date", "buy_count_ttm", "rent_count_ttm"
    ] + [f"avg_buy_{year}" for year in range(start_year, today.year + 1)] + [f"avg_rent_{year}" for year in range(start_year, today.year + 1)]
    fields = existing_fields[:]
    for field in required_fields:
        if field not in fields:
            fields.append(field)

    backup = SOURCE.with_suffix(f".backup-{datetime.now().strftime('%Y%m%d-%H%M%S')}.csv")
    backup.write_bytes(SOURCE.read_bytes())
    with SOURCE.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
        writer.writeheader(); writer.writerows(existing)
    print(f"Updated {SOURCE.name}; backup: {backup.name}")
    print(f"Recent snapshot rows: {len(snapshot_rows):,}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--start-year", type=int, default=2025, help="Earliest year to refresh (default: 2025)")
    parser.add_argument("--token", help="Daily URA token; otherwise URA_TOKEN or automatic token generation")
    parser.add_argument("--no-build", action="store_true", help="Do not rebuild browser data after download")
    args = parser.parse_args()

    access_key = os.getenv("URA_ACCESS_KEY", "").strip()
    supplied_token = args.token or os.getenv("URA_TOKEN", "").strip() or None
    if not access_key:
        raise SystemExit("Set URA_ACCESS_KEY in your environment before running this script.")
    token = token_for(access_key, supplied_token)
    aliases = load_aliases()
    sales_projects, rentals_projects = fetch(access_key, token, args.start_year)
    sales, rentals = flatten(sales_projects, rentals_projects, aliases, args.start_year)
    print(f"Recent condo sales records: {len(sales):,}")
    print(f"Recent condo rental records: {len(rentals):,}")
    aggregate_and_merge(sales, rentals, args.start_year)

    if not args.no_build:
        subprocess.run([sys.executable, str(ROOT / "scripts" / "build_dashboard_data.py")], check=True)
        subprocess.run([sys.executable, str(ROOT / "scripts" / "validate_data.py")], check=True)


if __name__ == "__main__":
    main()
