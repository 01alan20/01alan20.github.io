# Enrollment Squeeze Market Diagnostics Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild The Enrollment Squeeze as a five-part diagnostic story that quantifies participation requirements, peer-relative institution performance, replacement-student needs, and grounded tuition counterfactuals.

**Architecture:** A Python builder derives stable state and institution diagnostics from the compact runtime data. Pure JavaScript helpers own browser-side classifications and scenario arithmetic; the existing Plotly modules render the five-part narrative without reintroducing institution forecasts or synthetic risk scores.

**Tech Stack:** Python 3, pytest, vanilla JavaScript, Node test runner, Plotly, static JSON, HTML/CSS, Selenium/Chrome for rendered verification.

---

## File responsibilities

- `scripts/build_market_diagnostics.py`: deterministic state and institution derivations.
- `data/state_diagnostics.json`: state-year participation, absolute-loss, and archetype records.
- `data/institution_diagnostics.json`: one observed diagnostic record per institution.
- `diagnostics-core.js`: pure browser-side state, allocation, finance, and profile helpers.
- `app.js`: national, state, county, international, and replacement-tool rendering.
- `filters.js`: institution map, quadrant, profile, and finance rendering.
- `index.html`: five-part story structure and controls.
- `styles.css`: pacing, chapters, diagnostics cards, responsive behavior, and accessible palettes.
- `tests/test_market_diagnostics.py`: Python calculation and builder tests.
- `tests/diagnostics_core.test.js`: JavaScript helper tests.
- `tests/data_contract.test.js`: runtime-artifact and public-language contract.

### Task 1: State diagnostic calculations

**Files:**
- Create: `scripts/build_market_diagnostics.py`
- Create: `tests/test_market_diagnostics.py`

- [ ] **Step 1: Write failing state calculation tests**

```python
from scripts.build_market_diagnostics import participation_requirement, classify_state

def test_participation_requirement_offsets_decline():
    result = participation_requirement(1000, 800, 0.628, 2 / 3)
    assert round(result["requiredRate"], 3) == 0.785
    assert round(result["increasePoints"], 1) == 15.7

def test_growth_requires_no_participation_increase():
    result = participation_requirement(1000, 1100, 0.628, 2 / 3)
    assert result["increasePoints"] == 0

def test_state_archetypes_are_descriptive():
    assert classify_state(0.01, 0, 0, 1000) == "Expanding pool"
    assert classify_state(-0.04, 4.0, 800, 1000) == "Participation opportunity"
    assert classify_state(-0.15, 12.0, 1500, 1000) == "Severe structural pressure"
```

- [ ] **Step 2: Run the tests and confirm the import fails**

Run: `python -m pytest tests/test_market_diagnostics.py -q`

Expected: FAIL because `build_market_diagnostics` does not exist.

- [ ] **Step 3: Implement the pure state functions**

```python
def participation_requirement(baseline_graduates, future_graduates, current_rate=0.628, four_year_share=2/3):
    baseline_entrants = baseline_graduates * current_rate * four_year_share
    required = baseline_entrants / (future_graduates * four_year_share) if future_graduates else float("inf")
    return {
        "requiredRate": required,
        "increasePoints": max(0.0, required - current_rate) * 100,
        "feasible": required <= 1,
    }

def classify_state(change, increase_points, absolute_loss, median_loss):
    if change >= 0: return "Expanding pool"
    if increase_points <= 5: return "Participation opportunity"
    if change <= -0.10 and absolute_loss >= median_loss: return "Severe structural pressure"
    if change <= -0.10: return "Concentrated pressure"
    return "Large but contracting"
```

- [ ] **Step 4: Run the state tests and confirm they pass**

Run: `python -m pytest tests/test_market_diagnostics.py -q`

Expected: PASS.

### Task 2: Institution peers and percentiles

**Files:**
- Modify: `scripts/build_market_diagnostics.py`
- Modify: `tests/test_market_diagnostics.py`

- [ ] **Step 1: Write failing peer and percentile tests**

