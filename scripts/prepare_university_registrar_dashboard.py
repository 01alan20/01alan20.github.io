from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "projects" / "university-registrar-intelligence-dashboard" / "data"
CURRENT_TERM = "2026 Winter"
N_STUDENTS = 10_400

CLASS_LEVELS = ["Freshman", "Sophomore", "Junior", "Senior"]
CLASS_LEVEL_WEIGHTS = np.array([0.24, 0.26, 0.25, 0.25], dtype=float)
CLASS_LEVEL_WEIGHTS = CLASS_LEVEL_WEIGHTS / CLASS_LEVEL_WEIGHTS.sum()
EXPECTED_CREDITS = {
    "Freshman": 36,
    "Sophomore": 84,
    "Junior": 132,
    "Senior": 174,
}
REQUIRED_RATIO_EXPECTATION = {
    "Freshman": 0.22,
    "Sophomore": 0.48,
    "Junior": 0.74,
    "Senior": 0.95,
}
UPPER_DIVISION_EXPECTATION = {
    "Freshman": 0,
    "Sophomore": 9,
    "Junior": 34,
    "Senior": 60,
}
PROFILES = {
    "strong": {"credit_shift": 8, "credit_sd": 7, "gpa_mean": 3.48, "gpa_sd": 0.22, "required_shift": 0.08},
    "steady": {"credit_shift": 0, "credit_sd": 8, "gpa_mean": 3.01, "gpa_sd": 0.24, "required_shift": 0.0},
    "risk": {"credit_shift": -14, "credit_sd": 10, "gpa_mean": 2.38, "gpa_sd": 0.32, "required_shift": -0.12},
}
PROFILE_WEIGHTS = np.array([0.35, 0.45, 0.20], dtype=float)
PROFILE_WEIGHTS = PROFILE_WEIGHTS / PROFILE_WEIGHTS.sum()

