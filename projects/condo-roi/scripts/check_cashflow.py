#!/usr/bin/env python3
"""Reproduce the condo dashboard cash-flow screen in the terminal.

Run from the condo-roi project root:
    python scripts/check_cashflow.py

Examples:
    python scripts/check_cashflow.py --min-yield 4
    python scripts/check_cashflow.py --down-payment 35
    python scripts/check_cashflow.py --interest-rate 2.8 --fixed-costs 450
    python scripts/check_cashflow.py --sensitivity
"""
from __future__ import annotations

import argparse
import json
import math
import statistics
from pathlib import Path
from typing import Any


EVIDENCE_RANK = {
    "High": 6,
    "Medium": 5,
    "Strong history": 4,
    "Moderate history": 3,
    "Thin history": 2,
    "Low": 1,
    "Incomplete": 0,
}


def finite(value: Any) -> bool:
    return isinstance(value, (int, float)) and math.isfinite(value)


def median(values: list[float]) -> float | None:
    valid = sorted(value for value in values if finite(value))
    if not valid:
        return None
    middle = len(valid) // 2
    if len(valid) % 2:
        return valid[middle]
    return (valid[middle - 1] + valid[middle]) / 2


def money(value: float | None) -> str:
    if value is None or not finite(value):
        return "—"
    sign = "-" if value < 0 else ""
    return f"{sign}S${abs(value):,.0f}"


def pct(value: float | None) -> str:
    if value is None or not finite(value):
        return "—"
    return f"{value:.2f}%"


def mortgage_payment(principal: float, annual_rate_pct: float, years: int) -> float:
    if principal <= 0:
        return 0.0
    months = years * 12
    monthly_rate = annual_rate_pct / 100 / 12
    if monthly_rate == 0:
        return principal / months
    growth = (1 + monthly_rate) ** months
    return principal * monthly_rate * growth / (growth - 1)


def load_dashboard_data(path: Path) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    text = path.read_text(encoding="utf-8")
    marker = "window.CONDO_DATA="
    if not text.startswith(marker):
        raise RuntimeError(f"{path} does not start with {marker!r}")
    payload = text[len(marker):].strip()
    if payload.endswith(";"):
        payload = payload[:-1]
    data = json.loads(payload)
    schema = data["schema"]
    records = [dict(zip(schema, row)) for row in data["records"]]
    return data, records


def model_record(record: dict[str, Any], args: argparse.Namespace) -> dict[str, Any] | None:
    price = record.get("latestBuy")
    rent = record.get("latestRent")
    gross_yield = record.get("grossYield")

    if not all(finite(value) for value in (price, rent, gross_yield)):
        return None
    if price > args.max_price or gross_yield < args.min_yield:
        return None

    if args.reliable_only:
        if EVIDENCE_RANK.get(record.get("evidenceGrade"), 0) < 3:
            return None

    down_fraction = max(0.0, min(100.0, args.down_payment)) / 100
    loan = price * (1 - down_fraction)
    mortgage = mortgage_payment(loan, max(0.0, args.interest_rate), max(1, args.loan_years))

    vacancy = max(0.0, min(12.0, args.vacancy_months))
    collected_annual = rent * (12 - vacancy)
    variable_fraction = max(0.0, min(100.0, args.variable_costs)) / 100
    fixed_annual = max(0.0, args.fixed_costs) * 12

    operating_annual = collected_annual * (1 - variable_fraction) - fixed_annual
    annual_cash = operating_annual - mortgage * 12

    break_even_rent = (
        mortgage * 12 + fixed_annual
    ) / max(0.01, (12 - vacancy) * (1 - variable_fraction))
    break_even_yield = break_even_rent * 12 / price * 100

    return {
        **record,
        "mortgage": mortgage,
        "monthlyCash": annual_cash / 12,
        "breakEvenRent": break_even_rent,
        "breakEvenYield": break_even_yield,
    }


def calculate(records: list[dict[str, Any]], args: argparse.Namespace) -> list[dict[str, Any]]:
    output = []
    for record in records:
        result = model_record(record, args)
        if result is not None:
            output.append(result)
    return output


