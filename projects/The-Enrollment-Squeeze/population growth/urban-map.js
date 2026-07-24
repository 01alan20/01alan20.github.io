(() => {
  const root = document.querySelector("[data-urban-future]");
  const dataset = window.US_URBAN_CENTRES_2041;
  if (!root || !dataset) return;

  const map = root.querySelector("[data-urban-map]");
  const pointsLayer = root.querySelector("[data-urban-points]");
  const labelsLayer = root.querySelector("[data-urban-labels]");
  const tooltip = root.querySelector("[data-urban-tooltip]");
  const ranking = root.querySelector("[data-urban-ranking]");
  const caption = root.querySelector("[data-urban-caption]");
  const modeButtons = [...root.querySelectorAll("[data-urban-mode]")];
  const detailName = root.querySelector("[data-urban-detail-name]");
  const detailStatus = root.querySelector("[data-urban-detail-status]");
  const detail2025 = root.querySelector("[data-urban-detail-2025]");
  const detail2041 = root.querySelector("[data-urban-detail-2041]");
  const detailChange = root.querySelector("[data-urban-detail-change]");
  const detailNote = root.querySelector("[data-urban-detail-note]");

  const cities = dataset.cities.filter(city => city.population_2041 !== null);
  const comparable = cities.filter(city => city.growth_2025_2041 !== null);
  const cityByCode = new Map(cities.map(city => [String(city.city_code), city]));
  let mode = "size";
  let selected = cities.find(city => city.rank_2041 === 1) || cities[0];
  const pointByCode = new Map();

  const formatResidents = value => {
    if (value === null || Number.isNaN(value)) return "Not reported";
    const residents = value * 1000;
    if (Math.abs(residents) >= 1_000_000) {
      return `${(residents / 1_000_000).toFixed(residents >= 10_000_000 ? 1 : 2)}m`;
    }
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(residents);
  };

  const formatSignedResidents = value => {
    if (value === null || Number.isNaN(value)) return "Not comparable";
    const sign = value > 0 ? "+" : value < 0 ? "−" : "";
    return `${sign}${formatResidents(Math.abs(value))}`;
  };

  const formatPercent = value => {
    if (value === null || Number.isNaN(value)) return "";
    const sign = value > 0 ? "+" : value < 0 ? "−" : "";
    return `${sign}${Math.abs(value).toFixed(1)}%`;
  };

  const rankingsFor = currentMode => {
    if (currentMode === "growth") {
      return [...comparable]
        .sort((a, b) => b.growth_2025_2041 - a.growth_2025_2041)
        .slice(0, 10);
    }
    return [...cities]
      .sort((a, b) => b.population_2041 - a.population_2041)
      .slice(0, 10);
  };

  const labelCitiesFor = currentMode => rankingsFor(currentMode).slice(0, 3);

  const extentFor = currentMode => {
    if (currentMode === "growth") {
      return Math.max(...comparable.map(city => Math.abs(city.growth_2025_2041)));
    }
    return Math.max(...cities.map(city => city.population_2041));
  };

  const pointSize = (city, currentMode) => {
    const max = extentFor(currentMode);
    const value = currentMode === "growth"
      ? Math.abs(city.growth_2025_2041 || 0)
      : city.population_2041;
    const scaled = Math.sqrt(value / max);
    return Math.max(currentMode === "growth" ? 6 : 5, (currentMode === "growth" ? 8 : 7) + scaled * (currentMode === "growth" ? 48 : 56));
  };

  const pointClass = city => {
    if (city.emerging_after_2025) return "is-emerging";
    if (city.growth_2025_2041 === null) return "is-unknown";
    return city.growth_2025_2041 >= 0 ? "is-growing" : "is-declining";
  };

  const showTooltip = (event, city) => {
    const change = city.growth_2025_2041 === null
      ? "No comparable 2025 value"
      : `${formatSignedResidents(city.growth_2025_2041)} (${formatPercent(city.growth_pct_2025_2041)})`;
    tooltip.innerHTML = `<strong>${city.name}</strong><span>2041: ${formatResidents(city.population_2041)}</span><span>2025–2041: ${change}</span>`;
    tooltip.classList.add("is-visible");
    const bounds = map.getBoundingClientRect();
    const x = Math.min(Math.max(event.clientX - bounds.left + 14, 12), bounds.width - tooltip.offsetWidth - 12);
    const y = Math.min(Math.max(event.clientY - bounds.top + 14, 12), bounds.height - tooltip.offsetHeight - 12);
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  };

  const hideTooltip = () => tooltip.classList.remove("is-visible");

  const selectCity = city => {
    selected = city;
    pointByCode.forEach((point, code) => {
      point.setAttribute("aria-pressed", String(Number(code) === city.city_code));
    });
    detailName.textContent = city.name;
    detailStatus.textContent = city.emerging_after_2025
      ? "Projected to cross the dataset’s reporting threshold after 2025"
      : `UN-defined U.S. city or urban centre · ${city.lat.toFixed(2)}, ${city.lon.toFixed(2)}`;
    detail2025.textContent = formatResidents(city.population_2025);
    detail2041.textContent = formatResidents(city.population_2041);
    detailChange.textContent = city.growth_2025_2041 === null
      ? "Not comparable"
      : `${formatSignedResidents(city.growth_2025_2041)} · ${formatPercent(city.growth_pct_2025_2041)}`;
    detailChange.classList.toggle("is-negative", (city.growth_2025_2041 || 0) < 0);
    detailNote.textContent = city.population_2025 === null
      ? "WUP 2025 does not report a 2025 value for this centre, generally because it was below the 50,000-resident city threshold."
      : `Projected 2050 population: ${formatResidents(city.population_2050)}. Values are total population, not college-age population.`;
  };

  const renderLabels = () => {
    labelsLayer.innerHTML = "";
    const offsets = {
      size: {
        "New York City": [-102, -34],
        "Los Angeles": [-92, 22],
        "Houston": [18, 8],
      },
      growth: {
        "Houston": [18, 10],
        "Los Angeles": [-92, 22],
        "San Antonio": [-112, -28],
      },
    };
    labelCitiesFor(mode).forEach(city => {
      if (!city.map_visible) return;
      const label = document.createElement("button");
      label.type = "button";
      label.className = "urban-future__label";
      const offset = offsets[mode][city.name] || [14, -18];
      label.style.left = `${city.x_pct}%`;
      label.style.top = `${city.y_pct}%`;
      label.style.setProperty("--label-x", `${offset[0]}px`);
      label.style.setProperty("--label-y", `${offset[1]}px`);
      const value = mode === "growth"
        ? formatSignedResidents(city.growth_2025_2041)
        : formatResidents(city.population_2041);
      label.innerHTML = `<strong>${city.name}</strong><span>${value}</span>`;
      label.addEventListener("click", () => selectCity(city));
      labelsLayer.appendChild(label);
    });
  };

  const renderRanking = () => {
    ranking.innerHTML = "";
    rankingsFor(mode).forEach((city, index) => {
      const item = document.createElement("li");
      const value = mode === "growth"
        ? formatSignedResidents(city.growth_2025_2041)
        : formatResidents(city.population_2041);
      item.innerHTML = `<span>${index + 1}</span><button type="button">${city.name}</button><strong>${value}</strong>`;
      item.querySelector("button").addEventListener("click", () => selectCity(city));
      ranking.appendChild(item);
    });
  };

  const updateMode = nextMode => {
    mode = nextMode;
    modeButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.urbanMode === mode)));
    const maxKeyboardRank = 20;
    pointByCode.forEach((point, code) => {
      const city = cityByCode.get(String(code));
      const growthMissing = city.growth_2025_2041 === null;
      point.hidden = mode === "growth" && growthMissing;
      point.style.setProperty("--urban-size", `${pointSize(city, mode)}px`);
      const rank = mode === "growth" ? city.rank_growth_2025_2041 : city.rank_2041;
      point.tabIndex = rank && rank <= maxKeyboardRank ? 0 : -1;
    });
    caption.textContent = mode === "growth"
      ? "Bubble size represents projected numeric population change from 2025 to 2041. Red bubbles indicate projected decline. Centres without a comparable 2025 value are hidden in this view."
      : "Bubble size represents projected 2041 population. Color indicates the direction of change where a comparable 2025 value is available. The map displays the contiguous United States.";
    renderLabels();
    renderRanking();
    const topCity = rankingsFor(mode)[0];
    if (topCity) selectCity(topCity);
  };

  cities.forEach(city => {
    if (!city.map_visible) return;
    const point = document.createElement("button");
    point.type = "button";
    point.className = `urban-future__point ${pointClass(city)}`;
    point.style.left = `${city.x_pct}%`;
    point.style.top = `${city.y_pct}%`;
    point.style.setProperty("--urban-size", `${pointSize(city, mode)}px`);
    point.setAttribute("aria-label", `${city.name}, projected 2041 population ${formatResidents(city.population_2041)}`);
    point.setAttribute("aria-pressed", "false");
    point.addEventListener("mouseenter", event => showTooltip(event, city));
    point.addEventListener("mousemove", event => showTooltip(event, city));
    point.addEventListener("mouseleave", hideTooltip);
    point.addEventListener("focus", () => {
      const bounds = point.getBoundingClientRect();
      showTooltip({ clientX: bounds.left + bounds.width / 2, clientY: bounds.top + bounds.height / 2 }, city);
    });
    point.addEventListener("blur", hideTooltip);
    point.addEventListener("click", () => selectCity(city));
    pointsLayer.appendChild(point);
    pointByCode.set(String(city.city_code), point);
  });

  modeButtons.forEach(button => button.addEventListener("click", () => updateMode(button.dataset.urbanMode)));
  updateMode(mode);
  selectCity(selected);
})();
