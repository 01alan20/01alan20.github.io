# Enrollment Squeeze grouped institution map design

## Goal

Make the institution map easier to interpret by replacing visually flat continuous gradients with discrete, labeled groups while preserving the map's observed-data framing.

## Visible copy

- Remove “Bubble size is current undergraduate enrollment.”
- Remove the institution data-coverage sentence below the map.
- Keep current undergraduate enrollment encoded in bubble size and available in each tooltip.

## Grouping strategy

Use a hybrid system: fixed bands where thresholds have a clear public meaning, and five balanced quantile groups where no defensible universal threshold exists.

### Fixed bands

Observed undergraduate change:

- Large decline: less than or equal to -10%
- Moderate decline: more than -10% and less than -2.5%
- Little change: -2.5% through 2.5%
- Moderate growth: more than 2.5% and less than 10%
- Large growth: 10% or more

Admissions rate:

- Under 10% (label: `<10%`)
- 10% to under 25% (label: `10–24%`)
- 25% to under 50% (label: `25–49%`)
- 50% to under 80% (label: `50–79%`)
- 80% or higher (label: `80%+`)

Current undergraduate enrollment:

- Under 1,000
- 1,000–4,999
- 5,000–9,999
- 10,000–19,999
- 20,000 or more

Retention rate:

- Under 50%
- 50–64.9%
- 65–74.9%
- 75–84.9%
- 85% or higher

First-time residence shares:

- Under 25%
- 25–49.9%
- 50–74.9%
- 75–89.9%
- 90% or higher

### Quantile groups

Adult share, part-time share, undergraduate nonresident-alien share, and net tuition revenue per FTE use five quantile groups computed from institutions currently included by the filters. Legend labels show the actual numeric range, not generic quintile names. Duplicate breakpoints caused by tied values are consolidated so the legend never shows empty or impossible groups.

## Color and legend behavior

- Use five discrete colors progressing from muted orange through a light neutral to teal.
- Missing values remain gray.
- Replace Plotly's continuous colorbar with discrete range labels.
- Tooltips retain the exact raw value and current undergraduate enrollment.
- Changing institution filters recomputes quantile groups for the currently visible population; fixed groups do not change.

## Implementation boundary

The grouping logic belongs in `diagnostics-core.js` as a pure, testable function. `filters.js` maps each institution to a group and renders the corresponding discrete legend. No source data or model outputs change.

## Verification

- Unit tests cover every fixed-band boundary, quantile grouping, duplicate breakpoints, missing values, colors, and labels.
- Contract tests confirm the two requested sentences are absent.
- Browser QA cycles through all institution map measures, checks for JavaScript errors, and captures desktop and mobile renderings.
