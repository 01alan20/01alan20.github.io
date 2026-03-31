from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pandas as pd

from prepare_enrollment_benchmarks import build_enrollment_benchmark_config


ROOT = Path(__file__).resolve().parents[1]
SOURCE_FUNNEL = ROOT / "projects" / "enrollment-funnel-benchmark" / "data" / "enrollment_funnel_synthetic.csv"
OUTPUT_DIR = ROOT / "projects" / "enrollment-strategy-dashboard" / "data"
RNG = np.random.default_rng(20260331)

ACTIVE_CYCLE = 2025
TERM_START_BY_YEAR = {
    2023: pd.Timestamp("2023-08-21"),
    2024: pd.Timestamp("2024-08-26"),
    2025: pd.Timestamp("2025-08-25"),
}


def safe_clip(values: np.ndarray, low: float, high: float) -> np.ndarray:
    return np.clip(values, low, high)


def format_date(series: pd.Series) -> pd.Series:
    return pd.to_datetime(series, errors="coerce").dt.strftime("%Y-%m-%d")


def scale_to_100(values: np.ndarray) -> np.ndarray:
    return safe_clip(values, 0, 100)


def normalize_weight_map(weight_map: dict[str, float], categories: list[str]) -> tuple[list[str], np.ndarray]:
    filtered = {category: float(weight_map.get(category, 0.0)) for category in categories}
    total = sum(filtered.values())
    if total <= 0:
        weights = np.repeat(1 / max(len(categories), 1), len(categories))
        return categories, weights
    weights = np.array([filtered[category] / total for category in categories], dtype=float)
    return categories, weights


def blend_categorical_column(series: pd.Series, target_weights: dict[str, float], strength: float) -> pd.Series:
    categories = sorted(series.dropna().astype(str).unique().tolist())
    if not categories:
        return series

    draw_categories, draw_weights = normalize_weight_map(target_weights, categories)
    replace_mask = RNG.random(len(series)) < strength
    draws = RNG.choice(draw_categories, size=len(series), p=draw_weights)

    updated = series.astype(str).copy()
    updated.loc[replace_mask] = draws[replace_mask]
    return updated


def load_base_funnel() -> pd.DataFrame:
    df = pd.read_csv(
        SOURCE_FUNNEL,
        parse_dates=["inquiry_date", "application_date", "offer_date", "enrollment_date"],
    )

    int_cols = [
        "inquiry_flag",
        "application_flag",
        "offer_flag",
        "enrollment_flag",
        "first_gen_flag",
        "need_aid_flag",
        "visit_flag",
        "counselor_meeting_flag",
    ]
    for col in int_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0).astype(int)

    numeric_cols = [
        "academic_index",
        "affordability_index",
        "engagement_score",
        "completeness_score",
        "offer_fit_score",
        "inquiry_to_app_prob",
        "app_to_offer_prob",
        "offer_to_enroll_prob",
        "days_inquiry_to_app",
        "days_app_to_offer",
        "days_offer_to_enroll",
    ]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    df["cycle_is_active"] = (df["cycle_year"] == ACTIVE_CYCLE).astype(int)
    df["term_start_date"] = df["cycle_year"].map(TERM_START_BY_YEAR)
    return df


def apply_benchmark_mix(df: pd.DataFrame, benchmark: dict[str, object]) -> pd.DataFrame:
    adjusted = df.copy()
    adjusted["academic_program"] = blend_categorical_column(
        adjusted["academic_program"],
        benchmark["program_mix_weights"],
        strength=0.34,
    )
    adjusted["source_channel"] = blend_categorical_column(
        adjusted["source_channel"],
        benchmark["source_mix_weights"],
        strength=0.22,
    )
    adjusted["market_geography"] = blend_categorical_column(
        adjusted["market_geography"],
        benchmark["geography_mix"],
        strength=0.12,
    )
    return adjusted