PROGRAMS = [
    {
        "program_id": "BUAD",
        "program_name": "Business Administration",
        "school": "Business",
        "weight": 0.34,
        "gpa_floor": 2.0,
        "professional_track": False,
        "source_url": "https://catalog.oregonstate.edu/college-departments/business/business-administration-ba-bs-hba-hbs/",
        "required_courses": [
            ("BA 101", "Introduction to Business"),
            ("ACTG 211", "Financial Accounting"),
            ("ACTG 213", "Managerial Accounting"),
            ("ECON 201", "Introduction to Microeconomics"),
            ("ECON 202", "Introduction to Macroeconomics"),
            ("BA 260", "Principles of Marketing"),
            ("BA 302", "Managing Organizations"),
            ("FIN 350", "Business Finance"),
            ("BIS 315", "Business Information Systems"),
            ("BA 390", "Business Career Success"),
            ("BA 497", "Business Strategy Capstone"),
        ],
        "electives": [
            ("BA 361", "Retail Management"),
            ("BA 364", "Supply Chain Analytics"),
            ("BA 469", "Brand Management"),
            ("BA 474", "Global Business"),
        ],
    },
    {
        "program_id": "BANA",
        "program_name": "Business Analytics",
        "school": "Business",
        "weight": 0.22,
        "gpa_floor": 2.0,
        "professional_track": False,
        "source_url": "https://catalog.oregonstate.edu/college-departments/business/business-analytics-bs-hbs/",
        "required_courses": [
            ("BA 230", "Business Analytics Foundations"),
            ("MTH 241", "Calculus for Management and Social Science"),
            ("ST 351", "Introduction to Statistical Methods"),
            ("BIS 315", "Business Information Systems"),
            ("BANA 350", "Data Visualization for Business"),
            ("BANA 360", "Predictive Modeling"),
            ("BANA 410", "Decision Analytics"),
            ("BANA 420", "Machine Learning for Business"),
            ("BA 390", "Business Career Success"),
            ("BA 497", "Analytics Strategy Capstone"),
        ],
        "electives": [
            ("BANA 365", "Operations Forecasting"),
            ("BANA 430", "Optimization for Managers"),
            ("BANA 440", "Customer Analytics"),
            ("BANA 450", "Applied Data Storytelling"),
        ],
    },
    {
        "program_id": "ELED",
        "program_name": "Elementary Education",
        "school": "Education",
        "weight": 0.24,
        "gpa_floor": 3.0,
        "professional_track": True,
        "source_url": "https://catalog.oregonstate.edu/college-departments/education/educational-practice-research/elementary-education-ba-bs-hba-hbs/",
        "required_courses": [
            ("ED 219", "Foundations of Teaching"),
            ("ED 253", "Human Development and Learning"),
            ("ED 309", "Inclusive Teaching Practice"),
            ("ED 311", "Teaching Reading and Language Arts"),
            ("ED 320", "Mathematics Methods"),
            ("ED 360", "Classroom Assessment"),
            ("ED 416", "Professional Level Practicum"),
            ("ED 446", "Elementary Literacy Practicum"),
            ("ED 450", "Student Teaching Seminar"),
            ("ED 483", "Student Teaching"),
        ],
        "electives": [
            ("ED 332", "Arts Integration"),
            ("ED 342", "Community Based Learning"),
            ("ED 372", "Science Methods"),
            ("ED 382", "Social Studies Methods"),
        ],
    },
    {
        "program_id": "SEED",
        "program_name": "Secondary Education",
        "school": "Education",
        "weight": 0.20,
        "gpa_floor": 3.0,
        "professional_track": True,
        "source_url": "https://catalog.oregonstate.edu/college-departments/education/educational-practice-research/secondary-education-ba-bs-hba-hbs/",
        "required_courses": [
            ("ED 219", "Foundations of Teaching"),
            ("ED 309", "Inclusive Teaching Practice"),
            ("ED 331", "Secondary Curriculum Design"),
            ("ED 352", "Classroom Management"),
            ("ED 410", "Professional Methods Seminar"),
            ("ED 412", "Assessment in Secondary Classrooms"),
            ("ED 416", "Professional Level Practicum"),
            ("ED 451", "Secondary Student Teaching Seminar"),
            ("ED 483", "Student Teaching"),
        ],
        "electives": [
            ("ED 334", "Adolescent Literacy"),
            ("ED 344", "Educational Technology"),
            ("ED 364", "Equity and Schooling"),
            ("ED 374", "Family and Community Engagement"),
        ],
    },
]

PROGRAM_LOOKUP = {program["program_name"]: program for program in PROGRAMS}
PROGRAM_WEIGHTS = np.array([program["weight"] for program in PROGRAMS], dtype=float)
PROGRAM_WEIGHTS = PROGRAM_WEIGHTS / PROGRAM_WEIGHTS.sum()

HOLD_TYPES = [
    {"hold_type": "Financial", "weight": 0.50, "block_probability": 0.82},
    {"hold_type": "Academic", "weight": 0.30, "block_probability": 0.68},
    {"hold_type": "Administrative", "weight": 0.20, "block_probability": 0.61},
]
HOLD_WEIGHTS = np.array([hold["weight"] for hold in HOLD_TYPES], dtype=float)
HOLD_WEIGHTS = HOLD_WEIGHTS / HOLD_WEIGHTS.sum()

MODALITIES = ["In Person", "Hybrid", "Online"]
TIME_SLOTS = ["Morning", "Midday", "Afternoon", "Evening"]


def clip(value: float, low: float, high: float) -> float:
    return float(np.clip(value, low, high))


def choose_program(rng: np.random.Generator) -> dict[str, object]:
    return PROGRAMS[int(rng.choice(len(PROGRAMS), p=PROGRAM_WEIGHTS))]


def choose_profile(rng: np.random.Generator) -> str:
    return str(rng.choice(["strong", "steady", "risk"], p=PROFILE_WEIGHTS))


