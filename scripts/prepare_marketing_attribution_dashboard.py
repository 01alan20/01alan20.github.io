from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "projects" / "marketing-attribution-dashboard" / "data"
RNG = np.random.default_rng(20260331)
DATE_START = pd.Timestamp("2020-11-01")
DATE_END = pd.Timestamp("2021-01-31")
N_PROSPECTS = 2400

SEGMENT_WEIGHTS = {
    "Research-Heavy Browsers": 0.38,
    "Brand Returners": 0.24,
    "Promo Responders": 0.22,
    "Cross-Border Shoppers": 0.16,
}

MARKET_WEIGHTS = {
    "Research-Heavy Browsers": {"Core Market": 0.33, "Regional Market": 0.47, "National Market": 0.20},
    "Brand Returners": {"Core Market": 0.17, "Regional Market": 0.31, "National Market": 0.52},
    "Promo Responders": {"Core Market": 0.10, "Regional Market": 0.24, "National Market": 0.66},
    "Cross-Border Shoppers": {"International Market": 0.88, "National Market": 0.12},
}

DEVICE_WEIGHTS = {
    "Research-Heavy Browsers": {"Mobile": 0.56, "Desktop": 0.34, "Tablet": 0.10},
    "Brand Returners": {"Desktop": 0.51, "Mobile": 0.39, "Tablet": 0.10},
    "Promo Responders": {"Desktop": 0.58, "Mobile": 0.34, "Tablet": 0.08},
    "Cross-Border Shoppers": {"Mobile": 0.47, "Desktop": 0.42, "Tablet": 0.11},
}

FIRST_TOUCH_WEIGHTS = {
    "Research-Heavy Browsers": {
        "Paid Social": 0.28,
        "Paid Search": 0.18,
        "Organic Search": 0.14,
        "Direct": 0.13,
        "Referral": 0.09,
        "Email": 0.18,
    },
    "Brand Returners": {
        "Paid Search": 0.26,
        "Organic Search": 0.22,
        "Direct": 0.17,
        "Email": 0.16,
        "Referral": 0.11,
        "Paid Social": 0.08,
    },
    "Promo Responders": {
        "Paid Search": 0.24,
        "Organic Search": 0.18,
        "Email": 0.20,
        "Direct": 0.16,
        "Referral": 0.10,
        "Paid Social": 0.12,
    },
    "Cross-Border Shoppers": {
        "Organic Search": 0.25,
        "Paid Search": 0.22,
        "Referral": 0.14,
        "Paid Social": 0.13,
        "Direct": 0.12,
        "Email": 0.14,
    },
}

NEXT_TOUCH_WEIGHTS = {
    "Organic Search": {"Direct": 0.30, "Email": 0.22, "Organic Search": 0.17, "Paid Search": 0.12, "Referral": 0.11, "Paid Social": 0.08},
    "Paid Search": {"Direct": 0.26, "Email": 0.19, "Paid Search": 0.16, "Organic Search": 0.17, "Referral": 0.08, "Paid Social": 0.14},
    "Paid Social": {"Direct": 0.22, "Email": 0.18, "Paid Search": 0.17, "Organic Search": 0.12, "Referral": 0.09, "Paid Social": 0.22},
    "Email": {"Direct": 0.38, "Email": 0.17, "Organic Search": 0.14, "Paid Search": 0.11, "Referral": 0.10, "Paid Social": 0.10},
    "Referral": {"Direct": 0.28, "Email": 0.18, "Organic Search": 0.21, "Paid Search": 0.12, "Referral": 0.13, "Paid Social": 0.08},
    "Direct": {"Direct": 0.32, "Email": 0.23, "Organic Search": 0.14, "Paid Search": 0.12, "Referral": 0.10, "Paid Social": 0.09},
}