def add_student_attributes(df: pd.DataFrame, benchmark: dict[str, object]) -> pd.DataFrame:
    pricing = benchmark["pricing"]
    academic_profile = benchmark["academic_profile"]

    geography_weight = df["market_geography"].map(
        {
            "Local": 7,
            "Regional": 4,
            "National": -1,
            "International": -4,
        }
    ).fillna(0)

    student_base_tuition = df["student_type"].map(
        {
            "First-Year": pricing["tuition_out_state"],
            "Transfer": pricing["tuition_out_state"] * pricing["transfer_multiplier"],
            "Graduate": pricing["tuition_out_state"] * pricing["graduate_multiplier"],
        }
    ).fillna(pricing["tuition_out_state"])
    geography_tuition = df["market_geography"].map(
        {
            "Local": pricing["local_adjustment"],
            "Regional": pricing["regional_adjustment"],
            "National": pricing["national_adjustment"],
            "International": pricing["international_adjustment"],
        }
    ).fillna(0)
    program_premium = df["academic_program"].map(pricing["program_premiums"]).fillna(0)
    residency_premium = np.where(df["residency"] == "International", pricing["international_premium"], 0)

    df["sticker_price"] = student_base_tuition + geography_tuition + program_premium + residency_premium
    df["sticker_price"] = safe_clip(df["sticker_price"].to_numpy(dtype=float), 15000, 52000)

    sat_midpoint = (academic_profile["sat_total_25"] + academic_profile["sat_total_75"]) / 2
    core_cut = float(np.interp(sat_midpoint, [950, 1450], [60, 76]))
    access_cut = np.clip(core_cut - 8, 54, 70)
    high_cut = np.clip(core_cut + 8, 72, 86)

    df["academic_band"] = pd.cut(
        df["academic_index"],
        bins=[-np.inf, access_cut, high_cut, np.inf],
        labels=["Access", "Core", "High"],
    ).astype(str)

    df["income_band"] = np.select(
        [
            (df["need_aid_flag"] == 1) & (df["affordability_index"] < 49),
            df["affordability_index"] < 65,
        ],
        ["Low Income", "Middle Income"],
        default="Higher Income",
    )

    price_sensitivity = (
        (100 - df["affordability_index"]) * 0.56
        + df["need_aid_flag"] * 18
        + df["first_gen_flag"] * 10
        + np.where(df["market_geography"].isin(["National", "International"]), 6, 0)
        + np.where(df["student_type"] == "Transfer", 4, 0)
    )
    df["price_sensitivity_score"] = scale_to_100(price_sensitivity.to_numpy(dtype=float))
    df["price_sensitivity_band"] = pd.cut(
        df["price_sensitivity_score"],
        bins=[-np.inf, 38, 64, np.inf],
        labels=["Low", "Medium", "High"],
    ).astype(str)

    df["segment_id"] = (
        df["student_type"].str.replace(r"[^A-Za-z]", "", regex=True).str[:2].str.upper()
        + "-"
        + df["income_band"].str.split().str[0].str[:2].str.upper()
        + "-"
        + df["market_geography"].str[:3].str.upper()
    )
    df["segment_name"] = df["student_type"] + " / " + df["income_band"] + " / " + df["market_geography"]

    engagement_velocity = (
        df["engagement_score"] * 0.55
        + df["completeness_score"] * 0.30
        + df["visit_flag"] * 8
        + df["counselor_meeting_flag"] * 7
        + geography_weight
    )
    df["engagement_velocity_score"] = scale_to_100(engagement_velocity.to_numpy(dtype=float))
    return df


def calibrate_matriculation_flags(df: pd.DataFrame, benchmark: dict[str, object]) -> pd.DataFrame:
    target_yield = benchmark["stage_targets"]["admit_to_matric_yield"]
    calibrated = df.copy()
    calibrated["matriculated_flag"] = calibrated["enrollment_flag"].astype(int)

    admit_mask = calibrated["admit_flag"] == 1
    current_matriculants = int(calibrated.loc[admit_mask, "matriculated_flag"].sum())
    target_matriculants = int(round(admit_mask.sum() * target_yield))
    if current_matriculants == target_matriculants:
        return calibrated

    persistence_score = (
        calibrated["engagement_score"] * 0.30
        + calibrated["offer_fit_score"] * 0.25
        + calibrated["academic_index"] * 0.15
        + calibrated["completeness_score"] * 0.10
        + calibrated["visit_flag"] * 10
        + calibrated["counselor_meeting_flag"] * 8
        - calibrated["price_sensitivity_score"] * 0.12
    )

    if current_matriculants > target_matriculants:
        drop_count = current_matriculants - target_matriculants
        candidates = calibrated.index[admit_mask & (calibrated["matriculated_flag"] == 1)]
        drop_index = persistence_score.loc[candidates].sort_values().head(drop_count).index
        calibrated.loc[drop_index, "matriculated_flag"] = 0
    else:
        add_count = target_matriculants - current_matriculants
        candidates = calibrated.index[admit_mask & (calibrated["matriculated_flag"] == 0)]
        add_index = persistence_score.loc[candidates].sort_values(ascending=False).head(add_count).index
        calibrated.loc[add_index, "matriculated_flag"] = 1

    return calibrated


