# Enrollment Strategy Dashboard Sources

Last verified: March 31, 2026

## Purpose

This file records the public source pack used to anchor the Enrollment Strategy Dashboard.

The dashboard is intentionally built from a mixed data strategy:

- official public benchmark data for institution-level realism
- institutional Common Data Set materials for admissions profile realism
- synthetic student-level records for pipeline operations, counselor activity, deposit behavior, and melt monitoring

There is no public student-level CRM dataset that contains real inquiries, counselor interactions, aid offers, deposits, and melt outcomes at the individual level. Those records are simulated by design.

## Verified Official Sources

### 1. IPEDS

Primary use:

- institution profile
- applications
- admits
- enrollments
- admissions and enrollment benchmark guardrails

Official pages:

- IPEDS homepage: https://nces.ed.gov/ipeds
- Use The Data: https://nces.ed.gov/ipeds/use-the-data
- Data Center complete files: https://nces.ed.gov/ipeds/datacenter/DataFiles.aspx

Why it matters:

- `ADM` provides applications and admissions counts
- `EF` provides fall enrollment context
- `HD` provides institutional descriptors
- `GR` and related surveys can support later progression or board-style benchmarking

Current verification notes:

- NCES IPEDS shows a latest release dated January 6, 2026 on the IPEDS homepage.
- The IPEDS Data Center currently lists `Admissions (ADM)` as available for `2024-25`, with final releases through `2023-24`.
- The IPEDS Data Center currently lists `Fall Enrollment (EF)` as available for `2024`, with final releases through `2023`.

### 2. College Scorecard

Primary use:

- tuition context
- net price context
- debt and earnings context
- institutional cost and value realism

Official pages:

- Data download: https://collegescorecard.ed.gov/data/
- API documentation: https://collegescorecard.ed.gov/data/api/
- Institution-level data documentation: https://collegescorecard.ed.gov/files/InstitutionDataDocumentation.pdf

Why it matters:

- provides official U.S. Department of Education institution-level cost and outcome fields
- supports sticker price, net price, and revenue framing in the dashboard
- enables later institution drilldown and peer benchmarking

### 3. Common Data Set

Primary use:

- GPA bands
- SAT and ACT ranges
- admit profile assumptions
- class composition realism

Official page:

- Common Data Set initiative: https://commondataset.org/

Why it matters:

- gives standardized institutional admissions profile tables
- helps make the synthetic applicant pool look like a real admissions market instead of random numbers

Implementation note:

- the initiative page is the standard anchor, but the actual usable admissions profile details come from institution-published CDS files
- in practice, we should use 3 to 5 peer institutions as reference examples

### 4. Census Bureau

Primary use:

- geography weighting
- household income context
- regional population realism
- market segmentation inputs

Official pages:

- Census data portal: https://www.census.gov/data/
- Explore Census Data: https://data.census.gov/

Why it matters:

- supports geography and income distributions used in synthetic student generation
- supports later market-sizing and feeder-territory framing

### 5. NCES Projections of Education Statistics

Primary use:

- high school graduate trend context
- state and regional market pressure context
- demand-side framing for market-driven gaps

Official page:

- Projections of Education Statistics: https://nces.ed.gov/programs/pes/

Why it matters:

- supports the distinction between operational underperformance and market contraction
- gives defensible context for future demand, especially if scenario logic later includes shrinking student pools

### 6. OULAD

Primary use:

- deferred for later retention and behavioral calibration

Official page:

- Open University Learning Analytics Dataset: https://analyse.kmi.open.ac.uk/open-dataset

Why it matters:

- useful when the project expands beyond enrollment into persistence and first-year success
- not required for the enrollment-only MVP

## What Is Real vs Simulated

### Real or directly anchored to official sources

- institution type and market context
- tuition and pricing context
- broad admissions and enrollment benchmark rates
- admissions profile ranges
- public market and demographic context

### Simulated in this project

- student-level inquiries
- application starts and completions
- source-channel engagement behavior
- counselor attention flags
- scholarship offer amounts at student level
- deposit behavior
- melt watchlist drivers
- scenario responses by segment

## Minimum Source Pack for This Build

The minimum source pack for the current dashboard build is:

1. IPEDS admissions and enrollment benchmark references
2. College Scorecard tuition and net price context
3. Common Data Set admissions profile references
4. Census and NCES context for geography and market framing

That is enough to make the flagship dashboard defensible before adding a deeper model layer.

## Current Project Position

The current version of the Enrollment Strategy Dashboard uses:

- a synthetic active-cycle funnel generated from existing higher-ed portfolio assets
- project-specific data preparation logic in `scripts/prepare_enrollment_strategy_dashboard.py`
- official public source anchors documented here and in `PLAN.md`

The next source upgrade after MVP should be:

1. select a real peer set or archetype institution group
2. import a small benchmark seed from IPEDS and Scorecard
3. calibrate class target, program mix, and pricing assumptions against that seed
