# Enrollment Squeeze Grouped Institution Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace bland continuous institution-map gradients with interpretable grouped colors and remove the two requested explanatory lines.

**Architecture:** Add a pure grouping API to `diagnostics-core.js` that owns fixed thresholds, quantile breaks, labels, and a five-color palette. `filters.js` will consume that API to assign each visible institution a discrete color index and configure a labeled Plotly colorbar; `index.html` will only contain the map heading and selector.

**Tech Stack:** Static HTML/CSS, browser JavaScript, Plotly, Node `assert` tests, Selenium browser QA

---

## File structure

- Modify `projects/The Enrollment Squeeze/diagnostics-core.js`: metric grouping metadata and pure fixed/quantile grouping functions.
- Modify `projects/The Enrollment Squeeze/filters.js`: grouped marker values and discrete Plotly legend rendering.
- Modify `projects/The Enrollment Squeeze/index.html`: remove the bubble-size sentence and coverage element.
- Modify `projects/The Enrollment Squeeze/styles.css`: remove the now-unused map coverage rule.
- Modify `projects/The Enrollment Squeeze/tests/diagnostics_core.test.js`: boundary, quantile, duplicate-breakpoint, label, and missing-value tests.
- Modify `projects/The Enrollment Squeeze/tests/data_contract.test.js`: requested-copy removal tests.
- Modify `projects/The Enrollment Squeeze/tests/filter_logic.test.js`: grouped-map integration contract.
- Modify `projects/The Enrollment Squeeze/scripts/render_diagnostics_qa.py`: cycle all map measures and verify a discrete legend without browser errors.

### Task 1: Pure fixed-band grouping

**Files:**
- Modify: `projects/The Enrollment Squeeze/tests/diagnostics_core.test.js`
- Modify: `projects/The Enrollment Squeeze/diagnostics-core.js`

- [ ] **Step 1: Write failing fixed-band tests**

Import `institutionMapGrouping`, then add assertions covering the requested thresholds:

```js
const admissions = institutionMapGrouping('admitRate', [0.05, 0.10, 0.25, 0.50, 0.80]);
assert.deepEqual(admissions.groups.map(group => group.label), ['<10%', '10–24%', '25–49%', '50–79%', '80%+']);
assert.deepEqual([0.099, 0.10, 0.249, 0.25, 0.499, 0.50, 0.799, 0.80].map(admissions.indexFor), [0, 1, 1, 2, 2, 3, 3, 4]);

const change = institutionMapGrouping('change', [-0.20, -0.05, 0, 0.05, 0.20]);
assert.deepEqual(change.groups.map(group => group.label), ['Large decline', 'Moderate decline', 'Little change', 'Moderate growth', 'Large growth']);
assert.deepEqual([-0.10, -0.099, -0.025, 0.025, 0.026, 0.10].map(change.indexFor), [0, 1, 2, 2, 3, 4]);

const size = institutionMapGrouping('currentUG', [500, 2500, 7500, 15000, 30000]);
assert.deepEqual(size.groups.map(group => group.label), ['<1,000', '1,000–4,999', '5,000–9,999', '10,000–19,999', '20,000+']);
assert.deepEqual([999, 1000, 4999, 5000, 9999, 10000, 19999, 20000].map(size.indexFor), [0, 1, 1, 2, 2, 3, 3, 4]);
```

- [ ] **Step 2: Run the fixed-band tests and verify RED**

Run:

```powershell
node --test tests/diagnostics_core.test.js
```

Expected: FAIL because `institutionMapGrouping` is not exported.

- [ ] **Step 3: Implement metric grouping metadata and fixed indexes**

Add this palette and fixed-band metadata in `diagnostics-core.js`:

```js
const institutionGroupColors = ['#c95c32', '#e2a178', '#e7e2d8', '#8abfc2', '#218a9a'];
const fixedInstitutionGroups = {
  change: {
    labels: ['Large decline', 'Moderate decline', 'Little change', 'Moderate growth', 'Large growth'],
    indexFor: value => value <= -0.10 ? 0 : value < -0.025 ? 1 : value <= 0.025 ? 2 : value < 0.10 ? 3 : 4,
  },
  admitRate: {
    labels: ['<10%', '10–24%', '25–49%', '50–79%', '80%+'],
    indexFor: value => value < 0.10 ? 0 : value < 0.25 ? 1 : value < 0.50 ? 2 : value < 0.80 ? 3 : 4,
  },
  currentUG: {
    labels: ['<1,000', '1,000–4,999', '5,000–9,999', '10,000–19,999', '20,000+'],
    indexFor: value => value < 1000 ? 0 : value < 5000 ? 1 : value < 10000 ? 2 : value < 20000 ? 3 : 4,
  },
  retention: {
    labels: ['<50%', '50–64%', '65–74%', '75–84%', '85%+'],
    indexFor: value => value < 0.50 ? 0 : value < 0.65 ? 1 : value < 0.75 ? 2 : value < 0.85 ? 3 : 4,
  },
  firstTimeHomeStateShare: {
    labels: ['<25%', '25–49%', '50–74%', '75–89%', '90%+'],
    indexFor: value => value < 0.25 ? 0 : value < 0.50 ? 1 : value < 0.75 ? 2 : value < 0.90 ? 3 : 4,
  },
  firstTimeOtherStateShare: {
    labels: ['<25%', '25–49%', '50–74%', '75–89%', '90%+'],
    indexFor: value => value < 0.25 ? 0 : value < 0.50 ? 1 : value < 0.75 ? 2 : value < 0.90 ? 3 : 4,
  },
};
```

