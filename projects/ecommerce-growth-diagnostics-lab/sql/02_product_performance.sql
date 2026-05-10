-- Product performance: views, cart adds, purchases, and revenue by item.

WITH item_events AS (
  SELECT
    event_name,
    item.item_name AS item_name,
    item.item_category AS item_category,
    item.price AS item_price,
    item.quantity AS item_quantity,
    item.item_revenue AS item_revenue
  FROM `bigquery-public-data.ga4_obfuscated_sample_ecommerce.events_*`,
  UNNEST(items) AS item
  WHERE _TABLE_SUFFIX BETWEEN '20201101' AND '20210131'
)
SELECT
  item_category,
  item_name,
  COUNTIF(event_name = 'view_item') AS views,
  COUNTIF(event_name = 'add_to_cart') AS adds_to_cart,
  COUNTIF(event_name = 'purchase') AS purchases,
  SUM(IFNULL(item_revenue, 0)) AS revenue,
  SAFE_DIVIDE(COUNTIF(event_name = 'purchase'), NULLIF(COUNTIF(event_name = 'view_item'), 0)) AS view_to_purchase_rate
FROM item_events
GROUP BY item_category, item_name
ORDER BY revenue DESC;
