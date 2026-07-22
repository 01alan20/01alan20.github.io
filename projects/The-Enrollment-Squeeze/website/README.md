# The Enrollment Squeeze — offline complete prototype

Open `index.html` directly in Chrome or Edge. No server, build step, external
font, mapping library, or internet connection is required.

## Included

- `index.html`
- `styles.css`
- `app.js`
- `data/national_projection.json` and `.js`
- `data/state_market_2041.json` and `.js`
- `data/institution_examples.json` and `.js`
- `data/state_grid_layout.json` and `.js`
- `data/model_methodology.json`

The `.js` data wrappers allow the page to work from a local `file://` URL.
The corresponding JSON files are included for inspection and reuse.

## Important

This is a design and model prototype. The bundled state and institution
records are the values used by the prototype, including illustrative fallback
records. They are not the complete reconciled IPEDS, College Scorecard, and
WICHE production datasets.


## Conclusion evidence

The final chapter contains two evidence blocks:

1. Metropolitan population concentration using U.S. Census Bureau Vintage 2024 estimates.
2. Lower-friction application signals using official UVA and UGA admissions announcements.

The community-college example is not included. Supporting values and source links are stored in `data/conclusion_signals.json`.
