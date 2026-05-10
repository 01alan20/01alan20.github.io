-- Base session-level funnel table
-- Creates one row per user session with funnel step flags and core dimensions.

WITH session_events AS (
  SELECT
    user_pseudo_id,
    CONCAT(
      user_pseudo_id,
      '-',
      CAST((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS STRING)
    ) AS session_id,
    event_name,
    event_timestamp,
    device.category AS device_category,
    geo.country AS country,
    traffic_source.source AS source,
    traffic_source.medium AS medium,
    traffic_source.name AS campaign,
    ecommerce.purchase_revenue AS purchase_revenue
  FROM `bigquery-public-data.ga4_obfuscated_sample_ecommerce.events_*`
  WHERE _TABLE_SUFFIX BETWEEN '20201101' AND '20210131'
),
session_funnel AS (
  SELECT
    session_id,
    ANY_VALUE(user_pseudo_id) AS user_pseudo_id,
    ANY_VALUE(device_category) AS device_category,
    ANY_VALUE(country) AS country,
    ANY_VALUE(COALESCE(source, '(direct)')) AS source,
    ANY_VALUE(COALESCE(medium, '(none)')) AS medium,
    ANY_VALUE(COALESCE(campaign, '(not set)')) AS campaign,
    MAX(IF(event_name = 'session_start', 1, 0)) AS did_session_start,
    MAX(IF(event_name = 'view_item', 1, 0)) AS did_view_item,
    MAX(IF(event_name = 'add_to_cart', 1, 0)) AS did_add_to_cart,
    MAX(IF(event_name = 'begin_checkout', 1, 0)) AS did_begin_checkout,
    MAX(IF(event_name = 'purchase', 1, 0)) AS did_purchase,
    SUM(IFNULL(purchase_revenue, 0)) AS session_revenue
  FROM session_events
  WHERE session_id IS NOT NULL
  GROUP BY session_id
)
SELECT *
FROM session_funnel;
