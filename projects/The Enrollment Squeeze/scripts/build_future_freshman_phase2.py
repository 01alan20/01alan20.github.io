from __future__ import annotations

import csv
import gzip
import json
import math
import os
import shutil
import statistics
import zipfile
from collections import defaultdict
from pathlib import Path

import plotly.graph_objects as go
import plotly.io as pio
import shapefile

BASE = Path('/mnt/data')
PROJECT = BASE / 'future_freshman_project'
DATA1 = PROJECT / 'data' / 'phase1'
DATA2 = PROJECT / 'data' / 'phase2'
DASH = PROJECT / 'dashboards'
SCRIPTS = PROJECT / 'scripts'
SOURCES = PROJECT / 'sources'
RAW_WICHE = SOURCES / 'raw' / 'wiche'
RAW_CENSUS = SOURCES / 'raw' / 'census_single_age'
for d in [DATA1, DATA2, DASH, SCRIPTS, SOURCES, RAW_WICHE, RAW_CENSUS]:
    d.mkdir(parents=True, exist_ok=True)

# --------------------
# Cumulative structure
# --------------------
phase1_dir = BASE / 'future_freshman_phase1'
if phase1_dir.exists():
    for p in phase1_dir.iterdir():
        if p.is_file():
            shutil.copy2(p, DATA1 / p.name)

if (BASE / 'wiche_knocking_11th.xlsx').exists():
    shutil.copy2(BASE / 'wiche_knocking_11th.xlsx', RAW_WICHE / 'wiche_knocking_11th.xlsx')
if (BASE / 'census_county_agesex_2020_2025.csv').exists():
    shutil.copy2(BASE / 'census_county_agesex_2020_2025.csv', SOURCES / 'raw' / 'census_county_broad_age_2020_2025.csv')

state_files = sorted(BASE.glob('cc-est2025-syasex-*.csv'))
if len(state_files) != 51:
    raise RuntimeError(f'Expected 51 Census single-age files, found {len(state_files)}')
for p in state_files:
    dest = RAW_CENSUS / p.name
    if not dest.exists() or dest.stat().st_size != p.stat().st_size:
        shutil.copy2(p, dest)

# --------------------
# Constants
# --------------------
year_code_to_year = {2: 2020, 3: 2021, 4: 2022, 5: 2023, 6: 2024, 7: 2025}
fips_to_abbr = {
    '01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT','10':'DE','11':'DC','12':'FL','13':'GA',
    '15':'HI','16':'ID','17':'IL','18':'IN','19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA',
    '26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE','32':'NV','33':'NH','34':'NJ','35':'NM','36':'NY',
    '37':'NC','38':'ND','39':'OH','40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD','47':'TN','48':'TX',
    '49':'UT','50':'VT','51':'VA','53':'WA','54':'WV','55':'WI','56':'WY'
}
target_years = [2026, 2030, 2035, 2041]
source_age = {2026:17, 2030:13, 2035:8, 2041:2}
# Shrinkage scale: county transition evidence equal to 25,000 person-years gets 50% weight.
SHRINK_K = 250.0

# --------------------
# Load compact age panel
# --------------------
pop = {}
county_meta = {}
state_pop = defaultdict(int)
compact_age_rows = []

