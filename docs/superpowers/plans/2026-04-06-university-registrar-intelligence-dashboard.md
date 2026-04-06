# University Registrar Intelligence Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone current-term registrar operations dashboard for a generic public university, modeled on OSU undergraduate program and audit logic, with synthetic but rule-based data, operational charts, and actionable student queues.

**Architecture:** A Python data-preparation script will generate reproducible CSV and JSON files for one current term. A static HTML/CSS/JS dashboard will load those files client-side, apply shared filters, and render KPI cards, charts, and anonymized action queues. The homepage will expose the project with a portfolio card.

**Tech Stack:** Python, pandas, numpy, static HTML/CSS/JavaScript, Plotly, PapaParse, Playwright smoke testing

---

## File Structure

- Create: `tests/test_prepare_university_registrar_dashboard.py`
- Create: `scripts/prepare_university_registrar_dashboard.py`
- Create: `projects/university-registrar-intelligence-dashboard/index.html`
- Create: `projects/university-registrar-intelligence-dashboard/dashboard.css`
- Create: `projects/university-registrar-intelligence-dashboard/dashboard.js`
- Create: `projects/university-registrar-intelligence-dashboard/data/`
- Modify: `index.html`

### Task 1: Lock Data Contracts And Core Rules

**Files:**
- Create: `tests/test_prepare_university_registrar_dashboard.py`
- Create: `scripts/prepare_university_registrar_dashboard.py`

- [ ] **Step 1: Write the failing test**

```python
from pathlib import Path
import importlib.util
import unittest


MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "prepare_university_registrar_dashboard.py"
spec = importlib.util.spec_from_file_location("registrar_dashboard", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class RegistrarDashboardTests(unittest.TestCase):
    def test_compute_audit_status_off_track_for_major_and_gpa(self):
        record = {
            "credits_completed": 142,
            "expected_credits": 160,
            "upper_division_completed": 38,
            "required_completion_ratio": 0.74,
            "osu_gpa": 1.92,
            "residence_met_flag": 1,
            "core_met_flag": 1,
            "world_language_met_flag": 1,
            "professional_progression_met_flag": 1,
        }
        status, reason = module.compute_audit_status(record, "Business Administration", "Senior")
        self.assertEqual(status, "off_track")
        self.assertIn("GPA", reason)

    def test_generate_dashboard_exports_expected_files(self):
        paths = module.generate_dashboard(seed=20260406)
        expected = {"student_status.csv", "section_status.csv", "metadata.json"}
        self.assertTrue(expected.issubset({path.name for path in paths}))


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m unittest tests.test_prepare_university_registrar_dashboard -v`
Expected: FAIL because `scripts/prepare_university_registrar_dashboard.py` and its functions do not exist yet.

- [ ] **Step 3: Write minimal implementation scaffold**

```python
from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "projects" / "university-registrar-intelligence-dashboard" / "data"


def compute_audit_status(record: dict[str, float | int], program_name: str, class_level: str) -> tuple[str, str]:
    if float(record["osu_gpa"]) < 2.0:
        return "off_track", "GPA below threshold"
    return "on_track", "Pace and policy checks satisfied"


def generate_dashboard(seed: int = 20260406) -> list[Path]:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    paths = [
        OUTPUT_DIR / "student_status.csv",
        OUTPUT_DIR / "section_status.csv",
        OUTPUT_DIR / "metadata.json",
    ]
    for path in paths:
        path.write_text("", encoding="utf-8")
    return paths
```

- [ ] **Step 4: Run test to verify it passes minimally**

Run: `python -m unittest tests.test_prepare_university_registrar_dashboard -v`
Expected: PASS for the two scaffold tests.

- [ ] **Step 5: Commit**

```bash
git add tests/test_prepare_university_registrar_dashboard.py scripts/prepare_university_registrar_dashboard.py
git commit -m "test: scaffold registrar dashboard generator"
```

### Task 2: Build The Rule-Based Registrar Dataset

**Files:**
- Modify: `scripts/prepare_university_registrar_dashboard.py`
- Test: `tests/test_prepare_university_registrar_dashboard.py`

- [ ] **Step 1: Extend the failing tests for real outputs**