def compute_audit_status(
    record: dict[str, float | int],
    program_name: str,
    class_level: str,
) -> tuple[str, str]:
    program = PROGRAM_LOOKUP[program_name]
    gpa_floor = float(program["gpa_floor"])
    credit_gap = float(record["expected_credits"]) - float(record["credits_completed"])
    expected_upper_division = float(
        record.get("expected_upper_division", UPPER_DIVISION_EXPECTATION.get(class_level, 0))
    )
    upper_gap = max(0.0, expected_upper_division - float(record["upper_division_completed"]))
    required_ratio = float(record["required_completion_ratio"])
    osu_gpa = float(record["osu_gpa"])
    residence_met = int(record["residence_met_flag"]) == 1
    core_met = int(record["core_met_flag"]) == 1
    world_language_met = int(record["world_language_met_flag"]) == 1
    professional_met = int(record["professional_progression_met_flag"]) == 1

    severe_reasons: list[str] = []
    warning_reasons: list[str] = []

    if osu_gpa < gpa_floor:
        severe_reasons.append(f"GPA below {gpa_floor:.1f} program floor")
    elif osu_gpa < gpa_floor + 0.2:
        warning_reasons.append("GPA near program floor")

    if credit_gap > 15:
        severe_reasons.append("Credit pace significantly behind term expectation")
    elif credit_gap > 6:
        warning_reasons.append("Credit pace behind term expectation")

    if class_level in {"Junior", "Senior"} and upper_gap > 9:
        severe_reasons.append("Upper-division progress materially behind")
    elif class_level in {"Junior", "Senior"} and upper_gap > 3:
        warning_reasons.append("Upper-division progress below plan")

    required_target = REQUIRED_RATIO_EXPECTATION.get(class_level, 0.50)
    required_gap = required_target - required_ratio
    if required_gap > 0.16:
        severe_reasons.append("Major requirements materially behind")
    elif required_gap > 0.08:
        warning_reasons.append("Major requirements behind plan")

    if class_level == "Senior" and not residence_met:
        severe_reasons.append("Residence requirement incomplete")
    elif class_level in {"Junior", "Senior"} and not residence_met:
        warning_reasons.append("Residence progress incomplete")

    if class_level == "Senior" and not core_met:
        severe_reasons.append("Core curriculum incomplete")
    elif class_level in {"Junior", "Senior"} and not core_met:
        warning_reasons.append("Core curriculum still open")

    if class_level == "Senior" and not world_language_met:
        severe_reasons.append("World language requirement incomplete")
    elif class_level == "Junior" and not world_language_met:
        warning_reasons.append("World language requirement still open")

    if bool(program["professional_track"]) and class_level in {"Junior", "Senior"} and not professional_met:
        severe_reasons.append("Professional progression requirements incomplete")

    if severe_reasons:
        return "off_track", severe_reasons[0]
    if warning_reasons:
        return "near_risk", warning_reasons[0]
    return "on_track", "Pace and policy checks satisfied"


def classify_reason(reason: str) -> str:
    if "GPA" in reason:
        return "GPA"
    if "Credit pace" in reason:
        return "Credits"
    if "Upper-division" in reason:
        return "Upper Division"
    if "Major requirements" in reason:
        return "Major Requirements"
    if "Residence" in reason:
        return "Residence"
    if "Core curriculum" in reason:
        return "Core Curriculum"
    if "World language" in reason:
        return "World Language"
    if "Professional progression" in reason:
        return "Professional Progression"
    return "General Review"


def determine_graduation_stage(
    rng: np.random.Generator,
    student: dict[str, object],
    program: dict[str, object],
) -> tuple[str, int]:
    if student["class_level"] != "Senior":
        return "not_in_window", 0

    eligible = int(
        float(student["credits_completed"]) >= 180
        and float(student["upper_division_completed"]) >= 60
        and float(student["required_completion_ratio"]) >= 0.995
        and float(student["osu_gpa"]) >= float(program["gpa_floor"])
        and int(student["residence_met_flag"]) == 1
        and int(student["core_met_flag"]) == 1
        and int(student["world_language_met_flag"]) == 1
        and int(student["professional_progression_met_flag"]) == 1
    )
    if not eligible:
        return "not_eligible", 0

    if rng.random() < 0.87:
        if rng.random() < 0.44:
            return "ready_to_award", 1
        return "applied_pending", 1
    return "eligible_not_applied", 1


