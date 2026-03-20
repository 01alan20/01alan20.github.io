# Day-1 First-Year Dropout Risk Predictor

Standalone prescriptive risk scoring project for first-year dropout.

## What it does
- Scores a student on Day 1 using only enrollment-time inputs.
- Outputs a 0-100 risk score and three tiers:
  - `safe`
  - `moderate risk`
  - `high risk`
- Shows top positive risk drivers and top protective factors.
- Recommends an action path based on the current tier.

## Inputs
The browser scorer uses the exported Day-1 scorecard:
- gender
- adult learner flag
- family support flag
- dependents flag
- mobile contactability
- multi-channel contact
- digital access type
- enrollment commitment type
- digital self-service flag
- payment plan type
- monthly student bill

## Scoring logic
- Numeric features are standardized with the exported mean and scale.
- Categorical features use the exported per-category logistic weights.
- Probability is mapped to a 0-100 risk score.
- Thresholds:
  - safe: `< 40`
  - moderate risk: `40-69`
  - high risk: `>= 70`

## Data source
The scorecard is exported from the CRM analytics training set and written into this project's `data/` folder for standalone use.

## Notes
- This is a Day-1 scorecard only.
- It does not use any post-start engagement or billing behavior.
- It is intended for prescriptive use: online nudges for moderate risk, direct outreach for high risk.