```python
from scripts.build_market_diagnostics import endpoint_change, percentile_rank, choose_peer_values

def test_endpoint_change_uses_2015_16_and_2024_25():
    assert endpoint_change(1000, 820) == -0.18

def test_percentile_ignores_missing_values():
    assert percentile_rank(20, [None, 10, 20, 30]) == 50.0

def test_peer_fallback_uses_control_and_size():
    rows = [{"change": i / 100, "control": "Public", "sizeBand": "Under 5,000", "admissionBand": "Below 50%"} for i in range(12)]
    values, label = choose_peer_values(rows[0], rows, minimum=10)
    assert len(values) == 12
    assert label == "control, size, and admissions band"
```

- [ ] **Step 2: Run the tests and confirm the new names fail**

Run: `python -m pytest tests/test_market_diagnostics.py -q`

Expected: FAIL with missing function imports.

- [ ] **Step 3: Implement endpoint, band, peer fallback, median, and percentile helpers**

The preferred peer key is `(control, sizeBand, admissionBand)`, followed by `(control, sizeBand)`, then `(control,)`. Each candidate must have at least ten valid endpoint changes. Percentile rank uses the share below plus half the share tied.

- [ ] **Step 4: Run all Python tests**

Run: `python -m pytest tests/test_market_diagnostics.py tests/test_institution_model_research.py -q`

Expected: PASS.

### Task 3: Build runtime diagnostic artifacts

**Files:**
- Modify: `scripts/build_market_diagnostics.py`
- Create: `data/state_diagnostics.json`
- Create: `data/institution_diagnostics.json`
- Modify: `tests/data_contract.test.js`

- [ ] **Step 1: Add failing artifact contract assertions**

```javascript
const stateDiagnostics = JSON.parse(fs.readFileSync(path.join(project, 'data', 'state_diagnostics.json')));
const institutionDiagnostics = JSON.parse(fs.readFileSync(path.join(project, 'data', 'institution_diagnostics.json')));
assert.ok(stateDiagnostics.every(row => ['graduateLoss', 'entrantLoss', 'requiredParticipationPoints', 'archetype'].every(key => Object.hasOwn(row, key))));
assert.ok(institutionDiagnostics.every(row => ['change', 'peerMedian', 'stateMedian', 'relativePerformance', 'peerCount', 'percentiles'].every(key => Object.hasOwn(row, key))));
```

- [ ] **Step 2: Run the contract and confirm missing-file failure**

Run: `node --test tests/data_contract.test.js`

Expected: FAIL because the diagnostic JSON files do not exist.

- [ ] **Step 3: Implement `build()`**

Read `scorecard_compact.json`, deduplicate `institutions.json` by `unitid`, and join state 2041 entrant changes. Write compact JSON with one institution record per `unitid` and one state record per state-year. Preserve raw values alongside percentile values and store `null` for unavailable metrics.

- [ ] **Step 4: Generate artifacts and rerun contracts**

Run: `python scripts/build_market_diagnostics.py`

Run: `node --test tests/data_contract.test.js`

Expected: PASS with 51 state records per modeled year and one diagnostic row per usable institution.

### Task 4: Browser-side diagnostic arithmetic

**Files:**
- Create: `diagnostics-core.js`
- Create: `tests/diagnostics_core.test.js`

- [ ] **Step 1: Write failing JavaScript tests**

```javascript
const { clampAllocation, tuitionCounterfactual, stateMetricMeta, describeInstitution } = require('../diagnostics-core');

assert.deepEqual(clampAllocation(600, { participation: 200, outOfState: 150, international: 100, transferAdult: 150 }).unfilled, 0);
assert.deepEqual(clampAllocation(600, { participation: 500, outOfState: 500 }).allocated, 600);

const finance = tuitionCounterfactual({ currentUG: 1000, tuitionPerFTE: 10000, instructionPerFTE: 6000 }, 0.10, 0.85);
assert.equal(finance.lostStudents, 100);
assert.equal(finance.lostFTE, 85);
assert.equal(finance.grossTuitionReduction, 850000);
assert.equal(finance.associatedInstructionalExpenditure, 510000);

assert.equal(stateMetricMeta('entrantLoss').label, 'Likely four-year entrants lost');
assert.doesNotMatch(describeInstitution({ change: -0.18, peerMedian: -0.05, adultUGShare: 0.09, peerAdultMedian: 0.16 }), /risk|vulnerable|resilien/i);
```

- [ ] **Step 2: Run the test and confirm the module is missing**

Run: `node --test tests/diagnostics_core.test.js`

Expected: FAIL because `diagnostics-core.js` does not exist.

