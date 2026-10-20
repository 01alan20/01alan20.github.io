"""Analytical invariants: reconciliation and honest survival feasibility."""
import unittest
from analysis import validate_story, survival_feasibility, normalise_company_profiles
import duckdb


class AnalysisTests(unittest.TestCase):
    def company_fixture(self, records):
        con = duckdb.connect()
        con.execute('CREATE TABLE emp_raw(cnpj_basico VARCHAR,natureza_juridica VARCHAR,capital_social VARCHAR,porte VARCHAR,capital DOUBLE)')
        con.executemany('INSERT INTO emp_raw VALUES (?,?,?,?,?)', records)
        return con

    def test_duplicate_placeholder_profile_does_not_double_count_entity(self):
        con = self.company_fixture([('00000001','0000','0,00',None,0),('00000001','4120','0,00','05',0)])
        quality = normalise_company_profiles(con)
        self.assertEqual(con.execute('SELECT cnpj_basico,natureza_juridica,porte,capital FROM emp').fetchall(), [('00000001','4120','05',0.0)])
        self.assertEqual(quality['duplicate_company_source_records'],1)
        self.assertEqual(quality['ambiguous_company_profile_keys'],0)

    def test_conflicting_reported_capital_is_not_arbitrarily_selected(self):
        con = self.company_fixture([('00000001','2135','0,00','01',0),('00000001','2135','100,00','01',100)])
        quality = normalise_company_profiles(con)
        self.assertIsNone(con.execute('SELECT capital FROM emp').fetchone()[0])
        self.assertEqual(quality['ambiguous_company_profile_keys'],1)

    def test_short_history_does_not_identify_five_year_survival(self):
        result = survival_feasibility('2023-05', '2026-10', horizon_years=5)
        self.assertFalse(result['identified'])
        self.assertEqual(result['observed_months'], 41)

    def test_dimension_mismatch_is_rejected(self):
        data = {'national': {'establishments': 100, 'active': 30},
                'states': [{'total': 99, 'active': 30}],
                'statuses': [{'count': 100}],
                'industries': [{'total': 100}], 'cohorts': [{'total': 100}]}
        with self.assertRaises(AssertionError):
            validate_story(data)

    def test_dimension_totals_and_active_bounds(self):
        data = {'national': {'establishments': 100, 'active': 30},
                'states': [{'total': 100, 'active': 30}],
                'statuses': [{'count': 100}],
                'industries': [{'total': 100}], 'cohorts': [{'total': 100}]}
        validate_story(data)
        data['states'][0]['active'] = 101
        with self.assertRaises(AssertionError):
            validate_story(data)


if __name__ == '__main__':
    unittest.main()
