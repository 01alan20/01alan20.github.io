# Undergraduate and Graduate Enrollment Story Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Enrollment Squeeze draft around separate undergraduate and graduate enrollment histories, population-adjusted undergraduate projections, and non-compounding graduate uncertainty bands.

**Architecture:** Extend the local Scorecard history build to retain `UGDS` and `GRADS` for each institution and produce national annual totals. Keep the existing demographic market projection as the undergraduate baseline, add a transparent historical institution trend layer, and keep graduate projections separate with a ±5% band around each projected year. The browser will present the national UG/PG story first, then institution-specific UG pressure and financial sensitivity.

**Tech Stack:** Python CSV/JSON pipeline, vanilla JavaScript, Plotly, HTML/CSS, Node assertion tests.

---

### Task 1: Add test-first enrollment projection primitives

**Files:**
- Modify: `tests/filter_logic.test.js`
- Modify: `filters-core.js`

- [ ] **Step 1: Write failing tests** for compounding an annual trend to a horizon, non-compounding graduate uncertainty bands, and combining demographic and historical UG annual rates.
- [ ] **Step 2: Run `node tests/filter_logic.test.js` and confirm the new assertions fail because the helpers do not exist.**
- [ ] **Step 3: Implement minimal pure helpers**: `annualizeEndpointChange`, `projectEnrollment`, `enrollmentBand`, and `combineAnnualRates`.
- [ ] **Step 4: Run the test file and confirm all assertions pass.**

### Task 2: Rebuild local Scorecard history output with UG/PG data

**Files:**
- Modify: `scripts/build_scorecard_history.py`
- Modify: `data/institution_history.json`
- Modify: `data/institutions.json`
- Create: `data/national_enrollment.json`

- [ ] **Step 1: Add `GRADS` beside `UGDS` to the Scorecard extraction fields.**
- [ ] **Step 2: Store `undergraduateEnrollment` and `graduateEnrollment` by institution-year, preserving missing values as null.**
- [ ] **Step 3: Calculate recent UG and PG trends separately, with coverage counts and source-year metadata.**
- [ ] **Step 4: Build national annual UG and PG totals from institution rows without double-counting duplicate UNITIDs.**
- [ ] **Step 5: Enrich the current institution rows with latest Scorecard UG/PG values and trend metadata, but keep the existing demographic `projectedUG` as a distinct baseline.**
- [ ] **Step 6: Re-run the builder and verify Salem State and USC match the 2024–25 Scorecard values: Salem 4,291 UG / 1,363 PG; USC 20,443 UG / 25,936 PG.**

### Task 3: Make national UG and PG trends visible in the story

**Files:**
- Modify: `index.html`
- Modify: `app.js`
- Modify: `styles.css`

- [ ] **Step 1: Add a national enrollment section with separate undergraduate and graduate line charts.**
- [ ] **Step 2: Use the existing national chart’s 1.0M lower bound only for the undergraduate chart; use independent scaling for graduate enrollment.**
- [ ] **Step 3: Add source labels stating `UGDS` and `GRADS` are institutional-level Scorecard enrollment counts.**
- [ ] **Step 4: Explain that population projections affect undergraduate pressure while graduate estimates are shown as institution trends with a non-compounding ±5% band.**

### Task 4: Reframe institution projections around two UG paths and one PG path

**Files:**
- Modify: `filters.js`
- Modify: `filters-core.js`
- Modify: `index.html`

- [ ] **Step 1: Keep the demographic-only UG path labeled `Population-market baseline`.**
- [ ] **Step 2: Add a trend-informed UG path that compounds the institution’s recent annual trend, with regularization and coverage flags.**
- [ ] **Step 3: Add a blended UG path combining the annualized demographic endpoint rate with the historical institution rate, without double-counting the demographic effect.**
- [ ] **Step 4: Display current UG, current PG, demographic UG estimate, trend-informed UG estimate, blended UG estimate, and PG estimate band in the institution detail.**
- [ ] **Step 5: Keep selectivity and scope as descriptive current-position fields, not changing projection inputs.**

### Task 5: Align the financial pressure chart with the UG model

**Files:**
- Modify: `filters.js`
- Modify: `index.html`

- [ ] **Step 1: Use the selected blended UG path for financial pressure rather than the stale one-step `projectedUG` value.**
- [ ] **Step 2: Keep tuition and fee change as the user-facing assumption and label pressure as an estimate, not realized net revenue.**
- [ ] **Step 3: Keep the bubble chart x-axis as projected UG enrollment change, y-axis as estimated annual tuition pressure, bubble size as current UG enrollment, and hover text as institution plus exposure category/score.**
- [ ] **Step 4: Make the dynamic ranking use the same displayed pressure measure and filters.**

### Task 6: Documentation and validation

**Files:**
- Modify: `README.md`
- Modify: `site/DATA_AUDIT.md`
- Modify: `tests/filter_logic.test.js`

- [ ] **Step 1: Document the UG/PG definitions, source years, projection paths, and non-compounding graduate band.**
- [ ] **Step 2: Add validation for duplicate institution-year rows, Salem/USC values, national totals, and missing-value flags.**
- [ ] **Step 3: Run Python compilation, data build, Node tests, JavaScript syntax checks, and `git diff --check`.**
- [ ] **Step 4: Render the site and verify the national charts, institution details, finance chart, and dynamic ranking in the browser.**
