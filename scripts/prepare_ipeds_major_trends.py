from __future__ import annotations

import io
import re
import zipfile
from pathlib import Path
import tempfile

import pandas as pd
import requests


ROOT = Path(__file__).resolve().parents[1]
PROJECT_DIR = ROOT / "projects" / "ipeds-major-trends"
DATA_DIR = PROJECT_DIR / "data"
CACHE_DIR = Path(tempfile.gettempdir()) / "ipeds_major_trends_cache"

START_YEAR = 2013
END_YEAR = 2023
LOW_BASE_THRESHOLD = 50
VALID_STATES = {
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
}

COMPLETIONS_URL = "https://nces.ed.gov/ipeds/datacenter/data/C{year}_A.zip"
HD_URL = "https://nces.ed.gov/ipeds/datacenter/data/HD{year}.zip"
CIP_2020_URL = "https://nces.ed.gov/ipeds/cipcode/Files/CIPCode2020.csv"
CROSSWALK_2010_2020_URL = "https://nces.ed.gov/ipeds/cipcode/Files/Crosswalk2010to2020.csv"


def fetch_zip_csv(url: str, encoding: str = "utf-8", prefer_non_rv: bool = True) -> pd.DataFrame:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache_name = re.sub(r"[^A-Za-z0-9._-]", "_", url.split("/")[-1])
    cache_path = CACHE_DIR / cache_name
    if not cache_path.exists():
        response = requests.get(url, timeout=120)
        response.raise_for_status()
        cache_path.write_bytes(response.content)
    archive = zipfile.ZipFile(io.BytesIO(cache_path.read_bytes()))
    members = [m for m in archive.namelist() if m.lower().endswith(".csv")]
    if prefer_non_rv:
        preferred = [m for m in members if "_rv" not in m.lower()]
        if preferred:
            members = preferred
    target = members[0]
    with archive.open(target) as handle:
        return pd.read_csv(handle, encoding=encoding, low_memory=False)


def clean_code(value: object) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    if text == "" or text.lower() == "nan":
        return None
    text = text.replace('="', "").replace('"', "").replace("=", "")
    text = text.strip()
    if text == "":
        return None
    return text


def normalize_cip_6(code: object) -> str | None:
    cleaned = clean_code(code)
    if cleaned is None:
        return None

    if re.fullmatch(r"\d{2}\.\d{4}", cleaned):
        return cleaned
    if re.fullmatch(r"\d{2}\.\d{2}", cleaned):
        return f"{cleaned}00"
    if re.fullmatch(r"\d{2}", cleaned):
        return f"{cleaned}.0000"

    if "." in cleaned:
        left, right = cleaned.split(".", 1)
        if not left.isdigit():
            return None
        left = left.zfill(2)
        right_digits = re.sub(r"\D", "", right)
        if right_digits == "":
            right_digits = "0000"
        right_digits = right_digits[:4].ljust(4, "0")
        return f"{left}.{right_digits}"

    digits = re.sub(r"\D", "", cleaned)
    if digits == "":
        return None
    if len(digits) <= 2:
        return f"{digits.zfill(2)}.0000"
    if len(digits) <= 6:
        digits = digits.zfill(6)
        return f"{digits[:2]}.{digits[2:6]}"
    return f"{digits[:2]}.{digits[2:6]}"


def cip4_from_cip6(cip6: str | None) -> str | None:
    if not cip6 or "." not in cip6:
        return None
    left, right = cip6.split(".", 1)
    if len(left) != 2:
        return None
    return f"{left}{right[:2]}"


