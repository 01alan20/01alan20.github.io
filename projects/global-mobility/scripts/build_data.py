#!/usr/bin/env python3
"""Build the browser dataset for Global Student Highways.

The script combines the checked-in global CSV files with the full Erasmus+
Pajek network, recalculates all derived European metrics, and writes:

- data/erasmus_country_flows.csv
- data/erasmus_country_summary.csv
- assets/js/data.js

No web access is required.
"""

from __future__ import annotations

import csv
import json
import math
from collections import defaultdict
from pathlib import Path
from typing import Any, Iterable

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
OUTPUT_JS = ROOT / "assets" / "js" / "data.js"


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def write_csv(path: Path, fieldnames: list[str], rows: Iterable[dict[str, Any]]) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def parse_pajek(path: Path) -> tuple[list[str], list[tuple[str, str, int]]]:
    vertices: dict[int, str] = {}
    arcs: list[tuple[str, str, int]] = []
    mode: str | None = None

    for raw_line in path.read_text(encoding="utf-8-sig").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("%"):
            continue
        lower = line.lower()
        if lower.startswith("*vertices"):
            mode = "vertices"
            continue
        if lower.startswith("*arcs"):
            mode = "arcs"
            continue
        if mode == "vertices":
            index, label = line.split(maxsplit=1)
            vertices[int(index)] = label.strip().strip('"')
        elif mode == "arcs":
            source, target, weight = line.split()[:3]
            arcs.append((vertices[int(source)], vertices[int(target)], int(float(weight))))

    return list(vertices.values()), arcs


def effective_partner_diversity(values: list[int], country_count: int) -> float:
    """Return effective partner count as a percentage of all countries.

    This is the reciprocal Herfindahl effective-number-of-partners measure,
    normalised by the 34-country European network used in this project.
    """
    total = sum(values)
    if total <= 0:
        return 0.0
    shares = [value / total for value in values if value > 0]
    effective_partners = 1 / sum(share * share for share in shares)
    return round(effective_partners / country_count * 100, 1)


def top_share(values: list[int], count: int = 3) -> float:
    total = sum(values)
    if total <= 0:
        return 0.0
    return round(sum(sorted(values, reverse=True)[:count]) / total * 100, 1)


def typed_global_totals() -> list[dict[str, Any]]:
    rows = read_csv(DATA_DIR / "global_totals.csv")
    return [
        {
            "year": int(row["year"]),
            "students": int(row["students"]),
            "status": row["status"],
            "note": row["note"],
        }
        for row in rows
    ]


def typed_global_corridors() -> list[dict[str, Any]]:
    rows = read_csv(DATA_DIR / "global_major_corridors.csv")
    return [
        {
            "year": int(row["year"]),
            "origin": row["origin"],
            "destination": row["destination"],
            "students": int(row["students"]),
            "origin_region": row["origin_region"],
            "status": row["status"],
        }
        for row in rows
    ]


def typed_global_countries() -> list[dict[str, Any]]:
    rows = read_csv(DATA_DIR / "global_2023_countries.csv")
    return [
        {
            "type": row["type"],
            "country": row["country"],
            "students": int(row["students"]),
            "rank": int(row["rank"]),
        }
        for row in rows
    ]


def read_coordinates() -> dict[str, list[float]]:
    rows = read_csv(DATA_DIR / "country_coordinates.csv")
    return {
        row["country"]: [float(row["longitude"]), float(row["latitude"])]
        for row in rows
    }


def build_erasmus() -> tuple[list[dict[str, Any]], list[dict[str, Any]], dict[str, Any]]:
    vertices, arcs = parse_pajek(DATA_DIR / "ErasmusFlows.net")
    countries = sorted(country for country in vertices if country != "Rest of the world")
    country_count = len(countries)

    cross_border = [
        (origin, destination, participants)
        for origin, destination, participants in arcs
        if origin != destination
        and origin != "Rest of the world"
        and destination != "Rest of the world"
    ]
    cross_border.sort(key=lambda row: row[2], reverse=True)

    browser_flows = [
        {"origin": origin, "destination": destination, "participants": participants}
        for origin, destination, participants in cross_border[:180]
    ]

    outbound_values: dict[str, list[int]] = defaultdict(list)
    inbound_values: dict[str, list[int]] = defaultdict(list)
    outbound_totals: dict[str, int] = defaultdict(int)
    inbound_totals: dict[str, int] = defaultdict(int)

    for origin, destination, participants in cross_border:
        outbound_values[origin].append(participants)
        inbound_values[destination].append(participants)
        outbound_totals[origin] += participants
        inbound_totals[destination] += participants

    summary: list[dict[str, Any]] = []
    for country in countries:
        outbound = outbound_totals[country]
        inbound = inbound_totals[country]
        summary.append(
            {
                "country": country,
                "outbound": outbound,
                "inbound": inbound,
                "balance": inbound - outbound,
                "outbound_diversity": effective_partner_diversity(outbound_values[country], country_count),
                "inbound_diversity": effective_partner_diversity(inbound_values[country], country_count),
                "top3_outbound_share": top_share(outbound_values[country]),
                "top3_inbound_share": top_share(inbound_values[country]),
            }
        )

    largest_route = browser_flows[0]
    top_inbound = max(summary, key=lambda row: row["inbound"])
    top_outbound = max(summary, key=lambda row: row["outbound"])
    metrics = {
        "cross_border_participants": sum(participants for _, _, participants in cross_border),
        "countries": country_count,
        "routes": len(cross_border),
        "largest_route": largest_route,
        "top_inbound": top_inbound,
        "top_outbound": top_outbound,
    }
    return browser_flows, summary, metrics


def build() -> dict[str, Any]:
    totals = typed_global_totals()
    global_start = totals[0]["students"]
    global_end = totals[-1]["students"]
    periods = totals[-1]["year"] - totals[0]["year"]
    global_metrics = {
        "absolute_growth": global_end - global_start,
        "percent_growth": round((global_end / global_start - 1) * 100, 1),
        "cagr": round(((global_end / global_start) ** (1 / periods) - 1) * 100, 1),
        "start": global_start,
        "end": global_end,
    }

    erasmus_flows, erasmus_summary, erasmus_metrics = build_erasmus()
    metadata = json.loads((DATA_DIR / "sources.json").read_text(encoding="utf-8"))

    write_csv(
        DATA_DIR / "erasmus_country_flows.csv",
        ["origin", "destination", "participants"],
        erasmus_flows,
    )
    write_csv(
        DATA_DIR / "erasmus_country_summary.csv",
        [
            "country",
            "outbound",
            "inbound",
            "balance",
            "outbound_diversity",
            "inbound_diversity",
            "top3_outbound_share",
            "top3_inbound_share",
        ],
        erasmus_summary,
    )

    payload = {
        "globalTotals": totals,
        "globalCorridors": typed_global_corridors(),
        "globalCountries2023": typed_global_countries(),
        "erasmusFlows": erasmus_flows,
        "erasmusSummary": erasmus_summary,
        "coordinates": read_coordinates(),
        "globalMetrics": global_metrics,
        "erasmusMetrics": erasmus_metrics,
        "metadata": metadata,
    }
    OUTPUT_JS.write_text(
        "window.MOBILITY_DATA = "
        + json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )
    return payload


if __name__ == "__main__":
    result = build()
    print(
        "Built assets/js/data.js with "
        f"{len(result['globalCorridors'])} global corridor records, "
        f"{len(result['erasmusFlows'])} browser Erasmus routes, and "
        f"{result['erasmusMetrics']['routes']} full-network European routes."
    )
