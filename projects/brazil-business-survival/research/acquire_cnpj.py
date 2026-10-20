"""Download complete official archives; stream selected non-contact fields to Parquet.

Run: python research/acquire_cnpj.py --workers 2
Resumable downloads stay in ignored data/raw; thin Parquet stays in data/work.
"""
import argparse
import base64
import hashlib
import json
import time
import zipfile
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
from xml.etree import ElementTree as ET

import pyarrow as pa
import pyarrow.csv as pcsv
import pyarrow.parquet as pq
import requests

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'data/raw'
WORK = ROOT / 'data/work'
BASE = 'https://arquivos.receitafederal.gov.br/public.php/webdav/'
AUTH = ('YggdBLfdninEJX9', '')
RELEASE = '2026-10'
FIELDS = {
 'Empresas': 'cnpj_basico razao_social natureza_juridica qualificacao_responsavel capital_social porte ente_federativo_responsavel'.split(),
 'Estabelecimentos': 'cnpj_basico cnpj_ordem cnpj_dv matriz_filial nome_fantasia situacao data_situacao motivo cidade_exterior pais data_inicio cnae_principal cnaes_secundarios tipo_logradouro logradouro numero complemento bairro cep uf municipio ddd1 telefone1 ddd2 telefone2 ddd_fax fax email situacao_especial data_situacao_especial'.split(),
}
SELECT = {
 'Empresas': 'cnpj_basico natureza_juridica capital_social porte'.split(),
 'Estabelecimentos': 'cnpj_basico cnpj_ordem cnpj_dv matriz_filial situacao data_situacao motivo data_inicio cnae_principal uf municipio'.split(),
}


def listing(path=''):
    response = requests.request('PROPFIND', BASE + path, auth=AUTH,
                                headers={'Depth': '1'}, timeout=(20, 60))
    response.raise_for_status()
    root = ET.fromstring(response.content)
    return [{'path': x.findtext('{DAV:}href'),
             'bytes': int(x.findtext('.//{DAV:}getcontentlength') or 0),
             'last_modified': x.findtext('.//{DAV:}getlastmodified')}
            for x in root.findall('{DAV:}response')]


def sha256(path):
    h = hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(8 * 1024 * 1024), b''):
            h.update(block)
    return h.hexdigest()


def download(entry):
    name = entry['path'].rstrip('/').split('/')[-1]
    target = RAW / name
    partial = target.with_suffix('.zip.part')
    url = BASE + RELEASE + '/' + name
    if target.exists() and target.stat().st_size == entry['bytes']:
        return target
    started = time.monotonic()
    for attempt in range(10):
        offset = partial.stat().st_size if partial.exists() else 0
        if offset == entry['bytes']:
            with zipfile.ZipFile(partial) as archive:
                assert archive.testzip() is None, name
            partial.replace(target)
            return target
        try:
            headers = {'Range': f'bytes={offset}-'} if offset else {}
            with requests.get(url, auth=AUTH, headers=headers, stream=True,
                              timeout=(30, 60)) as response:
                response.raise_for_status()
                if offset and response.status_code == 206:
                    if not response.headers.get('Content-Range', '').startswith(f'bytes {offset}-'):
                        raise ValueError('Unexpected Content-Range')
                    mode = 'ab'
                else:
                    offset, mode = 0, 'wb'
                last_report = time.monotonic()
                with partial.open(mode) as stream:
                    for block in response.iter_content(1024 * 1024):
                        stream.write(block)
                        offset += len(block)
                        if time.monotonic() - last_report > 20:
                            print(f'{name}: {offset / 1e6:.0f}/{entry["bytes"] / 1e6:.0f} MB', flush=True)
                            last_report = time.monotonic()
            if partial.stat().st_size != entry['bytes']:
                raise IOError('Incomplete archive length')
            partial.replace(target)
            print(f'Downloaded {name} in {time.monotonic()-started:.1f}s', flush=True)
            return target
        except (requests.RequestException, IOError) as error:
            print(f'{name}: retry {attempt+1}: {error}', flush=True)
            time.sleep(min(2 ** attempt, 30))
    raise RuntimeError(f'Download failed: {name}')


