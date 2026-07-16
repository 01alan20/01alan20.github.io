# Undergraduate Career Outcomes Collection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collect the latest qualifying undergraduate career outcomes percentage for the 1,849 public-explorer institutions and plot it against observed undergraduate enrollment change from 2015–16 through 2024–25.

**Architecture:** A Python collector will match institutions to official Scorecard URLs, discover official outcome pages, extract auditable percentage candidates, and write a two-column plotting CSV plus detailed audit and runtime JSON files. The static website will load the qualified JSON records and join them to the existing institution diagnostics by UNITID, preserving `change` as the observed enrollment metric used by the institution map.

**Tech Stack:** Python 3.12, requests, BeautifulSoup, pypdf, pytest, static HTML, JavaScript, Plotly, Node.js test runner, Selenium rendered-page QA

---

### Task 1: Build and test the career-outcome extractor

**Files:**
- Create: `projects/The Enrollment Squeeze/scripts/collect_undergraduate_career_outcomes.py`
- Create: `projects/The Enrollment Squeeze/tests/test_career_outcomes_collection.py`
- Create: `projects/The Enrollment Squeeze/requirements-research.txt`

- [ ] **Step 1: Write failing extraction tests**

Add tests for explicit career outcomes, equivalent combined outcomes, excluded graduate/program results, and newest-year selection:

```python
from scripts.collect_undergraduate_career_outcomes import extract_candidates, select_best_candidate


def test_extracts_explicit_undergraduate_career_outcomes_rate():
    text = "Class of 2024 bachelor’s graduates had a 93% career outcomes rate within six months."
    result = select_best_candidate(extract_candidates(text, "https://example.edu/outcomes"))
    assert result.rate == 93.0
    assert result.year == 2024
    assert result.confidence == "high"


def test_accepts_equivalent_combined_undergraduate_outcome():
    text = "For the Class of 2023, 88% of undergraduates were employed or continuing their education."
    result = select_best_candidate(extract_candidates(text, "https://example.edu/first-destination"))
    assert result.rate == 88.0
    assert result.confidence == "medium"


def test_rejects_graduate_and_program_only_results():
    text = "The MBA program reported 97% employment. The School of Nursing reported 99% placement."
    assert select_best_candidate(extract_candidates(text, "https://example.edu/outcomes")) is None


def test_selects_latest_qualifying_class():
    text = "Class of 2022 career outcomes rate: 90%. Class of 2024 career outcomes rate: 94%."
    result = select_best_candidate(extract_candidates(text, "https://example.edu/outcomes"))
    assert result.rate == 94.0
    assert result.year == 2024
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```powershell
python -m pytest tests/test_career_outcomes_collection.py -q
```

Expected: FAIL because the collector module does not exist.

- [ ] **Step 3: Implement extraction types and rules**

Implement an immutable candidate record and phrase-based extraction:

```python
@dataclass(frozen=True)
class OutcomeCandidate:
    rate: float
    year: int | None
    source_url: str
    excerpt: str
    population: str
    confidence: str


def extract_candidates(text: str, source_url: str) -> list[OutcomeCandidate]:
    """Extract percentages near qualifying undergraduate career-outcome language."""


def select_best_candidate(candidates: list[OutcomeCandidate]) -> OutcomeCandidate | None:
    """Prefer valid scope, explicit labels, and the newest reporting year."""
```

Reject contexts containing graduate-only credentials or program-level scope. Reject percentages associated with knowledge rate, response rate, graduation, retention, admissions, salary, or earnings. Accept values from 0 through 100 only.

- [ ] **Step 4: Add research dependencies**

Create `requirements-research.txt` containing:

```text
beautifulsoup4==4.12.3
pypdf==6.7.0
requests==2.33.0
```

- [ ] **Step 5: Run tests and verify success**

Run:

```powershell
python -m pytest tests/test_career_outcomes_collection.py -q
```

Expected: all extraction tests PASS.

### Task 2: Add official-domain discovery and resumable collection

**Files:**
- Modify: `projects/The Enrollment Squeeze/scripts/collect_undergraduate_career_outcomes.py`
- Modify: `projects/The Enrollment Squeeze/tests/test_career_outcomes_collection.py`
- Modify: `.gitignore`

- [ ] **Step 1: Write failing discovery and matching tests**

Use mocked responses to verify UNITID matching, sitemap filtering, official-domain enforcement, and HTML/PDF handling:

```python
def test_targets_join_scorecard_url_by_unitid(tmp_path):
    targets = load_targets(DIAGNOSTICS_FIXTURE, SCORECARD_FIXTURE)
    assert targets[0].unitid == "100663"
    assert targets[0].base_url == "https://www.uab.edu"