CHANNEL_PROFILE = {
    "Organic Search": {
        "engage_lift": 0.17,
        "lead_lift": 0.08,
        "close_lift": 0.15,
        "quality_points": 17,
        "duration": 268,
        "pageviews": 5.4,
    },
    "Paid Search": {
        "engage_lift": 0.09,
        "lead_lift": 0.16,
        "close_lift": 0.05,
        "quality_points": 11,
        "duration": 226,
        "pageviews": 4.8,
    },
    "Paid Social": {
        "engage_lift": 0.02,
        "lead_lift": 0.18,
        "close_lift": -0.02,
        "quality_points": 8,
        "duration": 184,
        "pageviews": 4.1,
    },
    "Email": {
        "engage_lift": 0.15,
        "lead_lift": 0.10,
        "close_lift": 0.14,
        "quality_points": 16,
        "duration": 254,
        "pageviews": 5.1,
    },
    "Referral": {
        "engage_lift": 0.14,
        "lead_lift": 0.09,
        "close_lift": 0.13,
        "quality_points": 15,
        "duration": 247,
        "pageviews": 5.0,
    },
    "Direct": {
        "engage_lift": 0.12,
        "lead_lift": 0.06,
        "close_lift": 0.11,
        "quality_points": 14,
        "duration": 238,
        "pageviews": 4.7,
    },
}

SEGMENT_PROFILE = {
    "Research-Heavy Browsers": {"lead_lift": 0.04, "close_lift": -0.01, "depth_bias": 0.10},
    "Brand Returners": {"lead_lift": 0.03, "close_lift": 0.05, "depth_bias": 0.02},
    "Promo Responders": {"lead_lift": 0.02, "close_lift": 0.06, "depth_bias": 0.04},
    "Cross-Border Shoppers": {"lead_lift": 0.01, "close_lift": 0.03, "depth_bias": 0.12},
}

DEVICE_PROFILE = {
    "Desktop": {"engage_lift": 0.07, "close_lift": 0.04, "quality_points": 5},
    "Mobile": {"engage_lift": -0.03, "close_lift": -0.02, "quality_points": -4},
    "Tablet": {"engage_lift": 0.01, "close_lift": 0.00, "quality_points": 0},
}

MARKET_PROFILE = {
    "Core Market": {"lead_lift": 0.03, "close_lift": 0.04},
    "Regional Market": {"lead_lift": 0.02, "close_lift": 0.02},
    "National Market": {"lead_lift": 0.00, "close_lift": 0.00},
    "International Market": {"lead_lift": -0.01, "close_lift": -0.03},
}


def clip_prob(value: float, low: float = 0.01, high: float = 0.95) -> float:
    return float(np.clip(value, low, high))


def choose_from_weights(weight_map: dict[str, float]) -> str:
    keys = list(weight_map.keys())
    weights = np.array(list(weight_map.values()), dtype=float)
    weights = weights / weights.sum()
    return str(RNG.choice(keys, p=weights))


def choose_session_count(segment: str, first_channel: str) -> int:
    profile = {
        "Organic Search": np.array([0.18, 0.29, 0.25, 0.18, 0.10]),
        "Paid Search": np.array([0.24, 0.27, 0.24, 0.17, 0.08]),
        "Paid Social": np.array([0.31, 0.28, 0.21, 0.14, 0.06]),
        "Email": np.array([0.22, 0.29, 0.25, 0.16, 0.08]),
        "Referral": np.array([0.20, 0.28, 0.24, 0.18, 0.10]),
        "Direct": np.array([0.27, 0.29, 0.21, 0.15, 0.08]),
    }[first_channel].copy()

    depth_bias = SEGMENT_PROFILE[segment]["depth_bias"]
    profile[0] = max(profile[0] - depth_bias * 0.20, 0.05)
    profile[1] = max(profile[1] - depth_bias * 0.10, 0.10)
    profile[3] = profile[3] + depth_bias * 0.18
    profile[4] = profile[4] + depth_bias * 0.12
    profile = profile / profile.sum()
    return int(RNG.choice([1, 2, 3, 4, 5], p=profile))


def choose_next_channel(previous_channel: str, lead_seen: bool) -> str:
    weights = NEXT_TOUCH_WEIGHTS[previous_channel].copy()
    if lead_seen:
        weights["Email"] = weights.get("Email", 0) + 0.08
        weights["Direct"] = weights.get("Direct", 0) + 0.05
        weights["Paid Social"] = max(weights.get("Paid Social", 0) - 0.04, 0.02)
    return choose_from_weights(weights)


