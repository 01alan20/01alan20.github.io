# The Enrollment Squeeze

An interactive, static data story about the contraction of the traditional U.S. college pipeline and how institutions have moved differently within that market.

The published page combines national enrollment history, projected high-school graduates, state and county entrant scenarios, observed institution enrollment performance, international context, and transparent tuition-sensitivity examples.

## What the public page does

- Traces projected high-school graduates into likely college and four-year entrants under explicit participation assumptions.
- Compares percentage and absolute changes across states and counties.
- Shows the participation increase required to maintain each state's 2026 entrant pool.
- Compares observed institution enrollment change from 2015–16 through 2024–25 with state and peer context.
- Maps observed institution size, admissions, retention, student mix, and first-time student residence.
- Translates defined 5%, 10%, and 20% undergraduate enrollment losses into gross tuition-revenue sensitivity.

The institution map is descriptive. It does not publish an institution-level enrollment forecast, risk score, closure prediction, or measured recruitment catchment.

## Run locally

From the repository root:

```powershell
python -m http.server 8765
```

Then open:

```text
http://127.0.0.1:8765/projects/The%20Enrollment%20Squeeze/index.html
```

No build step is required for the published page.

## Repository layout

- `index.html`, `styles.css`, `app.js` — narrative structure and national/state/county views.
- `filters.js`, `diagnostics-core.js`, `filters-core.js` — institution explorer, grouped map measures, profiles, and finance scenarios.
- `assets/plotly.min.js` — local charting dependency for GitHub Pages.
- `data/*.json` — compact files loaded directly by the page.
- `data/phase1/`, `data/phase2/`, `data/phase3/` — supporting demographic projections and validation outputs.
- `data/research/` — research-only institution-model backtest results; these do not drive the public forecast.
- `sources/` — WICHE, Census, and other source material retained for reproducibility.
- `scripts/` — data preparation, diagnostics, research, and browser-QA utilities.
- `tests/` — JavaScript data contracts and Python model/data tests.

Historical phase 4–5 files remain for provenance but are not loaded by the current public page.

## Rebuild the compact institution artifacts

```powershell
cd "projects/The Enrollment Squeeze"
python scripts/build_scorecard_history.py
python scripts/build_market_diagnostics.py
```

The first command refreshes the institution history and current institution records from `data/scorecard_compact.json`. The second rebuilds the observed state and institution diagnostics, including the compact Fall 2024 IPEDS residence measures.

## Verification

```powershell
node --check app.js
node --check filters.js
node --check diagnostics-core.js
node --test tests/data_contract.test.js tests/diagnostics_core.test.js tests/filter_logic.test.js
python -m pytest tests/test_ipeds_residence.py tests/test_market_diagnostics.py tests/test_institution_model_research.py -q
python scripts/render_diagnostics_qa.py
```

The browser QA script exercises the filters and scenarios, checks desktop and mobile errors, and creates a local full-page screenshot under `output/playwright/`. That screenshot is generated and is not part of the repository package.

## Data sources

- WICHE high-school graduate projections.
- U.S. Census Bureau county age estimates.
- U.S. Department of Education College Scorecard.
- NCES IPEDS Fall Enrollment residence data.
- IIE Open Doors and U.S. Department of State international context.

See `data/README.md`, the phase methodology files, and `sources/source_manifest.csv` for artifact-level notes.

## Important limitations

- College-going and four-year attendance rates are scenarios, not separate demographic forecasts.
- First-time residence shares describe the observed entering class; they do not establish an institution's future recruitment reach.
- `UGDS_NRA` is an undergraduate nonresident-alien stock measure, not new international intake.
- Institution outcomes are observed associations and do not establish causation.
- Tuition results are gross sensitivity estimates, not complete budget forecasts or immediately avoidable costs.
