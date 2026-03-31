const state = {
  allSessions: [],
  allJourneys: [],
  filteredSessions: [],
  filteredJourneys: [],
  filters: {
    entryChannel: "",
    device: "",
    touch: "",
  },
  metadata: null,
};

const CHANNEL_ORDER = [
  "Organic Search",
  "Paid Search",
  "Paid Social",
  "Email",
  "Direct",
  "Referral",
];

const CHANNEL_COLORS = {
  "Organic Search": "#0f766e",
  "Paid Search": "#2563eb",
  "Paid Social": "#c2410c",
  Email: "#8b5cf6",
  Direct: "#14213d",
  Referral: "#c46a1a",
};

const num = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const fmt = (value, digits = 0) =>
  Number.isFinite(value)
    ? Number(value).toLocaleString(undefined, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      })
    : "-";

const pct = (value, digits = 1) =>
  Number.isFinite(value) ? `${(value * 100).toFixed(digits)}%` : "-";

const currency = (value, digits = 0) =>
  Number.isFinite(value)
    ? `$${Number(value).toLocaleString(undefined, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      })}`
    : "-";

const mean = (values) => {
  const valid = values.filter((value) => Number.isFinite(value));
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : 0;
};

const median = (values) => {
  const valid = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
  if (!valid.length) return null;
  const middle = Math.floor(valid.length / 2);
  return valid.length % 2 ? valid[middle] : (valid[middle - 1] + valid[middle]) / 2;
};

function baseLayout() {
  return {
    font: { family: "Fira Sans, sans-serif", size: 12, color: "#435064" },
    paper_bgcolor: "rgba(255,255,255,0)",
    plot_bgcolor: "rgba(255,255,255,0)",
    margin: { l: 60, r: 20, t: 28, b: 52 },
    legend: { orientation: "h", y: 1.12, x: 0 },
    hoverlabel: { font: { family: "Fira Sans, sans-serif" } },
  };
}

function plot(divId, data, layout) {
  Plotly.react(divId, data, { ...baseLayout(), ...layout }, { responsive: true, displayModeBar: false });
}

function renderEmptyPlot(divId, message) {
  plot(divId, [], {
    annotations: [
      {
        text: message,
        x: 0.5,
        y: 0.5,
        xref: "paper",
        yref: "paper",
        showarrow: false,
        font: { size: 14, color: "#677489" },
      },
    ],
    xaxis: { visible: false },
    yaxis: { visible: false },
  });
}

async function fetchCSV(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not fetch ${path}`);
  }
  const text = await response.text();
  return Papa.parse(text, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  }).data;
}

async function fetchJSON(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not fetch ${path}`);
  }
  return response.json();
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
}

function populateSelect(selectId, values, placeholder) {
  const select = document.getElementById(selectId);
  if (!select) return;
  select.innerHTML = [
    `<option value="">${placeholder}</option>`,
    ...values.map((value) => `<option value="${value}">${value}</option>`),
  ].join("");
}

function syncFilters() {
  state.filters.entryChannel = document.getElementById("entry-channel-filter").value;
  state.filters.device = document.getElementById("device-filter").value;
  state.filters.touch = document.getElementById("touch-filter").value;

  state.filteredJourneys = state.allJourneys.filter((journey) => {
    const matchesChannel = !state.filters.entryChannel || journey.first_touch_channel === state.filters.entryChannel;
    const matchesDevice = !state.filters.device || journey.primary_device === state.filters.device;
    const matchesTouch = !state.filters.touch || journey.touch_pattern === state.filters.touch;
    return matchesChannel && matchesDevice && matchesTouch;
  });

  const validIds = new Set(state.filteredJourneys.map((journey) => journey.prospect_id));
  state.filteredSessions = state.allSessions.filter((session) => validIds.has(session.prospect_id));
}

