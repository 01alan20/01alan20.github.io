const SCORECARD_PATH = "data/day1_risk_scorecard.json";
const SUMMARY_PATH = "data/day1_risk_model_summary.json";

const FEATURE_LABELS = {
  gender: "Gender",
  adult_learner_flag: "Adult learner",
  family_support_flag: "Family support",
  dependents_flag: "Dependents",
  mobile_contactable_flag: "Mobile contactable",
  multi_channel_contact_flag: "Multi-channel contact",
  digital_self_service_flag: "Digital self-service",
  monthly_student_bill: "Monthly student bill",
  digital_access_type: "Digital access",
  enrollment_commitment_type: "Commitment type",
  payment_plan_type: "Payment plan",
};

const ACTIONS = {
  safe: {
    label: "safe",
    text: "Use light-touch digital nurture, automated reminders, and routine monitoring.",
  },
  "moderate risk": {
    label: "moderate risk",
    text: "Use online nudges plus advisor monitoring to reduce friction before it becomes persistence risk.",
  },
  "high risk": {
    label: "high risk",
    text: "Use direct outreach, an in-person advisor meeting, and a financial support check.",
  },
};

let scorecard = null;
let summary = null;

const elements = {
  form: document.querySelector(".panel-form"),
  riskScore: document.getElementById("risk-score"),
  riskTier: document.getElementById("risk-tier"),
  riskProbability: document.getElementById("risk-probability"),
  gaugeFill: document.getElementById("gauge-fill"),
  actionText: document.getElementById("action-text"),
  riskDrivers: document.getElementById("risk-drivers"),
  protectiveFactors: document.getElementById("protective-factors"),
  loadExample: document.getElementById("load-example"),
  metricAuc: document.getElementById("metric-auc"),
  metricPrecision: document.getElementById("metric-precision"),
  metricBaseRate: document.getElementById("metric-base-rate"),
  metricHighShare: document.getElementById("metric-high-share"),
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatPct(value, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`;
}

function formatPctFromScore(value) {
  return `${value.toFixed(1)}%`;
}

function formatNumber(value) {
  if (Number.isNaN(value) || value === null || value === undefined) {
    return "-";
  }
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(value);
}

function humanizeReason(feature) {
  return FEATURE_LABELS[feature] || feature.replace(/_/g, " ");
}

function riskTierFromScore(score) {
  if (score < scorecard.cutoffs.safe_max_exclusive) return "safe";
  if (score < scorecard.cutoffs.moderate_max_exclusive) return "moderate risk";
  return "high risk";
}

function getFieldValue(id) {
  const el = document.getElementById(id);
  if (!el) return null;
  if (el.type === "checkbox") return el.checked ? 1 : 0;
  if (el.type === "number") return Number.parseFloat(el.value);
  return el.value;
}

function setFieldValue(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  if (el.type === "checkbox") {
    el.checked = Boolean(value);
    return;
  }
  el.value = value;
}

function getInputs() {
  return {
    gender: getFieldValue("gender"),
    adult_learner_flag: getFieldValue("adult_learner_flag"),
    family_support_flag: getFieldValue("family_support_flag"),
    dependents_flag: getFieldValue("dependents_flag"),
    mobile_contactable_flag: getFieldValue("mobile_contactable_flag"),
    multi_channel_contact_flag: getFieldValue("multi_channel_contact_flag"),
    digital_access_type: getFieldValue("digital_access_type"),
    enrollment_commitment_type: getFieldValue("enrollment_commitment_type"),
    digital_self_service_flag: getFieldValue("digital_self_service_flag"),
    payment_plan_type: getFieldValue("payment_plan_type"),
    monthly_student_bill: getFieldValue("monthly_student_bill"),
  };
}

function scoreProfile(profile) {
  let logit = scorecard.intercept;
  const contributions = [];

  scorecard.numeric_features.forEach((feature) => {
    const raw = Number(profile[feature.feature]);
    const value = Number.isFinite(raw) ? raw : feature.mean;
    const standardized = (value - feature.mean) / (feature.scale || 1);
    const contribution = standardized * feature.weight;
    logit += contribution;
    contributions.push({
      feature: feature.feature,
      label: humanizeReason(feature.feature),
      value,
      contribution,
      kind: "numeric",
    });
  });

  Object.entries(scorecard.categorical_features).forEach(([feature, options]) => {
    const selected = profile[feature];
    const match = options.find((option) => option.category === selected);
    const contribution = match ? match.weight : 0;
    logit += contribution;
    contributions.push({
      feature,
      label: humanizeReason(feature),
      value: selected,
      contribution,
      kind: "categorical",
    });
  });

  const probability = 1 / (1 + Math.exp(-logit));
  const score = clamp(probability * 100, 0, 100);
  const tier = riskTierFromScore(score);

  return { probability, score, tier, contributions };
}

function formatContribution(value) {
  const signed = value >= 0 ? "+" : "";
  return `${signed}${value.toFixed(2)}`;
}

function renderList(el, items, emptyText) {
  if (!el) return;
  if (!items.length) {
    el.innerHTML = `<li class="empty-state">${emptyText}</li>`;
    return;
  }
  el.innerHTML = items
    .map(
      (item) => `
        <li class="insight-item">
          <div class="insight-name">${item.label}</div>
          <div class="insight-meta">${item.detail}</div>
        </li>`
    )
    .join("");
}

function renderSummaryMetrics() {
  if (!summary) return;
  const auc = summary.models_evaluated?.find((model) => model.name === summary.selected_model?.name)?.auc;
  const precision = summary.selected_model?.precision_high ?? summary.models_evaluated?.[0]?.precision_high;
  const dropoutRate = summary.target_dropout_rate ?? null;
  const highShare = summary.selected_model?.high_share ?? null;

  if (elements.metricAuc) elements.metricAuc.textContent = auc !== undefined ? auc.toFixed(3) : "-";
  if (elements.metricPrecision) {
    elements.metricPrecision.textContent = precision !== undefined ? formatPct(precision, 1) : "-";
  }
  if (elements.metricBaseRate) {
    elements.metricBaseRate.textContent = dropoutRate !== null ? formatPct(dropoutRate, 1) : "-";
  }
  if (elements.metricHighShare) {
    elements.metricHighShare.textContent = highShare !== null ? formatPct(highShare, 1) : "-";
  }
}

function renderScore(result) {
  elements.riskScore.textContent = formatPctFromScore(result.score);
  elements.riskTier.textContent = result.tier;
  elements.riskTier.dataset.tier = result.tier.replace(/\s+/g, "-");
  elements.riskProbability.textContent = `${formatPct(result.probability, 1)} predicted first-year dropout probability`;
  elements.gaugeFill.style.width = `${result.score}%`;
  elements.gaugeFill.dataset.tier = result.tier.replace(/\s+/g, "-");
  const action = ACTIONS[result.tier] || ACTIONS.safe;
  elements.actionText.textContent = action.text;
}

function renderContributions(result) {
  const positives = result.contributions
    .filter((item) => item.contribution > 0)
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 3);
  const negatives = result.contributions
    .filter((item) => item.contribution < 0)
    .sort((a, b) => a.contribution - b.contribution)
    .slice(0, 3);

  renderList(
    elements.riskDrivers,
    positives.map((item) => ({
      label: item.label,
      detail: `${formatContribution(item.contribution)} log-odds impact`,
    })),
    "No positive risk drivers surfaced from the current profile."
  );

  renderList(
    elements.protectiveFactors,
    negatives.map((item) => ({
      label: item.label,
      detail: `${formatContribution(item.contribution)} log-odds impact`,
    })),
    "No protective factors surfaced from the current profile."
  );
}

function scoreAndRender() {
  if (!scorecard) return;
  const profile = getInputs();
  const result = scoreProfile(profile);
  renderScore(result);
  renderContributions(result);
}

function attachListeners() {
  const inputs = document.querySelectorAll("select, input");
  inputs.forEach((input) => {
    input.addEventListener("change", scoreAndRender);
    input.addEventListener("input", scoreAndRender);
  });

  elements.loadExample?.addEventListener("click", () => {
    setFieldValue("gender", "Female");
    setFieldValue("digital_access_type", "Limited access");
    setFieldValue("enrollment_commitment_type", "Open enrollment");
    setFieldValue("payment_plan_type", "Electronic check");
    setFieldValue("monthly_student_bill", 95);
    setFieldValue("adult_learner_flag", true);
    setFieldValue("family_support_flag", false);
    setFieldValue("dependents_flag", true);
    setFieldValue("mobile_contactable_flag", false);
    setFieldValue("multi_channel_contact_flag", false);
    setFieldValue("digital_self_service_flag", false);
    scoreAndRender();
  });
}

async function init() {
  try {
    const [scorecardResponse, summaryResponse] = await Promise.all([
      fetch(SCORECARD_PATH, { cache: "no-store" }),
      fetch(SUMMARY_PATH, { cache: "no-store" }),
    ]);

    if (!scorecardResponse.ok) {
      throw new Error(`Failed to load scorecard: ${scorecardResponse.status}`);
    }
    if (!summaryResponse.ok) {
      throw new Error(`Failed to load summary: ${summaryResponse.status}`);
    }

    scorecard = await scorecardResponse.json();
    summary = await summaryResponse.json();

    renderSummaryMetrics();
    attachListeners();
    scoreAndRender();
  } catch (error) {
    console.error(error);
    const fallback = document.querySelector(".page-shell");
    if (fallback) {
      fallback.insertAdjacentHTML(
        "afterbegin",
        `<section class="error-banner">Dashboard failed to load scoring data. ${error.message}</section>`
      );
    }
  }
}

init();
