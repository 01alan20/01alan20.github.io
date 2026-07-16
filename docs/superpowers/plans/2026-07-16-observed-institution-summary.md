# Observed Institution Summary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the four approved observed-institution findings above the institution map and remove the redundant quadrant axis note.

**Architecture:** Keep the approved editorial findings in semantic HTML because the user approved exact copy. Add scoped CSS for a compact bullet list beside the existing map selector, with the current mobile stacking behavior preserved.

**Tech Stack:** Static HTML/CSS, Node data-contract tests, Selenium browser QA

---

### Task 1: Lock the approved copy and removals

**Files:**
- Modify: `projects/The Enrollment Squeeze/tests/data_contract.test.js`

- [ ] Add assertions for the four exact findings and for the absence of the three redundant notes:

```js
for (const finding of [
  '61% of institutions declined by more than 2.5%',
  '31% grew by more than 2.5%, while 8% remained within ±2.5%.',
  'Size produced the clearest divide:',
  'More selective, higher-retention institutions performed better:',
  'Location also mattered:',
]) assert.match(indexHtml, new RegExp(finding.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
assert.equal(indexHtml.includes('Bubble size is current undergraduate enrollment.'), false);
assert.equal(indexHtml.includes('id="institution-map-coverage"'), false);
assert.equal(indexHtml.includes('Y-axis: observed undergraduate change'), false);
```

- [ ] Run `node --test tests/data_contract.test.js` and verify it fails because the approved findings are not yet in `index.html`.

### Task 2: Add the summary and remove the axis note

**Files:**
- Modify: `projects/The Enrollment Squeeze/index.html`
- Modify: `projects/The Enrollment Squeeze/styles.css`

- [ ] Replace the map heading block with semantic summary markup:

```html
<div class="map-control-copy">
  <h3>Where observed performance is concentrated</h3>
  <ul class="map-findings">
    <li><strong>61% of institutions declined by more than 2.5%</strong> between 2015–16 and 2024–25. <strong>31% grew by more than 2.5%, while 8% remained within ±2.5%.</strong></li>
    <li><strong>Size produced the clearest divide:</strong> 74% of institutions with fewer than 1,000 undergraduates declined, while 84% of institutions enrolling at least 20,000 grew.</li>
    <li><strong>More selective, higher-retention institutions performed better:</strong> 72% of institutions admitting at least 80% of applicants declined, compared with growth at 70% of institutions admitting 10–24%. Among institutions retaining at least 85% of full-time students, 62% grew.</li>
    <li><strong>Location also mattered:</strong> 74% of Midwestern institutions declined, compared with 53% in the West. Declines affected 72% of rural institutions and 69% of town institutions, versus 58% in cities and 57% in suburbs.</li>
  </ul>
</div>
```

- [ ] Delete the `<p class="figure-note">` beneath `competition-quadrant` that begins `Y-axis: observed undergraduate change`.

- [ ] Add scoped layout styles:

```css
.map-control-row{align-items:flex-start}
.map-control-copy{max-width:900px}
.map-findings{margin:16px 0 0;padding-left:1.2rem;display:grid;gap:9px;color:var(--ink2);line-height:1.45}
.map-findings li::marker{color:var(--accent)}
.map-control-row>label{min-width:320px}
```

- [ ] Run `node --test tests/data_contract.test.js` and verify it passes.

### Task 3: Render and regress

**Files:**
- Verify: `projects/The Enrollment Squeeze/scripts/render_diagnostics_qa.py`

- [ ] Run `python scripts/render_diagnostics_qa.py` and verify zero desktop/mobile browser errors and zero mobile overflow.
- [ ] Inspect `output/playwright/enrollment-squeeze-diagnostics-full.png` to confirm the bullets are readable and the selector does not overlap them.
- [ ] Run:

```powershell
node --check app.js
node --check filters.js
node --check diagnostics-core.js
node --test tests/data_contract.test.js tests/diagnostics_core.test.js tests/filter_logic.test.js
python -m pytest tests/test_ipeds_residence.py tests/test_market_diagnostics.py tests/test_institution_model_research.py -q
git diff --check
```

Expected: all three Node suites and 17 Python tests pass, with no diff errors.

- [ ] Leave production changes uncommitted because they overlap the broader approved dirty project diff; report that explicitly.