def recommended_action(student: dict[str, object]) -> str:
    registration_status = str(student["registration_status"])
    hold_type = str(student["hold_type"])
    graduation_stage = str(student["graduation_stage"])
    audit_status = str(student["audit_status"])
    reason = str(student["audit_reason"])

    if graduation_stage == "eligible_not_applied":
        return "Send graduation application reminder and complete outreach follow-up."

    if registration_status == "blocked":
        if hold_type == "Financial":
            return "Resolve balance or payment-plan issue before registration release."
        if hold_type == "Academic":
            return "Schedule advisor review and clear the academic hold."
        return "Resolve missing records or administrative documentation."

    if audit_status == "off_track":
        if "Major requirements" in reason:
            return "Book degree-audit review and build a required-course recovery plan."
        if "GPA" in reason:
            return "Route to advising for academic recovery and eligibility review."
        return "Review audit exceptions and create a term-by-term completion plan."

    if audit_status == "near_risk":
        return "Monitor progress and confirm the next registration plan before census."

    return "No immediate intervention required."


def build_student_status(rng: np.random.Generator) -> pd.DataFrame:
    rows: list[dict[str, object]] = []

    for student_number in range(1, N_STUDENTS + 1):
        program = choose_program(rng)
        class_level = str(rng.choice(CLASS_LEVELS, p=CLASS_LEVEL_WEIGHTS))
        profile_name = choose_profile(rng)
        profile = PROFILES[profile_name]

        expected_credits = EXPECTED_CREDITS[class_level]
        expected_upper_division = UPPER_DIVISION_EXPECTATION[class_level]

        credits_completed = int(
            clip(
                rng.normal(expected_credits + profile["credit_shift"], profile["credit_sd"]),
                0,
                198,
            )
        )
        if class_level == "Senior":
            credits_completed = int(clip(rng.normal(174 + profile["credit_shift"], 10), 120, 196))

        upper_division_completed = int(
            clip(
                rng.normal(expected_upper_division + profile["credit_shift"] * 0.7, 6 if class_level != "Senior" else 8),
                0,
                84,
            )
        )
        if class_level in {"Freshman", "Sophomore"}:
            upper_division_completed = min(upper_division_completed, 24)

        base_ratio = {
            "Freshman": 0.22,
            "Sophomore": 0.48,
            "Junior": 0.74,
            "Senior": 0.95,
        }[class_level]
        required_completion_ratio = clip(
            rng.normal(base_ratio + profile["required_shift"], 0.07),
            0.08,
            1.0,
        )
        if class_level == "Senior":
            required_completion_ratio = clip(
                rng.normal(0.96 + profile["required_shift"], 0.06),
                0.50,
                1.0,
            )

        gpa_adjustment = 0.12 if program["school"] == "Education" else 0.0
        osu_gpa = clip(rng.normal(profile["gpa_mean"] + gpa_adjustment, profile["gpa_sd"]), 1.45, 4.0)

        residence_prob = {"Freshman": 0.98, "Sophomore": 0.96, "Junior": 0.90, "Senior": 0.85}[class_level]
        core_prob = {"Freshman": 0.42, "Sophomore": 0.66, "Junior": 0.84, "Senior": 0.91}[class_level]
        world_prob = {"Freshman": 0.38, "Sophomore": 0.58, "Junior": 0.79, "Senior": 0.88}[class_level]
        professional_prob = {"Freshman": 1.0, "Sophomore": 0.97, "Junior": 0.86, "Senior": 0.92}[class_level]

        profile_bonus = 0.08 if profile_name == "strong" else (-0.09 if profile_name == "risk" else 0.0)
        residence_met_flag = int(rng.random() < clip(residence_prob + profile_bonus, 0.45, 0.99))
        core_met_flag = int(rng.random() < clip(core_prob + profile_bonus, 0.25, 0.99))
        world_language_met_flag = int(rng.random() < clip(world_prob + profile_bonus, 0.20, 0.99))
        if bool(program["professional_track"]):
            professional_progression_met_flag = int(
                rng.random() < clip(professional_prob + profile_bonus, 0.50, 0.99)
            )
        else:
            professional_progression_met_flag = 1

        active_hold_flag = int(rng.random() < 0.145)
        hold_type = "None"
        if active_hold_flag:
            hold_choice = HOLD_TYPES[int(rng.choice(len(HOLD_TYPES), p=HOLD_WEIGHTS))]
            hold_type = str(hold_choice["hold_type"])
            blocked_probability = float(hold_choice["block_probability"])
        else:
            blocked_probability = 0.0

        if active_hold_flag and rng.random() < blocked_probability:
            registration_status = "blocked"
        elif rng.random() < 0.905:
            registration_status = "registered"
        else:
            registration_status = "not_registered"

        hold_status = "Active Hold" if active_hold_flag else "No Hold"
        continuing_flag = int(class_level != "Freshman")

        record = {
            "credits_completed": credits_completed,
            "expected_credits": expected_credits,
            "upper_division_completed": upper_division_completed,
            "expected_upper_division": expected_upper_division,
            "required_completion_ratio": required_completion_ratio,
            "osu_gpa": osu_gpa,
            "residence_met_flag": residence_met_flag,
            "core_met_flag": core_met_flag,
            "world_language_met_flag": world_language_met_flag,
            "professional_progression_met_flag": professional_progression_met_flag,
        }

        audit_status, audit_reason = compute_audit_status(record, str(program["program_name"]), class_level)
        graduation_stage, eligible_flag = determine_graduation_stage(
            rng,
            {
                **record,
                "class_level": class_level,
                "audit_status": audit_status,
            },
            program,
        )

        queue_name = "Monitor"
        queue_priority = 4
        if registration_status == "blocked":
            queue_name = "Hold Resolution"
            queue_priority = 1
        elif graduation_stage == "eligible_not_applied":
            queue_name = "Graduation Follow-Up"
            queue_priority = 1
        elif audit_status == "off_track":
            queue_name = "Degree Audit Intervention"
            queue_priority = 2
        elif audit_status == "near_risk":
            queue_name = "Watchlist"
            queue_priority = 3

        if queue_name == "Monitor":
            urgency = "Low"
        elif queue_priority == 1:
            urgency = "High"
        elif queue_priority == 2:
            urgency = "Medium"
        else:
            urgency = "Medium"

        issue_summary = (
            f"{hold_type} hold blocking registration"
            if registration_status == "blocked"
            else ("Eligible to graduate but application incomplete" if graduation_stage == "eligible_not_applied" else audit_reason)
        )

        rows.append(
            {
                "student_id": f"REG-{student_number:05d}",
                "term_name": CURRENT_TERM,
                "program_id": program["program_id"],
                "program_name": program["program_name"],
                "school": program["school"],
                "class_level": class_level,
                "student_profile": profile_name,
                "continuing_student_flag": continuing_flag,
                "hold_status": hold_status,
                "active_hold_flag": active_hold_flag,
                "hold_type": hold_type,
                "registration_status": registration_status,
                "credits_completed": credits_completed,
                "expected_credits": expected_credits,
                "upper_division_completed": upper_division_completed,
                "expected_upper_division": expected_upper_division,
                "required_completion_ratio": round(required_completion_ratio, 3),
                "osu_gpa": round(osu_gpa, 2),
                "residence_met_flag": residence_met_flag,
                "core_met_flag": core_met_flag,
                "world_language_met_flag": world_language_met_flag,
                "professional_progression_met_flag": professional_progression_met_flag,
                "audit_status": audit_status,
                "audit_reason": audit_reason,
                "audit_issue_group": classify_reason(audit_reason),
                "graduation_stage": graduation_stage,
                "eligible_flag": eligible_flag,
                "applied_flag": int(graduation_stage in {"applied_pending", "ready_to_award"}),
                "award_ready_flag": int(graduation_stage == "ready_to_award"),
                "queue_name": queue_name,
                "queue_priority": queue_priority,
                "urgency": urgency,
                "issue_summary": issue_summary,
                "recommended_action": recommended_action(
                    {
                        "registration_status": registration_status,
                        "hold_type": hold_type,
                        "graduation_stage": graduation_stage,
                        "audit_status": audit_status,
                        "audit_reason": audit_reason,
                    }
                ),
            }
        )

    return pd.DataFrame(rows)