- [ ] **Step 3: Implement the UMD helper module**

Export `clampAllocation`, `tuitionCounterfactual`, `stateMetricMeta`, `institutionMetricMeta`, and `describeInstitution`. Allocation is processed in channel order and each value is capped by the remaining missing total. Finance accepts only 0.05, 0.10, or 0.20.

- [ ] **Step 4: Run the JavaScript helper tests**

Run: `node --test tests/diagnostics_core.test.js`

Expected: PASS.

### Task 5: Rebuild story structure and pacing

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `tests/data_contract.test.js`

- [ ] **Step 1: Add failing structure and language assertions**

```javascript
for (const id of ['part-pool', 'part-geography', 'part-competition', 'part-alternatives', 'part-finance']) assert.match(indexHtml, new RegExp(`id="${id}"`));
assert.match(indexHtml, /Participation increase required to maintain the 2026 entrant pool/);
assert.match(indexHtml, /Observed institution change versus projected state entrant change/);
assert.match(indexHtml, /Immediately avoidable cost[^<]*not estimated/i);
assert.doesNotMatch(indexHtml, /Largest modeled gross tuition declines/);
```

- [ ] **Step 2: Run the contract and confirm the new structure fails**

Run: `node --test tests/data_contract.test.js`

Expected: FAIL on the missing part IDs.

- [ ] **Step 3: Reorder and rewrite `index.html`**

Create five chapter bands and place sections in Pool → Geography → Competition → Alternatives → Finance order. Add state metric controls, quadrant container, institution map metric control, profile container, international concentration chart, replacement allocator, and 5/10/20 finance controls. Load `diagnostics-core.js` before `app.js` and `filters.js`.

- [ ] **Step 4: Tighten `styles.css`**

Set desktop hero minimum height to `74vh`, desktop section padding to `72px`, remove sticky scrolly dimensions, make primary charts at least `500px`, add chapter-band, quadrant, profile-grid, percentile-bar, allocator, and scenario-card styles, and stack all new grids below 950px.

- [ ] **Step 5: Run the contract**

Run: `node --test tests/data_contract.test.js`

Expected: PASS.

### Task 6: State diagnostics and replacement allocation

**Files:**
- Modify: `app.js`
- Modify: `index.html`
- Modify: `tests/filter_logic.test.js`

- [ ] **Step 1: Add failing source assertions for diagnostic rendering**

```javascript
assert.match(appSource, /state_diagnostics/);
assert.match(appSource, /requiredParticipationPoints/);
assert.match(appSource, /renderReplacementTool/);
assert.match(appSource, /EnrollmentDiagnosticsCore\.clampAllocation/);
```

- [ ] **Step 2: Run the test and confirm failure**

Run: `node --test tests/filter_logic.test.js`

Expected: FAIL on the missing state diagnostics references.

- [ ] **Step 3: Implement state metric rendering**

Load `state_diagnostics.json`. Render orange-neutral-teal for change metrics, light-to-blue for required participation, signed values in tooltips, and state archetype plus raw metrics in the side panel. Annotate the largest absolute entrant-loss state for the selected year.

- [ ] **Step 4: Implement the replacement tool**

Use the selected state/year entrant loss as the required total. Four range inputs call `clampAllocation`; output cards show each channel, total allocated, and unfilled students. Disable allocation with a `No replacement required` message when the state pool grows.

- [ ] **Step 5: Run helper, source, and contract tests**

Run: `node --test tests/diagnostics_core.test.js tests/filter_logic.test.js tests/data_contract.test.js`

Expected: PASS.

### Task 7: Institution competition quadrant, map, and profile

**Files:**
- Modify: `filters.js`
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `tests/filter_logic.test.js`

- [ ] **Step 1: Add failing institution diagnostics assertions**

```javascript
assert.match(filtersSource, /institution_diagnostics/);
assert.match(filtersSource, /competition-quadrant/);
assert.match(filtersSource, /peerMedian/);
assert.match(filtersSource, /institution-map-metric/);
assert.doesNotMatch(filtersSource, /exposureScore|projectedUGBehavioral/);
```

- [ ] **Step 2: Run the source test and confirm failure**

Run: `node --test tests/filter_logic.test.js`

Expected: FAIL on missing diagnostics data and quadrant rendering.

- [ ] **Step 3: Replace institution-row projection logic**

