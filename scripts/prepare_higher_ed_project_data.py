from __future__ import annotations

import re
import shutil
import tempfile
import urllib.request
import zipfile
from pathlib import Path

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
PROJECTS_DIR = ROOT / "projects"
TEMP_DIR = Path(tempfile.gettempdir())
RNG = np.random.default_rng(20260317)

OULAD_URL = "https://analyse.kmi.open.ac.uk/open-dataset/download"
SCORECARD_URL = (
    "https://ed-public-download.scorecard.network/downloads/"
    "Most-Recent-Cohorts-Institution_10032025.zip"
)
TELCO_URL = (
    "https://raw.githubusercontent.com/IBM/telco-customer-churn-on-icp4d/"
    "master/data/Telco-Customer-Churn.csv"
)


PROJECT_CONFIG = {
    "enrollment-funnel-benchmark": {
        "title": "Enrollment Funnel Model",
        "subtitle": "Synthetic + benchmark hybrid pipeline for inquiry to enrollment analysis.",
        "source_note": (
            "Synthetic student-level data calibrated to realistic higher-ed funnel ranges. "
            "Benchmark guardrails are intentionally kept within the user-defined ranges: "
            "inquiry to application 20% to 40%, application to offer 60% to 80%, and "
            "offer to enrollment 20% to 50%."
        ),
        "tabs": [
            "Executive Summary",
            "Funnel Conversion",
            "Source and Market Mix",
            "Conversion Velocity",
            "Segment Drilldown",
        ],
        "files": [
            "data/enrollment_funnel_synthetic.csv",
            "data/enrollment_funnel_summary.csv",
        ],
    },
    "retention-early-alert": {
        "title": "Retention / Early Alert Model",
        "subtitle": "Real OULAD engagement and performance data prepared for risk analytics.",
        "source_note": (
            "Built from the Open University Learning Analytics Dataset official download. "
            "The local file is a processed student-course summary table sized for static dashboards."
        ),
        "tabs": [
            "Executive Summary",
            "Risk Segments",
            "Engagement and Assessment",
            "Course Drilldown",
            "Intervention Opportunities",
        ],
        "files": [
            "data/oulad_early_alert_student_course.csv",
        ],
    },
    "degree-roi-value": {
        "title": "ROI / Degree Value Model",
        "subtitle": "Real institution-level value analytics using College Scorecard data.",
        "source_note": (
            "Prepared from the official College Scorecard most recent institution-level "
            "data file. The local CSV keeps only the fields needed for ROI, cost, debt, "
            "completion, and outcomes analysis."
        ),
        "tabs": [
            "Executive Summary",
            "Value Map",
            "Cost vs Earnings",
            "Debt and Completion",
            "Institution Drilldown",
        ],
        "files": [
            "data/college_scorecard_roi.csv",
        ],
    },
    "scholarship-optimization": {
        "title": "Scholarship Optimization",
        "subtitle": "Real base data with synthetic scholarship scenarios for revenue curves.",
        "source_note": (
            "Derived from official College Scorecard institution-level data, then extended "
            "with modeled scholarship discount scenarios from 0% to 100% in 10-point bands."
        ),
        "tabs": [
            "Executive Summary",
            "Revenue Curve",
            "Yield Response",
            "Discount Bands",
            "Institution Drilldown",
        ],
        "files": [
            "data/scholarship_revenue_curve.csv",
            "data/scholarship_optimal_discount_summary.csv",
        ],
    },
    "crm-engagement-analytics": {
        "title": "CRM / Engagement Analytics",
        "subtitle": "Real churn data translated into an education retention and engagement frame.",
        "source_note": (
            "Uses the IBM Telco Customer Churn dataset as a real engagement-retention analog. "
            "The translated file remaps the business fields into student-service language while "
            "preserving the underlying observations."
        ),
        "tabs": [
            "Executive Summary",
            "Attrition Risk",
            "Service Usage",
            "Billing and Commitment",
            "Profile Drilldown",
        ],
        "files": [
            "data/telco_customer_churn_raw.csv",
            "data/student_crm_engagement_translated.csv",
        ],
    },
}


def ensure_project_scaffold() -> None:
    for slug in PROJECT_CONFIG:
        (PROJECTS_DIR / slug / "data").mkdir(parents=True, exist_ok=True)


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.strip() + "\n", encoding="utf-8")


def write_project_readmes() -> None:
    for slug, config in PROJECT_CONFIG.items():
        lines = [
            f"# {config['title']}",
            "",
            config["subtitle"],
            "",
            "## Local Data Files",
            *[f"- `{file_name}`" for file_name in config["files"]],
            "",
            "## Intended Dashboard Tabs",
            *[f"- {tab}" for tab in config["tabs"]],
            "",
            "## Source Note",
            config["source_note"],
        ]
        content = "\n".join(lines)
        write_text(PROJECTS_DIR / slug / "README.md", content)