def add_pipeline_stage_logic(df: pd.DataFrame, benchmark: dict[str, object]) -> pd.DataFrame:
    start_prob = safe_clip(
        df["inquiry_to_app_prob"].fillna(0) * 0.72
        + (df["engagement_score"].fillna(0) / 100) * 0.18
        + (df["completeness_score"].fillna(0) / 100) * 0.15
        + df["visit_flag"] * 0.08,
        0.06,
        0.95,
    )
    started_draw = RNG.random(len(df))
    df["app_started_flag"] = np.where(df["application_flag"] == 1, 1, (started_draw < start_prob).astype(int))
    df["app_completed_flag"] = df["application_flag"]
    df["admit_flag"] = df["offer_flag"]
    df = calibrate_matriculation_flags(df, benchmark)

    offer_date = pd.to_datetime(df["offer_date"], errors="coerce")
    term_start = pd.to_datetime(df["term_start_date"], errors="coerce")

    raw_days_to_deposit = (
        78
        - (df["engagement_score"] * 0.28)
        - (df["offer_fit_score"] * 0.16)
        - df["visit_flag"] * 10
        - df["counselor_meeting_flag"] * 6
        + np.where(df["market_geography"].isin(["National", "International"]), 12, 0)
        + np.where(df["need_aid_flag"] == 1, 8, 0)
        + RNG.normal(0, 9, len(df))
    )
    raw_days_to_deposit = safe_clip(raw_days_to_deposit, 4, 120)
    deposit_date = offer_date + pd.to_timedelta(raw_days_to_deposit.round().astype("Int64"), unit="D")
    max_allowed = term_start - pd.to_timedelta(7, unit="D")
    deposit_date = deposit_date.where(deposit_date <= max_allowed, max_allowed)

    deposit_propensity = (
        df["offer_to_enroll_prob"].fillna(0) * 0.42
        + (df["engagement_score"] / 100) * 0.22
        + (df["offer_fit_score"] / 100) * 0.16
        + (df["affordability_index"] / 100) * 0.12
        + df["visit_flag"] * 0.08
        + df["counselor_meeting_flag"] * 0.05
        - (df["price_sensitivity_score"] / 100) * 0.10
    )

    df["deposit_flag"] = df["matriculated_flag"].astype(int)
    admit_mask = df["admit_flag"] == 1
    target_deposits = int(round(admit_mask.sum() * benchmark["stage_targets"]["admit_to_deposit_rate"]))
    additional_needed = max(target_deposits - int(df.loc[admit_mask, "deposit_flag"].sum()), 0)
    candidate_mask = admit_mask & (df["matriculated_flag"] == 0)
    candidate_index = deposit_propensity.loc[df.index[candidate_mask]].sort_values(ascending=False).head(additional_needed).index
    df.loc[candidate_index, "deposit_flag"] = 1

    orientation_prob = safe_clip(
        0.44
        + (df["engagement_score"] / 100) * 0.22
        + df["visit_flag"] * 0.10
        - np.where(df["market_geography"] == "International", 0.06, 0)
        - np.where(df["price_sensitivity_band"] == "High", 0.05, 0),
        0.15,
        0.96,
    )
    housing_prob = safe_clip(
        0.34
        + np.where(df["market_geography"].isin(["Local", "Regional"]), 0.08, 0.18)
        + (df["engagement_score"] / 100) * 0.12
        - np.where(df["student_type"] == "Transfer", 0.12, 0)
        - np.where(df["student_type"] == "Graduate", 0.16, 0),
        0.05,
        0.95,
    )
    orientation_draw = RNG.random(len(df))
    housing_draw = RNG.random(len(df))
    df["orientation_rsvp_flag"] = ((orientation_draw < orientation_prob) & (df["deposit_flag"] == 1)).astype(int)
    df["housing_contract_flag"] = ((housing_draw < housing_prob) & (df["deposit_flag"] == 1)).astype(int)

    late_deposit_flag = (
        (df["deposit_flag"] == 1)
        & deposit_date.notna()
        & term_start.notna()
        & ((term_start - deposit_date).dt.days < 45)
    )
    df["late_deposit_flag"] = late_deposit_flag.astype(int)
    df["melt_flag"] = ((df["deposit_flag"] == 1) & (df["matriculated_flag"] == 0)).astype(int)

    melt_risk = (
        16
        + df["late_deposit_flag"] * 20
        + (1 - df["orientation_rsvp_flag"]) * 14
        + (1 - df["housing_contract_flag"]) * 11
        + np.where(df["residency"] == "International", 10, 0)
        + np.where(df["price_sensitivity_band"] == "High", 9, 0)
        + np.where(df["visit_flag"] == 0, 7, 0)
        + np.where(df["counselor_meeting_flag"] == 0, 5, 0)
        + np.where(df["engagement_score"] < 55, 12, 0)
        + np.where(df["need_aid_flag"] == 1, 5, 0)
        + RNG.normal(0, 5, len(df))
    )
    df["melt_risk_score"] = scale_to_100(melt_risk.to_numpy(dtype=float))
    df["melt_risk_band"] = pd.cut(
        df["melt_risk_score"],
        bins=[-np.inf, 38, 62, np.inf],
        labels=["Low", "Medium", "High"],
    ).astype(str)
    df["deposit_date"] = deposit_date.where(df["deposit_flag"] == 1)
    return df


