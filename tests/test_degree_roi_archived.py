from pathlib import Path


def test_degree_roi_project_is_not_linked_from_homepage():
    homepage = Path("index.html").read_text(encoding="utf-8")

    assert "projects/degree-roi-value/" not in homepage
    assert "Degree Value and Earnings Dashboard" not in homepage
