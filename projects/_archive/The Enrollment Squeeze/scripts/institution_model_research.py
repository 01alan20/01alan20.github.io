"""Build and backtest an observed institution-level enrollment response model.

This is a research artifact. It does not alter the public site's forecast until
the expanded model beats the baselines out of sample.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import Ridge
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


PROJECT = Path(__file__).resolve().parents[1]
DEFAULT_INPUT = PROJECT / "data" / "collegeboard history"
DEFAULT_OUTPUT = PROJECT / "data" / "research" / "institution_model_backtest.json"
ALL_YEARS = [f"{year}_{str(year + 1)[-2:]}" for year in range(2005, 2026)]
MODEL_YEARS = ALL_YEARS[:-1]

BASE_COLUMNS = [
    "UNITID", "INSTNM", "STABBR", "LOCALE", "LATITUDE", "LONGITUDE", "CCBASIC", "CCSIZSET", "CONTROL",
    "ADM_RATE", "UGDS", "UG12MN", "UGDS_NRA", "PPTUG_EF", "UG25ABV", "RET_FT4", "RET_PT4", "C150_4",
    "PFTFTUG1_EF", "TUITFTE", "INEXPFTE", "PFTFAC", "AVGFACSAL", "PCTPELL", "DISTANCEONLY", "NUMBRANCH", "HCM2",
]
PCIP_COLUMNS = [f"PCIP{code:02d}" for code in range(1, 55)]
NUMERIC_FEATURES = [
    "state_market_growth", "prior_3yr_change", "UGDS_NRA", "PPTUG_EF", "UG25ABV", "ADM_RATE", "RET_FT4", "RET_PT4",
    "C150_4", "PFTFTUG1_EF", "TUITFTE", "INEXPFTE", "PFTFAC", "PCTPELL", "DISTANCEONLY", "NUMBRANCH", "program_hhi",
]
CATEGORICAL_FEATURES = ["STABBR", "LOCALE", "CCBASIC", "CCSIZSET", "CONTROL"]


def number(value):
    return pd.to_numeric(value, errors="coerce")


def usable_years(years, positive_ug_counts):
    return [year for year in years if positive_ug_counts.get(year, 0) > 0]


def program_hhi(values):
    numeric = [float(value) for value in values if value is not None and not pd.isna(value)]
    numeric = [max(0.0, value) for value in numeric]
    total = sum(numeric)
    if total <= 0:
        return None
    shares = [value / total for value in numeric]
    return sum(share * share for share in shares)


def international_stock_path(baseline_stock, continuation, shocks):
    """Return international stock under new-intake shocks.

    ``baseline_stock`` is the no-shock stock path. New normal intake is inferred
    from the baseline stock and the continuation rate, so missing cohorts remain
    absent after intake returns to baseline.
    """
    if not baseline_stock:
        return []
    result = [float(baseline_stock[0])]
    for index in range(1, len(baseline_stock)):
        normal_intake = max(0.0, float(baseline_stock[index]) - continuation * float(baseline_stock[index - 1]))
        year = 2025 + index
        shock = float(shocks.get(year, 0.0))
        result.append(continuation * result[-1] + normal_intake * (1.0 + shock))
    return result


def regression_metrics(actual, predicted):
    actual = np.asarray(actual, dtype=float)
    predicted = np.asarray(predicted, dtype=float)
    error = predicted - actual
    actual_direction = np.sign(actual - np.roll(actual, 1))[1:]
    predicted_direction = np.sign(predicted - np.roll(actual, 1))[1:]
    denominator = np.maximum(np.abs(actual), 1.0)
    return {
        "n": int(actual.size),
        "mae_students": round(float(np.mean(np.abs(error))), 10),
        "weighted_ape": round(float(np.sum(np.abs(error)) / np.sum(np.maximum(np.abs(actual), 1.0))), 10),
        "median_absolute_error": round(float(np.median(np.abs(error))), 10),
        "directional_accuracy": round(float(np.mean(actual_direction == predicted_direction)), 10) if actual.size > 1 else None,
        "mean_ape": round(float(np.mean(np.abs(error) / denominator)), 10),
    }


def read_panel(input_dir):
    frames = []
    for year in MODEL_YEARS:
        path = input_dir / f"MERGED{year}_PP.csv"
        if not path.exists():
            continue
        header = pd.read_csv(path, nrows=0).columns
        usecols = [column for column in BASE_COLUMNS + PCIP_COLUMNS if column in header]
        frame = pd.read_csv(path, usecols=usecols, low_memory=False)
        frame["year"] = int(year[:4]) + 1
        frame["source_year"] = year
        frames.append(frame)
    if not frames:
        raise FileNotFoundError(f"No College Scorecard files found in {input_dir}")
    panel = pd.concat(frames, ignore_index=True)
    panel["UNITID"] = panel["UNITID"].astype(str)
    for column in BASE_COLUMNS:
        if column not in panel:
            panel[column] = np.nan
    return panel


def build_features(panel):
    panel = panel.copy()
    for column in BASE_COLUMNS + PCIP_COLUMNS:
        if column in panel and column not in {"UNITID", "INSTNM", "STABBR", "source_year"}:
            panel[column] = number(panel[column])
    panel = panel[panel["UGDS"].notna() & (panel["UGDS"] > 0)].copy()
    panel = panel.sort_values(["UNITID", "year"])
    state_market = panel.groupby(["STABBR", "year"], dropna=False)["UGDS"].sum().rename("state_market_ugds").reset_index()
    state_market["state_market_growth"] = state_market.groupby("STABBR")["state_market_ugds"].transform(lambda series: np.log(series / series.shift(1)))
    panel = panel.merge(state_market[["STABBR", "year", "state_market_growth"]], on=["STABBR", "year"], how="left")
    panel["institution_growth"] = panel.groupby("UNITID")["UGDS"].transform(lambda series: np.log(series / series.shift(1)))
    panel["prior_3yr_change"] = panel.groupby("UNITID")["UGDS"].transform(lambda series: np.log(series / series.shift(3)) / 3.0)
    panel["program_hhi"] = panel[[column for column in PCIP_COLUMNS if column in panel]].apply(lambda row: program_hhi(row.tolist()), axis=1)
    lag_columns = ["state_market_growth", "prior_3yr_change", *NUMERIC_FEATURES[2:], *CATEGORICAL_FEATURES]
    for column in lag_columns:
        panel[f"lag_{column}"] = panel.groupby("UNITID")[column].shift(1)
    panel["lag_UGDS"] = panel.groupby("UNITID")["UGDS"].shift(1)
    panel["target_students"] = panel["UGDS"]
    panel["target_log_change"] = panel["institution_growth"]
    return panel.dropna(subset=["target_log_change", "lag_UGDS"]).copy()


def fit_expanded(train):
    numeric = [f"lag_{column}" for column in NUMERIC_FEATURES if train[f"lag_{column}"].notna().any()]
    categorical = [f"lag_{column}" for column in CATEGORICAL_FEATURES if train[f"lag_{column}"].notna().any()]
    preprocessor = ColumnTransformer([
        ("numeric", Pipeline([( "impute", SimpleImputer(strategy="median")), ("scale", StandardScaler())]), numeric),
        ("categorical", Pipeline([( "impute", SimpleImputer(strategy="most_frequent")), ("onehot", OneHotEncoder(handle_unknown="ignore"))]), categorical),
    ])
    model = Pipeline([( "features", preprocessor), ("ridge", Ridge(alpha=10.0))])
    model.fit(train, train["target_log_change"])
    return model


def evaluate(panel, first_test_year=2020):
    records = []
    for year in sorted(panel["year"].unique()):
        if year < first_test_year:
            continue
        train = panel[panel["year"] < year]
        test = panel[panel["year"] == year]
        if train.empty or test.empty:
            continue
        actual = test["target_students"].to_numpy(float)
        lag_ug = test["lag_UGDS"].to_numpy(float)
        state_pred = test["lag_state_market_growth"].fillna(0).to_numpy(float)
        trend_pred = test["lag_prior_3yr_change"].fillna(0).to_numpy(float)
        predictions = {
            "no_change": np.zeros(len(test)),
            "state_market": state_pred,
            "historical_trend": trend_pred,
        }
        expanded = fit_expanded(train)
        predictions["expanded_ridge"] = expanded.predict(test)
        for name, log_change in predictions.items():
            predicted_students = lag_ug * np.exp(np.clip(log_change, -1.5, 1.5))
            metrics = regression_metrics(actual, predicted_students)
            records.append({"year": int(year), "model": name, **metrics})
    results = pd.DataFrame(records)
    aggregate = []
    for name, group in results.groupby("model"):
        aggregate.append({"model": name, **regression_metrics(group["n"].to_numpy(float), group["n"].to_numpy(float))} if False else {
            "model": name,
            "n": int(group["n"].sum()),
            "mae_students": round(float(np.average(group["mae_students"], weights=group["n"])), 6),
            "weighted_ape": round(float(np.average(group["weighted_ape"], weights=group["n"])), 6),
            "median_absolute_error": round(float(np.average(group["median_absolute_error"], weights=group["n"])), 6),
            "directional_accuracy": round(float(np.average(group["directional_accuracy"].fillna(0), weights=group["n"])), 6),
        })
    return {"by_year": records, "aggregate": sorted(aggregate, key=lambda row: row["mae_students"])}


def evaluate_fixed_holdout(panel, train_through=2019, first_test_year=2020):
    train = panel[panel["year"] <= train_through]
    expanded = fit_expanded(train)
    records = []
    detail = []
    for year in sorted(panel.loc[panel["year"] >= first_test_year, "year"].unique()):
        test = panel[panel["year"] == year]
        actual = test["target_students"].to_numpy(float)
        lag_ug = test["lag_UGDS"].to_numpy(float)
        predictions = {
            "no_change": np.zeros(len(test)),
            "state_market": test["lag_state_market_growth"].fillna(0).to_numpy(float),
            "historical_trend": test["lag_prior_3yr_change"].fillna(0).to_numpy(float),
            "expanded_ridge": expanded.predict(test),
        }
        for name, log_change in predictions.items():
            predicted_students = lag_ug * np.exp(np.clip(log_change, -1.5, 1.5))
            metrics = regression_metrics(actual, predicted_students)
            records.append({"year": int(year), "model": name, **metrics})
            for index, row in test.reset_index(drop=True).iterrows():
                size = lag_ug[index]
                size_band = "Under 1,000" if size < 1000 else "1,000–4,999" if size < 5000 else "5,000–19,999" if size < 20000 else "20,000+"
                detail.append({"model": name, "year": int(year), "control": row.get("CONTROL"), "size_band": size_band, "urban_rural": "unavailable", "actual": float(actual[index]), "predicted": float(predicted_students[index])})
    detail_frame = pd.DataFrame(detail)
    breakdowns = []
    for dimensions in [("control",), ("size_band",), ("urban_rural",)]:
        for keys, group in detail_frame.groupby(["model", *dimensions], dropna=False):
            if not isinstance(keys, tuple):
                keys = (keys,)
            row = {"model": keys[0]}
            row.update(dict(zip(dimensions, keys[1:])))
            row.update(regression_metrics(group["actual"], group["predicted"]))
            breakdowns.append(row)
    return {"train_through": train_through, "test_from": first_test_year, "by_year": records, "breakdowns": breakdowns}


def field_coverage(panel):
    fields = [*NUMERIC_FEATURES, *CATEGORICAL_FEATURES]
    return {field: round(float(panel[f"lag_{field}"].notna().mean()), 4) for field in fields}


def build(input_dir=DEFAULT_INPUT, output_path=DEFAULT_OUTPUT):
    panel = build_features(read_panel(Path(input_dir)))
    report = {
        "model": "institution_enrollment_response_research_v1",
        "source_years": MODEL_YEARS,
        "excluded_years": {"2025_26": "UGDS and model fields are not populated in the supplied file"},
        "rows": int(len(panel)),
        "institutions": int(panel["UNITID"].nunique()),
        "field_coverage": field_coverage(panel),
        "target": "one-year log change in UGDS; predictions converted back to students using lagged UGDS",
        "missing_features": ["institution-to-county/metro crosswalk", "observed first-time international intake", "graduate international stock"],
        "international_scenarios": {
            "limited": {"2026": -0.15, "2027": -0.10, "2028": -0.05, "2029": 0.0},
            "central": {"2026": -0.25, "2027": -0.25, "2028": -0.10, "2029": 0.0},
            "severe": {"2026": -0.40, "2027": -0.40, "2028": -0.20, "2029": -0.10},
        },
        "backtest": evaluate(panel),
        "fixed_holdout": evaluate_fixed_holdout(panel),
    }
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    return report


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input-dir", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    report = build(args.input_dir, args.output)
    print(json.dumps({"output": str(args.output), "rows": report["rows"], "institutions": report["institutions"], "aggregate": report["backtest"]["aggregate"]}, indent=2))


if __name__ == "__main__":
    main()
