# Compact Scorecard data

`scorecard_compact.json` is the checked-in runtime/build artifact for the institution model. It contains the 2015-16 through 2024-25 Scorecard history for the 1,849 institutions represented in the site's 5,547 institution-year projection rows.

Only the fields used by the current model are retained: `UGDS`, `GRADS`, `ADM_RATE`, `RET_FT4`, `C150_4`, `PCTPELL`, `TUITIONFEE_IN`, `TUITIONFEE_OUT`, `PPTUG_EF`, `UG25ABV`, `UGDS_NRA`, `LATITUDE`, and `LONGITUDE`.

`scripts/build_scorecard_history.py` reads this compact artifact and refreshes `institutions.json`. The broader national enrollment panel remains a separate precomputed artifact in `national_enrollment.json` so the national history retains its balanced 4,968-undergraduate and 1,797-graduate institution panels. The original annual CSV files and dictionary are not required by the site or the current build path.

Tuition fields are price inputs, not realized net tuition revenue. `UGDS_NRA` is undergraduate degree-seeking nonresident-alien share, not total international enrollment.

## Institution-model research archive

The local `collegeboard history` folder contains annual Scorecard files from 2005-06 through 2025-26. The supplied 2025-26 file has no usable `UGDS` observation, so the research model currently uses 2005-06 through 2024-25. The raw CSVs are intentionally ignored by Git because the archive is too large for the website repository.

Run `python scripts/institution_model_research.py` to build `data/research/institution_model_backtest.json`. This report compares no-change, state-market, recent-trend, and expanded ridge models on rolling 2020-24 holdouts. It is a research result, not a public forecast artifact; the public page should only adopt the expanded model if it improves out-of-sample error.
