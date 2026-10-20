"""Four-connection resumable ranged acquisition of the two largest CNPJ shards.

Segments are isolated from acquire_cnpj.py .zip.part files. Run directly and poll
data/raw/segments/progress.json or download.log. Only requests is non-stdlib.
"""
import argparse
import hashlib
import json
import os
import re
import threading
import time
import zipfile
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'data/raw'
SEGMENTS = RAW / 'segments'
BASE = 'https://arquivos.receitafederal.gov.br/public.php/webdav/2026-10/'
AUTH = ('YggdBLfdninEJX9', '')
NAMES = ('Empresas0.zip', 'Estabelecimentos0.zip')
CHUNK = 64 * 1024 * 1024
LOCK = threading.RLock()
STATE = {}
WORKERS = 4


def utc():
    return datetime.now(timezone.utc).isoformat()


def log(message):
    line = f'{utc()} {message}'
    with LOCK:
        print(line, flush=True)
        with (SEGMENTS / 'download.log').open('a', encoding='utf-8') as f:
            f.write(line + '\n')


def progress(name, **fields):
    with LOCK:
        STATE[name].update(fields, updated_at_utc=utc())
        temp = SEGMENTS / 'progress.json.tmp'
        temp.write_text(json.dumps(STATE, indent=2), encoding='utf-8')
        os.replace(temp, SEGMENTS / 'progress.json')


def valid_zip(path, size):
    if not path.exists() or path.stat().st_size != size:
        return False
    with zipfile.ZipFile(path) as z:
        if z.testzip() is not None:
            raise ValueError(f'CRC failure: {path}')
    return True


def segment(entry, start, end):
    name, size = entry['name'], entry['bytes']
    folder = SEGMENTS / name
    target = folder / f'{start:012d}-{end:012d}.segment'
    part = target.with_suffix('.part')
    expected = end - start + 1
    if target.exists():
        if target.stat().st_size != expected:
            raise ValueError(f'Invalid completed segment length: {target}')
        return target
    for attempt in range(12):
        offset = part.stat().st_size if part.exists() else 0
        if offset > expected:
            raise ValueError(f'Oversized partial segment: {part}')
        if offset == expected:
            part.replace(target)
            return target
        absolute = start + offset
        try:
            headers = {'Range': f'bytes={absolute}-{end}', 'Accept-Encoding': 'identity', 'If-Range': entry['etag']}
            with requests.get(BASE + name, auth=AUTH, headers=headers, stream=True, timeout=(30, 90)) as response:
                response.raise_for_status()
                cr = re.fullmatch(r'bytes (\d+)-(\d+)/(\d+)', response.headers.get('Content-Range', ''))
                if response.status_code != 206 or not cr:
                    raise ValueError(f'Expected 206 Content-Range, received {response.status_code}')
                first, last, total = map(int, cr.groups())
                if first != absolute or total != size or last < end or last >= size:
                    raise ValueError(f'Unexpected range {response.headers.get("Content-Range")} for {absolute}-{end}/{size}')
                if response.headers.get('ETag') != entry['etag'] or response.headers.get('Last-Modified') != entry['last_modified']:
                    raise ValueError('Source timestamp/ETag changed')
                if int(response.headers.get('Content-Length', -1)) != last-first+1:
                    raise ValueError('Content-Length does not match served range')
                # A known source edge case serves beyond the requested end.
                # Accept only the verified starting offset and exact requested prefix.
                response.raw.decode_content = False
                last_report = time.monotonic()
                with part.open('ab') as stream:
                    while offset < expected:
                        block = response.raw.read(min(1024*1024, expected-offset))
                        if not block:
                            raise IOError('Response ended before requested segment was complete')
                        stream.write(block)
                        offset += len(block)
                        if time.monotonic()-last_report >= 20:
                            stream.flush()
                            with LOCK:
                                on_disk = sum(p.stat().st_size for p in folder.iterdir() if p.suffix in ('.segment','.part'))
                                progress(name, downloaded_bytes=on_disk)
                            log(f'{name} downloaded {on_disk}/{size} bytes including resumable partials')
                            last_report = time.monotonic()
                assert part.stat().st_size == expected
            part.replace(target)
            return target
        except (requests.RequestException, OSError, requests.packages.urllib3.exceptions.HTTPError) as error:
            log(f'{name} segment {start}-{end} retry {attempt+1}: {error}')
            time.sleep(min(2**attempt, 30))
    raise RuntimeError(f'Failed segment {name} {start}-{end}')