def test_sitemap_keeps_only_outcome_candidates():
    urls = discover_urls_from_sitemap(SITEMAP_FIXTURE, "example.edu")
    assert urls == ["https://example.edu/career/first-destination-outcomes"]


def test_rejects_candidate_outside_official_domain():
    assert is_official_url("https://aggregator.com/example", "example.edu") is False
```

- [ ] **Step 2: Run targeted tests and verify failure**

Run:

```powershell
python -m pytest tests/test_career_outcomes_collection.py -q
```

Expected: FAIL because discovery functions are undefined.

- [ ] **Step 3: Implement target matching and discovery**

Add:

```python
@dataclass(frozen=True)
class InstitutionTarget:
    unitid: str
    name: str
    base_url: str


def load_targets(diagnostics_path: Path, scorecard_path: Path) -> list[InstitutionTarget]:
    """Join public institutions to Scorecard INSTURL by UNITID."""


def discover_candidate_urls(session: requests.Session, target: InstitutionTarget) -> list[str]:
    """Inspect robots, common sitemap locations, and keyword-scored internal links."""
```

Candidate URL terms must include `career-outcomes`, `career_outcomes`, `first-destination`, `first_destination`, `graduate-outcomes`, `post-graduation`, `outcomes-report`, and `employment-outcomes`. Limit fetching to eight candidate pages per institution and keep requests on the official registrable domain.

- [ ] **Step 4: Implement HTML and PDF extraction, caching, and resume support**

Add:

```python
def fetch_text(session: requests.Session, url: str, cache_dir: Path) -> str:
    """Return visible HTML text or extracted PDF text and cache the response."""


def collect_target(target: InstitutionTarget, settings: CollectionSettings) -> AuditRow:
    """Discover, extract, rank, and preserve the best auditable result."""
```

Use connection/read timeouts, a descriptive user agent, bounded thread concurrency, and one retry. Resume by reading existing audit rows and skipping completed UNITIDs unless `--refresh` is supplied.

- [ ] **Step 5: Ignore the response cache**

Append:

```gitignore
projects/The Enrollment Squeeze/data/research/career_outcomes_cache/
```

- [ ] **Step 6: Run tests and verify success**

Run:

```powershell
python -m pytest tests/test_career_outcomes_collection.py -q
```

Expected: all extraction, matching, discovery, and resume tests PASS.

### Task 3: Generate auditable CSV and runtime JSON outputs

**Files:**
- Modify: `projects/The Enrollment Squeeze/scripts/collect_undergraduate_career_outcomes.py`
- Modify: `projects/The Enrollment Squeeze/tests/test_career_outcomes_collection.py`
- Create: `projects/The Enrollment Squeeze/data/career_outcomes.csv`
- Create: `projects/The Enrollment Squeeze/data/career_outcomes.json`
- Create: `projects/The Enrollment Squeeze/data/research/career_outcomes_audit.csv`
- Create: `projects/The Enrollment Squeeze/data/research/career_outcomes_run_summary.json`

- [ ] **Step 1: Write failing output-contract tests**

```python
def test_outputs_keep_all_institutions_but_publish_only_qualified_results(tmp_path):
    rows = [HIGH_ROW, MEDIUM_ROW, REVIEW_ROW, MISSING_ROW]
    write_outputs(rows, tmp_path)
    plotting = list(csv.DictReader((tmp_path / "career_outcomes.csv").open()))
    runtime = json.loads((tmp_path / "career_outcomes.json").read_text())
    assert len(plotting) == 4
    assert plotting[2]["career_outcomes_percent"] == ""
    assert [row["unitid"] for row in runtime] == [HIGH_ROW.unitid, MEDIUM_ROW.unitid]