def download_file(url: str, destination: Path) -> Path:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists():
        return destination

    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request) as response, destination.open("wb") as handle:
        shutil.copyfileobj(response, handle)
    return destination


def sigmoid(values: np.ndarray) -> np.ndarray:
    return 1.0 / (1.0 + np.exp(-values))


def parse_numeric_value(value: object) -> float:
    if value is None:
        return np.nan
    if isinstance(value, (int, float, np.integer, np.floating)):
        return float(value)

    text = str(value).strip()
    if text in {"", "NULL", "NaN", "nan", "PrivacySuppressed", "PS"}:
        return np.nan

    if match := re.fullmatch(r"<=\s*([0-9]*\.?[0-9]+)", text):
        return float(match.group(1))
    if match := re.fullmatch(r">=\s*([0-9]*\.?[0-9]+)", text):
        return float(match.group(1))
    if match := re.fullmatch(r"([0-9]*\.?[0-9]+)\s*-\s*([0-9]*\.?[0-9]+)", text):
        return (float(match.group(1)) + float(match.group(2))) / 2.0

    try:
        return float(text)
    except ValueError:
        return np.nan


def coerce_numeric(series: pd.Series) -> pd.Series:
    return series.map(parse_numeric_value)


def percentile_scale(series: pd.Series) -> pd.Series:
    clean = series.replace([np.inf, -np.inf], np.nan)
    low = clean.quantile(0.05)
    high = clean.quantile(0.95)
    if pd.isna(low) or pd.isna(high) or high <= low:
        return pd.Series(np.nan, index=series.index)
    return ((clean - low) / (high - low)).clip(0, 1)