def assemble(entry):
    name, size = entry['name'], entry['bytes']
    target = RAW / name
    if valid_zip(target, size):
        progress(name, status='existing_complete_crc_checked')
        return
    assembling = SEGMENTS / name / 'assembled.zip'
    h = hashlib.sha256()
    with assembling.open('wb') as output:
        for start in range(0, size, CHUNK):
            end = min(start+CHUNK, size)-1
            part = SEGMENTS / name / f'{start:012d}-{end:012d}.segment'
            assert part.stat().st_size == end-start+1
            with part.open('rb') as stream:
                for block in iter(lambda: stream.read(8*1024*1024), b''):
                    output.write(block)
                    h.update(block)
    progress(name, status='checking_archive_crc')
    assert valid_zip(assembling, size)
    # Do not overwrite another process's completed archive. Windows rename is
    # atomic and fails if an existing target appears between this check and rename.
    if target.exists():
        if not valid_zip(target, size):
            raise ValueError(f'Another process created invalid target: {target}')
        assembling.unlink()
    else:
        try:
            assembling.rename(target)
        except FileExistsError:
            if not valid_zip(target, size):
                raise
            assembling.unlink()
    manifest = {**entry, 'source_url': BASE+name, 'completed_at_utc': utc(), 'sha256': h.hexdigest(),
                'crc_checked': True, 'segment_bytes': CHUNK, 'connections_limit': WORKERS}
    (SEGMENTS / name / 'complete.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    progress(name, status='complete_crc_checked', downloaded_bytes=size, sha256=h.hexdigest())
    log(f'{name} COMPLETE {size} bytes CRC verified sha256={h.hexdigest()}')


def worker(entry, lane, lanes):
    size, name = entry['bytes'], entry['name']
    for index, start in enumerate(range(0, size, CHUNK)):
        if index % lanes != lane:
            continue
        end = min(start+CHUNK,size)-1
        segment(entry,start,end)
        with LOCK:
            complete = sum(p.stat().st_size for p in (SEGMENTS/name).glob('*.segment'))
            downloaded = sum(p.stat().st_size for p in (SEGMENTS/name).iterdir() if p.suffix in ('.segment','.part'))
            progress(name, downloaded_bytes=downloaded, completed_segments=len(list((SEGMENTS/name).glob('*.segment'))))
        log(f'{name} segment {start}-{end} verified length; completed segments {complete}/{size} bytes')


def main():
    global WORKERS
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--workers',type=int,choices=(4,8),default=4,help='Total connections: 3:1 or 6:2 establishment/company lanes')
    WORKERS = parser.parse_args().workers
    SEGMENTS.mkdir(parents=True, exist_ok=True)
    inventory = json.loads((ROOT/'data/source-inventory.json').read_text(encoding='utf-8'))
    assert inventory['release'] == '2026-10'
    entries = []
    for name in NAMES:
        source = next(r for r in inventory['files'] if r['path'].endswith('/'+name))
        entry = {**source, 'name': name}
        # Use a nonzero bounded range: source has a bytes=0-0 end parsing quirk.
        with requests.get(BASE+name, auth=AUTH, headers={'Range':'bytes=1-1','Accept-Encoding':'identity'},stream=True,timeout=(30,60)) as r:
            assert r.status_code == 206 and r.headers['Content-Range'] == f'bytes 1-1/{source["bytes"]}'
            assert r.headers['Last-Modified'] == source['last_modified']
            entry.update(etag=r.headers['ETag'], verified_at_utc=utc())
        folder = SEGMENTS/name
        folder.mkdir(exist_ok=True)
        metadata = folder/'source.json'
        if metadata.exists():
            old=json.loads(metadata.read_text(encoding='utf-8'))
            assert all(old[k]==entry[k] for k in ('bytes','etag','last_modified'))
        metadata.write_text(json.dumps(entry,indent=2),encoding='utf-8')
        STATE[name]={'status':'downloading','total_bytes':entry['bytes'],'source_last_modified':entry['last_modified'],'etag':entry['etag'],'started_at_utc':utc()}
        if valid_zip(RAW/name,entry['bytes']):
            progress(name,status='existing_complete_crc_checked',downloaded_bytes=entry['bytes'])
        else:
            entries.append(entry)
            log(f'{name} source verified {entry["bytes"]} bytes, timestamp {entry["last_modified"]}')
    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        futures={}
        remaining={}
        for entry in entries:
            lanes=WORKERS*3//4 if entry['name']=='Estabelecimentos0.zip' else WORKERS//4
            remaining[entry['name']]=lanes
            for lane in range(lanes):
                futures[pool.submit(worker,entry,lane,lanes)]=entry
        for future in as_completed(futures):
            future.result()
            entry=futures[future]
            remaining[entry['name']]-=1
            if remaining[entry['name']]==0:
                assemble(entry)


if __name__ == '__main__':
    main()
