# Enrollment Squeeze Filters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let readers filter financial-pressure results by state or institution and search directly for institutions in the exposure section, while removing outdated closure/download messaging.

**Architecture:** Keep the existing static JSON data and Plotly charts. Add shared filter state and native searchable `<input list>` controls in `index.html`; use `filters-core.js` for testable filtering rules and `filters.js` to drive both the institution map and finance chart/table without changing the underlying model calculations.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Plotly, GitHub Pages.

---

### Task 1: Add filter controls and remove outdated copy

**Files:**
- Modify: `projects/The Enrollment Squeeze/index.html:123-180`

- [ ] Add a state selector and searchable institution input to the finance controls, plus a searchable institution input to the exposure controls.
- [ ] Remove the `Not closure predictions` badge.
- [ ] Remove the final sentence beginning `A defensible closure-risk model...`.
- [ ] Remove the three download links from the method section and the header-bar Model link.

### Task 2: Add shared filter state and institution search behavior

**Files:**
- Add: `projects/The Enrollment Squeeze/filters-core.js`
- Add: `projects/The Enrollment Squeeze/filters.js`

- [x] Add `financeState`, `financeInstitution`, and `exposureInstitution` state variables.
- [x] Build state and institution option lists from `DATA.institutions`.
- [x] Filter institution rows by year, control, scope, state, and selected institution before rendering the exposure map and finance table/chart.
- [x] Selecting a state narrows the finance institution list; selecting an institution filters the finance section to one row.
- [x] Selecting an institution in the exposure section renders its detail panel and highlights the matching point in the Plotly map.
- [x] Clearing a selector restores the all-state/all-institution view.

### Task 3: Style and browser verification

**Files:**
- Modify: `projects/The Enrollment Squeeze/styles.css`

- [ ] Add responsive styling for the new searchable controls using the existing control-bar system.
- [ ] Run the local static server and verify the root story URL loads the national chart, state map, institution map, finance chart, and table.
- [ ] Verify state filtering, institution search, and clearing filters in both sections.
- [ ] Verify no removed copy or download links remain in the rendered page.

### Task 4: Commit and publish

- [ ] Run `git diff --check` and browser verification.
- [ ] Commit only the Enrollment Squeeze page changes and plan document.
- [ ] Push `main` and confirm the GitHub Pages deployment completes successfully.
