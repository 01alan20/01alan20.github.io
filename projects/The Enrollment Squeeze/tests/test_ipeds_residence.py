import pytest

from scripts.build_ipeds_residence import aggregate_residence_rows, classify_residence


def test_classify_residence_uses_dictionary_labels():
    assert classify_residence("1", "Alabama") == "AL"
    assert classify_residence("90", "Foreign countries") == "FOREIGN"
    assert classify_residence("57", "State unknown") == "UNKNOWN"
    assert classify_residence("72", "Puerto Rico") == "OUTLYING"
    assert classify_residence("99", "All first-time degree/certificate-seeking undergraduates total") is None
    with pytest.raises(ValueError, match="Unexpected EF2024C label"):
        classify_residence("90", "Alabama")


def test_aggregate_residence_excludes_foreign_and_unknown_from_domestic_denominator():
    rows = [
        {"unitid": "1", "residence": "AL", "count": 60},
        {"unitid": "1", "residence": "GA", "count": 20},
        {"unitid": "1", "residence": "FOREIGN", "count": 5},
        {"unitid": "1", "residence": "UNKNOWN", "count": 3},
    ]

    record = aggregate_residence_rows(rows, {"1": "AL"})[0]

    assert record["firstTimeHomeStateCount"] == 60
    assert record["firstTimeOtherStateCount"] == 20
    assert record["firstTimeForeignCountryCount"] == 5
    assert record["firstTimeUnknownResidenceCount"] == 3
    assert record["firstTimeKnownDomesticCount"] == 80
    assert record["firstTimeHomeStateShare"] == pytest.approx(0.75)
    assert record["firstTimeOtherStateShare"] == pytest.approx(0.25)


def test_aggregate_residence_returns_null_shares_without_known_domestic_students():
    rows = [
        {"unitid": "2", "residence": "FOREIGN", "count": 4},
        {"unitid": "2", "residence": "UNKNOWN", "count": 2},
    ]

    record = aggregate_residence_rows(rows, {"2": "NY"})[0]

    assert record["firstTimeKnownDomesticCount"] == 0
    assert record["firstTimeHomeStateShare"] is None
    assert record["firstTimeOtherStateShare"] is None


def test_aggregate_residence_rejects_negative_counts():
    with pytest.raises(ValueError, match="nonnegative"):
        aggregate_residence_rows(
            [{"unitid": "3", "residence": "TX", "count": -1}],
            {"3": "TX"},
        )
