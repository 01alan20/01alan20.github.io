"""Build the reviewable notebook without downloading data or executing analysis."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
cells = []

def md(text):
    cells.append({'cell_type': 'markdown', 'metadata': {}, 'source': text.strip().splitlines(True)})

def code(text):
    cells.append({'cell_type': 'code', 'execution_count': None, 'metadata': {}, 'outputs': [], 'source': text.strip().splitlines(True)})

md('''# Brazil business survival: what the data can actually tell us
**A national registry profile and a separate, published longitudinal benchmark.**

This notebook asks three questions: What businesses are registered in Brazil in the October 2026 CNPJ release? How do current administrative status and composition differ by state, industry and opening cohort? What can we responsibly say about five-year survival?

The two evidence streams answer different questions. CNPJ is a current administrative snapshot of registered establishments and legal entities, including public bodies and nonprofits as well as commercial businesses. IBGE follows a 2017 cohort of **employer enterprises** through 2022; its state tables concern **employer local units**. An active registration is not proof of uninterrupted trading, employment, or survival. No individual CNPJ survival model is fitted here.

Run all cells from this project directory or from the repository root. Inputs are the complete national aggregate and original-source IBGE extracts. The earlier 60,000-row preview is nonrepresentative and is excluded from national estimates.''')
code('''from pathlib import Path
import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import sys
from importlib import metadata

ROOT = Path.cwd().resolve()
if not (ROOT / 'data' / 'story.json').exists():
    ROOT = ROOT / 'projects' / 'brazil-business-survival'
assert (ROOT / 'research' / 'analysis.py').exists(), 'Run from the project or repository root.'
FIGURES = ROOT / 'assets' / 'notebook'
FIGURES.mkdir(parents=True, exist_ok=True)
plt.rcParams.update({'figure.facecolor':'#faf8f0', 'axes.facecolor':'#faf8f0',
    'axes.spines.top':False, 'axes.spines.right':False, 'axes.labelcolor':'#153d31',
    'text.color':'#153d31', 'font.size':11, 'axes.titleweight':'bold',
    'savefig.facecolor':'#faf8f0', 'figure.dpi':120})
GREEN, YELLOW = '#153d31', '#d8ab2e'
def finish(fig, name, source, unit):
    fig.text(.02, .015, unit + '\\nSource: ' + source, fontsize=8, color='#53645a')
    fig.tight_layout(rect=(0,.09,1,1))
    fig.savefig(FIGURES / (name + '.png'), dpi=180, bbox_inches='tight')
    plt.show()
def read_json(path):
    return json.loads(path.read_text(encoding='utf-8'))''')
code('''runtime_versions = {'python':sys.version}
for package in ['duckdb','pyarrow','pandas','numpy','matplotlib','nbformat','nbclient','openpyxl','requests']:
    try:
        runtime_versions[package] = metadata.version(package)
    except metadata.PackageNotFoundError:
        runtime_versions[package] = 'not installed'
display(pd.Series(runtime_versions,name='Runtime versions').to_frame())
(ROOT / 'data' / 'runtime-versions.json').write_text(json.dumps(runtime_versions,indent=2)+'\\n',encoding='utf-8')''')
md('''## Reproducibility and source inventory
The local acquisition scripts document official URLs, release selection and file provenance. CNPJ processing reads all ten Empresas archives and all ten Estabelecimentos archives, rather than treating one ZIP or a row prefix as a national sample. Partner (Sócios) and MEI/Simples tax-option files are inventoried but are not processed in this aggregation; no owner-level, MEI-specific or tax-regime conclusions follow. Raw archives and Parquet working files are intentionally ignored by Git; the checked-in aggregates keep this notebook practical to execute.

Acquisition is an explicit, potentially large operation. This notebook never downloads files implicitly. To reproduce from scratch, follow the commands in README.md, retain the provenance manifests, build the full aggregate, then run this notebook. Re-execution of this notebook requires only aggregate JSON files, pandas, NumPy and Matplotlib; full processing has additional dependencies described in the README.''')
code('''# Optional rebuild from already acquired local data; deliberately off by default.
REBUILD_LOCAL_AGGREGATES = False
if REBUILD_LOCAL_AGGREGATES:
    get_ipython().run_line_magic('run', str(ROOT / 'research' / 'analysis.py'))

story = read_json(ROOT / 'data' / 'story.json')
ibge = read_json(ROOT / 'data' / 'ibge' / 'survival.json')
# Local helper import without assuming a notebook launch directory.
analysis_namespace = {'__name__': 'notebook_analysis', '__file__': str(ROOT / 'research' / 'analysis.py')}
exec(compile((ROOT / 'research' / 'analysis.py').read_text(encoding='utf-8'), 'analysis.py', 'exec'), analysis_namespace)
validate_story = analysis_namespace['validate_story']
survival_feasibility = analysis_namespace['survival_feasibility']
validate_story(story)
assert story['meta']['survival_model_identified'] is False
assert ibge['national']['births'] == 261302
assert ibge['local_units_national']['births'] == 296850
assert sum(r['births'] for r in ibge['states']) == 296850
display(pd.Series(story['meta'], name='CNPJ release metadata').to_frame())
display(pd.DataFrame(story['meta']['sources']))
manifest = read_json(ROOT / 'data' / 'source-manifest.json')
assert len(manifest) == 20, 'National analysis requires all 20 source archives.'
assert {r['archive'] for r in manifest} == {f'{group}{i}.zip' for group in ['Empresas','Estabelecimentos'] for i in range(10)}
assert all(r['complete_archive_crc_checked'] for r in manifest)
display(pd.DataFrame(manifest)[['archive','release','rows','source_bytes','source_sha256','retrieved_at_utc','complete_archive_crc_checked']])
display(pd.DataFrame.from_dict(read_json(ROOT / 'data' / 'reference-manifest.json'),orient='index'))
display(pd.json_normalize(read_json(ROOT / 'data' / 'archive-triage.json')).T)
display(pd.DataFrame(ibge['sources']))
inventory = read_json(ROOT / 'data' / 'source-inventory.json')
display(pd.Series({k:v for k,v in inventory.items() if not isinstance(v,list)}, name='inventory metadata').to_frame())
for key, value in inventory.items():
    if isinstance(value, list):
        print(f'{key}: {len(value):,} records; first 8 shown')
        display(pd.DataFrame(value).head(8))''')
md('''## National registry profile
**Unit:** CNPJ establishments for administrative status, geography, primary industry and opening date; company entities for legal size and capital. Branches and headquarters belong to the establishment population. Registered companies are not interchangeable with establishments or with IBGE employer enterprises.

Counts below describe the release, not a probability sample. “Active share” divides current active registrations by all registrations in the displayed group; it is not a survival estimate. Retained closed registrations affect this denominator. Any missing or invalid classifications must remain visible in the quality checks.''')
code('''national = story['national']
display(pd.Series(national, name='National registry counts and active share').to_frame())
statuses = pd.DataFrame(story['statuses'])
display(statuses)
fig, ax = plt.subplots(figsize=(9,4.5))
s = statuses.sort_values('count')
ax.barh(s['label'], s['count']/1e6, color=GREEN)
ax.set(xlabel='Establishments (millions)', title='A registry status distribution, not a survival curve')
finish(fig, 'registry-status', 'Receita Federal, CNPJ '+str(story['meta']['release']), 'Unit: registered establishments; current administrative status.')''')
md('''## Geography: scale and current status
The all-register national totals include EX (outside Brazil) and any unknown geography. The domestic comparator restricts to the 26 Brazilian states plus the Federal District (27 UFs): `domestic_establishments`, `domestic_active` and `domestic_active_share`. `outside_or_unknown_geography` records the excluded establishment count. Use the domestic active share for the Brazilian UF map/comparison; use all-register counts to reconcile the full source release. The table below retains every geography category.

The largest registered populations naturally dominate counts. Comparing active shares changes the question from scale to administrative composition. Neither comparison adjusts for opening year, industry, legal form, registration practices or headquarters/branch structure. State differences cannot establish a location effect or support a causal “best state” recommendation.''')
code('''states = pd.DataFrame(story['states'])
display(states.sort_values('total', ascending=False))
fig, axes = plt.subplots(1,2,figsize=(12,8))
s = states.sort_values('total')
axes[0].barh(s['uf'], s['total']/1e6, color=GREEN)
axes[0].set(xlabel='Establishments (millions)', title='Registered scale')
s = states.sort_values('active_share')
axes[1].barh(s['uf'], s['active_share']*100, color=YELLOW)
axes[1].set(xlabel='Currently active (%)', title='Status composition', xlim=(0,100))
finish(fig, 'registry-states', 'Receita Federal, CNPJ '+str(story['meta']['release']), 'Unit: establishments by registered UF. Active share is descriptive; no adjustment.')''')
md('''## Primary industry and opening cohorts
Industry is the establishment's registered primary activity; secondary activities are not additional businesses. The table retains the aggregate's industry coding level and labels. Older opening cohorts have had more opportunity to close, but also face changes in registry coverage and record retention. Cohort active shares mix period, cohort and administrative effects. They must not be plotted or described as observed age-specific survival probabilities.''')
code('''industries = pd.DataFrame(story['industries'])
cohorts = pd.DataFrame(story['cohorts'])
display(industries.sort_values('total', ascending=False))
display(cohorts.sort_values('year'))
fig, ax = plt.subplots(figsize=(10,6))
s = industries.nlargest(12,'total').sort_values('total')
ax.barh(s['label'], s['total']/1e6, color=GREEN)
ax.set(xlabel='Establishments (millions)', title='Twelve largest primary-industry groups')
finish(fig, 'registry-industries', 'Receita Federal, CNPJ '+str(story['meta']['release']), 'Unit: registered establishments, primary activity only; top 12 by count.')
fig, ax = plt.subplots(figsize=(10,4.5))
s = cohorts.copy()
s['numeric_year'] = pd.to_numeric(s['year'], errors='coerce')
s = s[s['numeric_year'].between(1980,2026)].sort_values('numeric_year')
ax.plot(s['numeric_year'], s['active_share']*100, color=GREEN, linewidth=2)
ax.set(xlabel='Registered opening year', ylabel='Currently active (%)', ylim=(0,100), title='Current status by opening year — not a survival curve')
finish(fig, 'registry-opening-cohorts', 'Receita Federal, CNPJ '+str(story['meta']['release']), 'Unit: establishments opened 1980–2026. Other/invalid years remain in the table.')''')
md('''## Company size, capital and data quality
**Unit:** unique CNPJ roots after compatible-profile normalisation; original company source rows and duplicate-resolution diagnostics remain separately reported. CNPJ size codes describe legal registration categories; they are not the salaried-personnel bands in IBGE. Declared share capital is an administrative amount, not revenue, employment, liquidity or inflation-adjusted operating scale. Its heavy tail makes the median and percentiles more useful than an unsupported “typical business” mean. Capital quantiles use successfully parsed, non-null values; missing amounts are excluded, while reported zeros and negative amounts remain included. Zero capital need not mean no economic activity.

Reconciliation checks are necessary but insufficient: totals can reconcile while records contain invalid dates or missing keys. The quality report below is part of the result, not a cleaning footnote. Review its exact denominators before interpreting rare groups or incomplete company matches.''')
md('''Company profiles use **unique CNPJ roots**, while `national.company_source_records` retains the original source-record count. The full-source audit found 70,517,438 source rows and 70,517,437 distinct roots: one root had two profiles. The raw Parquet remains unchanged. Normalisation merges only compatible reported values across duplicate profiles; legal-nature `0000` and size `00`/missing are treated as unreported, while zero capital remains a valid reported value. Genuine conflicting reported values become null and are flagged, rather than choosing a row arbitrarily. The quality report distinguishes duplicate root groups, excess source rows, ambiguous profiles and any remaining duplicate roots. Unique-root company totals and profiles therefore reconcile independently of establishment totals.

The declared capital value `999999999999` is flagged as a suspected sentinel/extreme value, not silently removed or proven erroneous. `suspected_sentinel_999999999999` reports its count. Quantiles retain it, along with zeros and negative values, so readers can assess the administrative field's limitations; these amounts are not validated economic valuations.''')
code('''display(pd.DataFrame(story['company_profile']['size']))
display(pd.DataFrame(story['company_profile']['legal_forms']).sort_values('count',ascending=False))
display(pd.Series(story['company_profile']['capital'], name='Declared company capital (BRL)').to_frame())
display(pd.json_normalize(story.get('quality', {})).T.rename(columns={0:'value'}))
quality_rows = []
for key, value in story.get('quality', {}).items():
    if isinstance(value, int) and not isinstance(value, bool):
        denominator = national['company_source_records'] if key == 'duplicate_company_source_records' else national['companies'] if 'company' in key else national['establishments']
        quality_rows.append({'diagnostic':key,'count':value,'denominator':denominator,'share_pct':100*value/denominator})
display(pd.DataFrame(quality_rows))
validate_story(story)
print('National dimension reconciliations passed.')''')
md('''## Can these CNPJ files identify five-year survival?
No. The verified monthly directories span May 2023 to October 2026: **41 months between release endpoints**, shorter than a 60-month follow-up. This describes the inspected monthly directory coverage, not a claim that older data cannot exist elsewhere. A separate 63.95 GB TAR received bounded header inspection (recorded in `data/archive-triage.json`); its inspected first member headers point to May 2025. This is triage evidence, not an exhaustive catalogue of its contents or proof of a longer observation history. The TAR was not silently treated as a longitudinal dataset. Downloading those verified monthly snapshots cannot manufacture five years of observation. A current opening date plus current active status does not show continuous activity. A current closure/status date does not recover all earlier transitions, temporary inactivity or reactivation.

A defensible individual survival design would first require a longitudinal population definition, observable entry, repeated status histories, explicit event and censoring rules, deduplication and a full follow-up window. The current work supplies none of the evidence needed to claim a fitted or calibrated individual five-year model. The published IBGE cohort below is an external descriptive benchmark with its own population, not a calibration target for all CNPJs.''')
code('''feasibility = survival_feasibility('2023-05','2026-10',horizon_years=5)
assert feasibility['observed_months'] == 41
assert feasibility['identified'] is False
display(pd.Series(feasibility, name='Five-year identification audit').to_frame())''')
md('''## The official five-year benchmark: employer enterprises
IBGE Table 2.1 follows **261,302 employer-enterprise births in 2017** through 2018–2022. An employer enterprise has at least one salaried employee at year end. Employer births also include qualifying reactivations and entry into employer status. Survival requires remaining an employer in every consecutive observation year: losing employer status can end survival without legal closure.

These are published aggregate percentages, not Kaplan–Meier estimates fitted here. The pandemic falls inside the follow-up period, but this curve alone cannot isolate its causal effect. No confidence intervals or reconstructed survivor counts are invented.''')
code('''curve = pd.DataFrame(ibge['national_curve'])
display(curve)
fig, ax = plt.subplots(figsize=(9,5))
ax.plot(curve['age'], curve['survival_pct'], marker='o', color=GREEN, linewidth=2.5)
for row in curve.itertuples():
    ax.annotate(f'{row.survival_pct:.1f}%',(row.age,row.survival_pct),xytext=(0,10),textcoords='offset points',ha='center')
ax.set(xticks=curve['age'], xlabel='Years since employer birth in 2017', ylabel='Surviving as employers (%)', ylim=(0,100), title='Five years later, 37.3% remained continuous employers')
finish(fig, 'ibge-national-curve', 'IBGE, Demografia das Empresas 2022, Table 2.1, row 7.', 'Unit: employer enterprises; fixed 2017 birth cohort, n=261,302; published rates.')''')
md('''## Employer enterprise sectors and size bands
Both comparisons use the enterprise population from Table 2.1. Display cohort denominators alongside rates: tiny groups can look extreme, and a rank does not establish a robust business opportunity. Sector composition, firm characteristics and size are associated; aggregate tables cannot disentangle them. Employee-size bands are the published group labels, not CNPJ legal size codes or a causal treatment.''')
md('''The inspected Table 2.1 and publication do not explicitly document the size-classification reference year, so the bands are not asserted to be measurements at birth or baseline predictors. Zero-birth groups remain in the table but are omitted from the chart.''')
code('''for key, title, filename in [('sectors','Five-year survival by industry','ibge-enterprise-sectors'),('sizes','Five-year survival by salaried-personnel band','ibge-enterprise-sizes')]:
    table = pd.DataFrame(ibge[key])
    display(table[['label','births','five_year_survival_pct','source_table','source_row']])
    # A published dash is exact zero, but a zero-birth group has no interpretable survival proportion.
    s = table[table['births'].gt(0) & table['five_year_survival_pct'].notna()].sort_values('five_year_survival_pct')
    fig, ax = plt.subplots(figsize=(11,max(3.8,len(s)*.36)))
    labels = [f"{r.label}  (n={r.births:,})" for r in s.itertuples()]
    ax.barh(labels,s['five_year_survival_pct'],color=GREEN)
    ax.axvline(ibge['national']['five_year_survival_pct'],color=YELLOW,linestyle='--',label='Enterprise Brazil benchmark')
    ax.set(xlabel='Survived five consecutive years as employers (%)',xlim=(0,100),title=title)
    ax.legend(fontsize=8)
    finish(fig, filename, 'IBGE, Demografia das Empresas 2022, Table 2.1.', 'Unit: employer enterprises born in 2017; labels include original cohort denominators.')''')
md('''## State distribution: a different population
IBGE Table 2.2 concerns **employer local units**, not enterprises. Its Brazil cohort contains **296,850 local-unit births**, with 37.85% surviving five years. The appropriate state comparator is that local-unit Brazil rate, not the 37.32% enterprise rate. A multi-site enterprise may contribute several local units. Rankings are descriptive and unadjusted for industry or employer size; they do not identify a location effect.

The denominator-weighted state average should reproduce the published local-unit national rate, within workbook rounding. This is a reconciliation check, not adjustment or causal evidence.''')
code('''local_states = pd.DataFrame(ibge['states'])
display(local_states[['geography','births','five_year_survival_pct','source_table','source_row']].sort_values('five_year_survival_pct',ascending=False))
weighted = np.average(local_states['five_year_survival_pct'],weights=local_states['births'])
assert abs(weighted - ibge['local_units_national']['five_year_survival_pct']) < .00001
s = local_states.sort_values('five_year_survival_pct')
fig, ax = plt.subplots(figsize=(10,10))
ax.barh([f'{r.geography} (n={r.births:,})' for r in s.itertuples()],s['five_year_survival_pct'],color=GREEN)
ax.axvline(ibge['local_units_national']['five_year_survival_pct'],color=YELLOW,linestyle='--',label='Local-unit Brazil benchmark')
ax.set(xlabel='Five-year employer local-unit survival (%)',xlim=(0,100),title='State outcomes require a local-unit comparator')
ax.legend(fontsize=8)
finish(fig, 'ibge-local-unit-states', 'IBGE, Demografia das Empresas 2022, Table 2.2.', 'Unit: employer local units born in 2017; descriptive state rates; denominators shown.')''')
md('''## Separating industry composition from the state comparison
The state × sector cells in IBGE Table 2.2 permit a **descriptive industry standardisation**. Restrict to sectors with positive cohort births in every state. For sector s, set the common national weight w_s = national births_s / total national births in included sectors. For each state j, the standardised rate is Σ_s w_s × published survival_pct_(j,s).

The same national weights in every state remove differences in the mix of included sectors from this arithmetic comparison. They do not adjust for employee size, firm age within entry definitions, ownership, municipality, selection or unobserved factors. The result is not an individual survival model, a causal location effect, or a forecast. The change from the state's raw common-support rate measures this particular reweighting, not an attributable cause.

The primary support covers 17 sectors and 99.9168% of national local-unit births. Electricity/gas and public administration are excluded because some states have no births; international bodies have no national births. Display both the full-population raw rate and the common-support raw rate so the support restriction is visible. Small positive state-sector denominators still make the standardised comparison fragile.''')
code('''standardisation = ibge['sector_standardisation']
standardised = pd.DataFrame(ibge['standardised_states'])
display(pd.Series({k:v for k,v in standardisation.items() if not isinstance(v,(list,dict))},name='Standardisation support').to_frame())
display(pd.DataFrame({'section':list(standardisation['weights_pct']), 'national_weight_pct':list(standardisation['weights_pct'].values())}))
columns = ['uf','name','full_births','common_births','state_cohort_coverage_pct','min_included_sector_births','raw_full_five_year_pct','raw_common_five_year_pct','standardised_five_year_pct','composition_shift_pp','rank_change_vs_raw_common']
display(standardised[columns].sort_values('standardised_five_year_pct',ascending=False))
assert abs(sum(standardisation['weights_pct'].values())-100) < .00001
for row in ibge['standardised_states']:
    recomputed = sum(r['national_weight_pct']*r['five_year_survival_pct']/100 for r in row['sector_support'])
    assert abs(recomputed-row['standardised_five_year_pct']) < 1e-9
s = standardised.sort_values('standardised_five_year_pct')
fig, ax = plt.subplots(figsize=(10,9))
y = np.arange(len(s))
ax.hlines(y,s['raw_common_five_year_pct'],s['standardised_five_year_pct'],color='#a8b2a7',linewidth=2)
ax.scatter(s['raw_common_five_year_pct'],y,color=YELLOW,label='Raw, same sector support',zorder=3)
ax.scatter(s['standardised_five_year_pct'],y,color=GREEN,label='National sector weights',zorder=3)
ax.set_yticks(y, s['uf'])
ax.axvline(standardisation['national_common_five_year_pct'],color=GREEN,linestyle=':',alpha=.5)
ax.set(xlabel='Five-year employer local-unit survival (%)',title='Industry composition changes the state comparison')
ax.legend(fontsize=8)
finish(fig,'ibge-sector-standardisation','IBGE Table 2.2; own direct sector reweighting.','Unit: employer local units, 2017 births; common sectors only. Descriptive, not causal.')
summary_keys = ['minimum_births_in_every_state_sector','included_sections','national_common_births','national_cohort_coverage_pct','national_common_five_year_pct','states_with_rank_change_vs_primary','max_absolute_rank_change_vs_primary']
display(pd.DataFrame([{k:r[k] for k in summary_keys} for r in standardisation['sensitivity_analyses']]))
for sensitivity in standardisation['sensitivity_analyses']:
    print('Minimum state-sector births:',sensitivity['minimum_births_in_every_state_sector'])
    display(pd.DataFrame(sensitivity['states'])[['uf','common_births','state_cohort_coverage_pct','standardised_five_year_pct','standardised_rank','rank_change_vs_primary_standardisation']].sort_values('standardised_rank'))
''')
md('''The stricter support checks require at least 10 or 30 births in every state's included sector cells, recomputing national weights on each support. This drops national cohort coverage to approximately 88.6% and 72.6%. Ranks can change substantially as the estimand changes; compare rates and denominators as well as ranks. These checks reveal small-cell/support sensitivity, not statistical confidence intervals. Exact values and state results are retained in the structured source extract.''')

md('''## Sensitivity to the population definition
Changing the unit changes the denominator and the meaning of the outcome. The small numerical gap between the two published Brazil rates is not a correction factor to apply to CNPJ active shares. The populations differ in employer coverage, unit structure, entry rules, calendar period and survival definition. Keep each estimate attached to its own denominator.

No individual adjustment, predictive calibration, municipality-level estimate or location-causal model is claimed. Published subgroup differences identify questions for future research, not a reliable forecast for a particular founder.''')
code('''comparison = pd.DataFrame([
    {'population':'CNPJ registered establishments','denominator':national['establishments'],'measure':'Current active registration share (%)','value':national['active_share']*100},
    {'population':'IBGE employer enterprise births, 2017','denominator':ibge['national']['births'],'measure':'Five consecutive years as employer (%)','value':ibge['national']['five_year_survival_pct']},
    {'population':'IBGE employer local-unit births, 2017','denominator':ibge['local_units_national']['births'],'measure':'Five consecutive years as employer (%)','value':ibge['local_units_national']['five_year_survival_pct']}
])
display(comparison)
print('Difference between IBGE local-unit and enterprise rates:', round(comparison.iloc[2]['value']-comparison.iloc[1]['value'],3),'percentage points')''')
md('''## Six questions for readers
1. Out of 100 entrants to the employer population, how many remain after one, three and five years?
2. When is the largest drop-off, and what is the annual attrition rate among those still in the surviving cohort?
3. Does reaching year one improve the conditional outlook for reaching year five?
4. Which industries have higher and lower observed survival, and how large were their cohorts?
5. How does my state compare nationally, within an industry and under different support rules?
6. Does an active registration mean a business is operating continuously? No: CNPJ administrative status and IBGE employer survival answer different questions.

### Time: risk sets, conditional survival and evidence boundaries
Let S(t) be the published percentage of the original enterprise cohort surviving through age t. Annual attrition is **100 × [1 − S(t)/S(t−1)]**, conditional on still belonging to the surviving cohort at t−1. Original-cohort loss is **S(t−1) − S(t)** percentage points. Conditional survival to year five is **100 × S(5)/S(t)**. The year-five value is mechanically 100%; it is not a forecast of surviving another five years.

Rates are derived from rounded published percentages. We do not reconstruct integer events or confidence intervals. They describe this historical employer cohort, not causal improvements from ageing. Reaching a later year selects a different risk set.''')
code('''depth_namespace = {'__name__':'notebook_depth','__file__':str(ROOT/'research/deepen.py')}
exec(compile((ROOT/'research/deepen.py').read_text(encoding='utf-8'),'deepen.py','exec'),depth_namespace)
depth = depth_namespace['derive'](ibge)
assert depth == story['depth'], 'Rebuild derived aggregates before running the notebook.'
time = pd.DataFrame(depth['time'])
display(time)
assert np.isclose(np.prod(1-time['annual_attrition_pct'].dropna()/100)*100,time.iloc[-1]['survival_pct'])
assert np.isclose(time.iloc[1]['conditional_to_horizon_pct'],100*time.iloc[-1]['survival_pct']/time.iloc[1]['survival_pct'])
fig, axes = plt.subplots(1,2,figsize=(11,4.8))
axes[0].bar(time['age'][1:],time['annual_attrition_pct'][1:],color=GREEN)
axes[0].set(xlabel='Year after entry',ylabel='% of preceding surviving cohort',title='Annual attrition')
axes[1].plot(time['age'],time['conditional_to_horizon_pct'],marker='o',color=GREEN)
axes[1].set(xlabel='Already reached age',ylabel='% reaching age five',ylim=(0,105),title='Conditional survival to year five')
finish(fig,'ibge-time-risk-sets','IBGE Table 2.1; ratios of published percentages.','2017 employer enterprises; conditional historical outcomes, not individual forecasts.')
display(pd.DataFrame(depth['evidence_gaps']))''')
md('''### Within-industry state comparisons
Every comparison below uses employer local units, the same 2017 entry cohort and the same CNAE section. A national industry benchmark comes from Table 2.2, not the enterprise table. Zero-birth cells have undefined rates. Positive small cells are retained in the data and can be filtered in the website; exclusions and retained coverage must remain visible. No municipality, employment-size adjustment or causal location effect is identified.''')
code('''within = pd.DataFrame([{'section':s['section'],'industry':s['label'],'national_five_year_pct':s['national_five_year_pct'],**r} for s in depth['within_industry'] for r in s['states']])
display(within)
assert within.shape[0] == 27*len(depth['within_industry'])
example = within[within['section'].eq('G') & within['births'].ge(30)].sort_values('five_year_survival_pct')
fig, ax = plt.subplots(figsize=(9,8.5))
ax.barh(example['uf'],example['five_year_survival_pct'],color=GREEN)
ax.axvline(example['national_five_year_pct'].iloc[0],color=YELLOW,linestyle='--',label='Full national industry cohort')
ax.set(xlabel='Five-year survival (%)',title='Trade and vehicle repair: within-industry state comparison')
ax.legend(fontsize=8)
finish(fig,'ibge-within-industry-states','IBGE Table 2.2; section G.','2017 employer local units; displayed state cells have at least 30 entrants; descriptive.')''')
md('''### Ranking sensitivity: compare the assumptions too
The primary common support includes positive-birth sectors in every state. Requiring at least 10 or 30 entrants in every state-sector cell changes the included industries, cohort coverage, weights and therefore the estimand. A changed rank is a sensitivity result, not evidence that a state's underlying performance changed. These rank ranges are **not confidence intervals**. Rank 1 means the highest rate under that particular specification.''')
code('''ranking = pd.DataFrame(depth['ranking_sensitivity']).sort_values('standardised_rank')
display(ranking)
for threshold in [10,30]:
    assert sorted(ranking[f'rank_min_{threshold}']) == list(range(1,28))
fig, ax = plt.subplots(figsize=(10,7))
for row in ranking.itertuples():
    ax.plot([1,10,30],[row.standardised_rank,row.rank_min_10,row.rank_min_30],alpha=.5,color=GREEN)
    ax.text(31,row.rank_min_30,row.uf,fontsize=8,va='center')
ax.set(xticks=[1,10,30],xticklabels=['Positive births','At least 10','At least 30'],ylabel='State rank (1 = highest)',title='Ranks depend on the supported industry set',ylim=(28,0),xlim=(0,34))
finish(fig,'ibge-rank-sensitivity','IBGE Table 2.2; direct industry standardisation.','Minimum births in every state-sector cell changes support; rank movement is not a confidence interval.')''')
md('''## Findings and boundaries
The complete CNPJ release supports a national description of registered economic structure: administrative status, geographic scale, primary activity, opening cohorts and company profiles. All dimension totals must reconcile to the underlying population. Its active shares remain snapshot statistics, even when grouped by opening year.

IBGE supplies the defensible five-year claim: approximately **37.3% of the 2017 employer-enterprise cohort remained employers through all five observation years**. Size and industry comparisons share that enterprise denominator; state comparisons use a separate local-unit denominator and a 37.9% local-unit Brazil benchmark. Differences remain descriptive. Small denominators, employer transitions and the pandemic period limit interpretation.

The appropriate next step is a longitudinal design with sufficient historical follow-up and explicit event definitions. Until then, presenting a fitted five-year CNPJ model would add apparent precision without identification.

### Sources and artifacts
Original official URLs and SHA-256 records are shown above and retained in `data/ibge/survival.json` and acquisition manifests. IBGE definitions and caveats are retained verbatim in the structured extract below. Tables in `data/analysis-tables/` and PNGs in `assets/notebook/` support review and reuse.''')
code('''display(pd.Series(ibge['definitions'],name='IBGE definitions').to_frame())
for limitation in ibge['limitations']:
    print('•',limitation)
print('Exported figures:', ', '.join(p.name for p in sorted(FIGURES.glob('*.png'))))
print('Aggregate CSV tables:', ', '.join(p.name for p in sorted((ROOT/'data'/'analysis-tables').glob('*.csv'))))''')

notebook = {'cells':cells,'metadata':{'kernelspec':{'display_name':'Python 3','language':'python','name':'python3'},'language_info':{'name':'python','version':'3.11'}},'nbformat':4,'nbformat_minor':5}
for i, cell in enumerate(cells):
    cell['id'] = f'brazil-{i:03d}'
(ROOT/'brazil-business-survival.ipynb').write_text(json.dumps(notebook,ensure_ascii=False,indent=1)+'\n',encoding='utf-8')
print(f'Wrote {len(cells)} cells.')