function getChannelSummary(sessions) {
  const totalSessions = sessions.length || 1;
  const totalLinear = sessions.reduce((sum, row) => sum + num(row.linear_credit), 0) || 1;

  return CHANNEL_ORDER.map((channel) => {
    const rows = sessions.filter((row) => row.channel_group === channel);
    const sessionCount = rows.length;
    const cartIntents = rows.reduce((sum, row) => sum + num(row.lead_event_flag), 0);
    const transactions = rows.reduce((sum, row) => sum + num(row.enrollment_equivalent_flag), 0);
    const revenue = rows.reduce((sum, row) => sum + num(row.transaction_revenue), 0);
    const firstTouch = rows.reduce((sum, row) => sum + num(row.first_touch_credit), 0);
    const lastTouch = rows.reduce((sum, row) => sum + num(row.last_touch_credit), 0);
    const linear = rows.reduce((sum, row) => sum + num(row.linear_credit), 0);

    return {
      channel,
      sessions: sessionCount,
      cartIntents,
      transactions,
      revenue,
      firstTouch,
      lastTouch,
      linear,
      sessionShare: sessionCount / totalSessions,
      transactionShare: linear / totalLinear,
      shareGap: linear / totalLinear - sessionCount / totalSessions,
      transactionPer100Sessions: sessionCount ? (linear / sessionCount) * 100 : 0,
      cartToTransaction: cartIntents ? linear / cartIntents : 0,
      avgOrderValue: transactions ? revenue / transactions : 0,
    };
  }).filter((row) => row.sessions > 0);
}

function getWeeklySummary(sessions) {
  const map = new Map();
  sessions.forEach((row) => {
    const key = row.week_start;
    if (!map.has(key)) {
      map.set(key, { week: key, sessions: 0, cartIntents: 0, transactions: 0 });
    }
    const item = map.get(key);
    item.sessions += 1;
    item.cartIntents += num(row.lead_event_flag);
    item.transactions += num(row.enrollment_equivalent_flag);
  });
  return [...map.values()].sort((a, b) => a.week.localeCompare(b.week));
}

function getTouchDepthSummary(journeys) {
  return [1, 2, 3, 4, 5].map((touches) => {
    const rows = journeys.filter((journey) => num(journey.sessions_in_journey) === touches);
    const transactions = rows.filter((journey) => num(journey.enrollment_equivalent_flag) === 1).length;
    return {
      touches,
      label: touches === 5 ? "5" : String(touches),
      journeys: rows.length,
      transactionRate: rows.length ? transactions / rows.length : 0,
    };
  }).filter((row) => row.journeys > 0);
}

function getPathSummary(journeys) {
  const map = new Map();
  journeys.forEach((journey) => {
    const key = journey.journey_path;
    if (!map.has(key)) {
      map.set(key, {
        path: key,
        journeys: 0,
        cartIntents: 0,
        transactions: 0,
        days: [],
      });
    }

    const item = map.get(key);
    item.journeys += 1;
    item.cartIntents += num(journey.lead_flag);
    item.transactions += num(journey.enrollment_equivalent_flag);
    if (num(journey.days_to_enrollment) > 0) {
      item.days.push(num(journey.days_to_enrollment));
    }
  });

  return [...map.values()]
    .map((item) => ({
      ...item,
      transactionRate: item.journeys ? item.transactions / item.journeys : 0,
      medianDays: median(item.days),
    }))
    .sort((a, b) => {
      if (b.transactions !== a.transactions) return b.transactions - a.transactions;
      return b.journeys - a.journeys;
    });
}

function getFlowSummary(journeys) {
  const converted = journeys.filter((journey) => num(journey.enrollment_equivalent_flag) === 1);
  const map = new Map();

  converted.forEach((journey) => {
    const key = `${journey.first_touch_channel}|||${journey.last_touch_channel}`;
    map.set(key, (map.get(key) || 0) + 1);
  });

  return [...map.entries()]
    .map(([key, value]) => {
      const [firstTouch, lastTouch] = key.split("|||");
      return { firstTouch, lastTouch, transactions: value };
    })
    .filter((row) => row.transactions >= 4)
    .sort((a, b) => b.transactions - a.transactions);
}