def load_cip_crosswalk() -> tuple[dict[str, str], dict[str, str]]:
    crosswalk = pd.read_csv(CROSSWALK_2010_2020_URL, dtype=str)
    crosswalk.columns = [c.strip() for c in crosswalk.columns]

    crosswalk["from_2010"] = crosswalk["CIPCode2010"].map(normalize_cip_6)
    crosswalk["to_2020"] = crosswalk["CIPCode2020"].map(normalize_cip_6)
    crosswalk = crosswalk.dropna(subset=["from_2010", "to_2020"])

    # Keep deterministic first mapping when one 2010 code maps to multiple 2020 codes.
    crosswalk = crosswalk.sort_values(["from_2010", "to_2020"]).drop_duplicates("from_2010", keep="first")
    code_map = dict(zip(crosswalk["from_2010"], crosswalk["to_2020"]))

    cip2020 = pd.read_csv(CIP_2020_URL, dtype=str)
    cip2020.columns = [c.strip() for c in cip2020.columns]
    cip2020["CIPCode"] = cip2020["CIPCode"].map(normalize_cip_6)
    cip2020["CIPTitle"] = (
        cip2020["CIPTitle"]
        .fillna("")
        .astype(str)
        .str.strip()
        .str.rstrip(".")
    )
    cip2020 = cip2020.dropna(subset=["CIPCode"])
    cip2020["major_4digit"] = cip2020["CIPCode"].map(cip4_from_cip6)

    major_titles = (
        cip2020[cip2020["major_4digit"].notna() & (cip2020["CIPTitle"] != "")]
        .drop_duplicates("major_4digit", keep="first")
        .set_index("major_4digit")["CIPTitle"]
        .to_dict()
    )

    return code_map, major_titles


def load_state_lookup(year: int) -> pd.DataFrame:
    df = fetch_zip_csv(HD_URL.format(year=year), encoding="latin1", prefer_non_rv=True)
    def normalize_col(col: str) -> str:
        c = str(col).replace("\ufeff", "").replace("ï»¿", "").strip().upper()
        return c

    df.columns = [normalize_col(c) for c in df.columns]
    if "UNITID" not in df.columns or "STABBR" not in df.columns:
        raise ValueError(f"Could not find UNITID/STABBR columns in HD{year}.")

    out = df[["UNITID", "STABBR"]].copy()
    out["UNITID"] = out["UNITID"].astype(str).str.strip()
    out["STABBR"] = out["STABBR"].astype(str).str.strip()
    out = out[out["UNITID"] != ""]
    out = out.drop_duplicates("UNITID")
    return out


def load_completions_year(year: int, state_lookup: pd.DataFrame, code_map: dict[str, str], major_titles: dict[str, str]) -> pd.DataFrame:
    df = fetch_zip_csv(COMPLETIONS_URL.format(year=year), encoding="latin1", prefer_non_rv=True)
    df.columns = [
        str(c).replace("\ufeff", "").replace("ï»¿", "").strip().upper()
        for c in df.columns
    ]
    required = {"UNITID", "CIPCODE", "CTOTALT"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"Missing columns in C{year}_A: {missing}")

    cols = ["UNITID", "CIPCODE", "CTOTALT"]
    if "AWLEVEL" in df.columns:
        cols.append("AWLEVEL")
    df = df[cols].copy()

    df["UNITID"] = df["UNITID"].astype(str).str.strip()
    df["cip_2010"] = df["CIPCODE"].map(normalize_cip_6)
    df["cip_2020"] = df["cip_2010"].map(lambda c: code_map.get(c, c))
    df["major_4digit"] = df["cip_2020"].map(cip4_from_cip6)

    df["graduates"] = pd.to_numeric(df["CTOTALT"], errors="coerce")
    df = df[df["graduates"].notna() & (df["graduates"] >= 0)]
    df = df[df["major_4digit"].notna()]
    df = df[df["major_4digit"] != "9900"]

    df = df.merge(state_lookup, on="UNITID", how="left")
    df["state_abbr"] = df["STABBR"].fillna("UNK").astype(str).str.strip().str.upper()
    df = df[df["state_abbr"].isin(VALID_STATES)]
    df["year"] = year

    agg = (
        df.groupby(["year", "state_abbr", "major_4digit"], as_index=False)["graduates"]
        .sum()
    )
    agg["major_name"] = agg["major_4digit"].map(major_titles).fillna("Unmapped CIP")
    return agg


