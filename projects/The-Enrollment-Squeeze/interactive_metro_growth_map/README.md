# Interactive metropolitan population-growth map

This package contains the reusable interactive map from the conclusion of
**The Enrollment Squeeze**.

## Files

- `index.html` — standalone demonstration
- `component.html` — section markup for copying into an existing page
- `metro-map.css` — namespaced component styles
- `metro-map.js` — bubble interaction, tooltip, ranking, and selection logic
- `data/metro_population_growth.json` — readable source data
- `data/metro_population_growth.js` — local-file-compatible data wrapper
- `assets/us_metro_basemap.png` — offline U.S. basemap

## Use as a standalone page

Open `index.html` directly in a browser.

## Add to The Enrollment Squeeze

1. Copy `assets/us_metro_basemap.png` into the project `assets/` folder.
2. Copy both files from `data/` into the project `data/` folder.
3. Copy `metro-map.css` and `metro-map.js` into the website directory.
4. Add the contents of `component.html` where the conclusion map should appear.
5. Add this to the page `<head>`:

```html
<link rel="stylesheet" href="metro-map.css">
```

6. Add these immediately before `</body>`:

```html
<script src="data/metro_population_growth.js"></script>
<script src="metro-map.js"></script>
```

The CSS is namespaced under `.metro-growth` to reduce conflicts with the rest
of the site.

## Data note

The circles represent the ten metropolitan areas with the largest numeric
population gains from 2023 to 2024. This is not a flow or migration-origin map.

Source: U.S. Census Bureau, Vintage 2024 Population Estimates.