def build_section_status(rng: np.random.Generator, students: pd.DataFrame) -> pd.DataFrame:
    rows: list[dict[str, object]] = []
    level_pool = {
        "Business Administration": ["Sophomore", "Junior", "Senior"],
        "Business Analytics": ["Sophomore", "Junior", "Senior"],
        "Elementary Education": ["Sophomore", "Junior", "Senior"],
        "Secondary Education": ["Sophomore", "Junior", "Senior"],
    }

    for program in PROGRAMS:
        bottleneck_codes = {program["required_courses"][1][0], program["required_courses"][-2][0], program["required_courses"][-1][0]}

        for course_index, (course_code, course_title) in enumerate(program["required_courses"]):
            sections_for_course = 2 if course_index < 2 or course_code.startswith("ED 4") or course_code.startswith("BA 4") else 1
            for section_number in range(1, sections_for_course + 1):
                capacity = int(rng.integers(28, 52))
                if course_code in bottleneck_codes:
                    demand_base = capacity * rng.uniform(1.04, 1.26)
                else:
                    demand_base = capacity * rng.uniform(0.84, 1.04)
                enrolled = int(min(capacity, round(demand_base)))
                waitlist_count = max(0, int(round(demand_base - capacity)))
                fill_rate = enrolled / capacity
                waitlist_pressure = waitlist_count / capacity
                if waitlist_count >= 5 or (fill_rate >= 0.98 and course_code in bottleneck_codes):
                    section_risk = "Bottleneck"
                elif fill_rate < 0.62:
                    section_risk = "Under Viability"
                else:
                    section_risk = "Stable"

                rows.append(
                    {
                        "section_id": f"{program['program_id']}-{course_code.replace(' ', '')}-{section_number:02d}",
                        "term_name": CURRENT_TERM,
                        "program_name": program["program_name"],
                        "school": program["school"],
                        "course_code": course_code,
                        "course_title": course_title,
                        "requirement_type": "Required",
                        "course_level_group": rng.choice(level_pool[program["program_name"]]),
                        "capacity": capacity,
                        "enrolled": enrolled,
                        "waitlist_count": waitlist_count,
                        "fill_rate": round(fill_rate, 3),
                        "waitlist_pressure": round(waitlist_pressure, 3),
                        "section_risk": section_risk,
                        "modality": rng.choice(MODALITIES, p=[0.62, 0.24, 0.14]),
                        "time_slot": rng.choice(TIME_SLOTS, p=[0.24, 0.35, 0.27, 0.14]),
                    }
                )

        for course_code, course_title in program["electives"]:
            capacity = int(rng.integers(24, 46))
            if rng.random() < 0.18:
                demand_base = capacity * rng.uniform(0.94, 1.08)
            else:
                demand_base = capacity * rng.uniform(0.44, 0.84)
            enrolled = int(min(capacity, round(demand_base)))
            waitlist_count = max(0, int(round(demand_base - capacity)))
            fill_rate = enrolled / capacity
            if fill_rate < 0.58:
                section_risk = "Under Viability"
            elif waitlist_count >= 4:
                section_risk = "Bottleneck"
            else:
                section_risk = "Stable"

            rows.append(
                {
                    "section_id": f"{program['program_id']}-{course_code.replace(' ', '')}-01",
                    "term_name": CURRENT_TERM,
                    "program_name": program["program_name"],
                    "school": program["school"],
                    "course_code": course_code,
                    "course_title": course_title,
                    "requirement_type": "Elective",
                    "course_level_group": rng.choice(level_pool[program["program_name"]]),
                    "capacity": capacity,
                    "enrolled": enrolled,
                    "waitlist_count": waitlist_count,
                    "fill_rate": round(fill_rate, 3),
                    "waitlist_pressure": round(waitlist_count / capacity, 3),
                    "section_risk": section_risk,
                    "modality": rng.choice(MODALITIES, p=[0.48, 0.28, 0.24]),
                    "time_slot": rng.choice(TIME_SLOTS, p=[0.18, 0.34, 0.31, 0.17]),
                }
            )

    return pd.DataFrame(rows)


