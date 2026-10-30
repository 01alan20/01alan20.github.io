"""Build standalone ONA Studio HTML from local data. Uses Python standard library only."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parent.parent
TEMPLATE=ROOT/'src'/'index.template.html'
DATA=ROOT/'data'/'network_data.json'
OUT=ROOT/'index.html'
network=json.loads(DATA.read_text(encoding='utf-8'))
source=TEMPLATE.read_text(encoding='utf-8')
assert source.count('__NETWORK_DATA__')==1
OUT.write_text(source.replace('__NETWORK_DATA__',json.dumps(network,separators=(',',':'),ensure_ascii=False).replace('</',r'<\/')),encoding='utf-8')
print('Built',OUT)