def format_date(series: pd.Series) -> pd.Series:
    return pd.to_datetime(series, errors="coerce").dt.strftime("%Y-%m-%d")


def build_datasets() -> tuple[pd.DataFrame, pd.DataFrame]:
    session_rows: list[dict[str, object]] = []
    journey_rows: list[dict[str, object]] = []

    for prospect_number in range(1, N_PROSPECTS + 1):
        prospect_id = f"MKG-{prospect_number:05d}"
        segment = choose_from_weights(SEGMENT_WEIGHTS)
        market = choose_from_weights(MARKET_WEIGHTS[segment])
        primary_device = choose_from_weights(DEVICE_WEIGHTS[segment])
        first_channel = choose_from_weights(FIRST_TOUCH_WEIGHTS[segment])
        session_count = choose_session_count(segment, first_channel)

        max_offset = max((DATE_END - DATE_START).days - 24, 1)
        first_date = DATE_START + pd.Timedelta(days=int(RNG.integers(0, max_offset)))

        channels: list[str] = []
        session_dates: list[pd.Timestamp] = []
        engaged_flags: list[int] = []
        lead_event_flags: list[int] = []
        quality_scores: list[int] = []
        session_duration_seconds: list[int] = []
        pageviews: list[int] = []
        touch_roles: list[str] = []

        current_channel = first_channel
        current_date = first_date
        lead_session_order: int | None = None

        for session_order in range(1, session_count + 1):
            profile = CHANNEL_PROFILE[current_channel]
            device_profile = DEVICE_PROFILE[primary_device]
            market_profile = MARKET_PROFILE[market]
            order_lift = (session_order - 1) * 0.04
            repeat_lift = 0.05 if session_order > 1 else 0.0

            engage_prob = clip_prob(
                0.42
                + profile["engage_lift"]
                + device_profile["engage_lift"]
                + order_lift
                + repeat_lift
                + market_profile["lead_lift"] * 0.3,
                0.20,
                0.94,
            )
            engaged_flag = int(RNG.random() < engage_prob)

            lead_prob = clip_prob(
                0.06
                + profile["lead_lift"]
                + SEGMENT_PROFILE[segment]["lead_lift"]
                + market_profile["lead_lift"]
                + (0.07 if engaged_flag else -0.02)
                + order_lift
                + (0.03 if current_channel == "Organic Search" and session_order >= 2 else 0.0),
                0.02,
                0.88,
            )
            lead_event_flag = 0
            if lead_session_order is None and RNG.random() < lead_prob:
                lead_session_order = session_order
                lead_event_flag = 1

            quality = int(
                np.clip(
                    48
                    + profile["quality_points"]
                    + device_profile["quality_points"]
                    + session_order * 4
                    + engaged_flag * 8
                    + (7 if current_channel == "Organic Search" and session_order >= 2 else 0)
                    + (5 if current_channel == "Email" and lead_session_order is not None else 0)
                    + RNG.normal(0, 6),
                    22,
                    98,
                )
            )

            duration = int(
                np.clip(
                    profile["duration"]
                    + engaged_flag * 44
                    + session_order * 9
                    + RNG.normal(0, 32),
                    40,
                    620,
                )
            )
            views = int(
                np.clip(
                    profile["pageviews"]
                    + engaged_flag * 1.1
                    + session_order * 0.35
                    + RNG.normal(0, 0.9),
                    1.0,
                    14.0,
                )
            )

            touch_roles.append("Assist")
            channels.append(current_channel)
            session_dates.append(current_date)
            engaged_flags.append(engaged_flag)
            lead_event_flags.append(lead_event_flag)
            quality_scores.append(quality)
            session_duration_seconds.append(duration)
            pageviews.append(views)

            if session_order < session_count:
                gap_days = int(RNG.integers(1, 10 if lead_session_order is None else 8))
                current_date = min(current_date + pd.Timedelta(days=gap_days), DATE_END)
                current_channel = choose_next_channel(current_channel, lead_session_order is not None)

        lead_flag = int(lead_session_order is not None)
        first_touch = channels[0]
        last_touch = channels[-1]
        unique_channels = len(set(channels))
        engaged_sessions = int(sum(engaged_flags))

        close_prob = 0.0
        if lead_flag:
            channel_close_effect = sum(CHANNEL_PROFILE[channel]["close_lift"] for channel in channels)
            close_prob = clip_prob(
                0.09
                + SEGMENT_PROFILE[segment]["close_lift"]
                + MARKET_PROFILE[market]["close_lift"]
                + DEVICE_PROFILE[primary_device]["close_lift"]
                + channel_close_effect
                + engaged_sessions * 0.04
                + unique_channels * 0.02
                + (0.08 if "Organic Search" in channels else 0.0)
                + (0.06 if "Referral" in channels else 0.0)
                + (0.10 if last_touch == "Email" else 0.0)
                + (0.08 if last_touch == "Direct" and session_count > 1 else 0.0)
                + (0.05 if last_touch == "Organic Search" else 0.0)
                - (0.05 if first_touch == "Paid Social" and session_count == 1 else 0.0)
                - (0.03 if first_touch == "Paid Search" and session_count == 1 else 0.0),
                0.03,
                0.82,
            )

        enrollment_flag = int(lead_flag == 1 and RNG.random() < close_prob)
        enrollment_session_order = session_count if enrollment_flag else None
        lead_touch = channels[lead_session_order - 1] if lead_session_order else ""
        path = " > ".join(channels)
        revenue = 0.0
        if enrollment_flag:
            revenue = float(
                np.clip(
                    92
                    + {"Organic Search": 12, "Paid Search": 4, "Paid Social": -3, "Email": 10, "Direct": 8, "Referral": 9}[last_touch]
                    + {"Desktop": 10, "Mobile": -4, "Tablet": 2}[primary_device]
                    + session_count * 6
                    + engaged_sessions * 5
                    + RNG.normal(0, 14),
                    35,
                    260,
                )
            )

        if session_count == 1:
            touch_pattern = "Single-touch"
        elif session_count == 2:
            touch_pattern = "Two-touch"
        elif session_count == 3:
            touch_pattern = "Three-touch"
        else:
            touch_pattern = "Four-plus"

        days_to_lead = (
            int((session_dates[lead_session_order - 1] - session_dates[0]).days)
            if lead_session_order
            else None
        )
        days_to_enrollment = (
            int((session_dates[-1] - session_dates[0]).days)
            if enrollment_flag
            else None
        )

        if session_count == 1:
            touch_roles[0] = "Single-touch"
        else:
            touch_roles[0] = "First touch"
            touch_roles[-1] = "Closer" if enrollment_flag else "Last session"

        linear_credit = np.zeros(session_count)
        if enrollment_flag:
            linear_credit[:] = 1 / session_count

        for idx, session_order in enumerate(range(1, session_count + 1)):
            session_rows.append(
                {
                    "session_id": f"{prospect_id}-S{session_order}",
                    "prospect_id": prospect_id,
                    "session_date": session_dates[idx],
                    "week_start": session_dates[idx] - pd.Timedelta(days=int(session_dates[idx].weekday())),
                    "audience_segment": segment,
                    "market": market,
                    "primary_device": primary_device,
                    "session_order": session_order,
                    "sessions_in_journey": session_count,
                    "touch_pattern": touch_pattern,
                    "channel_group": channels[idx],
                    "journey_path": path,
                    "visitor_status": "New" if session_order == 1 else "Returning",
                    "engaged_session_flag": engaged_flags[idx],
                    "lead_event_flag": lead_event_flags[idx],
                    "lead_flag": lead_flag,
                    "enrollment_equivalent_flag": int(enrollment_flag == 1 and session_order == enrollment_session_order),
                    "session_quality_score": quality_scores[idx],
                    "session_duration_seconds": session_duration_seconds[idx],
                    "pageviews": pageviews[idx],
                    "touch_role": touch_roles[idx],
                    "first_touch_credit": float(enrollment_flag == 1 and session_order == 1),
                    "last_touch_credit": float(enrollment_flag == 1 and session_order == session_count),
                    "linear_credit": float(linear_credit[idx]),
                    "transaction_revenue": round(revenue if enrollment_flag == 1 and session_order == enrollment_session_order else 0.0, 2),
                }
            )

        journey_rows.append(
            {
                "prospect_id": prospect_id,
                "audience_segment": segment,
                "market": market,
                "primary_device": primary_device,
                "sessions_in_journey": session_count,
                "touch_pattern": touch_pattern,
                "engaged_sessions": engaged_sessions,
                "unique_channels": unique_channels,
                "first_touch_channel": first_touch,
                "lead_touch_channel": lead_touch,
                "last_touch_channel": last_touch,
                "lead_flag": lead_flag,
                "enrollment_equivalent_flag": enrollment_flag,
                "days_to_lead": days_to_lead,
                "days_to_enrollment": days_to_enrollment,
                "transaction_revenue": round(revenue, 2),
                "journey_path": path,
            }
        )

    sessions = pd.DataFrame(session_rows)
    journeys = pd.DataFrame(journey_rows)
    return sessions, journeys


