"""Bounded source-file preview, NOT a representative statistical sample."""
import base64
import csv
import hashlib
import io
import json
import struct
import urllib.request
import zipfile
import zlib
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BASE = 'https://arquivos.receitafederal.gov.br/public.php/webdav/2026-10/'
AUTH = 'Basic ' + base64.b64encode(b'YggdBLfdninEJX9:').decode()
FIELDS = {
 'Empresas': 'cnpj_basico razao_social natureza_juridica qualificacao_responsavel capital_social porte ente_federativo_responsavel'.split(),
 'Estabelecimentos': 'cnpj_basico cnpj_ordem cnpj_dv matriz_filial nome_fantasia situacao data_situacao motivo cidade_exterior pais data_inicio cnae_principal cnaes_secundarios tipo_logradouro logradouro numero complemento bairro cep uf municipio ddd1 telefone1 ddd2 telefone2 ddd_fax fax email situacao_especial data_situacao_especial'.split(),
 'Socios': 'cnpj_basico tipo_socio nome documento qualificacao data_entrada pais representante nome_representante qualificacao_representante faixa_etaria'.split(),
 'Simples': 'cnpj_basico opcao_simples data_opcao_simples data_exclusao_simples opcao_mei data_opcao_mei data_exclusao_mei'.split(),
}

def fetch(name):
    req = urllib.request.Request(BASE + name, headers={'Authorization': AUTH})
    return urllib.request.urlopen(req, timeout=30)

def preview(name):
    # Read only enough of the first deflate member for 10,000 complete lines.
    # Full archive CRC cannot be checked for this deliberately partial download.
    group = next(g for g in FIELDS if name.startswith(g))
    raw = bytearray()
    with fetch(name) as response:
        header = response.read(30)
        signature, version, flags, method, _, _, _, _, _, nlen, elen = struct.unpack('<IHHHHHIIIHH', header)
        assert signature == 0x04034b50 and method == 8, (name, method)
        response.read(nlen + elen)
        decoder = zlib.decompressobj(-15)
        for _ in range(160):
            chunk = response.read(65536)
            if not chunk:
                break
            raw.extend(decoder.decompress(chunk))
            if raw.count(b'\n') >= 10000:
                break
    lines = bytes(raw).splitlines()[:10000]
    if len(lines) < 10000:
        lines = lines[:-1]  # final decompressed row may be incomplete
    rows = list(csv.reader((line.decode('latin-1') for line in lines), delimiter=';'))
    assert rows and all(len(r) == len(FIELDS[group]) for r in rows), name
    payload = b'\n'.join(lines) + b'\n'
    (ROOT / 'preview').mkdir(exist_ok=True)
    (ROOT / 'preview' / name.replace('.zip', '.csv')).write_bytes(payload)
    result = {'archive': name, 'url': BASE + name, 'rows': len(rows),
              'sample_method': 'first 10000 complete records of first ZIP member; convenience preview',
              'preview_sha256': hashlib.sha256(payload).hexdigest(), 'columns': FIELDS[group],
              'missing_or_date_sentinel': {}, 'distinct_counts': {}}
    for i, field in enumerate(FIELDS[group]):
        values = [r[i] for r in rows]
        result['missing_or_date_sentinel'][field] = sum(v.strip() in ('', '0', '00000000') if field.startswith('data_') else not v.strip() for v in values)
        result['distinct_counts'][field] = len(set(values))
        if field in ('situacao', 'uf', 'matriz_filial', 'porte', 'natureza_juridica', 'opcao_simples', 'opcao_mei', 'tipo_socio', 'faixa_etaria', 'cnae_principal'):
            result.setdefault('frequencies', {})[field] = Counter(values).most_common(15)
        if field.startswith('data_'):
            valid, invalid = [], 0
            for v in values:
                if v.strip() in ('', '0', '00000000'):
                    continue
                try:
                    dt = date(int(v[:4]), int(v[4:6]), int(v[6:8]))
                    assert len(v) == 8
                    valid.append(dt.isoformat())
                except (ValueError, AssertionError):
                    invalid += 1
            result.setdefault('dates', {})[field] = {'min': min(valid, default=None), 'max': max(valid, default=None), 'invalid': invalid}
    if group == 'Estabelecimentos':
        result['duplicate_establishment_keys'] = len(rows) - len({tuple(r[:3]) for r in rows})
        result['status_date_before_opening'] = sum(r[6] not in ('', '0', '00000000') and r[10] not in ('', '0', '00000000') and r[6] < r[10] for r in rows)
    if group == 'Empresas':
        amounts = sorted(float(r[4].replace(',', '.')) for r in rows if r[4])
        result['declared_capital'] = {'zero': sum(v == 0 for v in amounts), 'negative': sum(v < 0 for v in amounts), 'median': amounts[len(amounts)//2], 'max': max(amounts)}
    return result

def reference(name):
    with fetch(name) as response:
        payload = response.read()
    (ROOT / 'reference').mkdir(exist_ok=True)
    (ROOT / 'reference' / name).write_bytes(payload)
    with zipfile.ZipFile(io.BytesIO(payload)) as archive:
        assert archive.testzip() is None
        rows = list(csv.reader(io.StringIO(archive.read(archive.namelist()[0]).decode('latin-1')), delimiter=';'))
    return {'archive': name, 'rows': len(rows), 'sha256': hashlib.sha256(payload).hexdigest()}

if __name__ == '__main__':
    names = ['Empresas0.zip', 'Empresas1.zip', 'Estabelecimentos0.zip', 'Estabelecimentos1.zip', 'Socios0.zip', 'Simples.zip']
    with ThreadPoolExecutor(max_workers=2) as pool:
        previews = list(pool.map(preview, names))
        refs = list(pool.map(reference, ['Cnaes.zip', 'Motivos.zip', 'Municipios.zip', 'Naturezas.zip', 'Paises.zip', 'Qualificacoes.zip']))
    report = {'release': '2026-10', 'retrieved_on': '2026-10-19', 'limitation': 'Nonrepresentative file prefixes. Do not infer population proportions, trends, or join coverage. Partial source archives lack full CRC verification. Preview files contain original registration records; use aggregate outputs for publication.', 'previews': previews, 'references': refs}
    (ROOT / 'profile.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps({'rows_previewed': sum(p['rows'] for p in previews), 'reference_tables': refs, 'output': str(ROOT / 'profile.json')}, indent=2))
