# CNPJ: initial data exploration

Source release: **October 2026**. Retrieved **19 October 2026**.

This is a source inventory and bounded, nonrepresentative EDA preview. It is not a population study or survival analysis.

## What was inspected

The first 10,000 records from each of Empresas0, Empresas1, Estabelecimentos0, Estabelecimentos1, Socios0 and Simples: 60,000 records total. These are separate file prefixes, not 60,000 matched businesses. Six reference archives were downloaded in full and passed ZIP CRC checks. Main archives were streamed only partially, so their full CRCs were not checked.

`profile.json` contains the measured profiles and source URLs. `explore_preview.py` reproduces retrieval and profiling using Python's standard library. Source previews are excluded from Git through the local `.gitignore`. Do not publish identifiable source previews as part of a website.

## Available data

| Dataset | Grain | Useful fields |
|---|---|---|
| Empresas | Legal entity, keyed by CNPJ base | Legal form, declared capital, size category |
| Estabelecimentos | Establishment, keyed by full CNPJ | Headquarters/branch, status and reason, status date, opening date, primary/secondary activity, location |
| Socios | Partner/administrator record | Person/entity/foreign type, role, entry date, age band, country |
| Simples | Legal entity | Simples and MEI flags, option and exclusion dates |

Empresas connects to the other datasets through the CNPJ base. Aggregate partners before joining to establishments to avoid multiplying establishment counts. Prefixes from separate files are not guaranteed to overlap, so their join-match rate would not measure source completeness.

Reference rows: 1,359 CNAE activity codes; 63 registration reasons; 5,572 municipality codes; 92 legal forms; 255 country codes; 68 partner qualifications. These are dictionary rows, not counts of currently valid municipalities or countries.

Source definitions: https://www.gov.br/receitafederal/dados/cnpj-metadados.pdf

Source files: https://arquivos.receitafederal.gov.br/index.php/s/YggdBLfdninEJX9

Pipeline schema: https://github.com/caiopizzol/cnpj-data-pipeline/blob/main/initial.sql

The live source listing included monthly directories from May 2023 through October 2026. Listing a directory does not establish completeness or comparability of all historical files.

## First measured observations

All six previews parsed to their expected field counts.

| Measure | File 0 prefix | File 1 prefix |
|---|---:|---:|
| Establishment records | 10,000 | 10,000 |
| Active | 6,238 (62.38%) | 1,448 (14.48%) |
| Deregistered | 3,300 (33.00%) | 6,448 (64.48%) |
| Opening-date range | 1970-06-25 to 2025-07-11 | 1944-01-01 to 2006-07-11 |
| Missing/sentinel status date | 0 | 43 |
| Duplicate full CNPJ within prefix | 0 | 0 |
| Status date before opening date | 1 | 0 |
| Company records | 10,000 | 10,000 |
| Zero declared capital | 1,039 | 8,641 |
| Median declared capital, BRL | 2,500 | 0 |
| Maximum declared capital, BRL | 600,000,000 | 120,000,000,000 |

The large differences between prefixes demonstrate that source ordering must be investigated before selecting a sample. Neither column estimates national composition. Declared capital is not revenue, profit, valuation, or current cash. Zero and extreme values need interpretation before aggregation.

No nonmissing date in these previews failed calendar parsing. Simples exclusion dates extend to 2026-12-31, after retrieval: inspect effective-date semantics rather than automatically deleting future dates. One establishment's status date precedes its opening date; its meaning needs investigation, not automatic correction.

Missingness can be structural: foreign-country fields, special-status fields and partner representatives do not apply to every record. Blank must be distinguished from an explicit No and from a documented date sentinel.

## Questions supported by the available fields

1. **Composition:** Which activities, legal forms and size categories dominate the registered population? Report companies and establishments separately, with active and all-status views.
2. **Geography:** How does industry composition vary across states and municipalities? Counts alone do not measure per-capita business intensity; that requires external denominators and geography crosswalks.
3. **Administrative status:** How do status and deregistration-reason distributions vary by industry, geography, opening cohort and legal form? These are descriptive associations, not failure probabilities.
4. **Age and cohorts:** What is the distribution of time since recorded opening among currently active establishments? How many records in the snapshot have opening dates in each year? The latter is not automatically a complete historical business-birth series.
5. **Organisation:** How common are branches, and how geographically dispersed are multi-establishment companies?
6. **MEI/Simples:** How do current registration flags differ by activity, geography and opening cohort? Historical option/exclusion dates need semantic checks before estimating transitions.
7. **Declared capital:** How do zeros, medians, upper quantiles and extremes differ across legal forms and size categories? Avoid headline means until outliers and reporting conventions are understood.
8. **Partner structure:** How do recorded partner counts, role types and age bands vary across company types? Coverage varies; age band is not founder age, and masked documents are not unique person identifiers.
9. **Data quality:** Which fields and groups have missing values, obsolete/unmatched codes, date anomalies and suspicious numerical values? How much does cleaning change conclusions?

## Focused next EDA

Use a complete release, processed with streaming SQL/Parquet, to produce population counts and a deterministic hash sample for detailed plots. Filter geography only after reading all relevant shards; a shard is not a geographic sample. Keep raw values alongside interpreted fields.

First outputs: table/key coverage; missingness and date checks; active/all-status composition; industry and geographic distributions; opening-year and active-age distributions; capital quantiles; and headquarters/branch structure. Every figure should state its unit, denominator and source month. Choose a substantive project question after examining those results.

Survival analysis remains a possible later step. No survival estimates or causal conclusions are supported by this preview alone.