def generate_enrollment_funnel_data() -> None:
    n_rows = 30000

    cycle_year = RNG.choice([2023, 2024, 2025], size=n_rows, p=[0.28, 0.33, 0.39])
    student_type = RNG.choice(
        ["First-Year", "Transfer", "Graduate"], size=n_rows, p=[0.62, 0.20, 0.18]
    )
    residency = np.where(
        student_type == "Graduate",
        RNG.choice(["Domestic", "International"], size=n_rows, p=[0.68, 0.32]),
        RNG.choice(["Domestic", "International"], size=n_rows, p=[0.82, 0.18]),
    )
    source_channel = RNG.choice(
        ["Search", "Website", "Campus Visit", "School Counselor", "Agent", "Referral", "Event"],
        size=n_rows,
        p=[0.19, 0.17, 0.13, 0.11, 0.10, 0.11, 0.19],
    )
    academic_program = RNG.choice(
        ["Business", "Computer Science", "Engineering", "Health", "Education", "Liberal Arts"],
        size=n_rows,
        p=[0.24, 0.18, 0.14, 0.16, 0.10, 0.18],
    )
    geography = RNG.choice(
        ["Local", "Regional", "National", "International"],
        size=n_rows,
        p=[0.26, 0.35, 0.24, 0.15],
    )
    first_gen_flag = RNG.choice([0, 1], size=n_rows, p=[0.64, 0.36])
    need_aid_flag = RNG.choice([0, 1], size=n_rows, p=[0.42, 0.58])
    visit_flag = RNG.choice([0, 1], size=n_rows, p=[0.57, 0.43])
    counselor_meeting_flag = RNG.choice([0, 1], size=n_rows, p=[0.62, 0.38])

    program_effect = pd.Series(academic_program).map(
        {
            "Business": 2.0,
            "Computer Science": 6.0,
            "Engineering": 5.0,
            "Health": 3.0,
            "Education": -2.0,
            "Liberal Arts": -1.5,
        }
    ).to_numpy()
    channel_effect = pd.Series(source_channel).map(
        {
            "Search": 1.0,
            "Website": 0.0,
            "Campus Visit": 6.0,
            "School Counselor": 4.0,
            "Agent": -2.0,
            "Referral": 5.0,
            "Event": 3.0,
        }
    ).to_numpy()
    geography_effect = pd.Series(geography).map(
        {"Local": 5.0, "Regional": 2.0, "National": -1.0, "International": -3.0}
    ).to_numpy()
    student_type_effect = pd.Series(student_type).map(
        {"First-Year": 0.0, "Transfer": 3.0, "Graduate": 4.0}
    ).to_numpy()

    academic_index = np.clip(
        RNG.normal(66.0 + program_effect + student_type_effect, 11.0, n_rows), 35.0, 99.0
    )
    affordability_index = np.clip(
        RNG.normal(
            56.0
            + (residency == "Domestic") * 4.5
            - need_aid_flag * 5.0
            - first_gen_flag * 2.5
            + geography_effect,
            12.0,
            n_rows,
        ),
        5.0,
        99.0,
    )
    engagement_score = np.clip(
        RNG.normal(
            51.0
            + channel_effect
            + visit_flag * 10.0
            + counselor_meeting_flag * 8.0
            + geography_effect,
            13.0,
            n_rows,
        ),
        1.0,
        99.0,
    )

    inquiry_to_app_prob = np.clip(
        sigmoid(
            -0.86
            + 0.018 * (engagement_score - 50.0)
            + 0.007 * (academic_index - 60.0)
            + 0.42 * visit_flag
            + 0.23 * counselor_meeting_flag
            + 0.10 * (student_type == "Transfer")
            - 0.08 * (source_channel == "Agent")
        ),
        0.20,
        0.40,
    )
    application_flag = (RNG.random(n_rows) < inquiry_to_app_prob).astype(int)

    completeness_score = np.clip(
        0.45 * academic_index
        + 0.30 * engagement_score
        + 0.15 * affordability_index
        + 6.0 * visit_flag
        + 5.0 * counselor_meeting_flag
        + RNG.normal(0.0, 6.0, n_rows),
        20.0,
        100.0,
    )
    app_to_offer_prob = np.clip(
        sigmoid(
            0.68
            + 0.030 * (academic_index - 60.0)
            + 0.010 * (completeness_score - 60.0)
            + 0.08 * (student_type == "Graduate")
            - 0.10 * (academic_program == "Computer Science")
            - 0.06 * (academic_program == "Engineering")
            - 0.03 * first_gen_flag
        ),
        0.60,
        0.80,
    )
    offer_flag = (
        application_flag.astype(bool) & (RNG.random(n_rows) < app_to_offer_prob)
    ).astype(int)

    offer_fit_score = np.clip(
        0.35 * engagement_score
        + 0.32 * affordability_index
        + 0.18 * academic_index
        + 8.0 * visit_flag
        + 6.0 * counselor_meeting_flag
        - 4.0 * (residency == "International")
        + RNG.normal(0.0, 6.0, n_rows),
        10.0,
        100.0,
    )
    offer_to_enroll_prob = np.clip(
        sigmoid(
            -0.72
            + 0.017 * (offer_fit_score - 55.0)
            + 0.26 * visit_flag
            + 0.14 * (residency == "Domestic")
            + 0.10 * (student_type == "Transfer")
            - 0.07 * need_aid_flag
            + 0.07 * (source_channel == "Referral")
        ),
        0.20,
        0.50,
    )
    enrollment_flag = (
        offer_flag.astype(bool) & (RNG.random(n_rows) < offer_to_enroll_prob)
    ).astype(int)

    cycle_start = pd.to_datetime(cycle_year - 1, format="%Y") + pd.offsets.DateOffset(months=6)
    inquiry_offset = RNG.integers(0, 280, size=n_rows)
    inquiry_date = cycle_start + pd.to_timedelta(inquiry_offset, unit="D")

    inquiry_to_app_days = np.where(
        application_flag == 1,
        np.clip(
            np.round(
                RNG.normal(42.0 - 0.22 * (engagement_score - 50.0) - 5.0 * visit_flag, 11.0)
            ),
            2,
            110,
        ),
        np.nan,
    )
    application_date = pd.to_datetime(
        np.where(
            application_flag == 1,
            inquiry_date + pd.to_timedelta(inquiry_to_app_days, unit="D"),
            pd.NaT,
        )
    )

    app_to_offer_days = np.where(
        offer_flag == 1,
        np.clip(
            np.round(
                RNG.normal(
                    28.0
                    - 0.15 * (completeness_score - 60.0)
                    + 2.0 * (academic_program == "Engineering"),
                    7.0,
                )
            ),
            7,
            60,
        ),
        np.nan,
    )
    offer_date = pd.to_datetime(
        np.where(
            offer_flag == 1,
            application_date + pd.to_timedelta(app_to_offer_days, unit="D"),
            pd.NaT,
        )
    )

    offer_to_enroll_days = np.where(
        enrollment_flag == 1,
        np.clip(
            np.round(
                RNG.normal(25.0 - 0.12 * (offer_fit_score - 55.0) - 4.0 * visit_flag, 8.0)
            ),
            3,
            50,
        ),
        np.nan,
    )
    enrollment_date = pd.to_datetime(
        np.where(
            enrollment_flag == 1,
            offer_date + pd.to_timedelta(offer_to_enroll_days, unit="D"),
            pd.NaT,
        )
    )

    final_stage = np.select(
        [enrollment_flag == 1, offer_flag == 1, application_flag == 1],
        ["Enrolled", "Offered_Not_Enrolled", "Applied_Not_Admitted"],
        default="Inquiry_Only",
    )
    stop_reason = np.select(
        [enrollment_flag == 1, offer_flag == 1, application_flag == 1],
        ["Converted", "Yield_Loss", "Denied"],
        default="No_Application",
    )

    funnel_df = pd.DataFrame(
        {
            "student_id": [f"ENR-{index:05d}" for index in range(1, n_rows + 1)],
            "cycle_year": cycle_year,
            "student_type": student_type,
            "residency": residency,
            "source_channel": source_channel,
            "academic_program": academic_program,
            "market_geography": geography,
            "first_gen_flag": first_gen_flag,
            "need_aid_flag": need_aid_flag,
            "visit_flag": visit_flag,
            "counselor_meeting_flag": counselor_meeting_flag,
            "academic_index": np.round(academic_index, 1),
            "affordability_index": np.round(affordability_index, 1),
            "engagement_score": np.round(engagement_score, 1),
            "completeness_score": np.round(completeness_score, 1),
            "offer_fit_score": np.round(offer_fit_score, 1),
            "inquiry_to_app_prob": np.round(inquiry_to_app_prob, 4),
            "app_to_offer_prob": np.round(app_to_offer_prob, 4),
            "offer_to_enroll_prob": np.round(offer_to_enroll_prob, 4),
            "inquiry_flag": 1,
            "application_flag": application_flag,
            "offer_flag": offer_flag,
            "enrollment_flag": enrollment_flag,
            "inquiry_date": pd.to_datetime(inquiry_date).strftime("%Y-%m-%d"),
            "application_date": application_date.strftime("%Y-%m-%d"),
            "offer_date": offer_date.strftime("%Y-%m-%d"),
            "enrollment_date": enrollment_date.strftime("%Y-%m-%d"),
            "days_inquiry_to_app": inquiry_to_app_days,
            "days_app_to_offer": app_to_offer_days,
            "days_offer_to_enroll": offer_to_enroll_days,
            "final_stage": final_stage,
            "stop_reason": stop_reason,
        }
    )

    summary_rows = []
    for group_name, group_df in [
        ("Overall", funnel_df),
        *[(f"Cycle {year}", frame) for year, frame in funnel_df.groupby("cycle_year")],
        *[(f"Channel {name}", frame) for name, frame in funnel_df.groupby("source_channel")],
        *[(f"Residency {name}", frame) for name, frame in funnel_df.groupby("residency")],
    ]:
        inquiries = int(group_df["inquiry_flag"].sum())
        applications = int(group_df["application_flag"].sum())
        offers = int(group_df["offer_flag"].sum())
        enrollments = int(group_df["enrollment_flag"].sum())
        summary_rows.append(
            {
                "segment": group_name,
                "inquiries": inquiries,
                "applications": applications,
                "offers": offers,
                "enrollments": enrollments,
                "inquiry_to_app_rate": round(applications / inquiries, 4) if inquiries else np.nan,
                "app_to_offer_rate": round(offers / applications, 4) if applications else np.nan,
                "offer_to_enroll_rate": round(enrollments / offers, 4) if offers else np.nan,
                "overall_inquiry_to_enroll_rate": round(enrollments / inquiries, 4) if inquiries else np.nan,
            }
        )

    project_dir = PROJECTS_DIR / "enrollment-funnel-benchmark" / "data"
    funnel_df.to_csv(project_dir / "enrollment_funnel_synthetic.csv", index=False)
    pd.DataFrame(summary_rows).to_csv(project_dir / "enrollment_funnel_summary.csv", index=False)