for path in state_files:
    with path.open('r', encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            yc = int(row['YEAR'])
            age = int(row['AGE'])
            if yc not in year_code_to_year or age > 18:
                continue
            year = year_code_to_year[yc]
            sf = row['STATE'].zfill(2)
            cf = row['COUNTY'].zfill(3)
            fips = sf + cf
            total = int(row['TOT_POP'])
            county_meta[fips] = {
                'state_fips': sf,
                'state': fips_to_abbr[sf],
                'state_name': row['STNAME'],
                'county_name': row['CTYNAME'],
            }
            pop[(fips, year, age)] = total
            state_pop[(sf, year, age)] += total
            compact_age_rows.append({
                'county_fips': fips,
                'state': fips_to_abbr[sf],
                'state_name': row['STNAME'],
                'county_name': row['CTYNAME'],
                'year': year,
                'age': age,
                'population': total,
            })

compact_age_path = DATA2 / 'county_age_panel_0_18_2020_2025.csv.gz'
with gzip.open(compact_age_path, 'wt', encoding='utf-8', newline='') as f:
    fields = list(compact_age_rows[0].keys())
    w = csv.DictWriter(f, fieldnames=fields)
    w.writeheader(); w.writerows(compact_age_rows)

# 2025 school-age demographic snapshot (population, not enrollment)
snapshot_rows = []
for fips, meta in sorted(county_meta.items()):
    def total_ages(a0, a1):
        return sum(pop.get((fips, 2025, a), 0) for a in range(a0, a1 + 1))
    snapshot_rows.append({
        'county_fips': fips,
        **meta,
        'age_0_4_population': total_ages(0,4),
        'elementary_age_5_10_population': total_ages(5,10),
        'middle_age_11_13_population': total_ages(11,13),
        'high_school_age_14_17_population': total_ages(14,17),
        'class_2030_source_age_13': pop.get((fips,2025,13),0),
        'class_2035_source_age_8': pop.get((fips,2025,8),0),
        'class_2041_source_age_2': pop.get((fips,2025,2),0),
    })
with (DATA2 / 'county_pipeline_snapshot_2025.csv').open('w', encoding='utf-8', newline='') as f:
    w=csv.DictWriter(f, fieldnames=list(snapshot_rows[0].keys())); w.writeheader(); w.writerows(snapshot_rows)

# --------------------
# Historical transition ratios
# --------------------
state_transition_obs = defaultdict(list)
for sf in fips_to_abbr:
    for age in range(0,18):
        for year in range(2020,2025):
            a = state_pop.get((sf,year,age),0)
            b = state_pop.get((sf,year+1,age+1),0)
            if a > 0 and b >= 0:
                state_transition_obs[(sf,age)].append((year,b/a,a,b))

state_ratio = {}
for key, obs in state_transition_obs.items():
    state_ratio[key] = statistics.median(x[1] for x in obs)

county_transition_rows = []
county_ratio = {}
county_reliability = {}
for fips, meta in sorted(county_meta.items()):
    sf = meta['state_fips']
    for age in range(0,18):
        obs = []
        for year in range(2020,2025):
            a = pop.get((fips,year,age),0)
            b = pop.get((fips,year+1,age+1),0)
            if a > 0 and b >= 0:
                obs.append((year,b/a,a,b))
        sr = state_ratio[(sf,age)]
        if obs:
            logs = [math.log(max(x[1],1e-9)) for x in obs]
            raw_log = statistics.median(logs)
            raw = math.exp(raw_log)
            exposure = sum(x[2] for x in obs)
            weight = exposure / (exposure + SHRINK_K)
            shrunk_log = weight * raw_log + (1-weight) * math.log(sr)
            shrunk = math.exp(shrunk_log)
            med = statistics.median(x[1] for x in obs)
            mad = statistics.median(abs(x[1]-med) for x in obs)
        else:
            raw = sr; exposure = 0; weight = 0; shrunk = sr; mad = None
        county_ratio[(fips,age)] = shrunk
        county_reliability[(fips,age)] = weight
        county_transition_rows.append({
            'county_fips': fips,
            'state': meta['state'],
            'state_name': meta['state_name'],
            'county_name': meta['county_name'],
            'from_age': age,
            'to_age': age+1,
            'observations': len(obs),
            'source_person_years': exposure,
            'raw_county_median_ratio': raw,
            'state_median_ratio': sr,
            'county_weight': weight,
            'shrunk_ratio': shrunk,
            'ratio_mad': mad if mad is not None else '',
        })

with (DATA2 / 'county_age_transition_ratios.csv').open('w', encoding='utf-8', newline='') as f:
    w=csv.DictWriter(f, fieldnames=list(county_transition_rows[0].keys())); w.writeheader(); w.writerows(county_transition_rows)

# --------------------
# WICHE state controls
# --------------------
wiche_path = DATA1 / 'state_graduate_outlook_2026_2041.csv'
state_targets = {}
with wiche_path.open('r', encoding='utf-8', newline='') as f:
    for row in csv.DictReader(f):
        yr = int(row['class_year'])
        if yr in target_years:
            state_targets[(row['state'],yr)] = int(row['projected_high_school_graduates'])

# Unscaled county projections
unscaled = {}
projection_diagnostics = {}
for fips, meta in sorted(county_meta.items()):
    sf = meta['state_fips']
    for yr in target_years:
        a0 = source_age[yr]
        source = pop.get((fips,2025,a0),0)
        county_mult = 1.0
        state_mult = 1.0
        weights = []
        for a in range(a0,18):
            county_mult *= county_ratio[(fips,a)]
            state_mult *= state_ratio[(sf,a)]
            weights.append(county_reliability[(fips,a)])
        base_state = source * state_mult
        raw_county = source * county_mult
        relative = raw_county/base_state if base_state > 0 else 1.0
        # Horizon-dependent guardrail around the state trajectory.
        caps = {2026:(0.85,1.15),2030:(0.65,1.50),2035:(0.50,2.00),2041:(0.35,3.00)}
        lo,hi = caps[yr]
        relative_capped = min(max(relative,lo),hi)
        pred = base_state * relative_capped
        unscaled[(fips,yr)] = pred
        projection_diagnostics[(fips,yr)] = {
            'source_age': a0,
            'source_population_2025': source,
            'state_survival_multiplier': state_mult,
            'county_survival_multiplier': county_mult,
            'county_relative_to_state': relative,
            'county_relative_to_state_capped': relative_capped,
            'mean_county_weight': statistics.mean(weights) if weights else 0.0,
        }

# State scaling to WICHE controls
state_unscaled = defaultdict(float)
for (fips,yr),v in unscaled.items():
    state_unscaled[(county_meta[fips]['state'],yr)] += v
state_scale = {}
for key,total in state_unscaled.items():
    state_scale[key] = state_targets[key] / total if total else 0.0

projection_rows = []
state_check = defaultdict(float)
national_target = {yr:sum(v for (st,y),v in state_targets.items() if y==yr) for yr in target_years}
for fips, meta in sorted(county_meta.items()):
    for yr in target_years:
        diag = projection_diagnostics[(fips,yr)]
        scale = state_scale[(meta['state'],yr)]
        estimate = unscaled[(fips,yr)]*scale
        state_target = state_targets[(meta['state'],yr)]
        state_check[(meta['state'],yr)] += estimate
        horizon_uncert = {2026:0.04,2030:0.08,2035:0.15,2041:0.25}[yr]
        size_penalty = 0.10 * (1 - min(diag['source_population_2025']/5000.0,1.0))
        reliability_penalty = 0.08 * (1 - diag['mean_county_weight'])
        band = min(0.45, horizon_uncert + size_penalty + reliability_penalty)
        score = max(0.0, 1.0 - band)
        label = 'High' if score >= 0.84 else ('Moderate' if score >= 0.68 else 'Low')
        projection_rows.append({
            'county_fips': fips,
            'state': meta['state'],
            'state_name': meta['state_name'],
            'county_name': meta['county_name'],
            'class_year': yr,
            **diag,
            'state_calibration_factor': scale,
            'projected_high_school_graduates': estimate,
            'scenario_low': max(0,estimate*(1-band)),
            'scenario_high': estimate*(1+band),
            'uncertainty_band_pct': band,
            'confidence': label,
            'county_share_of_state_pool': estimate/state_target if state_target else 0,
            'county_share_of_national_pool': estimate/national_target[yr] if national_target[yr] else 0,
        })

with (DATA2 / 'county_graduate_projections_2026_2041.csv').open('w', encoding='utf-8', newline='') as f:
    w=csv.DictWriter(f, fieldnames=list(projection_rows[0].keys())); w.writeheader(); w.writerows(projection_rows)

state_check_rows=[]
for (st,yr),actual_sum in sorted(state_check.items()):
    target=state_targets[(st,yr)]
    state_check_rows.append({
        'state':st,'class_year':yr,'wiche_state_target':target,
        'county_projection_sum':actual_sum,'difference':actual_sum-target,
        'relative_difference':actual_sum/target-1 if target else 0
    })
with (DATA2/'county_projection_state_check.csv').open('w',encoding='utf-8',newline='') as f:
    w=csv.DictWriter(f,fieldnames=list(state_check_rows[0].keys()));w.writeheader();w.writerows(state_check_rows)

# Wide county file
by_county = defaultdict(dict)
for r in projection_rows:
    by_county[r['county_fips']][int(r['class_year'])] = r
wide_rows=[]
for fips, years in sorted(by_county.items()):
    meta=county_meta[fips]
    base=years[2026]['projected_high_school_graduates']
    row={'county_fips':fips,'state':meta['state'],'state_name':meta['state_name'],'county_name':meta['county_name']}
    for yr in target_years:
        v=years[yr]['projected_high_school_graduates']
        row[f'graduates_{yr}']=v
        row[f'change_{yr}_from_2026']=v-base
        row[f'pct_change_{yr}_from_2026']=v/base-1 if base else ''
        row[f'confidence_{yr}']=years[yr]['confidence']
    wide_rows.append(row)
with (DATA2/'county_projection_wide.csv').open('w',encoding='utf-8',newline='') as f:
    w=csv.DictWriter(f,fieldnames=list(wide_rows[0].keys()));w.writeheader();w.writerows(wide_rows)

# --------------------
# Rolling out-of-sample county allocation backtest
# --------------------
backtest_rows=[]
for target_year in [2023,2024,2025]:
    train_years=list(range(2020,target_year-1))
    for target_age in range(1,19):
        from_age=target_age-1
        # State training ratios
        train_state_ratio={}
        for sf in fips_to_abbr:
            vals=[]
            for y in train_years:
                a=state_pop.get((sf,y,from_age),0); b=state_pop.get((sf,y+1,target_age),0)
                if a>0: vals.append(b/a)
            if vals: train_state_ratio[sf]=statistics.median(vals)
        # Predictions then calibrate each model to actual state-age total
        interim=[]
        model_sums=defaultdict(float)
        for fips,meta in county_meta.items():
            sf=meta['state_fips']
            if sf not in train_state_ratio: continue
            src=pop.get((fips,target_year-1,from_age),0)
            actual=pop.get((fips,target_year,target_age),0)
            obs=[]
            for y in train_years:
                a=pop.get((fips,y,from_age),0); b=pop.get((fips,y+1,target_age),0)
                if a>0: obs.append((b/a,a))
            sr=train_state_ratio[sf]
            if obs:
                raw_log=statistics.median(math.log(max(x[0],1e-9)) for x in obs)
                raw=math.exp(raw_log)
                exposure=sum(x[1] for x in obs)
                wt=exposure/(exposure+SHRINK_K)
                shrunk=math.exp(wt*raw_log+(1-wt)*math.log(sr))
            else:
                raw=sr; exposure=0; wt=0; shrunk=sr
            preds={'no_change':float(src),'raw_county_ratio':src*raw,'shrunk_county_state':src*shrunk}
            interim.append((fips,meta,src,actual,exposure,wt,preds))
            for model,pred in preds.items(): model_sums[(sf,model)]+=pred
        scales={}
        for sf in fips_to_abbr:
            actual_state=state_pop.get((sf,target_year,target_age),0)
            for model in ['no_change','raw_county_ratio','shrunk_county_state']:
                total=model_sums.get((sf,model),0)
                scales[(sf,model)]=actual_state/total if total else 0
        for fips,meta,src,actual,exposure,wt,preds in interim:
            out={
                'county_fips':fips,'state':meta['state'],'county_name':meta['county_name'],
                'target_year':target_year,'target_age':target_age,'source_age':from_age,
                'source_population':src,'actual_population':actual,
                'training_transitions':len(train_years),'source_person_years':exposure,'county_weight':wt,
            }
            for model,pred in preds.items(): out[model+'_prediction']=pred*scales[(meta['state_fips'],model)]
            backtest_rows.append(out)

with gzip.open(DATA2/'county_backtest_predictions.csv.gz','wt',encoding='utf-8',newline='') as f:
    w=csv.DictWriter(f,fieldnames=list(backtest_rows[0].keys()));w.writeheader();w.writerows(backtest_rows)

def summarize(rows, model, filter_fn=lambda r: True):
    rr=[r for r in rows if filter_fn(r)]
    actual=sum(r['actual_population'] for r in rr)
    abs_err=sum(abs(r[model+'_prediction']-r['actual_population']) for r in rr)
    sq_err=sum((r[model+'_prediction']-r['actual_population'])**2 for r in rr)
    bias=sum(r[model+'_prediction']-r['actual_population'] for r in rr)
    return {
        'segment':'All' if filter_fn.__name__=='<lambda>' else filter_fn.__name__,
        'model':model,'observations':len(rr),'actual_population':actual,
        'mean_absolute_error':abs_err/len(rr) if rr else 0,
        'root_mean_squared_error':math.sqrt(sq_err/len(rr)) if rr else 0,
        'weighted_absolute_percentage_error':abs_err/actual if actual else 0,
        'weighted_bias':bias/actual if actual else 0,
    }

segments=[('All',lambda r:True),('Small counties (<500 source)',lambda r:r['source_population']<500),('Mid counties (500-4999)',lambda r:500<=r['source_population']<5000),('Large counties (5000+)',lambda r:r['source_population']>=5000)]
backtest_summary=[]
for seg_name,fn in segments:
    for model in ['no_change','raw_county_ratio','shrunk_county_state']:
        row=summarize(backtest_rows,model,fn); row['segment']=seg_name; backtest_summary.append(row)
with (DATA2/'county_backtest_summary.csv').open('w',encoding='utf-8',newline='') as f:
    w=csv.DictWriter(f,fieldnames=list(backtest_summary[0].keys()));w.writeheader();w.writerows(backtest_summary)

# --------------------
# Interactive county map using bundled Basemap county geometry
# --------------------
shape_base='/opt/pyvenv/lib/python3.13/site-packages/mpl_toolkits/basemap_data/UScounties'
reader=shapefile.Reader(shape_base,encoding='latin1')
valid_fips=set(by_county)
features=[]
for sr in reader.iterShapeRecords():
    rec=sr.record.as_dict(); fips=str(rec['FIPS']).zfill(5)
    if fips not in valid_fips: continue
    geom=sr.shape.__geo_interface__
    features.append({'type':'Feature','id':fips,'properties':{},'geometry':geom})
geojson={'type':'FeatureCollection','features':features}
matched={x['id'] for x in features}; unmatched=sorted(valid_fips-matched)

# One trace keeps county geometry in the HTML only once. Dropdowns update the values.
map_fips=sorted(matched)
def map_arrays(mode,yr):
    z=[]; text=[]
    for fips in map_fips:
        r=by_county[fips][yr]
        base=by_county[fips][2026]['projected_high_school_graduates']
        if mode=='absolute':
            val=r['projected_high_school_graduates']
            detail=f"Projected graduates: {val:,.0f}<br>Confidence: {r['confidence']}"
        else:
            val=(r['projected_high_school_graduates']/base-1)*100 if base else 0
            detail=f"Change from 2026: {val:+.1f}%<br>{yr} pool: {r['projected_high_school_graduates']:,.0f}"
        z.append(val)
        text.append(f"{r['county_name']}, {r['state']}<br>{detail}")
    return z,text

z0,t0=map_arrays('absolute',2026)
map_fig=go.Figure(go.Choropleth(
    geojson=geojson, locations=map_fips, featureidkey='id', z=z0, text=t0,
    hoverinfo='text', marker_line_width=0.15, colorbar_title='Graduates'
))
buttons=[]
for yr in target_years:
    z,text=map_arrays('absolute',yr)
    buttons.append({'label':f'Graduates {yr}','method':'update','args':[{'z':[z],'text':[text],'zmid':[None]},{'title':f'Estimated County Graduate Pool — Class of {yr}'}]})
for yr in [2030,2035,2041]:
    z,text=map_arrays('change',yr)
    buttons.append({'label':f'Change to {yr}','method':'update','args':[{'z':[z],'text':[text],'zmid':[0]},{'title':f'County Graduate Pool Change: 2026 to {yr}'}]})
map_fig.update_geos(scope='usa',fitbounds='locations',visible=False)
map_fig.update_layout(title='Estimated County Graduate Pool — Class of 2026',height=690,margin={'l':0,'r':0,'t':75,'b':0},updatemenus=[{'buttons':buttons,'x':.02,'y':1.07}])

largest_declines=sorted(wide_rows,key=lambda r:float(r['pct_change_2041_from_2026']) if r['pct_change_2041_from_2026']!='' else 0)[:20]
largest_growth=sorted(wide_rows,key=lambda r:float(r['pct_change_2041_from_2026']) if r['pct_change_2041_from_2026']!='' else 0,reverse=True)[:20]
def table_html(rows):
    body=''.join(f"<tr><td>{r['county_name']}, {r['state']}</td><td>{r['graduates_2026']:,.0f}</td><td>{r['graduates_2041']:,.0f}</td><td>{float(r['pct_change_2041_from_2026']):+.1%}</td></tr>" for r in rows)
    return '<table><thead><tr><th>County</th><th>2026</th><th>2041</th><th>Change</th></tr></thead><tbody>'+body+'</tbody></table>'

county_html=DASH/'future_freshman_county_maps.html'
with county_html.open('w',encoding='utf-8') as f:
    f.write(f'''<!doctype html><html><head><meta charset="utf-8"><title>The Future Freshman Map — County Phase</title>
<style>body{{font-family:Arial,sans-serif;max-width:1450px;margin:auto;padding:24px;color:#202124}}.note{{background:#f5f5f5;border-left:4px solid #777;padding:14px;margin:18px 0}}.grid{{display:grid;grid-template-columns:1fr 1fr;gap:24px}}table{{border-collapse:collapse;width:100%}}th,td{{padding:7px;border-bottom:1px solid #ddd;text-align:right}}th:first-child,td:first-child{{text-align:left}}@media(max-width:900px){{.grid{{grid-template-columns:1fr}}}}</style></head><body>
<h1>The Future Freshman Map</h1><p>County demographic cohort model, calibrated to WICHE state graduate projections.</p>
<div class="note"><b>Interpretation:</b> These are estimated high-school graduate pools, not college-ready or college-going counts. County trajectories use Census single-year age cohorts and age-to-age ratios partially pooled toward state patterns. State totals are forced to match WICHE. Scenario bands are planning ranges, not statistical confidence intervals.</div>
{pio.to_html(map_fig,full_html=False,include_plotlyjs='cdn')}
<div class="grid"><div><h2>Largest projected contractions by 2041</h2>{table_html(largest_declines)}</div><div><h2>Largest projected growth by 2041</h2>{table_html(largest_growth)}</div></div>
<p><small>Boundary geometry is the county shapefile bundled with Basemap. {len(matched):,} of {len(valid_fips):,} 2025 county-equivalent FIPS are rendered. The complete modelling data include all county equivalents; unmatched areas are boundary-definition changes that require official 2025 Census geometry in a later build.</small></p>
</body></html>''')

# Place the Phase 1 map in the dashboard folder as well.
phase1_map=DATA1/'future_freshman_state_maps.html'
if phase1_map.exists(): shutil.copy2(phase1_map,DASH/'future_freshman_state_maps.html')

# --------------------
# Methodology/readme/source manifest
# --------------------
all_summary=[r for r in backtest_summary if r['segment']=='All']
summary_by_model={r['model']:r for r in all_summary}

def fmtpct(x): return f'{x:.2%}'

method=(PROJECT/'METHODOLOGY_PHASE2.md')
method.write_text(f'''# Phase 2 methodology: county demographic cohort model

## Purpose

Estimate the size and location of the domestic high-school graduate pool for 2026, 2030, 2035 and 2041 at county level.

This phase estimates **graduates**, not college readiness or college attendance. Those are separate later layers.

## Cohort alignment

The July 2025 Census single-year age estimates are aligned to future graduating classes:

- Class of 2026: age 17 in 2025
- Class of 2030: age 13 in 2025
- Class of 2035: age 8 in 2025
- Class of 2041: age 2 in 2025

## County survival model

For each county and starting age 0–17, annual age-to-age ratios were calculated from 2020–2025:

`population(age + 1, year + 1) / population(age, year)`

County ratios are noisy, especially in small counties. Ratios are therefore estimated on the log scale and shrunk toward their corresponding state ratios. The county weight is:

`source person-years / (source person-years + {SHRINK_K:,.0f})`

A county with little evidence is driven mainly by its state pattern. A large county receives more weight on its own observed history. Long-horizon county deviations are bounded with horizon-specific cumulative guardrails before state calibration.

## State calibration

County projections are scaled within each state so their sums equal WICHE's projected total public and private high-school graduates for each target class. This preserves credible state totals while allocating them to counties using current cohorts and recent county-specific migration/survival patterns.

## Backtest

The county allocation model was tested out of sample for one-year age transitions in 2023, 2024 and 2025. Each test uses only earlier transitions for training, and each model is calibrated to the actual state-age total before county error is measured.

| Model | WAPE | Weighted bias |
|---|---:|---:|
| No-change county share | {fmtpct(summary_by_model['no_change']['weighted_absolute_percentage_error'])} | {fmtpct(summary_by_model['no_change']['weighted_bias'])} |
| Raw county ratio | {fmtpct(summary_by_model['raw_county_ratio']['weighted_absolute_percentage_error'])} | {fmtpct(summary_by_model['raw_county_ratio']['weighted_bias'])} |
| Shrunk county/state ratio | {fmtpct(summary_by_model['shrunk_county_state']['weighted_absolute_percentage_error'])} | {fmtpct(summary_by_model['shrunk_county_state']['weighted_bias'])} |

The shrunk model is retained only if it improves or remains competitive with the simpler alternatives. Longer-horizon uncertainty is materially larger than this one-year backtest.

## Limitations

1. Census resident population is not the same as school enrollment.
2. Private-school, homeschool, grade retention and early/late school entry are absorbed indirectly by state calibration.
3. County ratios reflect migration as well as demographic survival.
4. WICHE controls make the state totals external projections rather than purely model-generated totals.
5. 2041 is based on very young children and should be treated as a scenario, not a precise forecast.
6. County scenario bands are planning ranges, not formal statistical confidence intervals.
7. The dashboard's bundled county geometry predates some 2025 county-equivalent boundary changes; the CSV data are complete.
''',encoding='utf-8')

readme=(PROJECT/'README.md')
readme.write_text(f'''# The Future Freshman Map

## Current cumulative build: Phase 2

This zip contains every Phase 1 output plus the new county-level demographic cohort model and raw source files used so far.

## New in Phase 2

- Census county population by single year of age, 2020–2025
- County demographic pipeline snapshot for elementary-, middle- and high-school-age populations
- Historical county age-to-age survival ratios
- Empirical shrinkage toward state transition ratios
- County graduate-pool estimates for 2026, 2030, 2035 and 2041
- State calibration checks against WICHE
- Rolling out-of-sample county backtests
- Interactive county maps and county change tables
- Reproducible Phase 2 build script

## Important interpretation

The current model estimates the **future high-school graduate pool**. It does not yet estimate:

- academic college readiness;
- immediate college-going probability;
- two-year versus four-year entry;
- interstate mobility;
- institution-specific recruitment exposure.

## County backtest headline

- No-change WAPE: {fmtpct(summary_by_model['no_change']['weighted_absolute_percentage_error'])}
- Raw county ratio WAPE: {fmtpct(summary_by_model['raw_county_ratio']['weighted_absolute_percentage_error'])}
- Shrunk county/state WAPE: {fmtpct(summary_by_model['shrunk_county_state']['weighted_absolute_percentage_error'])}

## Folder guide

- `data/phase1/` — previous state-level outputs
- `data/phase2/` — county panels, projections and validation
- `dashboards/` — interactive state and county HTML dashboards
- `sources/raw/` — raw source files retained in the cumulative package
- `scripts/` — reproducible build code
- `METHODOLOGY_PHASE2.md` — assumptions, model and limitations

## Next phase

Add the readiness layer using local assessment/graduation/absence evidence, calibrated by state NAEP, with explicit observed/modelled flags. Readiness should remain separate from the demographic projection.
''',encoding='utf-8')

source_rows=[
 {'source':'WICHE Knocking at the College Door, 11th Edition','use':'State graduate control totals and state benchmark','url':'https://www.wiche.edu/knocking/data/','local_location':'sources/raw/wiche/wiche_knocking_11th.xlsx'},
 {'source':'U.S. Census Bureau Vintage 2025 County Single-Year Age and Sex Estimates','use':'County cohort population and age-to-age transitions','url':'https://www.census.gov/data/tables/time-series/demo/popest/2020s-counties-detail.html','local_location':'sources/raw/census_single_age/cc-est2025-syasex-[state FIPS].csv'},
 {'source':'NCES Common Core of Data','use':'Planned next source for school enrollment by grade','url':'https://nces.ed.gov/ccd/','local_location':'Not yet included; national membership files are very large'},
]
with (SOURCES/'source_manifest.csv').open('w',encoding='utf-8',newline='') as f:
    w=csv.DictWriter(f,fieldnames=list(source_rows[0].keys()));w.writeheader();w.writerows(source_rows)

(SOURCES/'raw_data_notes.md').write_text('''# Raw data notes

The cumulative archive includes the WICHE workbook and all 51 Census state/DC single-year age files used for Phase 2. The compact modelling panel is also included as a compressed CSV under `data/phase2/`.

The NCES school membership files are not yet included because the national grade-level raw releases are very large. Phase 2 therefore uses county resident age cohorts rather than claiming to have completed the county-by-grade school enrollment panel.
''',encoding='utf-8')

shutil.copy2(BASE/'build_future_freshman_phase2.py',SCRIPTS/'build_future_freshman_phase2.py')

# Updated data dictionary
fields=[
 ('county_age_panel_0_18_2020_2025.csv.gz','population','Census estimated resident population for a county, year and single year of age'),
 ('county_pipeline_snapshot_2025.csv','elementary_age_5_10_population','Resident population ages 5–10; demographic proxy, not school enrollment'),
 ('county_age_transition_ratios.csv','shrunk_ratio','County age-to-age ratio partially pooled toward the corresponding state ratio'),
 ('county_age_transition_ratios.csv','county_weight','Weight placed on the county ratio based on source population evidence'),
 ('county_graduate_projections_2026_2041.csv','projected_high_school_graduates','County estimate after calibration to WICHE state graduate total'),
 ('county_graduate_projections_2026_2041.csv','scenario_low','Lower planning scenario; not a statistical confidence limit'),
 ('county_graduate_projections_2026_2041.csv','scenario_high','Upper planning scenario; not a statistical confidence limit'),
 ('county_projection_wide.csv','pct_change_2041_from_2026','Estimated county graduate-pool percentage change'),
 ('county_backtest_summary.csv','weighted_absolute_percentage_error','Sum of absolute county errors divided by sum of actual county population'),
]
with (PROJECT/'data_dictionary_phase2.csv').open('w',encoding='utf-8',newline='') as f:
    w=csv.writer(f);w.writerow(['file','field','description']);w.writerows(fields)

manifest={
 'project':'The Future Freshman Map','current_phase':2,
 'generated_utc':'2026-07-12',
 'county_equivalents_modelled':len(county_meta),
 'county_geometries_rendered':len(matched),
 'unmatched_boundary_fips':unmatched,
 'target_classes':target_years,
 'source_age_alignment':source_age,
 'shrinkage_k':SHRINK_K,
 'files':[str(p.relative_to(PROJECT)) for p in sorted(PROJECT.rglob('*')) if p.is_file()]
}
(PROJECT/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')

# Zip cumulative package
zip_path=BASE/'future_freshman_project_current.zip'
if zip_path.exists(): zip_path.unlink()
with zipfile.ZipFile(zip_path,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6,allowZip64=True) as z:
    for p in sorted(PROJECT.rglob('*')):
        if p.is_file(): z.write(p,arcname=str(Path('future_freshman_project')/p.relative_to(PROJECT)))

print(json.dumps({
 'zip':str(zip_path),'project_dir':str(PROJECT),
 'county_count':len(county_meta),'map_matched':len(matched),'map_unmatched':len(unmatched),
 'backtest_all':{r['model']:r['weighted_absolute_percentage_error'] for r in all_summary},
 'zip_mb':round(zip_path.stat().st_size/1024/1024,2),
 'projection_rows':len(projection_rows),
},indent=2))