function getDatasetSummary(sessions, journeys, channelSummary) {
  const cartIntentJourneys = journeys.reduce((sum, row) => sum + num(row.lead_flag), 0);
  const transactions = journeys.reduce((sum, row) => sum + num(row.enrollment_equivalent_flag), 0);
  const revenue = journeys.reduce((sum, row) => sum + num(row.transaction_revenue), 0);
  const multiTouchTransactions = journeys.filter(
    (row) => num(row.enrollment_equivalent_flag) === 1 && num(row.sessions_in_journey) > 1
  ).length;

  return {
    sessions: sessions.length,
    cartIntentJourneys,
    transactions,
    revenue,
    averageOrderValue: transactions ? revenue / transactions : 0,
    engagedRate: sessions.length ? sessions.reduce((sum, row) => sum + num(row.engaged_session_flag), 0) / sessions.length : 0,
    transactionRate: sessions.length ? transactions / sessions.length : 0,
    cartRate: sessions.length ? cartIntentJourneys / sessions.length : 0,
    multiTouchShare: transactions ? multiTouchTransactions / transactions : 0,
    channelCount: channelSummary.length,
    deviceCount: new Set(journeys.map((row) => row.primary_device)).size,
  };
}

function getOrganicPaidComparison(channelSummary) {
  const organic = channelSummary.find((row) => row.channel === "Organic Search");
  if (!organic || organic.cartIntents <= 0) return null;

  const candidates = channelSummary
    .filter(
      (row) =>
        (row.channel === "Paid Search" || row.channel === "Paid Social") &&
        row.cartIntents > organic.cartIntents &&
        row.cartToTransaction > 0
    )
    .map((row) => ({
      organic,
      comparison: row,
      rateRatio: organic.cartToTransaction / row.cartToTransaction,
      cartGap: 1 - organic.cartIntents / row.cartIntents,
    }))
    .sort((a, b) => b.rateRatio - a.rateRatio);

  return candidates[0] || null;
}

function renderProvenance() {
  const metadata = state.metadata;
  if (!metadata) return;

  const heroSource = document.getElementById("hero-source-note");
  const provenance = document.getElementById("provenance-note");

  if (heroSource) {
    heroSource.textContent =
      `Official basis: ${metadata.source_dataset_reference} (${metadata.source_window}). ` +
      `Local note: ${metadata.caveat}`;
  }

  if (provenance) {
    provenance.textContent =
      `Modeled additions in this repo: ${metadata.local_modeled_layer.join(", ")}.`;
  }
}

function renderKPIs(summary) {
  setText("kpi-sessions", fmt(summary.sessions));
  setText("kpi-engaged", `${pct(summary.engagedRate, 1)} engaged-session rate`);
  setText("kpi-cart-intents", fmt(summary.cartIntentJourneys));
  setText("kpi-cart-rate", `${(summary.cartRate * 100).toFixed(1)} cart-intent journeys / 100 sessions`);
  setText("kpi-transactions", fmt(summary.transactions));
  setText("kpi-transaction-rate", `${(summary.transactionRate * 100).toFixed(1)} transactions / 100 sessions`);
  setText("kpi-revenue", currency(summary.revenue, 0));
  setText(
    "kpi-aov",
    `${currency(summary.averageOrderValue, 0)} average order value | ${pct(summary.multiTouchShare, 1)} multi-touch`
  );
}