def prepare_oulad_data() -> None:
    zip_path = download_file(OULAD_URL, TEMP_DIR / "oulad_official.zip")
    with zipfile.ZipFile(zip_path) as archive:
        student_info = pd.read_csv(archive.open("studentInfo.csv"))
        registration = pd.read_csv(archive.open("studentRegistration.csv"))
        assessments = pd.read_csv(archive.open("assessments.csv"))
        student_assessment = pd.read_csv(archive.open("studentAssessment.csv"))

        activity_chunks = []
        for chunk in pd.read_csv(archive.open("studentVle.csv"), chunksize=500000):
            chunk["clicks_first_30_days"] = np.where(
                chunk["date"].between(0, 30), chunk["sum_click"], 0
            )
            chunk["events_first_30_days"] = np.where(chunk["date"].between(0, 30), 1, 0)
            chunk_summary = (
                chunk.groupby(["code_module", "code_presentation", "id_student"], as_index=False)
                .agg(
                    total_clicks=("sum_click", "sum"),
                    total_vle_events=("sum_click", "size"),
                    clicks_first_30_days=("clicks_first_30_days", "sum"),
                    events_first_30_days=("events_first_30_days", "sum"),
                    first_activity_day=("date", "min"),
                    last_activity_day=("date", "max"),
                )
            )
            activity_chunks.append(chunk_summary)

    activity = pd.concat(activity_chunks, ignore_index=True)
    activity = (
        activity.groupby(["code_module", "code_presentation", "id_student"], as_index=False)
        .agg(
            total_clicks=("total_clicks", "sum"),
            total_vle_events=("total_vle_events", "sum"),
            clicks_first_30_days=("clicks_first_30_days", "sum"),
            events_first_30_days=("events_first_30_days", "sum"),
            first_activity_day=("first_activity_day", "min"),
            last_activity_day=("last_activity_day", "max"),
        )
    )
    activity["activity_span_days"] = activity["last_activity_day"] - activity["first_activity_day"]

    registration["registered_pre_start_days"] = (-registration["date_registration"]).clip(lower=0)
    registration["unregistered_flag"] = registration["date_unregistration"].notna().astype(int)
    registration["days_until_unregistration"] = registration["date_unregistration"]

    assessment_detail = student_assessment.merge(
        assessments[
            [
                "id_assessment",
                "code_module",
                "code_presentation",
                "assessment_type",
                "date",
                "weight",
            ]
        ],
        on="id_assessment",
        how="left",
    )
    assessment_detail["weighted_points"] = (
        assessment_detail["score"].fillna(0) * assessment_detail["weight"].fillna(0) / 100.0
    )
    assessment_detail["days_from_due"] = (
        assessment_detail["date_submitted"] - assessment_detail["date"]
    )
    assessment_detail["late_submission_flag"] = (
        assessment_detail["days_from_due"] > 0
    ).fillna(False).astype(int)

    assessment_summary = (
        assessment_detail.groupby(["code_module", "code_presentation", "id_student"], as_index=False)
        .agg(
            assessments_submitted=("score", "count"),
            avg_assessment_score=("score", "mean"),
            weighted_score=("weighted_points", "sum"),
            avg_days_from_due=("days_from_due", "mean"),
            late_submission_rate=("late_submission_flag", "mean"),
        )
    )

    merged = (
        student_info.merge(
            registration[
                [
                    "code_module",
                    "code_presentation",
                    "id_student",
                    "registered_pre_start_days",
                    "unregistered_flag",
                    "days_until_unregistration",
                ]
            ],
            on=["code_module", "code_presentation", "id_student"],
            how="left",
        )
        .merge(
            assessment_summary,
            on=["code_module", "code_presentation", "id_student"],
            how="left",
        )
        .merge(
            activity,
            on=["code_module", "code_presentation", "id_student"],
            how="left",
        )
    )

    fill_zero_columns = [
        "registered_pre_start_days",
        "unregistered_flag",
        "days_until_unregistration",
        "assessments_submitted",
        "avg_assessment_score",
        "weighted_score",
        "avg_days_from_due",
        "late_submission_rate",
        "total_clicks",
        "total_vle_events",
        "clicks_first_30_days",
        "events_first_30_days",
        "first_activity_day",
        "last_activity_day",
        "activity_span_days",
    ]
    for column in fill_zero_columns:
        if column in merged:
            merged[column] = merged[column].fillna(0)

    click_scale = percentile_scale(merged["total_clicks"])
    click30_scale = percentile_scale(merged["clicks_first_30_days"])
    assessment_scale = percentile_scale(merged["weighted_score"])
    submission_scale = percentile_scale(merged["assessments_submitted"])
    merged["engagement_index"] = (
        (0.40 * click_scale.fillna(0))
        + (0.20 * click30_scale.fillna(0))
        + (0.25 * submission_scale.fillna(0))
        + (0.15 * assessment_scale.fillna(0))
    ) * 100.0
    merged["early_alert_risk_score"] = (
        100.0
        - (
            0.45 * merged["engagement_index"]
            + 0.30 * merged["weighted_score"].clip(0, 100)
            + 10.0 * merged["final_result"].isin(["Pass", "Distinction"]).astype(int)
        )
        + 6.0 * merged["num_of_prev_attempts"]
        + 8.0 * merged["unregistered_flag"]
    ).clip(0, 100)
    merged["at_risk_flag"] = merged["final_result"].isin(["Fail", "Withdrawn"]).astype(int)

    prepared = merged[
        [
            "code_module",
            "code_presentation",
            "id_student",
            "gender",
            "region",
            "highest_education",
            "imd_band",
            "age_band",
            "num_of_prev_attempts",
            "studied_credits",
            "disability",
            "final_result",
            "at_risk_flag",
            "registered_pre_start_days",
            "unregistered_flag",
            "days_until_unregistration",
            "assessments_submitted",
            "avg_assessment_score",
            "weighted_score",
            "avg_days_from_due",
            "late_submission_rate",
            "total_clicks",
            "clicks_first_30_days",
            "total_vle_events",
            "events_first_30_days",
            "first_activity_day",
            "last_activity_day",
            "activity_span_days",
            "engagement_index",
            "early_alert_risk_score",
        ]
    ].copy()
    prepared = prepared.rename(
        columns={
            "code_module": "module_code",
            "code_presentation": "presentation_code",
            "id_student": "student_id",
            "imd_band": "deprivation_band",
            "disability": "disability_flag",
        }
    )

    project_dir = PROJECTS_DIR / "retention-early-alert" / "data"
    prepared.to_csv(project_dir / "oulad_early_alert_student_course.csv", index=False)


