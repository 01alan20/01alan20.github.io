const assert = require('node:assert/strict');
const { filterInstitutions, listInstitutionNames, listStates } = require('../filters-core.js');

const rows = [
  { unitid: 1, name: 'Alpha University', state: 'GA', year: 2035, control: 'Public', scope: 'Statewide', hasFinance: true },
  { unitid: 2, name: 'Beta College', state: 'NY', year: 2035, control: 'Private nonprofit', scope: 'Regional', hasFinance: true },
  { unitid: 3, name: 'Gamma Institute', state: 'GA', year: 2030, control: 'Public', scope: 'Regional', hasFinance: false },
];

assert.deepEqual(listStates(rows), ['GA', 'NY']);
assert.deepEqual(listInstitutionNames(rows, { year: 2035, state: 'GA' }), ['Alpha University']);
assert.deepEqual(
  filterInstitutions(rows, { year: 2035, state: 'GA', financeOnly: true }).map(row => row.unitid),
  [1],
);
assert.deepEqual(
  filterInstitutions(rows, { year: 2035, institutionId: '2', financeOnly: true }).map(row => row.unitid),
  [2],
);

console.log('filter logic tests passed');
