from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, precision_score, recall_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "projects" / "crm-engagement-analytics" / "data"
STANDALONE_DATA_DIR = ROOT / "projects" / "day1-first-year-dropout-risk" / "data"
INPUT_CSV = DATA_DIR / "student_crm_engagement_translated.csv"

OUTPUT_PREDICTIONS = DATA_DIR / "day1_risk_predictions.csv"
OUTPUT_SUMMARY = DATA_DIR / "day1_risk_model_summary.json"
OUTPUT_MODEL = DATA_DIR / "day1_risk_model.pkl"
OUTPUT_FEATURES = DATA_DIR / "day1_risk_feature_set.csv"
OUTPUT_SCORECARD = DATA_DIR / "day1_risk_scorecard.json"
STANDALONE_PREDICTIONS = STANDALONE_DATA_DIR / "day1_risk_predictions.csv"
STANDALONE_MODEL = STANDALONE_DATA_DIR / "day1_risk_model.pkl"
STANDALONE_FEATURES = STANDALONE_DATA_DIR / "day1_risk_feature_set.csv"
STANDALONE_SCORECARD = STANDALONE_DATA_DIR / "day1_risk_scorecard.json"
STANDALONE_SUMMARY = STANDALONE_DATA_DIR / "day1_risk_model_summary.json"

RISK_CUTOFFS = {
    "safe_max_exclusive": 40,
    "moderate_max_exclusive": 70,
}


DAY1_FEATURES = [
    "gender",
    "adult_learner_flag",
    "family_support_flag",
    "dependents_flag",
    "mobile_contactable_flag",
    "multi_channel_contact_flag",
    "digital_access_type",
    "enrollment_commitment_type",
    "digital_self_service_flag",
    "payment_plan_type",
    "monthly_student_bill",
]
TARGET_COLUMN = "actual_dropout_flag"
ID_COLUMN = "student_id"


@dataclass
class ModelEval:
    name: str
    auc: float
    pr_auc: float
    precision_high: float
    recall_high: float
    high_share: float

    def as_dict(self) -> Dict[str, float | str]:
        return {
            "name": self.name,
            "auc": self.auc,
            "pr_auc": self.pr_auc,
            "precision_high": self.precision_high,
            "recall_high": self.recall_high,
            "high_share": self.high_share,
        }


def risk_tier(score: float) -> str:
    if score < RISK_CUTOFFS["safe_max_exclusive"]:
        return "safe"
    if score < RISK_CUTOFFS["moderate_max_exclusive"]:
        return "moderate risk"
    return "high risk"


def load_data() -> pd.DataFrame:
    df = pd.read_csv(INPUT_CSV)
    df = df[df[ID_COLUMN].notna()].copy()
    df = df[~df[ID_COLUMN].astype(str).str.startswith("CRM-00000", na=False)].copy()
    return df


def prepare_features(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series]:
    work = df[[ID_COLUMN, TARGET_COLUMN] + DAY1_FEATURES].copy()

    binary_cols = [
        "adult_learner_flag",
        "family_support_flag",
        "dependents_flag",
        "mobile_contactable_flag",
        "multi_channel_contact_flag",
        "digital_self_service_flag",
    ]
    for col in binary_cols:
        work[col] = pd.to_numeric(work[col], errors="coerce")

    work["monthly_student_bill"] = pd.to_numeric(work["monthly_student_bill"], errors="coerce")
    work[TARGET_COLUMN] = pd.to_numeric(work[TARGET_COLUMN], errors="coerce")
    work = work[work[TARGET_COLUMN].isin([0, 1])].copy()
    work[TARGET_COLUMN] = work[TARGET_COLUMN].astype(int)

    x = work[DAY1_FEATURES].copy()
    y = work[TARGET_COLUMN].copy()
    return x, y


def build_preprocessor(x: pd.DataFrame) -> tuple[ColumnTransformer, List[str], List[str]]:
    categorical_cols = [c for c in DAY1_FEATURES if x[c].dtype == "object"]
    numeric_cols = [c for c in DAY1_FEATURES if c not in categorical_cols]

    categorical_pipe = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore")),
        ]
    )
    numeric_pipe = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scale", StandardScaler()),
        ]
    )
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", categorical_pipe, categorical_cols),
            ("num", numeric_pipe, numeric_cols),
        ]
    )
    return preprocessor, categorical_cols, numeric_cols


def evaluate_model(model: Pipeline, x_test: pd.DataFrame, y_test: pd.Series, name: str) -> ModelEval:
    probs = model.predict_proba(x_test)[:, 1]
    scores = probs * 100.0
    tiers = np.array([risk_tier(score) for score in scores])
    high_pred = tiers == "high risk"

    return ModelEval(
        name=name,
        auc=float(roc_auc_score(y_test, probs)),
        pr_auc=float(average_precision_score(y_test, probs)),
        precision_high=float(precision_score(y_test, high_pred, zero_division=0)),
        recall_high=float(recall_score(y_test, high_pred, zero_division=0)),
        high_share=float(high_pred.mean()),
    )


