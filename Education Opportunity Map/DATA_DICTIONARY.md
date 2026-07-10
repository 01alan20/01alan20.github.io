# Data dictionary and scoring logic

## Geography registry

`data/metro_registry.csv` defines the 48 display metros.

| Column | Type | Description |
|---|---:|---|
| `metro` | text | Short display name used throughout the interface. |
| `state` | text | Display abbreviation for the principal state or district. |
| `cbsa_code` | text | Five-digit Core Based Statistical Area code used to join Census records. |
| `latitude` | number | Approximate display latitude. |
| `longitude` | number | Approximate display longitude. |

Coordinates affect only point placement, not scoring.

## Official source file

`scripts/fetch_official_data.py` creates `data/metro_source.csv`.

| Column | Type | Source / definition |
|---|---:|---|
| `metro` | text | Display name from the registry. |
| `state` | text | Display abbreviation from the registry. |
| `cbsa_code` | text | Five-digit CBSA identifier. |
| `latitude` | number | Display latitude. |
| `longitude` | number | Display longitude. |
| `population` | integer | ACS 2024 B01003 total population. |
| `population_m` | number | Population divided by 1,000,000. |
| `resident_employment_growth_pct` | number | Percentage change in B23025 employed civilians, 2023–2024. |
| `employment_population_ratio_pct` | number | ACS 2024 employed civilians divided by population age 16+. |
| `median_worker_earnings` | integer | ACS 2024 B20002 median earnings for people age 16+ with earnings. |
| `median_gross_rent` | integer | ACS 2024 B25064 monthly median gross rent. |
| `bachelor_share_pct` | number | Bachelor’s degree or higher among people age 25+, derived from B15003. |
| `population_growth_pct` | number | Percentage change in B01003 population, 2023–2024. |
| `broadband_subscription_pct` | number | B28002 households with broadband of any type divided by total households. |

## Derived values

`build_dataset.py` calculates:

```text
earnings_after_rent = median_worker_earnings − (12 × median_gross_rent)
rent_to_earnings_pct = 12 × median_gross_rent ÷ median_worker_earnings × 100
```

These are comparison proxies. Median earnings and median gross rent do not describe the same exact households.

Each source component is converted to a 0–100 percentile rank among the 48 included metros. A higher score always represents a more favourable position after reversing the rent-to-earnings measure.

## Dimension scores

### Career strength

```text
55% resident-employment-growth percentile
45% employment-to-population-ratio percentile
```

### Affordability

```text
55% earnings-after-rent percentile
45% reversed rent-to-earnings percentile
```

### Education depth

Bachelor’s-or-higher attainment percentile.

### Population momentum

2023–2024 population-growth percentile.

### Connectivity

Household broadband-subscription percentile.

## Composite opportunity score

```text
30% career strength
25% affordability
20% education depth
15% population momentum
10% connectivity
```

The separate `income_score` is retained in the processed dataset for inspection but is not added again to the composite, because earnings already contribute to affordability.

## Interpretation

The composite is a relative editorial index, not an official statistic. A metro’s result depends on:

- the 48 places included in the comparison set;
- the selected reference years;
- ACS sampling variation;
- the chosen component definitions;
- the percentile method; and
- the default weights.

The finder lets users alter dimension weights, but it does not change the construction of the underlying dimension scores.

## Source tables

| Table | Relevant estimates |
|---|---|
| B01003 | `E001`: total population |
| B20002 | `E001`: median earnings for population age 16+ with earnings |
| B23025 | `E001`: population age 16+; `E004`: employed civilian labour force |
| B25064 | `E001`: median gross rent |
| B15003 | `E001`: population age 25+; `E022`–`E025`: bachelor’s through doctorate |
| B28002 | `E001`: total households; `E004`: broadband subscription of any type |

Table-based summary files name estimates in the form `B01003_E001`; Census API variable pages typically display the equivalent as `B01003_001E`.
