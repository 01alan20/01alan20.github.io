# Enrollment Command Center Plan

Last updated: March 31, 2026

## Goal

Build an enrollment-only executive dashboard for a VP of Enrollment.

Phase 1 is decision-first, not model-first. The product should support executive action on class target, funnel leakage, segment growth, scholarship allocation, counselor prioritization, melt prevention, and scenario planning before any predictive ML layer is added.

This project will use:

- official public benchmark data
- synthetic student-level microdata calibrated to those benchmarks
- proxy CRM-style engagement data where public student-level enrollment CRM data does not exist

## Scope Boundary

In scope now:

- inquiry through matriculation
- class target forecasting
- funnel performance
- segment and program prioritization
- scholarship and discount tradeoffs
- deposit protection and melt monitoring
- scenario planning

Out of scope for Phase 1:

- first-term persistence
- first-year retention
- student success interventions after census
- machine learning model training

Those can be added later in a student success extension.

## Primary VP Decisions

The dashboard should answer these questions first:

1. Are we on track to hit class target?
2. Where is the funnel leaking most?
3. Which segments need more volume?
4. Which admits should get more counselor attention?
5. Which segments justify more scholarship dollars?
6. Which deposited students are most likely to melt?
7. What combination of volume, admit rate, and discounting gets us to target with acceptable margin?
8. Which programs are underperforming target and need intervention now?
9. Which incomplete applicants are still recoverable this cycle?
10. Which source channels are producing volume but not enrollments?
11. How much target gap is operational versus market-driven?

## Product Structure

The first dashboard should be organized around decisions, not analysis tabs for their own sake.

### 1. Executive Overview

Answers:

- Are we on track to hit class target?
- What is the current gap to target?
- What are the top risks and opportunities this week?

Core KPIs:

- class target
- projected class
- gap to target
- projected admits
- projected deposits
- projected melt
- projected matriculants
- projected gross tuition
- projected institutional aid
- projected net tuition revenue

### 2. Funnel Leakage

Answers:

- Where is the funnel leaking most?
- Is the problem application volume, completion, admit rate, yield, or melt?

Core KPIs:

- inquiry to application start
- application start to completion
- completion to admit
- admit to deposit
- deposit to matriculation
- velocity by stage

Primary cuts:

- student type
- geography
- program
- source channel
- income band
- aid band

### 3. Segment and Program Prioritization

Answers:

- Which segments need more volume?
- Which programs are underperforming target?
- Which source channels produce activity but not enrollment?

Core KPIs:

- segment target
- segment forecast
- application volume gap
- admit count
- deposit count
- projected matriculants
- yield rate
- net tuition per enrollee

### 4. Counselor Attention Queue

Answers:

- Which admits should get more counselor attention?
- Which incomplete applicants are still recoverable this cycle?

Phase 1 approach:

- rule-based prioritization
- no ML required yet

Example drivers:

- high academic fit
- high engagement but no deposit
- recent application completion with no contact
- low net price after aid
- campus visit or strong digital engagement
- approaching deadline with incomplete file

### 5. Scholarship Strategy

Answers:

- Which segments justify more scholarship dollars?
- Where are we over-discounting relative to expected lift?

Core KPIs:

- current discount rate
- average award
- yield by aid band
- net tuition by segment
- incremental enrollments per additional aid dollar
- discount budget remaining

### 6. Melt Watchlist

Answers:

- Which deposited students are most likely to melt?
- What operational follow-up should happen now?

Phase 1 approach:

- rule-based melt flags
- no predictive model required yet

Example drivers:

- late deposit
- no housing signal
- missing orientation RSVP
- missing FAFSA or document completion
- declining engagement after deposit
- high distance from campus

### 7. Scenario Planner

Answers:

- What combination of volume, admit rate, and discounting gets us to target with acceptable margin?
- How much of the target gap is operational versus market-driven?

Scenario levers:

- inquiry volume
- application completion rate
- admit rate
- average scholarship amount
- scholarship budget
- counselor outreach intensity
- campus visit conversion lift
- anti-melt intervention strength

## Data Strategy

### Guiding Principle

There is no public student-level enrollment CRM dataset with real counselor notes, outreach history, deposit behavior, and melt outcomes.

So the build will use:

- real institution-level benchmark data
- real public cost and outcome data
- real public admissions profile data
- synthetic student-level records generated from those distributions
- proxy engagement logic where needed

### What Will Be Real

- institution attributes
- applications, admits, enrollments, and retention benchmarks
- tuition and net price context
- cost, debt, and earnings context
- market and high school graduate trend context
- institution admissions profile ranges

### What Will Be Simulated

- student-level funnel records
- source and engagement activity
- application timing
- counselor touches
- scholarship offer testing
- deposit behavior details
- melt risk features
- scenario response by segment

### What Will Be Proxy Data

- CRM-style engagement fields adapted from existing repo assets
- behavioral calibration patterns from public learning and engagement datasets if needed later

## Source Plan

These are the primary sources we will use, verified on March 31, 2026.