def prepare_scorecard_roi_data() -> pd.DataFrame:
    zip_path = download_file(SCORECARD_URL, TEMP_DIR / "college_scorecard_recent.zip")
    use_columns = [
        "UNITID",
        "INSTNM",
        "CITY",
        "STABBR",
        "CONTROL",
        "PREDDEG",
        "MAIN",
        "CURROPER",
        "LOCALE",
        "REGION",
        "ADM_RATE",
        "SAT_AVG",
        "UGDS",
        "COSTT4_A",
        "TUITIONFEE_IN",
        "TUITIONFEE_OUT",
        "PCTPELL",
        "C150_4_POOLED",
        "C150_L4_POOLED",
        "RET_FT4",
        "RET_FTL4",
        "RPY_3YR_RT",
        "GRAD_DEBT_MDN",
        "DEBT_MDN",
        "MD_EARN_WNE_P10",
        "MN_EARN_WNE_P10",
        "GT_25K_P10",
        "DISTANCEONLY",
    ]

    with zipfile.ZipFile(zip_path) as archive:
        with archive.open("Most-Recent-Cohorts-Institution.csv") as handle:
            raw = pd.read_csv(handle, usecols=use_columns, dtype=str, low_memory=False)

    numeric_columns = [
        "CONTROL",
        "PREDDEG",
        "MAIN",
        "CURROPER",
        "LOCALE",
        "REGION",
        "ADM_RATE",
        "SAT_AVG",
        "UGDS",
        "COSTT4_A",
        "TUITIONFEE_IN",
        "TUITIONFEE_OUT",
        "PCTPELL",
        "C150_4_POOLED",
        "C150_L4_POOLED",
        "RET_FT4",
        "RET_FTL4",
        "RPY_3YR_RT",
        "GRAD_DEBT_MDN",
        "DEBT_MDN",
        "MD_EARN_WNE_P10",
        "MN_EARN_WNE_P10",
        "GT_25K_P10",
        "DISTANCEONLY",
    ]
    for column in numeric_columns:
        raw[column] = coerce_numeric(raw[column])

    roi_df = raw[(raw["MAIN"] == 1) & (raw["CURROPER"] == 1)].copy()
    roi_df["control_label"] = roi_df["CONTROL"].map(
        {1.0: "Public", 2.0: "Private nonprofit", 3.0: "Private for-profit"}
    )
    roi_df["degree_level"] = roi_df["PREDDEG"].map(
        {
            0.0: "Not classified",
            1.0: "Certificate",
            2.0: "Associate",
            3.0: "Bachelors",
            4.0: "Graduate",
        }
    )
    roi_df["region_label"] = roi_df["REGION"].map(
        {
            0.0: "Service schools",
            1.0: "New England",
            2.0: "Mid East",
            3.0: "Great Lakes",
            4.0: "Plains",
            5.0: "Southeast",
            6.0: "Southwest",
            7.0: "Rocky Mountains",
            8.0: "Far West",
            9.0: "Outlying areas",
        }
    )
    roi_df["completion_rate"] = np.where(
        roi_df["PREDDEG"].fillna(0) >= 3,
        roi_df["C150_4_POOLED"],
        roi_df["C150_L4_POOLED"],
    )
    roi_df["retention_rate"] = np.where(
        roi_df["PREDDEG"].fillna(0) >= 3,
        roi_df["RET_FT4"],
        roi_df["RET_FTL4"],
    )
    roi_df["median_debt"] = roi_df["GRAD_DEBT_MDN"].fillna(roi_df["DEBT_MDN"])
    roi_df["median_earnings_10yr"] = roi_df["MD_EARN_WNE_P10"]
    roi_df["median_earnings_monthly"] = roi_df["MN_EARN_WNE_P10"]
    roi_df["earnings_to_cost_ratio"] = (
        roi_df["median_earnings_10yr"] / roi_df["COSTT4_A"]
    ).replace([np.inf, -np.inf], np.nan)
    roi_df["debt_to_earnings_ratio"] = (
        roi_df["median_debt"] / roi_df["median_earnings_10yr"]
    ).replace([np.inf, -np.inf], np.nan)

    roi_df = roi_df[
        roi_df["median_earnings_10yr"].notna()
        & roi_df["COSTT4_A"].notna()
        & roi_df["completion_rate"].notna()
        & roi_df["UGDS"].notna()
        & (roi_df["UGDS"] >= 300)
    ].copy()
    roi_df["roi_value_score"] = (
        100.0
        * (
            0.35 * percentile_scale(roi_df["median_earnings_10yr"]).fillna(0)
            + 0.20 * percentile_scale(roi_df["completion_rate"]).fillna(0)
            + 0.15 * percentile_scale(roi_df["retention_rate"]).fillna(0)
            + 0.15 * (1 - percentile_scale(roi_df["COSTT4_A"]).fillna(0))
            + 0.15 * (1 - percentile_scale(roi_df["debt_to_earnings_ratio"]).fillna(0))
        )
    ).round(1)

    prepared = roi_df[
        [
            "UNITID",
            "INSTNM",
            "CITY",
            "STABBR",
            "control_label",
            "degree_level",
            "region_label",
            "ADM_RATE",
            "SAT_AVG",
            "UGDS",
            "COSTT4_A",
            "TUITIONFEE_IN",
            "TUITIONFEE_OUT",
            "PCTPELL",
            "completion_rate",
            "retention_rate",
            "RPY_3YR_RT",
            "median_debt",
            "median_earnings_10yr",
            "median_earnings_monthly",
            "GT_25K_P10",
            "earnings_to_cost_ratio",
            "debt_to_earnings_ratio",
            "roi_value_score",
            "DISTANCEONLY",
        ]
    ].copy()
    prepared = prepared.rename(
        columns={
            "UNITID": "unit_id",
            "INSTNM": "institution_name",
            "CITY": "city",
            "STABBR": "state",
            "ADM_RATE": "admission_rate",
            "SAT_AVG": "average_sat",
            "UGDS": "undergrad_size",
            "COSTT4_A": "cost_of_attendance",
            "TUITIONFEE_IN": "tuition_in_state",
            "TUITIONFEE_OUT": "tuition_out_of_state",
            "PCTPELL": "pell_share",
            "RPY_3YR_RT": "repayment_rate_3yr",
            "GT_25K_P10": "share_earning_above_25k",
            "DISTANCEONLY": "distance_only_flag",
        }
    )

    project_dir = PROJECTS_DIR / "degree-roi-value" / "data"
    prepared.to_csv(project_dir / "college_scorecard_roi.csv", index=False)
    return prepared