```python
    def test_generate_dashboard_outputs_expected_programs_and_statuses(self):
        module.generate_dashboard(seed=20260406)
        students = module.pd.read_csv(module.OUTPUT_DIR / "student_status.csv")
        self.assertEqual(
            sorted(students["program_name"].unique().tolist()),
            [
                "Business Administration",
                "Business Analytics",
                "Elementary Education",
                "Secondary Education",
            ],
        )
        self.assertTrue({"registered", "blocked", "not_registered"}.issubset(set(students["registration_status"])))
        self.assertTrue({"on_track", "near_risk", "off_track"}.issubset(set(students["audit_status"])))
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m unittest tests.test_prepare_university_registrar_dashboard -v`
Expected: FAIL because the generated files are empty and do not contain the required columns or values.

- [ ] **Step 3: Implement the real data generator**

```python
PROGRAMS = [
    {"program_name": "Business Administration", "school": "Business", "credits_required": 180, "gpa_floor": 2.0},
    {"program_name": "Business Analytics", "school": "Business", "credits_required": 180, "gpa_floor": 2.0},
    {"program_name": "Elementary Education", "school": "Education", "credits_required": 180, "gpa_floor": 3.0},
    {"program_name": "Secondary Education", "school": "Education", "credits_required": 180, "gpa_floor": 3.0},
]


def generate_dashboard(seed: int = 20260406) -> list[Path]:
    rng = np.random.default_rng(seed)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    students = build_student_status(rng)
    sections = build_section_status(rng, students)
    metadata = build_metadata(students, sections)

    students.to_csv(OUTPUT_DIR / "student_status.csv", index=False)
    sections.to_csv(OUTPUT_DIR / "section_status.csv", index=False)
    (OUTPUT_DIR / "metadata.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    return [OUTPUT_DIR / "student_status.csv", OUTPUT_DIR / "section_status.csv", OUTPUT_DIR / "metadata.json"]
```

- [ ] **Step 4: Re-run the tests**

Run: `python -m unittest tests.test_prepare_university_registrar_dashboard -v`
Expected: PASS with program names, registration statuses, and audit statuses present.

- [ ] **Step 5: Run the generator manually and inspect**

Run: `python scripts/prepare_university_registrar_dashboard.py`
Expected: script writes CSV/JSON files into `projects/university-registrar-intelligence-dashboard/data/` and prints row counts plus key KPIs.

- [ ] **Step 6: Commit**

```bash
git add tests/test_prepare_university_registrar_dashboard.py scripts/prepare_university_registrar_dashboard.py projects/university-registrar-intelligence-dashboard/data
git commit -m "feat: generate registrar dashboard data"
```

### Task 3: Build The Dashboard Shell And Visual System

**Files:**
- Create: `projects/university-registrar-intelligence-dashboard/index.html`
- Create: `projects/university-registrar-intelligence-dashboard/dashboard.css`

- [ ] **Step 1: Write a minimal failing browser expectation**

```text
Open the new project page in a browser after creating the empty file.
Expected initial failure: page loads without the required IDs for KPI cards, charts, and action queues.
```

- [ ] **Step 2: Create the HTML structure**

```html
<div class="page-shell">
  <header class="hero">...</header>
  <nav class="section-nav">...</nav>
  <section class="filters panel">...</section>
  <section class="kpi-grid">...</section>
  <section id="registration" class="panel">...</section>
  <section id="course-demand" class="panel">...</section>
  <section id="audit" class="panel">...</section>
  <section id="actions" class="panel">...</section>
  <details class="panel methodology">...</details>
</div>
```

- [ ] **Step 3: Create the visual system**

```css
:root {
  --bg: #f4efe8;
  --panel: rgba(255, 255, 255, 0.9);
  --navy: #17324d;
  --green: #1c6b57;
  --amber: #b56b1f;
  --brick: #a2452a;
  --text: #142033;
  --muted: #546273;
}
```

- [ ] **Step 4: Verify static assets parse**

Run: `node --check projects/university-registrar-intelligence-dashboard/dashboard.js`
Expected: this will still fail until Task 4 creates the script, but the HTML and CSS files should exist and load references correctly.

- [ ] **Step 5: Commit**

```bash
git add projects/university-registrar-intelligence-dashboard/index.html projects/university-registrar-intelligence-dashboard/dashboard.css
git commit -m "feat: add registrar dashboard shell"
```

