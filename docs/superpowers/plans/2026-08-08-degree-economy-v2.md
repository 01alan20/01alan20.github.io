# Are Degrees Keeping Up v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete five-act vanilla HTML/CSS/JavaScript editorial story in `projects/the-degree-economy/v2`, backed by downloaded primary datasets and preserving the existing v1 site.

**Architecture:** Keep v2 independent from v1 at the presentation layer, with a generated `v2/data/story_data.js` bundle containing normalized IPEDS, NY Fed, BLS, WEF, Strada, and institution-example evidence. Render every chart from that bundle with accessible SVG and native controls. Add a Python data-build and validation layer so the story cannot silently publish unharmonized degree fields or mixed-year claims.

**Tech Stack:** Vanilla HTML, CSS, JavaScript, inline SVG, Python standard library plus existing project dependencies, pytest.

---

### Task 1: Establish the v2 data contract and source manifest

**Files:**
- Create: `projects/the-degree-economy/v2/data/README.md`
- Create: `projects/the-degree-economy/v2/data/source_manifest.json`
- Create: `projects/the-degree-economy/tests/test_degree_economy_v2.py`

- [ ] Write failing tests for the v2 directory, required source groups, five-act anchors, and exact editorial endpoint values.
- [ ] Run `pytest projects/the-degree-economy/tests/test_degree_economy_v2.py -q` and confirm it fails because v2 is not built.
- [ ] Add the manifest documenting official download URLs, release periods, definitions, and local output names.
- [ ] Run the focused tests again and confirm the contract is explicit before implementation.

### Task 2: Download and normalize primary data

**Files:**
- Create: `projects/the-degree-economy/v2/scripts/build_story_data.py`
- Create: `projects/the-degree-economy/v2/data/raw/` downloaded source files
- Create: `projects/the-degree-economy/v2/data/derived/story_data.js`
- Modify: `projects/the-degree-economy/v2/data/README.md`

- [ ] Download the NCES CIP 2010-to-2020 crosswalk and retain only official mappings needed for bachelor-level CIP aggregation.
- [ ] Rebuild 2014 IPEDS bachelor awards into CIP 2020 comparable fields, aggregate ambiguous mappings at the highest clean level, and record exclusions in metadata.
- [ ] Download current NY Fed quarterly and annual major files; preserve 2014-to-2024 major data separately from the latest quarterly national endpoint.
- [ ] Download BLS Table 5.2, detailed 2024-to-2034 projections, and Table 6.2 skills data; normalize all values and retain exact source labels.
- [ ] Add WEF 39% and Strada 73%, 44%, and 37% evidence as cited editorial records with association wording.
- [ ] Reuse validated institution links already present in v1.
- [ ] Validate counts, endpoint values, year labels, and crosswalk status before writing the JavaScript bundle.

### Task 3: Build the five-act editorial page

**Files:**
- Create: `projects/the-degree-economy/v2/index.html`
- Create: `projects/the-degree-economy/v2/app.js`
- Create: `projects/the-degree-economy/v2/styles.css`

- [ ] Implement the hero and compact five-part scroll navigation.
- [ ] Implement Act 1 production trend, harmonized field movement, and searchable field explorer.
- [ ] Implement Act 2 national NY Fed line chart, annual major scatterplot, search, selection, tooltip, and mobile tap state.
- [ ] Implement Act 3 education-level BLS comparison and jobs-added/growth-rate occupation explorer.
- [ ] Implement Act 4 WEF callout and BLS occupation skills matrix with an occupation selector.
- [ ] Implement Act 5 three editorial pillars, Strada evidence, institutional examples, conclusion, and source methodology.
- [ ] Keep College Scorecard out of the main narrative and place any supplementary explorer only after the source section if data remain valid.

### Task 4: Validate behavior and responsive layout

**Files:**
- Modify: `projects/the-degree-economy/tests/test_degree_economy_v2.py`
- Create: `projects/the-degree-economy/v2/README.md`

- [ ] Run data and HTML contract tests.
- [ ] Check 1440, 1200, 1024, 768, 430, and 390 pixel layouts with a local browser harness where available.
- [ ] Confirm keyboard focus, labels, tap interactions, no horizontal overflow, and visible source lines.
- [ ] Confirm no em dashes, no mixed-year labels, no CIP codes in visible copy, and no causal claims for observational evidence.
- [ ] Run the complete existing test suite and verify v1 remains unchanged.

