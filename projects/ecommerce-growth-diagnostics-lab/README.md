# GA4 BigQuery Ecommerce Case Study

This project uses Google's public GA4 BigQuery ecommerce sample dataset for the Google Merchandise Store to show how raw event exports become business analytics.

The portfolio angle is deliberate: the project is not just a dashboard. It documents the learning path from GA4 event rows to ecommerce metrics, SQL patterns, and business recommendations.

## Dataset

- Table pattern: `bigquery-public-data.ga4_obfuscated_sample_ecommerce.events_*`
- Coverage: November 1, 2020 to January 31, 2021
- Grain: event-level web analytics data using the GA4 BigQuery export schema
- Official dataset docs: https://developers.google.com/analytics/bigquery/web-ecommerce-demo-dataset

Google describes the dataset as obfuscated sample data with some limited internal consistency, so findings should be framed as analytical patterns in the sample dataset rather than claims about the live Google Merchandise Store business.

## Deliverables

- [`ga4-bigquery-ecommerce-case-study.ipynb`](ga4-bigquery-ecommerce-case-study.ipynb): step-by-step notebook organized around business questions, GA4 fields, and BigQuery SQL patterns.
- [`index.html`](index.html): portfolio outcome page with the case-study framing and dashboard preview.
- [`sql/`](sql): reusable BigQuery SQL starter pack for funnel, channel, product, device, geography, checkout leakage, loyalty, and revenue concentration analysis.
- [`data/live_ga4_summary.json`](data/live_ga4_summary.json): generated live BigQuery summary used by the notebook and dashboard.
- [`scripts/build_live_ga4_outputs.py`](scripts/build_live_ga4_outputs.py): reproducible export script that refreshes JSON, JavaScript, and CSV summary outputs.

## Live Results Snapshot

The current generated output layer was built from BigQuery using project `big-query-project-505612`.

- Event rows queried: 4,295,584
- Users: 270,154
- Sessions: 360,129
- Purchases: 5,692
- Sample revenue: $362,165
- Session-to-purchase rate: 1.58%
- Largest funnel loss: View item to Add to cart
- Top revenue source / medium: `google / organic`
- Top revenue category: Apparel
- Optimization layer: 60 feature association rows, 24 step-driver rows, 8 product opportunity rows, 8 channel quality rows, and 7 experiment backlog items

## Business Questions

1. What is the overall activity and purchase baseline?
2. What are users doing before they buy?
3. Where does the ecommerce funnel lose users?
4. Which products attract interest versus revenue?
5. Which traffic, device, and geography segments create value?
6. What actions would improve ecommerce performance?

## Optimization Analysis Layer

The enhanced case study moves beyond descriptive statistics by asking which features are associated with stronger or weaker business outcomes.

- Feature association analysis: compares source / medium, device, geography, product-category exposure, event depth, cart intent, and checkout start against the baseline purchase rate.
- Step-specific funnel driver analysis: evaluates segment lift separately for `view_item -> add_to_cart`, `add_to_cart -> begin_checkout`, and `begin_checkout -> purchase`.
- Product opportunity matrix: separates high-attention / low-conversion categories from low-attention / high-conversion categories.
- Channel quality scorecard: scores channels using conversion rate, revenue per session, and cart progression.
- Experiment backlog: turns the analysis into hypotheses, target segments, primary metrics, and measurement plans.

## Skills Demonstrated

- Querying wildcard GA4 export tables with `_TABLE_SUFFIX`
- Extracting values from `UNNEST(event_params)`
- Analyzing product arrays with `UNNEST(items)`
- Reconstructing sessions from `user_pseudo_id` and `ga_session_id`
- Building funnel flags with CTEs and conditional aggregation
- Calculating conversion and revenue metrics with `SAFE_DIVIDE`
- Translating technical outputs into business implications

## SQL Pack

All SQL files are in [`sql/`](sql):

- `00_base_session_funnel.sql`
- `01_channel_performance.sql`
- `02_product_performance.sql`
- `03_device_performance.sql`
- `04_geography_performance.sql`
- `05_checkout_leakage.sql`
- `06_returning_users_loyalty.sql`
- `07_revenue_concentration.sql`

## Outcome Page

The dashboard preview is structured like an ecommerce diagnostics board:

- Funnel and checkout leakage
- Channel efficiency and channel revenue share
- Product/category monetization and Pareto concentration
- Device, geography, and loyalty segments

The current charts use live aggregate outputs generated from BigQuery. To refresh the data:

```powershell
.\.venv\Scripts\python.exe projects\ecommerce-growth-diagnostics-lab\scripts\build_live_ga4_outputs.py
```

That command writes:

- `data/live_ga4_summary.json`
- `data/live_ga4_summary.js`
- `data/funnel_summary.csv`
- `data/channel_summary.csv`
- `data/product_category_summary.csv`
- `data/device_summary.csv`
- `data/geography_summary.csv`
- `data/daily_summary.csv`
- `data/feature_associations.csv`
- `data/step_driver_summary.csv`
- `data/product_opportunity_matrix.csv`
- `data/channel_quality_scorecard.csv`
- `data/experiment_backlog.csv`

## How to Run the Notebook

1. Open `ga4-bigquery-ecommerce-case-study.ipynb`.
2. Select the `GA4 BigQuery Portfolio (.venv)` Jupyter kernel.
3. Confirm `PROJECT_ID = "big-query-project-505612"` or replace it with your own Google Cloud project.
4. Run the cells in order.

The notebook reads the generated summary file first, then keeps the underlying SQL cells available so the analysis can be rerun or extended.
