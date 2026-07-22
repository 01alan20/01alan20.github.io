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
    firstTimeHomeStateShare: { label: 'First-time students from within the institution state', format: 'percent', scale: 'sequential', population: 'residence' },
    firstTimeOtherStateShare: { label: 'First-time students from other U.S. states', format: 'percent', scale: 'sequential', population: 'residence' },
    internationalUGShare: { label: 'Undergraduate nonresident-alien share', format: 'percent', scale: 'sequential', population: 'scorecard' },
  };

  function institutionMetricMeta(metric) {
    return institutionMetrics[metric] || institutionMetrics.change;
  }

  const institutionGroupColors = ['#c95c32', '#e2a178', '#e7e2d8', '#8abfc2', '#218a9a'];
  const fixedInstitutionGroups = {
    change: {
      labels: ['Large decline', 'Moderate decline', 'Little change', 'Moderate growth', 'Large growth'],
      indexFor: value => value <= -0.10 ? 0 : value < -0.025 ? 1 : value <= 0.025 ? 2 : value < 0.10 ? 3 : 4,
    },
    admitRate: {
      labels: ['<10%', '10–24%', '25–49%', '50–79%', '80%+'],
      indexFor: value => value < 0.10 ? 0 : value < 0.25 ? 1 : value < 0.50 ? 2 : value < 0.80 ? 3 : 4,
    },
    currentUG: {
      labels: ['<1,000', '1,000–4,999', '5,000–9,999', '10,000–19,999', '20,000+'],
      indexFor: value => value < 1000 ? 0 : value < 5000 ? 1 : value < 10000 ? 2 : value < 20000 ? 3 : 4,
    },
    retention: {
      labels: ['<50%', '50–64%', '65–74%', '75–84%', '85%+'],
      indexFor: value => value < 0.50 ? 0 : value < 0.65 ? 1 : value < 0.75 ? 2 : value < 0.85 ? 3 : 4,
    },
    firstTimeHomeStateShare: {
      labels: ['<25%', '25–49%', '50–74%', '75–89%', '90%+'],
      indexFor: value => value < 0.25 ? 0 : value < 0.50 ? 1 : value < 0.75 ? 2 : value < 0.90 ? 3 : 4,
    },
    firstTimeOtherStateShare: {
      labels: ['<25%', '25–49%', '50–74%', '75–89%', '90%+'],
      indexFor: value => value < 0.25 ? 0 : value < 0.50 ? 1 : value < 0.75 ? 2 : value < 0.90 ? 3 : 4,
    },
  };

  function steppedColorscale(colors) {
    return colors.flatMap((color, index) => [[index / colors.length, color], [(index + 1) / colors.length, color]]);
  }

  function sampledGroupColors(count) {
    if (count === 1) return [institutionGroupColors[2]];
    return Array.from({ length: count }, (_, index) => institutionGroupColors[Math.round(index * (institutionGroupColors.length - 1) / (count - 1))]);
  }

  function buildMapGrouping(labels, indexFor) {
    const colors = sampledGroupColors(labels.length);
    const groups = labels.map((label, index) => ({ index, label, color: colors[index] }));
    return {
      groups,
      indexFor: value => Number.isFinite(value) ? indexFor(value) : null,
      cmin: -0.5,
      cmax: groups.length - 0.5,
      colorscale: steppedColorscale(colors),
      tickvals: groups.map(group => group.index),
      ticktext: groups.map(group => group.label),
    };
  }

  function groupValueLabel(value, format) {
    if (format === 'percent') {
      const percent = value * 100;
      const digits = Math.abs(percent) < 1 ? 2 : Math.abs(percent) < 10 ? 1 : 0;
      return `${percent.toFixed(digits)}%`;
    }
    if (format === 'money') return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
  }

  function institutionMapGrouping(metric, values) {
    const definition = fixedInstitutionGroups[metric];
    if (definition) return buildMapGrouping(definition.labels, definition.indexFor);
    const valid = values.filter(Number.isFinite).slice().sort((a, b) => a - b);
    if (!valid.length) return buildMapGrouping(['No available values'], () => 0);
    const maximum = valid[valid.length - 1];
    const thresholds = [...new Set([0.2, 0.4, 0.6, 0.8].map(probability => quantile(valid, probability)).filter(value => value < maximum))];
    const format = institutionMetricMeta(metric).format;
    const labels = thresholds.length
      ? thresholds.map((value, index) => index === 0 ? `Up to ${groupValueLabel(value, format)}` : `${groupValueLabel(thresholds[index - 1], format)}–${groupValueLabel(value, format)}`).concat(`More than ${groupValueLabel(thresholds[thresholds.length - 1], format)}`)
      : [`${groupValueLabel(valid[0], format)}`];
    const indexFor = value => thresholds.filter(threshold => threshold < value).length;
    return buildMapGrouping(labels, indexFor);
  }

  function quantile(values, probability) {
    const sorted = values.filter(Number.isFinite).slice().sort((a, b) => a - b);
    if (!sorted.length) return 0;
    const index = (sorted.length - 1) * probability;
    const lower = Math.floor(index);
    const fraction = index - lower;
    return sorted[lower + 1] == null ? sorted[lower] : sorted[lower] + fraction * (sorted[lower + 1] - sorted[lower]);
  }

  function institutionColorScale(values, scale) {
    const valid = values.filter(Number.isFinite);
    if (scale === 'diverging') {
      const limit = Math.max(0.05, ...valid.map(Math.abs));
      return { cmin: -limit, cmax: limit, cmid: 0, colorscale: [[0, '#d66a3a'], [.5, '#e7e2d8'], [1, '#218a9a']] };
    }
    let cmin = quantile(valid, 0.05);
    let cmax = quantile(valid, 0.95);
    if (!(cmax > cmin)) {
      cmin = Math.min(...valid, 0);
      cmax = Math.max(...valid, 1);
    }
    const midpoint = quantile(valid, 0.5);
    const midpointStop = Math.max(0.08, Math.min(0.92, (midpoint - cmin) / (cmax - cmin)));
    return { cmin, cmax, colorscale: [[0, '#d58a5b'], [midpointStop, '#e7e2d8'], [1, '#218a9a']] };
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
    institutionColorScale,
    institutionMapGrouping,
    institutionMetricMeta,
    stateMetricMeta,
    tuitionCounterfactual,
  };
});
