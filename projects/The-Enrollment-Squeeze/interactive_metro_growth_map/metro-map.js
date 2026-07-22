
(() => {
  const data = window.METRO_GROWTH_DATA;
  const root = document.querySelector("[data-metro-growth]");
  if (!root || !data) return;

  const mapWrap = root.querySelector("[data-map-wrap]");
  const tooltip = root.querySelector("[data-tooltip]");
  const detailName = root.querySelector("[data-detail-name]");
  const detailValue = root.querySelector("[data-detail-value]");
  const detailRank = root.querySelector("[data-detail-rank]");
  const ranking = root.querySelector("[data-ranking]");

  const values = data.metros.map(d => d.growth);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const sizeFor = value => {
    const t = (Math.sqrt(value) - Math.sqrt(min)) /
      (Math.sqrt(max) - Math.sqrt(min));
    return 24 + t * 48;
  };

  const formatNumber = value => new Intl.NumberFormat("en-US").format(value);

  function selectMetro(metro) {
    root.querySelectorAll(".metro-growth__bubble").forEach(button => {
      button.setAttribute(
        "aria-pressed",
        button.dataset.metroRank === String(metro.rank) ? "true" : "false"
      );
    });

    detailName.textContent = metro.name;
    detailValue.textContent = `+${formatNumber(metro.growth)}`;
    detailRank.textContent = `Ranked No. ${metro.rank} for numeric population growth, 2023–2024.`;
  }

  function showTooltip(event, metro) {
    tooltip.innerHTML = `<strong>${metro.name}</strong><br>+${formatNumber(metro.growth)} residents`;
    tooltip.classList.add("is-visible");

    const bounds = mapWrap.getBoundingClientRect();
    const x = Math.min(
      Math.max(event.clientX - bounds.left + 12, 12),
      bounds.width - tooltip.offsetWidth - 12
    );
    const y = Math.min(
      Math.max(event.clientY - bounds.top + 12, 12),
      bounds.height - tooltip.offsetHeight - 12
    );

    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  }

  data.metros.forEach(metro => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "metro-growth__bubble";
    button.dataset.metroRank = String(metro.rank);
    button.style.left = `${metro.x_pct}%`;
    button.style.top = `${metro.y_pct}%`;
    button.style.setProperty("--bubble-size", `${sizeFor(metro.growth)}px`);
    button.setAttribute(
      "aria-label",
      `${metro.name}, population increase ${formatNumber(metro.growth)}`
    );
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = `<span>${metro.rank}</span>`;

    button.addEventListener("mouseenter", event => showTooltip(event, metro));
    button.addEventListener("mousemove", event => showTooltip(event, metro));
    button.addEventListener("mouseleave", () => tooltip.classList.remove("is-visible"));
    button.addEventListener("focus", event => {
      const bounds = button.getBoundingClientRect();
      showTooltip(
        { clientX: bounds.left + bounds.width / 2, clientY: bounds.top + bounds.height / 2 },
        metro
      );
    });
    button.addEventListener("blur", () => tooltip.classList.remove("is-visible"));
    button.addEventListener("click", () => selectMetro(metro));

    mapWrap.appendChild(button);
  });

  data.metros.forEach(metro => {
    const item = document.createElement("li");
    item.innerHTML = `
      <span>${metro.rank}</span>
      <button type="button">${metro.short_name}</button>
      <strong>+${formatNumber(metro.growth)}</strong>
    `;
    item.querySelector("button").addEventListener("click", () => selectMetro(metro));
    ranking.appendChild(item);
  });

  selectMetro(data.metros[0]);
})();
