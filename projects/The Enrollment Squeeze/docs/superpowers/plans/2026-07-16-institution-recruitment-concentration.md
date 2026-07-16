# Institution Recruitment Concentration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add observed first-time domestic residence concentration and undergraduate nonresident-alien concentration to the institution map and profile.

**Architecture:** A focused Python builder downloads and reduces NCES IPEDS `EF2024C` into a compact institution-level residence artifact. The existing diagnostics builder joins those fields by `UNITID`; the existing institution explorer renders them through its map-metric metadata, tooltip, and profile paths without creating a forecast or composite score.

**Tech Stack:** Python standard library, pytest, static JSON, vanilla JavaScript, Plotly, Node contract tests, Selenium rendered QA.

---

### Task 1: Build and validate the IPEDS residence artifact

**Files:**
- Create: `projects/The Enrollment Squeeze/scripts/build_ipeds_residence.py`
- Create: `projects/The Enrollment Squeeze/tests/test_ipeds_residence.py`
- Create: `projects/The Enrollment Squeeze/data/ipeds_residence_2024.json`

- [ ] **Step 1: Write failing aggregation tests**

Create fixture rows for the institution's home state, another state, foreign country, and unknown residence. Assert that `aggregate_residence_rows(rows, institution_states)` returns nonnegative counts, excludes foreign and unknown students from `firstTimeKnownDomesticCount`, and calculates complementary domestic shares.

```python
assert record["firstTimeKnownDomesticCount"] == 80
assert record["firstTimeHomeStateShare"] == 0.75
assert record["firstTimeOtherStateShare"] == 0.25
assert record["firstTimeForeignCountryCount"] == 5
assert record["firstTimeUnknownResidenceCount"] == 3
```

- [ ] **Step 2: Run the focused test and confirm the missing module failure**

Run: `python -m pytest tests/test_ipeds_residence.py -q`

Expected: FAIL because `scripts.build_ipeds_residence` does not exist.

- [ ] **Step 3: Implement the deterministic builder**

Implement:

```python
DATA_URL = "https://nces.ed.gov/ipeds/data-generator?year=2024&tableName=EF2024C&HasRV=0&type=csv"
DICTIONARY_URL = "https://nces.ed.gov/ipeds/dictionary-generator?year=2024&tableName=EF2024C"

def aggregate_residence_rows(rows, institution_states):
    """Return one residence-composition record per UNITID."""
```

The downloader caches source files outside the public runtime, detects the CSV member in the downloaded ZIP, uses dictionary labels to classify residence codes, and writes only compact aggregate records plus provenance. Fail loudly if required labels or counts cannot be resolved; do not infer column positions silently.

- [ ] **Step 4: Run the focused tests and build the artifact**

Run:

```powershell
python -m pytest tests/test_ipeds_residence.py -q
python scripts/build_ipeds_residence.py
```

Expected: tests pass; artifact provenance reports `EF2024C`, Fall 2024, and the known-U.S.-residence denominator.

### Task 2: Join residence measures into institution diagnostics

**Files:**
- Modify: `projects/The Enrollment Squeeze/scripts/build_market_diagnostics.py`
- Modify: `projects/The Enrollment Squeeze/tests/test_market_diagnostics.py`
- Modify: `projects/The Enrollment Squeeze/data/institution_diagnostics.json`

- [ ] **Step 1: Add failing join and invariant tests**

Assert every diagnostics row contains the residence keys, diagnostic `UNITID` values remain unique, and records with positive known-domestic counts have shares that sum to one.

- [ ] **Step 2: Run the diagnostics tests and confirm missing keys**

Run: `python -m pytest tests/test_market_diagnostics.py -q`

Expected: FAIL on absent residence fields.

- [ ] **Step 3: Join by normalized UNITID**

Load `data/ipeds_residence_2024.json`, create a `str(unitid)` lookup, and add:

```python
"firstTimeHomeStateCount"
"firstTimeOtherStateCount"
"firstTimeForeignCountryCount"
"firstTimeUnknownResidenceCount"
"firstTimeKnownDomesticCount"
"firstTimeHomeStateShare"
"firstTimeOtherStateShare"
"residenceSourceYear"
```

