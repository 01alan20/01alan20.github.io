const fs = require("fs");
const vm = require("vm");
const assert = require("assert");

const adultData = JSON.parse(fs.readFileSync(__dirname + "/data/adult_ug_adjustment.json", "utf8"));
const appCode = fs.readFileSync(__dirname + "/app.js", "utf8")
  .split('$("pipeline-year").addEventListener')[0];

const sandbox = {
  window: {
    ENROLLMENT_NATIONAL: [
      { year: 2026, four: 100 },
      { year: 2041, four: 85 }
    ],
    ENROLLMENT_STATES: [],
    ENROLLMENT_INSTITUTIONS: [],
    ENROLLMENT_ADULT_UG_SHARES: { "123961": 0.606 },
    ENROLLMENT_ADULT_POP_INDEX: { "2041": 1.08 },
    ENROLLMENT_ADULT_POP_INDEX_BY_STATE: { CA: { "2041": 1.2 } },
    addEventListener: () => {},
    scrollY: 0,
    innerHeight: 800
  },
  document: {
    getElementById: () => ({
      addEventListener: () => {},
      innerHTML: "",
      textContent: "",
      style: {},
      value: "2041",
      dataset: {},
      setAttribute: () => {},
      append: () => {},
      querySelectorAll: () => []
    }),
    addEventListener: () => {},
    querySelectorAll: () => []
  },
  Intl,
  console
};
sandbox.global = sandbox;

vm.createContext(sandbox);
vm.runInContext(appCode, sandbox);

const usc = sandbox.normalizeInstitution({
  unitid: "123961",
  state: "CA",
  currentUG: 20443,
  firstTimeClass: 3489,
  homeShare: 0.42447692748638577,
  otherShare: 0.3943823445113213,
  internationalShare: 0.17999426769848095,
  unknownShare: 0.0011464603038119805,
  historicalResidual: -0.0017955920687557914,
  retention: 0.9633,
  stateChange2041: -0.273181,
  tuitionPerFTE: 37787
});

const oldModel = sandbox.modelInstitution({ ...usc, adultUGShare: 0 }, 2041, "baseline", 35);
const adultAdjusted = sandbox.modelInstitution(usc, 2041, "baseline", 35);
const expectedAdultAdjustedUG = oldModel.projectedUG * (1 - usc.adultUGShare) + usc.currentUG * usc.adultUGShare * 1.2;

assert.strictEqual(Math.round(usc.adultUGShare * 1000), 606);
assert(adultAdjusted.projectedUG > oldModel.projectedUG, "adult index should lift adult-heavy institutions above the first-time-only result");
assert.strictEqual(Math.round(adultAdjusted.projectedUG), Math.round(expectedAdultAdjustedUG));
assert(adultAdjusted.projectedUG < usc.currentUG * 1.09, "adult index should only apply to the adult-share portion");
assert.strictEqual(Math.round(adultData.adultUGShares["123961"] * 1000000), 39369);

console.log("model tests passed");
