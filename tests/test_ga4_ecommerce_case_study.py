import json
import importlib.util
from datetime import date
from pathlib import Path


PROJECT_DIR = Path("projects/ecommerce-growth-diagnostics-lab")
SUMMARY_JSON = PROJECT_DIR / "data" / "live_ga4_summary.json"
SUMMARY_JS = PROJECT_DIR / "data" / "live_ga4_summary.js"
EXPORT_SCRIPT = PROJECT_DIR / "scripts" / "build_live_ga4_outputs.py"


def load_export_script():
    spec = importlib.util.spec_from_file_location("build_live_ga4_outputs", EXPORT_SCRIPT)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def test_homepage_positions_ga4_project_as_case_study_with_notebook():
    homepage = Path("index.html").read_text(encoding="utf-8")

    assert 'href="projects/ecommerce-growth-diagnostics-lab/"' in homepage
    assert "GA4 BigQuery Ecommerce Case Study" in homepage
    assert "Notebook" in homepage


def test_live_export_serializer_handles_bigquery_dates():
    exporter = load_export_script()

    assert exporter.clean_value(date(2020, 11, 1)) == "2020-11-01"


def test_ga4_project_page_links_notebook_and_dataset_source():
    project_page = (PROJECT_DIR / "index.html").read_text(encoding="utf-8")

    assert 'href="ga4-bigquery-ecommerce-case-study.ipynb"' in project_page
    assert "The growth story" in project_page
    assert "What the team should do next" in project_page
    assert "What I would test first" in project_page
    assert "Experiment backlog" in project_page
    assert 'src="data/live_ga4_summary.js"' in project_page
    assert "bigquery-public-data.ga4_obfuscated_sample_ecommerce.events_*" in project_page
    assert "developers.google.com/analytics/bigquery/web-ecommerce-demo-dataset" in project_page


def test_ga4_project_page_prioritizes_public_story_over_analysis_labels():
    project_page = (PROJECT_DIR / "index.html").read_text(encoding="utf-8")
    dashboard_js = (PROJECT_DIR / "dashboard.js").read_text(encoding="utf-8")
    dashboard_css = (PROJECT_DIR / "dashboard.css").read_text(encoding="utf-8")

    story_steps = [
        "Raw GA4 events",
        "Session/item marts",
        "Funnel and revenue metrics",
        "Segment associations",
        "Business actions",
        "Experiment backlog",
    ]

    for step in story_steps:
        assert step in project_page

    assert 'class="eyebrow"' not in project_page
    assert ".eyebrow" not in dashboard_css
    assert ".finding-card span" not in dashboard_css
    assert ".strategy-row span" not in dashboard_css
    assert "Feature association analysis" not in project_page
    assert "Step-specific funnel driver analysis" not in project_page
    assert "item_category_seen" not in dashboard_js


def test_ga4_notebook_documents_business_questions_and_bigquery_patterns():
    notebook = json.loads((PROJECT_DIR / "ga4-bigquery-ecommerce-case-study.ipynb").read_text(encoding="utf-8"))
    notebook_text = "\n".join(
        "".join(cell.get("source", []))
        for cell in notebook["cells"]
    )

    required_sections = [
        "Business Question 1",
        "Business Question 2",
        "Business Question 3",
        "Business Question 4",
        "Business Question 5",
        "UNNEST(event_params)",
        "UNNEST(items)",
        "_TABLE_SUFFIX",
        "SAFE_DIVIDE",
        "big-query-project-505612",
        "Live BigQuery results",
        "data/live_ga4_summary.json",
        "Feature association analysis",
        "Step-specific funnel driver analysis",
        "Experiment backlog",
    ]

    for section in required_sections:
        assert section in notebook_text


def test_live_ga4_summary_exports_real_bigquery_results():
    summary = json.loads(SUMMARY_JSON.read_text(encoding="utf-8"))

    assert summary["source"]["type"] == "live_bigquery"
    assert summary["source"]["project_id"] == "big-query-project-505612"
    assert summary["source"]["table_pattern"] == "bigquery-public-data.ga4_obfuscated_sample_ecommerce.events_*"
    assert summary["date_range"] == {"start": "2020-11-01", "end": "2021-01-31"}
    assert summary["kpis"]["row_count"] == 4295584
    assert summary["kpis"]["sessions"] > 0
    assert summary["kpis"]["purchases"] > 0
    assert summary["kpis"]["revenue"] > 0
    assert len(summary["funnel"]) == 5
    assert [step["step"] for step in summary["funnel"]] == [
        "Session start",
        "View item",
        "Add to cart",
        "Begin checkout",
        "Purchase",
    ]
    assert len(summary["findings"]) >= 5
    assert all(finding["business_implication"] for finding in summary["findings"])


def test_live_ga4_summary_includes_optimization_analysis():
    summary = json.loads(SUMMARY_JSON.read_text(encoding="utf-8"))
    analysis = summary["optimization_analysis"]

    expected_sections = {
        "feature_associations",
        "step_drivers",
        "product_opportunity_matrix",
        "channel_quality_scorecard",
        "experiment_backlog",
    }
    assert expected_sections <= set(analysis)

    feature_associations = analysis["feature_associations"]
    assert len(feature_associations) >= 12
    assert all("lift_vs_baseline" in row for row in feature_associations)
    assert all("business_use" in row for row in feature_associations)

    step_drivers = analysis["step_drivers"]
    assert {"view_to_cart", "cart_to_checkout", "checkout_to_purchase"} <= set(step_drivers)
    assert all(step_drivers[key] for key in ["view_to_cart", "cart_to_checkout", "checkout_to_purchase"])

    product_matrix = analysis["product_opportunity_matrix"]
    assert len(product_matrix) >= 4
    assert all(row["quadrant"] for row in product_matrix)
    assert any(row["recommended_action"] for row in product_matrix)

    channel_scorecard = analysis["channel_quality_scorecard"]
    assert len(channel_scorecard) >= 4
    assert all("quality_score" in row for row in channel_scorecard)
    assert all("strategic_read" in row for row in channel_scorecard)

    experiments = analysis["experiment_backlog"]
    assert len(experiments) >= 5
    assert all({"hypothesis", "segment", "primary_metric", "measurement_plan"} <= set(row) for row in experiments)


def test_live_ga4_summary_js_exposes_browser_global():
    summary_js = SUMMARY_JS.read_text(encoding="utf-8")
    dashboard_js = (PROJECT_DIR / "dashboard.js").read_text(encoding="utf-8")

    assert "window.ga4LiveSummary" in summary_js
    assert "live_bigquery" in summary_js
    assert "window.ga4LiveSummary" in dashboard_js
    assert "modeled preview" not in dashboard_js.lower()
