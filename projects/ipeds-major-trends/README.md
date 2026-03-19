# IPEDS Major Trends (2013-2023)

Dashboard and data pipeline for major-level graduate change analysis using IPEDS completions data.

## What This Project Shows
- Major change from 2013 to 2023 using 4-digit CIP aggregation.
- Major names are displayed in the dashboard (not CIP codes).
- National and state-level change metrics:
  - `gross_change = count_2023 - count_2013`
  - `pct_change = (count_2023 - count_2013) / count_2013 * 100` when baseline is positive.
- US choropleth map by major, colored by state-level percent change.

## Data Pipeline
Run:

```bash
python scripts/prepare_ipeds_major_trends.py
```

The script downloads:
- IPEDS completions files `C{year}_A.zip` for 2013-2023
- IPEDS institutional files `HD{year}.zip` for state lookup
- CIP 2010-to-2020 crosswalk and CIP 2020 titles

## Outputs
Files written to `projects/ipeds-major-trends/data/`:
- `major_change_national_2013_2023.csv`
- `major_change_state_2013_2023.csv`
- `major_trend_national_annual.csv`
- `major_trend_state_annual.csv`