Join `DATA.institution_diagnostics` to the unique institution records. Keep state, control, size, trend, and search filters. Remove year and projection calculations from the public institution explorer.

- [ ] **Step 4: Render the quadrant**

Plot `statePoolChange2041` against `change`, size points by current UG, draw zero reference lines, label four situations, and highlight the selected institution. Clicking a point or map marker selects the same profile.

- [ ] **Step 5: Render selectable observed map views**

Use `institutionMetricMeta` for color scale, formatting, and missing-data treatment. Default to `change`; bubble area reflects current undergraduate enrollment.

- [ ] **Step 6: Render the observed profile**

Show raw/state/peer comparisons, separate percentile bars, and `describeInstitution()` text. Keep null values visible as `Not available`.

- [ ] **Step 7: Run all Node tests**

Run: `node --test tests/diagnostics_core.test.js tests/filter_logic.test.js tests/data_contract.test.js`

Expected: PASS.

### Task 8: International concentration and financial counterfactual

**Files:**
- Modify: `data/international.json`
- Modify: `app.js`
- Modify: `filters.js`
- Modify: `tests/data_contract.test.js`

- [ ] **Step 1: Add failing international and finance contracts**

```javascript
const international = JSON.parse(fs.readFileSync(path.join(project, 'data', 'international.json')));
assert.equal(international.originConcentration2024_25.total, 1177766);
assert.equal(international.originConcentration2024_25.groups.reduce((sum, row) => sum + row.students, 0), 1177766);
assert.match(appSource, /international-concentration-chart/);
assert.match(filtersSource, /tuitionCounterfactual/);
```

- [ ] **Step 2: Run the contract and confirm failure**

Run: `node --test tests/data_contract.test.js`

Expected: FAIL because origin concentration is absent.

- [ ] **Step 3: Add the official Open Doors concentration object**

Store India `363019`, China `265919`, and all other origins `548828`, plus the official Open Doors release URL and stock-versus-flow limitation.

- [ ] **Step 4: Render the concentration chart**

Use a horizontal stacked bar, direct labels, and an annotation showing the combined 53.4% India/China share. Keep the 2025 new-intake decline as a separate metric.

- [ ] **Step 5: Replace the finance projection with standard counterfactuals**

Render 5%, 10%, and 20% native radio buttons, selected-institution search, a comparison bar for current tuition base/gross reduction/associated instruction, and output cards for headcount, FTE, percentage reduction, and `Immediately avoidable cost: Not estimated`.

- [ ] **Step 6: Run all Node tests**

Run: `node --test tests/diagnostics_core.test.js tests/filter_logic.test.js tests/data_contract.test.js`

Expected: PASS.

### Task 9: Full verification and rendered QA

**Files:**
- Modify only if verification identifies a tested defect.
- Create: `output/playwright/enrollment-squeeze-diagnostics-full.png`

- [ ] **Step 1: Run the complete automated suite**

Run: `python -m pytest tests/test_market_diagnostics.py tests/test_institution_model_research.py -q`

Run: `node --test tests/data_contract.test.js tests/filter_logic.test.js tests/diagnostics_core.test.js`

Run: `node --check app.js && node --check filters.js && node --check diagnostics-core.js`

Expected: all tests and syntax checks pass.

- [ ] **Step 2: Run whitespace and artifact checks**

Run: `git diff --check`

Run: `python scripts/build_market_diagnostics.py`

Expected: no diff errors and deterministic artifact output.

- [ ] **Step 3: Exercise the local route**

Serve the repository root on port 8765, open `/projects/The%20Enrollment%20Squeeze/index.html`, verify all required JSON requests return 200, and exercise state metric, map metric, institution selection, replacement sliders, and finance scenarios at 1440px and 390px widths.

- [ ] **Step 4: Capture and inspect a full-page screenshot**

Use native Chrome/Selenium full-page capture after waiting for Plotly. Save `output/playwright/enrollment-squeeze-diagnostics-full.png` and inspect it for blank sections, clipped labels, excessive spacing, and inaccessible contrast.

- [ ] **Step 5: Report evidence and unsupported fields**

Report test counts, artifact row counts, the screenshot path, and the explicit exclusions: Carnegie, applications, distance-only, program concentration, residence-based import dependence, and institution-specific international intake forecasting.