def process(entry):
    name = entry['path'].rstrip('/').split('/')[-1]
    group = next(g for g in FIELDS if name.startswith(g))
    target = WORK / name.replace('.zip', '.parquet')
    meta_path = target.with_suffix('.json')
    if target.exists() and meta_path.exists():
        cached = json.loads(meta_path.read_text())
        assert cached['release'] == RELEASE, f'Stale cached release: {name}'
        assert cached['source_bytes'] == entry['bytes'], f'Source length changed: {name}'
        assert cached['source_last_modified'] == entry['last_modified'], f'Source modified: {name}'
        assert target.stat().st_size == cached['parquet_bytes'], f'Cached Parquet length changed: {name}'
        assert sha256(target) == cached['parquet_sha256'], f'Cached Parquet hash changed: {name}'
        assert pq.read_metadata(target).num_rows == cached['rows'], f'Cached row count changed: {name}'
        return cached
    archive_path = download(entry)
    count = 0
    partial = target.with_suffix('.parquet.part')
    with zipfile.ZipFile(archive_path) as archive:
        members = [x for x in archive.infolist() if not x.is_dir()]
        assert len(members) == 1, name
        with archive.open(members[0]) as stream:
            reader = pcsv.open_csv(stream,
                read_options=pcsv.ReadOptions(column_names=FIELDS[group], encoding='latin1', block_size=8*1024*1024),
                parse_options=pcsv.ParseOptions(delimiter=';'),
                convert_options=pcsv.ConvertOptions(include_columns=SELECT[group],
                    column_types={c: pa.string() for c in SELECT[group]},
                    strings_can_be_null=True, null_values=['']))
            with pq.ParquetWriter(partial, reader.schema, compression='zstd') as writer:
                for batch in reader:
                    count += batch.num_rows
                    writer.write_batch(batch)
        # Reading the full ZipExtFile to EOF verifies CRC in zipfile.
    partial.replace(target)
    result = {'archive': name, 'source_url': BASE + RELEASE + '/' + name,
              'source_bytes': entry['bytes'], 'source_sha256': sha256(archive_path),
              'source_last_modified': entry['last_modified'],
              'retrieved_at_utc': datetime.now(timezone.utc).isoformat(),
              'release': RELEASE, 'rows': count, 'fields_retained': SELECT[group],
              'complete_archive_crc_checked': True,
              'parquet_sha256': sha256(target), 'parquet_bytes': target.stat().st_size}
    meta_path.write_text(json.dumps(result, indent=2), encoding='utf-8')
    print(f'Processed {name}: {count:,} rows', flush=True)
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--workers', type=int, default=2)
    parser.add_argument('--only', default='', help='Optional archive filename prefix for a bounded run')
    parser.add_argument('--exclude-largest', action='store_true', help='Process shards 1–9 while the separate bounded-range helper acquires shard 0')
    args = parser.parse_args()
    RAW.mkdir(parents=True, exist_ok=True)
    WORK.mkdir(parents=True, exist_ok=True)
    inventory = listing(RELEASE + '/')
    directories = listing()
    (ROOT / 'data/source-inventory.json').write_text(json.dumps({'release': RELEASE, 'directories': directories, 'files': inventory}, indent=2), encoding='utf-8')
    selected = [x for x in inventory if x['path'].endswith('.zip') and any(x['path'].split('/')[-1].startswith(g) for g in FIELDS)]
    if args.only:
        selected = [x for x in selected if x['path'].split('/')[-1].startswith(args.only)]
    if args.exclude_largest:
        selected = [x for x in selected if x['path'].split('/')[-1] not in ('Empresas0.zip','Estabelecimentos0.zip')]
    # Start with smaller shards to get processing/provenance feedback early.
    selected.sort(key=lambda x: x['bytes'])
    print(f'Acquiring {len(selected)} archives, {sum(x["bytes"] for x in selected)/1e9:.2f} GB', flush=True)
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        manifests = list(pool.map(process, selected))
    out = ROOT / ('data/source-manifest.json' if not args.only and not args.exclude_largest else 'data/partial-manifest.json')
    out.write_text(json.dumps(manifests, indent=2), encoding='utf-8')
    print(f'Complete: {sum(x["rows"] for x in manifests):,} records', flush=True)


if __name__ == '__main__':
    main()
