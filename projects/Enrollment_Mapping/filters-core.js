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
      (!opts.financeOnly || row.hasFinance),
    );
  }

  function listStates(rows) {
    return [...new Set(rows.map(row => row.state).filter(Boolean))].sort();
  }

  function listInstitutionNames(rows, options) {
    return [...new Set(filterInstitutions(rows, options).map(row => row.name).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  return { filterInstitutions, listStates, listInstitutionNames };
});
