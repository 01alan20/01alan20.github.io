from __future__ import annotations

import importlib.util
import json
from pathlib import Path
import re
import subprocess
import textwrap
import unittest


MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "prepare_university_registrar_dashboard.py"
PROJECT_DIR = Path(__file__).resolve().parents[1] / "projects" / "university-registrar-intelligence-dashboard"
DASHBOARD_JS_PATH = PROJECT_DIR / "dashboard.js"
spec = importlib.util.spec_from_file_location("registrar_dashboard", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(module)


def run_dashboard_js(expression: str):
    script = textwrap.dedent(
        f"""
        const fs = require("fs");
        const vm = require("vm");

        const source = fs.readFileSync({json.dumps(DASHBOARD_JS_PATH.as_posix())}, "utf8");
        const context = {{
          console,
          document: {{
            addEventListener: () => {{}},
            getElementById: () => null,
            querySelectorAll: () => [],
          }},
          window: {{}},
          Plotly: {{ react: () => {{}} }},
          Papa: {{ parse: () => ({{ data: [] }}) }},
          fetch: async () => {{
            throw new Error("fetch should not run during unit tests");
          }},
        }};
        context.globalThis = context;
        vm.createContext(context);
        vm.runInContext(source + "\\n;globalThis.__test_result = " + {json.dumps(expression)} + ";", context);
        process.stdout.write(JSON.stringify(context.__test_result));
        """
    )
    completed = subprocess.run(["node", "-e", script], capture_output=True, text=True, check=True)
    return json.loads(completed.stdout)


class RegistrarDashboardTests(unittest.TestCase):
    def test_compute_audit_status_off_track_for_major_and_gpa(self) -> None:
        record = {
            "credits_completed": 142,
            "expected_credits": 160,
            "upper_division_completed": 38,
            "required_completion_ratio": 0.74,
            "osu_gpa": 1.92,
            "residence_met_flag": 1,
            "core_met_flag": 1,
            "world_language_met_flag": 1,
            "professional_progression_met_flag": 1,
        }
        status, reason = module.compute_audit_status(record, "Business Administration", "Senior")
        self.assertEqual(status, "off_track")
        self.assertIn("GPA", reason)

    def test_generate_dashboard_exports_expected_files(self) -> None:
        paths = module.generate_dashboard(seed=20260406)
        expected = {"student_status.csv", "section_status.csv", "metadata.json"}
        self.assertTrue(expected.issubset({path.name for path in paths}))

    def test_generate_dashboard_outputs_expected_programs_and_statuses(self) -> None:
        module.generate_dashboard(seed=20260406)
        students = module.pd.read_csv(module.OUTPUT_DIR / "student_status.csv")
        self.assertEqual(
            sorted(students["program_name"].unique().tolist()),
            [
                "Business Administration",
                "Business Analytics",
                "Elementary Education",
                "Secondary Education",
            ],
        )
        self.assertTrue({"registered", "blocked", "not_registered"}.issubset(set(students["registration_status"])))
        self.assertTrue({"on_track", "near_risk", "off_track"}.issubset(set(students["audit_status"])))

    def test_generate_dashboard_matches_expected_senior_graduation_stage_mix(self) -> None:
        module.generate_dashboard(seed=20260406)
        students = module.pd.read_csv(module.OUTPUT_DIR / "student_status.csv")
        seniors = students[students["class_level"] == "Senior"]
        self.assertGreater(len(seniors), 0)

        distribution = {}
        for stage in ("not_eligible", "eligible_not_applied", "applied_pending", "ready_to_award"):
            count = int((seniors["graduation_stage"] == stage).sum())
            distribution[stage] = round((count / len(seniors)) * 100, 1)

        self.assertEqual(
            distribution,
            {
                "not_eligible": 4.8,
                "eligible_not_applied": 40.7,
                "applied_pending": 38.3,
                "ready_to_award": 15.1,
            },
        )

    def test_course_demand_markup_reflects_filters_counts_and_single_chart(self) -> None:
        html = (PROJECT_DIR / "index.html").read_text(encoding="utf-8")
        self.assertIn('id="course-major-filter"', html)
        self.assertIn('id="course-classification-filter"', html)
        self.assertIn('id="course-count-under-viability"', html)
        self.assertIn('id="course-count-stable"', html)
        self.assertIn('id="course-count-bottleneck"', html)
        self.assertIn('id="course-rollup-note"', html)
        self.assertNotIn('id="chart-waitlist-pressure"', html)
        self.assertNotRegex(html, re.compile(r"<th>\s*Risk\s*</th>", re.IGNORECASE))

    def test_action_queue_markup_uses_single_top_five_table(self) -> None:
        html = (PROJECT_DIR / "index.html").read_text(encoding="utf-8")
        self.assertIn('id="table-actions"', html)
        self.assertIn(">Type of Hold<", html)
        self.assertNotIn('id="queue-hold-stack"', html)
        self.assertNotIn('id="queue-audit-stack"', html)
        self.assertNotIn('id="queue-graduation-stack"', html)

    def test_build_course_demand_rows_rolls_up_by_program_and_course_code(self) -> None:
        rows = run_dashboard_js(
            """
            buildCourseDemandRows([
              {
                program_name: "Business Administration",
                course_code: "BA 101",
                course_title: "Intro Section A",
                capacity: 30,
                enrolled: 28,
                waitlist_count: 4
              },
              {
                program_name: "Business Administration",
                course_code: "BA 101",
                course_title: "Intro Section B",
                capacity: 24,
                enrolled: 24,
                waitlist_count: 2
              },
              {
                program_name: "Business Analytics",
                course_code: "BA 101",
                course_title: "Analytics Version",
                capacity: 20,
                enrolled: 18,
                waitlist_count: 0
              }
            ])
            """
        )

        self.assertEqual(len(rows), 2)
        ba_row = next(row for row in rows if row["program"] == "Business Administration")
        self.assertEqual(ba_row["capacity"], 54)
        self.assertEqual(ba_row["enrolled"], 52)
        self.assertEqual(ba_row["waitlist"], 6)

    def test_rollup_pressure_uses_only_overflow_above_total_capacity(self) -> None:
        rows = run_dashboard_js(
            """
            buildCourseDemandRows([
              {
                program_name: "Business Administration",
                course_code: "BA 101",
                course_title: "Intro A",
                capacity: 40,
                enrolled: 39,
                waitlist_count: 1
              },
              {
                program_name: "Business Administration",
                course_code: "BA 101",
                course_title: "Intro B",
                capacity: 41,
                enrolled: 41,
                waitlist_count: 0
              }
            ])
            """
        )
        self.assertEqual(len(rows), 1)
        row = rows[0]
        self.assertEqual(row["capacity"], 81)
        self.assertEqual(row["enrolled"], 80)
        self.assertEqual(row["waitlist"], 1)
        self.assertEqual(row["pressurePct"], 0)

    def test_seat_pressure_segment_starts_at_rollup_fill_not_fixed_100(self) -> None:
        js = (PROJECT_DIR / "dashboard.js").read_text(encoding="utf-8")
        self.assertIn("base: [...courseRows].reverse().map((row) => row.fillPct)", js)


if __name__ == "__main__":
    unittest.main()
