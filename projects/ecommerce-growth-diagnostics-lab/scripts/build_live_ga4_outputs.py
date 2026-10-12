"""Build live GA4 BigQuery summary outputs for the ecommerce case study."""

from __future__ import annotations

import json
from datetime import date, datetime, timezone
from decimal import Decimal
from pathlib import Path
from typing import Any

import pandas as pd


PROJECT_ID = "big-query-project-505612"
TABLE_PATTERN = "`bigquery-public-data.ga4_obfuscated_sample_ecommerce.events_*`"
TABLE_PATTERN_LABEL = "bigquery-public-data.ga4_obfuscated_sample_ecommerce.events_*"
START_SUFFIX = "20201101"
END_SUFFIX = "20210131"
START_DATE = "2020-11-01"
END_DATE = "2021-01-31"

PROJECT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = PROJECT_DIR / "data"


def query_dataframe(client: Any, sql: str) -> pd.DataFrame:
    return client.query(sql).to_dataframe()


def clean_value(value: Any) -> Any:
    if pd.isna(value):
        return None
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, pd.Timestamp):
        return value.date().isoformat()
    if isinstance(value, date):
        return value.isoformat()
    if hasattr(value, "item"):
        return value.item()
    return value


def records(df: pd.DataFrame) -> list[dict[str, Any]]:
    return [
        {str(key): clean_value(value) for key, value in row.items()}
        for row in df.to_dict(orient="records")
    ]


def one_record(df: pd.DataFrame) -> dict[str, Any]:
    return records(df)[0]


def as_int(value: Any) -> int:
    return int(value or 0)


def as_float(value: Any) -> float:
    return float(value or 0)


def rate(numerator: float, denominator: float) -> float:
    return numerator / denominator if denominator else 0.0


def build_findings(summary: dict[str, Any]) -> list[dict[str, str]]:
    kpis = summary["kpis"]
    funnel = summary["funnel"]
    channel = summary["channel"]
    categories = summary["categories"]
    device = summary["device"]
    geo = summary["geo"]

    step_drops = []
    for previous, current in zip(funnel, funnel[1:]):
        previous_value = as_float(previous["value"])
        current_value = as_float(current["value"])
        step_drops.append(
            {
                "from": previous["step"],
                "to": current["step"],
                "drop": 1 - rate(current_value, previous_value),
            }
        )
    largest_drop = max(step_drops, key=lambda item: item["drop"])
    top_channel = max(channel, key=lambda item: as_float(item["revenue"]))
    efficient_channel = max(channel, key=lambda item: as_float(item["conv"]))
    top_category = max(categories, key=lambda item: as_float(item["revenue"]))
    top_geo = max(geo, key=lambda item: as_float(item["revenue"]))
    device_by_name = {item["name"].lower(): item for item in device}
    desktop_conv = as_float(device_by_name.get("desktop", {}).get("conv"))
    mobile_conv = as_float(device_by_name.get("mobile", {}).get("conv"))
    mobile_gap = desktop_conv - mobile_conv

    return [
        {
            "title": "Traffic scale is large enough for funnel diagnosis",
            "metric": f"{kpis['sessions']:,} sessions and {kpis['purchases']:,} purchases across the sample period",
            "business_implication": "The data supports conversion diagnostics, not just top-line traffic reporting.",
        },
        {
            "title": "The largest funnel leak identifies the first optimization target",
            "metric": f"{largest_drop['from']} to {largest_drop['to']} loses {largest_drop['drop']:.1%} of sessions",
            "business_implication": "Prioritize the journey step with the largest loss before scaling acquisition spend.",
        },
        {
            "title": "Revenue concentration points to channel prioritization",
            "metric": f"{top_channel['name']} contributes ${as_float(top_channel['revenue']):,.0f} in revenue",
            "business_implication": "Compare high-revenue channels against high-efficiency channels before changing budget mix.",
        },
        {
            "title": "Efficient channels may be under-scaled",
            "metric": f"{efficient_channel['name']} converts at {as_float(efficient_channel['conv']):.1%}",
            "business_implication": "A smaller but efficient channel can justify lifecycle, SEO, or paid test expansion.",
        },
        {
            "title": "Merchandising should separate attention from conversion",
            "metric": f"{top_category['name']} leads category revenue with ${as_float(top_category['revenue']):,.0f}",
            "business_implication": "High-revenue categories deserve visibility, while high-view low-purchase categories need offer or product-page review.",
        },
        {
            "title": "Device experience is a measurable conversion lever",
            "metric": f"Desktop conversion exceeds mobile by {mobile_gap:.1%}" if mobile_gap > 0 else "Mobile conversion is at least as strong as desktop",
            "business_implication": "Device-level funnel differences help separate acquisition quality from user-experience friction.",
        },
        {
            "title": "Geography shapes where follow-up analysis should focus",
            "metric": f"{top_geo['country']} is the top revenue country at ${as_float(top_geo['revenue']):,.0f}",
            "business_implication": "Market concentration should influence localization, shipping, remarketing, and measurement priorities.",
        },
    ]