def build_metadata(students: pd.DataFrame, sections: pd.DataFrame) -> dict[str, object]:
    blocked = int((students["registration_status"] == "blocked").sum())
    not_registered = int((students["registration_status"] == "not_registered").sum())
    off_track = int((students["audit_status"] == "off_track").sum())
    eligible_not_applied = int((students["graduation_stage"] == "eligible_not_applied").sum())

    return {
        "project_name": "University Registrar Intelligence Dashboard",
        "public_framing": "Generic public-university registrar operations dashboard",
        "current_term": CURRENT_TERM,
        "programs_modeled": [program["program_name"] for program in PROGRAMS],
        "official_source_basis": [
            {
                "label": "OSU Academic Regulations",
                "url": "https://catalog.oregonstate.edu/regulations/",
            },
            {
                "label": "OSU Business Administration Program",
                "url": PROGRAMS[0]["source_url"],
            },
            {
                "label": "OSU Business Analytics Program",
                "url": PROGRAMS[1]["source_url"],
            },
            {
                "label": "OSU Elementary Education Program",
                "url": PROGRAMS[2]["source_url"],
            },
            {
                "label": "OSU Secondary Education Program",
                "url": PROGRAMS[3]["source_url"],
            },
        ],
        "policy_rules_modeled": [
            "180 earned quarter credits",
            "60 upper-division credits",
            "36 credits in each major including 24 upper-division credits",
            "2.00 institutional GPA floor, with 3.0 modeled floor for education majors",
            "residence, core curriculum, and world language completion",
            "education-program professional progression readiness",
        ],
        "local_modeled_layer": [
            "synthetic student current-term status records",
            "rule-based registration blocker logic",
            "required-course seat pressure and waitlist modeling",
            "anonymized action queues for registrar triage",
        ],
        "caveat": (
            "The data files in this project are synthetic operational records generated from policy-aware rules. "
            "They are modeled from official Oregon State catalog and regulations sources but do not represent live institutional data."
        ),
        "headline_summary": (
            f"{blocked:,} students are blocked from registration, {off_track:,} are off track, "
            f"and {eligible_not_applied:,} seniors appear graduation-ready without an application."
        ),
        "quick_stats": {
            "students": int(len(students)),
            "sections": int(len(sections)),
            "blocked_students": blocked,
            "not_registered_students": not_registered,
            "off_track_students": off_track,
            "eligible_not_applied": eligible_not_applied,
        },
    }


