# The Future College Market

## Current cumulative build: Phases 1–5

This package now contains the original demographic work plus a simplified higher-education market and finance model.

## Headline central scenario

- 2026 estimated four-year entrants: **1,610,658**
- 2041 estimated four-year entrants: **1,433,268**
- National change by 2041: **-11.0%**
- Institutions modeled for market exposure: **1,849**
- Institutions with observed finance proxies: **1,430**

## What is new

- State and county estimates of likely college and four-year entrants
- State comparison of future local demand against current four-year undergraduate scale
- Institution-level 2030, 2035 and 2041 market exposure
- Gross undergraduate tuition-sensitivity scenarios based on projected student change
- Interactive dashboard
- Scenario financial-model workbook

## Largest projected state graduate-pool contractions by 2041

- Hawaii: -31.2%
- Illinois: -28.7%
- California: -27.3%
- New York: -25.0%
- Wyoming: -24.8%
- West Virginia: -22.8%
- New Mexico: -22.8%
- Oregon: -22.3%
- Mississippi: -19.9%
- Alaska: -19.2%

## Largest modeled annual institution gaps in 2035

These figures are scenario proxies and should not be treated as official institutional deficits.

- New York University (NY): $46,594,448
- Syracuse University (NY): $31,233,852
- Excelsior College (NY): $27,717,072
- DePaul University (IL): $25,861,130
- Temple University (PA): $25,536,979
- University of California-Berkeley (CA): $23,943,085
- Drexel University (PA): $22,528,715
- University of Southern California (CA): $22,274,944
- University of Michigan-Ann Arbor (MI): $21,606,741
- Michigan State University (MI): $20,868,897

## Folder guide

- `data/phase1/` — state demographic projections and early validation
- `data/phase2/` — county demographic allocations
- `data/phase3/` — college-going and four-year entrant market estimates
- `data/phase4/` — institutional market exposure
- `data/phase5/` — financial-pressure proxy
- `dashboards/` — interactive HTML dashboards
- `financial_model/` — editable Excel scenario model
- `sources/` — source files and manifests
- `scripts/` — reproducible build scripts

## Critical limitation

Institution enrollment now uses annual College Scorecard files through 2024–25. `UGDS` is undergraduate enrollment and `GRADS` is graduate enrollment; finance proxies remain from an April 2022 processed file. The WICHE and Census demographic sources are more current. See `METHODOLOGY_PHASE3_5.md`.

## Current draft model

The live draft uses annual College Scorecard files through 2024-25. `UGDS` is undergraduate enrollment and `GRADS` is graduate enrollment; each history chart uses its own balanced panel to prevent reporting changes from being presented as enrollment change. Institution projections combine a domestic market-reach proxy, damped peer-relative performance, an undergraduate nonresident-alien scenario using `UGDS_NRA`, and a visible user adjustment. Tuition results are gross undergraduate tuition sensitivity, not realized net revenue.

## GitHub site

The current GitHub Pages build is stored in `site/`. It includes the complete narrative scaffold, interactive state and institution maps, county explorer, scenario controls and transparency documentation.

The institutional exposure layer is operational. The final financial-resilience / closure-risk layer still requires FY2024 IPEDS finance inputs and additional institution-level recruitment geography.
