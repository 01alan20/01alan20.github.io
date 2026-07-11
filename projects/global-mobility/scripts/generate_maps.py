#!/usr/bin/env python3
"""Generate inline SVG basemap geometry for the browser.

The world and Europe country boundaries are transformed directly into the exact
SVG coordinate systems used by assets/js/app.js. The basemap, routes, and nodes
therefore render inside one SVG rather than as separately scaled layers.
"""

from __future__ import annotations

import json
from pathlib import Path

import pyogrio
from shapely.geometry import GeometryCollection, MultiPolygon, Polygon, box

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data" / "naturalearth_lowres.geojson"
OUTPUT = ROOT / "assets" / "js" / "map-data.js"


def polygons(geometry):
    if geometry is None or geometry.is_empty:
        return
    if isinstance(geometry, Polygon):
        yield geometry
    elif isinstance(geometry, MultiPolygon):
        yield from geometry.geoms
    elif isinstance(geometry, GeometryCollection):
        for child in geometry.geoms:
            yield from polygons(child)


def polygon_path(polygon: Polygon, bounds, width: float, height: float) -> str:
    lon_min, lon_max, lat_min, lat_max = bounds

    def project(longitude: float, latitude: float) -> tuple[float, float]:
        x = (longitude - lon_min) / (lon_max - lon_min) * width
        y = (lat_max - latitude) / (lat_max - lat_min) * height
        return x, y

    pieces: list[str] = []
    for ring in [polygon.exterior, *polygon.interiors]:
        coordinates = list(ring.coords)
        if len(coordinates) < 3:
            continue
        projected = [project(x, y) for x, y in coordinates]
        commands = [f"M {projected[0][0]:.2f} {projected[0][1]:.2f}"]
        commands.extend(f"L {x:.2f} {y:.2f}" for x, y in projected[1:])
        commands.append("Z")
        pieces.append(" ".join(commands))
    return " ".join(pieces)


def build_paths(frame, bounds, width: int, height: int, clip: bool) -> list[str]:
    clipping_box = box(bounds[0], bounds[2], bounds[1], bounds[3])
    paths: list[str] = []
    for geometry in frame.geometry:
        if geometry is None:
            continue
        if clip:
            geometry = geometry.intersection(clipping_box)
        for polygon in polygons(geometry):
            if not polygon.is_empty:
                paths.append(polygon_path(polygon, bounds, width, height))
    return paths


def main() -> None:
    world = pyogrio.read_dataframe(SOURCE)
    payload = {
        "world": {
            "width": 1200,
            "height": 483,
            "paths": build_paths(world, (-180, 180, -60, 85), 1200, 483, False),
        },
        "europe": {
            "width": 900,
            "height": 585,
            "paths": build_paths(world, (-18, 50, 31, 76), 900, 585, True),
        },
    }
    OUTPUT.write_text(
        "window.MOBILITY_MAP_DATA = " + json.dumps(payload, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )
    print(
        f"Generated {len(payload['world']['paths'])} world paths and "
        f"{len(payload['europe']['paths'])} Europe paths in {OUTPUT.relative_to(ROOT)}."
    )


if __name__ == "__main__":
    main()
