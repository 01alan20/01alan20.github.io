"""Exercise the rendered diagnostics page and capture a full-page screenshot."""

from __future__ import annotations

import base64
import json
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait


ROOT = Path(__file__).resolve().parents[3]
URL = "http://127.0.0.1:8765/projects/The%20Enrollment%20Squeeze/index.html"
SCREENSHOT = ROOT / "output" / "playwright" / "enrollment-squeeze-diagnostics-full.png"


def wait_for_plots(driver, minimum=7):
    WebDriverWait(driver, 25).until(
        lambda browser: browser.execute_script(
            "return document.querySelectorAll('.plot-container').length"
        ) >= minimum
    )


def severe_logs(driver):
    return [entry for entry in driver.get_log("browser") if entry["level"] == "SEVERE"]


def main():
    options = Options()
    options.binary_location = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    for argument in ("--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars", "--window-size=1440,1000"):
        options.add_argument(argument)
    options.set_capability("goog:loggingPrefs", {"browser": "ALL"})
    driver = webdriver.Chrome(options=options)
    try:
        driver.get(URL)
        wait_for_plots(driver)
        time.sleep(3)
        print("plots", driver.execute_script("return document.querySelectorAll('.plot-container').length"))
        print("height", driver.execute_script("return document.documentElement.scrollHeight"))

        state_metric = driver.find_element(By.ID, "state-metric")
        Select(state_metric).select_by_value("requiredParticipationPoints")
        driver.execute_script("arguments[0].dispatchEvent(new Event('change',{bubbles:true}))", state_metric)
        time.sleep(1)
        print("state_metric", Select(state_metric).first_selected_option.text)

        institution = driver.find_element(By.ID, "exposure-institution")
        institution.clear()
        institution.send_keys("University of Alabama at Birmingham")
        driver.execute_script("arguments[0].dispatchEvent(new Event('change',{bubbles:true}))", institution)
        time.sleep(1)
        profile = driver.find_element(By.ID, "institution-profile")
        print("profile_hidden", profile.get_attribute("hidden"))
        print("profile_text", profile.text[:140].replace("\n", " | "))

        reset = driver.find_element(By.ID, "institution-filter-reset")
        driver.execute_script("arguments[0].click()", reset)
        time.sleep(1)
        print(
            "institution_reset",
            Select(driver.find_element(By.ID, "inst-control")).first_selected_option.get_attribute("value"),
            Select(driver.find_element(By.ID, "exposure-state")).first_selected_option.get_attribute("value"),
            driver.find_element(By.ID, "exposure-institution").get_attribute("value"),
            Select(driver.find_element(By.ID, "institution-map-metric")).first_selected_option.get_attribute("value"),
        )

        map_metric = driver.find_element(By.ID, "institution-map-metric")
        map_metrics = (
            "change", "currentUG", "admitRate", "retention",
            "firstTimeHomeStateShare", "firstTimeOtherStateShare",
            "adultUGShare", "partTimeUGShare", "internationalUGShare", "tuitionPerFTE",
        )
        for value in map_metrics:
            Select(map_metric).select_by_value(value)
            driver.execute_script("arguments[0].dispatchEvent(new Event('change',{bubbles:true}))", map_metric)
            time.sleep(0.7)
            tick_text = driver.execute_script(
                "const trace=document.getElementById('institution-map').data.find(item=>item.marker?.colorbar);"
                "return trace ? trace.marker.colorbar.ticktext : null;"
            )
            assert tick_text and len(tick_text) >= 2, f"missing grouped legend for {value}: {tick_text}"
            if value == "admitRate":
                assert tick_text == ["<10%", "10–24%", "25–49%", "50–79%", "80%+"]
            print("institution_map_groups", value, tick_text)

        institution = driver.find_element(By.ID, "exposure-institution")
        institution.send_keys("University of Alabama at Birmingham")
        driver.execute_script("arguments[0].dispatchEvent(new Event('change',{bubbles:true}))", institution)
        time.sleep(1)
        print("recruitment_profile", "Recruitment composition" in driver.find_element(By.ID, "institution-profile").text)

        finance_20 = driver.find_element(By.CSS_SELECTOR, 'input[name="finance-loss"][value="0.20"]')
        driver.execute_script("arguments[0].click()", finance_20)
        time.sleep(1)
        finance_text = driver.find_element(By.ID, "finance-summary").text
        print(
            "finance_20",
            finance_20.is_selected(),
            "Gross tuition reduction" in finance_text,
        )
        print("finance_text", finance_text[:140].replace("\n", " | "))

        replacement = driver.find_element(By.ID, "replacement-participation")
        driver.execute_script(
            "arguments[0].value=Math.min(100,Number(arguments[0].max)); arguments[0].dispatchEvent(new Event('input',{bubbles:true}))",
            replacement,
        )
        time.sleep(0.5)
        print("replacement", driver.find_element(By.ID, "replacement-summary").text[:160].replace("\n", " | "))
        print("browser_errors", json.dumps(severe_logs(driver)))

        SCREENSHOT.parent.mkdir(parents=True, exist_ok=True)
        content = driver.execute_cdp_cmd("Page.getLayoutMetrics", {})["contentSize"]
        capture = driver.execute_cdp_cmd(
            "Page.captureScreenshot",
            {
                "format": "png",
                "captureBeyondViewport": True,
                "fromSurface": True,
                "clip": {"x": 0, "y": 0, "width": content["width"], "height": content["height"], "scale": 1},
            },
        )
        SCREENSHOT.write_bytes(base64.b64decode(capture["data"]))
        print("screenshot", SCREENSHOT, SCREENSHOT.stat().st_size)

        driver.set_window_size(390, 844)
        driver.get(URL)
        wait_for_plots(driver)
        time.sleep(2)
        print("mobile_overflow", driver.execute_script("return document.documentElement.scrollWidth-document.documentElement.clientWidth"))
        print("mobile_errors", json.dumps(severe_logs(driver)))
    finally:
        driver.quit()


if __name__ == "__main__":
    main()
