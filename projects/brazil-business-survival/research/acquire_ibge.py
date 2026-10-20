"""Download official IBGE 2022 originals and extract published survival tables.
Run from any directory: python acquire_ibge.py. Requires openpyxl, pymupdf.
No estimated counts, model fitting, or inferential intervals are produced.
"""
from pathlib import Path
import datetime, hashlib, json, urllib.request
import openpyxl

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "ibge"
RESEARCH = ROOT / "research"
BASE = "https://ftp.ibge.gov.br/Demografia_das_Empresas_e_Estatisticas_de_Empreendedorismo/2022/"
PDF = "https://www.ibge.gov.br/biblioteca/visualizacao/livros/liv102143.pdf"
PORTAL = "https://www.ibge.gov.br/estatisticas/economicas/servicos/22649-demografia-das-empresas-e-estatisticas-de-empreendedorismo.html"

def acquire(url, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    data = urllib.request.urlopen(url, timeout=60).read()
    path.write_bytes(data)
    return {"url": url, "local_path": str(path.relative_to(ROOT)).replace("\\", "/"), "sha256": hashlib.sha256(data).hexdigest(), "bytes": len(data)}

def number(v):
    # IBGE publication conventions: dash is an exact zero, x is suppressed.
    if v == "-": return 0
    if v in (None, "x", "..", "..."): return None
    if not isinstance(v, (int, float)): raise ValueError(repr(v))
    return v

def series(values):
    return [{"age": i + 1, "year": 2018 + i, "survival_pct": number(v), "published_value": v} for i, v in enumerate(values)]

def record(row, table, source_row, birth_col, rate_col, **extra):
    return {**extra, "cohort_year": 2017, "births": number(row[birth_col]), "births_published_value": row[birth_col], "five_year_survival_pct": number(row[rate_col+4]), "curve": series(row[rate_col:rate_col+5]), "source_table": table, "source_row": source_row}

def main():
    sources = [acquire(BASE + "xlsx/" + f, OUT / f) for f in ("Tabela_2_1.xlsx", "Tabela_2_2.xlsx")]
    sources.append(acquire(PDF, RESEARCH / "liv102143.pdf"))
    import pymupdf
    doc = pymupdf.open(RESEARCH / "liv102143.pdf")
    (RESEARCH / "liv102143.txt").write_text("\n".join(p.get_text() for p in doc), encoding="utf-8")
    t1 = openpyxl.load_workbook(OUT / "Tabela_2_1.xlsx", data_only=True).active
    t2 = openpyxl.load_workbook(OUT / "Tabela_2_2.xlsx", data_only=True).active
    enterprise = lambda n, **kw: record([c.value for c in t1[n]], "2.1", n, 1, 2, population="employer_enterprises", geography="Brasil", **kw)
    national = enterprise(7, label="Total")
    sizes = [enterprise(i, label=t1.cell(i,1).value.strip()) for i in range(9,12)]
    sectors = [enterprise(i, label=t1.cell(i,1).value.strip(), section=t1.cell(i,1).value[0]) for i in range(13,33)]
    regions = {"Norte", "Nordeste", "Sudeste", "Sul", "Centro-Oeste"}
    local_records = []
    region = None
    for n in range(6,699):
        row = [c.value for c in t2[n]]
        if not row[0] or not row[1]: continue
        geo, label = row[0].strip(), row[1].strip()
        level = "country" if geo == "Brasil" else "region" if geo in regions else "state"
        if level == "region": region = geo
        local_records.append(record(row, "2.2", n, 2, 3, population="employer_local_units", geography=geo, geography_level=level, region=region if level == "state" else None, label=label, section=None if label == "Total" else label[0]))
    local_national = next(r for r in local_records if r["geography"] == "Brasil" and r["label"] == "Total")
    states = [r for r in local_records if r["geography_level"] == "state" and r["label"] == "Total"]
    state_codes = "RO AC AM RR PA AP TO MA PI CE RN PB PE AL SE BA MG ES RJ SP PR SC RS MS MT GO DF".split()
    assert len(state_codes) == len(states)
    uf_by_name = {r["geography"]: uf for r, uf in zip(states, state_codes)}
    for r in local_records:
        if r["geography_level"] == "state":
            r.update(uf=uf_by_name[r["geography"]], name=r["geography"])
    region_totals = [r for r in local_records if r["geography_level"] == "region" and r["label"] == "Total"]
    national_sectors = {r["section"]: r for r in local_records if r["geography"] == "Brasil" and r["section"] and r["births"] > 0}
    state_sectors = {r["uf"]: {q["section"]: q for q in local_records if q.get("uf") == r["uf"] and q["section"]} for r in states}
    def standardise(min_births):
        included = [s for s in national_sectors if all(state_sectors[r["uf"]][s]["births"] >= min_births and state_sectors[r["uf"]][s]["five_year_survival_pct"] is not None for r in states)]
        denominator = sum(national_sectors[s]["births"] for s in included)
        assert denominator > 0
        weights = {s: national_sectors[s]["births"] / denominator for s in included}
        national_common = sum(weights[s] * national_sectors[s]["five_year_survival_pct"] for s in included)
        rows = []
        for r in states:
            cells = state_sectors[r["uf"]]
            n_common = sum(cells[s]["births"] for s in included)
            standardised = sum(weights[s] * cells[s]["five_year_survival_pct"] for s in included)
            raw_common = sum(cells[s]["births"] * cells[s]["five_year_survival_pct"] for s in included) / n_common
            rows.append({"uf": r["uf"], "name": r["name"], "population": "employer_local_units", "cohort_year": 2017, "observation_year": 2022,
                         "raw_full_five_year_pct": r["five_year_survival_pct"], "raw_common_five_year_pct": raw_common,
                         "standardised_five_year_pct": standardised, "difference_from_national_common_pp": standardised-national_common,
                         "composition_shift_pp": standardised-raw_common, "full_births": r["births"], "common_births": n_common,
                         "state_cohort_coverage_pct": 100*n_common/r["births"], "min_included_sector_births": min(cells[s]["births"] for s in included),
                         "included_sections": included, "excluded_sections": [s for s in national_sectors if s not in included],
                         "sector_support": [{"section": s, "births": cells[s]["births"], "five_year_survival_pct": cells[s]["five_year_survival_pct"], "national_weight_pct": 100*weights[s], "source_row": cells[s]["source_row"]} for s in included]})
        rank = {r["uf"]: i+1 for i,r in enumerate(sorted(rows,key=lambda x:x["standardised_five_year_pct"],reverse=True))}
        raw_rank = {r["uf"]: i+1 for i,r in enumerate(sorted(rows,key=lambda x:x["raw_common_five_year_pct"],reverse=True))}
        for r in rows:
            r.update(standardised_rank=rank[r["uf"]], raw_common_rank=raw_rank[r["uf"]], rank_change_vs_raw_common=raw_rank[r["uf"]]-rank[r["uf"]])
        return {"minimum_births_in_every_state_sector": min_births, "included_sections": included,
                "excluded_positive_national_sections": [s for s in national_sectors if s not in included],
                "national_common_births": denominator, "national_total_births": local_national["births"],
                "national_cohort_coverage_pct": 100*denominator/local_national["births"],
                "national_common_five_year_pct": national_common, "weights_pct": {s:100*w for s,w in weights.items()}, "states": rows}
    standardisation = standardise(1)
    sensitivities = [standardise(n) for n in (10,30)]
    base_ranks = {r["uf"]: r["standardised_rank"] for r in standardisation["states"]}
    for analysis in sensitivities:
        for r in analysis["states"]:
            r["rank_change_vs_primary_standardisation"] = base_ranks[r["uf"]] - r["standardised_rank"]
        analysis["states_with_rank_change_vs_primary"] = sum(r["rank_change_vs_primary_standardisation"] != 0 for r in analysis["states"])
        analysis["max_absolute_rank_change_vs_primary"] = max(abs(r["rank_change_vs_primary_standardisation"]) for r in analysis["states"])
    for analysis in [standardisation] + sensitivities:
        assert abs(sum(analysis["weights_pct"].values()) - 100) < 1e-10
        assert len(analysis["states"]) == 27
        for r in analysis["states"]:
            assert r["min_included_sector_births"] >= analysis["minimum_births_in_every_state_sector"]
            assert 0 <= r["standardised_five_year_pct"] <= 100
            assert r["common_births"] <= r["full_births"]
    # Only numeric published records enter controls. Counts remain original denominators.
    assert national["births"] == 261302 and local_national["births"] == 296850
    assert len(states) == 27 and len(region_totals) == 5
    assert sum(r["births"] for r in states) == local_national["births"]
    assert sum(r["births"] for r in sizes) == national["births"]
    assert sum(r["births"] for r in sectors) == national["births"]
    assert len(local_records) == 693
    all_records = [national] + sizes + sectors + local_records
    for r in all_records:
        rates = [p["survival_pct"] for p in r["curve"]]
        assert all(x is None or 0 <= x <= 100 for x in rates)
        assert all(a >= b for a,b in zip(rates,rates[1:]) if a is not None and b is not None)
    weighted = sum(r["births"] * r["five_year_survival_pct"] for r in states) / local_national["births"]
    assert abs(weighted - local_national["five_year_survival_pct"]) < 0.00001
    result = {
        "schema_version": "1.1.0", "available": True, "title": "IBGE employer business survival: 2017 cohort observed through 2022",
        "acquired_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "reference_year": 2022, "cohort_year": 2017, "observation_years": [2018,2019,2020,2021,2022],
        "source_portal": PORTAL, "download_directory": BASE, "sources": sources,
        "latest_release_verification": {"status": "2022 is the latest year listed in this official FTP product directory on acquisition; not a guarantee about other products", "url": BASE.rsplit("2022/",1)[0]},
        "definitions": {
            "employer_enterprises": "Enterprises with at least one salaried employee on 31 December; national enterprise statistics, not all registered businesses.",
            "employer_local_units": "Employer establishments/local units; distinct from enterprises. State comparisons use this population and its own Brazil comparator.",
            "birth": "Employer births include new activity, activity restarted after over 24 months of inactivity, and existing enterprises entering employer status after at least 24 months without employees.",
            "survival": "Active as an employer in birth year and each consecutive observation year; losing employer status can end survival without legal business closure.",
            "births": "Published 2017 cohort denominator for the same population and group as the rate. Not the 2022 count of active businesses.",
            "size": "Published salaried-personnel bands; association with survival is descriptive, not causal.",
            "curve": "Published percentages for ages 1-5, fixed 2017 cohort. No inferred count of survivors is supplied.",
            "symbols": {"-": "exact numeric zero, not rounding", "x": "confidentiality suppression; null", "..": "not applicable; null", "...": "not available; null"}
        },
        "national": national, "national_curve": national["curve"], "sectors": sectors, "sizes": sizes,
        "national_curve_with_origin": [{"age": 0, "year": 2017, "survival_pct": 100, "published_value": None, "basis": "cohort origin by definition"}] + national["curve"],
        "local_units_national": local_national, "states": states, "regions": region_totals,
        "local_units_by_geography_and_sector": local_records,
        "standardised_states": standardisation["states"],
        "sector_standardisation": {**{k:v for k,v in standardisation.items() if k != "states"},
            "method": "Direct descriptive standardisation: sum over common-support sectors of (Brazil 2017 local-unit birth share among included sectors * state published sector five-year survival percentage). Same national weights for every state. No invented rate for absent sectors.",
            "scope": "Employer local units only. Adjusts CNAE-section birth-cohort composition only; no size, municipality, founder, or firm-level adjustment; no causal or predictive model. Rankings are descriptive sensitivity diagnostics, not location recommendations.",
            "raw_common_method": "State sector-birth-weighted average of published rates over exactly the included sectors; rates retain published rounding.",
            "rank_convention": "Rank 1 is highest descriptive survival percentage; positive rank change means movement toward rank 1. No statistical significance is implied.",
            "zero_national_birth_sections": [r["section"] for r in local_records if r["geography"] == "Brasil" and r["section"] and r["births"] == 0],
            "sensitivity_analyses": sensitivities},
        "controls": {"enterprise_size_birth_sum": sum(r["births"] for r in sizes), "enterprise_sector_birth_sum": sum(r["births"] for r in sectors), "state_local_unit_birth_sum": sum(r["births"] for r in states), "state_birth_weighted_five_year_pct": weighted, "local_unit_records": len(local_records), "all_curves_nonincreasing": True},
        "limitations": [
            "Published aggregate tables provide no individual enterprise histories, municipality survival estimates, founder covariates, or fitted adjusted survival model.",
            "State rankings describe employer local units, while national enterprise sector/size comparisons describe employer enterprises; do not combine their denominators.",
            "Five-year rates cover the pandemic period but alone do not identify a causal pandemic effect.",
            "Rates retain workbook precision; publication text typically rounds to one decimal. No invented uncertainty intervals or reconstructed survivor counts.",
            "Small sector denominators require care: electricity/gas has 119 enterprise births, public administration 7; display denominators alongside comparisons.",
            "PDF size-section heading says local units, but its body and Chart 3 say enterprises; Table 2.1 size groups sum to the 261302-enterprise cohort. Table 2.1 title contains extraneous salary/age wording; extracted columns are births and survival rates only."
        ]
    }
    (OUT / "survival.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result["controls"], indent=2))

if __name__ == "__main__": main()