def add_financial_logic(df: pd.DataFrame, benchmark: dict[str, object]) -> pd.DataFrame:
    pricing = benchmark["pricing"]

    need_estimate = (
        df["sticker_price"] * (1 - (df["affordability_index"] / 118))
        + df["need_aid_flag"] * 1800
        + df["first_gen_flag"] * 900
    )
    df["need_estimate"] = safe_clip(need_estimate.to_numpy(dtype=float), 0, 28000)

    merit_award = (
        np.where(df["admit_flag"] == 1, pricing["tuition_out_state"] * 0.012, 0)
        + np.where(df["academic_index"] >= 82, pricing["tuition_out_state"] * 0.055, 0)
        + np.where(df["academic_index"] >= 74, pricing["tuition_out_state"] * 0.025, 0)
        + np.where(df["offer_fit_score"] >= 72, pricing["tuition_out_state"] * 0.012, 0)
        + np.where(df["academic_program"].isin(["Engineering", "Computer Science", "Health"]), pricing["tuition_out_state"] * 0.01, 0)
    )
    need_award = (
        np.where(df["admit_flag"] == 1, df["need_estimate"] * 0.09, 0)
        + np.where(df["need_aid_flag"] == 1, pricing["tuition_out_state"] * 0.015, 0)
    )

    total_aid = merit_award + need_award
    admit_mask = df["admit_flag"] == 1
    average_sticker = float(df.loc[admit_mask, "sticker_price"].mean()) if admit_mask.any() else pricing["tuition_out_state"]
    target_discount_rate = float(
        np.clip(
            1 - (pricing["net_price_target"] / max(average_sticker, 1)),
            pricing["discount_rate_target"],
            pricing["discount_rate_target"] + 0.12,
        )
    )
    current_discount = float(
        np.nanmean((total_aid[admit_mask] / df.loc[admit_mask, "sticker_price"]).clip(0, 1))
    ) if admit_mask.any() else target_discount_rate
    scale_factor = target_discount_rate / max(current_discount, 0.01)
    total_aid = total_aid * scale_factor
    max_discount = safe_clip(
        np.repeat(target_discount_rate + 0.12, len(df)),
        0.18,
        0.42,
    )
    total_aid = safe_clip(
        total_aid.astype(float),
        0,
        df["sticker_price"].to_numpy(dtype=float) * max_discount,
    )

    df["merit_scholarship_offer"] = np.where(df["admit_flag"] == 1, merit_award * scale_factor, 0).round(0)
    df["need_based_grant_offer"] = np.where(df["admit_flag"] == 1, need_award * scale_factor, 0).round(0)
    df["total_institutional_aid"] = np.where(df["admit_flag"] == 1, total_aid, 0).round(0)
    df["net_price"] = np.where(df["admit_flag"] == 1, df["sticker_price"] - df["total_institutional_aid"], np.nan).round(0)
    df["discount_rate_individual"] = np.where(
        df["admit_flag"] == 1,
        df["total_institutional_aid"] / df["sticker_price"],
        0,
    )

    scholarship_priority = (
        df["price_sensitivity_score"] * 0.42
        + df["academic_index"] * 0.23
        + df["offer_fit_score"] * 0.18
        + df["engagement_score"] * 0.10
        + np.where(df["market_geography"] == "Regional", 4, 0)
        + np.where(df["student_type"] == "First-Year", 4, 0)
    )
    df["scholarship_priority_score"] = scale_to_100(scholarship_priority.to_numpy(dtype=float))
    df["scholarship_priority_band"] = pd.cut(
        df["scholarship_priority_score"],
        bins=[-np.inf, 44, 68, np.inf],
        labels=["Monitor", "Consider", "Increase Aid"],
    ).astype(str)
    return df


