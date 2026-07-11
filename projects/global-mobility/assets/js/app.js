(() => {
  'use strict';

  const DATA = window.MOBILITY_DATA;
  const MAPS = window.MOBILITY_MAP_DATA;
  if (!DATA || !MAPS) {
    document.body.innerHTML = '<main style="padding:40px;font-family:sans-serif">The mobility dataset or map geometry could not be loaded.</main>';
    return;
  }

  const NS = 'http://www.w3.org/2000/svg';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const formatInteger = new Intl.NumberFormat('en-US');
  const compact = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  });

  const WORLD_WIDTH = 1200;
  const WORLD_HEIGHT = 483;

  const regionColors = {
    Asia: css('--asia'),
    Europe: css('--europe'),
    'Middle East': css('--middle-east'),
    'North America': css('--north-america'),
    'Latin America': css('--latin-america'),
    Africa: css('--africa'),
  };

  const state = {
    globalYear: 2016,
    globalCountry: 'all',
    globalPlaying: false,
    globalTimer: null,
    rankingType: 'origin',
    europeCountry: 'all',
    europeView: 'inbound',
    europeRouteCount: 40,
    profileCountry: 'Spain',
  };

  function css(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function svgEl(tag, attrs = {}, text = '') {
    const node = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (value !== undefined && value !== null) node.setAttribute(key, String(value));
    });
    if (text) node.textContent = text;
    return node;
  }


  function renderBasemap(group, paths) {
    if (!group) return;
    const fragment = document.createDocumentFragment();
    paths.forEach(pathData => {
      fragment.append(svgEl('path', { class: 'basemap-country', d: pathData }));
    });
    group.replaceChildren(fragment);
  }

  function initBasemaps() {
    renderBasemap($('#heroBaseLayer'), MAPS.world.paths);
    renderBasemap($('#globalBaseLayer'), MAPS.world.paths);
    renderBasemap($('#europeBaseLayer'), MAPS.europe.paths);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function scaleLinear(value, domainMin, domainMax, rangeMin, rangeMax) {
    if (domainMax === domainMin) return (rangeMin + rangeMax) / 2;
    const t = (value - domainMin) / (domainMax - domainMin);
    return rangeMin + t * (rangeMax - rangeMin);
  }

  function formatCompact(value, digits = 2) {
    const abs = Math.abs(value);
    if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(digits).replace(/\.0+$|(?<=\.[0-9])0+$/g, '')}m`;
    if (abs >= 1_000) return `${(value / 1_000).toFixed(abs >= 100_000 ? 0 : 1).replace(/\.0$/, '')}k`;
    return formatInteger.format(value);
  }

  function formatSigned(value, compactValue = false) {
    const sign = value > 0 ? '+' : value < 0 ? '−' : '';
    const number = compactValue ? formatCompact(Math.abs(value)) : formatInteger.format(Math.abs(value));
    return `${sign}${number}`;
  }

  function animateNumber(element, from, to, formatter, duration = 430) {
    if (!element) return;
    if (prefersReducedMotion || !Number.isFinite(from) || !Number.isFinite(to)) {
      element.textContent = formatter(to);
      element.dataset.value = String(to);
      return;
    }
    const start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    function frame(now) {
      const t = clamp((now - start) / duration, 0, 1);
      element.textContent = formatter(from + (to - from) * ease(t));
      if (t < 1) requestAnimationFrame(frame);
      else element.dataset.value = String(to);
    }
    requestAnimationFrame(frame);
  }

  function setAnimatedValue(element, value, formatter) {
    const current = Number(element?.dataset.value);
    animateNumber(element, Number.isFinite(current) ? current : value, value, formatter);
  }

  function worldProject(country) {
    const coordinate = DATA.coordinates[country];
    if (!coordinate) return null;
    const [lon, lat] = coordinate;
    return {
      x: ((lon + 180) / 360) * WORLD_WIDTH,
      y: ((85 - lat) / 145) * WORLD_HEIGHT,
    };
  }

  function europeProject(country) {
    const coordinate = DATA.coordinates[country];
    if (!coordinate) return null;
    const [lon, lat] = coordinate;
    const lonMin = -18;
    const lonMax = 50;
    const latMin = 31;
    const latMax = 76;
    return {
      x: ((lon - lonMin) / (lonMax - lonMin)) * 900,
      y: ((latMax - lat) / (latMax - latMin)) * 585,
    };
  }

  function routePath(start, end, liftFactor = 0.18) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const lift = clamp(distance * liftFactor, 28, 145);
    const controlX = (start.x + end.x) / 2;
    const controlY = Math.min(start.y, end.y) - lift;
    return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} Q ${controlX.toFixed(2)} ${controlY.toFixed(2)} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
  }

  function worldRoutePaths(start, end, liftFactor = 0.18) {
    const adjustedEnd = { ...end };
    const directDistance = end.x - start.x;

    // Use the shorter route across the Pacific when a line crosses the
    // antimeridian. A duplicated, shifted path supplies the clipped half on
    // the opposite edge of the world map.
    if (Math.abs(directDistance) > WORLD_WIDTH / 2) {
      adjustedEnd.x += directDistance < 0 ? WORLD_WIDTH : -WORLD_WIDTH;
    }

    const paths = [routePath(start, adjustedEnd, liftFactor)];
    if (adjustedEnd.x !== end.x) {
      const shift = adjustedEnd.x > WORLD_WIDTH ? -WORLD_WIDTH : WORLD_WIDTH;
      paths.push(routePath(
        { x: start.x + shift, y: start.y },
        { x: adjustedEnd.x + shift, y: adjustedEnd.y },
        liftFactor,
      ));
    }
    return paths;
  }

  function showTooltip(tooltip, stage, event, title, detail) {
    if (!tooltip || !stage) return;
    const rect = stage.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    tooltip.innerHTML = `<strong>${title}</strong><span>${detail}</span>`;
    tooltip.classList.add('is-visible');
    const tooltipWidth = tooltip.offsetWidth || 210;
    const tooltipHeight = tooltip.offsetHeight || 60;
    tooltip.style.left = `${clamp(x + 14, 8, rect.width - tooltipWidth - 8)}px`;
    tooltip.style.top = `${clamp(y + 14, 8, rect.height - tooltipHeight - 8)}px`;
  }

  function hideTooltip(tooltip) {
    tooltip?.classList.remove('is-visible');
  }

  function activateButton(buttons, activeButton) {
    buttons.forEach(button => {
      const active = button === activeButton;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function initHeader() {
    const header = $('#siteHeader');
    const globalLink = $('.chapter-link[href="#global-atlas"]');
    const europeLink = $('.chapter-link[href="#europe-atlas"]');

    const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    const sections = [$('#global-atlas'), $('#europe-atlas')].filter(Boolean);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const europe = visible.target.id === 'europe-atlas';
        globalLink?.classList.toggle('is-active', !europe);
        europeLink?.classList.toggle('is-active', europe);
      }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, .1, .35] });
      sections.forEach(section => observer.observe(section));
    }
  }

  function initMethodology() {
    const dialog = $('#methodDialog');
    if (!dialog) return;
    $$('[data-open-methodology]').forEach(button => button.addEventListener('click', () => dialog.showModal()));
    $$('[data-close-methodology]').forEach(button => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('click', event => {
      const rect = dialog.getBoundingClientRect();
      const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
      if (outside) dialog.close();
    });
  }

  function initSelects() {
    const globalSelect = $('#globalCountrySelect');
    const globalCountries = [...new Set(DATA.globalCorridors.flatMap(route => [route.origin, route.destination]))].sort();
    globalCountries.forEach(country => globalSelect?.append(new Option(country, country)));
    globalSelect?.addEventListener('change', event => {
      state.globalCountry = event.target.value;
      renderGlobalMap();
    });

    const europeSelect = $('#europeCountrySelect');
    DATA.erasmusSummary.map(item => item.country).sort().forEach(country => europeSelect?.append(new Option(country, country)));
    europeSelect?.addEventListener('change', event => {
      state.europeCountry = event.target.value;
      if (event.target.value !== 'all') state.profileCountry = event.target.value;
      renderEurope();
      if (event.target.value !== 'all') renderCountryProfile(event.target.value);
    });
  }

  function initGlobalTimeline() {
    const slider = $('#globalYearSlider');
    const ticks = $('#globalTicks');
    const playButton = $('#globalPlay');
    const heroPlay = $('#heroPlay');

    DATA.globalTotals.filter(item => item.year >= 2016).forEach(item => {
      const tick = document.createElement('i');
      tick.title = `${item.year}: ${formatCompact(item.students)} students`;
      ticks?.append(tick);
    });

    slider?.addEventListener('input', event => {
      stopGlobalPlayback();
      setGlobalYear(Number(event.target.value));
    });

    playButton?.addEventListener('click', toggleGlobalPlayback);
    heroPlay?.addEventListener('click', () => {
      $('#global-atlas')?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      setTimeout(() => {
        if (state.globalYear >= 2023) setGlobalYear(2016);
        startGlobalPlayback();
      }, prefersReducedMotion ? 0 : 600);
    });
  }

  function updatePlayButton() {
    const button = $('#globalPlay');
    if (!button) return;
    button.classList.toggle('is-playing', state.globalPlaying);
    button.setAttribute('aria-label', state.globalPlaying ? 'Pause global timeline' : 'Play global timeline');
    button.innerHTML = state.globalPlaying
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5 18 12 8 18.5Z"/></svg>';
  }

  function startGlobalPlayback() {
    stopGlobalPlayback();
    state.globalPlaying = true;
    updatePlayButton();
    state.globalTimer = window.setInterval(() => {
      if (state.globalYear >= 2023) {
        stopGlobalPlayback();
        return;
      }
      setGlobalYear(state.globalYear + 1);
    }, 950);
  }

  function stopGlobalPlayback() {
    if (state.globalTimer) clearInterval(state.globalTimer);
    state.globalTimer = null;
    state.globalPlaying = false;
    updatePlayButton();
  }

  function toggleGlobalPlayback() {
    if (state.globalPlaying) {
      stopGlobalPlayback();
    } else {
      if (state.globalYear >= 2023) setGlobalYear(2016);
      startGlobalPlayback();
    }
  }

  function setGlobalYear(year) {
    state.globalYear = clamp(year, 2016, 2023);
    const slider = $('#globalYearSlider');
    if (slider) slider.value = String(state.globalYear);
    renderGlobalMap();
    renderHeroFlows(state.globalYear);
  }

  function filteredGlobalRoutes() {
    let routes = DATA.globalCorridors.filter(route => route.year === state.globalYear);
    if (state.globalCountry !== 'all') {
      routes = routes.filter(route => route.origin === state.globalCountry || route.destination === state.globalCountry);
    }
    return routes.sort((a, b) => b.students - a.students);
  }

  function renderGlobalMap() {
    const layer = $('#globalFlowLayer');
    if (!layer) return;
    layer.replaceChildren();
    const routes = filteredGlobalRoutes();
    const fullYearRoutes = DATA.globalCorridors.filter(route => route.year === state.globalYear);
    const max = Math.max(1, ...fullYearRoutes.map(route => route.students));
    const nodeTotals = new Map();

    routes.forEach(route => {
      const start = worldProject(route.origin);
      const end = worldProject(route.destination);
      if (!start || !end) return;
      nodeTotals.set(route.origin, (nodeTotals.get(route.origin) || 0) + route.students);
      nodeTotals.set(route.destination, (nodeTotals.get(route.destination) || 0) + route.students);

      worldRoutePaths(start, end, .17).forEach((pathData, partIndex) => {
        const path = svgEl('path', {
          class: 'flow-path',
          d: pathData,
          stroke: regionColors[route.origin_region] || css('--cobalt'),
          'stroke-width': scaleLinear(Math.sqrt(route.students), Math.sqrt(10_000), Math.sqrt(max), 1.2, 7.5),
          opacity: .78,
          tabindex: partIndex === 0 ? 0 : -1,
          role: partIndex === 0 ? 'button' : undefined,
          'aria-hidden': partIndex === 0 ? undefined : 'true',
          'aria-label': partIndex === 0
            ? `${route.origin} to ${route.destination}, ${formatInteger.format(route.students)} students in ${route.year}`
            : undefined,
        });
        attachGlobalRouteEvents(path, route);
        layer.append(path);
      });
    });

    const maxNode = Math.max(1, ...nodeTotals.values());
    nodeTotals.forEach((value, country) => {
      const point = worldProject(country);
      if (!point) return;
      const node = svgEl('circle', {
        class: 'flow-node',
        cx: point.x,
        cy: point.y,
        r: scaleLinear(Math.sqrt(value), 0, Math.sqrt(maxNode), 3.2, 9.5),
        fill: css('--ink'),
        tabindex: 0,
        role: 'button',
        'aria-label': `Focus ${country}`,
      });
      attachCountryNodeEvents(node, country, 'global');
      layer.append(node);
    });

    const yearRecord = DATA.globalTotals.find(item => item.year === state.globalYear);
    const routeArchiveAvailable = true;
    $('#globalYearLabel').textContent = String(state.globalYear);
    $('#globalAnnotationCopy').textContent = !routeArchiveAvailable
      ? 'Global total only · route-level archive begins in 2016'
      : state.globalCountry === 'all'
        ? 'Selected published major corridors'
        : `Routes involving ${state.globalCountry}`;
    const coverageNotice = $('#globalCoverageNotice');
    if (coverageNotice) coverageNotice.hidden = routeArchiveAvailable;

    setAnimatedValue($('#globalTotal'), yearRecord.students, value => formatCompact(Math.round(value)));
    const status = $('#globalStatus');
    status.textContent = yearRecord.status === 'estimated' ? 'Estimated' : 'Published';
    status.classList.toggle('is-estimated', yearRecord.status === 'estimated');

    const start = DATA.globalMetrics.start;
    const change = ((yearRecord.students / start) - 1) * 100;
    $('#globalChange').textContent = state.globalYear === 2013 ? 'Baseline' : `+${change.toFixed(1)}%`;
    $('#globalRouteCount').textContent = routeArchiveAvailable ? String(routes.length) : '—';
    $('#globalListScope').textContent = state.globalCountry === 'all' ? 'Selected routes' : state.globalCountry;
    $('#globalDataNote').textContent = !routeArchiveAvailable
      ? state.globalYear === 2013
        ? `${yearRecord.note} Route-level source maps begin in 2016.`
        : 'A published global total is available, but the audited route-map archive used here begins in 2016.'
      : routes.length
        ? 'The route layer contains published headline corridors above the source-map threshold, not the full global bilateral matrix.'
        : `No published headline corridor involving ${state.globalCountry} is available for ${state.globalYear}.`;

    renderRouteList($('#globalRouteList'), routes.slice(0, 6), 'students', route => {
      state.globalCountry = route.origin;
      const select = $('#globalCountrySelect');
      if (select) select.value = route.origin;
      renderGlobalMap();
    }, routeArchiveAvailable ? undefined : 'Route-level archive begins in 2016');
  }

  function attachGlobalRouteEvents(path, route) {
    const stage = $('#globalMapStage');
    const tooltip = $('#globalTooltip');
    const title = `${route.origin} → ${route.destination}`;
    const detail = `${formatInteger.format(route.students)} students · ${route.year}`;
    path.addEventListener('pointermove', event => showTooltip(tooltip, stage, event, title, detail));
    path.addEventListener('pointerleave', () => hideTooltip(tooltip));
    path.addEventListener('focus', () => {
      const rect = path.getBoundingClientRect();
      showTooltip(tooltip, stage, { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 }, title, detail);
    });
    path.addEventListener('blur', () => hideTooltip(tooltip));
    path.addEventListener('click', () => {
      state.globalCountry = route.origin;
      const select = $('#globalCountrySelect');
      if (select) select.value = route.origin;
      renderGlobalMap();
    });
    path.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        path.click();
      }
    });
  }

  function attachCountryNodeEvents(node, country, mapType) {
    const isGlobal = mapType === 'global';
    const stage = isGlobal ? $('#globalMapStage') : $('#europeMapStage');
    const tooltip = isGlobal ? $('#globalTooltip') : $('#europeTooltip');
    node.addEventListener('pointermove', event => showTooltip(tooltip, stage, event, country, isGlobal ? 'Select to isolate published routes' : 'Select to inspect the mobility network'));
    node.addEventListener('pointerleave', () => hideTooltip(tooltip));
    node.addEventListener('click', () => {
      if (isGlobal) {
        state.globalCountry = country;
        const select = $('#globalCountrySelect');
        if (select) select.value = country;
        renderGlobalMap();
      } else {
        state.europeCountry = country;
        state.profileCountry = country;
        const select = $('#europeCountrySelect');
        if (select) select.value = country;
        renderEurope();
        renderCountryProfile(country);
      }
    });
    node.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        node.click();
      }
    });
  }

  function renderRouteList(list, routes, valueKey, onClick, emptyMessage = 'No published route for this selection') {
    if (!list) return;
    list.replaceChildren();
    if (!routes.length) {
      const empty = document.createElement('li');
      empty.className = 'empty-route';
      empty.innerHTML = `<strong>${emptyMessage}</strong><span>—</span>`;
      list.append(empty);
      return;
    }
    routes.forEach(route => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.innerHTML = `<strong>${route.origin} → ${route.destination}</strong><span>${formatCompact(route[valueKey])}</span>`;
      if (onClick) button.addEventListener('click', () => onClick(route));
      li.append(button);
      list.append(li);
    });
  }

  function renderHeroFlows(year = 2023) {
    const layer = $('#heroFlowLayer');
    const yearLabel = $('#heroYear');
    if (!layer) return;
    layer.replaceChildren();
    yearLabel.textContent = String(year);
    const routes = DATA.globalCorridors
      .filter(route => route.year === year)
      .sort((a, b) => b.students - a.students)
      .slice(0, 12);
    const max = Math.max(1, ...routes.map(route => route.students));
    routes.forEach((route, index) => {
      const start = worldProject(route.origin);
      const end = worldProject(route.destination);
      if (!start || !end) return;
      worldRoutePaths(start, end, .18).forEach((pathData, partIndex) => {
        const path = svgEl('path', {
          d: pathData,
          fill: 'none',
          stroke: regionColors[route.origin_region] || css('--cobalt'),
          'stroke-width': scaleLinear(Math.sqrt(route.students), 0, Math.sqrt(max), .8, 4.2),
          opacity: .45,
          'stroke-linecap': 'round',
          'vector-effect': 'non-scaling-stroke',
        });
        if (!prefersReducedMotion) {
          path.style.strokeDasharray = '1';
          path.style.strokeDashoffset = '1';
          path.style.animation = `drawRoute .85s ${(index * 45) + (partIndex * 12)}ms cubic-bezier(.2,.75,.25,1) forwards`;
          path.setAttribute('pathLength', '1');
        }
        layer.append(path);
      });
    });
  }

  function renderTrendChart() {
    const svg = $('#globalTrendChart');
    if (!svg) return;
    svg.replaceChildren();
    const width = 760;
    const height = 430;
    const margin = { top: 34, right: 26, bottom: 54, left: 54 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const data = DATA.globalTotals;
    const minY = 4_000_000;
    const maxY = 7_500_000;
    const x = year => margin.left + scaleLinear(year, 2013, 2023, 0, innerW);
    const y = value => margin.top + scaleLinear(value, maxY, minY, 0, innerH);

    [4, 5, 6, 7].forEach(million => {
      const yy = y(million * 1_000_000);
      svg.append(svgEl('line', { class: 'trend-grid', x1: margin.left, x2: width - margin.right, y1: yy, y2: yy }));
      svg.append(svgEl('text', { class: 'trend-label', x: margin.left - 10, y: yy + 4, 'text-anchor': 'end' }, `${million}m`));
    });

    [2013, 2015, 2017, 2019, 2021, 2023].forEach(year => {
      svg.append(svgEl('text', { class: 'trend-label', x: x(year), y: height - 19, 'text-anchor': 'middle' }, String(year)));
    });

    const linePoints = data.map(item => `${x(item.year)},${y(item.students)}`);
    const areaPath = `M ${x(data[0].year)} ${y(data[0].students)} L ${linePoints.slice(1).join(' L ')} L ${x(data[data.length - 1].year)} ${y(minY)} L ${x(data[0].year)} ${y(minY)} Z`;
    svg.append(svgEl('path', { class: 'trend-area', d: areaPath }));
    svg.append(svgEl('polyline', { class: 'trend-line', points: linePoints.join(' ') }));

    data.forEach((item, index) => {
      const group = svgEl('g', { class: 'trend-point', tabindex: 0, role: 'button', 'aria-label': `${item.year}, ${formatCompact(item.students)} internationally mobile students` });
      const dot = svgEl('circle', {
        class: `trend-dot ${item.status === 'estimated' ? 'estimated' : ''}`,
        cx: x(item.year),
        cy: y(item.students),
        r: index === 0 || index === data.length - 1 ? 6.5 : 4.5,
      });
      group.append(dot);
      if (index === 0 || index === data.length - 1) {
        group.append(svgEl('text', {
          class: 'trend-value',
          x: x(item.year),
          y: y(item.students) - 15,
          'text-anchor': index === 0 ? 'start' : 'end',
        }, formatCompact(item.students)));
      }
      if (item.year >= 2016) {
        group.addEventListener('click', () => {
          setGlobalYear(item.year);
          $('#global-atlas')?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        });
        group.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            group.dispatchEvent(new Event('click'));
          }
        });
      } else {
        group.removeAttribute('tabindex');
        group.removeAttribute('role');
      }
      svg.append(group);
    });
  }

  function initRankings() {
    const buttons = $$('[data-ranking]');
    buttons.forEach(button => button.addEventListener('click', () => {
      state.rankingType = button.dataset.ranking;
      activateButton(buttons, button);
      renderRankings();
    }));
    renderRankings();
  }

  function renderRankings() {
    const list = $('#countryRanking');
    const data = DATA.globalCountries2023.filter(item => item.type === state.rankingType).sort((a, b) => a.rank - b.rank);
    const max = Math.max(...data.map(item => item.students));
    list.replaceChildren();
    data.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="rank-number">${String(item.rank).padStart(2, '0')}</span>
        <span class="rank-country">${item.country}</span>
        <span class="rank-bar" aria-hidden="true"><i style="width:${(item.students / max * 100).toFixed(1)}%"></i></span>
        <span class="rank-value">${formatCompact(item.students)}</span>`;
      list.append(li);
    });

    const insight = $('#rankingInsight');
    if (state.rankingType === 'origin') {
      const topTwo = data.slice(0, 2).reduce((sum, item) => sum + item.students, 0);
      const share = topTwo / DATA.globalMetrics.end * 100;
      insight.innerHTML = `
        <span class="insight-number">${formatCompact(topTwo)}</span>
        <h3>China and India accounted for ${share.toFixed(1)}% of the global mobile-student population.</h3>
        <p>Scale is concentrated at the top, while the next tier is geographically dispersed across Africa, Europe, Asia and North America.</p>`;
    } else {
      const topFive = data.slice(0, 5).reduce((sum, item) => sum + item.students, 0);
      const share = topFive / DATA.globalMetrics.end * 100;
      insight.innerHTML = `
        <span class="insight-number">${formatCompact(topFive)}</span>
        <h3>The five largest host systems received ${share.toFixed(1)}% of all internationally mobile students.</h3>
        <p>The United States remained the largest single destination, but the receiving landscape is more distributed than the origin market.</p>`;
    }
  }

  function initEuropeControls() {
    const viewButtons = $$('[data-europe-view]');
    viewButtons.forEach(button => button.addEventListener('click', () => {
      state.europeView = button.dataset.europeView;
      activateButton(viewButtons, button);
      renderEurope();
    }));

    const routeSlider = $('#europeRouteCount');
    routeSlider?.addEventListener('input', event => {
      state.europeRouteCount = Number(event.target.value);
      $('#europeRouteCountLabel').textContent = String(state.europeRouteCount);
      renderEuropeMap();
      renderEuropePanel();
    });
  }

  function currentEuropeFlows() {
    let flows = DATA.erasmusFlows;
    if (state.europeCountry !== 'all') {
      if (state.europeView === 'inbound') flows = flows.filter(flow => flow.destination === state.europeCountry);
      else if (state.europeView === 'outbound') flows = flows.filter(flow => flow.origin === state.europeCountry);
      else flows = flows.filter(flow => flow.origin === state.europeCountry || flow.destination === state.europeCountry);
    }
    return flows.slice().sort((a, b) => b.participants - a.participants);
  }

  function renderEurope() {
    renderEuropeMap();
    renderEuropePanel();
  }

  function renderEuropeMap() {
    const layer = $('#europeFlowLayer');
    if (!layer) return;
    layer.replaceChildren();

    const defs = svgEl('defs');
    const marker = svgEl('marker', { id: 'routeArrow', markerWidth: 7, markerHeight: 7, refX: 6, refY: 3.5, orient: 'auto', markerUnits: 'strokeWidth' });
    marker.append(svgEl('path', { d: 'M0,0 L7,3.5 L0,7 Z', fill: css('--cobalt') }));
    defs.append(marker);
    layer.append(defs);

    const flows = currentEuropeFlows().slice(0, state.europeRouteCount);
    const max = Math.max(1, ...flows.map(flow => flow.participants));

    flows.slice().reverse().forEach(flow => {
      const start = europeProject(flow.origin);
      const end = europeProject(flow.destination);
      if (!start || !end) return;
      const selected = state.europeCountry !== 'all';
      const path = svgEl('path', {
        class: 'flow-path europe-flow',
        d: routePath(start, end, .12),
        stroke: css('--cobalt'),
        'stroke-width': scaleLinear(Math.sqrt(flow.participants), 0, Math.sqrt(max), .8, selected ? 7 : 5.2),
        opacity: selected ? .72 : .27,
        'marker-end': selected && flows.length <= 40 ? 'url(#routeArrow)' : null,
        tabindex: 0,
        role: 'button',
        'aria-label': `${flow.origin} to ${flow.destination}, ${formatInteger.format(flow.participants)} cumulative participants`,
      });
      attachEuropeRouteEvents(path, flow);
      layer.append(path);
    });

    const summary = DATA.erasmusSummary;
    const metric = item => state.europeView === 'balance' ? Math.abs(item.balance) : item[state.europeView];
    const maxMetric = Math.max(1, ...summary.map(metric));
    summary.forEach(item => {
      const point = europeProject(item.country);
      if (!point) return;
      const value = metric(item);
      const selected = state.europeCountry === item.country;
      const fill = state.europeView === 'balance'
        ? item.balance >= 0 ? css('--positive') : css('--negative')
        : css('--ink');
      const node = svgEl('circle', {
        class: 'flow-node europe-node',
        cx: point.x,
        cy: point.y,
        r: scaleLinear(Math.sqrt(value), 0, Math.sqrt(maxMetric), 2.6, 10.5) + (selected ? 2 : 0),
        fill,
        opacity: state.europeCountry === 'all' || selected ? .92 : .32,
        tabindex: 0,
        role: 'button',
        'aria-label': `${item.country}, ${state.europeView} ${formatInteger.format(state.europeView === 'balance' ? item.balance : item[state.europeView])}`,
      });
      attachCountryNodeEvents(node, item.country, 'europe');
      layer.append(node);
    });
  }

  function attachEuropeRouteEvents(path, flow) {
    const stage = $('#europeMapStage');
    const tooltip = $('#europeTooltip');
    const title = `${flow.origin} → ${flow.destination}`;
    const detail = `${formatInteger.format(flow.participants)} cumulative participants`;
    path.addEventListener('pointermove', event => showTooltip(tooltip, stage, event, title, detail));
    path.addEventListener('pointerleave', () => hideTooltip(tooltip));
    path.addEventListener('focus', () => {
      const rect = path.getBoundingClientRect();
      showTooltip(tooltip, stage, { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 }, title, detail);
    });
    path.addEventListener('blur', () => hideTooltip(tooltip));
    path.addEventListener('click', () => {
      state.europeCountry = state.europeView === 'inbound' ? flow.destination : flow.origin;
      state.profileCountry = state.europeCountry;
      const select = $('#europeCountrySelect');
      if (select) select.value = state.europeCountry;
      renderEurope();
      renderCountryProfile(state.europeCountry);
    });
    path.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        path.click();
      }
    });
  }

  function renderEuropePanel() {
    const panelLabel = $('#europePanelLabel');
    const mainValue = $('#europeMainValue');
    const metricRow = $('#europeMetricRow');
    const listTitle = $('#europeListTitle');
    const list = $('#europeRouteList');
    const dataNote = $('#europeDataNote');
    const flows = currentEuropeFlows();

    if (state.europeCountry === 'all') {
      panelLabel.textContent = 'Cross-border participants represented';
      setAnimatedValue(mainValue, DATA.erasmusMetrics.cross_border_participants, value => formatCompact(Math.round(value)));
      metricRow.innerHTML = `
        <div><span>Countries</span><strong>${DATA.erasmusMetrics.countries}</strong></div>
        <div><span>Directed routes</span><strong>${formatInteger.format(DATA.erasmusMetrics.routes)}</strong></div>
        <div><span>Largest route</span><strong>${formatCompact(DATA.erasmusMetrics.largest_route.participants)}</strong></div>`;
      listTitle.textContent = 'Largest corridors';
      dataNote.textContent = 'Small same-country records and “Rest of the world” are excluded from the mapped cross-border analysis.';
    } else {
      const item = DATA.erasmusSummary.find(entry => entry.country === state.europeCountry);
      const value = state.europeView === 'balance' ? item.balance : item[state.europeView];
      panelLabel.textContent = state.europeView === 'inbound'
        ? `Arrivals to ${item.country}`
        : state.europeView === 'outbound'
          ? `Departures from ${item.country}`
          : `${item.country} net balance`;
      setAnimatedValue(mainValue, value, current => state.europeView === 'balance' ? formatSigned(Math.round(current), true) : formatCompact(Math.round(current)));
      metricRow.innerHTML = `
        <div><span>Inbound</span><strong>${formatCompact(item.inbound)}</strong></div>
        <div><span>Outbound</span><strong>${formatCompact(item.outbound)}</strong></div>
        <div><span>Top-three ${state.europeView === 'outbound' ? 'outbound' : 'inbound'} share</span><strong>${(state.europeView === 'outbound' ? item.top3_outbound_share : item.top3_inbound_share).toFixed(1)}%</strong></div>`;
      listTitle.textContent = state.europeView === 'inbound' ? 'Largest arrival routes' : state.europeView === 'outbound' ? 'Largest departure routes' : 'Strongest links';
      dataNote.textContent = `Cumulative Erasmus+ learning-mobility participant movements involving ${item.country}; this is not degree-enrolment data.`;
    }

    renderRouteList(list, flows.slice(0, 7), 'participants', flow => {
      const country = state.europeView === 'inbound' ? flow.destination : flow.origin;
      state.europeCountry = country;
      state.profileCountry = country;
      const select = $('#europeCountrySelect');
      if (select) select.value = country;
      renderEurope();
      renderCountryProfile(country);
    });
  }

  function renderBalanceChart() {
    const chart = $('#balanceChart');
    if (!chart) return;
    chart.replaceChildren();
    const positives = DATA.erasmusSummary.slice().sort((a, b) => b.balance - a.balance).slice(0, 6);
    const negatives = DATA.erasmusSummary.slice().sort((a, b) => a.balance - b.balance).slice(0, 6);
    const rows = [...positives, ...negatives];
    const max = Math.max(...rows.map(item => Math.abs(item.balance)));

    rows.forEach(item => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = `balance-row ${state.profileCountry === item.country ? 'is-active' : ''}`;
      row.setAttribute('aria-label', `${item.country}, net balance ${formatSigned(item.balance)}`);
      const width = Math.abs(item.balance) / max * 49;
      row.innerHTML = `
        <span class="balance-name">${item.country}</span>
        <span class="balance-track" aria-hidden="true"><i class="balance-bar ${item.balance >= 0 ? 'positive' : 'negative'}" style="width:${width}%"></i></span>
        <span class="balance-value">${formatSigned(item.balance, true)}</span>`;
      row.addEventListener('click', () => {
        state.profileCountry = item.country;
        state.europeCountry = item.country;
        const select = $('#europeCountrySelect');
        if (select) select.value = item.country;
        renderCountryProfile(item.country);
        renderBalanceChart();
        renderEurope();
      });
      chart.append(row);
    });
  }

  function renderCountryProfile(country) {
    const item = DATA.erasmusSummary.find(entry => entry.country === country) || DATA.erasmusSummary[0];
    state.profileCountry = item.country;
    $('#profileCountry').textContent = item.country;
    $('#profileBalance').textContent = formatSigned(item.balance);
    $('#profileBalance').classList.toggle('is-negative', item.balance < 0);
    $('#profileInbound').textContent = formatCompact(item.inbound);
    $('#profileOutbound').textContent = formatCompact(item.outbound);
    $('#profileConcentration').textContent = `${item.top3_inbound_share.toFixed(1)}%`;
    $('#profileDiversity').textContent = `${item.inbound_diversity.toFixed(1)} / 100`;

    const partners = DATA.erasmusFlows
      .filter(flow => flow.origin === item.country || flow.destination === item.country)
      .sort((a, b) => b.participants - a.participants)
      .slice(0, 6);
    const container = $('#profilePartners');
    container.replaceChildren();
    partners.forEach(flow => {
      const row = document.createElement('div');
      row.className = 'partner-row';
      const direction = flow.origin === item.country ? `→ ${flow.destination}` : `← ${flow.origin}`;
      row.innerHTML = `<span>${direction}</span><span>${formatCompact(flow.participants)}</span>`;
      container.append(row);
    });
    renderBalanceChart();
  }

  function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes drawRoute { to { stroke-dashoffset: 0; } }
      .trend-point { cursor: pointer; }
      .trend-point:focus { outline: none; }
      .trend-point:focus .trend-dot { stroke-width: 5; }
      .flow-path:focus, .flow-node:focus { outline: none; filter: drop-shadow(0 0 4px rgba(47,70,242,.55)); }
      .empty-route { color: var(--muted); }
      .balance-row { width: 100%; padding: 0; border: 0; background: transparent; color: inherit; text-align: left; cursor: pointer; }
      .balance-row:hover .balance-name, .balance-row.is-active .balance-name { color: var(--cobalt); }
      .balance-row.is-active { background: rgba(47,70,242,.045); }
      #profileBalance.is-negative { color: var(--negative); }
      .europe-flow { transition: opacity .25s ease, stroke-width .35s var(--ease); }
      select:focus-visible, button:focus-visible, a:focus-visible, input:focus-visible { outline: 2px solid var(--cobalt); outline-offset: 3px; }
    `;
    document.head.append(style);
  }

  function init() {
    addDynamicStyles();
    initBasemaps();
    initHeader();
    initMethodology();
    initSelects();
    initGlobalTimeline();
    initRankings();
    initEuropeControls();
    renderHeroFlows(2023);
    renderGlobalMap();
    renderTrendChart();
    renderEurope();
    renderCountryProfile(state.profileCountry);
  }

  init();
})();
