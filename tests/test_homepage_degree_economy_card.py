from pathlib import Path


def test_homepage_links_to_the_degree_economy_story_v5():
    homepage = Path("index.html").read_text(encoding="utf-8")

    assert 'href="projects/the-degree-economy/Degree_Story/"' in homepage
    assert "Are Degrees Keeping Up?" in homepage
    assert "Interactive analysis of whether degree production" in homepage
