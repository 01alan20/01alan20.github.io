-- Returning users and loyalty behavior.

WITH user_orders AS (
  SELECT
    user_pseudo_id,
    COUNTIF(event_name = 'purchase') AS purchase_events,
    SUM(IFNULL(ecommerce.purchase_revenue, 0)) AS revenue
  FROM `bigquery-public-data.ga4_obfuscated_sample_ecommerce.events_*`
  WHERE _TABLE_SUFFIX BETWEEN '20201101' AND '20210131'
  GROUP BY user_pseudo_id
)
SELECT
  CASE
    WHEN purchase_events = 0 THEN 'No Purchase'
    WHEN purchase_events = 1 THEN 'One-Time Buyer'
    ELSE 'Repeat Buyer'
  END AS user_segment,
  COUNT(*) AS users,
  SUM(revenue) AS total_revenue,
  SAFE_DIVIDE(SUM(revenue), COUNT(*)) AS revenue_per_user
FROM user_orders
GROUP BY user_segment
ORDER BY total_revenue DESC;