def add_action_queues(df: pd.DataFrame) -> pd.DataFrame:
    days_since_inquiry = (pd.Timestamp("2025-03-15") - pd.to_datetime(df["inquiry_date"], errors="coerce")).dt.days
    days_since_inquiry = days_since_inquiry.fillna(days_since_inquiry.median())

    recoverability = (
        df["engagement_score"] * 0.35
        + df["completeness_score"] * 0.32
        + df["counselor_meeting_flag"] * 9
        + df["visit_flag"] * 7
        - safe_clip(days_since_inquiry.to_numpy(dtype=float) / 8, 0, 18)
        + np.where(df["source_channel"].isin(["School Counselor", "Referral", "Campus Visit"]), 7, 0)
        + np.where(df["academic_band"] == "High", 6, 0)
    )
    df["recoverability_score"] = scale_to_100(recoverability.to_numpy(dtype=float))
    df["recoverable_flag"] = (
        (df["app_started_flag"] == 1)
        & (df["app_completed_flag"] == 0)
        & (df["recoverability_score"] >= 60)
    ).astype(int)

    counselor_priority = (
        df["engagement_score"] * 0.28
        + df["offer_fit_score"] * 0.20
        + df["academic_index"] * 0.16
        + (100 - df["price_sensitivity_score"]) * 0.12
        + (100 - df["melt_risk_score"]) * 0.12
        + df["visit_flag"] * 7
        + df["counselor_meeting_flag"] * 4
        + np.where(df["market_geography"].isin(["Local", "Regional"]), 6, 0)
    )
    df["counselor_priority_score"] = scale_to_100(counselor_priority.to_numpy(dtype=float))
    df["counselor_priority_flag"] = (
        (df["admit_flag"] == 1)
        & (df["deposit_flag"] == 0)
        & (df["counselor_priority_score"] >= 68)
    ).astype(int)

    conditions = [
        df["counselor_priority_flag"] == 1,
        df["recoverable_flag"] == 1,
        (df["deposit_flag"] == 1) & (df["melt_risk_score"] >= 63),
    ]
    choices = [
        "Yield Outreach",
        "Application Recovery",
        "Deposit Protection",
    ]
    df["action_bucket"] = np.select(conditions, choices, default="Monitor")

    next_actions = np.select(
        [
            df["counselor_priority_flag"] == 1,
            df["recoverable_flag"] == 1,
            (df["deposit_flag"] == 1) & (df["melt_risk_score"] >= 63),
        ],
        [
            "Senior counselor call within 48 hours",
            "Completion push: text + counselor reminder",
            "Summer melt intervention: orientation + financing outreach",
        ],
        default="No immediate escalation",
    )
    df["next_best_action"] = next_actions
    return df


