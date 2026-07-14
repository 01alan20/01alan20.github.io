# Enrollment Story Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a defensible enrollment narrative and scenario tool that separates domestic, peer-performance, and international undergraduate pressure.

**Architecture:** The Python Scorecard build becomes the source for balanced national history and current student-composition measures. Existing institution-map coordinates retain their current coverage; expanding them requires a separately sourced geographic join. Pure functions in `filters-core.js` calculate bounded peer and international components. `filters.js` composes the institution model for the map, selected-institution decomposition, and tuition scenario; `app.js` renders the national and local story visuals.

**Tech Stack:** Python CSV/JSON, vanilla JavaScript, Plotly, HTML/CSS, Node assertions, Playwright CLI.

---

### Task 1: Repair removed-method remnants

**Files:**
- Modify: `index.html`
- Modify: `app.js`

- [ ] Remove the `#method` navigation item and delete `renderStatus()` plus its invocation.
- [ ] Load the page and verify the only browser-console item is the favicon request.

### Task 2: Build balanced history and current institution inputs

**Files:**
- Modify: `scripts/build_scorecard_history.py`
- Modify: `data/institution_history.json`
- Modify: `data/national_enrollment.json`
- Modify: `data/institutions.json`

- [x] Add `LATITUDE`, `LONGITUDE`, `UG25ABV`, `PPTUG_EF`, and current Scorecard tuition fields to the extracted fields.
- [ ] Create a balanced 2015-16 / 2024-25 panel in `national_enrollment.json`, including count, undergraduate total, graduate total, and annual series for shared UNITIDs.
- [x] Enrich institution records with nonresident-alien share, part-time share, adult share, and tuition-price inputs, preserving null values when not reported. Scorecard coordinates remain null in the annual files and are not used to claim expanded map coverage.
- [ ] Re-run the build and verify the balanced panel contains 4,968 institutions and that Salem State retains 4,291 UG / 1,363 PG.

### Task 3: Add test-first model primitives

**Files:**
- Modify: `tests/filter_logic.test.js`
- Modify: `filters-core.js`

- [ ] Write failing assertions for damped peer-relative annual adjustment and the international scenario path: a 2026-27 cohort-adjusted shock, 2028 recovery start, and bounded smaller/normal/larger recovery outcomes.
- [ ] Run `node tests/filter_logic.test.js` and confirm the new assertions fail because the helpers are absent.
- [ ] Implement pure helpers `dampedPeerAdjustment` and `internationalScenarioChange` with explicit inputs and null-safe zero exposure.
- [ ] Re-run the test file and confirm all assertions pass.

### Task 4: Rebuild the national and local explanatory visuals

**Files:**
- Modify: `index.html`
- Modify: `app.js`
- Modify: `styles.css`

- [ ] Replace the three-step national scrolly behavior with one 2026-versus-2041 pipeline chart showing graduates, immediate entrants, and likely four-year entrants.
- [ ] Label the UG/graduate trend charts as balanced-panel Scorecard history and render their balanced series.
- [ ] Add a visible state-map legend for fewer versus more expected entrants.
- [ ] Change the county visual to a 2026-to-selected-year dumbbell chart for the largest selected-state markets.

### Task 5: Use the peer-relative and international components in the institution forecast

**Files:**
- Modify: `filters.js`
- Modify: `index.html`
- Modify: `styles.css`

- [ ] Replace the raw 50/50 historical-CAGR blend with the market baseline plus damped peer-relative adjustment.
- [ ] Add selectivity bands as current-position descriptors, with missing admission rate visibly marked as the 80%+ scenario assignment.
- [ ] Add an international recovery selector and feed `UGDS_NRA` exposure into the projected-UG model.
- [ ] Add separately sourced, validated coordinates for institutions missing existing map locations.
- [ ] Add a selected-institution waterfall/decomposition for domestic market, peer-relative performance, international scenario, user adjustment, and projected UG.

### Task 6: Align the financial scenario and language

**Files:**
- Modify: `filters.js`
- Modify: `index.html`

- [ ] Use the same projected undergraduate change in the selected-institution tuition sensitivity and the national pressure comparison.
- [ ] Preserve one student equals one FTE and label the output as gross undergraduate tuition sensitivity.
- [ ] Keep the top-pressure comparison and table dynamic under tuition, international, and student-change assumptions.

### Task 7: Validate and render

**Files:**
- Modify: `README.md`
- Modify: `site/DATA_AUDIT.md`
- Test: `tests/filter_logic.test.js`

- [ ] Document the balanced panel, market-reach proxy, peer-relative adjustment, and international exposure definition.
- [ ] Run the history build, Python compilation, Node tests, JavaScript syntax checks, and `git diff --check`.
- [ ] Render the fresh page in Playwright; verify pipeline, state legend, county dumbbell, full-coverage map, selected-institution decomposition, and dynamic financial settings.
