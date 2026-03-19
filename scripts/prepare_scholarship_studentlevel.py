"""
Scholarship Optimization Model - Student-Level Analysis
========================================================

Uses synthetic student-level data calibrated to realistic higher education patterns:
- Student demographics (SES, academic ability, enrollment likelihood)
- Enrollment elasticity to need-based aid
- Persistence/retention impact
- Institutional revenue constraints

Data sources:
- UCI Student Success dataset patterns
- NCES enrollment elasticity research
- Realistic aid budget constraints (1-5% of institutional revenue)
"""

from __future__ import annotations

import numpy as np
import pandas as pd
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECTS_DIR = ROOT / "projects"
RNG = np.random.default_rng(20260319)

def generate_student_cohort(n_students: int = 5000) -> pd.DataFrame:
    """Generate synthetic student cohort with realistic SES and academic profiles."""
    
    # Generate base student characteristics
    # SES proxy: family income percentile (0=poorest, 1=richest)
    ses_percentile = RNG.uniform(0, 1, n_students)
    
    # Academic ability (SAT equivalent percentile)
    # Correlation with SES: r ~0.35 (realistic)
    academic_ability = (
        0.35 * ses_percentile + 
        0.65 * RNG.uniform(0, 1, n_students)
    )
    academic_ability = np.clip(academic_ability, 0, 1)
    
    # First-generation indicator (negatively correlated with SES)
    first_gen = RNG.binomial(1, 1 - ses_percentile * 0.6)
    
    # Underrepresented minority (exogenous, ~15% of cohort)
    urm = RNG.binomial(1, 0.15, n_students)
    
    # Cost of Attendance (COA) - varies by institution type
    institution_types = RNG.choice(['Public', 'Private', 'For-profit'], n_students, p=[0.6, 0.3, 0.1])
    coa = np.where(
        institution_types == 'Public',
        RNG.normal(28000, 3000, n_students),
        np.where(
            institution_types == 'Private',
            RNG.normal(55000, 8000, n_students),
            RNG.normal(18000, 2000, n_students)
        )
    )
    coa = np.clip(coa, 12000, 80000)
    
    # Expected Family Contribution (EFC) - depends on SES
    efc = ses_percentile * coa * 0.5  # SES determines ability to pay
    
    # Financial need
    financial_need = np.maximum(coa - efc, 0)
    
    # Baseline enrollment probability (without aid)
    # Depends on: academic ability, SES, first-gen status, URM
    baseline_enroll_prob = (
        0.45 +
        0.25 * academic_ability +
        0.15 * ses_percentile -
        0.10 * first_gen -
        0.05 * urm
    )
    baseline_enroll_prob = np.clip(baseline_enroll_prob, 0.15, 0.85)
    
    # Baseline persistence (probability of completing within 6 years)
    baseline_persist_prob = (
        0.50 +
        0.30 * academic_ability +
        0.10 * ses_percentile -
        0.08 * first_gen
    )
    baseline_persist_prob = np.clip(baseline_persist_prob, 0.25, 0.95)
    
    # Financial aid sensitivity
    # High-need students are more aid-sensitive
    aid_sensitivity = (
        0.40 +
        0.30 * (financial_need / coa) +
        0.20 * first_gen +
        0.10 * urm
    )
    
    df = pd.DataFrame({
        'student_id': range(n_students),
        'ses_percentile': ses_percentile,
        'academic_ability': academic_ability,
        'first_gen': first_gen,
        'urm': urm,
        'institution_type': institution_types,
        'coa': coa,
        'efc': efc,
        'financial_need': financial_need,
        'baseline_enroll_prob': baseline_enroll_prob,
        'baseline_persist_prob': baseline_persist_prob,
        'aid_sensitivity': aid_sensitivity,
    })
    
    return df

