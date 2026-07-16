# Enrollment Squeeze Market Diagnostics Rebuild

## Objective

Rebuild the public story around the mechanism of enrollment pressure rather than only the demographic trend:

1. Student supply determines the size of the potential entrant pool.
2. Participation determines how many prospective students enter higher education.
3. Competition determines where those students enroll.
4. Institutional revenue models determine the consequence of students not enrolling.

The public experience must distinguish observed measures, transparent counterfactuals, and projections. It must not publish a synthetic institutional risk score or promote the expanded institution forecast that failed to outperform the state-market baseline in held-out testing.

## Public Story Structure

### Opening

Reduce the hero from a full viewport to approximately 72–75vh on desktop. Increase the title and opening claim, keep the three headline statistics in the initial viewport, and remove the inactive scrollytelling height. The first analytical chart follows immediately after the opening claim.

### Part I — The pool

Show the 2026 and 2041 national pipeline in one chart: projected high-school graduates, immediate college entrants, and likely four-year entrants. Add a one-sentence finding above the chart and annotate the absolute loss at each stage.

Retain the observed undergraduate and graduate histories. Mark the pandemic years and the latest observation directly in the charts.

### Part II — The geography

The state map answers one question: how does future student supply differ by state? Its selectable measures are:

- Projected percentage change in likely four-year entrants from 2026.
- Absolute change in projected high-school graduates from 2026.
- Absolute change in likely four-year entrants from 2026.
- Participation increase required to preserve the 2026 four-year entrant pool.

For state `s`, year `t`, with the current college-going assumption `c = 0.628` and four-year share `f = 2/3`:

```
required_college_going_rate[s,t]
  = four_year_entrants[s,2026] / (graduates[s,t] * f)

required_participation_increase_pp[s,t]
  = max(0, required_college_going_rate[s,t] - c) * 100
```

Values above 100% remain visible and are labeled infeasible under the fixed four-year-share assumption. States with projected growth show zero additional participation required.

State archetypes use only observed assumptions and projected supply:

- `Expanding pool`: projected four-year entrants do not decline.
- `Participation opportunity`: the pool declines and the required increase is at most 5 percentage points.
- `Large but contracting`: the pool declines by less than 10%, absolute entrant loss is at or above the median loss among declining states, and required participation exceeds 5 points.
- `Concentrated pressure`: the pool declines by at least 10%, but absolute entrant loss is below the median loss among declining states.
- `Severe structural pressure`: the pool declines by at least 10% and absolute entrant loss is at or above the median loss among declining states.

The median threshold is recalculated for the selected year and described as a relative classification, not an absolute risk boundary.

The county section remains a local concentration view. It retains the largest-market/largest-decline toggle and does not duplicate the state archetype framing.

### Part III — Competition and redistribution

Observed institutional change uses the balanced 2015–16 through 2024–25 Scorecard period:

```
institution_change = UGDS_2024_25 / UGDS_2015_16 - 1
```

Institutions missing either endpoint are excluded from peer and quadrant comparisons but remain searchable when current enrollment exists.

Peer groups use:

- Control: public or private nonprofit.
- Current undergraduate size: under 5,000; 5,000–19,999; 20,000 or more.
- Admissions band where available: open/unknown; 75% or higher; 50–74.9%; below 50%.

The preferred peer median is control + size + admissions band. If fewer than ten institutions have valid endpoint changes, fall back to control + size. If that still has fewer than ten, fall back to control. Every institution record stores the peer definition and peer count used.

The state comparison is the median 2015–16 to 2024–25 institution change among valid institutions in the same state. Relative performance is:

```
relative_performance = institution_change - peer_median_change
```

The competition quadrant uses:

- X-axis: projected state four-year entrant change, 2026–2041.
- Y-axis: observed institution undergraduate change, 2015–16 to 2024–25.

The mixed time basis is stated directly in the title and note. The four descriptive situations are:

- Growing institution / expanding state pool.
- Growing institution / contracting state pool.
- Declining institution / expanding state pool.
- Declining institution / contracting state pool.

These are descriptive situations, not risk classes.

The institution map defaults to observed undergraduate enrollment change. Bubble size remains current undergraduate enrollment. Selectable observed color views are:

- Undergraduate enrollment change.
- Current undergraduate enrollment.
- Admissions rate.
- Full-time retention rate.
- Adult undergraduate share.
- Part-time undergraduate share.
- Net tuition revenue per FTE.

Missing values use a neutral gray and are identified as unavailable in the tooltip. Decline/growth views use orange → neutral → teal. Sequential measures use a light-to-blue scale.

### Observed institution profile

Selecting an institution opens a profile with raw values and peer context:

- 2015–16 to 2024–25 undergraduate enrollment change.
- State institution median.
- Comparable-institution median.
- Relative performance in percentage points.
- Projected state four-year entrant change through 2041.
- Retention rate.
- Adult undergraduate share.
- Part-time undergraduate share.
- International undergraduate share.
- Current undergraduate and graduate enrollment.
- Net tuition revenue per FTE.
- Instructional expenditure per FTE.

