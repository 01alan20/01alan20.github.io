# Institution Recruitment Concentration Design

## Objective

Extend the observed institution explorer so readers can see where colleges currently draw their entering domestic students and how concentrated their undergraduate international enrollment is. These measures provide evidence about the pools institutions may need to compete for as domestic demographics diverge.

The feature remains descriptive. It does not convert current recruitment composition into an institution-level enrollment forecast or a synthetic risk score.

## Public Interface

The existing institution map remains a single large map. Its `Map color` selector gains three observed measures:

- First-time students from within the institution's state.
- First-time students from other U.S. states.
- Undergraduate nonresident-alien share.

The existing observed measures remain available. Bubble size continues to represent current undergraduate enrollment. A single selectable map is preferred over three simultaneous maps because it preserves geographic detail, avoids repeated legends, and remains usable on mobile screens.

The three new labels must state the population being measured. The interface must not abbreviate the residence measures as generic `in-state share` or `out-of-state share`, because they describe the entering class rather than all undergraduates.

## Data Sources and Definitions

### Domestic residence

Use the NCES IPEDS Fall Enrollment residence and migration table `EF2024C`, the latest available even-year residence collection for Fall 2024. Join records to the existing institution diagnostics by `UNITID` and identify the institution's home state from the existing institution record.

For each institution, aggregate first-time degree/certificate-seeking undergraduate residence counts into:

- `firstTimeHomeStateCount`: students whose reported U.S. residence matches the institution's state.
- `firstTimeOtherStateCount`: students whose reported residence is another U.S. state or the District of Columbia.
- `firstTimeForeignCountryCount`: students reported as residing in a foreign country.
- `firstTimeUnknownResidenceCount`: students whose residence is unknown or not reported to a specific geography.
- `firstTimeKnownDomesticCount`: home-state plus other-state students.

Calculate:

```text
firstTimeHomeStateShare = firstTimeHomeStateCount / firstTimeKnownDomesticCount
firstTimeOtherStateShare = firstTimeOtherStateCount / firstTimeKnownDomesticCount
```

Foreign-country and unknown-residence records are excluded from the domestic denominator. This makes the two domestic shares complementary and avoids treating unknown or foreign residence as out-of-state domestic recruitment.

If `firstTimeKnownDomesticCount` is zero or unavailable, both shares are null. Do not impute residence shares from tuition status, institution location, control, or any model classification.

### Nonresident-alien concentration

Use the latest reported College Scorecard `UGDS_NRA` value already carried into `internationalUGShare`. It represents the share of currently enrolled degree-seeking undergraduates who are nonresident aliens.

This measure has a different population and denominator from EF-C. It must be labeled `Undergraduate nonresident-alien share`, and the interface must not describe it as international entering-class share or recruitment origin.

## Data Pipeline

Add a focused builder that:

1. Downloads the official NCES `EF2024C` complete-data ZIP when the source file is not available locally.
2. Extracts and reads only the required residence table and its dictionary metadata.
3. Resolves residence codes from the official dictionary rather than relying on undocumented positional assumptions.
4. Aggregates records by `UNITID` using the definitions above.
5. Writes a compact runtime artifact containing institution-level counts, shares, source year, source table, and coverage metadata.
6. Joins those fields into `institution_diagnostics.json` during the existing diagnostics build.

The downloaded ZIP and expanded raw files are source inputs and must not be required by the public GitHub Pages runtime. Commit only the compact generated artifact and reproducible builder code unless the repository's existing data policy explicitly requires retaining a small raw extract.

The artifact must include provenance:

```json
{
  "source": "NCES IPEDS",
  "table": "EF2024C",
  "collection": "Fall 2024",
  "population": "First-time degree/certificate-seeking undergraduates",
  "denominator": "Students with known U.S. residence"
}
```

## Map and Profile Behavior

All three new map measures use the established low-middle-high orange, neutral, and teal scale. Missing values use gray. The colorbar title changes with the selected measure.

Tooltips for the domestic measures show:

- Institution name.
- Selected share.
- Home-state count.
- Other-state count.
- Foreign-country count.
- Unknown-residence count.
- Known-domestic denominator.
- Fall 2024 source year.
- Current undergraduate enrollment.

The nonresident-alien tooltip shows the selected share, latest Scorecard reporting year, and current undergraduate enrollment. It does not show EF-C residence counts as though they shared a denominator.

When an institution is selected, its observed profile adds a `Recruitment composition` group containing the two domestic first-time shares and the undergraduate nonresident-alien share. Raw counts and source years remain visible alongside percentages.

The section introduction should explain the analytical use in plain language: current recruitment composition indicates which pools an institution has historically accessed, but does not prove that it can maintain or expand those pools in the future.

## Missing Data and Coverage

Institutions without usable EF-C records remain visible as gray bubbles when a residence measure is selected. They are not removed silently. The map reports the number of institutions with and without usable residence data for the active filters.

Records with known domestic counts greater than zero are displayed. Tooltips expose the denominator so readers can identify small entering classes. No minimum-count suppression is added unless the official source applies one or visual review shows that a documented stability rule is necessary.

## Testing and Verification

### Data tests

- The runtime residence artifact exists and records `EF2024C` and Fall 2024 provenance.
- Counts are nonnegative integers or null.
- Home-state and other-state shares are bounded from zero to one.
- For records with a positive known-domestic denominator, the two domestic shares sum to one within floating-point tolerance.
- Foreign-country and unknown-residence counts are excluded from the domestic denominator.
- `UNITID` values are unique after aggregation.
- The diagnostics join does not duplicate institutions.

### Interface tests

- All three new options appear in the institution map selector with population-specific labels.
- Selecting each option updates the color scale, colorbar title, and tooltip fields.
- Missing residence values render in gray.
- The institution filter reset returns the map to observed undergraduate change.
- The profile displays residence counts, residence shares, and source years without calling them forecasts.
- Desktop and mobile layouts have no horizontal overflow.

### Rendered QA

Exercise the new map choices in a real browser, select an institution with complete residence data, inspect an institution with missing data, run the reset control, check browser logs, and capture an updated full-page screenshot.

## Explicit Non-Goals

- Do not infer residence from in-state tuition status.
- Do not treat all out-of-state domestic students as one forecastable market.
- Do not model county or metro recruitment catchments in this feature.
- Do not combine residence and nonresident-alien measures into a composite score.
- Do not label current recruitment composition as proven future reach.
- Do not forecast institution-specific international intake from `UGDS_NRA`.
