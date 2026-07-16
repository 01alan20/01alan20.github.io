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

        finance_20 = driver.find_element(By.CSS_SELECTOR, 'input[name="finance-loss"][value="0.20"]')
        driver.execute_script("arguments[0].click()", finance_20)
        time.sleep(1)
        finance_text = driver.find_element(By.ID, "finance-summary").text
        print("finance_20", "20% enrollment-loss" in finance_text.lower())
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
