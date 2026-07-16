# Preparing to Compete Closing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the story to `The Enrollment Squeeze: Preparing to Compete` and replace its closing section with the approved competition narrative.

**Architecture:** Make a content-only change in the existing static page and protect it with the existing Node data-contract test. Reuse the current hero and ending components without adding JavaScript, CSS, or new runtime assets.

**Tech Stack:** Static HTML, Node.js built-in test runner, Python pytest, Selenium rendered-page QA

---

### Task 1: Add the closing-copy contract

**Files:**
- Modify: `projects/The Enrollment Squeeze/tests/data_contract.test.js`

- [ ] **Step 1: Write the failing assertions**

Add these assertions near the existing ending-copy checks:

```javascript
assert.match(indexHtml, /<title>The Enrollment Squeeze: Preparing to Compete<\/title>/);
assert.match(indexHtml, /Institutions will compete on brand, value, outcomes, and student experience/);
assert.match(indexHtml, /widen their admissions pools beyond their traditional geographic and demographic reach/);
assert.match(indexHtml, /both domestically and internationally/);
assert.match(indexHtml, /continuing trend toward urbanization/);
assert.equal(indexHtml.includes('The pool sets the constraint. Competition and revenue models determine the consequence.'), false);
assert.equal(indexHtml.includes('—'), false, 'page copy must not contain em dashes');
```

- [ ] **Step 2: Run the contract test and confirm failure**

Run:

```powershell
node --test tests/data_contract.test.js
```

Expected: FAIL because the new title and closing copy are not yet present.

### Task 2: Implement the approved title and closing

**Files:**
- Modify: `projects/The Enrollment Squeeze/index.html`

- [ ] **Step 1: Update the document and hero titles**

Set the browser title to:

```html
<title>The Enrollment Squeeze: Preparing to Compete</title>
```

Set the hero heading to:

```html
<h1>The Enrollment Squeeze:<br><span>Preparing to Compete</span></h1>
```

Keep the navigation brand and footer attribution as `The Enrollment Squeeze`.

- [ ] **Step 2: Replace the ending section**

Retain `<section class="ending">` and `<div class="prose wide">`. Replace the old heading, lead, and callout with the approved heading and seven paragraphs from the specification. Use no em dashes.

- [ ] **Step 3: Run the contract test and confirm success**

Run:

```powershell
node --test tests/data_contract.test.js
```

Expected: PASS with `Scorecard data contract tests passed`.

### Task 3: Verify the complete project

**Files:**
- Verify: `projects/The Enrollment Squeeze/index.html`
- Verify: `projects/The Enrollment Squeeze/tests/data_contract.test.js`

- [ ] **Step 1: Run syntax and automated tests**

Run:

```powershell
node --check app.js
node --check filters.js
node --check diagnostics-core.js
node --test tests/data_contract.test.js tests/diagnostics_core.test.js tests/filter_logic.test.js
python -m pytest tests/test_ipeds_residence.py tests/test_market_diagnostics.py tests/test_institution_model_research.py -q
```

Expected: three Node test suites pass and 17 Python tests pass.

- [ ] **Step 2: Run rendered-page QA**

Serve the repository root on port 8765, then run:

```powershell
python scripts/render_diagnostics_qa.py
```

Expected: nine plots, no browser errors, no mobile errors, and zero mobile overflow.

- [ ] **Step 3: Remove the regenerable QA screenshot and inspect the diff**

Remove only `output/playwright/enrollment-squeeze-diagnostics-full.png`, confirm `git diff --check` has no errors, and verify that the final diff contains the approved title and closing copy.

- [ ] **Step 4: Leave the implementation uncommitted**

Do not create a separate implementation commit because the two modified production files already contain related approved changes. Leave them in the working tree for the user's consolidated project commit.
