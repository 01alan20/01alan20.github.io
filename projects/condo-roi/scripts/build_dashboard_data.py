#!/usr/bin/env python3
"""Build browser-ready condo investment data from pmi_roi_agg.csv.

Uses only the Python standard library. The source file remains the historical record;
this script derives transparent trend, screening and underwriter inputs.
"""
from __future__ import annotations

import csv
import json
import math
import re
import statistics
from collections import Counter, defaultdict
from datetime import date, datetime
from pathlib import Path
from typing import Any, Iterable

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "pmi_roi_agg.csv"
RECENT = ROOT / "data" / "recent_snapshot.csv"
OUT_JS = ROOT / "data" / "dashboard_data.js"
OUT_MARKET = ROOT / "data" / "market_annual.csv"
OUT_SNAPSHOT = ROOT / "data" / "investment_snapshot.csv"
ALLOWED_TYPES = {"Apartment", "Condominium", "Executive Condominium"}


def number(value: Any) -> float | None:
    if value is None:
        return None
    text = str(value).strip().replace(",", "")
    if not text or text.lower() in {"nan", "none", "null"}:
        return None
    try:
        value = float(text)
        return value if math.isfinite(value) else None
    except ValueError:
        return None


def median(values: Iterable[float | None]) -> float | None:
    valid = [float(v) for v in values if v is not None and math.isfinite(float(v))]
    return statistics.median(valid) if valid else None


def mean(values: Iterable[float | None]) -> float | None:
    valid = [float(v) for v in values if v is not None and math.isfinite(float(v))]
    return sum(valid) / len(valid) if valid else None


def pct_change(first: float | None, last: float | None) -> float | None:
    if first is None or last is None or first == 0:
        return None
    return (last / first - 1) * 100