function renderBrief(summary, channelSummary) {
  const comparison = getOrganicPaidComparison(channelSummary);
  const bestCloser = [...channelSummary].sort((a, b) => b.lastTouch - a.lastTouch)[0];

  if (comparison) {
    const { organic, comparison: paid, rateRatio, cartGap } = comparison;
    setText("brief-headline", `Organic Search converts ${fmt(rateRatio, 1)}x better than ${paid.channel}`);
    setText(
      "brief-copy",
      `Organic Search produces ${pct(cartGap, 0)} fewer cart-intent events than ${paid.channel}, but turns ${pct(organic.cartToTransaction, 1)} of them into transactions versus ${pct(paid.cartToTransaction, 1)} for ${paid.channel}.`
    );
    setText("brief-transaction-rate", pct(summary.transactionRate, 1));
  } else {
    setText("brief-headline", "Dataset summary loaded");
    setText("brief-copy", "The current slice does not have a stable Organic-versus-paid comparison.");
    setText("brief-transaction-rate", pct(summary.transactionRate, 1));
  }

  setText("brief-closer", bestCloser ? bestCloser.channel : "-");
  setText("brief-revenue", currency(summary.averageOrderValue, 0));
}

function renderDecisionStrip(channelSummary, journeys) {
  const eligible = channelSummary.filter((row) => row.sessions >= 120);
  const bestEfficiency = [...eligible].sort((a, b) => b.transactionPer100Sessions - a.transactionPer100Sessions)[0];
  const biggestDrag = [...eligible].sort((a, b) => a.shareGap - b.shareGap)[0];
  const touchSummary = getTouchDepthSummary(journeys);
  const singleTouch = touchSummary.find((row) => row.touches === 1);
  const threeTouch = touchSummary.find((row) => row.touches === 3) || touchSummary[touchSummary.length - 1];
  const ratio = singleTouch && singleTouch.transactionRate > 0
    ? threeTouch.transactionRate / singleTouch.transactionRate
    : 0;

  if (bestEfficiency) {
    setText("decision-efficiency-title", "Which channel stays strongest after traffic is normalized?");
    setText(
      "decision-efficiency-copy",
      `${bestEfficiency.channel} leads at ${fmt(bestEfficiency.transactionPer100Sessions, 1)} attributed transactions per 100 sessions.`
    );
  }

  if (biggestDrag) {
    setText("decision-volume-title", "Which channel creates traffic but not enough transactions?");
    setText(
      "decision-volume-copy",
      `${biggestDrag.channel} contributes ${pct(biggestDrag.sessionShare, 1)} of sessions but under-indexes transaction share by ${fmt(Math.abs(biggestDrag.shareGap) * 100, 1)} percentage points.`
    );
  }

  if (singleTouch && threeTouch && ratio > 0) {
    setText("decision-journey-title", "Does conversion improve as touches accumulate?");
    setText(
      "decision-journey-copy",
      `${threeTouch.touches}-touch journeys convert ${fmt(ratio, 1)}x better than single-touch journeys in the current slice.`
    );
  }
}

function renderWeeklyPerformance(sessions) {
  const weekly = getWeeklySummary(sessions);
  if (!weekly.length) {
    renderEmptyPlot("chart-weekly-performance", "No sessions match the current filters.");
    return;
  }

  plot(
    "chart-weekly-performance",
    [
      {
        x: weekly.map((row) => row.week),
        y: weekly.map((row) => row.sessions),
        type: "bar",
        marker: { color: "rgba(20,33,61,0.18)" },
        name: "Sessions",
      },
      {
        x: weekly.map((row) => row.week),
        y: weekly.map((row) => row.cartIntents),
        type: "scatter",
        mode: "lines+markers",
        marker: { color: "#c46a1a", size: 8 },
        line: { color: "#c46a1a", width: 3 },
        name: "Cart Intent",
        yaxis: "y2",
      },
      {
        x: weekly.map((row) => row.week),
        y: weekly.map((row) => row.transactions),
        type: "scatter",
        mode: "lines+markers",
        marker: { color: "#0f766e", size: 8 },
        line: { color: "#0f766e", width: 3 },
        name: "Transactions",
        yaxis: "y2",
      },
    ],
    {
      yaxis: { title: "Sessions", gridcolor: "rgba(67,80,100,0.10)" },
      yaxis2: { title: "Cart Intent / Transactions", overlaying: "y", side: "right", rangemode: "tozero" },
      xaxis: { tickangle: -28 },
    }
  );
}