def choose_model(evals: List[ModelEval]) -> ModelEval:
    return sorted(
        evals,
        key=lambda row: (row.precision_high, row.pr_auc, row.auc),
        reverse=True,
    )[0]


def export_logistic_scorecard(x: pd.DataFrame, y: pd.Series) -> Dict[str, object]:
    preprocessor, categorical_cols, numeric_cols = build_preprocessor(x)
    logistic = Pipeline(
        steps=[
            ("prep", preprocessor),
            (
                "model",
                LogisticRegression(
                    max_iter=3000,
                    class_weight="balanced",
                    solver="lbfgs",
                ),
            ),
        ]
    )
    logistic.fit(x, y)

    fitted_pre = logistic.named_steps["prep"]
    fitted_model = logistic.named_steps["model"]
    cat_encoder = fitted_pre.named_transformers_["cat"].named_steps["onehot"]
    scaler = fitted_pre.named_transformers_["num"].named_steps["scale"]

    categorical = {}
    coef_index = 0
    for feature_name, categories in zip(categorical_cols, cat_encoder.categories_):
        weights = []
        for category in categories:
            weights.append(
                {
                    "category": str(category),
                    "weight": float(fitted_model.coef_[0][coef_index]),
                }
            )
            coef_index += 1
        categorical[feature_name] = weights

    numeric = []
    for feature_name, mean_value, scale_value in zip(numeric_cols, scaler.mean_, scaler.scale_):
        numeric.append(
            {
                "feature": feature_name,
                "mean": float(mean_value),
                "scale": float(scale_value) if float(scale_value) != 0 else 1.0,
                "weight": float(fitted_model.coef_[0][coef_index]),
            }
        )
        coef_index += 1

    scorecard = {
        "model_name": "logistic_regression",
        "intercept": float(fitted_model.intercept_[0]),
        "numeric_features": numeric,
        "categorical_features": categorical,
        "cutoffs": {
            "safe_max_exclusive": RISK_CUTOFFS["safe_max_exclusive"],
            "moderate_max_exclusive": RISK_CUTOFFS["moderate_max_exclusive"],
        },
        "target_description": "First-year dropout proxy based on historical dropout flag",
        "feature_set": DAY1_FEATURES,
    }
    return scorecard


def build_reason_codes(row: pd.Series, high_bill_threshold: float) -> list[str]:
    reasons: List[str] = []
    if row.get("enrollment_commitment_type") == "Open enrollment":
        reasons.append("open_enrollment")
    if row.get("payment_plan_type") == "Electronic check":
        reasons.append("payment_friction")
    if row.get("digital_access_type") == "Limited access":
        reasons.append("limited_digital_access")
    if pd.notna(row.get("family_support_flag")) and float(row.get("family_support_flag")) == 0:
        reasons.append("low_family_support")
    if pd.notna(row.get("dependents_flag")) and float(row.get("dependents_flag")) == 1:
        reasons.append("dependents_pressure")
    if pd.notna(row.get("monthly_student_bill")) and float(row.get("monthly_student_bill")) >= high_bill_threshold:
        reasons.append("higher_bill_burden")
    if pd.notna(row.get("multi_channel_contact_flag")) and float(row.get("multi_channel_contact_flag")) == 0:
        reasons.append("single_channel_contact")
    if pd.notna(row.get("mobile_contactable_flag")) and float(row.get("mobile_contactable_flag")) == 0:
        reasons.append("not_mobile_contactable")

    if not reasons:
        reasons.append("general_risk_pattern")
    return reasons[:3]


