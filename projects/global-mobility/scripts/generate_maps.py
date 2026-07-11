#!/usr/bin/env python3
"""Generate basemaps that use the same linear projections as the browser overlays.

The previous basemaps used a different map projection from the JavaScript point
coordinates. That made otherwise-correct country coordinates appear in oceans or
on the wrong landmass. These maps are deliberately equirectangular and use the
same geographic bounds as assets/js/app.js.
"""

from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pyogrio

ROOT = Path(__file__).resolve().parents[1]
FIXTURE = ROOT / "data" / "naturalearth_lowres.geojson"

LAND = "#d7d6d0"
COAST = "#b7b3a9"


def render_map(path: Path, *, bounds: tuple[float, float, float, float], size: tuple[float, float]) -> None:
    lon_min, lon_max, lat_min, lat_max = bounds
    world = pyogrio.read_dataframe(FIXTURE)

    fig = plt.figure(figsize=size, dpi=100, frameon=False)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(lon_min, lon_max)
    ax.set_ylim(lat_min, lat_max)
    ax.set_axis_off()
    ax.set_facecolor("none")

    world.plot(ax=ax, color=LAND, edgecolor=COAST, linewidth=0.35)

    fig.savefig(
        path,
        format="svg",
        transparent=True,
        bbox_inches=None,
        pad_inches=0,
        metadata={"Creator": "Global Student Highways map generator"},
    )
    plt.close(fig)


if __name__ == "__main__":
    output = ROOT / "assets" / "img"
    output.mkdir(parents=True, exist_ok=True)

    # These bounds must remain synchronized with worldProject/europeProject.
    render_map(
        output / "world-map.svg",
        bounds=(-180, 180, -60, 85),
        size=(12.0, 4.83),
    )
    render_map(
        output / "europe-map.svg",
        bounds=(-18, 50, 31, 76),
        size=(9.0, 5.85),
    )
    print("Generated projection-matched world and Europe basemaps.")
