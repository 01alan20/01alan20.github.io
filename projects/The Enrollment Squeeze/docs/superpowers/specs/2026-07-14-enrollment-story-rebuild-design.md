# Enrollment Story Rebuild Design

## Objective

Make the site demonstrate a single causal story: a smaller domestic undergraduate pipeline produces uneven state and county markets; institutions begin from different observed competitive positions; international undergraduate exposure can amplify or offset pressure; enrollment movement becomes tuition sensitivity.

## Narrative

1. Show one 2026-to-2041 pipeline: projected high-school graduates, immediate college entrants, and likely four-year entrants. The latter two are transparent conversions, not three independent forecasts.
2. Show observed undergraduate and graduate histories from a balanced College Scorecard panel so changing reporting coverage does not masquerade as enrollment change.
3. Show state and county change, not merely county size.
4. Explain an institution forecast with four visible components: domestic market baseline, damped peer-relative performance, international undergraduate scenario, and a user adjustment.
5. Translate a selected institution's projected undergraduate change into annual tuition sensitivity without presenting it as audited revenue or closure risk.

## Institution Forecast

For each institution and projection year:

```text
Projected UG change = domestic market baseline
                    + damped peer-relative performance
                    + international undergraduate scenario
                    + user adjustment
```

- Domestic market baseline is the existing state/national weighted market-reach proxy. It is never described as observed recruitment geography.
- Peer-relative performance is the institution's historical UG CAGR minus its state-and-scope peer median. Its influence fades with projection horizon and is regularized to prevent outlier extrapolation.
- Selectivity is a peer-group descriptor. Observed admission-rate bands are <10%, 10-24%, 25-49%, 50-79%, and 80%+. Missing admission rates are explicitly assigned to the 80%+ scenario category.
- International exposure uses Scorecard `UGDS_NRA`: the share of undergraduate degree-seeking students who are non-resident aliens. It is not relabeled as all international enrollment.
- The policy shock applies in 2026-27. Recovery starts in 2028. The initial shock uses a cohort-adjusted interpretation of the Fall 2025 new-student decline, rather than applying a new-student flow decline to every currently enrolled nonresident undergraduate at once.
- Recovery choices are smaller return, return to the institution's 2018-20 median nonresident share, and larger return above that benchmark. The international term is visible in the institution calculation.

## Data and Coverage

- Keep the raw national Scorecard series as context, but headline a balanced panel containing the institutions observed in both 2015-16 and 2024-25.
- Retain the existing map-coordinate coverage and show its count. The annual Scorecard files do not provide usable coordinates for this build, so expanding map coverage requires a separately sourced and validated geographic join.
- Add current `UGDS_NRA`, `PPTUG_EF`, `UG25ABV`, admission rate, retention, and in-/out-of-state tuition inputs to institution detail records when available.

## Visuals

- Replace the repeated national scrolly endpoint with a 2026 vs 2041 pipeline comparison.
- Retain separate UG and graduate trend charts, labeled as a balanced-panel history.
- Add a state-map legend and use county dumbbells comparing 2026 with the selected year.
- Replace any opaque institution calculation with a selected-institution decomposition/waterfall and a compact current-to-projected UG comparison.
- Retain the national tuition-pressure comparison and table, while positioning the selected-institution scenario as the primary decision tool.

## Guardrails

- No closure probabilities.
- Tuition is gross undergraduate tuition sensitivity, not realized net revenue or a complete budget forecast.
- International scenarios are scenarios, not claims that a named institution will lose the modeled number of students.
