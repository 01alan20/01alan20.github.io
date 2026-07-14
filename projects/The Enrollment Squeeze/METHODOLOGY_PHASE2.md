# Phase 2 methodology: county demographic cohort model

## Purpose

Estimate the size and location of the domestic high-school graduate pool for 2026, 2030, 2035 and 2041 at county level.

This phase estimates **graduates**, not college readiness or college attendance. Those are separate later layers.

## Cohort alignment

The July 2025 Census single-year age estimates are aligned to future graduating classes:

- Class of 2026: age 17 in 2025
- Class of 2030: age 13 in 2025
- Class of 2035: age 8 in 2025
- Class of 2041: age 2 in 2025

## County survival model

For each county and starting age 0–17, annual age-to-age ratios were calculated from 2020–2025:

`population(age + 1, year + 1) / population(age, year)`

County ratios are noisy, especially in small counties. Ratios are therefore estimated on the log scale and shrunk toward their corresponding state ratios. The county weight is:

`source person-years / (source person-years + 250)`

A county with little evidence is driven mainly by its state pattern. A large county receives more weight on its own observed history. Long-horizon county deviations are bounded with horizon-specific cumulative guardrails before state calibration.

## State calibration

County projections are scaled within each state so their sums equal WICHE's projected total public and private high-school graduates for each target class. This preserves credible state totals while allocating them to counties using current cohorts and recent county-specific migration/survival patterns.

## Backtest

The county allocation model was tested out of sample for one-year age transitions in 2023, 2024 and 2025. Each test uses only earlier transitions for training, and each model is calibrated to the actual state-age total before county error is measured.

| Model | WAPE | Weighted bias |
|---|---:|---:|
| No-change county share | 1.88% | 0.00% |
| Raw county ratio | 1.12% | 0.00% |
| Shrunk county/state ratio | 1.11% | -0.00% |

The shrunk model is retained only if it improves or remains competitive with the simpler alternatives. Longer-horizon uncertainty is materially larger than this one-year backtest.

## Limitations

1. Census resident population is not the same as school enrollment.
2. Private-school, homeschool, grade retention and early/late school entry are absorbed indirectly by state calibration.
3. County ratios reflect migration as well as demographic survival.
4. WICHE controls make the state totals external projections rather than purely model-generated totals.
5. 2041 is based on very young children and should be treated as a scenario, not a precise forecast.
6. County scenario bands are planning ranges, not formal statistical confidence intervals.
7. The dashboard's bundled county geometry predates some 2025 county-equivalent boundary changes; the CSV data are complete.
