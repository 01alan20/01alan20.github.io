# Competitive Conditions Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a compact bottom-of-story section comparing declining and growing institutions across retention, out-of-state recruitment, admission rate, and adult-student share.

**Architecture:** Add semantic markup before the existing ending section. Render the four comparisons from `DATA.institution_diagnostics` in `app.js`, then style them with the existing CSS palette and responsive grid. Keep the section descriptive, with visible medians and an explicit no-causation note.

**Tech Stack:** Static HTML, existing CSS, vanilla JavaScript, existing project data.

---

### Task 1: Add section markup

**Files:** `projects/The Enrollment Squeeze/index.html`

- [ ] Insert immediately before `<section class="ending">`:

```html
<section class="competitive-conditions" id="competitive-conditions" aria-labelledby="competitive-conditions-heading">
  <div class="section-head">
    <div><h2 id="competitive-conditions-heading">What helps institutions compete for students?</h2></div>
    <p>Institutions that grew tended to look different from institutions that declined. These are observed associations, not causal estimates.</p>
  </div>
  <div id="competitive-conditions-grid" class="competitive-conditions-grid"></div>
  <p class="figure-note competitive-conditions-note">Observed undergraduate change from 2015-16 to 2024-25. Declining institutions lost more than 2.5%; growing institutions gained more than 2.5%. The comparisons show association, not causation.</p>
</section>
```

- [ ] Confirm with `rg -n "competitive-conditions|<section class=\"ending\"" "projects/The Enrollment Squeeze/index.html"` that the new section precedes the conclusion.

### Task 2: Render the comparisons

**Files:** `projects/The Enrollment Squeeze/app.js`

- [ ] Add feature configuration for `retention`, `firstTimeOtherStateShare`, `admitRate`, and `adultUGShare`.
- [ ] Add `renderCompetitiveConditions()` that reads `DATA.institution_diagnostics`, assigns Declined for `change < -0.025`, assigns Grew for `change > 0.025`, excludes the stable group, omits missing values per panel, calculates medians, and calculates descriptive Spearman correlation with continuous `change` using a local rank helper.
- [ ] Render four panels with the feature title, plain-language definition, Declined median, Grew median, median difference, and correlation. Do not create a composite score or imply causation.
- [ ] Call the renderer only when `#competitive-conditions-grid` exists and data has loaded.
- [ ] Verify `document.querySelectorAll('#competitive-conditions-grid .competitive-condition-panel').length` returns `4` in the page console.

### Task 3: Style the section

**Files:** `projects/The Enrollment Squeeze/styles.css`

- [ ] Add a paper-background section, max-width 1250px grid, white bordered panels, serif panel headings, muted red decline accents, and teal growth accents.
- [ ] Use four columns on wide screens, two columns at the existing 950px breakpoint, and one column at the existing 620px breakpoint.
- [ ] Keep all labels and medians readable without horizontal overflow.

### Task 4: Verify

**Files:** `projects/The Enrollment Squeeze/tests/test_market_diagnostics.py`, existing render workflow

- [ ] Run `python -m pytest "projects/The Enrollment Squeeze/tests/test_market_diagnostics.py" -q` and confirm PASS.
- [ ] Render the GitHub Pages route and confirm the section appears directly above the conclusion with four populated panels.
- [ ] Inspect a narrow viewport and confirm one panel per row, no clipping, and the conclusion remains below the new section.
- [ ] Run `git diff --check` and `git status --short`; confirm only intended files changed.