function renderChannelEfficiency(channelSummary) {
  if (!channelSummary.length) {
    renderEmptyPlot("chart-channel-efficiency", "No channel summary available for the current filters.");
    return;
  }

  plot(
    "chart-channel-efficiency",
    [
      {
        type: "scatter",
        mode: "markers+text",
        x: channelSummary.map((row) => row.sessions),
        y: channelSummary.map((row) => row.transactionPer100Sessions),
        text: channelSummary.map((row) => row.channel),
        textposition: "top center",
        marker: {
          size: channelSummary.map((row) => Math.max(18, row.cartIntents * 0.18)),
          color: channelSummary.map((row) => row.shareGap),
          colorscale: [
            [0, "#c2410c"],
            [0.5, "#d1d5db"],
            [1, "#0f766e"],
          ],
          cmin: -0.10,
          cmax: 0.10,
          line: { color: "rgba(20,33,61,0.14)", width: 1 },
          showscale: true,
          colorbar: { title: "Share Gap" },
        },
        hovertemplate:
          "<b>%{text}</b><br>Sessions: %{x}<br>Transactions / 100 Sessions: %{y:.1f}<br>Bubble size: cart-intent events<extra></extra>",
      },
    ],
    {
      xaxis: { title: "Sessions", gridcolor: "rgba(67,80,100,0.10)" },
      yaxis: { title: "Attributed transactions per 100 sessions", gridcolor: "rgba(67,80,100,0.10)" },
    }
  );
}

function renderAttributionModels(channelSummary) {
  if (!channelSummary.length) {
    renderEmptyPlot("chart-attribution-models", "No attribution data available for the current filters.");
    return;
  }

  plot(
    "chart-attribution-models",
    [
      {
        x: channelSummary.map((row) => row.channel),
        y: channelSummary.map((row) => row.firstTouch),
        type: "bar",
        name: "First-touch",
        marker: { color: "#2563eb" },
      },
      {
        x: channelSummary.map((row) => row.channel),
        y: channelSummary.map((row) => row.lastTouch),
        type: "bar",
        name: "Last-touch",
        marker: { color: "#c46a1a" },
      },
    ],
    {
      barmode: "group",
      yaxis: { title: "Attributed transactions", gridcolor: "rgba(67,80,100,0.10)" },
      xaxis: { tickangle: -20 },
    }
  );
}

function renderRankShift(channelSummary) {
  if (!channelSummary.length) {
    renderEmptyPlot("chart-rank-shift", "No rank-shift data available for the current filters.");
    return;
  }

  const sessionRanked = [...channelSummary]
    .sort((a, b) => b.sessions - a.sessions)
    .map((row, index) => ({ ...row, sessionRank: index + 1 }));

  const linearRankMap = new Map(
    [...channelSummary]
      .sort((a, b) => b.linear - a.linear)
      .map((row, index) => [row.channel, index + 1])
  );

  const ranked = sessionRanked
    .map((row) => ({
      ...row,
      linearRank: linearRankMap.get(row.channel),
    }))
    .sort((a, b) => a.sessionRank - b.sessionRank);

  plot(
    "chart-rank-shift",
    [
      {
        x: ranked.flatMap((row) => [row.sessionRank, row.linearRank, null]),
        y: ranked.flatMap((row) => [row.channel, row.channel, null]),
        type: "scatter",
        mode: "lines",
        line: { color: "rgba(20,33,61,0.28)", width: 3 },
        hoverinfo: "skip",
        showlegend: false,
      },
      {
        x: ranked.map((row) => row.sessionRank),
        y: ranked.map((row) => row.channel),
        type: "scatter",
        mode: "markers+text",
        name: "Traffic rank",
        marker: { color: "#2563eb", size: 13 },
        text: ranked.map((row) => `#${row.sessionRank}`),
        textposition: "middle left",
        hovertemplate:
          "<b>%{y}</b><br>Traffic rank: %{x}<br>Sessions: %{customdata:,.0f}<extra></extra>",
        customdata: ranked.map((row) => row.sessions),
      },
      {
        x: ranked.map((row) => row.linearRank),
        y: ranked.map((row) => row.channel),
        type: "scatter",
        mode: "markers+text",
        name: "Attributed transaction rank",
        marker: { color: "#0f766e", size: 13 },
        text: ranked.map((row) => `#${row.linearRank}`),
        textposition: "middle right",
        hovertemplate:
          "<b>%{y}</b><br>Attributed transaction rank: %{x}<br>Linear transaction credit: %{customdata:.1f}<extra></extra>",
        customdata: ranked.map((row) => row.linear),
      }
    ],
    {
      xaxis: {
        title: "Rank position (1 = highest)",
        tickmode: "linear",
        dtick: 1,
        range: [0.5, channelSummary.length + 0.5],
        gridcolor: "rgba(67,80,100,0.10)",
      },
      yaxis: {
        automargin: true,
        categoryorder: "array",
        categoryarray: ranked.map((row) => row.channel),
      },
    }
  );
}