Use `None` for institutions without usable residence records.

- [ ] **Step 4: Rebuild and verify**

Run:

```powershell
python scripts/build_market_diagnostics.py
python -m pytest tests/test_market_diagnostics.py tests/test_ipeds_residence.py -q
```

Expected: diagnostics tests pass without changing institution row counts.

### Task 3: Add map measures and recruitment composition profile

**Files:**
- Modify: `projects/The Enrollment Squeeze/diagnostics-core.js`
- Modify: `projects/The Enrollment Squeeze/index.html`
- Modify: `projects/The Enrollment Squeeze/filters.js`
- Modify: `projects/The Enrollment Squeeze/styles.css`
- Modify: `projects/The Enrollment Squeeze/tests/diagnostics_core.test.js`
- Modify: `projects/The Enrollment Squeeze/tests/data_contract.test.js`
- Modify: `projects/The Enrollment Squeeze/tests/filter_logic.test.js`

- [ ] **Step 1: Add failing UI-contract tests**

Assert the selector contains exact population-specific labels, metric metadata returns percentage formatting and the orange-neutral-teal scale, tooltip code includes residence counts and Fall 2024, and the profile contains a `Recruitment composition` group.

- [ ] **Step 2: Run Node tests and confirm the new contracts fail**

Run: `node --test tests/data_contract.test.js tests/filter_logic.test.js tests/diagnostics_core.test.js`

Expected: FAIL because the three options and metadata are absent.

- [ ] **Step 3: Add metric metadata and selector options**

Add:

```javascript
firstTimeHomeStateShare: { label: 'First-time students from within the institution state', format: 'percent', scale: 'sequential' },
firstTimeOtherStateShare: { label: 'First-time students from other U.S. states', format: 'percent', scale: 'sequential' },
internationalUGShare: { label: 'Undergraduate nonresident-alien share', format: 'percent', scale: 'sequential' },
```

Keep bubble size as current undergraduate enrollment and missing-value markers gray.

- [ ] **Step 4: Render population-specific tooltips and profile values**

For domestic measures, show home-state, other-state, foreign-country, unknown-residence, known-domestic counts, and source year. For nonresident-alien share, show Scorecard reporting context without EF-C counts. Add a compact recruitment-composition group to the selected institution profile.

- [ ] **Step 5: Run Node tests**

Run: `node --test tests/data_contract.test.js tests/filter_logic.test.js tests/diagnostics_core.test.js`

Expected: all Node test files pass.

### Task 4: Rendered verification and documentation

**Files:**
- Modify: `projects/The Enrollment Squeeze/scripts/render_diagnostics_qa.py`
- Modify: `projects/The Enrollment Squeeze/data/README.md`
- Modify: `projects/The Enrollment Squeeze/README.md`
- Modify: `output/playwright/enrollment-squeeze-diagnostics-full.png`

- [ ] **Step 1: Extend rendered QA**

Exercise each new map selector value, confirm complete and missing residence records render, select a complete institution, verify the profile source year and counts, click reset, and check desktop/mobile overflow and browser logs.

- [ ] **Step 2: Update provenance documentation**

Document the EF-C entering-class denominator separately from Scorecard `UGDS_NRA`, identify Fall 2024, and state that current recruitment composition is not future recruitment reach.

- [ ] **Step 3: Run complete verification**

Run:

```powershell
node --test tests/data_contract.test.js tests/filter_logic.test.js tests/diagnostics_core.test.js
python -m pytest tests/test_ipeds_residence.py tests/test_market_diagnostics.py tests/test_institution_model_research.py -q
node --check app.js
node --check filters.js
python -m py_compile scripts/build_ipeds_residence.py scripts/build_market_diagnostics.py scripts/render_diagnostics_qa.py
python scripts/render_diagnostics_qa.py
git diff --check
```

Expected: all tests pass, nine Plotly charts render, browser error lists are empty, mobile overflow is zero, reset returns the map to observed undergraduate change, and the full-page screenshot is refreshed.
