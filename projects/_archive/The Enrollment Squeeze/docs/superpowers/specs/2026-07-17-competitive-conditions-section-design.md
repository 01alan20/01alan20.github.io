# Competitive Conditions Section Design

## Purpose

Add a compact analytical section near the bottom of the Enrollment Squeeze story that connects observed institutional growth with four measurable institutional characteristics. The section should help readers understand the competitive conditions associated with growth without presenting them as causal drivers.

## Placement

Insert the section immediately before the existing ending section and after the finance section. It should serve as the final evidence section before the narrative conclusion.

## Content

Heading:

> What helps institutions compete for students?

The section will contain four compact comparison panels:

- Full-time retention rate
- First-time students from other states
- Admission rate
- Adult undergraduate share

Each panel will compare two observed groups:

- Institutions whose undergraduate enrollment declined by more than 2.5% from 2015-16 to 2024-25
- Institutions whose undergraduate enrollment grew by more than 2.5% over the same period

Each panel will show the distribution, median value for each group, and the median difference. The section will include a concise note that these are observed associations and do not establish causation.

## Visual treatment

Reuse the existing editorial section styling and the project palette. Use muted red for declining institutions and teal for growing institutions. Keep the visual smaller and more focused than the institution map. Do not add another filter, forecast, score, or composite index.

## Data and interpretation

Use `data/institution_diagnostics.json` and the existing `change` field. Feature fields are `retention`, `firstTimeOtherStateShare`, `admitRate`, and `adultUGShare`. Omit institutions with missing values for an individual panel. Do not describe any feature as a cause of growth. The period and group thresholds must be visible in the section note or chart labels.

## Verification

Confirm that the section appears before the conclusion, remains readable on mobile widths, uses the existing typography and colors, and does not affect the institution explorer, finance section, or page data loading.