def build_institution_profile(df: pd.DataFrame, benchmark: dict[str, object]) -> pd.DataFrame:
    institution = benchmark["institution"]
    stage_targets = benchmark["stage_targets"]
    active = df[df["cycle_year"] == ACTIVE_CYCLE].copy()
    active_started = int(active["app_started_flag"].sum())
    active_completed = int(active["app_completed_flag"].sum())
    active_admits = int(active["admit_flag"].sum())
    active_deposits = int(active["deposit_flag"].sum())
    active_matriculated = int(active["matriculated_flag"].sum())
    active_melt = int(active["melt_flag"].sum())

    gross_tuition = float(active.loc[active["matriculated_flag"] == 1, "sticker_price"].sum())
    aid_total = float(active.loc[active["matriculated_flag"] == 1, "total_institutional_aid"].sum())
    net_tuition = gross_tuition - aid_total

    return pd.DataFrame(
        [
            {
                "institution_id": "vp-enrollment-001",
                "institution_name": institution["institution_name"],
                "control": institution["control"],
                "level": institution["level"],
                "region": institution["region"],
                "class_target": institution["class_target"],
                "active_cycle": ACTIVE_CYCLE,
                "applications_started": active_started,
                "applications_completed": active_completed,
                "admitted_students": active_admits,
                "deposited_students": active_deposits,
                "projected_melt": active_melt,
                "projected_matriculants": active_matriculated,
                "target_gap": institution["class_target"] - active_matriculated,
                "benchmark_inquiry_to_complete_rate": round(stage_targets["inquiry_to_complete_rate"], 4),
                "benchmark_complete_to_admit_rate": round(stage_targets["complete_to_admit_rate"], 4),
                "benchmark_admit_to_deposit_rate": round(stage_targets["admit_to_deposit_rate"], 4),
                "benchmark_deposit_to_matric_rate": round(stage_targets["deposit_to_matric_rate"], 4),
                "gross_tuition": round(gross_tuition, 0),
                "institutional_aid": round(aid_total, 0),
                "net_tuition_revenue": round(net_tuition, 0),
                "avg_discount_rate": round(aid_total / max(gross_tuition, 1), 4),
            }
        ]
    )


def build_summaries(df: pd.DataFrame, benchmark: dict[str, object]) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    active = df[df["cycle_year"] == ACTIVE_CYCLE].copy()
    class_target = benchmark["institution"]["class_target"]
    program_target_shares = benchmark["program_mix_weights"]

    segment_summary = (
        active.groupby(["segment_id", "segment_name"], as_index=False)
        .agg(
            inquiries=("student_id", "count"),
            app_started=("app_started_flag", "sum"),
            app_completed=("app_completed_flag", "sum"),
            admits=("admit_flag", "sum"),
            deposits=("deposit_flag", "sum"),
            matriculants=("matriculated_flag", "sum"),
            melt=("melt_flag", "sum"),
            avg_award=("total_institutional_aid", "mean"),
            avg_net_price=("net_price", "mean"),
            avg_counselor_priority=("counselor_priority_score", "mean"),
            avg_melt_risk=("melt_risk_score", "mean"),
        )
    )
    segment_summary["app_completion_rate"] = segment_summary["app_completed"] / segment_summary["inquiries"]
    segment_summary["admit_rate"] = segment_summary["admits"] / segment_summary["app_completed"].replace(0, np.nan)
    segment_summary["deposit_rate"] = segment_summary["deposits"] / segment_summary["admits"].replace(0, np.nan)
    segment_summary["matric_rate"] = segment_summary["matriculants"] / segment_summary["deposits"].replace(0, np.nan)
    segment_summary["net_revenue"] = segment_summary["matriculants"] * segment_summary["avg_net_price"].fillna(0)

    program_summary = (
        active.groupby("academic_program", as_index=False)
        .agg(
            inquiries=("student_id", "count"),
            completed_apps=("app_completed_flag", "sum"),
            admits=("admit_flag", "sum"),
            deposits=("deposit_flag", "sum"),
            matriculants=("matriculated_flag", "sum"),
            avg_award=("total_institutional_aid", "mean"),
            avg_net_price=("net_price", "mean"),
        )
    )
    program_summary["target_matriculants"] = program_summary["academic_program"].map(
        {key: round(class_target * value) for key, value in program_target_shares.items()}
    )
    program_summary["gap_to_target"] = program_summary["target_matriculants"] - program_summary["matriculants"]
    program_summary["yield_rate"] = program_summary["deposits"] / program_summary["admits"].replace(0, np.nan)
    program_summary["melt_rate"] = (program_summary["deposits"] - program_summary["matriculants"]) / program_summary["deposits"].replace(0, np.nan)

    source_summary = (
        active.groupby("source_channel", as_index=False)
        .agg(
            inquiries=("student_id", "count"),
            completed_apps=("app_completed_flag", "sum"),
            admits=("admit_flag", "sum"),
            deposits=("deposit_flag", "sum"),
            matriculants=("matriculated_flag", "sum"),
            avg_counselor_priority=("counselor_priority_score", "mean"),
        )
    )
    total_inquiries = source_summary["inquiries"].sum()
    total_matric = source_summary["matriculants"].sum()
    source_summary["inquiry_share"] = source_summary["inquiries"] / max(total_inquiries, 1)
    source_summary["matric_share"] = source_summary["matriculants"] / max(total_matric, 1)
    source_summary["efficiency_gap"] = source_summary["matric_share"] - source_summary["inquiry_share"]
    source_summary["yield_rate"] = source_summary["deposits"] / source_summary["admits"].replace(0, np.nan)

    return segment_summary.fillna(0), program_summary.fillna(0), source_summary.fillna(0)