| Source | Type | Use In This Project | Status |
|---|---|---|---|
| IPEDS Use The Data | Official NCES | admissions, enrollment, institutional profile, benchmark guardrails | Mandatory |
| IPEDS Data Center complete files | Official NCES | downloadable ADM, EF, HD, GR files for batch prep | Mandatory |
| College Scorecard data | Official U.S. Department of Education | tuition, net price, debt, earnings, institution characteristics | Mandatory |
| College Scorecard API/docs | Official U.S. Department of Education | field selection and later institution drilldown enrichment | Optional now |
| Common Data Set initiative and institution CDS reports | Official/Institutional | GPA, SAT/ACT bands, class profile, admissions profile realism | Mandatory |
| Census Bureau data | Official U.S. Census Bureau | geography, household income, regional market realism | Recommended |
| NCES Projections of Education Statistics | Official NCES | high school graduate trends, state and regional demand context | Recommended |
| Existing repo synthetic funnel and scholarship data/scripts | Local repo assets | accelerate MVP build and reuse existing higher-ed logic | Mandatory |
| Existing repo CRM engagement translation | Local proxy asset | counselor attention and melt-style engagement logic | Recommended |
| OULAD | Official open dataset | later behavioral calibration if the project expands to persistence/retention | Deferred |

## Official Source Links

- IPEDS Use The Data: https://nces.ed.gov/ipeds/use-the-data
- IPEDS Data Center complete files: https://nces.ed.gov/ipeds/datacenter/DataFiles.aspx
- College Scorecard data: https://collegescorecard.ed.gov/data/
- College Scorecard API: https://collegescorecard.ed.gov/data/api/
- Census Bureau data portal: https://www.census.gov/data.html
- NCES Projections of Education Statistics: https://nces.ed.gov/programs/projections/
- Common Data Set initiative: https://commondataset.org/
- OULAD: https://analyse.kmi.open.ac.uk/open-dataset

## Recommended Data Use By Question

| Decision Question | Primary Data Source | Phase 1 Method |
|---|---|---|
| Are we on track to hit class target? | synthetic funnel + IPEDS guardrails | deterministic forecast |
| Where is the funnel leaking most? | synthetic funnel | stage conversion analysis |
| Which segments need more volume? | synthetic funnel + Census/NCES context | segment gap analysis |
| Which admits should get more counselor attention? | synthetic funnel + CRM proxy fields | rule-based prioritization |
| Which segments justify more scholarship dollars? | scholarship scenarios + Scorecard context | elasticity-style scenario logic |
| Which deposited students are most likely to melt? | synthetic deposit/melt flags + CRM proxy | rule-based watchlist |
| What combination of volume, admit rate, and discounting gets us to target with acceptable margin? | scenario engine + Scorecard pricing context | scenario planner |
| Which programs are underperforming target and need intervention now? | synthetic funnel + program targets | target vs forecast |
| Which incomplete applicants are still recoverable this cycle? | synthetic application file logic | recoverability rules |
| Which source channels are producing volume but not enrollments? | synthetic source channel assignments | volume vs enrollment efficiency |
| How much target gap is operational versus market-driven? | scenario engine + NCES/Census market context | gap decomposition |

## Repo Build Plan

Project folder:

- `projects/enrollment-command-center/`

Expected files:

- `projects/enrollment-command-center/PLAN.md`
- `projects/enrollment-command-center/data/institution_profile.csv`
- `projects/enrollment-command-center/data/student_funnel_synthetic.csv`
- `projects/enrollment-command-center/data/segment_summary.csv`
- `projects/enrollment-command-center/data/scenario_outputs.csv`
- `projects/enrollment-command-center/index.html`
- `projects/enrollment-command-center/dashboard.css`
- `projects/enrollment-command-center/dashboard.js`

Existing repo assets to reuse:

- `scripts/prepare_higher_ed_project_data.py`
- `scripts/prepare_scholarship_studentlevel.py`
- `projects/enrollment-funnel-benchmark/`
- `projects/scholarship-optimization/`
- `projects/crm-engagement-analytics/`

## Phase Plan

### Phase 0: Planning and Data Assembly

Deliverables:

- confirm project scope is enrollment-only
- choose default institution archetype
- pull public benchmark inputs
- define student segment taxonomy
- define synthetic data generation rules

### Phase 1: Decision-First MVP

Deliverables:

- executive overview
- funnel leakage page
- segment/program/source performance page
- counselor attention queue
- scholarship strategy page
- melt watchlist
- scenario planner

Method:

- deterministic calculations
- segment rules
- scenario levers
- no predictive models yet

### Phase 2: Prescriptive Logic Upgrade

Deliverables:

- stronger prioritization rules
- scholarship frontier and budget logic
- target-gap decomposition
- cleaner executive narrative and action recommendations

### Phase 3: Model Layer

Deliverables:

- application propensity model
- yield model
- melt model
- calibrated probabilities
- optimization layer for scholarships

Models are intentionally deferred until the dashboard already supports real decisions.

## Initial Business Rules

These assumptions should be transparent in both code and documentation:

- higher aid improves yield, but with diminishing returns
- late deposits increase melt risk
- higher engagement improves application completion and yield
- campus visits improve yield more than low-touch channels
- greater net price burden reduces yield
- some source channels create volume but weak conversion quality
- some target gap is operational and some is driven by market demand
- program demand varies by geography and price sensitivity

## Open Choices Before Build

These are the only major choices still needed before implementation:

1. Default institution archetype.
   Recommendation: regional private nonprofit 4-year university.
2. Default class target.
   Recommendation: use a round target such as 1,800 to 2,500 matriculants for the first version.
3. Default segment strategy.
   Recommendation: segment by student type, program, geography, income band, and price sensitivity.
4. Visual style.
   Recommendation: build as one unified executive dashboard instead of combining separate project pages.

## Next Build Step

After this plan is approved, the next concrete step is:

1. create the synthetic institution and student funnel schema
2. generate the first calibrated dataset
3. build the decision-first dashboard shell
