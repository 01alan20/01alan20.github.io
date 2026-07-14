# Scorecard Runtime Data Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the large College Scorecard Excel/annual source directory with compact runtime artifacts containing only the fields needed by The Enrollment Squeeze site.

**Architecture:** First inventory every reference and derive the minimal institution-history and finance fields used by the browser and build scripts. Store the reduced data as JSON/CSV with a provenance README, then update runtime references and tests. Delete the original source directory only after a clean build, test, and browser verification.

**Tech Stack:** Static HTML, vanilla JavaScript, JSON, CSV, PowerShell, Node test scripts, Python data-build script.

---

### Task 1: Inventory runtime dependencies

**Files:**
- Inspect: `projects/The Enrollment Squeeze/index.html`, `app.js`, `filters.js`, `filters-core.js`, `scripts/`, `tests/`, `data/`

- [ ] Search all references to `data/collegescorecard`, `.xlsx`, `MERGED`, `CollegeScorecard`, and the Scorecard-derived fields.
- [ ] Record the exact fields required by runtime JSON and build scripts.
- [ ] Measure the source directory size and identify files that are not required after consolidation.

### Task 2: Create compact runtime artifacts

**Files:**
- Create or modify: `projects/The Enrollment Squeeze/data/institution_history.json`
- Create or modify: `projects/The Enrollment Squeeze/data/institutions.json`
- Create: `projects/The Enrollment Squeeze/data/README.md`
- Modify: `projects/The Enrollment Squeeze/scripts/build_scorecard_history.py`

- [ ] Build a compact institution history artifact containing only UNITID, year, UGDS, GRAD, tuition inputs, finance inputs, admissions/retention/Pell/control/location fields, and the derived fields used by the model.
- [ ] Preserve current runtime institution records and the 2010–2025 history needed for projections.
- [ ] Document source filenames, dictionary fields, transformations, and the fact that tuition values are price inputs rather than realized net revenue.

### Task 3: Rewire the site and build path

**Files:**
- Modify: `projects/The Enrollment Squeeze/app.js`
- Modify: `projects/The Enrollment Squeeze/filters.js`
- Modify: `projects/The Enrollment Squeeze/index.html`
- Modify: any scripts that directly open files under `data/collegescorecard`

- [ ] Ensure browser runtime loads only compact files under `data/`.
- [ ] Ensure the build script reads compact artifacts or its documented input path rather than the deleted source directory.
- [ ] Remove dead source-directory assumptions and update cache versions if needed.

### Task 4: Add regression checks with TDD

**Files:**
- Modify: `projects/The Enrollment Squeeze/tests/filter_logic.test.js`
- Create or modify: `projects/The Enrollment Squeeze/tests/data_contract.test.js`

- [ ] Add checks that compact artifacts exist, parse, have no duplicate UNITID-year records, and expose the fields required by the browser.
- [ ] Add a check that no runtime source references the deleted directory or Excel files.
- [ ] Run the new checks before implementation to observe the expected failure where appropriate.
- [ ] Implement the minimum changes until all tests pass.

### Task 5: Verify and remove source files

**Files:**
- Delete after verification: `projects/The Enrollment Squeeze/data/collegescorecard/`

- [ ] Run Node syntax checks, data-contract tests, existing logic tests, and `git diff --check`.
- [ ] Serve the site and verify the national charts, institution map, institution selection, waterfall, finance table, and scenario controls render from compact data.
- [ ] Confirm no tracked or runtime reference to the deleted directory remains.
- [ ] Remove the source directory and rerun all checks.
