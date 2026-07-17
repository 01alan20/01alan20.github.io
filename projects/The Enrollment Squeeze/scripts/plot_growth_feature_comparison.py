"""Compare observed undergraduate growth groups across available institution features."""
from __future__ import annotations
import json
from pathlib import Path
import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

PROJECT = Path(__file__).resolve().parents[1]
DATA = PROJECT / "data" / "institution_diagnostics.json"
OUTPUT = PROJECT / "output" / "growth_group_feature_comparison.png"

FEATURES = {
    "retention": ("Full-time retention rate", "retention", "percent"),
    "current_ug": ("Current undergraduate enrollment", "currentUG", "log"),
    "adult_share": ("Adult undergraduate share", "adultUGShare", "percent"),
    "admit_rate": ("Admission rate", "admitRate", "percent"),
    "home_state": ("First-time students from home state", "firstTimeHomeStateShare", "percent"),
    "other_state": ("First-time students from other states", "firstTimeOtherStateShare", "percent"),
}


def load_data() -> pd.DataFrame:
    df = pd.DataFrame(json.loads(DATA.read_text(encoding="utf-8")))
    for column in ["change", *[value[1] for value in FEATURES.values()]]:
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
    order = ["Declined >2.5%", "Within +/-2.5%", "Grew >2.5%"]
    colors = {"Declined >2.5%": "#c95b3c", "Within +/-2.5%": "#9aa3b2", "Grew >2.5%": "#218a9a"}
    sns.set_theme(style="whitegrid", context="notebook")
    fig, axes = plt.subplots(2, 3, figsize=(16, 10), dpi=180)
    for ax, (key, (title, column, kind)) in zip(axes.flat, FEATURES.items()):
        plot = df[["growth_group", column]].dropna().copy()
        if kind == "log":
            plot[column] = np.log10(plot[column].clip(lower=100))
        sns.boxenplot(data=plot, x="growth_group", y=column, order=order, hue="growth_group", palette=colors, legend=False, ax=ax)
        sns.stripplot(data=plot.sample(min(900, len(plot)), random_state=7), x="growth_group", y=column, order=order, color="#14213d", alpha=0.14, size=2.5, jitter=0.22, ax=ax)
        medians = plot.groupby("growth_group", observed=True)[column].median()
        for i, group in enumerate(order):
            if group in medians.index:
                value = medians[group]
                label = f"median {10**value:,.0f}" if kind == "log" else f"median {value:.0%}"
                ax.text(i, value, label, ha="center", va="bottom", fontsize=8, color="#14213d", fontweight="bold")
        ax.set_title(title, loc="left", weight="bold")
        ax.set_xlabel("")
        ax.set_xticks(range(3))
        ax.set_xticklabels(["Decline", "Stable", "Growth"])
        if kind == "log":
            ticks = [3, 4, 5]
            ax.set_yticks(ticks)
            ax.set_yticklabels(["1,000", "10,000", "100,000"])
            ax.set_ylabel("Students, log scale")
        else:
            ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda v, _: f"{v:.0%}"))
            ax.set_ylabel("Share")
    fig.suptitle("What separates institutions that grew from those that declined?", x=0.055, ha="left", fontsize=20, weight="bold")
    fig.text(0.055, 0.925, "Observed undergraduate change from 2015-16 to 2024-25, compared with current institution characteristics", color="#596579", fontsize=11)
    fig.text(0.055, 0.025, f"{len(df):,} institutions with observed enrollment change. Boxen plots show the distribution; dots show a sample of institutions. Association is descriptive, not causal.", color="#596579", fontsize=9.5)
    fig.tight_layout(rect=[0, 0.06, 1, 0.9])
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(OUTPUT, bbox_inches="tight")
    plt.close(fig)
    print(f"institutions={len(df)}")
    print(f"output={OUTPUT}")

if __name__ == "__main__":
    main()