def normalise_project(value: str) -> str:
    value = (value or "").upper().replace("@", " AT ")
    value = re.sub(r"[^A-Z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def mode(values: Iterable[str]) -> str:
    valid = [v for v in values if v]
    return Counter(valid).most_common(1)[0][0] if valid else ""


def parse_area(bucket: str) -> tuple[float | None, float | None, float | None]:
    bucket = (bucket or "").strip()
    nums = [float(x) for x in re.findall(r"\d+(?:\.\d+)?", bucket)]
    if not nums:
        return None, None, None
    if bucket.startswith(">"):
        return nums[0], None, nums[0] + 25
    if bucket.startswith("<="):
        return None, nums[0], nums[0] / 2
    if len(nums) == 1:
        return nums[0], nums[0], nums[0]
    return nums[0], nums[1], (nums[0] + nums[1]) / 2


def bedroom_estimate(mid: float | None) -> str:
    if mid is None:
        return "Unknown"
    if mid < 55:
        return "1"
    if mid < 85:
        return "2"
    if mid < 120:
        return "3"
    if mid < 170:
        return "4"
    return "5+"


def tenure_group(tenure: str) -> tuple[str, int | None]:
    text = (tenure or "").strip()
    if not text:
        return "Unknown", None
    if re.search(r"freehold", text, re.I):
        return "Freehold", None
    match = re.search(r"(\d+)\s*yrs?\s+lease\s+commencing\s+from\s+(\d{4})", text, re.I)
    if match:
        years, start = int(match.group(1)), int(match.group(2))
        remaining = max(0, years - (date.today().year - start))
        if years >= 900:
            return "999-year", remaining
        if years <= 120:
            return "99-year", remaining
        return f"{years}-year", remaining
    return "Other", None


def clean_round(value: float | None, digits: int = 2) -> float | None:
    return round(value, digits) if value is not None and math.isfinite(value) else None


def parse_date(value: str | None) -> date | None:
    if not value:
        return None
    for fmt in ("%Y-%m-%d", "%Y-%m", "%d/%m/%Y", "%m/%Y"):
        try:
            return datetime.strptime(str(value), fmt).date()
        except ValueError:
            pass
    return None


def months_old(value: str | None) -> int | None:
    parsed = parse_date(value)
    if not parsed:
        return None
    today = date.today()
    return max(0, (today.year - parsed.year) * 12 + today.month - parsed.month)


def recent_map() -> dict[tuple[str, str], dict[str, str]]:
    if not RECENT.exists():
        return {}
    with RECENT.open(newline="", encoding="utf-8-sig") as handle:
        return {
            (normalise_project(row.get("project", "")), row.get("area_bucket", "").strip()): row
            for row in csv.DictReader(handle)
            if row.get("project") and row.get("area_bucket")
        }


def main() -> None:
    with SOURCE.open(newline="", encoding="utf-8-sig") as handle:
        raw = list(csv.DictReader(handle))
    if not raw:
        raise SystemExit("Source CSV is empty")

    year_re = re.compile(r"avg_(?:buy|rent)_(\d{4})$")
    years = sorted({int(m.group(1)) for col in raw[0] if (m := year_re.match(col))})
    if not years:
        raise SystemExit("No annual avg_buy_YYYY / avg_rent_YYYY columns found")

    metadata: dict[str, dict[str, str]] = defaultdict(dict)
    for row in raw:
        project = (row.get("project") or "").strip()
        if not project:
            continue
        for field in ("district", "tenure", "propertyType"):
            value = (row.get(field) or "").strip()
            if value:
                metadata[project][field] = value

    recent = recent_map()
    records: list[dict[str, Any]] = []

    for row in raw:
        project = (row.get("project") or "").strip()
        area = (row.get("area_bucket") or "").strip()
        if not project or not area:
            continue
        meta = metadata[project]
        prop_type = (row.get("propertyType") or meta.get("propertyType") or "").strip()
        if prop_type not in ALLOWED_TYPES:
            continue
        district_num = number(row.get("district") or meta.get("district"))
        district = f"District {int(district_num):02d}" if district_num is not None else "Unknown"
        tenure = (row.get("tenure") or meta.get("tenure") or "Unknown").strip()
        t_group, remaining = tenure_group(tenure)
        _, _, mid = parse_area(area)

        buys = [number(row.get(f"avg_buy_{year}")) for year in years]
        rents = [number(row.get(f"avg_rent_{year}")) for year in years]
        yields = [
            rent * 12 / buy * 100 if buy and rent else None
            for buy, rent in zip(buys, rents)
        ]
        paired_years = [years[i] for i, (b, r) in enumerate(zip(buys, rents)) if b and r]
        first_pair = paired_years[0] if paired_years else None
        last_pair = paired_years[-1] if paired_years else None
        first_idx = years.index(first_pair) if first_pair is not None else None
        last_idx = years.index(last_pair) if last_pair is not None else None

        latest_buy = number(row.get("most_recent_buy"))
        latest_rent = number(row.get("most_recent_rent"))
        source_label = "Latest observed source values"
        sale_count = None
        rent_count = None
        latest_buy_date = (row.get("most_recent_buy_date") or "").strip() or None
        latest_rent_date = (row.get("most_recent_rent_date") or "").strip() or None
        market_segment = (row.get("market_segment") or "").strip() or None

        recent_row = recent.get((normalise_project(project), area))
        if recent_row:
            latest_buy = number(recent_row.get("median_buy_ttm")) or latest_buy
            latest_rent = number(recent_row.get("median_rent_ttm")) or latest_rent
            sale_count = number(recent_row.get("buy_count_ttm"))
            rent_count = number(recent_row.get("rent_count_ttm"))
            latest_buy_date = recent_row.get("latest_buy_date") or latest_buy_date
            latest_rent_date = recent_row.get("latest_rent_date") or latest_rent_date
            market_segment = recent_row.get("market_segment") or market_segment
            source_label = "Trailing 12-month URA median"

        gross_yield = latest_rent * 12 / latest_buy * 100 if latest_buy and latest_rent else None
        payback = 100 / gross_yield if gross_yield else None

        if sale_count is not None or rent_count is not None:
            age = max(months_old(latest_buy_date) or 999, months_old(latest_rent_date) or 999)
            if (sale_count or 0) >= 5 and (rent_count or 0) >= 10 and age <= 6:
                grade, evidence = "High", "Recent transaction depth"
            elif (sale_count or 0) >= 3 and (rent_count or 0) >= 5 and age <= 12:
                grade, evidence = "Medium", "Moderate recent depth"
            else:
                grade, evidence = "Low", "Thin or stale recent sample"
        else:
            paired = len(paired_years)
            if latest_buy and latest_rent and paired >= 4:
                grade, evidence = "Strong history", f"{paired} paired annual observations"
            elif latest_buy and latest_rent and paired >= 3:
                grade, evidence = "Moderate history", f"{paired} paired annual observations"
            elif latest_buy and latest_rent:
                grade, evidence = "Thin history", f"{paired} paired annual observation"
            else:
                grade, evidence = "Incomplete", "Missing latest price or rent"

        rec = {
            "project": project,
            "area": area,
            "district": district,
            "districtNumber": int(district_num) if district_num is not None else None,
            "tenure": tenure,
            "tenureGroup": t_group,
            "remainingLease": remaining,
            "propertyType": prop_type,
            "marketSegment": market_segment,
            "sizeMid": clean_round(mid, 1),
            "bedrooms": bedroom_estimate(mid),
            "latestBuy": clean_round(latest_buy, 0),
            "latestRent": clean_round(latest_rent, 0),
            "grossYield": clean_round(gross_yield, 3),
            "payback": clean_round(payback, 2),
            "priceGrowth": clean_round(pct_change(buys[first_idx], buys[last_idx]) if first_idx is not None else None, 2),
            "rentGrowth": clean_round(pct_change(rents[first_idx], rents[last_idx]) if first_idx is not None else None, 2),
            "yieldChange": clean_round((yields[last_idx] - yields[first_idx]) if first_idx is not None and yields[first_idx] is not None and yields[last_idx] is not None else None, 3),
            "firstPairedYear": first_pair,
            "lastPairedYear": last_pair,
            "pairedYears": len(paired_years),
            "evidenceGrade": grade,
            "evidenceNote": evidence,
            "sourceLabel": source_label,
            "saleCount": int(sale_count) if sale_count is not None else None,
            "rentCount": int(rent_count) if rent_count is not None else None,
            "latestBuyDate": latest_buy_date,
            "latestRentDate": latest_rent_date,
            "buy": [clean_round(v, 0) for v in buys],
            "rent": [clean_round(v, 0) for v in rents],
            "yield": [clean_round(v, 3) for v in yields],
        }
        records.append(rec)

    # Relative benchmarks using the visible investment universe.
    district_yields: dict[str, list[float]] = defaultdict(list)
    district_prices: dict[str, list[float]] = defaultdict(list)
    size_yields: dict[str, list[float]] = defaultdict(list)
    for rec in records:
        if rec["grossYield"] is not None:
            district_yields[rec["district"]].append(rec["grossYield"])
            size_yields[rec["area"]].append(rec["grossYield"])
        if rec["latestBuy"] is not None:
            district_prices[rec["district"]].append(rec["latestBuy"])
    for rec in records:
        dy = median(district_yields[rec["district"]])
        sy = median(size_yields[rec["area"]])
        dp = median(district_prices[rec["district"]])
        rec["districtYieldMedian"] = clean_round(dy, 3)
        rec["districtYieldPremium"] = clean_round(rec["grossYield"] - dy if rec["grossYield"] is not None and dy is not None else None, 3)
        rec["sizeYieldPremium"] = clean_round(rec["grossYield"] - sy if rec["grossYield"] is not None and sy is not None else None, 3)
        rec["districtPriceDiscount"] = clean_round((dp - rec["latestBuy"]) / dp * 100 if rec["latestBuy"] is not None and dp else None, 2)

    # Annual market summary is based on medians across project-size observations, not transaction weights.
    market_rows: list[dict[str, Any]] = []
    for idx, year in enumerate(years):
        buy_values = [rec["buy"][idx] for rec in records if rec["buy"][idx] is not None]
        rent_values = [rec["rent"][idx] for rec in records if rec["rent"][idx] is not None]
        yield_values = [rec["yield"][idx] for rec in records if rec["yield"][idx] is not None]
        market_rows.append({
            "year": year,
            "median_buy": clean_round(median(buy_values), 0),
            "median_rent": clean_round(median(rent_values), 0),
            "median_gross_yield": clean_round(median(yield_values), 3),
            "buy_coverage": len(buy_values),
            "rent_coverage": len(rent_values),
            "paired_coverage": len(yield_values),
        })

    paired_records = [rec for rec in records if rec["latestBuy"] and rec["latestRent"] and rec["grossYield"]]
    meta = {
        "generated": datetime.now().isoformat(timespec="seconds"),
        "years": years,
        "latestYear": max(years),
        "sourceRows": len(raw),
        "investmentRows": len(records),
        "pairedRows": len(paired_records),
        "projects": len({rec["project"] for rec in records}),
        "districts": len({rec["district"] for rec in records if rec["district"] != "Unknown"}),
        "dataNote": "Historical annual averages through the latest source year. The latest year may be partial. Market summaries are medians across project-size observations, not transaction-weighted market indices.",
        "recentSnapshotLoaded": bool(recent),
    }

    browser_fields = [
        "project", "area", "districtNumber", "tenure", "tenureGroup", "remainingLease",
        "propertyType", "marketSegment", "sizeMid", "bedrooms", "latestBuy", "latestRent",
        "grossYield", "payback", "priceGrowth", "rentGrowth", "yieldChange",
        "firstPairedYear", "lastPairedYear", "pairedYears", "evidenceGrade",
        "saleCount", "rentCount", "latestBuyDate", "latestRentDate",
        "buy", "rent", "yield", "districtYieldMedian", "districtYieldPremium",
        "sizeYieldPremium", "districtPriceDiscount"
    ]
    browser_records = [[rec.get(field) for field in browser_fields] for rec in records]
    payload = {"meta": meta, "market": market_rows, "schema": browser_fields, "records": browser_records}
    OUT_JS.parent.mkdir(parents=True, exist_ok=True)
    OUT_JS.write_text("window.CONDO_DATA=" + json.dumps(payload, separators=(",", ":"), ensure_ascii=False) + ";\n", encoding="utf-8")

    with OUT_MARKET.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(market_rows[0]))
        writer.writeheader(); writer.writerows(market_rows)

    fields = [
        "project", "area", "district", "tenure", "tenureGroup", "remainingLease", "propertyType",
        "marketSegment", "bedrooms", "latestBuy", "latestRent", "grossYield", "payback",
        "priceGrowth", "rentGrowth", "yieldChange", "districtYieldPremium", "sizeYieldPremium",
        "districtPriceDiscount", "evidenceGrade", "evidenceNote", "saleCount", "rentCount",
        "latestBuyDate", "latestRentDate", "sourceLabel",
    ]
    with OUT_SNAPSHOT.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows({field: rec.get(field) for field in fields} for rec in records if rec["latestBuy"] or rec["latestRent"])

    print(f"Built {OUT_JS.relative_to(ROOT)} with {len(records):,} investment rows")
    print(f"Paired price/rent rows: {len(paired_records):,}")
    print(f"Years: {years[0]}-{years[-1]}")


if __name__ == "__main__":
    main()