def prepare_scholarship_data(roi_df: pd.DataFrame) -> None:
    eligible = roi_df[
        roi_df["tuition_in_state"].fillna(roi_df["cost_of_attendance"]).notna()
        & (roi_df["undergrad_size"] >= 500)
    ].copy()

    sticker_tuition = eligible["tuition_in_state"].fillna(eligible["cost_of_attendance"] * 0.62)
    program_length = eligible["degree_level"].map(
        {"Certificate": 1.5, "Associate": 2.0, "Bachelors": 4.0, "Graduate": 2.0}
    ).fillna(4.0)
    baseline_incoming_class = (eligible["undergrad_size"] / program_length).clip(100, 6000)
    baseline_yield = (
        0.19
        + 0.22 * (1 - eligible["admission_rate"].fillna(0.70))
        + 0.10 * eligible["retention_rate"].fillna(0.55)
        + 0.05 * (eligible["control_label"] == "Private nonprofit").astype(int)
    ).clip(0.18, 0.55)
    price_sensitivity = (
        0.45
        + 0.80 * eligible["pell_share"].fillna(0.35)
        + 0.12 * (eligible["control_label"] == "Public").astype(int)
        - 0.08 * eligible["admission_rate"].fillna(0.70)
    ).clip(0.35, 1.20)

    scenario_frames = []
    for discount_pct in range(0, 101, 10):
        discount_rate = discount_pct / 100.0
        projected_yield = (
            baseline_yield + np.sqrt(discount_rate) * price_sensitivity * 0.18
        ).clip(lower=baseline_yield, upper=0.90)
        implied_offers = baseline_incoming_class / baseline_yield
        projected_enrollment = implied_offers * projected_yield
        projected_net_tuition = sticker_tuition * (1 - discount_rate)
        base_revenue = baseline_incoming_class * sticker_tuition
        projected_net_revenue = projected_enrollment * projected_net_tuition

        scenario_frames.append(
            pd.DataFrame(
                {
                    "unit_id": eligible["unit_id"],
                    "institution_name": eligible["institution_name"],
                    "state": eligible["state"],
                    "control_label": eligible["control_label"],
                    "degree_level": eligible["degree_level"],
                    "undergrad_size": eligible["undergrad_size"],
                    "pell_share": eligible["pell_share"],
                    "admission_rate": eligible["admission_rate"],
                    "retention_rate": eligible["retention_rate"],
                    "cost_of_attendance": eligible["cost_of_attendance"],
                    "sticker_tuition_proxy": sticker_tuition.round(0),
                    "baseline_incoming_class": baseline_incoming_class.round(0),
                    "baseline_yield": baseline_yield.round(4),
                    "price_sensitivity": price_sensitivity.round(4),
                    "scholarship_discount_pct": discount_pct,
                    "projected_yield": projected_yield.round(4),
                    "projected_enrollment": projected_enrollment.round(0),
                    "projected_net_tuition": projected_net_tuition.round(0),
                    "projected_net_revenue": projected_net_revenue.round(0),
                    "incremental_enrollment": (projected_enrollment - baseline_incoming_class).round(0),
                    "revenue_change_pct": ((projected_net_revenue / base_revenue) - 1.0).round(4),
                }
            )
        )

    scenarios = pd.concat(scenario_frames, ignore_index=True)
    best_idx = scenarios.groupby("unit_id")["projected_net_revenue"].idxmax()
    optimal = scenarios.loc[best_idx].copy()
    optimal = optimal.rename(
        columns={
            "scholarship_discount_pct": "optimal_discount_pct",
            "projected_yield": "optimal_projected_yield",
            "projected_enrollment": "optimal_projected_enrollment",
            "projected_net_tuition": "optimal_net_tuition",
            "projected_net_revenue": "optimal_net_revenue",
            "incremental_enrollment": "optimal_incremental_enrollment",
            "revenue_change_pct": "optimal_revenue_change_pct",
        }
    )

    project_dir = PROJECTS_DIR / "scholarship-optimization" / "data"
    scenarios.to_csv(project_dir / "scholarship_revenue_curve.csv", index=False)
    optimal.to_csv(project_dir / "scholarship_optimal_discount_summary.csv", index=False)


