(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.EnrollmentDiagnosticsCore = factory();
})(typeof globalThis === 'object' ? globalThis : this, function () {
  const allocationChannels = ['participation', 'outOfState', 'international', 'transferAdult'];

  function clampAllocation(required, requested) {
    const total = Math.max(0, Number(required) || 0);
    let remaining = total;
    const channels = {};
    allocationChannels.forEach(key => {
      const value = Math.max(0, Number(requested?.[key]) || 0);
      channels[key] = Math.min(value, remaining);
      remaining -= channels[key];
    });
    return { channels, allocated: total - remaining, unfilled: remaining, required: total };
  }

  function tuitionCounterfactual(row, lossRate, fteFactor = 0.85) {
    const rate = Number(lossRate);
    if (![0.05, 0.10, 0.20].includes(rate)) throw new RangeError('Loss rate must be 5%, 10%, or 20%');
    const currentUG = Math.max(0, Number(row?.currentUG) || 0);
    const tuitionPerFTE = Math.max(0, Number(row?.tuitionPerFTE) || 0);
    const instructionPerFTE = Math.max(0, Number(row?.instructionPerFTE) || 0);
    const factor = Math.max(0, Number(fteFactor) || 0);
    const lostStudents = currentUG * rate;
    const lostFTE = lostStudents * factor;
    const currentTuitionBase = currentUG * factor * tuitionPerFTE;
    const grossTuitionReduction = lostFTE * tuitionPerFTE;
    const associatedInstructionalExpenditure = lostFTE * instructionPerFTE;
    return {
      lossRate: rate,
      lostStudents,
      lostFTE,
      currentTuitionBase,
      grossTuitionReduction,
      associatedInstructionalExpenditure,
      grossReductionPct: currentTuitionBase ? grossTuitionReduction / currentTuitionBase : 0,
    };
  }

  const stateMetrics = {
    change: { label: 'Projected entrant change', shortLabel: 'Entrant change', format: 'percent', scale: 'diverging' },
    graduateLoss: { label: 'High-school graduates lost', shortLabel: 'Graduate loss', format: 'number', scale: 'diverging-loss' },
    entrantLoss: { label: 'Likely four-year entrants lost', shortLabel: 'Entrant loss', format: 'number', scale: 'diverging-loss' },
    requiredParticipationPoints: { label: 'Participation increase required', shortLabel: 'Participation increase', format: 'points', scale: 'sequential' },
  };

  function stateMetricMeta(metric) {
    return stateMetrics[metric] || stateMetrics.change;
  }

  const institutionMetrics = {
    change: { label: 'Observed undergraduate change', format: 'percent', scale: 'diverging' },
    currentUG: { label: 'Current undergraduate enrollment', format: 'number', scale: 'sequential' },
    admitRate: { label: 'Admissions rate', format: 'percent', scale: 'sequential' },
    retention: { label: 'Full-time retention rate', format: 'percent', scale: 'sequential' },
    adultUGShare: { label: 'Adult undergraduate share', format: 'percent', scale: 'sequential' },
    partTimeUGShare: { label: 'Part-time undergraduate share', format: 'percent', scale: 'sequential' },
    tuitionPerFTE: { label: 'Net tuition revenue per FTE', format: 'money', scale: 'sequential' },
  };

  function institutionMetricMeta(metric) {
    return institutionMetrics[metric] || institutionMetrics.change;
  }

  function describeInstitution(row) {
    const sentences = [];
    if (Number.isFinite(row?.change) && Number.isFinite(row?.peerMedian)) {
      if (row.change < row.peerMedian - 0.02) sentences.push('Enrollment declined more rapidly than comparable institutions over the observed period.');
      else if (row.change > row.peerMedian + 0.02) sentences.push('Enrollment outperformed comparable institutions over the observed period.');
      else sentences.push('Enrollment moved broadly in line with comparable institutions over the observed period.');
    }
    const peerAdult = row?.peerMedians?.adultShare;
    const peerPartTime = row?.peerMedians?.partTimeShare;
    if (
      Number.isFinite(row?.adultUGShare) && Number.isFinite(peerAdult)
      && Number.isFinite(row?.partTimeUGShare) && Number.isFinite(peerPartTime)
      && row.adultUGShare < peerAdult && row.partTimeUGShare < peerPartTime
    ) {
      sentences.push('Its student mix remains more concentrated in the traditional full-time undergraduate market than its peers.');
    } else if (Number.isFinite(row?.adultUGShare) && Number.isFinite(row?.partTimeUGShare)) {
      sentences.push('Adult and part-time enrollment provide observable alternatives to the traditional full-time undergraduate market.');
    }
    return sentences.join(' ') || 'The available observations are insufficient for a peer-relative description.';
  }

  return {
    clampAllocation,
    describeInstitution,
    institutionMetricMeta,
    stateMetricMeta,
    tuitionCounterfactual,
  };
});
