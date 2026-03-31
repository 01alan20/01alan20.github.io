from __future__ import annotations

import io
import json
import re
import tempfile
import zipfile
from pathlib import Path

import numpy as np
import pandas as pd
import requests

try:
    from pypdf import PdfReader
except ImportError:  # pragma: no cover - optional dependency
    PdfReader = None


ROOT = Path(__file__).resolve().parents[1]
SOURCE_FUNNEL = ROOT / "projects" / "enrollment-funnel-benchmark" / "data" / "enrollment_funnel_synthetic.csv"
MAJOR_TRENDS = ROOT / "projects" / "ipeds-major-trends" / "data" / "major_trend_national_annual.csv"

CACHE_DIR = Path(tempfile.gettempdir()) / "enrollment_strategy_benchmark_cache"
CACHE_DIR.mkdir(parents=True, exist_ok=True)

SCORECARD_URL = "https://ed-public-download.scorecard.network/downloads/Most-Recent-Cohorts-Institution_10032025.zip"
IPEDS_ADM_URL = "https://nces.ed.gov/ipeds/data-generator?year=2024&tableName=ADM2024&HasRV=0&type=csv&t=639105212778670476"

CDS_SOURCES = [
    {
        "institution": "Boston University",
        "url": "https://www.bu.edu/asir/files/2025/03/cds-2025-c.pdf",
    },
    {
        "institution": "University of Vermont",
        "url": "https://www.uvm.edu/d10-files/documents/2025-06/2024-2025-Common_Data_Set_0.pdf",
    },
    {
        "institution": "University of Richmond",
        "url": "https://oir.richmond.edu/pdfs/CDS2024-25.pdf",
    },
]

CONTROL_LABELS = {
    1.0: "public",
    2.0: "private_nonprofit",
    3.0: "private_forprofit",
}

