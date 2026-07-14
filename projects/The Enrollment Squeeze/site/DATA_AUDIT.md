# Data Audit — The Enrollment Squeeze

## Loaded and operational

| Story layer | Current input | Status |
|---|---|---|
| National graduate outlook | WICHE projections for 2026, 2030, 2035 and 2041 | Loaded |
| County distribution | Census Vintage 2025 single-year age cohorts | Loaded; county values are allocations of state projections |
| College-entry market | Central college-going and four-year participation assumptions | Loaded as editable model assumptions |
| International context | Open Doors 2025 and Fall 2025 Snapshot | Loaded as observed indicators |
| Institution enrollment | College Scorecard annual files through 2024–25 | Loaded; UGDS and GRADS are modeled separately |
| Institution finance | Scorecard-derived April 2022 finance snapshot | Loaded, but too old for a final risk publication |
| Interactive site | Static HTML, CSS, JavaScript, bundled Plotly, local map geometry | Operational |

## Current draft interpretation

- Undergraduate and graduate history are each shown with their own balanced Scorecard panel, so changing reporting coverage is not presented as enrollment change.
- Institution projections combine a domestic market-reach proxy, damped performance relative to state-and-scope peers, a visible undergraduate nonresident-alien scenario based on `UGDS_NRA`, and a user adjustment.
- `UGDS_NRA` is undergraduate degree-seeking nonresident-alien share, not total international enrollment.
- The tuition result is gross undergraduate tuition sensitivity: projected students changed multiplied by tuition per student. One student is treated as one FTE. It is not realized net revenue or a full institutional budget forecast.
- Existing map coordinates cover the institutions shown on the map. The annual Scorecard files do not provide usable coordinates for expanding that coverage; a separate validated geographic join is required.

## Required before publishing a closure-risk ranking

The current institutional ranking is an exposure screen, not a probability of closure. A defensible resilience layer still requires the latest available institution-level data for:

- multi-year total and first-time enrollment;
- net tuition revenue and tuition dependence;
- operating revenue and operating expense;
- cash, investments and endowment;
- assets and liabilities;
- debt and interest expense;
- state appropriations for public institutions;
- retention, admissions yield and completion;
- international and graduate enrollment exposure where available.

## Recommended refresh

1. Refresh the annual Scorecard history when the next complete institution file is available.
2. Replace the April 2022 finance proxy with FY2024 IPEDS Finance.
3. Build three- and five-year enrollment trends from IPEDS Fall Enrollment.
4. Separate market exposure from financial resilience.
5. Publish closure, merger or downsizing risk only as a transparent risk class with uncertainty—not as a prediction that a named institution will close.

## Interpretation boundary

The financial-pressure output estimates gross undergraduate tuition sensitivity: projected undergraduate students changed multiplied by tuition per student. One student is treated as one FTE. It is not realized net revenue, an audited operating deficit, a liquidity forecast, or a debt-default model.
