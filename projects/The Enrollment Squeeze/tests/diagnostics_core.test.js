const assert = require('node:assert/strict');
const {
  clampAllocation,
  describeInstitution,
  institutionMetricMeta,
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