Return `{ groups, indexFor, colorscale, cmin, cmax, tickvals, ticktext }` from `institutionMapGrouping(metric, values)`. Build each fixed `groups` entry as `{ index, label, color }` and export the function.

- [ ] **Step 4: Run the fixed-band tests and verify GREEN**

Run:

```powershell
node --test tests/diagnostics_core.test.js
```

Expected: PASS.

### Task 2: Quantile grouping and discrete Plotly scale

**Files:**
- Modify: `projects/The Enrollment Squeeze/tests/diagnostics_core.test.js`
- Modify: `projects/The Enrollment Squeeze/diagnostics-core.js`

- [ ] **Step 1: Write failing quantile and scale tests**

Add:

```js
const quantiles = institutionMapGrouping('internationalUGShare', [0, 0.01, 0.02, 0.03, 0.05, 0.08, 0.13, 0.21, 0.34, 0.55]);
assert.equal(quantiles.groups.length, 5);
assert.equal(quantiles.colorscale.length, 10);
assert.deepEqual(quantiles.tickvals, [0, 1, 2, 3, 4]);
assert.ok(quantiles.groups.every(group => /%/.test(group.label)));
assert.equal(quantiles.indexFor(null), null);

const ties = institutionMapGrouping('adultUGShare', [0, 0, 0, 0, 0.10, 0.20]);
assert.ok(ties.groups.length >= 2 && ties.groups.length < 5);
assert.equal(new Set(ties.groups.map(group => group.label)).size, ties.groups.length);
assert.ok(ties.groups.every((group, index) => group.index === index));
```

- [ ] **Step 2: Run the quantile tests and verify RED**

Run:

```powershell
node --test tests/diagnostics_core.test.js
```

Expected: FAIL because sequential metrics still use the old continuous scale.

- [ ] **Step 3: Implement quantile breaks, labels, and step colors**

For metrics outside `fixedInstitutionGroups`, compute 20th, 40th, 60th, and 80th percentile thresholds from finite values, sort them, and remove duplicates. Assign an index by counting thresholds strictly below the value. Format range labels using `institutionMetricMeta(metric).format`:

```js
function groupValueLabel(value, format) {
  if (format === 'percent') return `${(value * 100).toFixed(value < 0.10 ? 1 : 0)}%`;
  if (format === 'money') return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}
```

Use `Up to X`, `X–Y`, and `More than X` labels. Sample the five-color palette so consolidated groups still span orange to teal. Build a stepped Plotly colorscale by duplicating each group color at both edges of its normalized interval:

```js
function steppedColorscale(colors) {
  return colors.flatMap((color, index) => {
    const start = index / colors.length;
    const end = (index + 1) / colors.length;
    return [[start, color], [end, color]];
  });
}
```

Return `cmin: -0.5`, `cmax: groups.length - 0.5`, integer `tickvals`, and range-label `ticktext`.

- [ ] **Step 4: Run the diagnostics tests and verify GREEN**

Run:

```powershell
node --test tests/diagnostics_core.test.js
```

Expected: PASS.

### Task 3: Render grouped map colors and labels

**Files:**
- Modify: `projects/The Enrollment Squeeze/tests/filter_logic.test.js`
- Modify: `projects/The Enrollment Squeeze/filters.js`

- [ ] **Step 1: Write a failing integration contract**

Replace the old continuous-scale assertion with:

```js
assert.match(filtersSource, /EnrollmentDiagnosticsCore\.institutionMapGrouping\(metric, values\)/);
assert.match(filtersSource, /grouping\.indexFor\(row\[metric\]\)/);
assert.match(filtersSource, /tickvals: grouping\.tickvals/);
assert.match(filtersSource, /ticktext: grouping\.ticktext/);
assert.equal(filtersSource.includes("$('institution-map-coverage').textContent"), false);
```

- [ ] **Step 2: Run the integration contract and verify RED**

Run:

```powershell
node --test tests/filter_logic.test.js
```

Expected: FAIL because `filters.js` still uses `institutionColorScale` and writes coverage copy.

- [ ] **Step 3: Replace continuous values with grouped indexes**

Replace `mapScale` with:

```js
function mapGrouping(rows, metric) {
  const values = rows.map(row => row[metric]).filter(Number.isFinite);
  return EnrollmentDiagnosticsCore.institutionMapGrouping(metric, values);
}
```

In `renderInstitutionMap`, set marker colors to `valid.map(row => grouping.indexFor(row[metric]))` and use:

