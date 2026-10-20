"""National snapshot aggregation with explicit grains and reconciliation checks."""
import csv
import hashlib
import io
import json
import sys
import zipfile
from pathlib import Path

import duckdb

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'data'
STATE_NAMES = dict(zip(
    'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO EX'.split(),
    ['Acre','Alagoas','Amapá','Amazonas','Bahia','Ceará','Distrito Federal','Espírito Santo','Goiás','Maranhão','Mato Grosso','Mato Grosso do Sul','Minas Gerais','Pará','Paraíba','Paraná','Pernambuco','Piauí','Rio de Janeiro','Rio Grande do Norte','Rio Grande do Sul','Rondônia','Roraima','Santa Catarina','São Paulo','Sergipe','Tocantins','Outside Brazil']))
STATUS_NAMES = {'01':'Null registration','02':'Active','03':'Suspended','04':'Unfit','08':'Deregistered'}
SIZE_NAMES = {'00':'Not reported','01':'Microenterprise','03':'Small enterprise','05':'Other'}


def survival_feasibility(start_month, end_month, horizon_years=5):
    sy, sm = map(int, start_month.split('-'))
    ey, em = map(int, end_month.split('-'))
    months = (ey-sy)*12 + em-sm
    return {'identified': False, 'observed_months': months, 'required_months': 12*horizon_years,
            'reason': ('Available releases span fewer than five years; opening dates in a current snapshot do not recover complete status histories.'
                       if months < 12*horizon_years else 'Release span alone does not establish complete event histories or baseline covariates.')}


def validate_story(data):
    total = data['national']['establishments']
    active = data['national']['active']
    assert 0 <= active <= total
    for dimension, count_field in [('states','total'),('statuses','count'),('industries','total'),('cohorts','total')]:
        assert sum(r[count_field] for r in data[dimension]) == total, f'{dimension} does not reconcile'
        for r in data[dimension]:
            if 'active' in r:
                assert 0 <= r['active'] <= r[count_field], (dimension, r)
    for dimension in ['states','industries','cohorts']:
        if all('active' in r for r in data[dimension]):
            assert sum(r['active'] for r in data[dimension]) == active, f'{dimension} active counts do not reconcile'
    if any('code' in r for r in data['statuses']):
        assert sum(r['count'] for r in data['statuses'] if r['code']=='02') == active
    if 'company_profile' in data:
        for dimension in ['size','legal_forms']:
            assert sum(r['count'] for r in data['company_profile'][dimension]) == data['national']['companies']


def rows(con, query):
    cur = con.execute(query)
    names = [d[0] for d in cur.description]
    return [dict(zip(names, r)) for r in cur.fetchall()]


def normalise_company_profiles(con):
    """Count roots once; merge compatible reported fields, flag real conflicts.

    Nature 0000 and size 00 are officially not-reported categories. Zero capital
    is a reported value, never treated as missing. Original Parquet stays intact.
    """
    con.execute('CREATE TEMP TABLE company_duplicate_keys AS SELECT cnpj_basico,count(*) AS n FROM emp_raw GROUP BY 1 HAVING count(*)>1')
    n_keys, excess = con.execute('SELECT count(*),coalesce(sum(n-1),0) FROM company_duplicate_keys').fetchone()
    if not n_keys:
        con.execute('CREATE VIEW emp AS SELECT * FROM emp_raw')
        return {'duplicate_company_keys':0,'duplicate_company_source_records':0,'ambiguous_company_profile_keys':0}
    con.execute('''CREATE TEMP TABLE duplicate_company_profiles AS
      SELECT r.cnpj_basico,
        CASE WHEN count(DISTINCT nullif(natureza_juridica,'0000'))>1 THEN NULL
             ELSE coalesce(max(nullif(natureza_juridica,'0000')),max(natureza_juridica)) END AS natureza_juridica,
        CASE WHEN count(DISTINCT capital)>1 THEN NULL ELSE max(capital_social) END AS capital_social,
        CASE WHEN count(DISTINCT nullif(porte,'00'))>1 THEN NULL
             ELSE coalesce(max(nullif(porte,'00')),max(porte)) END AS porte,
        CASE WHEN count(DISTINCT capital)>1 THEN NULL ELSE max(capital) END AS capital,
        count(DISTINCT nullif(natureza_juridica,'0000'))>1 OR count(DISTINCT nullif(porte,'00'))>1 OR count(DISTINCT capital)>1 AS ambiguous
      FROM emp_raw r JOIN company_duplicate_keys d USING(cnpj_basico) GROUP BY 1''')
    con.execute('''CREATE VIEW emp AS
      SELECT r.* FROM emp_raw r ANTI JOIN company_duplicate_keys d USING(cnpj_basico)
      UNION ALL SELECT cnpj_basico,natureza_juridica,capital_social,porte,capital FROM duplicate_company_profiles''')
    ambiguous = con.execute('SELECT count(*) FROM duplicate_company_profiles WHERE ambiguous').fetchone()[0]
    return {'duplicate_company_keys':n_keys,'duplicate_company_source_records':int(excess),'ambiguous_company_profile_keys':ambiguous}