def compute_outputs(all_years: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    national_annual = (
        all_years.groupby(["year", "major_4digit", "major_name"], as_index=False)["graduates"]
        .sum()
    )
    national_totals = national_annual.groupby("year", as_index=False)["graduates"].sum().rename(columns={"graduates": "year_total"})
    national_annual = national_annual.merge(national_totals, on="year", how="left")
    national_annual["share_of_total"] = national_annual["graduates"] / national_annual["year_total"]
    national_annual = national_annual.drop(columns=["year_total"])

    state_totals = (
        all_years.groupby(["year", "state_abbr"], as_index=False)["graduates"]
        .sum()
        .rename(columns={"graduates": "state_year_total"})
    )
    state_annual = all_years.merge(state_totals, on=["year", "state_abbr"], how="left")
    state_annual["share_of_total"] = state_annual["graduates"] / state_annual["state_year_total"]
    state_annual = state_annual.drop(columns=["state_year_total"])

    national_2013 = (
        national_annual[national_annual["year"] == START_YEAR][["major_4digit", "major_name", "graduates"]]
        .rename(columns={"graduates": "count_2013"})
    )
    national_2023 = (
        national_annual[national_annual["year"] == END_YEAR][["major_4digit", "major_name", "graduates"]]
        .rename(columns={"graduates": "count_2023"})
    )
    national_change = national_2013.merge(national_2023, on=["major_4digit", "major_name"], how="outer").fillna(0)
    national_change["gross_change"] = national_change["count_2023"] - national_change["count_2013"]
    national_change["pct_change"] = national_change.apply(
        lambda r: (r["gross_change"] / r["count_2013"] * 100) if r["count_2013"] > 0 else pd.NA,
        axis=1,
    )
    national_change["low_base_flag"] = national_change["count_2013"] < LOW_BASE_THRESHOLD

    state_2013 = (
        state_annual[state_annual["year"] == START_YEAR][["state_abbr", "major_4digit", "major_name", "graduates"]]
        .rename(columns={"graduates": "count_2013"})
    )
    state_2023 = (
        state_annual[state_annual["year"] == END_YEAR][["state_abbr", "major_4digit", "major_name", "graduates"]]
        .rename(columns={"graduates": "count_2023"})
    )
    state_change = state_2013.merge(state_2023, on=["state_abbr", "major_4digit", "major_name"], how="outer").fillna(0)
    state_change["gross_change"] = state_change["count_2023"] - state_change["count_2013"]
    state_change["pct_change"] = state_change.apply(
        lambda r: (r["gross_change"] / r["count_2013"] * 100) if r["count_2013"] > 0 else pd.NA,
        axis=1,
    )
    state_change["low_base_flag"] = state_change["count_2013"] < LOW_BASE_THRESHOLD

    national_change = national_change.sort_values("count_2013", ascending=False).reset_index(drop=True)
    state_change = state_change.sort_values(["major_name", "state_abbr"]).reset_index(drop=True)
    national_annual = national_annual.sort_values(["major_name", "year"]).reset_index(drop=True)
    state_annual = state_annual.sort_values(["major_name", "state_abbr", "year"]).reset_index(drop=True)
    return national_change, state_change, national_annual, state_annual


def main() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    code_map, major_titles = load_cip_crosswalk()

    yearly_frames: list[pd.DataFrame] = []
    for year in range(START_YEAR, END_YEAR + 1):
        print(f"Processing IPEDS year {year}...")
        states = load_state_lookup(year)
        yearly = load_completions_year(year, states, code_map, major_titles)
        yearly_frames.append(yearly)

    all_years = pd.concat(yearly_frames, ignore_index=True)
    national_change, state_change, national_annual, state_annual = compute_outputs(all_years)

    national_change.to_csv(DATA_DIR / "major_change_national_2013_2023.csv", index=False)
    state_change.to_csv(DATA_DIR / "major_change_state_2013_2023.csv", index=False)
    national_annual.to_csv(DATA_DIR / "major_trend_national_annual.csv", index=False)
    state_annual.to_csv(DATA_DIR / "major_trend_state_annual.csv", index=False)

    unmapped_national = (national_change["major_name"] == "Unmapped CIP").sum()
    print("IPEDS major trends prepared.")
    print(f"Years covered: {START_YEAR}-{END_YEAR}")
    print(f"National majors: {len(national_change)}")
    print(f"State-major rows: {len(state_change)}")
    print(f"Unmapped 4-digit CIP majors: {unmapped_national}")


if __name__ == "__main__":
    main()