```js
marker: {
  size: valid.map(row => Math.max(5, Math.min(25, Math.sqrt(row.currentUG || 0) / 3.5))),
  color: valid.map(row => grouping.indexFor(row[metric])),
  cmin: grouping.cmin,
  cmax: grouping.cmax,
  colorscale: grouping.colorscale,
  colorbar: {
    title: { text: meta.label, side: 'top' },
    tickmode: 'array',
    tickvals: grouping.tickvals,
    ticktext: grouping.ticktext,
    thickness: 18,
    len: 0.82,
  },
  opacity: 0.82,
  line: { width: 0.4, color: '#fff' },
}
```

Delete the `institution-map-coverage` text update. Keep exact raw values and current UG in hover templates.

- [ ] **Step 4: Run the integration and diagnostics tests**

Run:

```powershell
node --test tests/diagnostics_core.test.js tests/filter_logic.test.js
```

Expected: PASS.

### Task 4: Remove requested copy and obsolete styling

**Files:**
- Modify: `projects/The Enrollment Squeeze/tests/data_contract.test.js`
- Modify: `projects/The Enrollment Squeeze/index.html`
- Modify: `projects/The Enrollment Squeeze/styles.css`

- [ ] **Step 1: Write failing copy-removal tests**

Add:

```js
assert.equal(indexHtml.includes('Bubble size is current undergraduate enrollment.'), false);
assert.equal(indexHtml.includes('id="institution-map-coverage"'), false);
```

- [ ] **Step 2: Run the contract test and verify RED**

Run:

```powershell
node --test tests/data_contract.test.js
```

Expected: FAIL because both elements remain in `index.html`.

- [ ] **Step 3: Remove the visible copy and empty element**

Change the map heading block to:

```html
<div><h3>Where observed performance is concentrated</h3></div>
```

Delete:

```html
<p id="institution-map-coverage" class="figure-note map-coverage"></p>
```

Remove `.map-coverage` from `styles.css` while retaining `.profile-subsection` and `.recruitment-grid`.

- [ ] **Step 4: Run the contract test and verify GREEN**

Run:

```powershell
node --test tests/data_contract.test.js
```

Expected: PASS.

### Task 5: Browser QA and complete regression verification

**Files:**
- Modify: `projects/The Enrollment Squeeze/scripts/render_diagnostics_qa.py`

- [ ] **Step 1: Extend browser QA to all map metrics**

Cycle these values:

```python
map_metrics = (
    "change", "currentUG", "admitRate", "retention",
    "firstTimeHomeStateShare", "firstTimeOtherStateShare",
    "adultUGShare", "partTimeUGShare", "internationalUGShare", "tuitionPerFTE",
)
```

After each change, inspect the Plotly layout and print the tick labels:

```python
tick_text = driver.execute_script(
    "return document.getElementById('institution-map').layout.coloraxis?.colorbar?.ticktext "
    "|| document.getElementById('institution-map').data.find(t => t.marker?.colorbar)?.marker.colorbar.ticktext"
)
print("institution_map_groups", value, tick_text)
```

Assert that every metric has at least two labels and that `admitRate` returns `['<10%', '10–24%', '25–49%', '50–79%', '80%+']`.

- [ ] **Step 2: Run browser QA**

Run:

```powershell
python scripts/render_diagnostics_qa.py
```

Expected: 9 plots, all ten map metrics report grouped labels, `browser_errors []`, `mobile_overflow 0`, and `mobile_errors []`.

- [ ] **Step 3: Inspect the generated screenshot**

Open `output/playwright/enrollment-squeeze-diagnostics-full.png` and confirm the observed-change map has clearly distinct orange, neutral, and teal groups; the heading has no subtitle; and there is no coverage line below the map.

- [ ] **Step 4: Run the complete automated suite**

Run:

```powershell
node --check app.js
node --check filters.js
node --check diagnostics-core.js
node --test tests/data_contract.test.js tests/diagnostics_core.test.js tests/filter_logic.test.js
python -m pytest tests/test_ipeds_residence.py tests/test_market_diagnostics.py tests/test_institution_model_research.py -q
python -m py_compile scripts/render_diagnostics_qa.py
git diff --check
```

Expected: all three Node suites pass, 17 Python tests pass, compilation succeeds, and `git diff --check` reports no errors.

- [ ] **Step 5: Commit only after preserving the existing dirty-worktree changes**

Because the production files already contain approved uncommitted Enrollment Squeeze work, inspect `git diff` before staging. Do not create a partial commit that accidentally separates dependent prior edits. If the full project diff is ready as one unit, commit with:

```powershell
git add -- 'projects/The Enrollment Squeeze/diagnostics-core.js' 'projects/The Enrollment Squeeze/filters.js' 'projects/The Enrollment Squeeze/index.html' 'projects/The Enrollment Squeeze/styles.css' 'projects/The Enrollment Squeeze/tests/diagnostics_core.test.js' 'projects/The Enrollment Squeeze/tests/filter_logic.test.js' 'projects/The Enrollment Squeeze/tests/data_contract.test.js' 'projects/The Enrollment Squeeze/scripts/render_diagnostics_qa.py'
git commit -m "feat: group institution map measures"
```

If the broader dirty diff is not ready, leave implementation changes uncommitted and report that explicitly rather than staging only part of a dependent feature.
