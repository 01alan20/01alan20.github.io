-- Device performance: conversion and revenue by device class.

WITH session_funnel AS (
  SELECT * FROM (
    SELECT NULL AS device_category, 0 AS did_view_item, 0 AS did_add_to_cart,
      0 AS did_begin_checkout, 0 AS did_purchase, 0.0 AS session_revenue
  ) WHERE 1=0
)
SELECT
  device_category,
  COUNT(*) AS sessions,
  SUM(did_view_item) AS product_view_sessions,
  SUM(did_add_to_cart) AS cart_sessions,
  SUM(did_begin_checkout) AS checkout_sessions,
  SUM(did_purchase) AS purchase_sessions,
  SAFE_DIVIDE(SUM(did_purchase), COUNT(*)) AS session_to_purchase_rate,
  SUM(session_revenue) AS revenue
FROM session_funnel
GROUP BY device_category
ORDER BY revenue DESC;