def write_outputs(sessions: pd.DataFrame, journeys: pd.DataFrame) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    export_sessions = sessions.copy()
    export_journeys = journeys.copy()
    export_sessions["session_date"] = format_date(export_sessions["session_date"])
    export_sessions["week_start"] = format_date(export_sessions["week_start"])

    export_sessions.to_csv(OUTPUT_DIR / "session_events.csv", index=False)
    export_journeys.to_csv(OUTPUT_DIR / "journey_summary.csv", index=False)

    metadata = {
        "project_name": "Marketing Attribution Dashboard",
        "official_source_basis": [
            "Google Analytics developer documentation: BigQuery sample dataset for Google Analytics ecommerce web implementation",
            "Google blog: Introducing the Google Analytics Sample Dataset for BigQuery",
        ],
        "source_dataset_reference": "bigquery-public-data.ga4_obfuscated_sample_ecommerce.events_*",
        "source_window": "2020-11-01 to 2021-01-31",
        "local_modeled_layer": [
            "cart-intent event assignment",
            "multi-touch attribution credits",
            "generic cohort labels for filtering",
        ],
        "caveat": "The in-repo CSVs are a reproducible modeled extract aligned to the public Google Merchandise Store sample dataset concepts rather than a live BigQuery export.",
    }
    (OUTPUT_DIR / "metadata.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")