function renderJourneyFlow(journeys) {
  const flow = getFlowSummary(journeys);
  if (!flow.length) {
    renderEmptyPlot("chart-journey-flow", "No converting journeys match the current filters.");
    return;
  }

  const firstLabels = CHANNEL_ORDER.map((channel) => `Entry: ${channel}`);
  const lastLabels = CHANNEL_ORDER.map((channel) => `Closer: ${channel}`);
  const labels = [...firstLabels, ...lastLabels];
  const firstOffset = 0;
  const lastOffset = firstLabels.length;

  const channelIndex = (channel, type) =>
    (type === "first" ? firstOffset : lastOffset) + CHANNEL_ORDER.indexOf(channel);

  plot(
    "chart-journey-flow",
    [
      {
        type: "sankey",
        arrangement: "snap",
        node: {
          pad: 18,
          thickness: 18,
          line: { color: "rgba(20,33,61,0.15)", width: 1 },
          label: labels,
          color: [
            ...CHANNEL_ORDER.map((channel) => CHANNEL_COLORS[channel]),
            ...CHANNEL_ORDER.map((channel) => `${CHANNEL_COLORS[channel]}cc`),
          ],
        },
        link: {
          source: flow.map((row) => channelIndex(row.firstTouch, "first")),
          target: flow.map((row) => channelIndex(row.lastTouch, "last")),
          value: flow.map((row) => row.transactions),
          color: flow.map((row) => `${CHANNEL_COLORS[row.firstTouch]}70`),
          hovertemplate:
            "<b>%{source.label}</b><br><b>%{target.label}</b><br>Transactions: %{value}<extra></extra>",
        },
      },
    ],
    { margin: { l: 20, r: 20, t: 18, b: 18 } }
  );
}

function renderTouchDepth(journeys) {
  const summary = getTouchDepthSummary(journeys);
  if (!summary.length) {
    renderEmptyPlot("chart-touch-depth", "No journey-depth data available for the current filters.");
    return;
  }

  plot(
    "chart-touch-depth",
    [
      {
        x: summary.map((row) => row.label),
        y: summary.map((row) => row.journeys),
        type: "bar",
        name: "Journeys",
        marker: { color: "rgba(20,33,61,0.18)" },
      },
      {
        x: summary.map((row) => row.label),
        y: summary.map((row) => row.transactionRate * 100),
        type: "scatter",
        mode: "lines+markers",
        name: "Transaction rate",
        marker: { color: "#0f766e", size: 9 },
        line: { color: "#0f766e", width: 3 },
        yaxis: "y2",
      },
    ],
    {
      xaxis: { title: "Touches in journey" },
      yaxis: { title: "Journeys", gridcolor: "rgba(67,80,100,0.10)" },
      yaxis2: {
        title: "Transaction rate (%)",
        overlaying: "y",
        side: "right",
        rangemode: "tozero",
      },
    }
  );
}

