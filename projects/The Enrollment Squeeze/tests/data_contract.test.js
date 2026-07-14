const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const project = path.join(__dirname, '..');
const compactPath = path.join(project, 'data', 'scorecard_compact.json');
const institutionsPath = path.join(project, 'data', 'institutions.json');
const builderPath = path.join(project, 'scripts', 'build_scorecard_history.py');

assert.equal(fs.existsSync(path.join(project, 'data', 'collegescorecard')), false, 'raw Scorecard directory must not be required');
assert.equal(fs.existsSync(path.join(project, 'data', 'institution_history.json')), false, 'redundant history artifact must not remain');
assert.equal(fs.existsSync(compactPath), true, 'compact Scorecard artifact must exist');
const compact = JSON.parse(fs.readFileSync(compactPath, 'utf8'));
assert.deepEqual(compact.sourceYears, ['2015_16', '2016_17', '2017_18', '2018_19', '2019_20', '2020_21', '2021_22', '2022_23', '2023_24', '2024_25']);
assert.ok(Array.isArray(compact.institutions) && compact.institutions.length > 0);
assert.deepEqual(new Set(compact.institutions.map(row => row.unitid)).size, compact.institutions.length);
assert.ok(compact.institutions.every(row => row.years['2015_16'] && row.years['2024_25']));
assert.ok(compact.institutions.every(row => Object.hasOwn(row.years['2024_25'], 'UGDS')));
assert.ok(compact.institutions.every(row => Object.hasOwn(row.years['2024_25'], 'GRADS')));

const institutions = JSON.parse(fs.readFileSync(institutionsPath, 'utf8'));
assert.ok(institutions.length > 0);
assert.ok(institutions.every(row => row.unitid && Object.hasOwn(row, 'currentUG') && Object.hasOwn(row, 'marketChange')));

const builder = fs.readFileSync(builderPath, 'utf8');
assert.equal(builder.includes('data/collegescorecard'), false);
assert.equal(builder.includes('MERGED{year}_PP.csv'), false);
assert.equal(builder.includes('institution_history.json'), false);

console.log('Scorecard data contract tests passed');