def reference(name):
    path = ROOT / 'data/reference' / name
    if not path.exists():
        import requests
        path.parent.mkdir(exist_ok=True, parents=True)
        url = f'https://arquivos.receitafederal.gov.br/public.php/webdav/2026-10/{name}'
        response = requests.get(url, auth=('YggdBLfdninEJX9',''), timeout=(30,60))
        response.raise_for_status()
        path.write_bytes(response.content)
    with zipfile.ZipFile(path) as z:
        assert z.testzip() is None
        values = dict(csv.reader(io.StringIO(z.read(z.namelist()[0]).decode('latin1')), delimiter=';'))
    manifest_path = DATA/'reference-manifest.json'
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    manifest[name] = {'archive':name,'release':'2026-10',
        'source_url':f'https://arquivos.receitafederal.gov.br/public.php/webdav/2026-10/{name}',
        'source_bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),
        'verified_on':'2026-10-20','complete_archive_crc_checked':True}
    manifest_path.write_text(json.dumps(manifest,indent=2),encoding='utf-8')
    return values


def build():
    manifest = json.loads((DATA / 'source-manifest.json').read_text())
    assert len(manifest) == 20 and all(m['complete_archive_crc_checked'] for m in manifest)
    assert {m['archive'] for m in manifest} == {f'{g}{i}.zip' for g in ['Empresas','Estabelecimentos'] for i in range(10)}
    inventory = json.loads((DATA/'source-inventory.json').read_text())
    source_by_name = {r['path'].rstrip('/').split('/')[-1]:r for r in inventory['files']}
    for m in manifest:
        assert m['release'] == '2026-10'
        assert m['source_bytes'] == source_by_name[m['archive']]['bytes']
        assert m['source_last_modified'] == source_by_name[m['archive']]['last_modified']
    print('Opening complete national Parquet files', flush=True)
    work = (DATA / 'work').as_posix()
    con = duckdb.connect()
    con.execute("SET memory_limit='4GB'")
    con.execute('SET threads=4')
    con.execute(f"SET temp_directory='{work}/spill'")
    est_fields = ['cnpj_basico','cnpj_ordem','cnpj_dv','matriz_filial','situacao','cnae_principal','uf','municipio']
    emp_fields = ['cnpj_basico','natureza_juridica','porte']
    est_replacements = ','.join(f"nullif(trim({c}),'') AS {c}" for c in est_fields)
    emp_replacements = ','.join(f"nullif(trim({c}),'') AS {c}" for c in emp_fields)
    con.execute(f"CREATE VIEW est AS SELECT * REPLACE ({est_replacements}), try_strptime(data_inicio,'%Y%m%d')::DATE AS opening_date, try_strptime(data_situacao,'%Y%m%d')::DATE AS status_date FROM read_parquet('{work}/Estabelecimentos[0-9].parquet')")
    con.execute(f"CREATE VIEW emp_raw AS SELECT * REPLACE ({emp_replacements}), try_cast(replace(capital_social,',','.') AS DOUBLE) AS capital FROM read_parquet('{work}/Empresas[0-9].parquet')")
    print('Resolving duplicate company roots before computing entity profiles',flush=True)
    duplicate_quality = normalise_company_profiles(con)
    totals = rows(con, "SELECT count(*) establishments, count(*) FILTER(WHERE situacao='02') active, count(*) FILTER(WHERE matriz_filial='1') headquarters, count(*) FILTER(WHERE matriz_filial='2') branches FROM est")[0]
    totals['companies'] = con.execute('SELECT count(*) FROM emp').fetchone()[0]
    totals['company_source_records'] = con.execute('SELECT count(*) FROM emp_raw').fetchone()[0]
    totals['active_share'] = totals['active']/totals['establishments']
    assert totals['establishments'] == sum(m['rows'] for m in manifest if m['archive'].startswith('Estabelecimentos'))
    assert totals['company_source_records'] == sum(m['rows'] for m in manifest if m['archive'].startswith('Empresas'))
    assert totals['companies'] == totals['company_source_records'] - duplicate_quality['duplicate_company_source_records']
    states = rows(con, "SELECT coalesce(uf,'Unknown') uf, count(*) total, count(*) FILTER(WHERE situacao='02') active, count(*) FILTER(WHERE matriz_filial='1') headquarters, count(*) FILTER(WHERE matriz_filial='2') branches FROM est GROUP BY 1 ORDER BY total DESC")
    for r in states:
        r.update(name=STATE_NAMES.get(r['uf'],r['uf']), active_share=r['active']/r['total'])
    domestic_states = [r for r in states if r['uf'] in STATE_NAMES and r['uf'] != 'EX']
    totals['domestic_establishments'] = sum(r['total'] for r in domestic_states)
    totals['domestic_active'] = sum(r['active'] for r in domestic_states)
    totals['domestic_active_share'] = totals['domestic_active']/totals['domestic_establishments']
    totals['outside_or_unknown_geography'] = totals['establishments'] - totals['domestic_establishments']
    statuses = rows(con, "SELECT coalesce(situacao,'Unknown') code, count(*) count FROM est GROUP BY 1 ORDER BY count DESC")
    for r in statuses:
        r.update(label=STATUS_NAMES.get(r['code'],'Unknown'),share=r['count']/totals['establishments'])
    print('Aggregating activities and opening cohorts', flush=True)
    cnaes = reference('Cnaes.zip')
    industries = rows(con, "SELECT coalesce(cnae_principal,'Unknown') code,count(*) total,count(*) FILTER(WHERE situacao='02') active FROM est GROUP BY 1 ORDER BY total DESC")
    for r in industries:
        r.update(label=cnaes.get(r['code'],f'Unmatched code {r["code"]}'),active_share=r['active']/r['total'])
    cohorts = rows(con, 'SELECT year(opening_date) AS "year",count(*) total,count(*) FILTER(WHERE situacao=\'02\') active FROM est GROUP BY 1 ORDER BY "year" NULLS LAST')
    for r in cohorts:
        r['active_share'] = r['active']/r['total']
    sizes = rows(con,"SELECT coalesce(porte,'Unknown') code,count(*) count FROM emp GROUP BY 1 ORDER BY count DESC")
    for r in sizes:
        r['label'] = SIZE_NAMES.get(r['code'],'Unknown')
    capital = rows(con,"SELECT count(*) n, count(*) FILTER(WHERE capital=0) zero,count(*) FILTER(WHERE capital<0) negative,count(*) FILTER(WHERE capital IS NULL) missing,count(*) FILTER(WHERE capital=999999999999) suspected_sentinel_999999999999,quantile_cont(capital,.5) median,quantile_cont(capital,.9) p90,quantile_cont(capital,.99) p99,max(capital) max FROM emp")[0]
    capital['valid_n'] = capital['n'] - capital['missing']
    naturezas = reference('Naturezas.zip')
    legal_forms = rows(con,"SELECT coalesce(natureza_juridica,'Unknown') code,count(*) count FROM emp GROUP BY 1 ORDER BY count DESC")
    for r in legal_forms:
        r['label'] = naturezas.get(r['code'],r['code'])
    quality = rows(con,"""SELECT count(*) FILTER(WHERE opening_date IS NULL) missing_or_invalid_opening_date,
      count(*) FILTER(WHERE status_date IS NULL) missing_or_invalid_status_date,
      count(*) FILTER(WHERE status_date<opening_date) status_date_before_opening,
      count(*) FILTER(WHERE opening_date>DATE '2026-10-20') opening_date_after_retrieval,
      count(*) FILTER(WHERE status_date>DATE '2026-10-20') status_date_after_retrieval,
      count(*) FILTER(WHERE NOT regexp_full_match(coalesce(cnpj_basico,''),'[0-9A-Z]{8}')) malformed_cnpj_base,
      min(opening_date)::VARCHAR min_opening_date,max(opening_date)::VARCHAR max_opening_date,
      min(status_date)::VARCHAR min_status_date,max(status_date)::VARCHAR max_status_date FROM est""")[0]
    quality['unmatched_cnae_records'] = sum(r['total'] for r in industries if r['code'] not in cnaes)
    print('Checking unique keys across every source shard', flush=True)
    quality['missing_establishment_keys'] = con.execute("SELECT count(*) FROM est WHERE cnpj_basico IS NULL OR cnpj_ordem IS NULL OR cnpj_dv IS NULL").fetchone()[0]
    quality['duplicate_establishment_keys'] = con.execute("SELECT count(*)-count(DISTINCT cnpj_basico||cnpj_ordem||cnpj_dv) FROM est WHERE cnpj_basico IS NOT NULL AND cnpj_ordem IS NOT NULL AND cnpj_dv IS NOT NULL").fetchone()[0]
    quality.update(duplicate_quality)
    quality['missing_company_keys'] = con.execute("SELECT count(*) FROM emp WHERE cnpj_basico IS NULL").fetchone()[0]
    quality['remaining_duplicate_company_keys'] = con.execute("SELECT count(*)-count(DISTINCT cnpj_basico) FROM emp WHERE cnpj_basico IS NOT NULL").fetchone()[0]
    quality['duplicate_company_resolution_note'] = 'Company roots are counted once. Duplicate fields are coalesced only when reported values agree; nature 0000 and size 00 denote not reported. Genuine conflicts become missing and are flagged. Raw source profiles remain unchanged.'
    assert quality['remaining_duplicate_company_keys'] == 0 and quality['missing_company_keys'] == 0, 'Company unit counts require unique complete roots'
    assert quality['duplicate_establishment_keys'] == 0 and quality['missing_establishment_keys'] == 0, 'Establishment counts require unique complete keys'
    print('Checking establishment-to-company linkage across the complete files', flush=True)
    quality['establishment_records_without_entity_match'] = con.execute('SELECT count(*) FROM est e ANTI JOIN emp p ON e.cnpj_basico=p.cnpj_basico').fetchone()[0]
    quality['entity_linkage_note'] = 'Unmatched establishment records are retained in snapshot counts; company-profile summaries use their own company denominator.'
    quality['national_snapshot_note'] = 'Current registration status, not continuous operation, survival, economic activity, revenue or profitability.'
    months = sorted(x['path'].rstrip('/').split('/')[-1] for x in inventory['directories'] if len(x['path'].rstrip('/').split('/')[-1])==7 and x['path'].rstrip('/').split('/')[-1][4]=='-')
    feasibility = survival_feasibility(months[0],months[-1])
    ibge_path = DATA/'ibge/survival.json'
    ibge_full = json.loads(ibge_path.read_text(encoding='utf-8')) if ibge_path.exists() else {'available': False}
    ibge = {k:v for k,v in ibge_full.items() if k != 'local_units_by_geography_and_sector'}
    data = {'meta': {'release':'2026-10','retrieved_on':'2026-10-20','scope':'Complete national CNPJ snapshot: all ten company and ten establishment shards','survival_model_identified':False,
                    'sources':[{'label':'Receita Federal CNPJ source files','url':'https://arquivos.receitafederal.gov.br/index.php/s/YggdBLfdninEJX9'},
                               {'label':'Official CNPJ layout','url':'https://www.gov.br/receitafederal/dados/cnpj-metadados.pdf'},
                               {'label':'Pipeline reference','url':'https://github.com/caiopizzol/cnpj-data-pipeline'}],
                    'archive_count':20,'source_compressed_bytes':sum(m['source_bytes'] for m in manifest),
                    'population_note':'CNPJ covers registered legal entities and establishments, including public bodies and nonprofits, not only commercial businesses. Partner and MEI/Simples files are inventoried but not included in the national 20-archive aggregation.',
                    'geography_note':'Current registered location; includes EX (outside Brazil) and unknown if present. Not founding location.',
                    'cohort_note':'Opening-year composition of retained registrations, not a verified historical births series.'},
            'national':totals,'statuses':statuses,'states':states,'industries':industries,'cohorts':cohorts,
            'company_profile':{'size':sizes,'capital':capital,'legal_forms':legal_forms},
            'quality':quality,'survival_feasibility':feasibility,'ibge':ibge}
    validate_story(data)
    # Retain the derived layer on every national rebuild, using original IBGE cells.
    from deepen import export
    export(data, ibge_full)
    payload = json.dumps(data,ensure_ascii=False,indent=2,allow_nan=False)
    (DATA/'story.json').write_text(payload,encoding='utf-8')
    (DATA/'story-data.js').write_text('window.BRAZIL_STORY = '+payload+';\n',encoding='utf-8')
    table_dir = DATA/'analysis-tables'
    table_dir.mkdir(exist_ok=True)
    for key in ['states','statuses','industries','cohorts']:
        with (table_dir/f'{key}.csv').open('w',encoding='utf-8',newline='') as f:
            writer=csv.DictWriter(f,fieldnames=list(data[key][0]))
            writer.writeheader();writer.writerows(data[key])
    print(json.dumps({'national':totals,'quality':quality,'survival_feasibility':feasibility},indent=2),flush=True)


if __name__ == '__main__':
    build()
