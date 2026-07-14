# The Future Freshman Map

## Current cumulative build: Phase 2

This zip contains every Phase 1 output plus the new county-level demographic cohort model and raw source files used so far.

## New in Phase 2

- Census county population by single year of age, 2020–2025
- County demographic pipeline snapshot for elementary-, middle- and high-school-age populations
- Historical county age-to-age survival ratios
- Empirical shrinkage toward state transition ratios
- County graduate-pool estimates for 2026, 2030, 2035 and 2041
- State calibration checks against WICHE
- Rolling out-of-sample county backtests
- Interactive county maps and county change tables
- Reproducible Phase 2 build script

## Important interpretation

The current model estimates the **future high-school graduate pool**. It does not yet estimate:

- academic college readiness;
- immediate college-going probability;
- two-year versus four-year entry;
- interstate mobility;
- institution-specific recruitment exposure.

## County backtest headline

- No-change WAPE: 1.88%
- Raw county ratio WAPE: 1.12%
- Shrunk county/state WAPE: 1.11%

## Folder guide

- `data/phase1/` — previous state-level outputs
- `data/phase2/` — county panels, projections and validation
- `dashboards/` — interactive state and county HTML dashboards
- `sources/raw/` — raw source files retained in the cumulative package
- `scripts/` — reproducible build code
- `METHODOLOGY_PHASE2.md` — assumptions, model and limitations

## Next phase

Add the readiness layer using local assessment/graduation/absence evidence, calibrated by state NAEP, with explicit observed/modelled flags. Readiness should remain separate from the demographic projection.
