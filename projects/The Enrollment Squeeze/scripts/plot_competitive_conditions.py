"""Plot observed institution conditions associated with undergraduate growth."""
from __future__ import annotations

import json
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from scipy.stats import spearmanr


PROJECT = Path(__file__).resolve().parents[1]
DATA = PROJECT / "data" / "institution_diagnostics.json"
OUTPUT = PROJECT / "output" / "competitive_conditions_growth.png"

FEATURES = [
    ("Retention", "retention", "Full-time retention rate", "Share"),
    ("Out-of-state recruitment", "firstTimeOtherStateShare", "First-time students from other states", "Share"),
    ("Admission rate", "admitRate", "Admission rate", "Share"),
    ("Adult-student share", "adultUGShare", "Adult undergraduate share", "Share"),
]


def load_data() -> pd.DataFrame:
    df = pd.DataFrame(json.loads(DATA.read_text(encoding="utf-8")))
    needed = ["change", *(column for _, column, _, _ in FEATURES)]
    for column in needed:
        df[column] = pd.to_numeric(df[column], errors="coerce")
    df = df.dropna(subset=["change"]).copy()
    df["growth_group"] = pd.cut(
        df["change"],
        bins=[-np.inf, -0.025, 0.025, np.inf],
        labels=["Declined >2.5%", "Within +/-2.5%", "Grew >2.5%"],
    )
    return df


def main() -> None:
    df = load_data()
    colors = {"Declined >2.5%": "#c95b3c", "Grew >2.5%": "#218a9a"}
    groups = ["Declined >2.5%", "Grew >2.5%"]
    sns.set_theme(style="whitegrid", context="talk")
    fig, axes = plt.subplots(2, 2, figsize=(15, 10), dpi=180)

    for ax, (short_title, column, long_title, ylabel) in zip(axes.flat, FEATURES):
        plot = df[df["growth_group"].isin(groups)][["growth_group", "change", column]].dropna().copy()
        plot["growth_group"] = pd.Categorical(plot["growth_group"], categories=groups, ordered=True)
        sns.boxenplot(
            data=plot,
            x="growth_group",
            y=column,
            order=groups,
            hue="growth_group",
            palette=colors,
            legend=False,
            ax=ax,
        )
        sample = plot.sample(min(800, len(plot)), random_state=7)
        sns.stripplot(
            data=sample,
            x="growth_group",
            y=column,
            order=groups,
            color="#14213d",
            alpha=0.15,
            size=2.5,
            jitter=0.22,
            ax=ax,
        )
        medians = plot.groupby("growth_group", observed=True)[column].median()
        for i, group in enumerate(groups):
            value = medians[group]
            ax.text(i, value, f"median {value:.0%}", ha="center", va="bottom", fontsize=10, color="#14213d", weight="bold")
        rho, p_value = spearmanr(plot[column], plot["change"])
        gap = medians["Grew >2.5%"] - medians["Declined >2.5%"]
        direction = "higher" if gap >= 0 else "lower"
        ax.text(
            0.98,
            0.96,
            f"Growth median is {abs(gap):.0%} {direction}\nSpearman correlation: {rho:+.2f}",
            transform=ax.transAxes,
            ha="right",
            va="top",
            fontsize=10,
            color="#596579",
            bbox={"facecolor": "white", "edgecolor": "#d7dde5", "pad": 5},
        )
        ax.set_title(short_title, loc="left", weight="bold")
        ax.set_xlabel("")
        ax.set_ylabel(ylabel)
        ax.set_xticks(range(2))
        ax.set_xticklabels(["Declined", "Grew"])
        ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda value, _: f"{value:.0%}"))

    fig.suptitle("Four conditions associated with undergraduate growth", x=0.06, ha="left", fontsize=22, weight="bold")
    fig.text(
        0.06,
        0.925,
        "Growing institutions tended to retain more students and recruit more beyond their home state",
        color="#596579",
        fontsize=12,
    )
    fig.text(
        0.06,
        0.025,
        "Observed undergraduate change, 2015-16 to 2024-25. Spearman correlation measures association with the continuous change rate; it does not establish causation.",
        color="#596579",
        fontsize=10,
    )
    fig.tight_layout(rect=[0, 0.06, 1, 0.9])
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(OUTPUT, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    print(f"output={OUTPUT}")


if __name__ == "__main__":
    main()
