# 2041 U.S. urban-centre map component

Open `index.html` directly in a browser. It has no package-manager, server, mapping-library, or internet dependency.

## Files

- `urban-map-section.html` — reusable section markup
- `urban-map.css` — self-contained component styles
- `urban-map.js` — map interaction and ranking logic
- `data/us_urban_centres_2041.js` — browser-ready data wrapper
- `data/us_urban_centres_2041.json` — normalized full records
- `data/us_urban_centres_2025_2041.csv` — analysis-friendly table
- `assets/us_contiguous_basemap.png` — static contiguous-U.S. basemap

## Add to another page

1. Copy the component files while preserving the `data/` and `assets/` folders.
2. Add `<link rel="stylesheet" href="urban-map.css">` in the page `<head>`.
3. Paste the contents of `urban-map-section.html` where the map should appear.
4. Load the scripts in this order before `</body>`:

```html
<script src="data/us_urban_centres_2041.js"></script>
<script src="urban-map.js"></script>
```

The dataset uses UN-defined cities and urban centres, not U.S. Census metropolitan statistical areas. It describes total population and is not an enrollment forecast.
