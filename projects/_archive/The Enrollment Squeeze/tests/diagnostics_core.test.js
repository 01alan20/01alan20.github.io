const assert = require('node:assert/strict');
const {
  clampAllocation,
  describeInstitution,
  institutionMetricMeta,
  institutionColorScale,
  institutionMapGrouping,
  stateMetricMeta,
  tuitionCounterfactual,
} = require('../diagnostics-core');

const filled = clampAllocation(600, {
  participation: 200,
  outOfState: 150,
  international: 100,
  transferAdult: 150,
});
assert.equal(filled.allocated, 600);
assert.equal(filled.unfilled, 0);

const capped = clampAllocation(600, { participation: 500, outOfState: 500 });
assert.equal(capped.channels.participation, 500);
assert.equal(capped.channels.outOfState, 100);
assert.equal(capped.allocated, 600);
assert.equal(capped.unfilled, 0);

const finance = tuitionCounterfactual(
  { currentUG: 1000, tuitionPerFTE: 10000, instructionPerFTE: 6000 },
  0.10,
  0.85,
);
assert.equal(finance.lostStudents, 100);
assert.equal(finance.lostFTE, 85);
assert.equal(finance.currentTuitionBase, 8500000);
assert.equal(finance.grossTuitionReduction, 850000);
assert.equal(finance.associatedInstructionalExpenditure, 510000);
assert.equal(finance.grossReductionPct, 0.10);
assert.throws(() => tuitionCounterfactual({ currentUG: 1000 }, 0.15), /5%, 10%, or 20%/);

assert.equal(stateMetricMeta('entrantLoss').label, 'Likely four-year entrants lost');
assert.equal(stateMetricMeta('requiredParticipationPoints').scale, 'sequential');
assert.equal(institutionMetricMeta('change').format, 'percent');
assert.equal(institutionMetricMeta('currentUG').scale, 'sequential');
assert.deepEqual(institutionMetricMeta('firstTimeHomeStateShare'), {
  label: 'First-time students from within the institution state', format: 'percent', scale: 'sequential', population: 'residence',
});
assert.equal(institutionMetricMeta('firstTimeOtherStateShare').population, 'residence');
assert.equal(institutionMetricMeta('internationalUGShare').label, 'Undergraduate nonresident-alien share');
assert.equal(institutionMetricMeta('internationalUGShare').population, 'scorecard');
const concentratedScale = institutionColorScale([0, 0.005, 0.01, 0.025, 0.05, 0.15, 1], 'sequential');
assert.ok(concentratedScale.cmax < 1, 'sequential map scale must not be flattened by a single extreme value');
assert.equal(concentratedScale.colorscale.length, 3);
assert.ok(concentratedScale.colorscale[1][0] > 0 && concentratedScale.colorscale[1][0] < 1);

const admissions = institutionMapGrouping('admitRate', [0.05, 0.10, 0.25, 0.50, 0.80]);
assert.deepEqual(admissions.groups.map(group => group.label), ['<10%', '10–24%', '25–49%', '50–79%', '80%+']);
assert.deepEqual([0.099, 0.10, 0.249, 0.25, 0.499, 0.50, 0.799, 0.80].map(admissions.indexFor), [0, 1, 1, 2, 2, 3, 3, 4]);

const changeGroups = institutionMapGrouping('change', [-0.20, -0.05, 0, 0.05, 0.20]);
assert.deepEqual(changeGroups.groups.map(group => group.label), ['Large decline', 'Moderate decline', 'Little change', 'Moderate growth', 'Large growth']);
assert.deepEqual([-0.10, -0.099, -0.025, 0.025, 0.026, 0.10].map(changeGroups.indexFor), [0, 1, 2, 2, 3, 4]);

const sizeGroups = institutionMapGrouping('currentUG', [500, 2500, 7500, 15000, 30000]);
assert.deepEqual(sizeGroups.groups.map(group => group.label), ['<1,000', '1,000–4,999', '5,000–9,999', '10,000–19,999', '20,000+']);
assert.deepEqual([999, 1000, 4999, 5000, 9999, 10000, 19999, 20000].map(sizeGroups.indexFor), [0, 1, 1, 2, 2, 3, 3, 4]);

const quantileGroups = institutionMapGrouping('internationalUGShare', [0, 0.01, 0.02, 0.03, 0.05, 0.08, 0.13, 0.21, 0.34, 0.55]);
assert.equal(quantileGroups.groups.length, 5);
assert.equal(quantileGroups.colorscale.length, 10);
assert.deepEqual(quantileGroups.tickvals, [0, 1, 2, 3, 4]);
assert.ok(quantileGroups.groups.every(group => /%/.test(group.label)));
assert.equal(quantileGroups.indexFor(null), null);

const tiedGroups = institutionMapGrouping('adultUGShare', [0, 0, 0, 0, 0.10, 0.20]);
assert.ok(tiedGroups.groups.length >= 2 && tiedGroups.groups.length < 5);
assert.equal(new Set(tiedGroups.groups.map(group => group.label)).size, tiedGroups.groups.length);
assert.ok(tiedGroups.groups.every((group, index) => group.index === index));

const description = describeInstitution({
  change: -0.18,
  peerMedian: -0.05,
  adultUGShare: 0.09,
  peerMedians: { adultShare: 0.16, partTimeShare: 0.18 },
  partTimeUGShare: 0.06,
});
assert.match(description, /declined more rapidly than comparable institutions/i);
assert.match(description, /traditional full-time undergraduate market/i);
assert.doesNotMatch(description, /risk|vulnerable|resilien/i);

console.log('diagnostics core tests passed');
