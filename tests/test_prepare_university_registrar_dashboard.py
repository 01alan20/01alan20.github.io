from __future__ import annotations

import importlib.util
from pathlib import Path
import unittest


MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "prepare_university_registrar_dashboard.py"
spec = importlib.util.spec_from_file_location("registrar_dashboard", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(module)


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


if __name__ == "__main__":
    unittest.main()