def build_aid_tradeoff_curve(df: pd.DataFrame) -> pd.DataFrame:
    active_admits = df[(df["cycle_year"] == ACTIVE_CYCLE) & (df["admit_flag"] == 1)].copy()
    deltas = [-2000, -1000, 0, 1000, 2000, 3000, 4000, 5000]
    rows: list[dict[str, float]] = []

    base_melt_prob = safe_clip(
        0.04
        + active_admits["melt_flag"].to_numpy(dtype=float) * 0.10
        + active_admits["melt_risk_score"].to_numpy(dtype=float) / 360
        - active_admits["orientation_rsvp_flag"].to_numpy(dtype=float) * 0.04
        - active_admits["housing_contract_flag"].to_numpy(dtype=float) * 0.03,
        0.03,
        0.24,
    )
    base_yield_prob = safe_clip(
        0.15
        + active_admits["deposit_flag"].to_numpy(dtype=float) * 0.27
        + active_admits["matriculated_flag"].to_numpy(dtype=float) * 0.05
        + active_admits["engagement_score"].to_numpy(dtype=float) / 700
        + active_admits["offer_fit_score"].to_numpy(dtype=float) / 950
        + active_admits["visit_flag"].to_numpy(dtype=float) * 0.05
        + active_admits["counselor_meeting_flag"].to_numpy(dtype=float) * 0.03
        - active_admits["price_sensitivity_score"].to_numpy(dtype=float) / 1500,
        0.08,
        0.74,
    )
    aid_sensitivity = safe_clip(active_admits["price_sensitivity_score"].to_numpy(dtype=float) / 100, 0.15, 0.95)
    current_award = active_admits["total_institutional_aid"].to_numpy(dtype=float)
    sticker_price = active_admits["sticker_price"].to_numpy(dtype=float)

    for delta in deltas:
        new_award = safe_clip(current_award + delta, 0, sticker_price * 0.68)
        yield_lift = (delta / 1000) * 0.012 * aid_sensitivity
        melt_improvement = (delta / 1000) * 0.006 * aid_sensitivity
        new_yield_prob = safe_clip(base_yield_prob + yield_lift, 0.04, 0.88)
        new_melt_prob = safe_clip(base_melt_prob - melt_improvement, 0.02, 0.45)

        expected_deposits = float(new_yield_prob.sum())
        expected_matriculants = float((new_yield_prob * (1 - new_melt_prob)).sum())
        net_price = sticker_price - new_award
        expected_net_tuition = float((new_yield_prob * (1 - new_melt_prob) * net_price).sum())
        total_award = float((new_yield_prob * new_award).sum())

        rows.append(
            {
                "award_delta": delta,
                "avg_award": round(new_award.mean(), 0),
                "expected_deposits": round(expected_deposits, 1),
                "expected_matriculants": round(expected_matriculants, 1),
                "expected_net_tuition": round(expected_net_tuition, 0),
                "expected_aid_outlay": round(total_award, 0),
                "marginal_matriculants_vs_baseline": 0,
            }
        )

    curve = pd.DataFrame(rows)
    baseline = curve.loc[curve["award_delta"] == 0, "expected_matriculants"].iloc[0]
    curve["marginal_matriculants_vs_baseline"] = curve["expected_matriculants"] - baseline
    return curve