def main() -> None:
    df = load_data()
    x, y = prepare_features(df)

    x_train, x_test, y_train, y_test = train_test_split(
        x, y, test_size=0.25, random_state=42, stratify=y
    )

    preprocessor, _, _ = build_preprocessor(x_train)
    logistic = Pipeline(
        steps=[
            ("prep", preprocessor),
            (
                "model",
                LogisticRegression(
                    max_iter=3000,
                    class_weight="balanced",
                    solver="lbfgs",
                ),
            ),
        ]
    )

    forest = Pipeline(
        steps=[
            ("prep", preprocessor),
            (
                "model",
                RandomForestClassifier(
                    n_estimators=500,
                    min_samples_leaf=5,
                    random_state=42,
                    class_weight="balanced_subsample",
                    n_jobs=-1,
                ),
            ),
        ]
    )

    models = {"logistic_regression": logistic, "random_forest": forest}
    evals: List[ModelEval] = []
    fitted_models: Dict[str, Pipeline] = {}

    for name, model in models.items():
        model.fit(x_train, y_train)
        fitted_models[name] = model
        evals.append(evaluate_model(model, x_test, y_test, name))

    winner = choose_model(evals)
    best_model = fitted_models[winner.name]

    # Refit best model on the full Day-1 dataset for deployment scoring.
    best_model.fit(x, y)
    joblib.dump(best_model, OUTPUT_MODEL, compress=3)
    STANDALONE_DATA_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(best_model, STANDALONE_MODEL, compress=3)

    probs_all = best_model.predict_proba(x)[:, 1]
    scores_all = probs_all * 100.0
    tiers_all = [risk_tier(score) for score in scores_all]

    scored = df[[ID_COLUMN] + DAY1_FEATURES + [TARGET_COLUMN]].copy()
    scored[TARGET_COLUMN] = pd.to_numeric(scored[TARGET_COLUMN], errors="coerce").fillna(0).astype(int)
    scored["predicted_probability"] = probs_all
    scored["risk_score_day1"] = np.round(scores_all, 2)
    scored["risk_tier_day1"] = tiers_all

    bill_cut = float(scored["monthly_student_bill"].quantile(0.75))
    reason_data = scored.apply(lambda row: build_reason_codes(row, bill_cut), axis=1)
    scored["reason_code_1"] = reason_data.apply(lambda x: x[0] if len(x) > 0 else "")
    scored["reason_code_2"] = reason_data.apply(lambda x: x[1] if len(x) > 1 else "")
    scored["reason_code_3"] = reason_data.apply(lambda x: x[2] if len(x) > 2 else "")

    output_cols = [
        ID_COLUMN,
        TARGET_COLUMN,
        "predicted_probability",
        "risk_score_day1",
        "risk_tier_day1",
        "reason_code_1",
        "reason_code_2",
        "reason_code_3",
    ]
    scored[output_cols].to_csv(OUTPUT_PREDICTIONS, index=False)
    scored[output_cols].to_csv(STANDALONE_PREDICTIONS, index=False)

    feature_export = df[[ID_COLUMN] + DAY1_FEATURES + [TARGET_COLUMN]].copy()
    feature_export.to_csv(OUTPUT_FEATURES, index=False)
    feature_export.to_csv(STANDALONE_FEATURES, index=False)

    scorecard = export_logistic_scorecard(x, y)
    OUTPUT_SCORECARD.write_text(json.dumps(scorecard, indent=2), encoding="utf-8")
    STANDALONE_SCORECARD.write_text(json.dumps(scorecard, indent=2), encoding="utf-8")

    tier_counts = (
        scored["risk_tier_day1"]
        .value_counts(dropna=False)
        .rename_axis("tier")
        .reset_index(name="count")
        .to_dict(orient="records")
    )

    summary = {
        "modeling_objective": "Predict first-year dropout risk using Day-1-only features.",
        "assumption": "Dataset does not include explicit dropout timing; actual_dropout_flag is used as the first-year proxy label.",
        "cutoffs": {
            "safe": "<40",
            "moderate_risk": "40-69",
            "high_risk": ">=70",
        },
        "training_rows": int(len(x_train)),
        "test_rows": int(len(x_test)),
        "target_dropout_rate": float(y.mean()),
        "models_evaluated": [row.as_dict() for row in evals],
        "selected_model": winner.as_dict(),
        "tier_distribution_full_dataset": tier_counts,
        "features_used_day1": DAY1_FEATURES,
        "output_files": {
            "predictions": str(OUTPUT_PREDICTIONS.relative_to(ROOT)),
            "model": str(OUTPUT_MODEL.relative_to(ROOT)),
            "summary": str(OUTPUT_SUMMARY.relative_to(ROOT)),
            "feature_set": str(OUTPUT_FEATURES.relative_to(ROOT)),
            "scorecard": str(OUTPUT_SCORECARD.relative_to(ROOT)),
        },
    }

    OUTPUT_SUMMARY.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    standalone_summary = dict(summary)
    standalone_summary["output_files"] = {
        "predictions": str(STANDALONE_PREDICTIONS.relative_to(ROOT)),
        "model": str(STANDALONE_MODEL.relative_to(ROOT)),
        "summary": str(STANDALONE_SUMMARY.relative_to(ROOT)),
        "feature_set": str(STANDALONE_FEATURES.relative_to(ROOT)),
        "scorecard": str(STANDALONE_SCORECARD.relative_to(ROOT)),
    }
    STANDALONE_SUMMARY.write_text(json.dumps(standalone_summary, indent=2), encoding="utf-8")
    print(f"Built Day-1 risk predictor. Selected model: {winner.name}")
    print(f"Wrote: {OUTPUT_PREDICTIONS.name}, {OUTPUT_MODEL.name}, {OUTPUT_SUMMARY.name}, {OUTPUT_FEATURES.name}")


if __name__ == "__main__":
    main()
