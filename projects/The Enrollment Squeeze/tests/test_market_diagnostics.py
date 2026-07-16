import pytest

from scripts.build_market_diagnostics import (
    choose_peer_values,
    classify_state,
    endpoint_change,
    percentile_rank,
    participation_requirement,
)


def test_participation_requirement_offsets_decline():
    result = participation_requirement(1000, 800, 0.628, 2 / 3)

    assert round(result["requiredRate"], 3) == 0.785
    assert round(result["increasePoints"], 1) == 15.7
    assert result["feasible"] is True


def test_growth_requires_no_participation_increase():
    result = participation_requirement(1000, 1100, 0.628, 2 / 3)

    assert result["increasePoints"] == 0


def test_participation_requirement_flags_rates_above_100_percent():
    result = participation_requirement(1000, 500, 0.628, 2 / 3)

    assert result["requiredRate"] > 1
    assert result["feasible"] is False


def test_state_archetypes_are_descriptive():
    assert classify_state(0.01, 0, 0, 1000) == "Expanding pool"
    assert classify_state(-0.04, 4.0, 800, 1000) == "Participation opportunity"
    assert classify_state(-0.08, 8.0, 1200, 1000) == "Large but contracting"
    assert classify_state(-0.15, 12.0, 500, 1000) == "Concentrated pressure"
    assert classify_state(-0.15, 12.0, 1500, 1000) == "Severe structural pressure"


def test_endpoint_change_uses_2015_16_and_2024_25():
    assert endpoint_change(1000, 820) == pytest.approx(-0.18)
    assert endpoint_change(None, 820) is None


def test_percentile_ignores_missing_values_and_splits_ties():
    assert percentile_rank(20, [None, 10, 20, 30]) == 50.0
    assert percentile_rank(None, [10, 20, 30]) is None


def test_peer_selection_prefers_control_size_and_admissions_band():
    rows = [
        {
            "change": index / 100,
            "control": "Public",
            "sizeBand": "Under 5,000",
            "admissionBand": "Below 50%",
        }
        for index in range(12)
    ]

    values, label = choose_peer_values(rows[0], rows, minimum=10)

    assert len(values) == 12
    assert label == "control, size, and admissions band"


def test_peer_selection_falls_back_to_control_and_size():
    target = {
        "change": -0.10,
        "control": "Public",
        "sizeBand": "5,000–19,999",
        "admissionBand": "Below 50%",
    }
    rows = [target]
    rows.extend(
        {
            "change": index / 100,
            "control": "Public",
            "sizeBand": "5,000–19,999",
            "admissionBand": "75% or higher",
        }
        for index in range(11)
    )

    values, label = choose_peer_values(target, rows, minimum=10)

    assert len(values) == 12
    assert label == "control and size"