def print_summary(models: list[dict[str, Any]], args: argparse.Namespace) -> None:
    negative = [item for item in models if item["monthlyCash"] < 0]
    positive = [item for item in models if item["monthlyCash"] >= 0]

    print()
    print("CASH-FLOW SCREEN")
    print("=" * 72)
    print(f"Minimum gross yield:      {args.min_yield:.2f}%")
    print(f"Maximum purchase price:   {money(args.max_price)}")
    print(f"Down payment:             {args.down_payment:.1f}%")
    print(f"Mortgage rate:            {args.interest_rate:.2f}%")
    print(f"Loan term:                {args.loan_years} years")
    print(f"Vacancy allowance:        {args.vacancy_months:.1f} months/year")
    print(f"Fixed operating costs:    {money(args.fixed_costs)}/month")
    print(f"Variable reserve:         {args.variable_costs:.1f}% of collected rent")
    print(f"Reliable evidence only:   {'Yes' if args.reliable_only else 'No'}")
    print("-" * 72)

    print(f"Qualified records:        {len(models):,}")
    print(f"Negative cash flow:       {len(negative):,}")
    print(f"Non-negative cash flow:   {len(positive):,}")
    share = len(negative) / len(models) * 100 if models else 0
    print(f"Negative share:           {share:.1f}%")
    print(f"Median monthly cash flow: {money(median([x['monthlyCash'] for x in models]))}")
    print(f"Median negative shortfall:{money(median([x['monthlyCash'] for x in negative]))}")
    print(f"Median break-even yield:  {pct(median([x['breakEvenYield'] for x in models]))}")

    if models:
        best = max(models, key=lambda x: x["monthlyCash"])
        highest_yield = max(models, key=lambda x: x["grossYield"])
        print(f"Best monthly cash flow:   {money(best['monthlyCash'])} — {best['project']}")
        print(
            f"Highest observed yield:   {pct(highest_yield['grossYield'])} — "
            f"{highest_yield['project']}"
        )

    print()
    print("CLOSEST TO BREAK-EVEN")
    print("-" * 72)
    ranked = sorted(models, key=lambda x: x["monthlyCash"], reverse=True)[: args.top]
    if not ranked:
        print("No records meet the filters.")
        return

    print(
        f"{'Project':32} {'Area':>10} {'Yield':>8} {'Rent':>10} "
        f"{'Mortgage':>11} {'Cash/mo':>11} {'BE yield':>9}"
    )
    print("-" * 100)
    for item in ranked:
        project = str(item.get("project", ""))[:32]
        area = str(item.get("area", ""))[:10]
        print(
            f"{project:32} {area:>10} {pct(item['grossYield']):>8} "
            f"{money(item['latestRent']):>10} {money(item['mortgage']):>11} "
            f"{money(item['monthlyCash']):>11} {pct(item['breakEvenYield']):>9}"
        )


def print_sensitivity(records: list[dict[str, Any]], args: argparse.Namespace) -> None:
    print()
    print("SENSITIVITY")
    print("=" * 72)
    print(
        f"{'Down':>7} {'Rate':>7} {'Qualified':>10} {'Positive':>10} "
        f"{'Negative':>10} {'Median CF/mo':>14} {'Median BE':>11}"
    )
    print("-" * 82)

    for down in (25, 35, 50, 75, 100):
        for rate in (2.5, 3.5, 4.5):
            local = argparse.Namespace(**vars(args))
            local.down_payment = down
            local.interest_rate = rate
            models = calculate(records, local)
            positive = sum(item["monthlyCash"] >= 0 for item in models)
            negative = len(models) - positive
            med_cf = median([item["monthlyCash"] for item in models])
            med_be = median([item["breakEvenYield"] for item in models])
            print(
                f"{down:6.0f}% {rate:6.1f}% {len(models):10,} {positive:10,} "
                f"{negative:10,} {money(med_cf):>14} {pct(med_be):>11}"
            )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--data",
        type=Path,
        default=Path("data/dashboard_data.js"),
        help="Path to dashboard_data.js",
    )
    parser.add_argument("--min-yield", type=float, default=4.0)
    parser.add_argument("--max-price", type=float, default=2_500_000)
    parser.add_argument("--down-payment", type=float, default=25.0)
    parser.add_argument("--interest-rate", type=float, default=3.5)
    parser.add_argument("--loan-years", type=int, default=25)
    parser.add_argument("--vacancy-months", type=float, default=1.0)
    parser.add_argument("--fixed-costs", type=float, default=600.0)
    parser.add_argument("--variable-costs", type=float, default=5.0)
    parser.add_argument("--reliable-only", action=argparse.BooleanOptionalAction, default=True)
    parser.add_argument("--top", type=int, default=15)
    parser.add_argument("--sensitivity", action="store_true")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    data, records = load_dashboard_data(args.data)
    print(
        f"Loaded {len(records):,} records from {args.data} "
        f"(generated {data.get('meta', {}).get('generated', 'unknown')})."
    )
    models = calculate(records, args)
    print_summary(models, args)
    if args.sensitivity:
        print_sensitivity(records, args)


if __name__ == "__main__":
    main()
