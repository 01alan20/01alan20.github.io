# Official IBGE survival extraction

`../data/ibge/survival.json` preserves original workbook precision and 2017 birth denominators. Rebuild with `python research/acquire_ibge.py` from the project directory (Python packages: openpyxl and pymupdf). The script downloads original public XLSX/PDF files, records SHA-256 checksums, and validates counts and curves. No credentials are needed.

## Supported interpretation

- Among the 261,302 employer enterprises in the 2017 birth cohort, published consecutive employer survival is 76.21603% in 2018, 59.63253% in 2019, 49.36434% in 2020, 42.27752% in 2021, and 37.31889% in 2022.
- Employer births include existing firms entering employer status and reactivations, as defined in the publication. These are not simply newly registered companies. Survival requires continuing employer status, so its complement is not a legal closure rate.
- National size and sector comparisons use employer enterprises (Table 2.1, SIDRA 9949). Size bands contain 242,505 births (1-9 salaried employees), 17,192 (10-49), and 1,605 (50+). Their five-year survival rates are 35.88091%, 55.40368%, and 60.87227%.
- State comparisons use employer local units (Table 2.2), a different population. The local-unit Brazil cohort is 296,850 with five-year survival of 37.8538%. Use this comparator for state rates. Do not compare states directly to the 37.31889% enterprise baseline or reuse enterprise denominators.
- Of the 27 state totals, Sergipe has the highest five-year local-unit rate (40.45734%, 2,274 births) and Amapa the lowest (27.8607%, 804 births). These are raw descriptive rates, affected by composition and cohort size.
- Electricity/gas has a high enterprise survival rate but only 119 births. Public administration has only 7. Always retain denominators; do not present fragile tiny-group rankings as general business advice.

## Source quirks and controls

The PDF size-section heading says local units, but its body and Chart 3 explicitly identify enterprises. Table 2.1 size counts sum to the enterprise total, so those records are assigned enterprise grain. Table 2.1's multi-line title also contains unrelated salary/age wording; the actual extracted columns are births and survival rates.

The publication conventions define a dash as exact zero; it is parsed as 0 and preserved as `published_value: "-"`. Confidentiality suppression `x`, unavailable `...`, and not-applicable `..` would be null, never zero. Published rates can be rounded; no survivor counts are inferred from them.

Validation checks: enterprise size and sector birth sums both equal 261,302; 27 state local-unit birth counts sum to 296,850; birth-weighted state five-year rates match the national local-unit rate within published rounding; all 717 extracted curves are nonincreasing with percentages in [0,100]. Original files are retained beside JSON and PDF/text under research.

## Limits

These aggregate tables cannot support municipality-level survival rates, business-level covariate adjustment, founder characteristics, or fitted predictive/causal survival models. No microdata are supplied here. They support descriptive cohort curves and raw comparisons only. The pandemic overlaps follow-up, but the curve alone cannot isolate its effect. No uncertainty intervals or adjusted values are manufactured.

The official product FTP index listed 2016-2022 when acquired. This identifies the latest directory available there; it does not claim to verify every potentially related IBGE publication.

## JSON interface

`national`, `sectors[]`, and `sizes[]` contain employer-enterprise records. `local_units_national`, `states[]`, `regions[]`, and `local_units_by_geography_and_sector[]` contain employer-local-unit records. Each record carries `births`, `five_year_survival_pct`, `curve[]` with `age`, `year`, `survival_pct`, and raw `published_value`, plus `source_table` and exact worksheet `source_row`. `sources[]` contains URL, SHA-256, byte size, and project-relative original-file path. `definitions`, `limitations`, and `controls` describe interpretation and mechanical checks.

## Descriptive sector standardisation

A separate derived comparison uses direct standardisation of state local-unit rates to the Brazil 2017 local-unit birth-cohort industry mix. It uses only sections with positive births and available rates in every state, fixes identical weights for every state, and renormalises national birth shares over that common support. No absent-sector rate is imputed.

The primary comparison retains 17 sections, covering 296,603 of 296,850 national births (99.916793%). Electricity/gas (D, 239 births) and public administration (O, 8) lack positive birth support in some states; U has zero national births. The corresponding national common-support survival comparator is 37.8364342%, rather than the full-population 37.8538%.

`standardised_states[]` contains full raw, common-support raw, and sector-standardised percentages, cohort coverage, smallest included sector cell, source-row support, and descriptive ranks. `sector_standardisation` provides weights, formula and matching comparator. Common-support raw rates use the state's own included-sector birth weights; standardised rates use national weights. This distinguishes the effect of trimming support from reweighting composition.

Tiny cells remain, so sensitivity analyses require at least 10 or 30 births in every included state-sector cell. The threshold of 10 retains 8 sections (88.6471% national coverage), with 20 states changing rank relative to the primary standardisation and maximum movement 4. Threshold 30 retains 5 sections (72.5606%), with 21 states changing rank and maximum movement 8. These support sets represent different populations and must carry their own comparator and coverage. They demonstrate why fine rankings should not become best-location advice.

This is an aggregate, descriptive adjustment for CNAE-section composition alone. It does not adjust size, finer industry, municipality, founder characteristics or business-level covariates. It is not a fitted survival model or a causal effect. Derived rates have no invented confidence intervals. The primary original rates and counts remain unchanged.
