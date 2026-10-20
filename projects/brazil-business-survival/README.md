# Brazil business survival

A reproducible national CNPJ profile, paired with IBGE's published 2017 employer cohort observed through 2022. Open [the visual story](index.html) or [the notebook](brazil-business-survival.ipynb) for questions, source records, figures and analytical limitations.

## View the story

Open `index.html` directly in a browser. The data, state geometry and licensed fonts are local; no build or JavaScript package installation is needed. The JSON and JavaScript data bridge are generated from the same analysis payload. Source links need an internet connection when followed.

Alternatively, from this project directory:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:8765/`. The cohort slider, playback, state menu and map measures work with a keyboard, and animations respect reduced-motion preferences.

The frontend uses a cartographic exhibition design: an interactive opening map, six cohort-year stations, animated survivor/departure marks, a registration ledger and state comparisons. The opening map and national curve explicitly distinguish employer local units from employer enterprises. Local Archivo Narrow and Public Sans fonts include their open licences. [design.md](design.md) records the visual system and interaction decisions.

The October 2026 CNPJ snapshot describes registered establishments and legal entities, including public bodies and nonprofits as well as commercial businesses. Its current active shares are **not five-year survival probabilities**. Only Empresas and Estabelecimentos shards enter the national aggregation; inventoried partner and MEI/Simples tax-option files are not processed. No owner-level, MEI-specific or tax-regime conclusions follow. The verified monthly directories span 41 months between May 2023 and October 2026; this is not a claim that older data cannot exist elsewhere. The separate 63.95 GB TAR was inspected only through its first two member headers, which point to May 2025; `data/archive-triage.json` records this bounded triage, not a complete contents catalogue. No individual survival model or predictive calibration is claimed.

IBGE's enterprise benchmark is 37.31889% five-year survival among 261,302 employer-enterprise births. State tables instead describe 296,850 employer local-unit births, with a 37.8538% Brazil benchmark. State sector standardisation uses a common national sector mix; it is descriptive, lacks employee-size adjustment and cannot identify a causal location effect.

## Reproduce

Run commands from this project directory. Python 3.11+ is recommended. Install the scientific and acquisition dependencies in an isolated environment:

```powershell
python -m venv .venv
.venv/Scripts/Activate.ps1
.venv/Scripts/python -m pip install -r requirements.txt
```

Use the environment's Python for the following commands. The acquisition step downloads approximately 6.8 GB of compressed CNPJ archives plus reference files and needs additional space for Parquet data and DuckDB temporary processing. Do not use `--only` for national estimates. Downloads retain source hashes, retrieval times and complete-archive CRC checks. Interrupted downloads can be resumed by rerunning the acquisition command.

```powershell
python research/acquire_cnpj.py --workers 2
python research/acquire_ibge.py
python research/analysis.py
python research/deepen.py
python research/test_analysis.py
python research/test_depth.py
python research/build_notebook.py
python -m ipykernel install --user --name brazil-data --display-name "Brazil business analysis"
python -c "import nbformat; from nbclient import NotebookClient; from pathlib import Path; p=Path('brazil-business-survival.ipynb'); n=nbformat.read(p,as_version=4); NotebookClient(n,timeout=600,kernel_name='brazil-data',resources={'metadata':{'path':str(Path.cwd())}}).execute(); nbformat.write(n,p)"
```

The generator recreates the notebook and clears prior execution outputs. Execute it afterward to refresh rendered tables and PNG figures. Notebook execution records Python and scientific package versions in `data/runtime-versions.json`, reads existing aggregate inputs and never downloads implicitly. Its optional local rebuild flag is disabled by default. A notebook started at the repository root also detects the project directory.

`deepen.py` can also refresh the derived layer from the existing national aggregate and original IBGE extract without reprocessing the large CNPJ files. It exports annual cohort attrition, original-cohort percentage-point losses, conditional survival to the fixed five-year horizon, 19 industry sections × 27 state comparisons, and three common-sector ranking specifications. Derived CSV tables include formulas and units in the notebook. The website exposes six reader questions, industry and minimum-cohort controls, coverage/exclusions, and expandable workings. Later entry cohorts and registration-based survival are explicit evidence gaps, not estimates fabricated from the snapshot.

## Files and units

| Artifact | Purpose |
| --- | --- |
| `research/acquire_cnpj.py` | Official directory inventory, national archive acquisition and typed Parquet conversion |
| `data/source-inventory.json` | Release directory/file inventory, including historical coverage |
| `data/source-manifest.json` | Completed national archive provenance and hashes |
| `research/acquire_ibge.py` | Official IBGE workbooks and publication extraction, definition checks and sector standardisation |
| `data/ibge/survival.json` | Published curves, denominators, source rows, definitions and standardisation diagnostics |
| `research/analysis.py` | Complete national aggregates and reconciliation/feasibility helpers |
| `data/story.json` | Compact national analytical payload; never a prefix sample |
| `data/analysis-tables/` | Exported national CSV tables |
| `assets/notebook/` | Matplotlib figures generated by notebook execution |

Raw archives and Parquet working data are ignored by version control. Keep them locally to reproduce the aggregation. The original 60,000-row exploratory preview is nonrepresentative and must not be substituted for the complete national data.

CNPJ status, geography, primary activity and opening cohorts count establishments. Company size codes and declared capital count company entities once per CNPJ root. IBGE enterprise sectors and employee-size bands count employer enterprises; IBGE state rates count employer local units. Do not merge these denominators or interpret the gap as calibration error.

All-register national counts include EX and unknown geography. Domestic counts and the domestic active share cover the 26 Brazilian states plus the Federal District and supply the UF-map comparator. Declared-capital quantiles exclude null/invalid amounts but retain zeros, negative values and extremes; the count equal to `999999999999` is flagged as a suspected sentinel without assuming it is erroneous.

## Sources and interpretation

Sources are [Receita Federal's CNPJ public files](https://arquivos.receitafederal.gov.br/index.php/s/YggdBLfdninEJX9), the [official CNPJ layout](https://www.gov.br/receitafederal/dados/cnpj-metadados.pdf), [IBGE's 2022 tables](https://ftp.ibge.gov.br/Demografia_das_Empresas_e_Estatisticas_de_Empreendedorismo/2022/) and [IBGE's publication](https://www.ibge.gov.br/biblioteca/visualizacao/livros/liv102143.pdf). Exact original URLs, retrieval records and checksums are retained in machine-readable manifests. The [CNPJ pipeline reference](https://github.com/caiopizzol/cnpj-data-pipeline) informs the reproducible pipeline, while analytical inputs come from official sources.

Employer survival means remaining an employer in every consecutive observation year; it need not mean continuous legal registration, and loss of employer status need not mean business closure. Five-year follow-up includes the pandemic but does not isolate its effect. No fabricated uncertainty intervals, reconstructed survivor counts or adjusted individual predictions are supplied. Sector-support sensitivity and small denominators remain explicit in the notebook.

Company profiles count unique CNPJ roots after compatible-profile normalisation. The source has 70,517,438 company rows and 70,517,437 roots, including one duplicated root. Legal-nature `0000` and size `00`/missing are unreported placeholders; zero capital remains valid. Compatible reported values are merged, genuine conflicts become null and are flagged, and raw Parquet is preserved. Source-row, duplicate-group, ambiguity and remaining-duplicate counts remain explicit in the aggregate.