Percentile bars are separate and never combined into a score:

- Observed enrollment momentum.
- Retention.
- Adult share.
- Part-time share.
- Net tuition revenue per FTE.

Raw values remain adjacent to each percentile. A generated plain-language description may compare observed momentum and student mix with peer medians, but it may not use terms such as safe, resilient, vulnerable, or at risk.

Carnegie category, applications, program concentration, and distance-only status are omitted because they are not populated consistently in the compact public artifact.

## Part IV — Alternative markets

Move the international chapter after the competition chapter. Retain the national intake and policy context and add a concentration chart for the 2024–25 international-student stock:

- India: 363,019.
- China: 265,919.
- All other origins: 548,828.

The chart reports that India and China account for approximately 53.4% of the 1,177,766 total. It explicitly states that these are enrolled-student stock counts, not new-intake counts, and therefore do not estimate cohort replacement.

Add a replacement-student scenario at the state level. The selected state and year determine the missing likely four-year entrants relative to 2026. The user allocates that total among:

- Increased in-state participation.
- Out-of-state recruitment.
- International recruitment.
- Transfer and adult students.

The unfilled amount is calculated as the remaining total. Inputs cannot allocate more than the missing pool. The tool is an allocation exercise, not a forecast of achievable recruitment.

## Part V — Financial consequence

Replace the current projected-institution finance ranking with a selected-institution counterfactual. Standard loss scenarios are 5%, 10%, and 20% of current undergraduate headcount.

Use the existing explicit headcount-to-FTE factor of 0.85:

```
lost_students = current_UG * selected_loss_rate
lost_FTE = lost_students * 0.85
current_tuition_base = current_UG * 0.85 * net_tuition_revenue_per_FTE
gross_tuition_reduction = lost_FTE * net_tuition_revenue_per_FTE
associated_instructional_expenditure = lost_FTE * instructional_expenditure_per_FTE
gross_reduction_pct = gross_tuition_reduction / current_tuition_base
```

The output shows lost students, lost FTE, current tuition base, gross tuition reduction, reduction as a percentage of the estimated tuition base, and instructional expenditure associated with those FTEs. It states that immediately avoidable cost is not estimated and does not subtract instructional expenditure from the gross revenue change.

## Data Architecture

Create `scripts/build_market_diagnostics.py` to read:

- `data/scorecard_compact.json`
- `data/institutions.json`
- `data/states.json`

It writes:

- `data/state_diagnostics.json`: one record per state-year with baseline values, absolute losses, required participation, and archetype.
- `data/institution_diagnostics.json`: one record per institution with endpoint change, state and peer medians, relative performance, peer definition/count, profile values, percentiles, and 2041 state-pool change.

The builder must preserve the existing runtime artifacts and must not read the ignored multi-gigabyte annual archive.

Extend `data/international.json` with an `originConcentration2024_25` object containing the three concentration groups, total, source label, source URL, and the stock-versus-flow limitation.

Create `diagnostics-core.js` for pure browser calculations and classifications. `app.js` owns national, state, county, international, and replacement-allocation rendering. `filters.js` owns institution filtering, map views, quadrant interaction, profiles, and financial counterfactuals.

## Interaction and Accessibility

- All controls have visible labels and keyboard-operable native inputs.
- Color is never the only signal; tooltips and detail panels include signed values and situation labels.
- Growth uses teal/blue rather than green; decline uses orange rather than saturated red.
- Missing data are gray and explicitly labeled.
- Plotly mode bars remain hidden, with responsive plots and readable mobile stacking.
- Chapter headings and one-sentence findings orient the reader before each interactive visual.
- Desktop section padding decreases from 100px to approximately 72px; mobile padding remains at least 56px.

## Validation

Python tests cover:

- Required-participation arithmetic, including growth and rates above 100%.
- Absolute graduate and entrant loss.
- State archetype assignment.
- Endpoint enrollment change.
- Peer fallback order and minimum peer count.
- Percentile calculation with missing values.

Node tests cover:

- State metric selection and legend labels.
- Replacement allocation clamping and unfilled totals.
- Financial 5/10/20% counterfactual arithmetic.
- Institution map metric metadata.
- Plain-language profile descriptions without risk language.

Contract tests verify:

- Both diagnostic artifacts exist and contain the required fields.
- No public scope or synthetic risk controls return.
- The finance section does not call a counterfactual a forecast or subtract associated expenditure.
- The page contains the five-part analytical structure.

Rendered verification checks the main local route at desktop and mobile widths, confirms the hero and first result fit within the intended opening pace, exercises each selector, and captures a fresh full-page screenshot.

## Explicit Non-Goals

- No institution-specific enrollment forecast is promoted.
- No composite institutional risk, resilience, or vulnerability score is created.
- No recruitment geography is inferred from scope labels.
- No institution-level international intake forecast is created from `UGDS_NRA`.
- No instructional expense is treated as immediately avoidable.
- No residence-based import dependence is calculated before first-time residence data are loaded.
