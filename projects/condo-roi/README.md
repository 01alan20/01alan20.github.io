# Singapore Condo Investment Lab

A static, GitHub Pages-ready market and investment dashboard for Singapore private non-landed residential property.

The project has three sections:

1. **Market Trends** — annual price, rent and gross-yield movement across the same filtered project-size universe.
2. **Relative Value** — a historical yield screener at project + area-band level.
3. **Investment Underwriter** — buyer-specific acquisition duties, operating costs, debt service, stress tests and modeled exit returns.

## Install in the existing website

Replace the contents of:

```text
C:\Alan\github\2025 website\01alan20.github.io\projects\condo-roi
```

with this folder. All site paths are relative. The portfolio link points to `../../`.

Test locally from that folder:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Current data state

The supplied `pmi_roi_agg.csv` is retained as the historical baseline. The dashboard currently detects annual columns dynamically and displays 2020–2025.

The 2025 source coverage may be incomplete. Historical annual summaries are medians across available **project-size observations**, not transaction-weighted market indices, because the historical aggregate does not include transaction counts.

The dashboard filters the default universe to:

- Apartment
- Condominium
- Executive Condominium

Landed property records are not ranked alongside condominiums.

## Refresh 2025 and add 2026 YTD

The updater preserves all years before 2025 and downloads only recent URA records.

In PowerShell:

```powershell
$env:URA_ACCESS_KEY="your-access-key"
cd "C:\Alan\github\2025 website\01alan20.github.io\projects\condo-roi"
python scripts\update_ura_data.py
```

The script generates a fresh daily URA token automatically. A valid token can instead be supplied temporarily:

```powershell
$env:URA_TOKEN="today-token"
python scripts\update_ura_data.py
```

Neither credential is written into the dashboard, CSV output or Git repository.

The updater:

1. Downloads all four recent sales batches.
2. Downloads rental quarters from 2025 through the current quarter.
3. Keeps only recent non-landed and executive-condominium observations.
4. Refreshes 2025 and creates 2026 annual columns.
5. Adds latest dates and trailing-12-month sample counts.
6. Creates `data/recent_snapshot.csv` using trailing-12-month medians.
7. Rebuilds `data/dashboard_data.js` and validates the project.

Raw API snapshots are saved under `data/raw/YYYY-MM-DD/` and excluded by `.gitignore`.

## Manual rebuild

After editing `pmi_roi_agg.csv` directly:

```powershell
python scripts\build_dashboard_data.py
python scripts\validate_data.py
```

The browser uses `data/dashboard_data.js`, so the build step is required after a CSV change.

## Important definitions

### Gross rental yield

```text
monthly rent × 12 ÷ purchase price × 100
```

### Indicative payback

```text
purchase price ÷ annual rent
```

The old source field named `ROI` is payback years, not return on investment.

### Underwriter outputs

The model includes:

- Buyer's Stamp Duty
- Additional Buyer's Stamp Duty by buyer profile
- down payment and mortgage amortisation
- vacancy
- maintenance, property tax, insurance and reserves
- cash-on-cash return
- modeled price and rent growth
- selling costs and Seller's Stamp Duty
- estimated project IRR

All assumptions are editable. The outputs are indicative and should not be treated as tax, legal, lending or investment advice.

## Official sources

- URA Data Service API: https://eservice.ura.gov.sg/maps/api/
- IRAS stamp-duty rates: https://www.iras.gov.sg/quick-links/tax-rates/stamp-duty
- IRAS Buyer's Stamp Duty: https://www.iras.gov.sg/taxes/stamp-duty/for-property/buying-or-acquiring-property/buyer%27s-stamp-duty-%28bsd%29
- IRAS Seller's Stamp Duty: https://www.iras.gov.sg/taxes/stamp-duty/for-property/selling-or-disposing-property/seller%27s-stamp-duty-%28ssd%29-for-residential-property

## Browser support

The dashboard uses plain HTML, CSS, SVG, Canvas and JavaScript. There are no CDN dependencies, build tools or server-side requirements.
