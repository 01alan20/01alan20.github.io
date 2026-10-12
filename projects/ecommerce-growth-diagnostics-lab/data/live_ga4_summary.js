window.ga4LiveSummary = {
  "source": {
    "type": "live_bigquery",
    "project_id": "big-query-project-505612",
    "table_pattern": "bigquery-public-data.ga4_obfuscated_sample_ecommerce.events_*",
    "official_docs": "https://developers.google.com/analytics/bigquery/web-ecommerce-demo-dataset"
  },
  "date_range": {
    "start": "2020-11-01",
    "end": "2021-01-31"
  },
  "kpis": {
    "row_count": 4295584,
    "users": 270154,
    "sessions": 360129,
    "days": 92,
    "product_views": 386068,
    "cart_events": 58543,
    "checkout_events": 38757,
    "purchases": 5692,
    "revenue": 362165.0,
    "aov": 63.63,
    "session_to_purchase_rate": 0.015805447492426326,
    "view_to_cart_rate": 0.15163908948682617
  },
  "funnel": [
    {
      "step_order": 1,
      "step": "Session start",
      "value": 354857,
      "users": 267116,
      "step_conversion": null,
      "total_conversion": 1.0
    },
    {
      "step_order": 2,
      "step": "View item",
      "value": 77020,
      "users": 61252,
      "step_conversion": 0.2170451759441127,
      "total_conversion": 0.2170451759441127
    },
    {
      "step_order": 3,
      "step": "Add to cart",
      "value": 15188,
      "users": 12545,
      "step_conversion": 0.19719553362762918,
      "total_conversion": 0.04280033929160197
    },
    {
      "step_order": 4,
      "step": "Begin checkout",
      "value": 11106,
      "users": 9715,
      "step_conversion": 0.7312351856728997,
      "total_conversion": 0.031297114048757665
    },
    {
      "step_order": 5,
      "step": "Purchase",
      "value": 4848,
      "users": 4419,
      "step_conversion": 0.4365207995678012,
      "total_conversion": 0.013661841248728362
    }
  ],
  "channel": [
    {
      "name": "google / organic",
      "sessions": 112678,
      "product_view_sessions": 23663,
      "cart_sessions": 4341,
      "purchases": 1250,
      "revenue": 95775.0,
      "conv": 0.011093558636113526,
      "aov": 76.62
    },
    {
      "name": "(direct) / (none)",
      "sessions": 83459,
      "product_view_sessions": 17678,
      "cart_sessions": 3512,
      "purchases": 1079,
      "revenue": 79650.0,
      "conv": 0.012928503816245102,
      "aov": 73.81835032437442
    },
    {
      "name": "(data deleted) / (data deleted)",
      "sessions": 22233,
      "product_view_sessions": 5656,
      "cart_sessions": 1450,
      "purchases": 698,
      "revenue": 50064.0,
      "conv": 0.03139477353483561,
      "aov": 71.72492836676217
    },
    {
      "name": "shop.googlemerchandisestore.com / referral",
      "sessions": 28849,
      "product_view_sessions": 6634,
      "cart_sessions": 1463,
      "purchases": 585,
      "revenue": 46521.0,
      "conv": 0.020277999237408577,
      "aov": 79.52307692307693
    },
    {
      "name": "<Other> / referral",
      "sessions": 34672,
      "product_view_sessions": 7455,
      "cart_sessions": 1459,
      "purchases": 471,
      "revenue": 37000.0,
      "conv": 0.01358444854637748,
      "aov": 78.55626326963906
    },
    {
      "name": "<Other> / <Other>",
      "sessions": 52057,
      "product_view_sessions": 10589,
      "cart_sessions": 1983,
      "purchases": 506,
      "revenue": 35470.0,
      "conv": 0.009720114489886087,
      "aov": 70.09881422924902
    },
    {
      "name": "google / cpc",
      "sessions": 15617,
      "product_view_sessions": 3167,
      "cart_sessions": 564,
      "purchases": 153,
      "revenue": 9056.0,
      "conv": 0.009797016072228982,
      "aov": 59.189542483660134
    },
    {
      "name": "<Other> / organic",
      "sessions": 10163,
      "product_view_sessions": 2077,
      "cart_sessions": 394,
      "purchases": 97,
      "revenue": 8232.0,
      "conv": 0.009544425858506346,
      "aov": 84.8659793814433
    }
  ],
  "categories": [
    {
      "name": "Apparel",
      "views": 7426,
      "cart_adds": 1711,
      "purchases": 4984,
      "revenue": 171727.0,
      "view_to_cart": 0.23040667923511984,
      "viewToPurchase": 0.6711553999461352
    },
    {
      "name": "New",
      "views": 2448,
      "cart_adds": 513,
      "purchases": 1445,
      "revenue": 25813.0,
      "view_to_cart": 0.20955882352941177,
      "viewToPurchase": 0.5902777777777778
    },
    {
      "name": "Bags",
      "views": 5433,
      "cart_adds": 540,
      "purchases": 704,
      "revenue": 23860.0,
      "view_to_cart": 0.09939260077305356,
      "viewToPurchase": 0.12957850174857352
    },
    {
      "name": "Campus Collection",
      "views": 3685,
      "cart_adds": 1418,
      "purchases": 1497,
      "revenue": 20061.0,
      "view_to_cart": 0.3848032564450475,
      "viewToPurchase": 0.4062415196743555
    },
    {
      "name": "Accessories",
      "views": 57,
      "cart_adds": 0,
      "purchases": 1276,
      "revenue": 17815.0,
      "view_to_cart": 0.0,
      "viewToPurchase": 22.385964912280702
    },
    {
      "name": "Uncategorized Items",
      "views": 0,
      "cart_adds": 0,
      "purchases": 608,
      "revenue": 17394.0,
      "view_to_cart": null,
      "viewToPurchase": null
    },
    {
      "name": "Shop by Brand",
      "views": 1160,
      "cart_adds": 357,
      "purchases": 816,
      "revenue": 16960.0,
      "view_to_cart": 0.30775862068965515,
      "viewToPurchase": 0.7034482758620689
    },
    {
      "name": "Drinkware",
      "views": 7809,
      "cart_adds": 2125,
      "purchases": 709,
      "revenue": 15807.0,
      "view_to_cart": 0.272121910615956,
      "viewToPurchase": 0.09079267511845307
    }
  ],
  "paretoProducts": [
    {
      "product_rank": 1,
      "item_name": "Google Zip Hoodie F/C",
      "revenue": 13788.0,
      "cumulative_revenue_share": 3.807682748336141
    },
    {
      "product_rank": 2,
      "item_name": "Google Crewneck Sweatshirt Navy",
      "revenue": 10714.0,
      "cumulative_revenue_share": 6.766452183038303
    },
    {
      "product_rank": 3,
      "item_name": "Google Men's Tech Fleece Grey",
      "revenue": 9965.0,
      "cumulative_revenue_share": 9.518378393305902
    },
    {
      "product_rank": 4,
      "item_name": "Google Badge Heavyweight Pullover Black",
      "revenue": 9712.0,
      "cumulative_revenue_share": 12.200436331501477
    },
    {
      "product_rank": 5,
      "item_name": "Super G Unisex Joggers",
      "revenue": 9529.0,
      "cumulative_revenue_share": 14.83195714009555
    },
    {
      "product_rank": 6,
      "item_name": "Google Crewneck Sweatshirt Green",
      "revenue": 8382.0,
      "cumulative_revenue_share": 17.146723371351246
    },
    {
      "product_rank": 7,
      "item_name": "Google Sherpa Zip Hoodie Charcoal",
      "revenue": 6397.0,
      "cumulative_revenue_share": 18.913313633978625
    },
    {
      "product_rank": 8,
      "item_name": "Google Men's Puff Jacket Black",
      "revenue": 6187.0,
      "cumulative_revenue_share": 20.621910469194443
    },
    {
      "product_rank": 9,
      "item_name": "Google Men's Tech Fleece Vest Charcoal",
      "revenue": 5549.0,
      "cumulative_revenue_share": 22.15431774875038
    },
    {
      "product_rank": 10,
      "item_name": "Google Women's Puff Jacket Black",
      "revenue": 5313.0,
      "cumulative_revenue_share": 23.62155146226285
    },
    {
      "product_rank": 11,
      "item_name": "Google Canteen Bottle Black",
      "revenue": 5303.0,
      "cumulative_revenue_share": 25.086023583993818
    },
    {
      "product_rank": 12,
      "item_name": "Google Utility BackPack",
      "revenue": 5256.0,
      "cumulative_revenue_share": 26.537516224351716
    },
    {
      "product_rank": 13,
      "item_name": "Android Iconic Crewneck Sweatshirt",
      "revenue": 5159.0,
      "cumulative_revenue_share": 27.96222142442904
    },
    {
      "product_rank": 14,
      "item_name": "Google Sherpa Zip Hoodie Navy",
      "revenue": 4897.0,
      "cumulative_revenue_share": 29.31457291983099
    },
    {
      "product_rank": 15,
      "item_name": "Google Black Cloud Zip Hoodie",
      "revenue": 4681.0,
      "cumulative_revenue_share": 30.60727403275248
    },
    {
      "product_rank": 16,
      "item_name": "Google F/C Longsleeve Charcoal",
      "revenue": 4548.0,
      "cumulative_revenue_share": 31.863245974979982
    },
    {
      "product_rank": 17,
      "item_name": "Google Crewneck Sweatshirt Grey",
      "revenue": 4499.0,
      "cumulative_revenue_share": 33.105686117478115
    },
    {
      "product_rank": 18,
      "item_name": "Google Navy Speckled Tee",
      "revenue": 4440.0,
      "cumulative_revenue_share": 34.33183286846538
    },
    {
      "product_rank": 19,
      "item_name": "Google Red Speckled Tee",
      "revenue": 4428.0,
      "cumulative_revenue_share": 35.55466570931485
    },
    {
      "product_rank": 20,
      "item_name": "Google Campus Bike",
      "revenue": 4352.0,
      "cumulative_revenue_share": 36.756510452624894
    }
  ],
  "pareto": [
    3.81,
    6.77,
    9.52,
    12.2,
    14.83,
    17.15,
    18.91,
    20.62,
    22.15,
    23.62,
    25.09,
    26.54,
    27.96,
    29.31,
    30.61,
    31.86,
    33.11,
    34.33,
    35.55,
    36.76
  ],
  "device": [
    {
      "name": "desktop",
      "sessions": 208942,
      "purchases": 2749,
      "revenue": 208815.0,
      "conv": 0.013156761206459209
    },
    {
      "name": "mobile",
      "sessions": 143185,
      "purchases": 1995,
      "revenue": 146768.0,
      "conv": 0.013933023710584209
    },
    {
      "name": "tablet",
      "sessions": 8002,
      "purchases": 104,
      "revenue": 6582.0,
      "conv": 0.012996750812296926
    }
  ],
  "geo": [
    {
      "country": "United States",
      "sessions": 158155,
      "purchases": 2117,
      "revenue": 160573.0,
      "conv": 0.013385602731497581
    },
    {
      "country": "India",
      "sessions": 33769,
      "purchases": 449,
      "revenue": 34986.0,
      "conv": 0.01329621842518286
    },
    {
      "country": "Canada",
      "sessions": 26824,
      "purchases": 390,
      "revenue": 32799.0,
      "conv": 0.01453921861019982
    },
    {
      "country": "United Kingdom",
      "sessions": 11327,
      "purchases": 151,
      "revenue": 11458.0,
      "conv": 0.013330979076542774
    },
    {
      "country": "Spain",
      "sessions": 6667,
      "purchases": 99,
      "revenue": 7681.0,
      "conv": 0.014849257537123144
    },
    {
      "country": "France",
      "sessions": 7162,
      "purchases": 102,
      "revenue": 6650.0,
      "conv": 0.014241831890533371
    },
    {
      "country": "China",
      "sessions": 6258,
      "purchases": 80,
      "revenue": 6623.0,
      "conv": 0.01278363694471077
    },
    {
      "country": "Japan",
      "sessions": 4732,
      "purchases": 76,
      "revenue": 5752.0,
      "conv": 0.016060862214708368
    }
  ],
  "loyalty": [
    {
      "segment": "No purchase",
      "users": 265735,
      "purchases": 0,
      "revenue": 0.0
    },
    {
      "segment": "One-time buyer",
      "users": 3644,
      "purchases": 3644,
      "revenue": 234123.0
    },
    {
      "segment": "Repeat buyer",
      "users": 775,
      "purchases": 2048,
      "revenue": 128042.0
    }
  ],
  "daily": [
    {
      "event_day": "2020-11-01",
      "sessions": 2625,
      "purchases": 14,
      "revenue": 773.0
    },
    {
      "event_day": "2020-11-02",
      "sessions": 3731,
      "purchases": 49,
      "revenue": 4789.0
    },
    {
      "event_day": "2020-11-03",
      "sessions": 5356,
      "purchases": 49,
      "revenue": 3313.0
    },
    {
      "event_day": "2020-11-04",
      "sessions": 4344,
      "purchases": 46,
      "revenue": 2197.0
    },
    {
      "event_day": "2020-11-05",
      "sessions": 3846,
      "purchases": 26,
      "revenue": 1792.0
    },
    {
      "event_day": "2020-11-06",
      "sessions": 3332,
      "purchases": 58,
      "revenue": 3438.0
    },
    {
      "event_day": "2020-11-07",
      "sessions": 2283,
      "purchases": 31,
      "revenue": 2531.0
    },
    {
      "event_day": "2020-11-08",
      "sessions": 2170,
      "purchases": 32,
      "revenue": 3760.0
    },
    {
      "event_day": "2020-11-09",
      "sessions": 3282,
      "purchases": 52,
      "revenue": 2154.0
    },
    {
      "event_day": "2020-11-10",
      "sessions": 3835,
      "purchases": 64,
      "revenue": 4041.0
    },
    {
      "event_day": "2020-11-11",
      "sessions": 3820,
      "purchases": 64,
      "revenue": 4428.0
    },
    {
      "event_day": "2020-11-12",
      "sessions": 3702,
      "purchases": 54,
      "revenue": 3349.0
    },
    {
      "event_day": "2020-11-13",
      "sessions": 3347,
      "purchases": 79,
      "revenue": 5831.0
    },
    {
      "event_day": "2020-11-14",
      "sessions": 2369,
      "purchases": 30,
      "revenue": 2338.0
    },
    {
      "event_day": "2020-11-15",
      "sessions": 2214,
      "purchases": 21,
      "revenue": 1483.0
    },
    {
      "event_day": "2020-11-16",
      "sessions": 3541,
      "purchases": 69,
      "revenue": 5046.0
    },
    {
      "event_day": "2020-11-17",
      "sessions": 4079,
      "purchases": 98,
      "revenue": 6227.0
    },
    {
      "event_day": "2020-11-18",
      "sessions": 4133,
      "purchases": 68,
      "revenue": 4575.0
    },
    {
      "event_day": "2020-11-19",
      "sessions": 4197,
      "purchases": 84,
      "revenue": 5752.0
    },
    {
      "event_day": "2020-11-20",
      "sessions": 4141,
      "purchases": 118,
      "revenue": 8792.0
    },
    {
      "event_day": "2020-11-21",
      "sessions": 3198,
      "purchases": 68,
      "revenue": 4336.0
    },
    {
      "event_day": "2020-11-22",
      "sessions": 2689,
      "purchases": 60,
      "revenue": 3428.0
    },
    {
      "event_day": "2020-11-23",
      "sessions": 3968,
      "purchases": 141,
      "revenue": 8482.0
    },
    {
      "event_day": "2020-11-24",
      "sessions": 4441,
      "purchases": 147,
      "revenue": 10345.0
    },
    {
      "event_day": "2020-11-25",
      "sessions": 4619,
      "purchases": 108,
      "revenue": 8121.0
    },
    {
      "event_day": "2020-11-26",
      "sessions": 4190,
      "purchases": 57,
      "revenue": 4133.0
    },
    {
      "event_day": "2020-11-27",
      "sessions": 3985,
      "purchases": 97,
      "revenue": 6699.0
    },
    {
      "event_day": "2020-11-28",
      "sessions": 3396,
      "purchases": 78,
      "revenue": 6255.0
    },
    {
      "event_day": "2020-11-29",
      "sessions": 3262,
      "purchases": 51,
      "revenue": 3862.0
    },
    {
      "event_day": "2020-11-30",
      "sessions": 4593,
      "purchases": 141,
      "revenue": 11990.0
    },
    {
      "event_day": "2020-12-01",
      "sessions": 5000,
      "purchases": 107,
      "revenue": 6258.0
    },
    {
      "event_day": "2020-12-02",
      "sessions": 4814,
      "purchases": 82,
      "revenue": 5201.0
    },
    {
      "event_day": "2020-12-03",
      "sessions": 5200,
      "purchases": 90,
      "revenue": 4317.0
    },
    {
      "event_day": "2020-12-04",
      "sessions": 4725,
      "purchases": 96,
      "revenue": 6458.0
    },
    {
      "event_day": "2020-12-05",
      "sessions": 3510,
      "purchases": 87,
      "revenue": 6396.0
    },
    {
      "event_day": "2020-12-06",
      "sessions": 3339,
      "purchases": 42,
      "revenue": 2328.0
    },
    {
      "event_day": "2020-12-07",
      "sessions": 5461,
      "purchases": 110,
      "revenue": 8472.0
    },
    {
      "event_day": "2020-12-08",
      "sessions": 7588,
      "purchases": 122,
      "revenue": 8695.0
    },
    {
      "event_day": "2020-12-09",
      "sessions": 6290,
      "purchases": 150,
      "revenue": 10863.0
    },
    {
      "event_day": "2020-12-10",
      "sessions": 6011,
      "purchases": 143,
      "revenue": 10756.0
    },
    {
      "event_day": "2020-12-11",
      "sessions": 5617,
      "purchases": 160,
      "revenue": 10400.0
    },
    {
      "event_day": "2020-12-12",
      "sessions": 4143,
      "purchases": 106,
      "revenue": 6284.0
    },
    {
      "event_day": "2020-12-13",
      "sessions": 3710,
      "purchases": 74,
      "revenue": 4395.0
    },
    {
      "event_day": "2020-12-14",
      "sessions": 5106,
      "purchases": 99,
      "revenue": 8505.0
    },
    {
      "event_day": "2020-12-15",
      "sessions": 5759,
      "purchases": 139,
      "revenue": 9738.0
    },
    {
      "event_day": "2020-12-16",
      "sessions": 5542,
      "purchases": 143,
      "revenue": 11509.0
    },
    {
      "event_day": "2020-12-17",
      "sessions": 5356,
      "purchases": 126,
      "revenue": 6745.0
    },
    {
      "event_day": "2020-12-18",
      "sessions": 4843,
      "purchases": 107,
      "revenue": 6624.0
    },
    {
      "event_day": "2020-12-19",
      "sessions": 3595,
      "purchases": 52,
      "revenue": 2782.0
    },
    {
      "event_day": "2020-12-20",
      "sessions": 3296,
      "purchases": 20,
      "revenue": 1399.0
    },
    {
      "event_day": "2020-12-21",
      "sessions": 4017,
      "purchases": 53,
      "revenue": 3429.0
    },
    {
      "event_day": "2020-12-22",
      "sessions": 3848,
      "purchases": 60,
      "revenue": 3230.0
    },
    {
      "event_day": "2020-12-23",
      "sessions": 3448,
      "purchases": 67,
      "revenue": 4418.0
    },
    {
      "event_day": "2020-12-24",
      "sessions": 2804,
      "purchases": 23,
      "revenue": 1192.0
    },
    {
      "event_day": "2020-12-25",
      "sessions": 2648,
      "purchases": 17,
      "revenue": 552.0
    },
    {
      "event_day": "2020-12-26",
      "sessions": 2677,
      "purchases": 17,
      "revenue": 734.0
    },
    {
      "event_day": "2020-12-27",
      "sessions": 2680,
      "purchases": 20,
      "revenue": 1161.0
    },
    {
      "event_day": "2020-12-28",
      "sessions": 3358,
      "purchases": 36,
      "revenue": 2097.0
    },
    {
      "event_day": "2020-12-29",
      "sessions": 3439,
      "purchases": 24,
      "revenue": 1418.0
    },
    {
      "event_day": "2020-12-30",
      "sessions": 3215,
      "purchases": 37,
      "revenue": 1604.0
    },
    {
      "event_day": "2020-12-31",
      "sessions": 2629,
      "purchases": 25,
      "revenue": 2595.0
    },
    {
      "event_day": "2021-01-01",
      "sessions": 2311,
      "purchases": 14,
      "revenue": 975.0
    },
    {
      "event_day": "2021-01-02",
      "sessions": 2734,
      "purchases": 14,
      "revenue": 1026.0
    },
    {
      "event_day": "2021-01-03",
      "sessions": 2791,
      "purchases": 14,
      "revenue": 552.0
    },
    {
      "event_day": "2021-01-04",
      "sessions": 3373,
      "purchases": 16,
      "revenue": 834.0
    },
    {
      "event_day": "2021-01-05",
      "sessions": 4495,
      "purchases": 29,
      "revenue": 1143.0
    },
    {
      "event_day": "2021-01-06",
      "sessions": 6002,
      "purchases": 31,
      "revenue": 2000.0
    },
    {
      "event_day": "2021-01-07",
      "sessions": 4668,
      "purchases": 26,
      "revenue": 1452.0
    },
    {
      "event_day": "2021-01-08",
      "sessions": 4266,
      "purchases": 34,
      "revenue": 1699.0
    },
    {
      "event_day": "2021-01-09",
      "sessions": 3268,
      "purchases": 20,
      "revenue": 1363.0
    },
    {
      "event_day": "2021-01-10",
      "sessions": 3005,
      "purchases": 14,
      "revenue": 974.0
    },
    {
      "event_day": "2021-01-11",
      "sessions": 3958,
      "purchases": 28,
      "revenue": 1496.0
    },
    {
      "event_day": "2021-01-12",
      "sessions": 4730,
      "purchases": 48,
      "revenue": 2547.0
    },
    {
      "event_day": "2021-01-13",
      "sessions": 4577,
      "purchases": 36,
      "revenue": 1858.0
    },
    {
      "event_day": "2021-01-14",
      "sessions": 4374,
      "purchases": 54,
      "revenue": 3274.0
    },
    {
      "event_day": "2021-01-15",
      "sessions": 3941,
      "purchases": 47,
      "revenue": 2071.0
    },
    {
      "event_day": "2021-01-16",
      "sessions": 3183,
      "purchases": 27,
      "revenue": 1461.0
    },
    {
      "event_day": "2021-01-17",
      "sessions": 2991,
      "purchases": 14,
      "revenue": 481.0
    },
    {
      "event_day": "2021-01-18",
      "sessions": 3616,
      "purchases": 19,
      "revenue": 1223.0
    },
    {
      "event_day": "2021-01-19",
      "sessions": 4190,
      "purchases": 49,
      "revenue": 3756.0
    },
    {
      "event_day": "2021-01-20",
      "sessions": 4818,
      "purchases": 96,
      "revenue": 6706.0
    },
    {
      "event_day": "2021-01-21",
      "sessions": 4697,
      "purchases": 52,
      "revenue": 4206.0
    },
    {
      "event_day": "2021-01-22",
      "sessions": 4101,
      "purchases": 100,
      "revenue": 5552.0
    },
    {
      "event_day": "2021-01-23",
      "sessions": 3144,
      "purchases": 43,
      "revenue": 2747.0
    },
    {
      "event_day": "2021-01-24",
      "sessions": 2977,
      "purchases": 36,
      "revenue": 2408.0
    },
    {
      "event_day": "2021-01-25",
      "sessions": 3919,
      "purchases": 61,
      "revenue": 3353.0
    },
    {
      "event_day": "2021-01-26",
      "sessions": 4099,
      "purchases": 55,
      "revenue": 1259.0
    },
    {
      "event_day": "2021-01-27",
      "sessions": 4606,
      "purchases": 54,
      "revenue": 457.0
    },
    {
      "event_day": "2021-01-28",
      "sessions": 4228,
      "purchases": 69,
      "revenue": 128.0
    },
    {
      "event_day": "2021-01-29",
      "sessions": 3799,
      "purchases": 54,
      "revenue": 190.0
    },
    {
      "event_day": "2021-01-30",
      "sessions": 2908,
      "purchases": 31,
      "revenue": 159.0
    },
    {
      "event_day": "2021-01-31",
      "sessions": 2849,
      "purchases": 19,
      "revenue": 0.0
    }
  ],
  "metadata": {
    "generated_at": "2026-08-15T14:04:23+00:00",
    "modeled": false,
    "caveat": "Google's public GA4 ecommerce dataset is obfuscated sample data, so findings are presented as portfolio analytics patterns rather than commercial claims about the live store."
  },
  "optimization_analysis": {
    "feature_associations": [
      {
        "feature_group": "item_category_seen",
        "feature_value": "Uncategorized Items",
        "sessions": 606,
        "purchases": 457,
        "revenue": 54116.0,
        "conversion_rate": 0.7541254125412541,
        "revenue_per_session": 89.3003300330033,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 56.01947827827337,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Accessories",
        "sessions": 1218,
        "purchases": 817,
        "revenue": 80516.0,
        "conversion_rate": 0.6707717569786535,
        "revenue_per_session": 66.10509031198687,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 49.827632439968134,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Clearance",
        "sessions": 783,
        "purchases": 521,
        "revenue": 51300.0,
        "conversion_rate": 0.665389527458493,
        "revenue_per_session": 65.51724137931035,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 49.42781871577962,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Office",
        "sessions": 904,
        "purchases": 587,
        "revenue": 66228.0,
        "conversion_rate": 0.6493362831858407,
        "revenue_per_session": 73.26106194690266,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 48.23531896192937,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Shop by Brand",
        "sessions": 1478,
        "purchases": 738,
        "revenue": 69689.0,
        "conversion_rate": 0.4993234100135318,
        "revenue_per_session": 47.15087956698241,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 37.09175749273168,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "checkout_start",
        "feature_value": "Started checkout",
        "sessions": 11106,
        "purchases": 4845,
        "revenue": 362165.0,
        "conversion_rate": 0.4362506753106429,
        "revenue_per_session": 32.60985053124437,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 32.40646028237345,
        "business_use": "Use as a checkout-completion and payment-friction signal."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "New",
        "sessions": 2842,
        "purchases": 1150,
        "revenue": 117292.0,
        "conversion_rate": 0.40464461646727656,
        "revenue_per_session": 41.27093596059113,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 30.058634711993367,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Campus Collection",
        "sessions": 2271,
        "purchases": 917,
        "revenue": 78140.0,
        "conversion_rate": 0.40378687802730073,
        "revenue_per_session": 34.40774988991634,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 29.994918439994592,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Apparel",
        "sessions": 6928,
        "purchases": 2758,
        "revenue": 264028.0,
        "conversion_rate": 0.398094688221709,
        "revenue_per_session": 38.11027713625866,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 29.572079615221913,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Writing",
        "sessions": 413,
        "purchases": 126,
        "revenue": 13693.0,
        "conversion_rate": 0.3050847457627119,
        "revenue_per_session": 33.15496368038741,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 22.662925826480954,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Lifestyle",
        "sessions": 2636,
        "purchases": 768,
        "revenue": 77116.0,
        "conversion_rate": 0.291350531107739,
        "revenue_per_session": 29.254931714719273,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 21.642692949112817,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Home/Stationery/Writing/",
        "sessions": 976,
        "purchases": 282,
        "revenue": 27748.0,
        "conversion_rate": 0.2889344262295082,
        "revenue_per_session": 28.43032786885246,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 21.463214930611915,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Drinkware",
        "sessions": 3688,
        "purchases": 1063,
        "revenue": 98643.0,
        "conversion_rate": 0.28823210412147504,
        "revenue_per_session": 26.747017353579174,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 21.411043610800885,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Home/Apparel/Socks/",
        "sessions": 1019,
        "purchases": 274,
        "revenue": 30301.0,
        "conversion_rate": 0.2688910696761531,
        "revenue_per_session": 29.736015701668304,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 19.97431353783072,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Notebooks",
        "sessions": 747,
        "purchases": 188,
        "revenue": 19300.0,
        "conversion_rate": 0.25167336010709507,
        "revenue_per_session": 25.836680053547525,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 18.695312603549514,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Stationery",
        "sessions": 1331,
        "purchases": 333,
        "revenue": 29878.0,
        "conversion_rate": 0.2501878287002254,
        "revenue_per_session": 22.44778362133734,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 18.58496133704279,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "event_depth_bucket",
        "feature_value": "40+ events",
        "sessions": 17937,
        "purchases": 4447,
        "revenue": 341076.0,
        "conversion_rate": 0.24792328706026648,
        "revenue_per_session": 19.015219936444222,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 18.41674204738587,
        "business_use": "Use as an engagement-depth signal: these sessions convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Small Goods",
        "sessions": 3172,
        "purchases": 750,
        "revenue": 67310.0,
        "conversion_rate": 0.2364438839848676,
        "revenue_per_session": 21.220050441361916,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 17.564005671531845,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Women's",
        "sessions": 3470,
        "purchases": 806,
        "revenue": 80374.0,
        "conversion_rate": 0.23227665706051873,
        "revenue_per_session": 23.162536023054756,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 17.254447242274658,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Kids",
        "sessions": 1212,
        "purchases": 281,
        "revenue": 29664.0,
        "conversion_rate": 0.23184818481848185,
        "revenue_per_session": 24.475247524752476,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 17.222618595399144,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Bags",
        "sessions": 3275,
        "purchases": 733,
        "revenue": 84766.0,
        "conversion_rate": 0.22381679389312978,
        "revenue_per_session": 25.88274809160305,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 16.626014473584764,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Home/Apparel/Women's/",
        "sessions": 4785,
        "purchases": 1020,
        "revenue": 100017.0,
        "conversion_rate": 0.21316614420062696,
        "revenue_per_session": 20.90219435736677,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 15.834841242744965,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Home/Stationery/Notebooks/",
        "sessions": 2012,
        "purchases": 425,
        "revenue": 44416.0,
        "conversion_rate": 0.21123260437375746,
        "revenue_per_session": 22.07554671968191,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 15.691210103241934,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Home/Campus Collection/",
        "sessions": 3144,
        "purchases": 652,
        "revenue": 56247.0,
        "conversion_rate": 0.20737913486005088,
        "revenue_per_session": 17.890267175572518,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 15.404958840349682,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Google",
        "sessions": 2898,
        "purchases": 592,
        "revenue": 57897.0,
        "conversion_rate": 0.20427881297446515,
        "revenue_per_session": 19.97826086956522,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 15.174654421963936,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Lifestyle/Small Goods/",
        "sessions": 3953,
        "purchases": 798,
        "revenue": 70669.0,
        "conversion_rate": 0.20187199595244118,
        "revenue_per_session": 17.8773083733873,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 14.995866342895356,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Lifestyle/Drinkware/",
        "sessions": 5400,
        "purchases": 1047,
        "revenue": 99443.0,
        "conversion_rate": 0.1938888888888889,
        "revenue_per_session": 18.415370370370372,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 14.402848941144114,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Men's / Unisex",
        "sessions": 7700,
        "purchases": 1444,
        "revenue": 140480.0,
        "conversion_rate": 0.18753246753246752,
        "revenue_per_session": 18.244155844155845,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 13.930668316831682,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "cart_intent",
        "feature_value": "Added to cart",
        "sessions": 15188,
        "purchases": 2848,
        "revenue": 203935.0,
        "conversion_rate": 0.18751646036344483,
        "revenue_per_session": 13.427376876481432,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 13.929479239733297,
        "business_use": "Use as a remarketing and cart-recovery audience signal."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Home/Apparel/Kids/",
        "sessions": 2967,
        "purchases": 554,
        "revenue": 51903.0,
        "conversion_rate": 0.1867205931917762,
        "revenue_per_session": 17.493427704752275,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 13.870359015173507,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Sale",
        "sessions": 7888,
        "purchases": 1397,
        "revenue": 110954.0,
        "conversion_rate": 0.17710446247464504,
        "revenue_per_session": 14.066176470588236,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 13.156034027749884,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Home/Stationery/Stickers/",
        "sessions": 1583,
        "purchases": 263,
        "revenue": 23605.0,
        "conversion_rate": 0.16614024005053696,
        "revenue_per_session": 14.911560328490209,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 12.341567349249138,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Home/Sale/",
        "sessions": 9765,
        "purchases": 1563,
        "revenue": 122038.0,
        "conversion_rate": 0.16006144393241167,
        "revenue_per_session": 12.497491039426523,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 11.89000984775897,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Home/Apparel/Men's / Unisex/",
        "sessions": 13675,
        "purchases": 2094,
        "revenue": 192645.0,
        "conversion_rate": 0.15312614259597807,
        "revenue_per_session": 14.087385740402194,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 11.37482768295111,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Eco-Friendly",
        "sessions": 2189,
        "purchases": 326,
        "revenue": 27040.0,
        "conversion_rate": 0.1489264504339881,
        "revenue_per_session": 12.352672453174966,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 11.062857604855962,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Lifestyle/",
        "sessions": 2757,
        "purchases": 395,
        "revenue": 35859.0,
        "conversion_rate": 0.14327167210736308,
        "revenue_per_session": 13.006528835690968,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 10.642797855683282,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Home/Shop by Brand/Google/",
        "sessions": 3234,
        "purchases": 440,
        "revenue": 40724.0,
        "conversion_rate": 0.1360544217687075,
        "revenue_per_session": 12.592455163883736,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 10.106671381423856,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "",
        "sessions": 5528,
        "purchases": 724,
        "revenue": 69697.0,
        "conversion_rate": 0.1309696092619392,
        "revenue_per_session": 12.607995658465992,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 9.728950992964707,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Lifestyle/Bags/",
        "sessions": 4805,
        "purchases": 605,
        "revenue": 68338.0,
        "conversion_rate": 0.1259105098855359,
        "revenue_per_session": 14.222268470343392,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 9.35314067957264,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Home/New/",
        "sessions": 5342,
        "purchases": 657,
        "revenue": 58300.0,
        "conversion_rate": 0.12298764507675028,
        "revenue_per_session": 10.913515537251966,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 9.136018488829414,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Home/Shop by Brand/",
        "sessions": 798,
        "purchases": 98,
        "revenue": 8399.0,
        "conversion_rate": 0.12280701754385964,
        "revenue_per_session": 10.525062656641603,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 9.122600746916795,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Home/Eco-Friendly/",
        "sessions": 3727,
        "purchases": 440,
        "revenue": 37403.0,
        "conversion_rate": 0.11805741883552455,
        "revenue_per_session": 10.035685537966193,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 8.769781391876778,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Home/Stationery/",
        "sessions": 2240,
        "purchases": 257,
        "revenue": 21759.0,
        "conversion_rate": 0.11473214285714285,
        "revenue_per_session": 9.713839285714286,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 8.522766475866336,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Android",
        "sessions": 414,
        "purchases": 46,
        "revenue": 3628.0,
        "conversion_rate": 0.1111111111111111,
        "revenue_per_session": 8.76328502415459,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 8.253781628162816,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Home/Apparel/Hats/",
        "sessions": 6272,
        "purchases": 617,
        "revenue": 63058.0,
        "conversion_rate": 0.09837372448979592,
        "revenue_per_session": 10.05389030612245,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 7.307597158990452,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Home/Shop by Brand/Android/",
        "sessions": 874,
        "purchases": 80,
        "revenue": 6617.0,
        "conversion_rate": 0.09153318077803203,
        "revenue_per_session": 7.5709382151029745,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 6.79945397285724,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Home/Apparel/",
        "sessions": 6552,
        "purchases": 568,
        "revenue": 53950.0,
        "conversion_rate": 0.08669108669108669,
        "revenue_per_session": 8.234126984126984,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 6.439763687907252,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Home/Shop by Brand/YouTube/",
        "sessions": 4762,
        "purchases": 192,
        "revenue": 13770.0,
        "conversion_rate": 0.04031919361612768,
        "revenue_per_session": 2.891642167156657,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 2.9950723757802074,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "(not set)",
        "sessions": 99389,
        "purchases": 3399,
        "revenue": 247195.0,
        "conversion_rate": 0.03419895561883106,
        "revenue_per_session": 2.487146464900542,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 2.5404364043015697,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "country",
        "feature_value": "Slovenia",
        "sessions": 283,
        "purchases": 9,
        "revenue": 543.0,
        "conversion_rate": 0.03180212014134275,
        "revenue_per_session": 1.9187279151943464,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 2.3623897946331733,
        "business_use": "Use as a market-prioritization signal: this country converts above baseline."
      },
      {
        "feature_group": "source_medium",
        "feature_value": "(data deleted) / (data deleted)",
        "sessions": 22233,
        "purchases": 698,
        "revenue": 50064.0,
        "conversion_rate": 0.03139477353483561,
        "revenue_per_session": 2.2517878828768048,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 2.332130445199425,
        "business_use": "Use as an acquisition quality signal: this source / medium converts above baseline."
      },
      {
        "feature_group": "item_category_seen",
        "feature_value": "Men's T-Shirts",
        "sessions": 372,
        "purchases": 11,
        "revenue": 593.0,
        "conversion_rate": 0.02956989247311828,
        "revenue_per_session": 1.5940860215053763,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 2.1965709171723624,
        "business_use": "Use as a merchandising signal: sessions touching this category convert above baseline."
      },
      {
        "feature_group": "source_medium",
        "feature_value": "<Other> / (data deleted)",
        "sessions": 396,
        "purchases": 9,
        "revenue": 397.0,
        "conversion_rate": 0.022727272727272728,
        "revenue_per_session": 1.0025252525252526,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 1.6882735148514851,
        "business_use": "Use as an acquisition quality signal: this source / medium converts above baseline."
      },
      {
        "feature_group": "country",
        "feature_value": "Austria",
        "sessions": 964,
        "purchases": 21,
        "revenue": 836.0,
        "conversion_rate": 0.021784232365145227,
        "revenue_per_session": 0.8672199170124482,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 1.6182206719115895,
        "business_use": "Use as a market-prioritization signal: this country converts above baseline."
      },
      {
        "feature_group": "source_medium",
        "feature_value": "shop.googlemerchandisestore.com / referral",
        "sessions": 28849,
        "purchases": 585,
        "revenue": 46521.0,
        "conversion_rate": 0.020277999237408577,
        "revenue_per_session": 1.6125688932025373,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 1.5063315980546026,
        "business_use": "Use as an acquisition quality signal: this source / medium converts above baseline."
      },
      {
        "feature_group": "country",
        "feature_value": "Colombia",
        "sessions": 1701,
        "purchases": 31,
        "revenue": 2130.0,
        "conversion_rate": 0.018224573780129337,
        "revenue_per_session": 1.252204585537919,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 1.3537948702277636,
        "business_use": "Use as a market-prioritization signal: this country converts above baseline."
      },
      {
        "feature_group": "country",
        "feature_value": "Finland",
        "sessions": 582,
        "purchases": 10,
        "revenue": 1092.0,
        "conversion_rate": 0.01718213058419244,
        "revenue_per_session": 1.8762886597938144,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 1.276357983736518,
        "business_use": "Use as a market-prioritization signal: this country converts above baseline."
      },
      {
        "feature_group": "country",
        "feature_value": "Russia",
        "sessions": 2336,
        "purchases": 40,
        "revenue": 2378.0,
        "conversion_rate": 0.017123287671232876,
        "revenue_per_session": 1.0179794520547945,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 1.2719868947511188,
        "business_use": "Use as a market-prioritization signal: this country converts above baseline."
      },
      {
        "feature_group": "country",
        "feature_value": "Thailand",
        "sessions": 1586,
        "purchases": 27,
        "revenue": 2562.0,
        "conversion_rate": 0.017023959646910468,
        "revenue_per_session": 1.6153846153846154,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 1.2646084083502929,
        "business_use": "Use as a market-prioritization signal: this country converts above baseline."
      },
      {
        "feature_group": "country",
        "feature_value": "Malaysia",
        "sessions": 1872,
        "purchases": 31,
        "revenue": 3121.0,
        "conversion_rate": 0.01655982905982906,
        "revenue_per_session": 1.6672008547008548,
        "baseline_conversion_rate": 0.013461842839649126,
        "lift_vs_baseline": 1.2301309157358042,
        "business_use": "Use as a market-prioritization signal: this country converts above baseline."
      }
    ],
    "step_drivers": {
      "view_to_cart": [
        {
          "step_key": "view_to_cart",
          "step_name": "View item -> Add to cart",
          "feature_group": "event_depth_bucket",
          "feature_value": "40+ events",
          "eligible_sessions": 17115,
          "converted_sessions": 7906,
          "step_conversion_rate": 0.4619339760444055,
          "baseline_step_rate": 0.19700077901843677,
          "lift_vs_baseline": 2.344833245563838,
          "strategic_read": "This segment converts above the step baseline, so use it to separate journey friction from audience quality."
        },
        {
          "step_key": "view_to_cart",
          "step_name": "View item -> Add to cart",
          "feature_group": "primary_item_category",
          "feature_value": "Home/Apparel/Hats/",
          "eligible_sessions": 4767,
          "converted_sessions": 2005,
          "step_conversion_rate": 0.420599958044892,
          "baseline_step_rate": 0.19700077901843677,
          "lift_vs_baseline": 2.1350167250126924,
          "strategic_read": "This segment converts above the step baseline, so use it to separate journey friction from audience quality."
        },
        {
          "step_key": "view_to_cart",
          "step_name": "View item -> Add to cart",
          "feature_group": "primary_item_category",
          "feature_value": "(not set)",
          "eligible_sessions": 16939,
          "converted_sessions": 0,
          "step_conversion_rate": 0.0,
          "baseline_step_rate": 0.19700077901843677,
          "lift_vs_baseline": 0.0,
          "strategic_read": "This segment converts below the step baseline, so use it to separate journey friction from audience quality."
        },
        {
          "step_key": "view_to_cart",
          "step_name": "View item -> Add to cart",
          "feature_group": "event_depth_bucket",
          "feature_value": "0-4 events",
          "eligible_sessions": 3987,
          "converted_sessions": 25,
          "step_conversion_rate": 0.006270378730875345,
          "baseline_step_rate": 0.19700077901843677,
          "lift_vs_baseline": 0.031829207793581955,
          "strategic_read": "This segment converts below the step baseline, so use it to separate journey friction from audience quality."
        },
        {
          "step_key": "view_to_cart",
          "step_name": "View item -> Add to cart",
          "feature_group": "primary_item_category",
          "feature_value": "Home/Stationery/Writing/",
          "eligible_sessions": 320,
          "converted_sessions": 118,
          "step_conversion_rate": 0.36875,
          "baseline_step_rate": 0.19700077901843677,
          "lift_vs_baseline": 1.8718200092269164,
          "strategic_read": "This segment converts above the step baseline, so use it to separate journey friction from audience quality."
        },
        {
          "step_key": "view_to_cart",
          "step_name": "View item -> Add to cart",
          "feature_group": "event_depth_bucket",
          "feature_value": "5-9 events",
          "eligible_sessions": 18479,
          "converted_sessions": 500,
          "step_conversion_rate": 0.027057741219762975,
          "baseline_step_rate": 0.19700077901843677,
          "lift_vs_baseline": 0.1373483970702,
          "strategic_read": "This segment converts below the step baseline, so use it to separate journey friction from audience quality."
        },
        {
          "step_key": "view_to_cart",
          "step_name": "View item -> Add to cart",
          "feature_group": "primary_item_category",
          "feature_value": "Backpacks/",
          "eligible_sessions": 399,
          "converted_sessions": 14,
          "step_conversion_rate": 0.03508771929824561,
          "baseline_step_rate": 0.19700077901843677,
          "lift_vs_baseline": 0.17810954592703335,
          "strategic_read": "This segment converts below the step baseline, so use it to separate journey friction from audience quality."
        },
        {
          "step_key": "view_to_cart",
          "step_name": "View item -> Add to cart",
          "feature_group": "primary_item_category",
          "feature_value": "Home/Sale/",
          "eligible_sessions": 5832,
          "converted_sessions": 2023,
          "step_conversion_rate": 0.3468792866941015,
          "baseline_step_rate": 0.19700077901843677,
          "lift_vs_baseline": 1.76080159897052,
          "strategic_read": "This segment converts above the step baseline, so use it to separate journey friction from audience quality."
        }
      ],
      "cart_to_checkout": [
        {
          "step_key": "cart_to_checkout",
          "step_name": "Add to cart -> Begin checkout",
          "feature_group": "event_depth_bucket",
          "feature_value": "5-9 events",
          "eligible_sessions": 505,
          "converted_sessions": 0,
          "step_conversion_rate": 0.0,
          "baseline_step_rate": 0.392480905978404,
          "lift_vs_baseline": 0.0,
          "strategic_read": "This segment converts below the step baseline, so use it to separate journey friction from audience quality."
        },
        {
          "step_key": "cart_to_checkout",
          "step_name": "Add to cart -> Begin checkout",
          "feature_group": "event_depth_bucket",
          "feature_value": "10-19 events",
          "eligible_sessions": 2627,
          "converted_sessions": 19,
          "step_conversion_rate": 0.00723258469737343,
          "baseline_step_rate": 0.392480905978404,
          "lift_vs_baseline": 0.018427863845614435,
          "strategic_read": "This segment converts below the step baseline, so use it to separate journey friction from audience quality."
        },
        {
          "step_key": "cart_to_checkout",
          "step_name": "Add to cart -> Begin checkout",
          "feature_group": "primary_item_category",
          "feature_value": "Men's T-Shirts/",
          "eligible_sessions": 245,
          "converted_sessions": 28,
          "step_conversion_rate": 0.11428571428571428,
          "baseline_step_rate": 0.392480905978404,
          "lift_vs_baseline": 0.2911879598341601,
          "strategic_read": "This segment converts below the step baseline, so use it to separate journey friction from audience quality."
        },
        {
          "step_key": "cart_to_checkout",
          "step_name": "Add to cart -> Begin checkout",
          "feature_group": "event_depth_bucket",
          "feature_value": "40+ events",
          "eligible_sessions": 7906,
          "converted_sessions": 4858,
          "step_conversion_rate": 0.6144700227675184,
          "baseline_step_rate": 0.392480905978404,
          "lift_vs_baseline": 1.5656048827030815,
          "strategic_read": "This segment converts above the step baseline, so use it to separate journey friction from audience quality."
        },
        {
          "step_key": "cart_to_checkout",
          "step_name": "Add to cart -> Begin checkout",
          "feature_group": "primary_item_category",
          "feature_value": "Home/Apparel/Hats/",
          "eligible_sessions": 2009,
          "converted_sessions": 1171,
          "step_conversion_rate": 0.5828770532603286,
          "baseline_step_rate": 0.392480905978404,
          "lift_vs_baseline": 1.485109324763944,
          "strategic_read": "This segment converts above the step baseline, so use it to separate journey friction from audience quality."
        },
        {
          "step_key": "cart_to_checkout",
          "step_name": "Add to cart -> Begin checkout",
          "feature_group": "primary_item_category",
          "feature_value": "Home/Shop by Brand/YouTube/",
          "eligible_sessions": 643,
          "converted_sessions": 139,
          "step_conversion_rate": 0.2161741835147745,
          "baseline_step_rate": 0.392480905978404,
          "lift_vs_baseline": 0.550789045331722,
          "strategic_read": "This segment converts below the step baseline, so use it to separate journey friction from audience quality."
        },
        {
          "step_key": "cart_to_checkout",
          "step_name": "Add to cart -> Begin checkout",
          "feature_group": "primary_item_category",
          "feature_value": "Home/Apparel/",
          "eligible_sessions": 974,
          "converted_sessions": 236,
          "step_conversion_rate": 0.24229979466119098,
          "baseline_step_rate": 0.392480905978404,
          "lift_vs_baseline": 0.6173543501617461,
          "strategic_read": "This segment converts below the step baseline, so use it to separate journey friction from audience quality."
        },
        {
          "step_key": "cart_to_checkout",
          "step_name": "Add to cart -> Begin checkout",
          "feature_group": "event_depth_bucket",
          "feature_value": "20-39 events",
          "eligible_sessions": 4117,
          "converted_sessions": 1084,
          "step_conversion_rate": 0.2632985183385961,
          "baseline_step_rate": 0.392480905978404,
          "lift_vs_baseline": 0.6708568858457636,
          "strategic_read": "This segment converts below the step baseline, so use it to separate journey friction from audience quality."
        }
      ],
      "checkout_to_purchase": [
        {
          "step_key": "checkout_to_purchase",
          "step_name": "Begin checkout -> Purchase",
          "feature_group": "primary_item_category",
          "feature_value": "Home/Apparel/Hats/",
          "eligible_sessions": 2340,
          "converted_sessions": 131,
          "step_conversion_rate": 0.055982905982905985,
          "baseline_step_rate": 0.4362506753106429,
          "lift_vs_baseline": 0.12832737953480988,
          "strategic_read": "This segment converts below the step baseline, so use it to separate journey friction from audience quality."
        },
        {
          "step_key": "checkout_to_purchase",
          "step_name": "Begin checkout -> Purchase",
          "feature_group": "primary_item_category",
          "feature_value": "(not set)",
          "eligible_sessions": 201,
          "converted_sessions": 28,
          "step_conversion_rate": 0.13930348258706468,
          "baseline_step_rate": 0.4362506753106429,
          "lift_vs_baseline": 0.31931980962062756,
          "strategic_read": "This segment converts below the step baseline, so use it to separate journey friction from audience quality."
        },
        {
          "step_key": "checkout_to_purchase",
          "step_name": "Begin checkout -> Purchase",
          "feature_group": "event_depth_bucket",
          "feature_value": "20-39 events",
          "eligible_sessions": 2465,
          "converted_sessions": 397,
          "step_conversion_rate": 0.16105476673427993,
          "baseline_step_rate": 0.4362506753106429,
          "lift_vs_baseline": 0.3691794095667519,
          "strategic_read": "This segment converts below the step baseline, so use it to separate journey friction from audience quality."
        },
        {
          "step_key": "checkout_to_purchase",
          "step_name": "Begin checkout -> Purchase",
          "feature_group": "primary_item_category",
          "feature_value": "Lifestyle/Small Goods/",
          "eligible_sessions": 286,
          "converted_sessions": 191,
          "step_conversion_rate": 0.6678321678321678,
          "baseline_step_rate": 0.4362506753106429,
          "lift_vs_baseline": 1.530845006386802,
          "strategic_read": "This segment converts above the step baseline, so use it to separate journey friction from audience quality."
        },
        {
          "step_key": "checkout_to_purchase",
          "step_name": "Begin checkout -> Purchase",
          "feature_group": "primary_item_category",
          "feature_value": "Home/Apparel/Women's/",
          "eligible_sessions": 514,
          "converted_sessions": 327,
          "step_conversion_rate": 0.6361867704280155,
          "baseline_step_rate": 0.4362506753106429,
          "lift_vs_baseline": 1.4583055257736925,
          "strategic_read": "This segment converts above the step baseline, so use it to separate journey friction from audience quality."
        },
        {
          "step_key": "checkout_to_purchase",
          "step_name": "Begin checkout -> Purchase",
          "feature_group": "primary_item_category",
          "feature_value": "Home/Apparel/Men's / Unisex/",
          "eligible_sessions": 1758,
          "converted_sessions": 1115,
          "step_conversion_rate": 0.6342434584755404,
          "baseline_step_rate": 0.4362506753106429,
          "lift_vs_baseline": 1.4538509493971832,
          "strategic_read": "This segment converts above the step baseline, so use it to separate journey friction from audience quality."
        },
        {
          "step_key": "checkout_to_purchase",
          "step_name": "Begin checkout -> Purchase",
          "feature_group": "primary_item_category",
          "feature_value": "Home/Apparel/Kids/",
          "eligible_sessions": 316,
          "converted_sessions": 198,
          "step_conversion_rate": 0.6265822784810127,
          "baseline_step_rate": 0.4362506753106429,
          "lift_vs_baseline": 1.4362895324685505,
          "strategic_read": "This segment converts above the step baseline, so use it to separate journey friction from audience quality."
        },
        {
          "step_key": "checkout_to_purchase",
          "step_name": "Begin checkout -> Purchase",
          "feature_group": "primary_item_category",
          "feature_value": "Home/Campus Collection/",
          "eligible_sessions": 272,
          "converted_sessions": 167,
          "step_conversion_rate": 0.6139705882352942,
          "baseline_step_rate": 0.4362506753106429,
          "lift_vs_baseline": 1.4073802586049902,
          "strategic_read": "This segment converts above the step baseline, so use it to separate journey friction from audience quality."
        }
      ]
    },
    "product_opportunity_matrix": [
      {
        "name": "Apparel",
        "views": 7426,
        "cart_adds": 1711,
        "purchases": 4984,
        "revenue": 171727.0,
        "view_to_cart": 0.23040667923511984,
        "viewToPurchase": 0.6711553999461352,
        "quadrant": "Scale / protect",
        "recommended_action": "Keep visibility high; test bundles and cross-sells without disrupting purchase intent.",
        "attention_level": "high",
        "conversion_level": "high"
      },
      {
        "name": "New",
        "views": 2448,
        "cart_adds": 513,
        "purchases": 1445,
        "revenue": 25813.0,
        "view_to_cart": 0.20955882352941177,
        "viewToPurchase": 0.5902777777777778,
        "quadrant": "Increase visibility",
        "recommended_action": "Promote in navigation, email, remarketing, or category modules to expose a high-intent category.",
        "attention_level": "low",
        "conversion_level": "high"
      },
      {
        "name": "Bags",
        "views": 5433,
        "cart_adds": 540,
        "purchases": 704,
        "revenue": 23860.0,
        "view_to_cart": 0.09939260077305356,
        "viewToPurchase": 0.12957850174857352,
        "quadrant": "Fix conversion",
        "recommended_action": "Audit offer clarity, product detail page content, pricing, reviews, and shipping expectations.",
        "attention_level": "high",
        "conversion_level": "low"
      },
      {
        "name": "Campus Collection",
        "views": 3685,
        "cart_adds": 1418,
        "purchases": 1497,
        "revenue": 20061.0,
        "view_to_cart": 0.3848032564450475,
        "viewToPurchase": 0.4062415196743555,
        "quadrant": "Fix conversion",
        "recommended_action": "Audit offer clarity, product detail page content, pricing, reviews, and shipping expectations.",
        "attention_level": "high",
        "conversion_level": "low"
      },
      {
        "name": "Accessories",
        "views": 57,
        "cart_adds": 0,
        "purchases": 1276,
        "revenue": 17815.0,
        "view_to_cart": 0.0,
        "viewToPurchase": 22.385964912280702,
        "quadrant": "Increase visibility",
        "recommended_action": "Promote in navigation, email, remarketing, or category modules to expose a high-intent category.",
        "attention_level": "low",
        "conversion_level": "high"
      },
      {
        "name": "Uncategorized Items",
        "views": 0,
        "cart_adds": 0,
        "purchases": 608,
        "revenue": 17394.0,
        "view_to_cart": null,
        "viewToPurchase": null,
        "quadrant": "Selective test",
        "recommended_action": "Avoid broad investment until copy, targeting, or assortment tests show demand.",
        "attention_level": "low",
        "conversion_level": "low"
      },
      {
        "name": "Shop by Brand",
        "views": 1160,
        "cart_adds": 357,
        "purchases": 816,
        "revenue": 16960.0,
        "view_to_cart": 0.30775862068965515,
        "viewToPurchase": 0.7034482758620689,
        "quadrant": "Increase visibility",
        "recommended_action": "Promote in navigation, email, remarketing, or category modules to expose a high-intent category.",
        "attention_level": "low",
        "conversion_level": "high"
      },
      {
        "name": "Drinkware",
        "views": 7809,
        "cart_adds": 2125,
        "purchases": 709,
        "revenue": 15807.0,
        "view_to_cart": 0.272121910615956,
        "viewToPurchase": 0.09079267511845307,
        "quadrant": "Fix conversion",
        "recommended_action": "Audit offer clarity, product detail page content, pricing, reviews, and shipping expectations.",
        "attention_level": "high",
        "conversion_level": "low"
      }
    ],
    "channel_quality_scorecard": [
      {
        "name": "(data deleted) / (data deleted)",
        "sessions": 22233,
        "product_view_sessions": 5656,
        "cart_sessions": 1450,
        "purchases": 698,
        "revenue": 50064.0,
        "conv": 0.03139477353483561,
        "aov": 71.72492836676217,
        "view_rate": 0.2543966176404444,
        "cart_rate": 0.06521836909099087,
        "revenue_per_session": 2.2517878828768048,
        "quality_score": 100.0,
        "strategic_read": "High-quality channel: protect tracking, landing pages, and budget tests."
      },
      {
        "name": "shop.googlemerchandisestore.com / referral",
        "sessions": 28849,
        "product_view_sessions": 6634,
        "cart_sessions": 1463,
        "purchases": 585,
        "revenue": 46521.0,
        "conv": 0.020277999237408577,
        "aov": 79.52307692307693,
        "view_rate": 0.2299559776768692,
        "cart_rate": 0.05071232971680128,
        "revenue_per_session": 1.6125688932025373,
        "quality_score": 54.3,
        "strategic_read": "Promising channel: inspect volume constraints and audience quality."
      },
      {
        "name": "<Other> / referral",
        "sessions": 34672,
        "product_view_sessions": 7455,
        "cart_sessions": 1459,
        "purchases": 471,
        "revenue": 37000.0,
        "conv": 0.01358444854637748,
        "aov": 78.55626326963906,
        "view_rate": 0.21501499769266266,
        "cart_rate": 0.04208006460544532,
        "revenue_per_session": 1.067143516382095,
        "quality_score": 23.1,
        "strategic_read": "Efficiency risk: improve landing intent before scaling traffic."
      },
      {
        "name": "(direct) / (none)",
        "sessions": 83459,
        "product_view_sessions": 17678,
        "cart_sessions": 3512,
        "purchases": 1079,
        "revenue": 79650.0,
        "conv": 0.012928503816245102,
        "aov": 73.81835032437442,
        "view_rate": 0.21181658059646052,
        "cart_rate": 0.04208054254184689,
        "revenue_per_session": 0.9543608238775926,
        "quality_score": 19.0,
        "strategic_read": "Efficiency risk: improve landing intent before scaling traffic."
      },
      {
        "name": "google / organic",
        "sessions": 112678,
        "product_view_sessions": 23663,
        "cart_sessions": 4341,
        "purchases": 1250,
        "revenue": 95775.0,
        "conv": 0.011093558636113526,
        "aov": 76.62,
        "view_rate": 0.2100055024050835,
        "cart_rate": 0.03852571043149506,
        "revenue_per_session": 0.8499884626990184,
        "quality_score": 10.9,
        "strategic_read": "Efficiency risk: improve landing intent before scaling traffic."
      },
      {
        "name": "<Other> / organic",
        "sessions": 10163,
        "product_view_sessions": 2077,
        "cart_sessions": 394,
        "purchases": 97,
        "revenue": 8232.0,
        "conv": 0.009544425858506346,
        "aov": 84.8659793814433,
        "view_rate": 0.20436878874348124,
        "cart_rate": 0.03876808029125258,
        "revenue_per_session": 0.8099970481157138,
        "quality_score": 6.9,
        "strategic_read": "Efficiency risk: improve landing intent before scaling traffic."
      },
      {
        "name": "<Other> / <Other>",
        "sessions": 52057,
        "product_view_sessions": 10589,
        "cart_sessions": 1983,
        "purchases": 506,
        "revenue": 35470.0,
        "conv": 0.009720114489886087,
        "aov": 70.09881422924902,
        "view_rate": 0.20341164492767544,
        "cart_rate": 0.038092859749889546,
        "revenue_per_session": 0.6813684999135563,
        "quality_score": 3.8,
        "strategic_read": "Efficiency risk: improve landing intent before scaling traffic."
      },
      {
        "name": "google / cpc",
        "sessions": 15617,
        "product_view_sessions": 3167,
        "cart_sessions": 564,
        "purchases": 153,
        "revenue": 9056.0,
        "conv": 0.009797016072228982,
        "aov": 59.189542483660134,
        "view_rate": 0.20279182941666132,
        "cart_rate": 0.036114490619197026,
        "revenue_per_session": 0.5798808990202984,
        "quality_score": 0.5,
        "strategic_read": "Efficiency risk: improve landing intent before scaling traffic."
      }
    ],
    "experiment_backlog": [
      {
        "priority": "P1",
        "hypothesis": "Improving the 40+ events path will increase product-view to cart progression.",
        "segment": "event_depth_bucket: 40+ events",
        "primary_metric": "view_item -> add_to_cart rate",
        "secondary_metric": "purchase rate and revenue per session",
        "measurement_plan": "Rebuild the session mart, compare eligible sessions before and after the product-page change, and use SAFE_DIVIDE for step conversion."
      },
      {
        "priority": "P1",
        "hypothesis": "Reducing cart friction for 5-9 events will increase checkout starts.",
        "segment": "event_depth_bucket: 5-9 events",
        "primary_metric": "add_to_cart -> begin_checkout rate",
        "secondary_metric": "checkout starts per 100 sessions",
        "measurement_plan": "Measure cart sessions by segment and compare begin_checkout progression across matched periods."
      },
      {
        "priority": "P2",
        "hypothesis": "Checkout reassurance for Home/Apparel/Hats/ will lift completed purchases.",
        "segment": "primary_item_category: Home/Apparel/Hats/",
        "primary_metric": "begin_checkout -> purchase rate",
        "secondary_metric": "purchase revenue and average order value",
        "measurement_plan": "Track checkout sessions, payment completion, and revenue by segment after trust, shipping, or payment changes."
      },
      {
        "priority": "P2",
        "hypothesis": "(data deleted) / (data deleted) can absorb more demand without degrading conversion quality.",
        "segment": "source / medium: (data deleted) / (data deleted)",
        "primary_metric": "revenue per session",
        "secondary_metric": "session-to-purchase rate",
        "measurement_plan": "Compare channel quality score, conversion, and revenue per session before and after controlled traffic expansion."
      },
      {
        "priority": "P2",
        "hypothesis": "Sessions with item_category_seen=Uncategorized Items represent a higher-intent audience for remarketing.",
        "segment": "item_category_seen: Uncategorized Items",
        "primary_metric": "purchase rate",
        "secondary_metric": "cart rate and revenue per session",
        "measurement_plan": "Build audience rules from the feature value and compare conversion lift against the site baseline."
      },
      {
        "priority": "P3",
        "hypothesis": "Bags has attention but can convert better with offer and PDP improvements.",
        "segment": "item category: Bags",
        "primary_metric": "view_item -> purchase rate",
        "secondary_metric": "cart add rate and item revenue",
        "measurement_plan": "Use UNNEST(items) to compare item-category views, cart adds, purchases, and revenue before and after PDP changes."
      },
      {
        "priority": "P3",
        "hypothesis": "New converts well enough to justify more homepage or lifecycle visibility.",
        "segment": "item category: New",
        "primary_metric": "category revenue per exposed session",
        "secondary_metric": "view-to-purchase rate",
        "measurement_plan": "Track sessions exposed to the category module and compare purchase/revenue outcomes with the item-level table."
      }
    ]
  },
  "findings": [
    {
      "title": "Traffic scale is large enough for funnel diagnosis",
      "metric": "360,129 sessions and 5,692 purchases across the sample period",
      "business_implication": "The data supports conversion diagnostics, not just top-line traffic reporting."
    },
    {
      "title": "The largest funnel leak identifies the first optimization target",
      "metric": "View item to Add to cart loses 80.3% of sessions",
      "business_implication": "Prioritize the journey step with the largest loss before scaling acquisition spend."
    },
    {
      "title": "Revenue concentration points to channel prioritization",
      "metric": "google / organic contributes $95,775 in revenue",
      "business_implication": "Compare high-revenue channels against high-efficiency channels before changing budget mix."
    },
    {
      "title": "Efficient channels may be under-scaled",
      "metric": "(data deleted) / (data deleted) converts at 3.1%",
      "business_implication": "A smaller but efficient channel can justify lifecycle, SEO, or paid test expansion."
    },
    {
      "title": "Merchandising should separate attention from conversion",
      "metric": "Apparel leads category revenue with $171,727",
      "business_implication": "High-revenue categories deserve visibility, while high-view low-purchase categories need offer or product-page review."
    },
    {
      "title": "Device experience is a measurable conversion lever",
      "metric": "Mobile conversion is at least as strong as desktop",
      "business_implication": "Device-level funnel differences help separate acquisition quality from user-experience friction."
    },
    {
      "title": "Geography shapes where follow-up analysis should focus",
      "metric": "United States is the top revenue country at $160,573",
      "business_implication": "Market concentration should influence localization, shipping, remarketing, and measurement priorities."
    }
  ]
};