function questionForChannel(row, overall) {
  if (row.transactionPer100Sessions >= overall.transactionPer100 * 1.25 && row.cartToTransaction >= overall.cartToTransaction * 1.15) {
    return "If this channel stays efficient at higher spend, what saturates first: traffic quality, landing-page fit, or remarketing frequency?";
  }
  if (row.sessions >= 600 && row.shareGap < -0.02) {
    return "Why is this channel winning traffic but losing transaction share: weak query intent, weak offer fit, or poor landing-page continuity?";
  }
  if (row.lastTouch > row.firstTouch * 1.2) {
    return "What audience state makes this channel close so well, and can that sequence be replicated elsewhere?";
  }
  if (row.firstTouch > row.lastTouch * 1.2) {
    return "Which follow-up channels usually finish the job after this discovery touch brings people in?";
  }
  return "What incremental test would prove whether this channel deserves more budget or less attention?";
}

function renderPathTable(journeys) {
  const rows = getPathSummary(journeys).slice(0, 8);
  const tbody = document.getElementById("table-paths");
  setText("path-count-badge", `${fmt(rows.length)} rows`);
  if (!tbody) return;

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="6">No journey paths match the current filters.</td></tr>';
    return;
  }

  tbody.innerHTML = rows
    .map(
      (row) => `
        <tr>
          <td>${row.path}</td>
          <td>${fmt(row.journeys)}</td>
          <td>${fmt(row.cartIntents)}</td>
          <td>${fmt(row.transactions)}</td>
          <td>${pct(row.transactionRate, 1)}</td>
          <td>${row.medianDays === null ? "-" : `${fmt(row.medianDays, 0)} days`}</td>
        </tr>
      `
    )
    .join("");
}

function renderChannelTable(channelSummary) {
  const tbody = document.getElementById("table-channels");
  const totals = channelSummary.reduce(
    (accumulator, row) => {
      accumulator.sessions += row.sessions;
      accumulator.cartIntents += row.cartIntents;
      accumulator.linear += row.linear;
      return accumulator;
    },
    { sessions: 0, cartIntents: 0, linear: 0 }
  );
  const overall = {
    transactionPer100: totals.sessions ? (totals.linear / totals.sessions) * 100 : 0,
    cartToTransaction: totals.cartIntents ? totals.linear / totals.cartIntents : 0,
  };

  setText("channel-count-badge", `${fmt(channelSummary.length)} channels`);
  if (!tbody) return;

  if (!channelSummary.length) {
    tbody.innerHTML = '<tr><td colspan="7">No channels match the current filters.</td></tr>';
    return;
  }

  tbody.innerHTML = channelSummary
    .map((row) => `
      <tr>
        <td><span class="mono">${row.channel}</span></td>
        <td>${fmt(row.sessions)}</td>
        <td>${fmt(row.cartIntents)}</td>
        <td>${fmt(row.linear, 1)}</td>
        <td>${fmt(row.transactionPer100Sessions, 1)}</td>
        <td>${pct(row.cartToTransaction, 1)}</td>
        <td>${questionForChannel(row, overall)}</td>
      </tr>
    `)
    .join("");
}

