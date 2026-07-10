# The Geography of Opportunity

A standalone, responsive data story for GitHub Pages. It uses official U.S. Census Bureau American Community Survey (ACS) data and runs entirely as static HTML, CSS, JavaScript, CSV, and generated browser data.

## Where to put it

Copy this entire folder into:

```text
C:\Alan\github\2025 website\01alan20.github.io\Education Opportunity Map
```

All asset paths are relative, so the folder name and spaces are supported.

Expected public URL:

```text
https://01alan20.github.io/Education%20Opportunity%20Map/
```

A lowercase hyphenated folder such as `education-opportunity-map` would create a cleaner URL, but renaming is optional.

## Quick preview

Open `index.html` directly in a browser. The browser reads a generated JavaScript data file and does not call government APIs at runtime.

For a local web server:

```powershell
cd "C:\Alan\github\2025 website\01alan20.github.io\Education Opportunity Map"
python -m http.server 8000
```

Then open `http://localhost:8000`.

## What is included

- Full-screen animated metro map
- Scroll-driven visual narrative
- Reconfigurable metro constellation
- Two-metro comparison with radar and metric bars
- User-weighted recommendation engine
- Clickable metro profile dialog
- Responsive desktop and mobile layouts
- Keyboard navigation and reduced-motion support
- Official ACS 2023 and 2024 data for 48 metropolitan areas
- Reproducible download, transformation, scoring, and validation scripts
- No third-party Python packages or website libraries

## Data sources

The project uses ACS one-year table-based summary files:

| Measure | ACS table | Construction |
|---|---|---|
| Population | B01003 | 2024 total population |
| Population growth | B01003 | Percentage change from 2023 to 2024 |
| Resident employment growth | B23025 | Percentage change in employed civilians from 2023 to 2024 |
| Employment-to-population ratio | B23025 | Employed civilians divided by population age 16+ |
| Median worker earnings | B20002 | Median earnings for people age 16+ with earnings |
| Median gross rent | B25064 | Monthly median gross rent |
| Bachelor’s attainment | B15003 | Bachelor’s, master’s, professional, and doctoral degree holders divided by population age 25+ |
| Broadband subscription | B28002 | Households with broadband of any type divided by total households |

The source snapshots are stored in `data/raw/`. `data/source_manifest.json` records the reference years, retrieval date, table names, and transformations.

## Why the project does not use metro GDP or job-posting data

BEA no longer publishes a clean current metropolitan GDP series after 2023. Reliable metro job-posting data generally requires a commercial source. The project therefore uses two current ACS labour-market measures rather than presenting an unsupported substitute.

## Refresh and rebuild

From the project folder:

```powershell
python scripts\fetch_official_data.py --refresh
python scripts\build_dataset.py
python scripts\validate_project.py
```

`fetch_official_data.py` downloads the required ACS table files and creates:

```text
data/metro_source.csv
```

`build_dataset.py` creates:

```text
data/metro_opportunity.csv
data/metro-data.js
```

The website reads `metro-data.js`. The CSV files remain available for inspection and analysis.

### Census API key

The included workflow uses Census table-based summary files, so it does not require an API key. A key should not be embedded in the site or committed to the repository. The key supplied during development is not stored in any project file.

## What the score means

The score is a transparent comparative index among the 48 included metros. It is not a causal model, forecast, official government ranking, or complete ranking of every U.S. metropolitan area.

Default composite weights:

```text
30% career strength
25% affordability
20% education depth
15% population momentum
10% broadband connectivity
```

All component scores are percentile positions within this 48-metro comparison set. Users can change the five dimension weights in the recommendation tool.

## Important limitations

- ACS estimates have sampling error; margins of error are not currently shown in the interface.
- Year-to-year ACS changes can be noisy, especially for smaller metros.
- Median earnings and median gross rent describe different populations, so the rent-to-earnings calculation is an affordability proxy, not household disposable income.
- Bachelor’s attainment is a broad talent-ecosystem indicator, not a direct measure of education quality.
- Broadband subscription measures household adoption, not maximum service availability or quality.
- Coordinates are approximate display points and do not affect scores.
- Composite weights are editorial choices, not objectively correct values.

## Validate before publishing

```powershell
python scripts\validate_project.py
```

The validator checks required files, duplicate HTML IDs, referenced assets, JavaScript-targeted IDs, metro counts, CBSA codes, score ranges, data-source labels, and consistency between the CSV and browser dataset.

## Add it to the portfolio homepage

```html
<a href="./Education%20Opportunity%20Map/">
  The Geography of Opportunity
</a>
```

A fuller starter card is provided in `integration-card.html`.

## Jigsaw build note

The public repository is based on Jigsaw. If deployment publishes only Jigsaw’s generated build folder, a new project placed at repository root may not be copied automatically. In that case, either:

1. put the project folder inside `source/`, or
2. add a build step that copies `Education Opportunity Map` into the generated production folder.

Do not maintain two independently edited copies.

## Main files

```text
Education Opportunity Map/
├── index.html
├── README.md
├── DATA_DICTIONARY.md
├── integration-card.html
├── assets/
│   ├── css/styles.css
│   └── js/app.js
├── data/
│   ├── metro_registry.csv
│   ├── metro_source.csv
│   ├── metro_opportunity.csv
│   ├── metro-data.js
│   ├── source_manifest.json
│   ├── us-outline.js
│   └── raw/
│       └── ACS table snapshots
└── scripts/
    ├── fetch_official_data.py
    ├── build_dataset.py
    └── validate_project.py
```

## Customize the design

Design variables are at the top of `assets/css/styles.css`. Page copy and methodology are in `index.html`. Metric labels and interactions are in `assets/js/app.js`. Score weights are in `scripts/build_dataset.py`.
