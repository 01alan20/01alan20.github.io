#!/usr/bin/env python3
"""
Download expanded IPEDS Complete Data Files for The Enrollment Squeeze.

Examples
--------
python download_ipeds_expanded.py --tier core --output data/raw/ipeds
python download_ipeds_expanded.py --tier core extended --output data/raw/ipeds
python download_ipeds_expanded.py --tier all --output data/raw/ipeds
python download_ipeds_expanded.py --codes EF2024C F2324_F1A F2324_F2
"""
from __future__ import annotations

import argparse
import csv
import io
import sys
import time
import zipfile
from pathlib import Path
from urllib.parse import quote

import requests

BASE_URL = "https://nces.ed.gov/ipeds/datacenter/data/{code}.zip"
DEFAULT_MANIFEST = Path(__file__).with_name("ipeds_download_manifest_expanded.csv")


def load_manifest(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def valid_zip_bytes(content: bytes) -> bool:
    if len(content) < 4 or content[:2] != b"PK":
        return False
    try:
        with zipfile.ZipFile(io.BytesIO(content)) as zf:
            bad = zf.testzip()
            return bad is None and len(zf.namelist()) > 0
    except zipfile.BadZipFile:
        return False


def download_file(
    session: requests.Session,
    code: str,
    output_dir: Path,
    retries: int,
    timeout: int,
    force: bool,
) -> tuple[bool, str]:
    target = output_dir / f"{code}.zip"

    if target.exists() and not force:
        try:
            with zipfile.ZipFile(target) as zf:
                if zf.testzip() is None and zf.namelist():
                    return True, f"cached: {target.name}"
        except zipfile.BadZipFile:
            pass

    url = BASE_URL.format(code=quote(code))
    last_error = ""

    for attempt in range(1, retries + 1):
        try:
            response = session.get(url, timeout=timeout, allow_redirects=True)
            if response.status_code != 200:
                last_error = f"HTTP {response.status_code}"
            elif not valid_zip_bytes(response.content):
                preview = response.content[:100].decode("utf-8", errors="replace")
                last_error = f"response was not a valid ZIP: {preview!r}"
            else:
                target.write_bytes(response.content)
                return True, f"downloaded: {target.name} ({target.stat().st_size:,} bytes)"
        except requests.RequestException as exc:
            last_error = str(exc)

        if attempt < retries:
            wait = min(30, 2 ** attempt)
            print(f"  retry {attempt}/{retries} after {wait}s: {last_error}")
            time.sleep(wait)

    return False, f"FAILED {code}: {last_error}"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--manifest",
        type=Path,
        default=DEFAULT_MANIFEST,
        help="CSV manifest containing file_code and tier columns",
    )
    parser.add_argument(
        "--tier",
        nargs="+",
        default=["core"],
        choices=["core", "extended", "finance_history", "all"],
    )
    parser.add_argument(
        "--codes",
        nargs="*",
        help="Download only these exact IPEDS file codes",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("data/raw/ipeds"),
    )
    parser.add_argument("--retries", type=int, default=4)
    parser.add_argument("--timeout", type=int, default=90)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    rows = load_manifest(args.manifest)

    if args.codes:
        codes = list(dict.fromkeys(args.codes))
    else:
        tiers = set(args.tier)
        if "all" in tiers:
            tiers = {"core", "extended", "finance_history"}
        codes = [
            row["file_code"]
            for row in rows
            if row["tier"] in tiers
        ]
        codes = list(dict.fromkeys(codes))

    args.output.mkdir(parents=True, exist_ok=True)

    session = requests.Session()
    session.headers.update({
        "User-Agent": (
            "EnrollmentSqueezeResearch/1.0 "
            "(public higher-education data analysis)"
        )
    })

    print(f"Downloading {len(codes)} IPEDS files to {args.output.resolve()}")
    failures: list[str] = []

    for index, code in enumerate(codes, start=1):
        print(f"[{index:>2}/{len(codes)}] {code}")
        ok, message = download_file(
            session=session,
            code=code,
            output_dir=args.output,
            retries=args.retries,
            timeout=args.timeout,
            force=args.force,
        )
        print(f"  {message}")
        if not ok:
            failures.append(code)
        time.sleep(0.5)

    print()
    if failures:
        print(f"Completed with {len(failures)} failures:")
        print("  " + ", ".join(failures))
        print(
            "The IPEDS Complete Data Files service may still be intermittent. "
            "Re-run the same command; verified ZIPs will be reused."
        )
        return 1

    print("All requested files downloaded and ZIP-validated.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