def generate_dashboard(seed: int = 20260406) -> list[Path]:
    rng = np.random.default_rng(seed)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    students = build_student_status(rng)
    sections = build_section_status(rng, students)
    metadata = build_metadata(students, sections)

    student_path = OUTPUT_DIR / "student_status.csv"
    section_path = OUTPUT_DIR / "section_status.csv"
    metadata_path = OUTPUT_DIR / "metadata.json"

    students.to_csv(student_path, index=False)
    sections.to_csv(section_path, index=False)
    metadata_path.write_text(json.dumps(metadata, indent=2), encoding="utf-8")

    return [student_path, section_path, metadata_path]


def main() -> None:
    paths = generate_dashboard()
    students = pd.read_csv(OUTPUT_DIR / "student_status.csv")
    sections = pd.read_csv(OUTPUT_DIR / "section_status.csv")

    print(f"Wrote {len(paths)} files to {OUTPUT_DIR}")
    print(f"Students: {len(students):,}")
    print(f"Sections: {len(sections):,}")
    print(f"Blocked students: {(students['registration_status'] == 'blocked').sum():,}")
    print(f"Off-track students: {(students['audit_status'] == 'off_track').sum():,}")
    print(f"Eligible not applied: {(students['graduation_stage'] == 'eligible_not_applied').sum():,}")


if __name__ == "__main__":
    main()
