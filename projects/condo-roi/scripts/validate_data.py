#!/usr/bin/env python3
from __future__ import annotations
import csv, json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'pmi_roi_agg.csv'
DATA_JS = ROOT / 'data' / 'dashboard_data.js'

errors=[]
with SOURCE.open(newline='', encoding='utf-8-sig') as f:
    rows=list(csv.DictReader(f))
if not rows:
    errors.append('Source CSV is empty')
required={'project','area_bucket','most_recent_buy','most_recent_rent'}
missing=required-set(rows[0]) if rows else required
if missing: errors.append(f'Missing source fields: {sorted(missing)}')
if DATA_JS.exists():
    text=DATA_JS.read_text(encoding='utf-8')
    prefix='window.CONDO_DATA='
    if not text.startswith(prefix): errors.append('dashboard_data.js has unexpected prefix')
    else:
        payload=json.loads(text[len(prefix):].rstrip().rstrip(';'))
        if len(payload.get('records',[])) < 1000: errors.append('Too few dashboard records')
        years=payload.get('meta',{}).get('years',[])
        if years != sorted(years): errors.append('Years are not sorted')
        if not payload.get('schema'): errors.append('Missing record schema')
else: errors.append('dashboard_data.js missing')
for filename in ('index.html','condo.app.css','condo.app.js'):
    if not (ROOT/filename).exists(): errors.append(f'{filename} missing')
if errors:
    print('\n'.join(f'ERROR: {e}' for e in errors))
    raise SystemExit(1)
print(f'Validation passed: {len(rows):,} source rows; dashboard assets present.')
