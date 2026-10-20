import unittest
from deepen import time_metrics

class TimeMetricsTests(unittest.TestCase):
    def test_risk_set_and_original_cohort_are_distinct(self):
        rows=time_metrics([{'age':0,'survival_pct':100},{'age':1,'survival_pct':80},{'age':2,'survival_pct':60}])
        self.assertAlmostEqual(rows[2]['annual_attrition_pct'],25)
        self.assertAlmostEqual(rows[2]['original_cohort_loss_pp'],20)
        self.assertAlmostEqual(rows[1]['conditional_to_horizon_pct'],75)
        self.assertEqual(rows[2]['conditional_to_horizon_pct'],100)
    def test_invalid_curve_rejected(self):
        with self.assertRaises(ValueError):
            time_metrics([{'age':0,'survival_pct':100},{'age':1,'survival_pct':105}])
    def test_zero_risk_set_is_undefined(self):
        rows=time_metrics([{'age':0,'survival_pct':100},{'age':1,'survival_pct':0},{'age':2,'survival_pct':0}])
        self.assertIsNone(rows[2]['annual_attrition_pct'])
        self.assertIsNone(rows[1]['conditional_to_horizon_pct'])

if __name__=='__main__': unittest.main()