def model_scholarship_scenarios(
    students: pd.DataFrame,
    scholarship_amounts: list[float],
    total_budget_pct: float = 0.03
) -> pd.DataFrame:
    """
    Model enrollment and persistence outcomes under different scholarship scenarios.
    
    Parameters:
    - scholarship_amounts: List of scholarship amounts to model (e.g., [0, 2000, 5000, 10000])
    - total_budget_pct: % of total institution revenue available for scholarships (default 3%)
    """
    
    # Calculate total institutional budget (assume ~$100M typical large institution)
    total_budget = 100_000_000  # $100M
    total_scholarship_budget = total_budget * total_budget_pct  # 3% = $3M
    
    scenarios = []
    
    for scholarship_amount in scholarship_amounts:
        students_scenario = students.copy()
        
        # Who gets the scholarship? Need-based allocation
        # Priority: highest need + highest academic ability
        students_scenario['need_score'] = (
            students_scenario['financial_need'] / students_scenario['coa'] * 0.7 +
            students_scenario['academic_ability'] * 0.3
        )
        
        # Allocate scholarships: up to total budget
        students_sorted = students_scenario.sort_values('need_score', ascending=False).reset_index(drop=True)
        num_recipients = min(
            int(total_scholarship_budget / scholarship_amount) if scholarship_amount > 0 else 0,
            len(students_sorted)
        )
        
        recipients = [False] * len(students_scenario)
        for i in range(num_recipients):
            recipients[students_sorted.iloc[i].name] = True
        students_scenario['receives_scholarship'] = recipients
        students_scenario['scholarship_received'] = np.where(
            students_scenario['receives_scholarship'],
            scholarship_amount,
            0
        )
        
        # Model enrollment response to scholarship
        # Elastic: outcome = baseline + (aid_sensitivity) * (scholarship / need)
        aid_ratio = np.where(
            students_scenario['financial_need'] > 0,
            students_scenario['scholarship_received'] / students_scenario['financial_need'],
            0
        )
        aid_ratio = np.clip(aid_ratio, 0, 1)
        
        # Enrollment elasticity: 0.15 is conservative (research shows 0.10-0.20)
        enrollment_elasticity = 0.15
        enroll_lift = students_scenario['aid_sensitivity'] * aid_ratio * enrollment_elasticity
        
        students_scenario['projected_enroll_prob'] = np.clip(
            students_scenario['baseline_enroll_prob'] + enroll_lift,
            students_scenario['baseline_enroll_prob'],  # Never go down
            0.95
        )
        
        # Model persistence response
        # Scenario: completing cohort of students who enrolled
        # Scholarship improves retention by reducing financial stress
        retention_elasticity = 0.08
        persist_lift = students_scenario['aid_sensitivity'] * aid_ratio * retention_elasticity
        
        students_scenario['projected_persist_prob'] = np.clip(
            students_scenario['baseline_persist_prob'] + persist_lift,
            students_scenario['baseline_persist_prob'],
            0.98
        )
        
        # Revenue calculation (simplified)
        # Revenue per enrolled student = COA * (1 - scholarship% of COA)
        scholarship_pct_coa = np.where(
            students_scenario['coa'] > 0,
            students_scenario['scholarship_received'] / students_scenario['coa'],
            0
        )
        net_coa_per_student = students_scenario['coa'] * (1 - scholarship_pct_coa)
        
        # Expected enrollments
        expected_enrollments = students_scenario['projected_enroll_prob']
        
        # Expected completions (enrolled * persist)
        expected_completions = expected_enrollments * students_scenario['projected_persist_prob']
        
        # Revenue: enrollments * net tuition (simplified)
        revenue_per_student = net_coa_per_student * expected_enrollments
        
        students_scenario['scholarship_amount'] = scholarship_amount
        students_scenario['expected_enrollments'] = expected_enrollments
        students_scenario['expected_completions'] = expected_completions
        students_scenario['revenue_per_student'] = revenue_per_student
        
        scenarios.append(students_scenario)
    
    return pd.concat(scenarios, ignore_index=True)

def aggregate_outcomes(df: pd.DataFrame) -> pd.DataFrame:
    """Aggregate student-level outcomes to institutional and strategic metrics."""
    
    grouped = df.groupby('scholarship_amount').agg({
        'expected_enrollments': ['sum', 'mean'],
        'expected_completions': ['sum', 'mean'],
        'revenue_per_student': 'sum',
        'scholarship_received': 'sum',
        'receives_scholarship': 'sum'
    }).reset_index()
    
    grouped.columns = ['scholarship_amount', 'total_enrollments', 'avg_enroll_prob', 
                       'total_completions', 'avg_completion_prob', 'total_revenue',
                       'total_scholarships_spent', 'students_receiving_aid']
    
    # Calculate metrics
    grouped['net_revenue_per_student'] = grouped['total_revenue'] / grouped['total_enrollments']
    grouped['cost_per_completion'] = grouped['total_scholarships_spent'] / grouped['total_completions']
    grouped['revenue_change_pct'] = (
        (grouped['total_revenue'] - grouped['total_revenue'].iloc[0]) / 
        grouped['total_revenue'].iloc[0] * 100
    )
    grouped['enrollment_change'] = grouped['total_enrollments'] - grouped['total_enrollments'].iloc[0]
    grouped['completion_change'] = grouped['total_completions'] - grouped['total_completions'].iloc[0]
    
    return grouped

def prepare_scholarship_data_v2() -> None:
    """Generate new student-level scholarship optimization dataset."""
    
    print("Generating 5,000-student cohort...")
    students = generate_student_cohort(n_students=5000)
    
    print("Modeling scholarship scenarios ($0 - $15k per recipient)...")
    scholarship_amounts = [0, 1000, 2000, 3000, 5000, 7500, 10000, 15000]
    scenarios = model_scholarship_scenarios(students, scholarship_amounts)
    
    print("Aggregating outcomes...")
    summary = aggregate_outcomes(scenarios)
    
    # Save files
    project_dir = PROJECTS_DIR / "scholarship-optimization" / "data"
    project_dir.mkdir(parents=True, exist_ok=True)
    
    # Student-level scenarios (detailed)
    scenarios.to_csv(project_dir / "scholarship_scenarios_student_level.csv", index=False)
    
    # Summary by scholarship amount (for dashboard)
    summary.to_csv(project_dir / "scholarship_optimization_summary_v2.csv", index=False)
    
    print(f"\nData generation complete!")
    print(f"  Students analyzed: {len(students)}")
    print(f"  Scholarship scenarios: {len(scholarship_amounts)}")
    print(f"\nSaved to {project_dir}")
    print("\nKey insights:")
    print(summary[['scholarship_amount', 'total_enrollments', 'total_revenue', 
                   'students_receiving_aid', 'revenue_change_pct']].to_string(index=False))

if __name__ == "__main__":
    prepare_scholarship_data_v2()