def print_summary(sessions: pd.DataFrame, journeys: pd.DataFrame) -> None:
    channel_summary = (
        sessions.groupby("channel_group", as_index=False)
        .agg(
            sessions=("session_id", "count"),
            leads=("lead_event_flag", "sum"),
            enrollments=("enrollment_equivalent_flag", "sum"),
            linear_attribution=("linear_credit", "sum"),
        )
    )
    channel_summary["lead_rate"] = channel_summary["leads"] / channel_summary["sessions"]
    channel_summary["enrollment_rate"] = channel_summary["enrollments"] / channel_summary["sessions"]
    channel_summary = channel_summary.sort_values("sessions", ascending=False)
    display_summary = channel_summary.rename(
        columns={
            "leads": "cart_intents",
            "enrollments": "transactions",
        }
    )

    converted = journeys["enrollment_equivalent_flag"].sum()
    multi_touch_converted = journeys.loc[
        (journeys["enrollment_equivalent_flag"] == 1) & (journeys["sessions_in_journey"] > 1)
    ].shape[0]

    print("Marketing attribution dashboard data prepared")
    print(f"Prospects: {len(journeys):,}")
    print(f"Sessions: {len(sessions):,}")
    print(f"Cart-intent journeys: {int(journeys['lead_flag'].sum()):,}")
    print(f"Transactions: {int(converted):,}")
    print(f"Multi-touch share of transactions: {multi_touch_converted / max(converted, 1):.1%}")
    print("")
    print(display_summary[["channel_group", "sessions", "cart_intents", "transactions", "linear_attribution"]].to_string(index=False))


def main() -> None:
    sessions, journeys = build_datasets()
    write_outputs(sessions, journeys)
    print_summary(sessions, journeys)


if __name__ == "__main__":
    main()
