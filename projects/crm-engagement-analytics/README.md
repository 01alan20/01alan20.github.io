# CRM / Engagement Analytics

Real churn data translated into an education retention and engagement frame.

## Local Data Files
- `data/telco_customer_churn_raw.csv`
- `data/student_crm_engagement_translated.csv`

## Intended Dashboard Tabs
- Executive Summary
- Attrition Risk
- Service Usage
- Billing and Commitment
- Profile Drilldown

## Source Note
Uses the IBM Telco Customer Churn dataset as a real engagement-retention analog. The translated file remaps the business fields into student-service language while preserving the underlying observations.

## Day-1 First-Year Risk Predictor
A Day-1 modeling pipeline is available to score students into three risk tiers for first-year dropout planning.

- Build script: `scripts/build_day1_risk_predictor.py`
- Input: `data/student_crm_engagement_translated.csv`
- Target (proxy): `actual_dropout_flag`
- Day-1 tiers:
  - `safe`: `< 40`
  - `moderate risk`: `40-69`
  - `high risk`: `>= 70`

### Generated Outputs
- `data/day1_risk_predictions.csv`
- `data/day1_risk_model_summary.json`
- `data/day1_risk_model.pkl`
- `data/day1_risk_feature_set.csv`

### Rebuild Command
```bash
python scripts/build_day1_risk_predictor.py
```