function renderNotebookCards(summary, channelSummary, journeys) {
  const summaryNode = document.getElementById("insight-summary");
  const framingNode = document.getElementById("insight-framing");
  if (!summaryNode || !framingNode) return;

  const bestChannel = [...channelSummary].sort((a, b) => b.transactionPer100Sessions - a.transactionPer100Sessions)[0];
  const convertedJourneys = journeys.filter((row) => num(row.enrollment_equivalent_flag) === 1);
  const avgDays = mean(convertedJourneys.map((row) => num(row.days_to_enrollment)).filter((value) => value > 0));

  summaryNode.innerHTML = `<ul>
    <li>Open the notebook by loading the two CSVs and confirming row counts, date coverage, and field types first.</li>
    <li>Profile the current slice: ${fmt(summary.sessions)} sessions, ${fmt(summary.transactions)} transactions, and ${currency(summary.revenue, 0)} in modeled revenue.</li>
    <li>Check whether channel rankings change between raw traffic and attributed transactions before writing any recommendation.</li>
    <li>${bestChannel ? `${bestChannel.channel} currently leads on attributed transactions per 100 sessions.` : "No clear efficiency leader in the current slice."}</li>
    <li>${Number.isFinite(avgDays) && avgDays > 0 ? `Average time from first session to transaction is ${fmt(avgDays, 1)} days.` : "Not enough converted journeys for a stable time-to-transaction readout."}</li>
  </ul>`;

  framingNode.innerHTML = `<ul>
    <li><a href="google-analytics-marketing-exploration.ipynb" download>Download the Jupyter notebook template</a> and swap in an uploaded export if you have one.</li>
    <li>Notebook question set: what is in the data, how complete is it, which channels drive traffic, which channels drive transactions, and how much multi-touch behavior exists?</li>
    <li>The dashboard’s second tab is deliberately downstream of the notebook: answer only the questions the data can support.</li>
    <li>The local extract stays generic and marketing-focused; it is not framed as student-acquisition data.</li>
  </ul>`;
}

function renderAll() {
  syncFilters();
  const sessions = state.filteredSessions;
  const journeys = state.filteredJourneys;
  const channelSummary = getChannelSummary(sessions);
  const summary = getDatasetSummary(sessions, journeys, channelSummary);

  renderKPIs(summary);
  renderBrief(summary, channelSummary);
  renderDecisionStrip(channelSummary, journeys);
  renderWeeklyPerformance(sessions);
  renderChannelEfficiency(channelSummary);
  renderAttributionModels(channelSummary);
  renderRankShift(channelSummary);
  renderJourneyFlow(journeys);
  renderTouchDepth(journeys);
  renderPathTable(journeys);
  renderChannelTable(channelSummary);
  renderNotebookCards(summary, channelSummary, journeys);
}

function wireTabs() {
  document.querySelectorAll(".tab-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.tab;
      document.querySelectorAll(".tab-btn").forEach((node) => node.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach((node) => node.classList.remove("active"));
      button.classList.add("active");
      document.querySelector(`.tab-pane[data-tab="${tab}"]`).classList.add("active");
    });
  });
}

function wireControls() {
  document.getElementById("entry-channel-filter").addEventListener("change", renderAll);
  document.getElementById("device-filter").addEventListener("change", renderAll);
  document.getElementById("touch-filter").addEventListener("change", renderAll);
  document.getElementById("reset-filters-btn").addEventListener("click", () => {
    document.getElementById("entry-channel-filter").value = "";
    document.getElementById("device-filter").value = "";
    document.getElementById("touch-filter").value = "";
    renderAll();
  });
}

async function init() {
  try {
    if (!window.Plotly) throw new Error("Plotly did not load.");
    if (!window.Papa) throw new Error("PapaParse did not load.");

    const [sessions, journeys, metadata] = await Promise.all([
      fetchCSV("./data/session_events.csv"),
      fetchCSV("./data/journey_summary.csv"),
      fetchJSON("./data/metadata.json"),
    ]);

    state.allSessions = sessions;
    state.allJourneys = journeys;
    state.metadata = metadata;

    populateSelect(
      "entry-channel-filter",
      [...new Set(journeys.map((row) => row.first_touch_channel))].filter(Boolean),
      "All entry channels"
    );
    populateSelect(
      "device-filter",
      [...new Set(journeys.map((row) => row.primary_device))].filter(Boolean),
      "All primary devices"
    );
    populateSelect(
      "touch-filter",
      [...new Set(journeys.map((row) => row.touch_pattern))].filter(Boolean),
      "All touch patterns"
    );

    renderProvenance();
    wireTabs();
    wireControls();
    renderAll();
  } catch (error) {
    console.error("Dashboard init error:", error);
    alert(`Error loading marketing exercise dashboard: ${error.message}`);
  }
}

init();
