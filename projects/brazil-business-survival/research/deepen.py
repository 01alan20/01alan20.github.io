"""Derived cohort measures from published rates, without reconstructing event counts."""
import csv
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]

def time_metrics(curve):
    points=sorted(curve,key=lambda r:r['age'])
    if not points or points[0]['age']!=0 or points[0]['survival_pct']!=100:
        raise ValueError('Curve must start at age zero and 100 percent')
    previous=100
    horizon=points[-1]['survival_pct']
    result=[]
    for i,p in enumerate(points):
        value=p['survival_pct']
        if p['age']!=i or not 0<=value<=previous:
            raise ValueError('Require consecutive ages and a non-increasing bounded curve')
        result.append({'age':i,'year':2017+i,'survival_pct':value,
                       'annual_attrition_pct':100*(1-value/previous) if i and previous else None,
                       'original_cohort_loss_pp':previous-value if i else None,
                       'conditional_to_horizon_pct':100*horizon/value if value else None,
                       'horizon_age':points[-1]['age']})
        previous=value
    return result

def derive(ibge):
    time=time_metrics(ibge['national_curve_with_origin'])
    sectors=[]
    cells=ibge['local_units_by_geography_and_sector']
    for national in cells:
        if national['geography_level']!='country' or not national['section'] or national['births']<=0:
            continue
        states=[{k:r[k] for k in ['uf','name','births','five_year_survival_pct','source_row']}
                for r in cells if r['geography_level']=='state' and r['section']==national['section']]
        assert len(states)==27
        assert sum(r['births'] for r in states)==national['births']
        for row in states:
            if row['births']==0: row['five_year_survival_pct']=None
        weighted=sum(r['births']*(r['five_year_survival_pct'] or 0) for r in states)/national['births']
        assert abs(weighted-national['five_year_survival_pct'])<.00002
        sectors.append({'section':national['section'],'label':national['label'],
                        'national_births':national['births'],'national_five_year_pct':national['five_year_survival_pct'],
                        'national_source_row':national['source_row'],'states':states})
    sensitivities=ibge['sector_standardisation']['sensitivity_analyses']
    ranks=[]
    for primary in ibge['standardised_states']:
        row={k:primary[k] for k in ['uf','name','standardised_rank','standardised_five_year_pct','common_births','min_included_sector_births']}
        for scenario in sensitivities:
            threshold=scenario['minimum_births_in_every_state_sector']
            other=next(s for s in scenario['states'] if s['uf']==row['uf'])
            row[f'rank_min_{threshold}']=other['standardised_rank']
            row[f'rate_min_{threshold}']=other['standardised_five_year_pct']
            row[f'coverage_min_{threshold}_pct']=other['state_cohort_coverage_pct']
        row['max_rank_movement']=max(abs(row['standardised_rank']-row[f'rank_min_{t}']) for t in [10,30])
        ranks.append(row)
    return {'time':time,'within_industry':sectors,'ranking_sensitivity':ranks,
            'definitions':{'annual_attrition':'100 × (1 − S(t)/S(t−1)); denominator is the surviving cohort at the preceding observation.',
                           'original_cohort_loss':'S(t−1) − S(t), percentage points of the original cohort.',
                           'conditional_survival':'100 × S(5)/S(t); remaining in the surviving employer-enterprise cohort through year five, conditional on reaching year t.',
                           'precision':'Derived from published rounded rates. No integer survivor counts or confidence intervals are reconstructed.',
                           'ranking':'Rank 1 is the highest published/reweighted rate. Stricter cell thresholds change the sector support and estimand; rank movement is sensitivity, not a confidence interval.'},
            'evidence_gaps':[{'question':'Do later entry cohorts follow the same trajectory?','status':'Not identified by the imported tables',
                              'needed':'Comparable later entry cohorts at matched ages, with consistent employer definitions and follow-up; calendar-period effects must be separated from cohort age.'},
                             {'question':'What if survival means retaining a registration instead of remaining an employer?','status':'No comparable registration-survival history in this analysis',
                              'needed':'Longitudinal registrations with explicit exit, reactivation and censoring rules. Current CNPJ active share is not a substitute.'}]}

def export(story,ibge):
    story['depth']=derive(ibge)
    payload=json.dumps(story,ensure_ascii=False,indent=2,allow_nan=False)
    (ROOT/'data/story.json').write_text(payload,encoding='utf-8')
    (ROOT/'data/story-data.js').write_text('window.BRAZIL_STORY = '+payload+';\n',encoding='utf-8')
    tables=ROOT/'data/analysis-tables'
    for name,rows in [('survival-time-metrics',story['depth']['time']),('state-ranking-sensitivity',story['depth']['ranking_sensitivity'])]:
        with (tables/(name+'.csv')).open('w',encoding='utf-8',newline='') as f:
            writer=csv.DictWriter(f,fieldnames=list(rows[0]));writer.writeheader();writer.writerows(rows)
    flat=[{'section':s['section'],'national_five_year_pct':s['national_five_year_pct'],**r} for s in story['depth']['within_industry'] for r in s['states']]
    with (tables/'within-industry-states.csv').open('w',encoding='utf-8',newline='') as f:
        writer=csv.DictWriter(f,fieldnames=list(flat[0]));writer.writeheader();writer.writerows(flat)
    return story

if __name__=='__main__':
    story=json.loads((ROOT/'data/story.json').read_text(encoding='utf-8'))
    ibge=json.loads((ROOT/'data/ibge/survival.json').read_text(encoding='utf-8'))
    export(story,ibge)
    print('Exported time metrics, within-industry state comparisons and rank sensitivity.')
