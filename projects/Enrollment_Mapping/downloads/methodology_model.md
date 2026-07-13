# Methodology — Phases 3–5

## Scope

This build estimates future higher-education market demand and a simplified institutional financial-pressure scenario. It deliberately replaces the more complicated county-by-grade school survival model with a transparent market model.

## Phase 3: market demand

WICHE projected high-school graduates are the demographic control totals for 2026, 2030, 2035 and 2041. County allocations come from the Phase 2 Census age-cohort model.

Central assumptions:

- Immediate college-going rate: **62.8%**
- Four-year share of enrolled recent high-school graduates: **66.7%**
- Low scenario: 57.8% college-going and 61.7% four-year share
- High scenario: 67.8% college-going and 71.7% four-year share

Formula:

`Likely four-year entrants = projected high-school graduates × college-going rate × four-year share`

The national assumptions are applied uniformly across states and counties. Therefore, the percentage change in estimated entrants is driven by the graduate projection. The scenario adds interpretable market size, not state-specific behavioral precision.

## Current enrollment and local-pool coverage

March 2024 College Scorecard elements provide undergraduate enrollment for public and private nonprofit bachelor's-degree institutions. A rough annual capacity proxy divides current undergraduate enrollment by 4.25. This is not actual freshman enrollment and includes transfer, adult, international and other students.

`Local pool coverage proxy = likely local four-year entrants / annualized undergraduate capacity proxy`

A value below 1.0 indicates that the current institutional footprint cannot be supported solely by the modeled local immediate four-year entrant pool. This can be normal for states that import students or enroll many transfer/adult learners.

## Phase 4: institutional exposure

Institutional recruitment scope is a heuristic:

- National: admission rate <=35% or undergraduate enrollment >=25,000
- Statewide: enrollment >=8,000, or public enrollment >=5,000
- Regional: all other included institutions

State weights are 25%, 60%, and 85%, respectively. The remaining weight is assigned to the national graduate market.

`Blended market change = state weight × state graduate change + national weight × national graduate change`

The base model holds institutional market share constant. It does not model reputation changes, program mix, pricing, recruitment investment, international enrollment, closures, mergers or competitors' actions.

## Phase 5: financial pressure

The finance proxy uses April 2022 Scorecard-derived `tuition_revenue_per_fte` and `instructional_expenditure_per_fte`, joined to March 2024 undergraduate enrollment where available.

Assumptions:

- Undergraduate headcount-to-FTE factor: 85%
- Adjustable share of instructional expenditure: 30%

`Tuition revenue change = change in modeled FTE × net tuition revenue per FTE`

`Adjustable instructional expense change = change in modeled FTE × instructional expenditure per FTE × variable share`

`Net operating impact proxy = tuition revenue change − adjustable expense change`

`Funding gap proxy = max(0, −net operating impact proxy)`

This is not total revenue or expense. It excludes appropriations, gifts, grants, auxiliary operations, hospitals, debt service, investment returns, graduate enrollment and many fixed costs. It should be used to compare exposure, not as an official budget requirement.

## Data vintage limitation

The official College Scorecard was updated June 10, 2026, but this build uses a March 2024 Scorecard elements snapshot for enrollment and an April 2022 processed Scorecard snapshot for per-FTE finance because those were the machine-readable files available to this build environment. The dashboard and files state those vintages explicitly.
