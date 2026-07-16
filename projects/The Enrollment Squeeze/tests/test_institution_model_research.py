import importlib.util
from pathlib import Path


SCRIPT = Path(__file__).parents[1] / "scripts" / "institution_model_research.py"
spec = importlib.util.spec_from_file_location("institution_model_research", SCRIPT)
model = importlib.util.module_from_spec(spec)
spec.loader.exec_module(model)


def test_model_years_exclude_unusable_2025_26():
    years = model.usable_years(["2005_06", "2024_25", "2025_26"], {"2005_06": 100, "2024_25": 100, "2025_26": 0})
    assert years == ["2005_06", "2024_25"]


def test_program_concentration_is_hhi():
    assert abs(model.program_hhi([0.5, 0.25, 0.25]) - 0.375) < 1e-12
    assert model.program_hhi([None, None]) is None


def test_international_stock_flow_keeps_missing_cohorts_after_recovery():
    baseline = [100.0] * 6
    shocks = {2026: -0.25, 2027: -0.25, 2028: -0.10, 2029: 0.0}
    actual = model.international_stock_path(baseline, continuation=0.8, shocks=shocks)
    assert actual[0] == 100.0
    assert actual[1] < 100.0
    assert actual[4] < 100.0
    assert actual[5] < 100.0


def test_evaluation_reports_requested_metrics():
    actual = [100.0, 90.0, 110.0]
    predicted = [100.0, 100.0, 100.0]
    report = model.regression_metrics(actual, predicted)
    assert report["mae_students"] == 6.6666666667
    assert "directional_accuracy" in report
