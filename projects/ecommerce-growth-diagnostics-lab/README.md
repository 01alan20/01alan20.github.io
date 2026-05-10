# E-commerce Growth Diagnostics Lab: Public Web Analytics for Funnel, Product, and Revenue Optimization

This project uses Google's public GA4 BigQuery sample dataset for the Google Merchandise Store.

## Dataset
- Table pattern: `bigquery-public-data.ga4_obfuscated_sample_ecommerce.events_*`
- Coverage: November 1, 2020 to January 31, 2021
- Grain: event-level web analytics data (GA4 export schema)

Official dataset docs:
- https://developers.google.com/analytics/bigquery/web-ecommerce-demo-dataset

## Why This Dataset
This is one of the strongest marketing datasets for portfolio work because it supports full-funnel behavior analysis from traffic source to purchase.

## Core Analysis Areas
1. Funnel conversion: `session_start -> view_item -> add_to_cart -> begin_checkout -> purchase`
2. Channel performance: source / medium / campaign
3. Product performance: views, carts, purchases, item revenue
4. Device performance: desktop vs mobile vs tablet
5. Geography: country-level traffic and conversion
6. Checkout leakage: stepwise drop-off before purchase
7. Returning users: repeat purchaser behavior
8. Revenue concentration: products and segments driving disproportionate revenue

## Recommendation Questions This Project Can Answer
- Which channels should receive more budget?
- Which product categories have high attention but low conversion?
- Which device experience is underperforming?
- Which audience segments need remarketing?
- Which products should be bundled or promoted?
- Where exactly is checkout losing revenue?

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

## Interactive Dashboard
- `index.html`
- `dashboard.css`
- `dashboard.js`

The dashboard is intentionally structured like an executive diagnostics board:
- Funnel and checkout leakage
- Channel efficiency and channel revenue share
- Product/category monetization and Pareto concentration
- Device, geography, and loyalty segments

Current charts use modeled demo outputs aligned to the GA4 public sample schema.
To move from demo to production:
1. Run the SQL queries in BigQuery.
2. Export results.
3. Replace the `data` object in `dashboard.js` with your live outputs.

## How To Run
1. Open BigQuery in Google Cloud.
2. Use the SQL files in this folder.
3. Keep wildcard table filter in place (`_TABLE_SUFFIX`).
4. Export results to CSV if you want to visualize in a local dashboard.

## Notes
- These queries are written for exploratory diagnostics and portfolio storytelling.
- You can safely run this in BigQuery Sandbox / free usage tier for moderate exploration.
