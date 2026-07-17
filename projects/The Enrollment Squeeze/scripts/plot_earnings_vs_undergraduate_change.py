"""Create a standalone Seaborn scatter plot of earnings and observed UG change."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from matplotlib.lines import Line2D


PROJECT = Path(__file__).resolve().parents[1]
DEFAULT_DIAGNOSTICS = PROJECT / "data" / "institution_diagnostics.json"
DEFAULT_SCORECARD = PROJECT / "sources" / "raw" / "scorecard" / "scorecard_elements_march_2024.csv"
DEFAULT_CSV = PROJECT / "output" / "earnings_vs_undergraduate_change.csv"
DEFAULT_PNG = PROJECT / "output" / "earnings_vs_undergraduate_change.png"
DEFAULT_BANDS_PNG = PROJECT / "output" / "earnings_vs_undergraduate_change_bands.png"


def build_plot_data(diagnostics_path: Path, scorecard_path: Path) -> pd.DataFrame:
    diagnostics = pd.DataFrame(json.loads(diagnostics_path.read_text(encoding="utf-8")))
    scorecard = pd.read_csv(scorecard_path, usecols=["UNITID", "MD_EARN_WNE_P10"])
    scorecard = scorecard.rename(columns={"UNITID": "unitid", "MD_EARN_WNE_P10": "median_earnings_10_years"})
    scorecard["unitid"] = scorecard["unitid"].astype(str)
    scorecard["median_earnings_10_years"] = pd.to_numeric(scorecard["median_earnings_10_years"], errors="coerce")
    diagnostics["unitid"] = diagnostics["unitid"].astype(str)
    diagnostics["observed_ug_change"] = pd.to_numeric(diagnostics["change"], errors="coerce")
    diagnostics["current_ug"] = pd.to_numeric(diagnostics["currentUG"], errors="coerce")
    result = diagnostics.merge(scorecard, on="unitid", how="inner")
    result = result.dropna(subset=["median_earnings_10_years", "observed_ug_change", "current_ug"])
    result = result[result["median_earnings_10_years"] > 0].copy()
    result["control"] = result["control"].fillna("Other")
    return result[["unitid", "name", "state", "control", "current_ug", "observed_ug_change", "median_earnings_10_years"]].sort_values("name")


def create_plot(data: pd.DataFrame, output_path: Path) -> None:
    sns.set_theme(style="whitegrid", context="talk")
    fig, ax = plt.subplots(figsize=(15, 10), dpi=180)
    palette = {"Public": "#2f6fed", "Private nonprofit": "#d66a3a", "Other": "#7b8799"}
    sizes = data["current_ug"].clip(lower=100).pow(0.55) * 3.2
    sns.scatterplot(
        data=data,
        x="median_earnings_10_years",
        y="observed_ug_change",
        hue="control",
        palette=palette,
        size=sizes,
        sizes=(35, 850),
        alpha=0.62,
        edgecolor="white",
        linewidth=0.45,
        ax=ax,
    )
    ax.axhline(0, color="#14213d", linewidth=1.2, linestyle="--")
    ax.set_title("Median earnings and observed undergraduate enrollment change", loc="left", pad=18, weight="bold")
    ax.text(
        0,
        1.01,
        "College Scorecard median earnings 10 years after entry compared with observed undergraduate change, 2015–16 to 2024–25",
        transform=ax.transAxes,
        fontsize=11,
        color="#596579",
        va="bottom",
    )
    ax.set_xlabel("Median earnings 10 years after entry ($)")
    ax.set_ylabel("Observed undergraduate enrollment change")
    ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda value, _: f"{value:.0%}"))
    ax.xaxis.set_major_formatter(plt.FuncFormatter(lambda value, _: f"${value:,.0f}"))
    ax.legend(title="Institution control", frameon=True, loc="upper left", bbox_to_anchor=(1.01, 1))
    ax.text(
        0,
        -0.14,
        f"{len(data):,} institutions shown. Bubble size represents current undergraduate enrollment. This chart describes association, not causation.",
        transform=ax.transAxes,
        fontsize=10,
        color="#596579",
    )
    fig.tight_layout()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(output_path, bbox_inches="tight")
    plt.close(fig)


def create_banded_plot(data: pd.DataFrame, output_path: Path) -> None:
    data = data.copy()
    data["growth_band"] = pd.cut(
        data["observed_ug_change"],
        bins=[float("-inf"), -0.25, -0.025, 0.025, 0.25, float("inf")],
        labels=["Large decline", "Moderate decline", "Little change", "Moderate growth", "High growth"],
    )
    palette = {
        "Large decline": "#c95b3c",
        "Moderate decline": "#e3a17d",
        "Little change": "#aab1bf",
        "Moderate growth": "#5b9edb",
        "High growth": "#218a9a",
    }
    sns.set_theme(style="whitegrid", context="talk")
    fig, ax = plt.subplots(figsize=(15, 10), dpi=180)
    sizes = data["current_ug"].clip(lower=100).pow(0.55) * 3.2
    sns.scatterplot(
        data=data,
        x="median_earnings_10_years",
        y="observed_ug_change",
        hue="growth_band",
        hue_order=list(palette),
        palette=palette,
        size=sizes,
        sizes=(25, 750),
        alpha=0.58,
        edgecolor="white",
        linewidth=0.35,
        ax=ax,
    )
    ax.axhline(0, color="#14213d", linewidth=1.2, linestyle="--")
    ax.set_yscale("symlog", linthresh=0.05)
    ax.set_yticks([-5, -2, -1, -0.5, -0.25, -0.1, -0.025, 0, 0.025, 0.1, 0.25, 0.5, 1, 2, 5, 10])
    ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda value, _: f"{value:.0%}"))
    ax.xaxis.set_major_formatter(plt.FuncFormatter(lambda value, _: f"${value:,.0f}"))
    ax.set_title("Median earnings and observed undergraduate growth", loc="left", pad=18, weight="bold")
    ax.text(
        0,
        1.01,
        "Growth bands make the difference between decline, stability, and high growth easier to see",
        transform=ax.transAxes,
        fontsize=11,
        color="#596579",
        va="bottom",
    )
    ax.set_xlabel("Median earnings 10 years after entry ($)")
    ax.set_ylabel("Observed undergraduate change, 2015–16 to 2024–25")
    growth_handles = [Line2D([0], [0], marker="o", linestyle="", markerfacecolor=color, markeredgecolor="white", markersize=9, label=label) for label, color in palette.items()]
    ax.legend(growth_handles, list(palette), title="Observed growth band", frameon=True, loc="upper left", bbox_to_anchor=(1.01, 1))
    ax.text(
        0,
        -0.14,
        f"{len(data):,} institutions shown. Bubble size represents current undergraduate enrollment. Y-axis uses a symmetric log scale to preserve extreme changes.",
        transform=ax.transAxes,
        fontsize=10,
        color="#596579",
    )
    fig.tight_layout()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(output_path, bbox_inches="tight")
    plt.close(fig)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--diagnostics", type=Path, default=DEFAULT_DIAGNOSTICS)
    parser.add_argument("--scorecard", type=Path, default=DEFAULT_SCORECARD)
    parser.add_argument("--csv", type=Path, default=DEFAULT_CSV)
    parser.add_argument("--png", type=Path, default=DEFAULT_PNG)
    parser.add_argument("--bands-png", type=Path, default=DEFAULT_BANDS_PNG)
    args = parser.parse_args()
    data = build_plot_data(args.diagnostics, args.scorecard)
    args.csv.parent.mkdir(parents=True, exist_ok=True)
    data.to_csv(args.csv, index=False)
    create_plot(data, args.png)
    create_banded_plot(data, args.bands_png)
    print(f"institutions={len(data)}")
    print(f"csv={args.csv}")
    print(f"png={args.png}")
    print(f"bandsPng={args.bands_png}")


if __name__ == "__main__":
    main()