REGION_LABELS = {
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


def coerce_numeric(series: pd.Series) -> pd.Series:
    return pd.to_numeric(series, errors="coerce")


def round_to_increment(value: float, increment: int) -> int:
    return int(round(float(value) / increment) * increment)


def download_bytes(url: str, cache_name: str, *, identity_encoding: bool = False) -> bytes:
    cache_path = CACHE_DIR / cache_name
    if cache_path.exists():
        return cache_path.read_bytes()

    headers = {"Accept-Encoding": "identity"} if identity_encoding else None
    response = requests.get(url, timeout=180, headers=headers)
    response.raise_for_status()
    cache_path.write_bytes(response.content)
    return response.content


def read_zipped_csv(binary: bytes, *, encoding: str = "latin1", **kwargs) -> pd.DataFrame:
    archive = zipfile.ZipFile(io.BytesIO(binary))
    csv_members = [name for name in archive.namelist() if name.lower().endswith(".csv")]
    with archive.open(csv_members[0]) as handle:
        return pd.read_csv(handle, encoding=encoding, low_memory=False, **kwargs)


def load_base_funnel() -> pd.DataFrame:
    return pd.read_csv(SOURCE_FUNNEL)


def load_scorecard() -> pd.DataFrame:
    use_columns = [
        "UNITID",
        "INSTNM",
        "CONTROL",
        "PREDDEG",
        "MAIN",
        "CURROPER",
        "REGION",
        "UGDS",
        "ADM_RATE",
        "SAT_AVG",
        "COSTT4_A",
        "TUITIONFEE_IN",
        "TUITIONFEE_OUT",
        "NPT4_PUB",
        "NPT4_PRIV",
        "PCTPELL",
        "RET_FT4",
    ]

    raw = read_zipped_csv(
        download_bytes(SCORECARD_URL, "college_scorecard_recent.zip"),
        encoding="utf-8",
        usecols=use_columns,
        dtype=str,
    )

    for column in use_columns[2:]:
        raw[column] = coerce_numeric(raw[column])

    df = raw[(raw["MAIN"] == 1) & (raw["CURROPER"] == 1) & (raw["PREDDEG"] >= 3)].copy()
    df["control_label"] = df["CONTROL"].map(CONTROL_LABELS)
    df["region_label"] = df["REGION"].map(REGION_LABELS)
    df["net_price"] = df["NPT4_PRIV"].fillna(df["NPT4_PUB"])
    return df


def load_ipeds_admissions() -> pd.DataFrame:
    raw = read_zipped_csv(
        download_bytes(IPEDS_ADM_URL, "ipeds_adm2024.zip", identity_encoding=True),
        usecols=[
            "UNITID",
            "APPLCN",
            "ADMSSN",
            "ENRLT",
            "SATVR25",
            "SATVR75",
            "SATMT25",
            "SATMT75",
            "ACTCM25",
            "ACTCM75",
        ],
    )

    for column in raw.columns[1:]:
        raw[column] = coerce_numeric(raw[column])

    raw["admit_rate"] = raw["ADMSSN"] / raw["APPLCN"]
    raw["yield_rate"] = raw["ENRLT"] / raw["ADMSSN"]
    raw["sat_total_25"] = raw["SATVR25"] + raw["SATMT25"]
    raw["sat_total_75"] = raw["SATVR75"] + raw["SATMT75"]
    raw["UNITID"] = raw["UNITID"].astype(str)
    return raw


def extract_cds_guardrails() -> dict[str, object]:
    if PdfReader is None:
        return {
            "source_count": 0,
            "records": [],
            "sat_total_25_median": None,
            "sat_total_75_median": None,
            "act_composite_25_median": None,
            "act_composite_75_median": None,
        }

    records: list[dict[str, float | str]] = []
    for source in CDS_SOURCES:
        try:
            binary = download_bytes(source["url"], re.sub(r"[^A-Za-z0-9._-]", "_", source["url"].split("/")[-1]))
            reader = PdfReader(io.BytesIO(binary))
            text = "\n".join(
                (reader.pages[idx].extract_text() or "")
                for idx in range(min(14, len(reader.pages)))
            )
            sat_match = re.search(r"SAT Composite\s+(\d{3,4})\s+(\d{3,4})\s+(\d{3,4})", text)
            act_match = re.search(r"ACT Composite\s+(\d{1,2})\s+(\d{1,2})\s+(\d{1,2})", text)
            if sat_match or act_match:
                records.append(
                    {
                        "institution": source["institution"],
                        "url": source["url"],
                        "sat_total_25": float(sat_match.group(1)) if sat_match else np.nan,
                        "sat_total_75": float(sat_match.group(3)) if sat_match else np.nan,
                        "act_composite_25": float(act_match.group(1)) if act_match else np.nan,
                        "act_composite_75": float(act_match.group(3)) if act_match else np.nan,
                    }
                )
        except Exception:
            continue

    frame = pd.DataFrame(records)
    if frame.empty:
        return {
            "source_count": 0,
            "records": [],
            "sat_total_25_median": None,
            "sat_total_75_median": None,
            "act_composite_25_median": None,
            "act_composite_75_median": None,
        }

    return {
        "source_count": int(len(frame)),
        "records": records,
        "sat_total_25_median": float(frame["sat_total_25"].median(skipna=True)),
        "sat_total_75_median": float(frame["sat_total_75"].median(skipna=True)),
        "act_composite_25_median": float(frame["act_composite_25"].median(skipna=True)),
        "act_composite_75_median": float(frame["act_composite_75"].median(skipna=True)),
    }


def build_program_mix_weights() -> dict[str, float]:
    df = pd.read_csv(MAJOR_TRENDS)
    df = df[df["year"] == df["year"].max()].copy()

    patterns = {
        "Business": r"BUSINESS|MARKETING|MANAGEMENT|FINANCE|ACCOUNTING|HOSPITALITY",
        "Computer Science": r"COMPUTER|INFORMATION|DATA PROCESSING|INFORMATICS|CYBER",
        "Engineering": r"ENGINEERING",
        "Health": r"HEALTH|NURSING|CLINICAL|MEDICAL|PUBLIC HEALTH|PHARMACY|REHABILITATION",
        "Education": r"EDUCATION",
        "Liberal Arts": (
            r"LIBERAL ARTS|HUMANITIES|ENGLISH|HISTORY|SOCIAL SCIENCES|PSYCHOLOGY|COMMUNICATION|VISUAL|"
            r"PERFORMING|BIOLOGICAL|MATHEMATICS|PHYSICAL SCIENCES|FOREIGN LANGUAGES|PHILOSOPHY|"
            r"THEOLOGY|AREA, ETHNIC, CULTURAL, GENDER, AND GROUP STUDIES|MULTI/INTERDISCIPLINARY"
        ),
    }

    counts: dict[str, float] = {}
    for label, pattern in patterns.items():
        mask = df["major_name"].str.contains(pattern, case=False, na=False)
        counts[label] = float(df.loc[mask, "graduates"].sum())

    total = sum(counts.values()) or 1.0
    return {label: value / total for label, value in counts.items()}


def build_source_mix_weights(base_funnel: pd.DataFrame) -> dict[str, float]:
    historical = base_funnel[base_funnel["cycle_year"] < base_funnel["cycle_year"].max()].copy()
    summary = (
        historical.groupby("source_channel", as_index=False)
        .agg(
            inquiries=("student_id", "count"),
            applications=("application_flag", "sum"),
            enrollments=("enrollment_flag", "sum"),
        )
    )
    summary["score"] = (
        summary["inquiries"] * 0.35
        + summary["applications"] * 0.35
        + summary["enrollments"] * 0.30
    )
    total_score = summary["score"].sum() or 1.0
    return {
        row["source_channel"]: float(row["score"] / total_score)
        for _, row in summary.iterrows()
    }


def build_mix_weights(base_funnel: pd.DataFrame, column: str) -> dict[str, float]:
    active = base_funnel.copy()
    shares = active[column].value_counts(normalize=True).sort_index()
    return {str(index): float(value) for index, value in shares.items()}


def derive_current_synthetic_profile(base_funnel: pd.DataFrame) -> dict[str, float]:
    active_cycle = int(base_funnel["cycle_year"].max())
    active = base_funnel[base_funnel["cycle_year"] == active_cycle].copy()
    applications = float(active["application_flag"].sum())
    offers = float(active["offer_flag"].sum())
    enrollments = float(active["enrollment_flag"].sum())

    return {
        "active_cycle": active_cycle,
        "current_inquiries": int(len(active)),
        "current_applications": int(applications),
        "current_offers": int(offers),
        "current_enrollments": int(enrollments),
        "current_admit_rate": float(offers / max(applications, 1)),
        "current_yield_rate": float(enrollments / max(offers, 1)),
        "historical_inquiry_to_complete_rate": float(
            base_funnel[base_funnel["cycle_year"] < active_cycle]["application_flag"].sum()
            / max(len(base_funnel[base_funnel["cycle_year"] < active_cycle]), 1)
        ),
    }


def build_matched_benchmark_slice(base_funnel: pd.DataFrame) -> pd.DataFrame:
    profile = derive_current_synthetic_profile(base_funnel)
    scorecard = load_scorecard()
    admissions = load_ipeds_admissions()

    scorecard["UNITID"] = scorecard["UNITID"].astype(str)
    merged = scorecard.merge(admissions, on="UNITID", how="inner")
    eligible = merged[
        (merged["UGDS"] >= 500)
        & (merged["APPLCN"] >= 5000)
        & merged["admit_rate"].notna()
        & merged["yield_rate"].notna()
        & merged["ENRLT"].notna()
    ].copy()

    matched = eligible[
        eligible["admit_rate"].between(
            profile["current_admit_rate"] - 0.10,
            profile["current_admit_rate"] + 0.10,
        )
        & eligible["yield_rate"].between(
            profile["current_yield_rate"] - 0.08,
            profile["current_yield_rate"] + 0.08,
        )
    ].copy()

    if len(matched) < 8:
        eligible["distance"] = (
            (eligible["admit_rate"] - profile["current_admit_rate"]).abs() * 0.55
            + (eligible["yield_rate"] - profile["current_yield_rate"]).abs() * 0.45
        )
        matched = eligible.nsmallest(40, "distance").copy()

    return matched


def build_enrollment_benchmark_config() -> dict[str, object]:
    base_funnel = load_base_funnel()
    synthetic_profile = derive_current_synthetic_profile(base_funnel)
    matched = build_matched_benchmark_slice(base_funnel)
    cds_guardrails = extract_cds_guardrails()

    admit_rate_guardrail = float(matched["ADMSSN"].sum() / max(matched["APPLCN"].sum(), 1))
    yield_rate_guardrail = float(matched["ENRLT"].sum() / max(matched["ADMSSN"].sum(), 1))
    class_target = round_to_increment(float(matched["ENRLT"].quantile(0.10)), 25)

    deposit_to_matric_rate = 0.865
    admit_to_deposit_rate = min(yield_rate_guardrail / deposit_to_matric_rate, 0.82)
    tuition_in = float(matched["TUITIONFEE_IN"].median(skipna=True))
    tuition_out = float(matched["TUITIONFEE_OUT"].median(skipna=True))
    net_price = float(matched["net_price"].median(skipna=True))
    sticker_anchor = float(np.nanmedian([tuition_out, synthetic_profile["current_enrollments"] * 0 + tuition_out]))
    pricing_discount = float(np.clip(1 - (net_price / max(tuition_out, 1)), 0.08, 0.28))

    sat25 = float(matched["sat_total_25"].median(skipna=True))
    sat75 = float(matched["sat_total_75"].median(skipna=True))
    act25 = float(matched["ACTCM25"].median(skipna=True))
    act75 = float(matched["ACTCM75"].median(skipna=True))

    if cds_guardrails["source_count"]:
        sat75 = min(
            max(sat75, cds_guardrails["sat_total_25_median"] * 0.90),
            cds_guardrails["sat_total_75_median"] * 0.98,
        )
        act75 = min(
            max(act75, cds_guardrails["act_composite_25_median"]),
            cds_guardrails["act_composite_75_median"],
        )

    control_mode = matched["control_label"].mode()
    region_mode = matched["region_label"].mode()

    return {
        "synthetic_profile": synthetic_profile,
        "benchmark_logic": {
            "slice_name": "Matched national 4-year admissions-reporting composite",
            "slice_rule": (
                "Official 4-year institutions with at least 5,000 applications, then matched "
                "to the synthetic operating profile on admit-rate and yield-rate proximity."
            ),
            "matched_institution_count": int(len(matched)),
            "matched_sources": {
                "ipeds_admissions_year": 2024,
                "scorecard_release": "Most-Recent-Cohorts-Institution_10032025",
                "cds_source_count": int(cds_guardrails["source_count"]),
            },
        },
        "institution": {
            "institution_name": "North Coast University",
            "control": control_mode.iloc[0] if not control_mode.empty else "public",
            "level": "4-year",
            "region": region_mode.iloc[0] if not region_mode.empty else "National Composite",
            "class_target": class_target,
            "applications_completed_target": round_to_increment(float(matched["APPLCN"].median(skipna=True)), 100),
            "admit_rate_guardrail": admit_rate_guardrail,
            "yield_rate_guardrail": yield_rate_guardrail,
            "retention_rate_guardrail": float(matched["RET_FT4"].median(skipna=True)),
            "pell_share_guardrail": float(matched["PCTPELL"].median(skipna=True)),
        },
        "pricing": {
            "tuition_in_state": tuition_in,
            "tuition_out_state": tuition_out,
            "net_price_target": net_price,
            "discount_rate_target": pricing_discount,
            "international_premium": max(tuition_out - tuition_in, 6000.0),
            "graduate_multiplier": 1.18,
            "transfer_multiplier": 0.91,
            "program_premiums": {
                "Business": tuition_out * 0.04,
                "Computer Science": tuition_out * 0.08,
                "Engineering": tuition_out * 0.10,
                "Health": tuition_out * 0.11,
                "Education": -tuition_out * 0.05,
                "Liberal Arts": -tuition_out * 0.02,
            },
            "local_adjustment": -(tuition_out - tuition_in) * 0.55,
            "regional_adjustment": -(tuition_out - tuition_in) * 0.25,
            "national_adjustment": 0.0,
            "international_adjustment": (tuition_out - tuition_in) * 0.42,
        },
        "academic_profile": {
            "sat_total_25": round(sat25, 0),
            "sat_total_75": round(sat75, 0),
            "act_composite_25": round(act25, 0),
            "act_composite_75": round(act75, 0),
            "cds_guardrails": cds_guardrails,
        },
        "stage_targets": {
            "inquiry_to_complete_rate": synthetic_profile["historical_inquiry_to_complete_rate"],
            "complete_to_admit_rate": admit_rate_guardrail,
            "admit_to_deposit_rate": float(admit_to_deposit_rate),
            "deposit_to_matric_rate": float(deposit_to_matric_rate),
            "admit_to_matric_yield": yield_rate_guardrail,
        },
        "program_mix_weights": build_program_mix_weights(),
        "source_mix_weights": build_source_mix_weights(base_funnel),
        "student_type_mix": build_mix_weights(base_funnel, "student_type"),
        "geography_mix": build_mix_weights(base_funnel, "market_geography"),
    }


def main() -> None:
    config = build_enrollment_benchmark_config()
    print(json.dumps(config, indent=2))


if __name__ == "__main__":
    main()
