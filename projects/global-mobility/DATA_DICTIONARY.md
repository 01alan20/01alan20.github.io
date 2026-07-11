# Data dictionary and calculations

## Global totals

File: `data/global_totals.csv`

| Field | Meaning |
|---|---|
| `year` | Reference year, 2013–2023 |
| `students` | Worldwide internationally mobile tertiary students |
| `status` | `published` or `estimated` |
| `note` | Qualification attached to the record |

### Calculated decade metrics

Using 4,350,000 in 2013 and 7,300,000 in 2023:

```text
Absolute growth = 7,300,000 − 4,350,000
                = 2,950,000

Percentage growth = (7,300,000 / 4,350,000 − 1) × 100
                  = 67.8%

CAGR = (7,300,000 / 4,350,000)^(1/10) − 1
     = 5.3% per year
```

The 2013 value is an interpolation and remains visibly labelled as estimated.

## Global corridor archive

File: `data/global_major_corridors.csv`

| Field | Meaning |
|---|---|
| `year` | Published map year, 2016–2023 |
| `origin` | Country from which students moved |
| `destination` | Host country |
| `students` | Published corridor count |
| `origin_region` | Region used for route colour |
| `status` | Publication status |

This is a selection of major headline routes from 2016 onward, not a complete origin-destination matrix. The source maps generally use an approximately 15,000-student display threshold. Counts should not be summed to estimate the global total. The interactive map starts in 2016; 2013–2015 appear only in the separate global-total trend.

## 2023 global rankings

File: `data/global_2023_countries.csv`

| Field | Meaning |
|---|---|
| `type` | `origin` or `host` |
| `country` | Country name |
| `students` | Internationally mobile students |
| `rank` | Rank within the selected type |

## Erasmus+ network

Original checked-in network: `data/ErasmusFlows.net`

Processed browser routes: `data/erasmus_country_flows.csv`

Country metrics: `data/erasmus_country_summary.csv`

The analysis excludes:

- same-country records;
- flows to or from “Rest of the world”.

This leaves:

```text
34 countries
1,120 directed cross-border routes
8,273,582 cumulative participant movements
```

The browser loads the 180 largest routes and displays between 15 and 100 at a time. Country totals and derived metrics use the complete 1,120-route network.

### Country fields

| Field | Meaning |
|---|---|
| `outbound` | Total movements sent to other network countries |
| `inbound` | Total movements received from other network countries |
| `balance` | `inbound − outbound` |
| `top3_outbound_share` | Percentage of outbound movements going to the three largest destinations |
| `top3_inbound_share` | Percentage of inbound movements supplied by the three largest origins |
| `outbound_diversity` | Effective outbound partner count, normalised to the 34-country network |
| `inbound_diversity` | Effective inbound partner count, normalised to the 34-country network |

### Balance

```text
Balance = inbound participant movements − outbound participant movements
```

A positive balance means the country received more represented movements than it sent. This is not a financial balance and does not measure unique students.

### Top-three concentration

```text
Top-three share = sum of the three largest partner flows / all flows × 100
```

Higher values indicate greater reliance on a small number of partners.

### Diversity

The project uses the reciprocal Herfindahl effective number of partners:

```text
partner share pᵢ = partner flowᵢ / all flows

effective partners = 1 / Σ(pᵢ²)

diversity score = effective partners / 34 × 100
```

A higher score represents a more evenly distributed network. The score is a project-created descriptive measure, not an official Erasmus+ index.

## Coordinates

File: `data/country_coordinates.csv`

Coordinates are capital-city display anchors used to position country-level routes. They do not enter any calculation and should not be interpreted as institution locations. The basemap, routes, and nodes are rendered inside the same SVG coordinate system. `scripts/generate_maps.py` regenerates `assets/js/map-data.js` directly from the included Natural Earth public-domain 1:110m country boundaries.
