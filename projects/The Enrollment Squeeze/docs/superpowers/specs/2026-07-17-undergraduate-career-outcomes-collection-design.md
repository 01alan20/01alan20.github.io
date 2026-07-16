# Undergraduate Career Outcomes Collection Design

## Objective

Collect the latest defensible institution-wide undergraduate career outcomes percentage for the 1,849 institutions in the public Enrollment Squeeze explorer.

## Public output

Create a plotting file with two columns:

```csv
institution,career_outcomes_percent
```

One row will be retained for every institution. The percentage will be blank when no acceptable result is found.

## Audit output

Create a separate audit file containing:

- UNITID;
- institution name;
- career outcomes percentage;
- graduating class or reporting year;
- source URL;
- source wording or excerpt;
- population covered;
- extraction method;
- confidence classification; and
- review status.

## Source and population rules

- Search only official institutional domains drawn from the local College Scorecard source file.
- Accept institution-wide undergraduate, bachelor’s, or baccalaureate results.
- Exclude graduate-only results.
- Exclude results limited to a single college, school, department, major, or program.
- Prefer an explicitly labeled career outcomes rate.
- Accept an equivalent combined percentage covering employment, continuing education, military service, or voluntary service when the source defines the measure clearly.
- Retain the most recent qualifying graduating class or reporting year.
- Do not substitute College Scorecard earnings or working-share measures for a published career outcomes percentage.

## Collection approach

1. Match the 1,849 public institutions to their official URLs using UNITID.
2. Discover candidate pages through robots files, sitemaps, internal links, and common career-outcomes URL patterns.
3. Score candidate pages using phrases such as `career outcomes`, `first destination`, `graduate outcomes`, and `post-graduation outcomes`.
4. Extract percentages only when they occur near qualifying career-outcome language.
5. Rank competing results by population fit, explicit measure label, reporting year, and source quality.
6. Preserve unresolved or ambiguous results in the audit file without promoting them to the plotting file.

## Confidence classifications

- `high`: explicit institution-wide undergraduate or bachelor’s career outcomes rate with a clear year.
- `medium`: equivalent institution-wide undergraduate combined outcome with a clear definition or context.
- `review`: plausible percentage with unresolved population, denominator, or measure wording.
- `missing`: no qualifying result found.

Only `high` and `medium` results populate the plotting file.

## Verification

- Unit tests cover institution matching, undergraduate inclusion, graduate and program-level exclusion, percentage extraction, year selection, and output generation.
- A stratified pilot validates the crawler before the full run.
- The final report states total coverage and counts by confidence classification.
- A manual sample checks source accuracy across institution controls, sizes, and regions.