def prepare_crm_data() -> None:
    raw_path = download_file(TELCO_URL, TEMP_DIR / "ibm_telco_customer_churn.csv")
    raw_df = pd.read_csv(raw_path)
    raw_df["TotalCharges"] = pd.to_numeric(raw_df["TotalCharges"], errors="coerce")

    service_columns = [
        "PhoneService",
        "MultipleLines",
        "OnlineSecurity",
        "OnlineBackup",
        "DeviceProtection",
        "TechSupport",
        "StreamingTV",
        "StreamingMovies",
        "PaperlessBilling",
    ]

    def yes_flag(series: pd.Series) -> pd.Series:
        return series.map(
            {
                "Yes": 1,
                "No": 0,
                "No internet service": 0,
                "No phone service": 0,
            }
        ).fillna(0)

    transformed = pd.DataFrame(
        {
            "student_id": [f"CRM-{index:05d}" for index in range(1, len(raw_df) + 1)],
            "gender": raw_df["gender"],
            "adult_learner_flag": raw_df["SeniorCitizen"].astype(int),
            "family_support_flag": yes_flag(raw_df["Partner"]),
            "dependents_flag": yes_flag(raw_df["Dependents"]),
            "student_lifecycle_months": raw_df["tenure"],
            "mobile_contactable_flag": yes_flag(raw_df["PhoneService"]),
            "multi_channel_contact_flag": yes_flag(raw_df["MultipleLines"]),
            "digital_access_type": raw_df["InternetService"].replace(
                {"Fiber optic": "High bandwidth", "DSL": "Standard bandwidth", "No": "Limited access"}
            ),
            "academic_support_flag": yes_flag(raw_df["OnlineSecurity"]),
            "study_resources_flag": yes_flag(raw_df["OnlineBackup"]),
            "device_readiness_flag": yes_flag(raw_df["DeviceProtection"]),
            "advising_support_flag": yes_flag(raw_df["TechSupport"]),
            "co_curricular_content_flag": yes_flag(raw_df["StreamingTV"]),
            "career_content_flag": yes_flag(raw_df["StreamingMovies"]),
            "enrollment_commitment_type": raw_df["Contract"].replace(
                {
                    "Month-to-month": "Open enrollment",
                    "One year": "Annual commitment",
                    "Two year": "Multi-year commitment",
                }
            ),
            "digital_self_service_flag": yes_flag(raw_df["PaperlessBilling"]),
            "payment_plan_type": raw_df["PaymentMethod"],
            "monthly_student_bill": raw_df["MonthlyCharges"],
            "cumulative_student_bill": raw_df["TotalCharges"],
            "actual_dropout_flag": yes_flag(raw_df["Churn"]),
        }
    )

    transformed["engagement_services_count"] = sum(
        yes_flag(raw_df[column]) for column in service_columns
    )
    transformed["engagement_index"] = (
        transformed["engagement_services_count"] / len(service_columns) * 80.0
        + transformed["multi_channel_contact_flag"] * 10.0
        + transformed["digital_self_service_flag"] * 10.0
    ).round(1)
    transformed["attrition_risk_score"] = (
        45.0 * (transformed["enrollment_commitment_type"] == "Open enrollment").astype(int)
        + 20.0 * (1 - transformed["academic_support_flag"])
        + 12.0 * (1 - transformed["advising_support_flag"])
        + 10.0 * (1 - transformed["device_readiness_flag"])
        + 8.0 * (transformed["monthly_student_bill"] > transformed["monthly_student_bill"].median()).astype(int)
        + 5.0 * (transformed["student_lifecycle_months"] < 12).astype(int)
    ).clip(0, 100)

    project_dir = PROJECTS_DIR / "crm-engagement-analytics" / "data"
    raw_df.to_csv(project_dir / "telco_customer_churn_raw.csv", index=False)
    transformed.to_csv(project_dir / "student_crm_engagement_translated.csv", index=False)


def main() -> None:
    ensure_project_scaffold()
    write_project_readmes()
    generate_enrollment_funnel_data()
    prepare_oulad_data()
    roi_df = prepare_scorecard_roi_data()
    prepare_scholarship_data(roi_df)
    prepare_crm_data()

    print("Prepared higher-ed project data in:")
    for slug in PROJECT_CONFIG:
        print(f" - {PROJECTS_DIR / slug}")


if __name__ == "__main__":
    main()
