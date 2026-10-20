"""Finish a complete project after resumable acquisitions, then execute notebook.

This command waits for the optional parallel acquisition jobs if needed. It never
publishes incomplete national figures. Ordinary reproduction can run acquire_cnpj,
acquire_ibge, analysis, and the notebook separately as described in the README.
"""
import json
import subprocess
import sys
import time
from pathlib import Path

import nbformat
from nbclient import NotebookClient

ROOT = Path(__file__).resolve().parents[1]


def run(*args):
    print('Running:', ' '.join(args), flush=True)
    subprocess.run([sys.executable, *args], cwd=ROOT, check=True)


def ready():
    small = all((ROOT/f'data/work/{group}{i}.parquet').exists()
                for group in ['Empresas','Estabelecimentos'] for i in range(1,10))
    largest = all((ROOT/f'data/raw/{group}0.zip').exists()
                  for group in ['Empresas','Estabelecimentos'])
    return small and largest


def main():
    started = time.monotonic()
    while not ready():
        shards = len(list((ROOT/'data/work').glob('*.parquet')))
        print(f'Acquisition continues: {shards}/20 thin analytical shards; waiting for complete sources.', flush=True)
        if time.monotonic()-started > 7200:
            raise TimeoutError('Acquisition has not completed; inspect download logs and resume sources.')
        time.sleep(45)
    run('research/acquire_cnpj.py','--workers','2')
    run('research/analysis.py')
    run('-m','unittest','discover','-s','research','-p','test_*.py')
    run('research/build_notebook.py')
    path = ROOT/'brazil-business-survival.ipynb'
    notebook = nbformat.read(path, as_version=4)
    print('Executing notebook against complete national and official cohort data', flush=True)
    NotebookClient(notebook, timeout=600, kernel_name='brazil-data',
                   resources={'metadata':{'path':str(ROOT)}}).execute()
    nbformat.write(notebook,path)
    assert all(c.execution_count is not None for c in notebook.cells if c.cell_type=='code')
    assert not any(o.output_type=='error' for c in notebook.cells if c.cell_type=='code' for o in c.outputs)
    data = json.loads((ROOT/'data/story.json').read_text(encoding='utf-8'))
    bridge = (ROOT/'data/story-data.js').read_text(encoding='utf-8')
    assert json.loads(bridge.removeprefix('window.BRAZIL_STORY = ').removesuffix(';\n')) == data
    print(json.dumps({'status':'complete','national':data['national'],
                      'notebook_cells':len(notebook.cells),'quality':data['quality']},indent=2), flush=True)


if __name__=='__main__':
    main()
