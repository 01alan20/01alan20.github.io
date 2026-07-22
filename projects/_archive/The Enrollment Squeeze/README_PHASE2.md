# The Future Freshman Map

## Historical cumulative build: Phase 2

This phase added a county-level demographic cohort model to the Phase 1 state analysis. It is retained as historical methodology; the current public project is documented in `README.md`.

## Added in Phase 2

- Census county population by single year of age, 2020–2025
- County demographic pipeline snapshots for elementary-, middle-, and high-school-age populations
- Historical county age-to-age survival ratios
- Empirical shrinkage toward state transition ratios
- County graduate-pool estimates for 2026, 2030, 2035, and 2041
- State calibration checks against WICHE
- Rolling out-of-sample county backtests
- Reproducible Phase 2 build script

## Important interpretation

This phase estimated the future high-school graduate pool. It did not estimate:

- academic college readiness;
- immediate college-going probability;
- two-year versus four-year entry;
- interstate mobility; or
- institution-specific recruitment exposure.

## County backtest headline

- No-change WAPE: 1.88%
- Raw county ratio WAPE: 1.12%
- Shrunk county/state WAPE: 1.11%

## Historical folder guide

- `data/phase1/` — state-level outputs
- `data/phase2/` — county panels, projections, and validation
- `sources/raw/` — source files retained for reproducibility
- `scripts/` — reproducible build code
- `METHODOLOGY_PHASE2.md` — assumptions, model, and limitations

Interactive state and county HTML dashboards were historical build outputs and are not retained in the current repository.

## Historical next phase

The proposed next step was a readiness layer using local assessment, graduation, and absence evidence calibrated by state NAEP, with explicit observed and modeled flags. Readiness was intended to remain separate from the demographic projection.
