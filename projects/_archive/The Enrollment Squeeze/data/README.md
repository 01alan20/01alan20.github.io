# Data artifacts

The published page loads compact JSON files from this directory. Large annual College Scorecard source files are not stored in this repository.

## Runtime files

The browser loads:

- `national.json` and `national_enrollment.json` for the national pipeline and observed histories.
- `states.json`, `state_diagnostics.json`, and `state_shapes.json` for state scenarios and maps.
- `counties.json` for county projections.
- `institutions.json` and `institution_diagnostics.json` for the observed institution explorer.
- `international.json` and `context.json` for international and source context.
- `map_meta.json` for shared projected-map bounds.

## Compact College Scorecard history

`scorecard_compact.json` retains the 2015–16 through 2024–25 history required by the current public institution analysis for 1,849 institutions.

Retained fields include `UGDS`, `GRADS`, `ADM_RATE`, `RET_FT4`, `C150_4`, `PCTPELL`, `TUITIONFEE_IN`, `TUITIONFEE_OUT`, `PPTUG_EF`, `UG25ABV`, `UGDS_NRA`, `LATITUDE`, and `LONGITUDE`.

Run:

```powershell
python scripts/build_scorecard_history.py
```

to refresh `institutions.json` and `national_enrollment.json`. The original annual CSV files are not required by the published page or this compact rebuild.

Tuition fields are price inputs, not realized net tuition revenue. `UGDS_NRA` is the share of degree-seeking undergraduates reported as nonresident aliens, not total international enrollment or new international intake.

## First-time residence

`ipeds_residence_2024.json` is a compact reduction of the NCES IPEDS `EF2024C` Fall 2024 provisional file.

Its within-state and other-state shares use first-time degree/certificate-seeking undergraduates with known residence in a U.S. state or the District of Columbia. Foreign-country, outlying-area, and unknown-residence counts remain outside that denominator.

## Research-only annual archive

The 2005–06 through 2025–26 annual College Scorecard files are not stored in this repository. The checked-in `research/institution_model_backtest.json` preserves the current backtest result.

To rerun that research from an external copy of the annual archive:

```powershell
python scripts/institution_model_research.py --input-dir "C:\path\to\collegeboard history"
```

The supplied 2025–26 file does not contain usable `UGDS` observations, so the research model uses 2005–06 through 2024–25. The expanded model remains research-only unless it demonstrates stable out-of-sample improvement over the simpler baselines.

## Supporting phase data

- `phase1/` contains state graduate projections and backtests.
- `phase2/` contains county age transitions, projections, and validation outputs.
- `phase3/` contains the college-going and four-year entrant scenarios.
- `phase4/` and `phase5/` are retained historical development artifacts and are not loaded by the current page.
