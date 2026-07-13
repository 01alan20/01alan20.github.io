# The Future Freshman Map — Phase 1

## What is complete

- Extracted WICHE historical grade enrollment and graduate projections from 2009–2041.
- Calculated historical grade-to-grade survival ratios for all 50 states and Washington, DC.
- Ran a rolling backtest comparing no-change progression, five-year median survival ratios, and all-history median ratios.
- Created state projections for the classes of 2026, 2030, 2035 and 2041.
- Built interactive national maps and a national trend chart.
- Downloaded the Census Vintage 2025 county-age source file for the county build.

## Backtest result

- Naive WAPE: 2.37%
- Five-year median survival WAPE: 0.89%
- All-history median survival WAPE: 1.04%

The five-year median approach clearly improves the one-year state-level progression forecast. County ratios will be noisier and must be shrunk toward state estimates.

## National graduate pool

| Class | Projected graduates | Change from 2026 |
|---|---:|---:|
| 2026 | 3,847,113 | Baseline |
| 2030 | 3,661,059 | -4.8% |
| 2035 | 3,664,764 | -4.7% |
| 2041 | 3,423,411 | -11.0% |

## Largest projected contractions by 2041

- Hawaii: -31.2% (-4,347)
- Illinois: -28.7% (-39,838)
- California: -27.3% (-127,424)
- New York: -25.0% (-50,122)
- Wyoming: -24.8% (-1,550)
- West Virginia: -22.8% (-3,964)
- New Mexico: -22.8% (-5,058)
- Oregon: -22.3% (-9,567)

## States projected to grow most by 2041

- Tennessee: +8.7% (+6,520)
- Idaho: +7.7% (+1,849)
- South Carolina: +5.0% (+2,945)
- District of Columbia: +3.8% (+277)
- Florida: +3.7% (+8,764)
- Delaware: +2.4% (+280)
- Texas: +1.0% (+3,971)
- North Carolina: +1.0% (+1,168)

## Important limitation

The maps currently show projected high school graduates, not college-ready or college-going students. Readiness, college-going behavior, interstate mobility and institution-specific exposure remain separate model layers.

## Next build

1. Aggregate school-level CCD membership to county, grade and year.
2. Calculate county survival ratios.
3. Shrink unstable county estimates toward state ratios.
4. Backtest 3-, 5- and 10-year horizons.
5. Reconcile county sums with WICHE state totals.
6. Add readiness only after demographic validation.

## Sources

- https://www.wiche.edu/knocking/data/
- https://nces.ed.gov/ccd/
- https://www.census.gov/data/tables/time-series/demo/popest/2020s-counties-detail.html
- https://educationdata.urban.org/documentation/
