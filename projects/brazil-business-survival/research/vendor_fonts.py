"""Freeze the approved open-source fonts so the HTML also works offline."""
import hashlib
import json
import re
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
URL = 'https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@400..700&family=Public+Sans:wght@400..700&display=swap'
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'


def get(url):
    r = requests.get(url, headers={'User-Agent':UA}, timeout=30)
    r.raise_for_status()
    return r.content


def main():
    folder = ROOT/'assets/fonts'
    folder.mkdir(parents=True,exist_ok=True)
    css = get(URL).decode('utf-8')
    faces = re.findall(r'/\* latin \*/\s*(@font-face\s*\{[^}]+\})',css)
    assert len(faces) == 2
    records=[]
    for face in faces:
        family=re.search(r"font-family: '([^']+)'",face).group(1)
        slug=family.lower().replace(' ','-')
        url=re.search(r'url\(([^)]+)\)',face).group(1)
        payload=get(url)
        filename=slug+'-latin.woff2'
        (folder/filename).write_bytes(payload)
        (folder/('OFL-'+slug+'.txt')).write_bytes(get('https://raw.githubusercontent.com/google/fonts/main/ofl/'+slug.replace('-','')+'/OFL.txt'))
        records.append({'family':family,'url':url,'file':filename,'sha256':hashlib.sha256(payload).hexdigest(),'license':'SIL Open Font License 1.1'})
    style=ROOT/'story.css'
    existing=style.read_text(encoding='utf-8')
    local_faces=[]
    for face,r in zip(faces,records):
        local_faces.append(face.replace(r['url'],'assets/fonts/'+r['file']))
    existing=re.sub(r"@import url\('https://fonts.googleapis.com/[^']+'\);",'\n'.join(local_faces),existing)
    style.write_text(existing,encoding='utf-8')
    (folder/'sources.json').write_text(json.dumps({'css_source':URL,'fonts':records},indent=2),encoding='utf-8')
    print('Vendored',len(records),'licensed font files')


if __name__=='__main__':
    main()
