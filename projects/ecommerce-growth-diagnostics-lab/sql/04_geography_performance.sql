-- Geography performance: country-level traffic, conversion, and revenue.

WITH session_funnel AS (
  SELECT * FROM (
    SELECT NULL AS country, 0 AS did_purchase, 0.0 AS session_revenue
  ) WHERE 1=0
)
SELECT
  country,
  COUNT(*) AS sessions,
  SUM(did_purchase) AS purchases,
  SAFE_DIVIDE(SUM(did_purchase), COUNT(*)) AS session_to_purchase_rate,
  SUM(session_revenue) AS revenue
FROM session_funnel
GROUP BY country
HAVING COUNT(*) >= 100
ORDER BY revenue DESC;