### Task 4: Implement Dashboard Logic, Filters, Charts, And Queues

**Files:**
- Create: `projects/university-registrar-intelligence-dashboard/dashboard.js`
- Modify: `projects/university-registrar-intelligence-dashboard/index.html`

- [ ] **Step 1: Create the failing script contract**

```javascript
const state = {
  students: [],
  sections: [],
  metadata: null,
  filters: { program: "", classLevel: "", holdStatus: "", auditStatus: "" },
  focus: {},
};
```

- [ ] **Step 2: Load data and fail fast on missing files**

```javascript
async function fetchCSV(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not fetch ${path}`);
  const text = await response.text();
  return Papa.parse(text, { header: true, dynamicTyping: true, skipEmptyLines: true }).data;
}
```

- [ ] **Step 3: Implement shared filters and derived summaries**

```javascript
function syncFilters() {
  state.filters.program = document.getElementById("program-filter").value;
  state.filters.classLevel = document.getElementById("class-level-filter").value;
  state.filters.holdStatus = document.getElementById("hold-filter").value;
  state.filters.auditStatus = document.getElementById("audit-filter").value;
}
```

- [ ] **Step 4: Render KPI cards, charts, and action queues**

```javascript
function renderAll() {
  const students = getFilteredStudents();
  const sections = getFilteredSections();
  renderExecutiveSnapshot(students, sections);
  renderRegistrationCharts(students);
  renderCourseDemandCharts(sections);
  renderAuditCharts(students);
  renderActionQueues(students, sections);
}
```

- [ ] **Step 5: Verify the script parses**

Run: `node --check projects/university-registrar-intelligence-dashboard/dashboard.js`
Expected: PASS.

- [ ] **Step 6: Run a browser smoke test**

Run:

```bash
playwright-cli open http://127.0.0.1:8000/projects/university-registrar-intelligence-dashboard/
```

Expected: the page loads, charts render, filters update the counts, and queue tables populate.

- [ ] **Step 7: Commit**

```bash
git add projects/university-registrar-intelligence-dashboard/index.html projects/university-registrar-intelligence-dashboard/dashboard.js
git commit -m "feat: implement registrar dashboard interactions"
```

### Task 5: Add Portfolio Entry And Final Verification

**Files:**
- Modify: `index.html`
- Verify: `tests/test_prepare_university_registrar_dashboard.py`
- Verify: `scripts/prepare_university_registrar_dashboard.py`
- Verify: `projects/university-registrar-intelligence-dashboard/dashboard.js`

- [ ] **Step 1: Add the homepage project card**

```html
<a class="project-card" href="projects/university-registrar-intelligence-dashboard/" target="_blank" rel="noopener">
  <h3>University Registrar Intelligence Dashboard</h3>
  <p>A current-term registrar operations dashboard for registration blockers, seat pressure, degree-audit risk, and graduation follow-up.</p>
  <div class="project-tech">
    <span class="tech-tag">Registrar Ops</span>
    <span class="tech-tag">Degree Audit</span>
    <span class="tech-tag">Course Demand</span>
    <span class="tech-tag">Dashboard</span>
  </div>
</a>
```

- [ ] **Step 2: Run Python tests**

Run: `python -m unittest tests.test_prepare_university_registrar_dashboard -v`
Expected: PASS.

- [ ] **Step 3: Run Python syntax and data generation checks**

Run:

```bash
python -m py_compile scripts/prepare_university_registrar_dashboard.py
python scripts/prepare_university_registrar_dashboard.py
```

Expected: both commands succeed, and the generator prints current-term KPI counts.

- [ ] **Step 4: Run JavaScript syntax verification**

Run: `node --check projects/university-registrar-intelligence-dashboard/dashboard.js`
Expected: PASS.

- [ ] **Step 5: Run final browser smoke test**

Run:

```bash
playwright-cli open http://127.0.0.1:8000/projects/university-registrar-intelligence-dashboard/
```

Expected: no console errors, charts render, and the action queues show anonymized student rows.

- [ ] **Step 6: Commit**

```bash
git add index.html projects/university-registrar-intelligence-dashboard tests/test_prepare_university_registrar_dashboard.py scripts/prepare_university_registrar_dashboard.py
git commit -m "feat: add registrar intelligence dashboard"
```