def feature_business_use(feature_group: str, feature_value: str, lift: float) -> str:
    direction = "above" if lift >= 1 else "below"
    if feature_group == "source_medium":
        return f"Use as an acquisition quality signal: this source / medium converts {direction} baseline."
    if feature_group == "device_category":
        return f"Use as a UX validation cut: this device converts {direction} baseline."
    if feature_group == "country":
        return f"Use as a market-prioritization signal: this country converts {direction} baseline."
    if feature_group == "item_category_seen":
        return f"Use as a merchandising signal: sessions touching this category convert {direction} baseline."
    if feature_group == "event_depth_bucket":
        return f"Use as an engagement-depth signal: these sessions convert {direction} baseline."
    if feature_group == "cart_intent":
        return "Use as a remarketing and cart-recovery audience signal."
    if feature_group == "checkout_start":
        return "Use as a checkout-completion and payment-friction signal."
    return f"Use as a conversion association signal: this segment converts {direction} baseline."


def add_feature_business_use(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    for row in rows:
        row["business_use"] = feature_business_use(
            str(row.get("feature_group", "")),
            str(row.get("feature_value", "")),
            as_float(row.get("lift_vs_baseline")),
        )
    return rows


def build_product_opportunity_matrix(product_rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    rows = [dict(row) for row in product_rows if row.get("name")]
    if not rows:
        return []

    view_threshold = sorted(as_float(row["views"]) for row in rows)[len(rows) // 2]
    conversion_threshold = sorted(as_float(row["viewToPurchase"]) for row in rows)[len(rows) // 2]

    for row in rows:
        high_attention = as_float(row["views"]) >= view_threshold
        high_conversion = as_float(row["viewToPurchase"]) >= conversion_threshold
        if high_attention and high_conversion:
            row["quadrant"] = "Scale / protect"
            row["recommended_action"] = "Keep visibility high; test bundles and cross-sells without disrupting purchase intent."
        elif high_attention and not high_conversion:
            row["quadrant"] = "Fix conversion"
            row["recommended_action"] = "Audit offer clarity, product detail page content, pricing, reviews, and shipping expectations."
        elif not high_attention and high_conversion:
            row["quadrant"] = "Increase visibility"
            row["recommended_action"] = "Promote in navigation, email, remarketing, or category modules to expose a high-intent category."
        else:
            row["quadrant"] = "Selective test"
            row["recommended_action"] = "Avoid broad investment until copy, targeting, or assortment tests show demand."
        row["attention_level"] = "high" if high_attention else "low"
        row["conversion_level"] = "high" if high_conversion else "low"
    return rows


def normalize(value: float, values: list[float]) -> float:
    if not values:
        return 0.0
    min_value = min(values)
    max_value = max(values)
    if max_value == min_value:
        return 1.0
    return (value - min_value) / (max_value - min_value)


def build_channel_quality_scorecard(channel_rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    rows = [dict(row) for row in channel_rows if as_float(row.get("sessions")) > 0]
    conversion_values = [as_float(row["conv"]) for row in rows]
    revenue_per_session_values = [
        rate(as_float(row["revenue"]), as_float(row["sessions"]))
        for row in rows
    ]
    cart_rate_values = [
        rate(as_float(row["cart_sessions"]), as_float(row["sessions"]))
        for row in rows
    ]

    for row in rows:
        sessions = as_float(row["sessions"])
        row["view_rate"] = rate(as_float(row["product_view_sessions"]), sessions)
        row["cart_rate"] = rate(as_float(row["cart_sessions"]), sessions)
        row["revenue_per_session"] = rate(as_float(row["revenue"]), sessions)
        score = (
            normalize(as_float(row["conv"]), conversion_values) * 0.45
            + normalize(row["revenue_per_session"], revenue_per_session_values) * 0.4
            + normalize(row["cart_rate"], cart_rate_values) * 0.15
        )
        row["quality_score"] = round(score * 100, 1)
        if row["quality_score"] >= 75:
            row["strategic_read"] = "High-quality channel: protect tracking, landing pages, and budget tests."
        elif row["quality_score"] >= 50:
            row["strategic_read"] = "Promising channel: inspect volume constraints and audience quality."
        else:
            row["strategic_read"] = "Efficiency risk: improve landing intent before scaling traffic."
    return sorted(rows, key=lambda item: item["quality_score"], reverse=True)


def add_step_driver_read(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    for row in rows:
        lift = as_float(row.get("lift_vs_baseline"))
        direction = "above" if lift >= 1 else "below"
        row["strategic_read"] = (
            f"This segment converts {direction} the step baseline, so use it to separate "
            "journey friction from audience quality."
        )
    return rows


def build_experiment_backlog(summary: dict[str, Any], analysis: dict[str, Any]) -> list[dict[str, str]]:
    step_drivers = analysis["step_drivers"]
    product_matrix = analysis["product_opportunity_matrix"]
    channel_scorecard = analysis["channel_quality_scorecard"]
    feature_associations = analysis["feature_associations"]

    view_to_cart = step_drivers["view_to_cart"][0]
    cart_to_checkout = step_drivers["cart_to_checkout"][0]
    checkout_to_purchase = step_drivers["checkout_to_purchase"][0]
    fix_products = [row for row in product_matrix if row["quadrant"] == "Fix conversion"]
    visibility_products = [row for row in product_matrix if row["quadrant"] == "Increase visibility"]
    top_channel = channel_scorecard[0]
    best_feature = feature_associations[0]

    experiments = [
        {
            "priority": "P1",
            "hypothesis": f"Improving the {view_to_cart['feature_value']} path will increase product-view to cart progression.",
            "segment": f"{view_to_cart['feature_group']}: {view_to_cart['feature_value']}",
            "primary_metric": "view_item -> add_to_cart rate",
            "secondary_metric": "purchase rate and revenue per session",
            "measurement_plan": "Rebuild the session mart, compare eligible sessions before and after the product-page change, and use SAFE_DIVIDE for step conversion.",
        },
        {
            "priority": "P1",
            "hypothesis": f"Reducing cart friction for {cart_to_checkout['feature_value']} will increase checkout starts.",
            "segment": f"{cart_to_checkout['feature_group']}: {cart_to_checkout['feature_value']}",
            "primary_metric": "add_to_cart -> begin_checkout rate",
            "secondary_metric": "checkout starts per 100 sessions",
            "measurement_plan": "Measure cart sessions by segment and compare begin_checkout progression across matched periods.",
        },
        {
            "priority": "P2",
            "hypothesis": f"Checkout reassurance for {checkout_to_purchase['feature_value']} will lift completed purchases.",
            "segment": f"{checkout_to_purchase['feature_group']}: {checkout_to_purchase['feature_value']}",
            "primary_metric": "begin_checkout -> purchase rate",
            "secondary_metric": "purchase revenue and average order value",
            "measurement_plan": "Track checkout sessions, payment completion, and revenue by segment after trust, shipping, or payment changes.",
        },
        {
            "priority": "P2",
            "hypothesis": f"{top_channel['name']} can absorb more demand without degrading conversion quality.",
            "segment": f"source / medium: {top_channel['name']}",
            "primary_metric": "revenue per session",
            "secondary_metric": "session-to-purchase rate",
            "measurement_plan": "Compare channel quality score, conversion, and revenue per session before and after controlled traffic expansion.",
        },
        {
            "priority": "P2",
            "hypothesis": f"Sessions with {best_feature['feature_group']}={best_feature['feature_value']} represent a higher-intent audience for remarketing.",
            "segment": f"{best_feature['feature_group']}: {best_feature['feature_value']}",
            "primary_metric": "purchase rate",
            "secondary_metric": "cart rate and revenue per session",
            "measurement_plan": "Build audience rules from the feature value and compare conversion lift against the site baseline.",
        },
    ]

    if fix_products:
        product = fix_products[0]
        experiments.append(
            {
                "priority": "P3",
                "hypothesis": f"{product['name']} has attention but can convert better with offer and PDP improvements.",
                "segment": f"item category: {product['name']}",
                "primary_metric": "view_item -> purchase rate",
                "secondary_metric": "cart add rate and item revenue",
                "measurement_plan": "Use UNNEST(items) to compare item-category views, cart adds, purchases, and revenue before and after PDP changes.",
            }
        )
    if visibility_products:
        product = visibility_products[0]
        experiments.append(
            {
                "priority": "P3",
                "hypothesis": f"{product['name']} converts well enough to justify more homepage or lifecycle visibility.",
                "segment": f"item category: {product['name']}",
                "primary_metric": "category revenue per exposed session",
                "secondary_metric": "view-to-purchase rate",
                "measurement_plan": "Track sessions exposed to the category module and compare purchase/revenue outcomes with the item-level table.",
            }
        )
    return experiments


def main() -> None:
    from google.cloud import bigquery

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    client = bigquery.Client(project=PROJECT_ID)

    baseline_sql = f"""
    WITH events AS (
      SELECT
        event_date,
        user_pseudo_id,
        CONCAT(
          user_pseudo_id,
          '-',
          CAST((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS STRING)
        ) AS session_id,
        event_name,
        ecommerce.purchase_revenue AS purchase_revenue
      FROM {TABLE_PATTERN}
      WHERE _TABLE_SUFFIX BETWEEN '{START_SUFFIX}' AND '{END_SUFFIX}'
    )
    SELECT
      COUNT(*) AS row_count,
      COUNT(DISTINCT user_pseudo_id) AS users,
      COUNT(DISTINCT session_id) AS sessions,
      COUNT(DISTINCT event_date) AS days,
      COUNTIF(event_name = 'view_item') AS product_views,
      COUNTIF(event_name = 'add_to_cart') AS cart_events,
      COUNTIF(event_name = 'begin_checkout') AS checkout_events,
      COUNTIF(event_name = 'purchase') AS purchases,
      SUM(IFNULL(purchase_revenue, 0)) AS revenue,
      SAFE_DIVIDE(SUM(IFNULL(purchase_revenue, 0)), COUNTIF(event_name = 'purchase')) AS aov
    FROM events;
    """

    funnel_sql = f"""
    WITH session_events AS (
      SELECT
        user_pseudo_id,
        CONCAT(
          user_pseudo_id,
          '-',
          CAST((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS STRING)
        ) AS session_id,
        event_name
      FROM {TABLE_PATTERN}
      WHERE _TABLE_SUFFIX BETWEEN '{START_SUFFIX}' AND '{END_SUFFIX}'
    ),
    session_flags AS (
      SELECT
        session_id,
        ANY_VALUE(user_pseudo_id) AS user_pseudo_id,
        MAX(IF(event_name = 'session_start', 1, 0)) AS did_session_start,
        MAX(IF(event_name = 'view_item', 1, 0)) AS did_view_item,
        MAX(IF(event_name = 'add_to_cart', 1, 0)) AS did_add_to_cart,
        MAX(IF(event_name = 'begin_checkout', 1, 0)) AS did_begin_checkout,
        MAX(IF(event_name = 'purchase', 1, 0)) AS did_purchase
      FROM session_events
      WHERE session_id IS NOT NULL
      GROUP BY session_id
    ),
    funnel AS (
      SELECT 1 AS step_order, 'Session start' AS step, COUNTIF(did_session_start = 1) AS value, COUNT(DISTINCT IF(did_session_start = 1, user_pseudo_id, NULL)) AS users FROM session_flags UNION ALL
      SELECT 2, 'View item', COUNTIF(did_view_item = 1), COUNT(DISTINCT IF(did_view_item = 1, user_pseudo_id, NULL)) FROM session_flags UNION ALL
      SELECT 3, 'Add to cart', COUNTIF(did_add_to_cart = 1), COUNT(DISTINCT IF(did_add_to_cart = 1, user_pseudo_id, NULL)) FROM session_flags UNION ALL
      SELECT 4, 'Begin checkout', COUNTIF(did_begin_checkout = 1), COUNT(DISTINCT IF(did_begin_checkout = 1, user_pseudo_id, NULL)) FROM session_flags UNION ALL
      SELECT 5, 'Purchase', COUNTIF(did_purchase = 1), COUNT(DISTINCT IF(did_purchase = 1, user_pseudo_id, NULL)) FROM session_flags
    )
    SELECT
      step_order,
      step,
      value,
      users,
      SAFE_DIVIDE(value, LAG(value) OVER (ORDER BY step_order)) AS step_conversion,
      SAFE_DIVIDE(value, FIRST_VALUE(value) OVER (ORDER BY step_order)) AS total_conversion
    FROM funnel
    ORDER BY step_order;
    """

    session_mart = f"""
    WITH session_events AS (
      SELECT
        user_pseudo_id,
        CONCAT(
          user_pseudo_id,
          '-',
          CAST((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS STRING)
        ) AS session_id,
        event_name,
        COALESCE(traffic_source.source, '(direct)') AS source,
        COALESCE(traffic_source.medium, '(none)') AS medium,
        device.category AS device_category,
        geo.country AS country,
        ecommerce.purchase_revenue AS purchase_revenue
      FROM {TABLE_PATTERN}
      WHERE _TABLE_SUFFIX BETWEEN '{START_SUFFIX}' AND '{END_SUFFIX}'
    )
    SELECT
      session_id,
      ANY_VALUE(user_pseudo_id) AS user_pseudo_id,
      ANY_VALUE(source) AS source,
      ANY_VALUE(medium) AS medium,
      ANY_VALUE(device_category) AS device_category,
      ANY_VALUE(country) AS country,
      MAX(IF(event_name = 'view_item', 1, 0)) AS did_view_item,
      MAX(IF(event_name = 'add_to_cart', 1, 0)) AS did_add_to_cart,
      MAX(IF(event_name = 'begin_checkout', 1, 0)) AS did_begin_checkout,
      MAX(IF(event_name = 'purchase', 1, 0)) AS did_purchase,
      COUNT(*) AS event_count,
      SUM(IFNULL(purchase_revenue, 0)) AS revenue
    FROM session_events
    WHERE session_id IS NOT NULL
    GROUP BY session_id
    """

    channel_sql = f"""
    WITH session_mart AS ({session_mart})
    SELECT
      CONCAT(source, ' / ', medium) AS name,
      COUNT(*) AS sessions,
      SUM(did_view_item) AS product_view_sessions,
      SUM(did_add_to_cart) AS cart_sessions,
      SUM(did_purchase) AS purchases,
      SUM(revenue) AS revenue,
      SAFE_DIVIDE(SUM(did_purchase), COUNT(*)) AS conv,
      SAFE_DIVIDE(SUM(revenue), NULLIF(SUM(did_purchase), 0)) AS aov
    FROM session_mart
    GROUP BY name
    HAVING sessions >= 25
    ORDER BY revenue DESC
    LIMIT 8;
    """

    product_sql = f"""
    WITH item_events AS (
      SELECT
        event_name,
        COALESCE(item.item_category, '(not set)') AS name,
        item.item_name AS item_name,
        item.item_revenue AS item_revenue
      FROM {TABLE_PATTERN},
      UNNEST(items) AS item
      WHERE _TABLE_SUFFIX BETWEEN '{START_SUFFIX}' AND '{END_SUFFIX}'
    )
    SELECT
      name,
      COUNTIF(event_name = 'view_item') AS views,
      COUNTIF(event_name = 'add_to_cart') AS cart_adds,
      COUNTIF(event_name = 'purchase') AS purchases,
      SUM(IFNULL(item_revenue, 0)) AS revenue,
      SAFE_DIVIDE(COUNTIF(event_name = 'add_to_cart'), COUNTIF(event_name = 'view_item')) AS view_to_cart,
      SAFE_DIVIDE(COUNTIF(event_name = 'purchase'), COUNTIF(event_name = 'view_item')) AS viewToPurchase
    FROM item_events
    GROUP BY name
    ORDER BY revenue DESC
    LIMIT 8;
    """

    pareto_sql = f"""
    WITH product_revenue AS (
      SELECT
        item.item_name AS item_name,
        SUM(IFNULL(item.item_revenue, 0)) AS revenue
      FROM {TABLE_PATTERN},
      UNNEST(items) AS item
      WHERE _TABLE_SUFFIX BETWEEN '{START_SUFFIX}' AND '{END_SUFFIX}'
      GROUP BY item_name
      HAVING revenue > 0
    ),
    ranked AS (
      SELECT
        item_name,
        revenue,
        ROW_NUMBER() OVER (ORDER BY revenue DESC) AS product_rank,
        SAFE_DIVIDE(
          SUM(revenue) OVER (ORDER BY revenue DESC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW),
          SUM(revenue) OVER ()
        ) * 100 AS cumulative_revenue_share
      FROM product_revenue
    )
    SELECT product_rank, item_name, revenue, cumulative_revenue_share
    FROM ranked
    ORDER BY product_rank
    LIMIT 20;
    """

    device_sql = f"""
    WITH session_mart AS ({session_mart})
    SELECT
      device_category AS name,
      COUNT(*) AS sessions,
      SUM(did_purchase) AS purchases,
      SUM(revenue) AS revenue,
      SAFE_DIVIDE(SUM(did_purchase), COUNT(*)) AS conv
    FROM session_mart
    GROUP BY name
    ORDER BY sessions DESC;
    """

    geo_sql = f"""
    WITH session_mart AS ({session_mart})
    SELECT
      country,
      COUNT(*) AS sessions,
      SUM(did_purchase) AS purchases,
      SUM(revenue) AS revenue,
      SAFE_DIVIDE(SUM(did_purchase), COUNT(*)) AS conv
    FROM session_mart
    GROUP BY country
    ORDER BY revenue DESC
    LIMIT 8;
    """

    loyalty_sql = f"""
    WITH user_purchases AS (
      SELECT
        user_pseudo_id,
        COUNTIF(event_name = 'purchase') AS purchase_events,
        SUM(IFNULL(ecommerce.purchase_revenue, 0)) AS revenue
      FROM {TABLE_PATTERN}
      WHERE _TABLE_SUFFIX BETWEEN '{START_SUFFIX}' AND '{END_SUFFIX}'
      GROUP BY user_pseudo_id
    )
    SELECT
      CASE
        WHEN purchase_events = 0 THEN 'No purchase'
        WHEN purchase_events = 1 THEN 'One-time buyer'
        ELSE 'Repeat buyer'
      END AS segment,
      COUNT(*) AS users,
      SUM(purchase_events) AS purchases,
      SUM(revenue) AS revenue
    FROM user_purchases
    GROUP BY segment
    ORDER BY
      CASE segment
        WHEN 'No purchase' THEN 1
        WHEN 'One-time buyer' THEN 2
        ELSE 3
      END;
    """

    daily_sql = f"""
    WITH events AS (
      SELECT
        PARSE_DATE('%Y%m%d', event_date) AS event_day,
        CONCAT(
          user_pseudo_id,
          '-',
          CAST((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS STRING)
        ) AS session_id,
        event_name,
        ecommerce.purchase_revenue AS purchase_revenue
      FROM {TABLE_PATTERN}
      WHERE _TABLE_SUFFIX BETWEEN '{START_SUFFIX}' AND '{END_SUFFIX}'
    )
    SELECT
      event_day,
      COUNT(DISTINCT session_id) AS sessions,
      COUNTIF(event_name = 'purchase') AS purchases,
      SUM(IFNULL(purchase_revenue, 0)) AS revenue
    FROM events
    GROUP BY event_day
    ORDER BY event_day;
    """

    feature_association_sql = f"""
    WITH session_mart AS ({session_mart}),
    session_categories AS (
      SELECT DISTINCT
        CONCAT(
          user_pseudo_id,
          '-',
          CAST((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS STRING)
        ) AS session_id,
        COALESCE(item.item_category, '(not set)') AS item_category
      FROM {TABLE_PATTERN},
      UNNEST(items) AS item
      WHERE _TABLE_SUFFIX BETWEEN '{START_SUFFIX}' AND '{END_SUFFIX}'
    ),
    base AS (
      SELECT SAFE_DIVIDE(SUM(did_purchase), COUNT(*)) AS baseline_conversion_rate
      FROM session_mart
    ),
    features AS (
      SELECT
        'source_medium' AS feature_group,
        CONCAT(source, ' / ', medium) AS feature_value,
        session_id,
        did_purchase,
        revenue
      FROM session_mart
      UNION ALL
      SELECT 'device_category', COALESCE(device_category, '(not set)'), session_id, did_purchase, revenue
      FROM session_mart
      UNION ALL
      SELECT 'country', COALESCE(country, '(not set)'), session_id, did_purchase, revenue
      FROM session_mart
      UNION ALL
      SELECT 'item_category_seen', item_category, m.session_id, did_purchase, revenue
      FROM session_mart AS m
      JOIN session_categories AS c
      USING (session_id)
      UNION ALL
      SELECT
        'event_depth_bucket',
        CASE
          WHEN event_count < 5 THEN '0-4 events'
          WHEN event_count < 10 THEN '5-9 events'
          WHEN event_count < 20 THEN '10-19 events'
          WHEN event_count < 40 THEN '20-39 events'
          ELSE '40+ events'
        END,
        session_id,
        did_purchase,
        revenue
      FROM session_mart
      UNION ALL
      SELECT 'cart_intent', IF(did_add_to_cart = 1, 'Added to cart', 'No cart add'), session_id, did_purchase, revenue
      FROM session_mart
      UNION ALL
      SELECT 'checkout_start', IF(did_begin_checkout = 1, 'Started checkout', 'No checkout'), session_id, did_purchase, revenue
      FROM session_mart
    ),
    scored AS (
      SELECT
        feature_group,
        feature_value,
        COUNT(*) AS sessions,
        SUM(did_purchase) AS purchases,
        ROUND(SUM(revenue), 2) AS revenue,
        SAFE_DIVIDE(SUM(did_purchase), COUNT(*)) AS conversion_rate,
        SAFE_DIVIDE(SUM(revenue), COUNT(*)) AS revenue_per_session,
        ANY_VALUE(base.baseline_conversion_rate) AS baseline_conversion_rate,
        SAFE_DIVIDE(
          SAFE_DIVIDE(SUM(did_purchase), COUNT(*)),
          ANY_VALUE(base.baseline_conversion_rate)
        ) AS lift_vs_baseline
      FROM features
      CROSS JOIN base
      WHERE feature_value IS NOT NULL
      GROUP BY feature_group, feature_value
      HAVING COUNT(*) >= 250
    )
    SELECT *
    FROM scored
    ORDER BY lift_vs_baseline DESC, revenue_per_session DESC, sessions DESC
    LIMIT 60;
    """

    step_driver_sql = f"""
    WITH session_mart AS ({session_mart}),
    session_category_counts AS (
      SELECT
        CONCAT(
          user_pseudo_id,
          '-',
          CAST((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS STRING)
        ) AS session_id,
        COALESCE(item.item_category, '(not set)') AS item_category,
        COUNTIF(event_name = 'view_item') AS item_views,
        SUM(IFNULL(item.item_revenue, 0)) AS item_revenue
      FROM {TABLE_PATTERN},
      UNNEST(items) AS item
      WHERE _TABLE_SUFFIX BETWEEN '{START_SUFFIX}' AND '{END_SUFFIX}'
      GROUP BY session_id, item_category
    ),
    primary_category AS (
      SELECT
        session_id,
        ARRAY_AGG(item_category ORDER BY item_views DESC, item_revenue DESC, item_category LIMIT 1)[OFFSET(0)] AS primary_item_category
      FROM session_category_counts
      WHERE session_id IS NOT NULL
      GROUP BY session_id
    ),
    analysis_sessions AS (
      SELECT
        m.*,
        CONCAT(source, ' / ', medium) AS source_medium,
        p.primary_item_category,
        CASE
          WHEN event_count < 5 THEN '0-4 events'
          WHEN event_count < 10 THEN '5-9 events'
          WHEN event_count < 20 THEN '10-19 events'
          WHEN event_count < 40 THEN '20-39 events'
          ELSE '40+ events'
        END AS event_depth_bucket
      FROM session_mart AS m
      LEFT JOIN primary_category AS p
      USING (session_id)
    ),
    step_baselines AS (
      SELECT
        'view_to_cart' AS step_key,
        SAFE_DIVIDE(SUM(IF(did_view_item = 1, did_add_to_cart, 0)), SUM(did_view_item)) AS baseline_step_rate
      FROM analysis_sessions
      UNION ALL
      SELECT
        'cart_to_checkout',
        SAFE_DIVIDE(SUM(IF(did_add_to_cart = 1, did_begin_checkout, 0)), SUM(did_add_to_cart))
      FROM analysis_sessions
      UNION ALL
      SELECT
        'checkout_to_purchase',
        SAFE_DIVIDE(SUM(IF(did_begin_checkout = 1, did_purchase, 0)), SUM(did_begin_checkout))
      FROM analysis_sessions
    ),
    step_features AS (
      SELECT 'view_to_cart' AS step_key, 'View item -> Add to cart' AS step_name, 'source_medium' AS feature_group, source_medium AS feature_value, did_view_item AS eligible, did_add_to_cart AS converted FROM analysis_sessions UNION ALL
      SELECT 'view_to_cart', 'View item -> Add to cart', 'device_category', device_category, did_view_item, did_add_to_cart FROM analysis_sessions UNION ALL
      SELECT 'view_to_cart', 'View item -> Add to cart', 'country', country, did_view_item, did_add_to_cart FROM analysis_sessions UNION ALL
      SELECT 'view_to_cart', 'View item -> Add to cart', 'primary_item_category', primary_item_category, did_view_item, did_add_to_cart FROM analysis_sessions UNION ALL
      SELECT 'view_to_cart', 'View item -> Add to cart', 'event_depth_bucket', event_depth_bucket, did_view_item, did_add_to_cart FROM analysis_sessions UNION ALL

      SELECT 'cart_to_checkout', 'Add to cart -> Begin checkout', 'source_medium', source_medium, did_add_to_cart, did_begin_checkout FROM analysis_sessions UNION ALL
      SELECT 'cart_to_checkout', 'Add to cart -> Begin checkout', 'device_category', device_category, did_add_to_cart, did_begin_checkout FROM analysis_sessions UNION ALL
      SELECT 'cart_to_checkout', 'Add to cart -> Begin checkout', 'country', country, did_add_to_cart, did_begin_checkout FROM analysis_sessions UNION ALL
      SELECT 'cart_to_checkout', 'Add to cart -> Begin checkout', 'primary_item_category', primary_item_category, did_add_to_cart, did_begin_checkout FROM analysis_sessions UNION ALL
      SELECT 'cart_to_checkout', 'Add to cart -> Begin checkout', 'event_depth_bucket', event_depth_bucket, did_add_to_cart, did_begin_checkout FROM analysis_sessions UNION ALL

      SELECT 'checkout_to_purchase', 'Begin checkout -> Purchase', 'source_medium', source_medium, did_begin_checkout, did_purchase FROM analysis_sessions UNION ALL
      SELECT 'checkout_to_purchase', 'Begin checkout -> Purchase', 'device_category', device_category, did_begin_checkout, did_purchase FROM analysis_sessions UNION ALL
      SELECT 'checkout_to_purchase', 'Begin checkout -> Purchase', 'country', country, did_begin_checkout, did_purchase FROM analysis_sessions UNION ALL
      SELECT 'checkout_to_purchase', 'Begin checkout -> Purchase', 'primary_item_category', primary_item_category, did_begin_checkout, did_purchase FROM analysis_sessions UNION ALL
      SELECT 'checkout_to_purchase', 'Begin checkout -> Purchase', 'event_depth_bucket', event_depth_bucket, did_begin_checkout, did_purchase FROM analysis_sessions
    ),
    scored AS (
      SELECT
        step_key,
        step_name,
        feature_group,
        COALESCE(feature_value, '(not set)') AS feature_value,
        SUM(eligible) AS eligible_sessions,
        SUM(IF(eligible = 1, converted, 0)) AS converted_sessions,
        SAFE_DIVIDE(SUM(IF(eligible = 1, converted, 0)), SUM(eligible)) AS step_conversion_rate,
        ANY_VALUE(b.baseline_step_rate) AS baseline_step_rate,
        SAFE_DIVIDE(
          SAFE_DIVIDE(SUM(IF(eligible = 1, converted, 0)), SUM(eligible)),
          ANY_VALUE(b.baseline_step_rate)
        ) AS lift_vs_baseline
      FROM step_features
      JOIN step_baselines AS b
      USING (step_key)
      GROUP BY step_key, step_name, feature_group, feature_value
      HAVING SUM(eligible) >= 200
    ),
    ranked AS (
      SELECT
        *,
        ROW_NUMBER() OVER (
          PARTITION BY step_key
          ORDER BY ABS(lift_vs_baseline - 1) DESC, eligible_sessions DESC
        ) AS step_rank
      FROM scored
    )
    SELECT * EXCEPT(step_rank)
    FROM ranked
    WHERE step_rank <= 8
    ORDER BY step_key, ABS(lift_vs_baseline - 1) DESC, eligible_sessions DESC;
    """

    baseline_df = query_dataframe(client, baseline_sql)
    funnel_df = query_dataframe(client, funnel_sql)
    channel_df = query_dataframe(client, channel_sql)
    product_df = query_dataframe(client, product_sql)
    pareto_df = query_dataframe(client, pareto_sql)
    device_df = query_dataframe(client, device_sql)
    geo_df = query_dataframe(client, geo_sql)
    loyalty_df = query_dataframe(client, loyalty_sql)
    daily_df = query_dataframe(client, daily_sql)
    feature_association_df = query_dataframe(client, feature_association_sql)
    step_driver_df = query_dataframe(client, step_driver_sql)

    kpis = one_record(baseline_df)
    kpis["sessions"] = as_int(kpis["sessions"])
    kpis["users"] = as_int(kpis["users"])
    kpis["row_count"] = as_int(kpis["row_count"])
    kpis["product_views"] = as_int(kpis["product_views"])
    kpis["cart_events"] = as_int(kpis["cart_events"])
    kpis["checkout_events"] = as_int(kpis["checkout_events"])
    kpis["purchases"] = as_int(kpis["purchases"])
    kpis["revenue"] = round(as_float(kpis["revenue"]), 2)
    kpis["aov"] = round(as_float(kpis["aov"]), 2)
    kpis["session_to_purchase_rate"] = rate(kpis["purchases"], kpis["sessions"])
    kpis["view_to_cart_rate"] = rate(kpis["cart_events"], kpis["product_views"])

    feature_associations = add_feature_business_use(records(feature_association_df))
    step_driver_rows = add_step_driver_read(records(step_driver_df))
    step_drivers = {
        "view_to_cart": [row for row in step_driver_rows if row["step_key"] == "view_to_cart"],
        "cart_to_checkout": [row for row in step_driver_rows if row["step_key"] == "cart_to_checkout"],
        "checkout_to_purchase": [row for row in step_driver_rows if row["step_key"] == "checkout_to_purchase"],
    }
    product_opportunity_matrix = build_product_opportunity_matrix(records(product_df))
    channel_quality_scorecard = build_channel_quality_scorecard(records(channel_df))

    summary = {
        "source": {
            "type": "live_bigquery",
            "project_id": PROJECT_ID,
            "table_pattern": TABLE_PATTERN_LABEL,
            "official_docs": "https://developers.google.com/analytics/bigquery/web-ecommerce-demo-dataset",
        },
        "date_range": {"start": START_DATE, "end": END_DATE},
        "kpis": kpis,
        "funnel": records(funnel_df),
        "channel": records(channel_df),
        "categories": records(product_df),
        "paretoProducts": records(pareto_df),
        "pareto": [round(as_float(value), 2) for value in pareto_df["cumulative_revenue_share"].tolist()],
        "device": records(device_df),
        "geo": records(geo_df),
        "loyalty": records(loyalty_df),
        "daily": records(daily_df),
        "metadata": {
            "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "modeled": False,
            "caveat": "Google's public GA4 ecommerce dataset is obfuscated sample data, so findings are presented as portfolio analytics patterns rather than commercial claims about the live store.",
        },
    }
    optimization_analysis = {
        "feature_associations": feature_associations,
        "step_drivers": step_drivers,
        "product_opportunity_matrix": product_opportunity_matrix,
        "channel_quality_scorecard": channel_quality_scorecard,
    }
    optimization_analysis["experiment_backlog"] = build_experiment_backlog(summary, optimization_analysis)
    summary["optimization_analysis"] = optimization_analysis
    summary["findings"] = build_findings(summary)

    json_path = DATA_DIR / "live_ga4_summary.json"
    js_path = DATA_DIR / "live_ga4_summary.js"
    json_text = json.dumps(summary, indent=2, ensure_ascii=True)
    json_path.write_text(json_text + "\n", encoding="utf-8")
    js_path.write_text("window.ga4LiveSummary = " + json_text + ";\n", encoding="utf-8")

    funnel_df.to_csv(DATA_DIR / "funnel_summary.csv", index=False)
    channel_df.to_csv(DATA_DIR / "channel_summary.csv", index=False)
    product_df.to_csv(DATA_DIR / "product_category_summary.csv", index=False)
    device_df.to_csv(DATA_DIR / "device_summary.csv", index=False)
    geo_df.to_csv(DATA_DIR / "geography_summary.csv", index=False)
    daily_df.to_csv(DATA_DIR / "daily_summary.csv", index=False)
    pd.DataFrame(feature_associations).to_csv(DATA_DIR / "feature_associations.csv", index=False)
    pd.DataFrame(step_driver_rows).to_csv(DATA_DIR / "step_driver_summary.csv", index=False)
    pd.DataFrame(product_opportunity_matrix).to_csv(DATA_DIR / "product_opportunity_matrix.csv", index=False)
    pd.DataFrame(channel_quality_scorecard).to_csv(DATA_DIR / "channel_quality_scorecard.csv", index=False)
    pd.DataFrame(optimization_analysis["experiment_backlog"]).to_csv(DATA_DIR / "experiment_backlog.csv", index=False)

    print(f"Wrote {json_path}")
    print(f"Wrote {js_path}")


if __name__ == "__main__":
    main()
