# Global Student Highways

A standalone, responsive data story for static deployment on GitHub Pages.

## Intended location

```text
C:\Alan\github\2025 website\01alan20.github.io\projects\global-mobility
```

All page assets use relative paths. The portfolio link in the fixed header points to `../../`, which resolves to the website root from `/projects/global-mobility/`.

## What the project shows

### Global section: 2013–2023

- Annual worldwide totals for internationally mobile tertiary students
- A selected archive of major published origin-to-destination corridors for 2016–2023
- 2023 origin and host-country rankings
- Calculated decade growth, absolute growth, and compound annual growth

The 2013 global total is explicitly marked as an estimate. It is an interpolation used to create a complete decade view. No 2013–2015 bilateral routes are inferred. Those years remain totals-only because the audited headline-route archive used here begins in 2016.

### European section: 2014–2024 cumulative

- Erasmus+ Key Action 1 country-to-country learning-mobility participant movements
- 8,273,582 represented cross-border movements
- 1,120 directed routes across 34 countries
- Inbound, outbound, balance, concentration, and diversity analysis

The European data are **not** a continuation of the global degree-mobility series. The page treats the change in scope and definition as a visible methodological break.

## Open locally

The project has no package-manager or build-system dependency.

From PowerShell:

```powershell
cd "C:\Alan\github\2025 website\01alan20.github.io\projects\global-mobility"
python scripts\serve_local.py
```

Then open:

```text
http://localhost:8080
```

Opening `index.html` directly will often work, but a local server is better for browser security and path testing.

## Rebuild the browser data

```powershell
python scripts\build_data.py
python scripts\validate_project.py
```

`build_data.py`:

1. Reads the checked-in global mobility CSV files.
2. Parses the full `ErasmusFlows.net` Pajek network.
3. Recalculates European totals, balances, concentration, and diversity.
4. Rewrites the processed European CSVs.
5. Generates `assets/js/data.js` for the browser.

No internet connection or API key is required to rebuild the checked-in project.

## Main files

```text
index.html                         Page structure and written narrative
assets/css/styles.css              Responsive editorial design
assets/js/app.js                   Maps, timelines, filters, charts, and interactions
assets/js/data.js                  Generated browser dataset
assets/img/world-map.svg           Static world basemap
assets/img/europe-map.svg          Static Europe basemap
data/global_totals.csv             Annual global totals
data/global_major_corridors.csv    Selected published major corridors
data/global_2023_countries.csv     2023 origin and destination rankings
data/ErasmusFlows.net              Full Erasmus+ country network source
data/naturalearth_lowres.geojson    Public-domain basemap boundaries
scripts/build_data.py              Reproducible data build
scripts/generate_maps.py           Projection-matched basemap generator

The checked-in basemaps work without Python. Regenerating them requires `matplotlib`, `geopandas`, and `pyogrio`; the required Natural Earth geometry is included locally.
scripts/validate_project.py        Project and calculation checks
```

## Data interpretation

- “Internationally mobile students” follows the UIS concept of students who physically crossed a national border for tertiary education.
- The global corridor layer is a curated set of headline routes published in annual *Wissenschaft weltoffen* figures from 2016 onward. The source maps generally display flows of approximately 15,000 students or more. It is not a complete bilateral matrix.
- Erasmus+ values are cumulative participant movements. They should not be read as unique students or degree enrolments.
- Project-created balance, concentration, diversity, and growth calculations are analytical outputs, not official rankings.

See [DATA_DICTIONARY.md](DATA_DICTIONARY.md) for formulas and field definitions.

## Primary sources

- UNESCO Institute for Statistics Data Browser: https://databrowser.uis.unesco.org/
- UIS internationally mobile students metadata: https://uis.unesco.org/sites/default/files/medias/fichiers/2025/07/International_mobile_students_final.pdf
- Wissenschaft weltoffen: https://www.wissenschaft-weltoffen.de/
- European Commission Erasmus+ statistics: https://erasmus-plus.ec.europa.eu/resources-and-tools/statistics-and-factsheets/statistics/for-researchers
- Erasmus learning-mobility project data: https://erasmus-plus.ec.europa.eu/resources-and-tools/factsheets-statistics-evaluations/statistics/data/learning-mobility-projects
- Pajek conversion used for the checked-in European network: https://raw.githubusercontent.com/bavla/wNets/main/Data/ErasmusFlows.net

## Deployment

Commit the whole folder, preserving its internal structure. The page is entirely static and does not require server-side code.