```

- [ ] **Step 2: Implement deterministic writers**

The plotting CSV must contain exactly `institution,career_outcomes_percent`. The runtime JSON must contain `unitid`, `institution`, `careerOutcomesRate` as a decimal from 0 to 1, `sourceYear`, `sourceUrl`, and `confidence`. The audit CSV retains every target and all provenance fields.

- [ ] **Step 3: Run a stratified pilot**

Run:

```powershell
python scripts/collect_undergraduate_career_outcomes.py --pilot 50 --workers 8
```

Expected: 50 audit rows, one row per pilot institution, no cross-domain sources, and a summary with counts for `high`, `medium`, `review`, and `missing`.

- [ ] **Step 4: Manually verify the pilot**

Check at least ten results covering public/private control, three size bands, and multiple regions. Move false positives to `review` by strengthening extraction rules, then rerun tests and the pilot.

- [ ] **Step 5: Run the full resumable collection**

Run:

```powershell
python scripts/collect_undergraduate_career_outcomes.py --workers 12
```

Expected: 1,849 audit and plotting rows. Runtime JSON contains only `high` and `medium` records. The summary reports coverage and confidence counts.

### Task 4: Add the career-outcomes scatter plot

**Files:**
- Modify: `projects/The Enrollment Squeeze/app.js`
- Modify: `projects/The Enrollment Squeeze/filters.js`
- Modify: `projects/The Enrollment Squeeze/index.html`
- Modify: `projects/The Enrollment Squeeze/tests/data_contract.test.js`
- Modify: `projects/The Enrollment Squeeze/tests/filter_logic.test.js`

- [ ] **Step 1: Write failing website contract tests**

Add assertions that:

```javascript
assert.match(indexHtml, /id="career-outcomes-scatter"/);
assert.match(appSource, /'career_outcomes'/);
assert.match(filtersSource, /careerOutcomesRate/);
assert.match(filtersSource, /row\.change/);
assert.match(indexHtml, /Career outcomes and observed undergraduate enrollment change/);
```

Validate every runtime record has a unique UNITID, a rate between 0 and 1, an official source URL, and `high` or `medium` confidence.

- [ ] **Step 2: Run Node tests and verify failure**

Run:

```powershell
node --test tests/data_contract.test.js tests/filter_logic.test.js
```

Expected: FAIL because the runtime dataset and scatter container are not wired into the page.

- [ ] **Step 3: Load and join career outcomes by UNITID**

Add `career_outcomes` to the `app.js` data list. In `filters.js`, create a lookup and merge only for rendering:

```javascript
function careerOutcomeRows() {
  const outcomes = new Map((DATA.career_outcomes || []).map(row => [String(row.unitid), row]));
  return filteredRows().map(row => ({ ...row, careerOutcome: outcomes.get(String(row.unitid)) }))
    .filter(row => row.careerOutcome && Number.isFinite(row.change));
}
```

- [ ] **Step 4: Add the plot container and explanatory copy**

Place a new figure card in the institution section after the institution map:

```html
<article class="figure-card career-outcomes-card">
  <div class="figure-head"><h3>Career outcomes and observed undergraduate enrollment change</h3></div>
  <p id="career-outcomes-coverage"></p>
  <div id="career-outcomes-scatter" class="plot primary-plot"></div>
  <p class="figure-note">This comparison describes reported outcomes and observed enrollment change. It does not establish that career outcomes caused enrollment growth.</p>
</article>
```

- [ ] **Step 5: Render the scatter**

Use X as `careerOutcome.careerOutcomesRate`, Y as `row.change`, marker size from `currentUG`, and marker color from `control`. Hover must show source year and the official source link in the institution profile, while the chart click selects the existing institution profile.

- [ ] **Step 6: Run Node tests and verify success**

Run:

```powershell
node --check app.js
node --check filters.js
node --test tests/data_contract.test.js tests/diagnostics_core.test.js tests/filter_logic.test.js
```

Expected: all three Node suites PASS.

### Task 5: Document, render, and verify the complete result

**Files:**
- Modify: `projects/The Enrollment Squeeze/README.md`
- Modify: `projects/The Enrollment Squeeze/data/README.md`
- Modify: `projects/The Enrollment Squeeze/manifest.json`
- Modify: `projects/The Enrollment Squeeze/scripts/render_diagnostics_qa.py`

- [ ] **Step 1: Document the collection and limitations**

Document the two-column plotting file, audit file, runtime JSON, qualifying confidence classes, rerun command, and the fact that reported definitions vary by institution.

- [ ] **Step 2: Extend rendered QA**

Assert that `career-outcomes-scatter` renders when qualified data exist, its point count equals the qualified join count, its Y values come from `institution_diagnostics.change`, and mobile overflow remains zero.

- [ ] **Step 3: Run complete verification**

Run:

```powershell
node --check app.js
node --check filters.js
node --check diagnostics-core.js
node --test tests/data_contract.test.js tests/diagnostics_core.test.js tests/filter_logic.test.js
python -m pytest tests/test_ipeds_residence.py tests/test_market_diagnostics.py tests/test_institution_model_research.py tests/test_career_outcomes_collection.py -q
```

Expected: all Node and Python tests PASS.

- [ ] **Step 4: Run rendered-page QA**

Serve the repository root on port 8765 and run:

```powershell
python scripts/render_diagnostics_qa.py
```

Expected: ten plots, no browser errors, no mobile errors, and zero mobile overflow.

- [ ] **Step 5: Remove regenerable artifacts and inspect the final diff**

Remove only the QA screenshot and ignored caches. Run `git diff --check`, confirm all 1,849 audit rows are present, and report runtime coverage and manual-review results without claiming uniform definitions.
