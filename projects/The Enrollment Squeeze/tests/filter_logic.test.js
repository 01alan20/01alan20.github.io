const assert = require('node:assert/strict');
const fs = require('node:fs');
const {
  filterInstitutions,
  listInstitutionNames,
  listStates,
  calculateTuitionPressure,
  annualizeEndpointChange,
  projectEnrollment,
  enrollmentBand,
  combineAnnualRates,
  regularizeTrendRate,
  dampedPeerAdjustment,
  internationalScenarioChange,
} = require('../filters-core.js');

const rows = [
  { unitid: 1, name: 'Alpha University', state: 'GA', year: 2035, control: 'Public', scope: 'Statewide', exposureScore: 42, hasFinance: true },
  { unitid: 2, name: 'Beta College', state: 'NY', year: 2035, control: 'Private nonprofit', scope: 'Regional', exposureScore: 78, hasFinance: true },
  { unitid: 3, name: 'Gamma Institute', state: 'GA', year: 2030, control: 'Public', scope: 'Regional', exposureScore: 18, hasFinance: false },
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
assert.deepEqual(
  filterInstitutions(rows, { year: 2035, exposureMin: 50, exposureMax: 100 }).map(row => row.unitid),
  [2],
);
assert.deepEqual(calculateTuitionPressure({ currentUG: 1000, tuitionPerFTE: 12000 }, -0.10, 0.05), { projectedChange: -0.10, studentsChange: -100, fteChange: -100, annualTuitionPressure: 660000 });
assert.ok(calculateTuitionPressure({ currentUG: 1000, tuitionPerFTE: 12000 }, -0.10, 0.05).annualTuitionPressure < calculateTuitionPressure({ currentUG: 1000, tuitionPerFTE: 12000 }, -0.10, 0).annualTuitionPressure);
assert.ok(Math.abs(annualizeEndpointChange(-0.10, 5) - (-0.0208516376)) < 1e-8);
assert.equal(Math.round(projectEnrollment(4291, -0.05, 5)), 3320);
assert.deepEqual(enrollmentBand(1000, 0.05), { lower: 950, baseline: 1000, upper: 1050 });
assert.ok(Math.abs(combineAnnualRates(-0.02, -0.05, 0.5) - (-0.035)) < 1e-12);
assert.equal(regularizeTrendRate(0.16), 0.03);
assert.equal(regularizeTrendRate(-0.16), -0.10);
assert.ok(Math.abs(dampedPeerAdjustment(-0.04, 10, 5) - (-0.018)) < 1e-12);
assert.ok(Math.abs(dampedPeerAdjustment(-0.04, 10, 16) - (-0.0075)) < 1e-12);
assert.equal(dampedPeerAdjustment(null, 10, 5), 0);
assert.ok(Math.abs(internationalScenarioChange({ currentShare: 0.10, preCovidShare: 0.20, year: 2027, recovery: 'normal' }) - (-0.0085)) < 1e-12);
assert.ok(Math.abs(internationalScenarioChange({ currentShare: 0.10, preCovidShare: 0.20, year: 2034, recovery: 'smaller' }) - 0.05) < 1e-12);
assert.ok(Math.abs(internationalScenarioChange({ currentShare: 0.10, preCovidShare: 0.20, year: 2034, recovery: 'normal' }) - 0.10) < 1e-12);
assert.ok(Math.abs(internationalScenarioChange({ currentShare: 0.10, preCovidShare: 0.20, year: 2034, recovery: 'larger' }) - 0.125) < 1e-12);
assert.equal(internationalScenarioChange({ currentShare: 0.7051, preCovidShare: null, year: 2034, recovery: 'normal' }), 0);
assert.equal(internationalScenarioChange({ currentShare: null, preCovidShare: 0.20, year: 2034, recovery: 'normal' }), 0);

const indexHtml = fs.readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');
const appSource = fs.readFileSync(require('node:path').join(__dirname, '..', 'app.js'), 'utf8');
const filtersSource = fs.readFileSync(require('node:path').join(__dirname, '..', 'filters.js'), 'utf8');
assert.equal(indexHtml.includes('href="#method"'), false);
assert.equal(appSource.includes('function renderStatus()'), false);
assert.match(indexHtml, /id="institution-decomposition"/);
assert.match(filtersSource, /analysis\.hidden = true/);
assert.match(filtersSource, /analysis\.hidden = false/);
assert.match(indexHtml, /\.capacity-section \.section-head>p,\.capacity-section>\.figure-note,\.capacity-section \.exposure-explainer\{display:none\}/);
assert.match(indexHtml, /Institution scenario adjustment/);
assert.match(indexHtml, /id="reset-institution-scenario"/);
assert.match(indexHtml, /id="institution-international-recovery"/);
assert.match(indexHtml, /id="institution-analysis" hidden/);
assert.match(filtersSource, /institution-analysis/);
assert.match(filtersSource, /reset-institution-scenario/);
assert.match(indexHtml, /id="undergraduate-history-change"/);
assert.match(indexHtml, /id="graduate-history-change"/);
assert.match(appSource, /changeAnnotation/);
assert.match(appSource, /from 2015 to 2023/);

console.log('filter logic tests passed');