def build_metadata(benchmark: dict[str, object]) -> dict[str, object]:
    return {
        "project_name": "Enrollment Strategy Dashboard",
        "verified_public_sources": [
            "IPEDS Use The Data",
            "IPEDS Data Center",
            "College Scorecard data",
            "College Scorecard API",
            "Common Data Set",
            "Census Bureau data",
            "NCES Projections of Education Statistics",
        ],
        "proxy_or_synthetic_layers": [
            "student-level CRM style engagement",
            "application start behavior",
            "deposit timing",
            "melt risk indicators",
            "scholarship response scenarios",
            "counselor attention queues",
        ],
        "benchmark_method": benchmark["benchmark_logic"]["slice_name"],
        "benchmark_rule": benchmark["benchmark_logic"]["slice_rule"],
        "active_cycle": ACTIVE_CYCLE,
        "class_target": benchmark["institution"]["class_target"],
        "institution_name": benchmark["institution"]["institution_name"],
    }


def write_outputs(
    students: pd.DataFrame,
    institution_profile: pd.DataFrame,
    segment_summary: pd.DataFrame,
    program_summary: pd.DataFrame,
    source_summary: pd.DataFrame,
    aid_tradeoff_curve: pd.DataFrame,
    benchmark: dict[str, object],
) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    export_students = students.copy()
    for date_col in [
        "inquiry_date",
        "application_date",
        "offer_date",
        "enrollment_date",
        "deposit_date",
        "term_start_date",
    ]:
        export_students[date_col] = format_date(export_students[date_col])

    export_students.to_csv(OUTPUT_DIR / "student_funnel_synthetic.csv", index=False)
    institution_profile.to_csv(OUTPUT_DIR / "institution_profile.csv", index=False)
    segment_summary.to_csv(OUTPUT_DIR / "segment_summary.csv", index=False)
    program_summary.to_csv(OUTPUT_DIR / "program_summary.csv", index=False)
    source_summary.to_csv(OUTPUT_DIR / "source_summary.csv", index=False)
    aid_tradeoff_curve.to_csv(OUTPUT_DIR / "aid_tradeoff_curve.csv", index=False)
    (OUTPUT_DIR / "metadata.json").write_text(json.dumps(build_metadata(benchmark), indent=2), encoding="utf-8")


def main() -> None:
    benchmark = build_enrollment_benchmark_config()
    students = load_base_funnel()
    students = apply_benchmark_mix(students, benchmark)
    students = add_student_attributes(students, benchmark)
    students = add_pipeline_stage_logic(students, benchmark)
    students = add_financial_logic(students, benchmark)
    students = add_action_queues(students)

    institution_profile = build_institution_profile(students, benchmark)
    segment_summary, program_summary, source_summary = build_summaries(students, benchmark)
    aid_tradeoff_curve = build_aid_tradeoff_curve(students)

    write_outputs(
        students,
        institution_profile,
        segment_summary,
        program_summary,
        source_summary,
        aid_tradeoff_curve,
        benchmark,
    )

    active = students[students["cycle_year"] == ACTIVE_CYCLE]
    avg_net_price = active.loc[active["admit_flag"] == 1, "net_price"].mean()
    print("Enrollment Strategy Dashboard data prepared")
    print(f"Benchmark slice: {benchmark['benchmark_logic']['slice_name']}")
    print(f"Active cycle inquiries: {len(active):,}")
    print(f"Projected matriculants: {int(active['matriculated_flag'].sum()):,}")
    print(f"Projected deposits: {int(active['deposit_flag'].sum()):,}")
    print(f"Projected melt: {int(active['melt_flag'].sum()):,}")
    print(f"Average net price on admits: ${avg_net_price:,.0f}")


if __name__ == "__main__":
    main()
