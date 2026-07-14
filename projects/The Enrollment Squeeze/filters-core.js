(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.EnrollmentFilterCore = factory();
})(typeof globalThis === 'object' ? globalThis : this, function () {
  function matches(value, selected) {
    return selected === undefined || selected === null || selected === '' || selected === 'All' || String(value) === String(selected);
  }

  function filterInstitutions(rows, options) {
    const opts = options || {};
    return rows.filter(row =>
      matches(row.year, opts.year) &&
      matches(row.control, opts.control) &&
      matches(row.scope, opts.scope) &&
      matches(row.state, opts.state) &&
      (!opts.institutionId || String(row.unitid) === String(opts.institutionId)) &&
      (!Number.isFinite(opts.exposureMin) || Number(row.exposureScore) >= opts.exposureMin) &&
      (!Number.isFinite(opts.exposureMax) || Number(row.exposureScore) <= opts.exposureMax) &&
      (!opts.financeOnly || row.hasFinance),
    );
  }

  function listStates(rows) {
    return [...new Set(rows.map(row => row.state).filter(Boolean))].sort();
  }

  function listInstitutionNames(rows, options) {
    return [...new Set(filterInstitutions(rows, options).map(row => row.name).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  function calculateTuitionPressure(row, projectedChange, tuitionFeeChange) {
    const currentUG = Number(row.currentUG) || 0;
    const studentsChange = currentUG * Number(projectedChange || 0);
    const fteChange = studentsChange;
    const tuitionRate = Number(row.tuitionPerFTE) || 0;
    const baselineTuition = currentUG * tuitionRate;
    const projectedUG = Math.max(0, currentUG + studentsChange);
    const projectedTuition = projectedUG * tuitionRate * (1 + Number(tuitionFeeChange || 0));
    return { projectedChange: Number(projectedChange || 0), studentsChange, fteChange, annualTuitionPressure: Math.max(0, baselineTuition - projectedTuition) };
  }

  function annualizeEndpointChange(endpointChange, years) {
    const horizon = Number(years);
    const change = Number(endpointChange || 0);
    if (!Number.isFinite(horizon) || horizon <= 0) return 0;
    return Math.pow(Math.max(0, 1 + change), 1 / horizon) - 1;
  }

  function projectEnrollment(start, annualRate, years) {
    return Number(start || 0) * Math.pow(1 + Number(annualRate || 0), Math.max(0, Number(years) || 0));
  }

  function enrollmentBand(baseline, percentage) {
    const value = Number(baseline || 0);
    const band = Math.abs(Number(percentage || 0));
    return { lower: value * (1 - band), baseline: value, upper: value * (1 + band) };
  }

  function combineAnnualRates(demographicRate, institutionRate, institutionWeight) {
    const weight = Math.max(0, Math.min(1, Number(institutionWeight)));
    const demographic = Number(demographicRate || 0);
    const institution = Number(institutionRate || 0);
    return (demographic * (1 - weight)) + (institution * weight);
  }

  function regularizeTrendRate(rate, lower = -0.10, upper = 0.03) {
    return Math.max(lower, Math.min(upper, Number(rate || 0)));
  }

  function dampedPeerAdjustment(residual, historyYears, horizon) {
    if (!Number.isFinite(Number(residual))) return 0;
    const coverageWeight = Math.max(0, Math.min(1, Number(historyYears || 0) / 10));
    const horizonWeight = Math.max(0.25, 1 - Math.max(0, Number(horizon || 1) - 1) * 0.10);
    return Math.max(-0.03, Math.min(0.03, Number(residual))) * coverageWeight * horizonWeight;
  }

  function internationalScenarioChange({ currentShare, preCovidShare, year, recovery }) {
    const current = Number(currentShare);
    if (!Number.isFinite(current) || current <= 0) return 0;
    const preCovid = preCovidShare != null && Number.isFinite(Number(preCovidShare)) ? Number(preCovidShare) : current;
    const targetMultiplier = recovery === 'smaller' ? 0.5 : recovery === 'larger' ? 1.25 : 1;
    const target = current + (preCovid - current) * targetMultiplier;
    const selectedYear = Number(year);
    if (!Number.isFinite(selectedYear) || selectedYear <= 2025) return 0;
    const shocked = current * (1 - 0.085);
    if (selectedYear <= 2027) return shocked - current;
    const recoveryProgress = Math.max(0, Math.min(1, (selectedYear - 2027) / 7));
    return (shocked + (target - shocked) * recoveryProgress) - current;
  }

  return {
    filterInstitutions,
    listStates,
    listInstitutionNames,
    calculateTuitionPressure,
    annualizeEndpointChange,
    projectEnrollment,
    enrollmentBand,
    combineAnnualRates,
    regularizeTrendRate,
    dampedPeerAdjustment,
    internationalScenarioChange,
  };
});
