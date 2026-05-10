-- Revenue concentration: Pareto view of top products driving revenue.

WITH product_revenue AS (
  SELECT
    item.item_name AS item_name,
    SUM(IFNULL(item.item_revenue, 0)) AS revenue
  FROM `bigquery-public-data.ga4_obfuscated_sample_ecommerce.events_*`,
  UNNEST(items) AS item
  WHERE _TABLE_SUFFIX BETWEEN '20201101' AND '20210131'
    AND event_name = 'purchase'
  GROUP BY item_name
),
ranked AS (
  SELECT
    item_name,
    revenue,
    SUM(revenue) OVER () AS total_revenue,
    SUM(revenue) OVER (ORDER BY revenue DESC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_revenue
  FROM product_revenue
)
SELECT
  item_name,
  revenue,
  SAFE_DIVIDE(revenue, total_revenue) AS revenue_share,
  SAFE_DIVIDE(cumulative_revenue, total_revenue) AS cumulative_revenue_share
FROM ranked
ORDER BY revenue DESC;
