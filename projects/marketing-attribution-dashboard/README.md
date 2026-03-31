# Google Analytics Sample Dataset Marketing Exercise

Marketing analysis project built around the Google Merchandise Store BigQuery sample-dataset concept.

## What This Project Is
- A two-tab dashboard:
  - `Data Examination`
  - `Questions From Data`
- A downloadable Jupyter notebook:
  - `google-analytics-marketing-exploration.ipynb`
- Local CSVs that power both the dashboard and the notebook

## Source Basis
- Official dataset reference: `bigquery-public-data.ga4_obfuscated_sample_ecommerce.events_*`
- Official docs: Google Analytics developer documentation for the ecommerce BigQuery sample dataset
- Announcement: Google blog post introducing the Google Analytics sample dataset for BigQuery

## Important Caveat
The CSV files in this repo are a reproducible modeled extract aligned to the public dataset concepts, not a live BigQuery export. The modeled layer adds:
- cart-intent event assignment
- multi-touch attribution credits
- generic cohort labels for filtering
- transaction revenue values for question-driven analysis

## Local Files
- `index.html`
- `dashboard.css`
- `dashboard.js`
- `google-analytics-marketing-exploration.ipynb`
- `data/session_events.csv`
- `data/journey_summary.csv`
- `data/metadata.json`

## Rebuild Data
```bash
python scripts/prepare_marketing_attribution_dashboard.py
```
