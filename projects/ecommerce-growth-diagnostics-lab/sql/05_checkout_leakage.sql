-- Checkout leakage: where sessions drop between key funnel steps.

WITH session_funnel AS (
  SELECT * FROM (
    SELECT 0 AS did_view_item, 0 AS did_add_to_cart, 0 AS did_begin_checkout, 0 AS did_purchase
  ) WHERE 1=0
),
steps AS (
  SELECT 'view_item' AS step, SUM(did_view_item) AS sessions_at_step FROM session_funnel
  UNION ALL
  SELECT 'add_to_cart', SUM(did_add_to_cart) FROM session_funnel
  UNION ALL
  SELECT 'begin_checkout', SUM(did_begin_checkout) FROM session_funnel
  UNION ALL
  SELECT 'purchase', SUM(did_purchase) FROM session_funnel
)
SELECT
  step,
  sessions_at_step,
  LAG(sessions_at_step) OVER (ORDER BY
    CASE step
      WHEN 'view_item' THEN 1
      WHEN 'add_to_cart' THEN 2
      WHEN 'begin_checkout' THEN 3
      WHEN 'purchase' THEN 4
    END
  ) AS previous_step_sessions,
  SAFE_DIVIDE(sessions_at_step,
    LAG(sessions_at_step) OVER (ORDER BY
      CASE step
        WHEN 'view_item' THEN 1
        WHEN 'add_to_cart' THEN 2
        WHEN 'begin_checkout' THEN 3
        WHEN 'purchase' THEN 4
      END
    )
  ) AS step_retention_rate
FROM steps;
