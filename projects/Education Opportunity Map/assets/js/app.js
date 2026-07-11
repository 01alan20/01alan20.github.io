(() => {
  'use strict';

  const metros = Array.isArray(window.METRO_DATA) ? window.METRO_DATA : [];
  const outline = Array.isArray(window.US_OUTLINE) ? window.US_OUTLINE : [];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!metros.length || !outline.length) {
    document.documentElement.classList.add('data-error');
    console.error('Opportunity Map data files were not loaded.');
    return;
  }

  const NS = 'http://www.w3.org/2000/svg';
  const VIEWBOX = { width: 1000, height: 560, paddingX: 44, paddingY: 34 };
  const BOUNDS = getBounds(outline);
  const tooltip = document.getElementById('tooltip');
  const dialog = document.getElementById('metro-dialog');
  const dialogContent = document.getElementById('dialog-content');
  const closeDialogButton = document.getElementById('close-dialog');

  const metricConfig = {
    opportunity_score: {
      title: 'Opportunity score',
      kicker: 'Composite index',
      caption: 'A weighted view of career growth, affordability, education, momentum, and connectivity.',
      format: value => value.toFixed(1),
    },
    career_score: {
      title: 'Career momentum',
      kicker: 'Labor-market signal',
      caption: 'A relative score combining 2023–2024 resident employment growth and the 2024 employment-to-population ratio.',
      format: value => value.toFixed(1),
    },
    affordability_score: {
      title: 'Cost-adjusted opportunity',
      kicker: 'Housing and usable income',
      caption: 'A relative score combining gross-rent pressure and median worker earnings remaining after twelve months of median rent.',
      format: value => value.toFixed(1),
    },
    education_score: {
      title: 'Education depth',
      kicker: 'Talent ecosystem',
      caption: 'Relative concentration of adults with a bachelor’s degree or higher.',
      format: value => value.toFixed(1),
    },
    momentum_score: {
      title: 'Population momentum',
      kicker: 'Movement and confidence',
      caption: 'Relative metro population growth, which can signal confidence as well as emerging pressure.',
      format: value => value.toFixed(1),
    },
    connectivity_score: {
      title: 'Digital connectivity',
      kicker: 'Access infrastructure',
      caption: 'Relative share of households with a broadband internet subscription across the included metros.',
      format: value => value.toFixed(1),
    },
  };

  const compareMetrics = [
    ['career_score', 'Career'],
    ['affordability_score', 'Affordability'],
    ['education_score', 'Education'],
    ['momentum_score', 'Momentum'],
    ['connectivity_score', 'Connectivity'],
  ];

  const weightDimensions = [
    ['career_score', 'Career momentum'],
    ['affordability_score', 'Affordability'],
    ['education_score', 'Education depth'],
    ['momentum_score', 'Population momentum'],
    ['connectivity_score', 'Digital access'],
  ];

  const presets = {
    balanced: { career_score: 25, affordability_score: 25, education_score: 20, momentum_score: 20, connectivity_score: 10 },
    career: { career_score: 45, affordability_score: 15, education_score: 15, momentum_score: 15, connectivity_score: 10 },
    value: { career_score: 25, affordability_score: 40, education_score: 10, momentum_score: 20, connectivity_score: 5 },
    education: { career_score: 20, affordability_score: 15, education_score: 45, momentum_score: 10, connectivity_score: 10 },
  };

  let currentStoryMetric = 'opportunity_score';
  let currentStoryMetro = metros[0];
  let currentWeights = { ...presets.balanced };
  let recommendationRows = [];

  function svgElement(name, attributes = {}, text = '') {
    const node = document.createElementNS(NS, name);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    if (text) node.textContent = text;
    return node;
  }

  function getBounds(rings) {
    const points = rings.flat();
    const longitudes = points.map(point => point[0]);
    const latitudes = points.map(point => point[1]);
    return {
      minLon: Math.min(...longitudes),
      maxLon: Math.max(...longitudes),
      minLat: Math.min(...latitudes),
      maxLat: Math.max(...latitudes),
    };
  }

  function project(longitude, latitude, width = VIEWBOX.width, height = VIEWBOX.height, padX = VIEWBOX.paddingX, padY = VIEWBOX.paddingY) {
    const x = padX + ((longitude - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)) * (width - padX * 2);
    const y = padY + ((BOUNDS.maxLat - latitude) / (BOUNDS.maxLat - BOUNDS.minLat)) * (height - padY * 2);
    return [x, y];
  }

  function pathFromOutline(width = VIEWBOX.width, height = VIEWBOX.height, padX = VIEWBOX.paddingX, padY = VIEWBOX.paddingY) {
    return outline.map(ring => ring.map((point, index) => {
      const [x, y] = project(point[0], point[1], width, height, padX, padY);
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ') + ' Z').join(' ');
  }

  function extent(field, rows = metros) {
    const values = rows.map(row => Number(row[field])).filter(Number.isFinite);
    return [Math.min(...values), Math.max(...values)];
  }

  function normalize(value, min, max) {
    if (max === min) return 0.5;
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  }

  function hexToRgb(hex) {
    const value = hex.replace('#', '');
    return [0, 2, 4].map(index => parseInt(value.slice(index, index + 2), 16));
  }

  function rgbToHex(rgb) {
    return `#${rgb.map(value => Math.round(value).toString(16).padStart(2, '0')).join('')}`;
  }

  function mixColor(a, b, t) {
    const first = hexToRgb(a);
    const second = hexToRgb(b);
    return rgbToHex(first.map((value, index) => value + (second[index] - value) * t));
  }

  function valueColor(value, min, max) {
    const t = normalize(value, min, max);
    if (t < 0.5) return mixColor('#ff6f91', '#ffd166', t * 2);
    return mixColor('#ffd166', '#56f0d0', (t - 0.5) * 2);
  }

  function radiusForPopulation(population, compact = false) {
    const [min, max] = extent('population_m');
    const t = Math.sqrt(normalize(population, min, max));
    return (compact ? 3.6 : 4.6) + t * (compact ? 6 : 9.5);
  }

  function currency(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  }

  function signedPercent(value) {
    return `${value > 0 ? '+' : ''}${Number(value).toFixed(1)}%`;
  }

  function findMetro(name) {
    return metros.find(row => row.metro === name) || metros[0];
  }

  function sortedBy(field) {
    return [...metros].sort((a, b) => Number(b[field]) - Number(a[field]));
  }

  function showTooltip(event, metro, metric = currentStoryMetric, customText = '') {
    const config = metricConfig[metric] || metricConfig.opportunity_score;
    const value = Number(metro[metric]);
    tooltip.innerHTML = `<strong>${metro.metro}, ${metro.state}</strong><span>${customText || `${config.title}: ${config.format(value)}`}</span>`;
    moveTooltip(event);
    tooltip.classList.add('is-visible');
  }

  function moveTooltip(event) {
    const x = event.clientX ?? 0;
    const y = event.clientY ?? 0;
    tooltip.style.left = `${Math.max(90, Math.min(window.innerWidth - 90, x))}px`;
    tooltip.style.top = `${Math.max(80, y)}px`;
  }

  function hideTooltip() {
    tooltip.classList.remove('is-visible');
  }

  function addPointEvents(node, metro, metricGetter = () => currentStoryMetric, customTextGetter = null) {
    node.setAttribute('tabindex', '0');
    node.setAttribute('role', 'button');
    node.setAttribute('aria-label', `Open profile for ${metro.metro}, ${metro.state}`);
    node.addEventListener('mouseenter', event => showTooltip(event, metro, metricGetter(), customTextGetter ? customTextGetter(metro) : ''));
    node.addEventListener('mousemove', moveTooltip);
    node.addEventListener('mouseleave', hideTooltip);
    node.addEventListener('focus', event => {
      const rect = node.getBoundingClientRect();
      showTooltip({ clientX: rect.left + rect.width / 2, clientY: rect.top }, metro, metricGetter(), customTextGetter ? customTextGetter(metro) : '');
    });
    node.addEventListener('blur', hideTooltip);
    node.addEventListener('click', () => openMetroDialog(metro));
    node.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openMetroDialog(metro);
      }
    });
  }

  function addMapBase(svg, id, compact = false) {
    svg.innerHTML = '';
    svg.setAttribute('viewBox', `0 0 ${VIEWBOX.width} ${VIEWBOX.height}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    const defs = svgElement('defs');
    const clip = svgElement('clipPath', { id: `${id}-clip` });
    clip.appendChild(svgElement('path', { d: pathFromOutline() }));
    defs.appendChild(clip);

    const filter = svgElement('filter', { id: `${id}-glow`, x: '-80%', y: '-80%', width: '260%', height: '260%' });
    filter.appendChild(svgElement('feGaussianBlur', { stdDeviation: compact ? '4' : '6', result: 'blur' }));
    const merge = svgElement('feMerge');
    merge.appendChild(svgElement('feMergeNode', { in: 'blur' }));
    merge.appendChild(svgElement('feMergeNode', { in: 'SourceGraphic' }));
    filter.appendChild(merge);
    defs.appendChild(filter);
    svg.appendChild(defs);

    svg.appendChild(svgElement('path', { class: 'map-outline', d: pathFromOutline() }));

    const mesh = svgElement('g', { 'clip-path': `url(#${id}-clip)`, class: 'map-mesh' });
    for (let x = 70; x < 960; x += 78) mesh.appendChild(svgElement('line', { x1: x, y1: 20, x2: x - 130, y2: 545 }));
    for (let y = 95; y < 520; y += 76) mesh.appendChild(svgElement('line', { x1: 10, y1: y, x2: 990, y2: y + 60 }));
    svg.appendChild(mesh);

    const halos = svgElement('g', { class: 'map-halos' });
    const dots = svgElement('g', { class: 'map-dots' });
    svg.appendChild(halos);
    svg.appendChild(dots);

    return { svg, id, compact, dots, halos, nodes: new Map(), haloNodes: new Map() };
  }

  function createMap(svg, id, options = {}) {
    const map = addMapBase(svg, id, options.compact);
    metros.forEach(metro => {
      const [cx, cy] = project(metro.longitude, metro.latitude);
      const halo = svgElement('circle', {
        class: 'metro-halo', cx, cy, r: radiusForPopulation(metro.population_m, options.compact) + 6,
      });
      map.halos.appendChild(halo);
      map.haloNodes.set(metro.metro, halo);

      const dot = svgElement('circle', {
        class: 'metro-dot', cx, cy, r: radiusForPopulation(metro.population_m, options.compact),
      });
      dot.style.transition = 'fill .55s ease, opacity .4s ease, stroke .4s ease, stroke-width .4s ease';
      map.dots.appendChild(dot);
      map.nodes.set(metro.metro, dot);
      addPointEvents(dot, metro, () => map.metric || 'opportunity_score');
    });
    return map;
  }

  function updateMap(map, metric, options = {}) {
    map.metric = metric;
    const [min, max] = extent(metric);
    const highlighted = options.highlighted || null;
    const selected = options.selected || null;
    map.nodes.forEach((node, metroName) => {
      const metro = findMetro(metroName);
      const value = Number(metro[metric]);
      const isHighlighted = !highlighted || highlighted.has(metroName);
      const isSelected = selected === metroName;
      node.style.fill = valueColor(value, min, max);
      node.style.color = node.style.fill;
      node.style.opacity = isHighlighted ? '0.92' : '0.12';
      node.style.stroke = isSelected ? '#ffffff' : 'rgba(255,255,255,.5)';
      node.style.strokeWidth = isSelected ? '3' : '0.8';
      const halo = map.haloNodes.get(metroName);
      halo.style.stroke = node.style.fill;
      halo.style.opacity = isHighlighted ? (isSelected ? '.72' : '.18') : '.03';
      if (isSelected && !reducedMotion) halo.style.animation = 'pulse 1.8s ease-in-out infinite';
      else halo.style.animation = '';
    });
  }

  function renderHero() {
    const heroMap = createMap(document.getElementById('hero-map'), 'hero', { compact: false });
    updateMap(heroMap, 'opportunity_score');
    const top = sortedBy('opportunity_score').slice(0, 7);
    top.forEach((metro, index) => {
      const halo = heroMap.haloNodes.get(metro.metro);
      halo.style.opacity = index < 3 ? '.7' : '.35';
      if (!reducedMotion) {
        halo.style.animation = `pulse ${2.2 + index * 0.18}s ease-in-out ${index * .14}s infinite`;
      }
    });

    const leader = top[0];
    document.getElementById('hero-leader').textContent = leader.metro;
    document.getElementById('hero-leader-score').textContent = Math.round(leader.opportunity_score);
    document.getElementById('open-raleigh').textContent = `Open ${leader.metro}`;
    document.getElementById('open-raleigh').addEventListener('click', () => openMetroDialog(leader));
  }

  function updateStoryPreview(metro, metric = currentStoryMetric) {
    currentStoryMetro = metro;
    const preview = document.getElementById('metro-preview');
    const rank = sortedBy(metric).findIndex(row => row.metro === metro.metro) + 1;
    preview.querySelector('.preview-rank').textContent = `#${rank}`;
    preview.querySelector('p').textContent = `${metro.metro}, ${metro.state}`;
    preview.querySelector('strong').textContent = metricConfig[metric].format(Number(metro[metric]));
    preview.querySelector('.preview-note').textContent = metro.headline;
  }

  function initStory() {
    const map = createMap(document.getElementById('story-map'), 'story');
    const title = document.getElementById('map-title');
    const kicker = document.getElementById('map-kicker');
    const caption = document.getElementById('map-caption');
    const steps = [...document.querySelectorAll('.story-step')];

    const activate = metric => {
      currentStoryMetric = metric;
      const config = metricConfig[metric];
      title.textContent = config.title;
      kicker.textContent = config.kicker;
      caption.textContent = config.caption;
      const leader = sortedBy(metric)[0];
      currentStoryMetro = leader;
      updateMap(map, metric, { selected: leader.metro });
      updateStoryPreview(leader, metric);
      steps.forEach(step => step.classList.toggle('is-active', step.dataset.metric === metric));
    };

    map.nodes.forEach((node, name) => {
      node.addEventListener('mouseenter', () => {
        updateStoryPreview(findMetro(name), currentStoryMetric);
        updateMap(map, currentStoryMetric, { selected: name });
      });
      node.addEventListener('mouseleave', () => {
        updateMap(map, currentStoryMetric, { selected: currentStoryMetro.metro });
      });
    });

    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) activate(visible.target.dataset.metric);
    }, { rootMargin: '-35% 0px -35% 0px', threshold: [0.05, 0.3, 0.6] });

    steps.forEach(step => {
      observer.observe(step);
      step.addEventListener('focus', () => activate(step.dataset.metric));
      step.addEventListener('click', () => activate(step.dataset.metric));
    });

    document.getElementById('reset-map').addEventListener('click', () => activate(currentStoryMetric));
    activate('opportunity_score');
  }

  const constellationModes = {
    balanced: {
      x: 'affordability_score', y: 'career_score',
      xLabel: 'Affordability →', yLabel: 'Career momentum →',
      labels: ['Fast but costly', 'Opportunity leaders', 'Under pressure', 'Overlooked value'],
      highlight: metro => metro.opportunity_score >= 70,
    },
    winners: {
      x: 'opportunity_score', y: 'education_score',
      xLabel: 'Composite opportunity →', yLabel: 'Education depth →',
      labels: ['Educated, mixed opportunity', 'High-capacity leaders', 'Structural constraints', 'Emerging opportunity'],
      highlight: metro => metro.rank <= 10,
    },
    overlooked: {
      x: 'affordability_score', y: 'momentum_score',
      xLabel: 'Affordability →', yLabel: 'Population momentum →',
      labels: ['Growing, cost pressure', 'Affordable growth', 'Low momentum', 'Quiet value'],
      highlight: metro => metro.affordability_score >= 60 && metro.opportunity_score >= 52 && metro.population_m <= 4,
    },
    expensive: {
      x: 'rent_to_earnings_pct', y: 'career_score',
      xLabel: 'Housing burden →', yLabel: 'Career momentum →',
      labels: ['Fast and manageable', 'Expensive growth', 'Lower pressure', 'Cost without momentum'],
      highlight: metro => metro.rent_to_earnings_pct >= 40 && metro.career_score >= 50,
    },
  };

  function initConstellation() {
    const svg = document.getElementById('constellation-chart');
    const width = 1000;
    const height = 610;
    const padding = { left: 38, right: 28, top: 30, bottom: 32 };
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('preserveAspectRatio', 'none');

    const grid = svgElement('g');
    for (let i = 0; i <= 4; i += 1) {
      const x = padding.left + ((width - padding.left - padding.right) * i / 4);
      const y = padding.top + ((height - padding.top - padding.bottom) * i / 4);
      grid.appendChild(svgElement('line', { class: i === 2 ? 'chart-midline' : 'chart-grid', x1: x, y1: padding.top, x2: x, y2: height - padding.bottom }));
      grid.appendChild(svgElement('line', { class: i === 2 ? 'chart-midline' : 'chart-grid', x1: padding.left, y1: y, x2: width - padding.right, y2: y }));
    }
    svg.appendChild(grid);

    const pointLayer = svgElement('g');
    const labelLayer = svgElement('g');
    svg.appendChild(pointLayer);
    svg.appendChild(labelLayer);

    const nodes = new Map();
    metros.forEach(metro => {
      const point = svgElement('circle', { class: 'chart-point', r: radiusForPopulation(metro.population_m, true) + 1 });
      point.style.transition = 'cx .8s cubic-bezier(.2,.8,.2,1), cy .8s cubic-bezier(.2,.8,.2,1), fill .4s ease, opacity .4s ease, r .4s ease';
      pointLayer.appendChild(point);
      nodes.set(metro.metro, point);
      addPointEvents(point, metro, () => 'opportunity_score', m => `Opportunity ${m.opportunity_score.toFixed(1)} · Career ${m.career_score.toFixed(0)} · Affordability ${m.affordability_score.toFixed(0)}`);
    });

    function render(modeName) {
      const mode = constellationModes[modeName];
      const [xMin, xMax] = extent(mode.x);
      const [yMin, yMax] = extent(mode.y);
      const highlighted = metros.filter(mode.highlight);
      const opportunityExtent = extent('opportunity_score');
      labelLayer.innerHTML = '';

      metros.forEach(metro => {
        const x = padding.left + normalize(metro[mode.x], xMin, xMax) * (width - padding.left - padding.right);
        const y = height - padding.bottom - normalize(metro[mode.y], yMin, yMax) * (height - padding.top - padding.bottom);
        const point = nodes.get(metro.metro);
        const active = mode.highlight(metro);
        point.setAttribute('cx', x);
        point.setAttribute('cy', y);
        point.style.fill = valueColor(metro.opportunity_score, ...opportunityExtent);
        point.style.color = point.style.fill;
        point.style.opacity = active ? '.96' : '.25';
        point.style.stroke = active ? 'rgba(255,255,255,.72)' : 'rgba(255,255,255,.25)';
        point.style.strokeWidth = active ? '1.4' : '.5';
        point.setAttribute('r', radiusForPopulation(metro.population_m, true) + (active ? 2 : 0));
      });

      highlighted
        .sort((a, b) => b.opportunity_score - a.opportunity_score)
        .slice(0, 9)
        .forEach((metro, index) => {
          const point = nodes.get(metro.metro);
          const x = Number(point.getAttribute('cx'));
          const y = Number(point.getAttribute('cy'));
          const label = svgElement('text', {
            class: 'chart-point-label', x: x + 10, y: y + (index % 2 ? 14 : -9),
          }, metro.metro);
          labelLayer.appendChild(label);
        });

      document.querySelector('.axis-x').textContent = mode.xLabel;
      document.querySelector('.axis-y').textContent = mode.yLabel;
      const quadrantNodes = [
        document.querySelector('.q-top-left'), document.querySelector('.q-top-right'),
        document.querySelector('.q-bottom-left'), document.querySelector('.q-bottom-right'),
      ];
      quadrantNodes.forEach((node, index) => { node.textContent = mode.labels[index]; });
      document.querySelectorAll('.mode-button').forEach(button => button.classList.toggle('is-active', button.dataset.mode === modeName));
    }

    document.querySelectorAll('.mode-button').forEach(button => button.addEventListener('click', () => render(button.dataset.mode)));
    render('balanced');
  }

  function radarPoint(index, value, count, centerX, centerY, radius) {
    const angle = -Math.PI / 2 + (index * Math.PI * 2 / count);
    const length = radius * (value / 100);
    return [centerX + Math.cos(angle) * length, centerY + Math.sin(angle) * length];
  }

  function polygonPoints(values, centerX, centerY, radius) {
    return values.map((value, index) => radarPoint(index, value, values.length, centerX, centerY, radius).join(',')).join(' ');
  }

  function renderRadar(a, b) {
    const svg = document.getElementById('comparison-radar');
    const width = 380;
    const height = 330;
    const centerX = width / 2;
    const centerY = height / 2 + 5;
    const radius = 118;
    svg.innerHTML = '';
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    for (let level = 1; level <= 4; level += 1) {
      const values = compareMetrics.map(() => level * 25);
      svg.appendChild(svgElement('polygon', { class: 'radar-grid', points: polygonPoints(values, centerX, centerY, radius) }));
    }

    compareMetrics.forEach(([, label], index) => {
      const [x, y] = radarPoint(index, 100, compareMetrics.length, centerX, centerY, radius);
      const [labelX, labelY] = radarPoint(index, 121, compareMetrics.length, centerX, centerY, radius);
      svg.appendChild(svgElement('line', { class: 'radar-axis', x1: centerX, y1: centerY, x2: x, y2: y }));
      svg.appendChild(svgElement('text', { class: 'radar-label', x: labelX, y: labelY + 3 }, label));
    });

    const aValues = compareMetrics.map(([field]) => Number(a[field]));
    const bValues = compareMetrics.map(([field]) => Number(b[field]));
    svg.appendChild(svgElement('polygon', { class: 'radar-shape-b', points: polygonPoints(bValues, centerX, centerY, radius) }));
    svg.appendChild(svgElement('polygon', { class: 'radar-shape-a', points: polygonPoints(aValues, centerX, centerY, radius) }));
  }

  function topDimensions(metro) {
    return compareMetrics
      .map(([field, label]) => ({ field, label, value: Number(metro[field]) }))
      .sort((a, b) => b.value - a.value);
  }

  function updateComparison() {
    const a = findMetro(document.getElementById('metro-a').value);
    const b = findMetro(document.getElementById('metro-b').value);
    document.getElementById('city-a-name').textContent = `${a.metro}, ${a.state}`;
    document.getElementById('city-b-name').textContent = `${b.metro}, ${b.state}`;
    document.getElementById('city-a-score').textContent = Math.round(a.opportunity_score);
    document.getElementById('city-b-score').textContent = Math.round(b.opportunity_score);
    renderRadar(a, b);

    document.getElementById('comparison-metrics').innerHTML = compareMetrics.map(([field, label]) => `
      <article class="metric-compare">
        <span>${label}</span>
        <div class="metric-bars">
          <div class="metric-line"><b>A</b><i style="--w:${a[field]}%"></i><em>${Math.round(a[field])}</em></div>
          <div class="metric-line b"><b>B</b><i style="--w:${b[field]}%"></i><em>${Math.round(b[field])}</em></div>
        </div>
      </article>
    `).join('');

    const difference = Math.abs(a.opportunity_score - b.opportunity_score);
    const leader = a.opportunity_score >= b.opportunity_score ? a : b;
    const other = leader === a ? b : a;
    const leaderStrengths = topDimensions(leader).slice(0, 2).map(item => item.label.toLowerCase());
    const otherStrength = topDimensions(other)[0].label.toLowerCase();
    const verdict = difference < 4
      ? `${a.metro} and ${b.metro} are close overall. The real decision is the tradeoff: ${a.metro} is strongest in ${topDimensions(a)[0].label.toLowerCase()}, while ${b.metro} leads in ${topDimensions(b)[0].label.toLowerCase()}.`
      : `${leader.metro} leads by ${difference.toFixed(1)} points, driven primarily by ${leaderStrengths[0]} and ${leaderStrengths[1]}. ${other.metro} remains more competitive on ${otherStrength}.`;
    document.getElementById('comparison-verdict').textContent = verdict;
  }

  function initComparison() {
    const metroA = document.getElementById('metro-a');
    const metroB = document.getElementById('metro-b');
    const options = [...metros].sort((a, b) => a.metro.localeCompare(b.metro)).map(metro => `<option value="${metro.metro}">${metro.metro}, ${metro.state}</option>`).join('');
    metroA.innerHTML = options;
    metroB.innerHTML = options;
    metroA.value = 'Atlanta';
    metroB.value = 'Chicago';
    metroA.addEventListener('change', updateComparison);
    metroB.addEventListener('change', updateComparison);
    document.getElementById('swap-metros').addEventListener('click', () => {
      const temporary = metroA.value;
      metroA.value = metroB.value;
      metroB.value = temporary;
      updateComparison();
    });
    updateComparison();
  }

  function normalizeWeights(weights) {
    const total = Object.values(weights).reduce((sum, value) => sum + value, 0) || 1;
    return Object.fromEntries(Object.entries(weights).map(([key, value]) => [key, value / total]));
  }

  function scoreWithWeights(metro, weights) {
    const normalized = normalizeWeights(weights);
    return Object.entries(normalized).reduce((score, [field, weight]) => score + Number(metro[field]) * weight, 0);
  }

  function rebalanceWeights(changedField, changedValue) {
    const next = { ...currentWeights, [changedField]: changedValue };
    const otherFields = Object.keys(next).filter(field => field !== changedField);
    const remaining = Math.max(0, 100 - changedValue);
    const otherTotal = otherFields.reduce((sum, field) => sum + currentWeights[field], 0) || otherFields.length;
    let allocated = 0;
    otherFields.forEach((field, index) => {
      if (index === otherFields.length - 1) next[field] = remaining - allocated;
      else {
        next[field] = Math.max(0, Math.round((currentWeights[field] / otherTotal) * remaining));
        allocated += next[field];
      }
    });
    currentWeights = next;
  }

  function renderWeightControls() {
    const container = document.getElementById('weight-controls');
    container.innerHTML = weightDimensions.map(([field, label]) => `
      <label class="weight-row">
        <span class="weight-row-head"><span>${label}</span><span data-weight-value="${field}">${currentWeights[field]}%</span></span>
        <input type="range" min="0" max="70" step="1" value="${currentWeights[field]}" data-weight="${field}" aria-label="${label} weight">
      </label>
    `).join('');

    container.querySelectorAll('input[type="range"]').forEach(input => {
      input.style.setProperty('--fill', `${(Number(input.value) / 70) * 100}%`);
      input.addEventListener('input', () => {
        rebalanceWeights(input.dataset.weight, Number(input.value));
        updateWeightUI();
        updateRecommendations();
        document.querySelectorAll('.preset-button').forEach(button => button.classList.remove('is-active'));
      });
    });
  }

  function updateWeightUI() {
    Object.entries(currentWeights).forEach(([field, value]) => {
      const input = document.querySelector(`[data-weight="${field}"]`);
      const label = document.querySelector(`[data-weight-value="${field}"]`);
      if (input) {
        input.value = value;
        input.style.setProperty('--fill', `${(Number(value) / 70) * 100}%`);
      }
      if (label) label.textContent = `${value}%`;
    });
    document.getElementById('weight-total').textContent = `${Object.values(currentWeights).reduce((sum, value) => sum + value, 0)}%`;
  }

  function matchSummary() {
    const sorted = Object.entries(currentWeights).sort((a, b) => b[1] - a[1]);
    const name = weightDimensions.find(([field]) => field === sorted[0][0])?.[1] || 'Balanced opportunity';
    const spread = sorted[0][1] - sorted[sorted.length - 1][1];
    return spread < 12 ? 'Balanced opportunity' : `${name} weighted highest`;
  }

  function updateRecommendations() {
    recommendationRows = metros
      .map(metro => ({ ...metro, match_score: scoreWithWeights(metro, currentWeights) }))
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 5);

    document.getElementById('match-summary').textContent = matchSummary();
    const list = document.getElementById('recommendation-list');
    list.innerHTML = recommendationRows.map((metro, index) => `
      <li class="recommendation-item" data-metro="${metro.metro}" tabindex="0" role="button" aria-label="Open ${metro.metro} profile">
        <span class="recommendation-rank">0${index + 1}</span>
        <span class="recommendation-name"><strong>${metro.metro}, ${metro.state}</strong><span>${metro.headline}</span></span>
        <span class="recommendation-score"><strong>${metro.match_score.toFixed(1)}</strong><span>match</span></span>
      </li>
    `).join('');
    list.querySelectorAll('.recommendation-item').forEach(item => {
      const open = () => openMetroDialog(findMetro(item.dataset.metro));
      item.addEventListener('click', open);
      item.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
      });
    });

    const highlighted = new Set(recommendationRows.map(row => row.metro));
    updateMap(finderMap, 'opportunity_score', { highlighted, selected: recommendationRows[0].metro });
    renderFinderRankLabels();
  }

  let finderMap;
  let finderLabelLayer;

  function renderFinderRankLabels() {
    if (!finderLabelLayer) return;
    finderLabelLayer.innerHTML = '';
    recommendationRows.forEach((metro, index) => {
      const [x, y] = project(metro.longitude, metro.latitude);
      const group = svgElement('g', { transform: `translate(${x},${y})`, 'pointer-events': 'none' });
      group.appendChild(svgElement('circle', { cx: 0, cy: -19, r: 10, fill: index === 0 ? '#56f0d0' : '#111827', stroke: '#ffffff', 'stroke-opacity': '.5' }));
      group.appendChild(svgElement('text', { x: 0, y: -15.5, fill: index === 0 ? '#061019' : '#ffffff', 'font-size': '9', 'font-weight': '900', 'text-anchor': 'middle' }, String(index + 1)));
      finderLabelLayer.appendChild(group);
    });
  }

  function initFinder() {
    renderWeightControls();
    finderMap = createMap(document.getElementById('finder-map'), 'finder', { compact: true });
    finderLabelLayer = svgElement('g');
    finderMap.svg.appendChild(finderLabelLayer);

    document.querySelectorAll('.preset-button').forEach(button => {
      button.addEventListener('click', () => {
        currentWeights = { ...presets[button.dataset.preset] };
        document.querySelectorAll('.preset-button').forEach(item => item.classList.toggle('is-active', item === button));
        updateWeightUI();
        updateRecommendations();
      });
    });

    document.getElementById('randomize-weights').addEventListener('click', () => {
      const fields = Object.keys(currentWeights);
      const randomValues = fields.map(() => Math.random() + .15);
      const total = randomValues.reduce((sum, value) => sum + value, 0);
      let allocated = 0;
      fields.forEach((field, index) => {
        currentWeights[field] = index === fields.length - 1 ? 100 - allocated : Math.round((randomValues[index] / total) * 100);
        allocated += currentWeights[field];
      });
      document.querySelectorAll('.preset-button').forEach(item => item.classList.remove('is-active'));
      updateWeightUI();
      updateRecommendations();
    });

    updateWeightUI();
    updateRecommendations();
  }

  function openMetroDialog(metro) {
    dialogContent.innerHTML = `
      <section class="dialog-hero">
        <p class="eyebrow">Rank #${metro.rank} · ${metro.profile}</p>
        <div class="dialog-title-row">
          <h2>${metro.metro}, ${metro.state}</h2>
          <div class="dialog-score"><strong>${metro.opportunity_score.toFixed(1)}</strong><span>Opportunity score</span></div>
        </div>
        <p>${metro.headline}</p>
      </section>
      <section class="dialog-grid">
        <article class="dialog-metric"><span>Career score</span><strong>${metro.career_score.toFixed(1)}</strong></article>
        <article class="dialog-metric"><span>Affordability</span><strong>${metro.affordability_score.toFixed(1)}</strong></article>
        <article class="dialog-metric"><span>Education depth</span><strong>${metro.education_score.toFixed(1)}</strong></article>
        <article class="dialog-metric"><span>Resident employment growth</span><strong>${signedPercent(metro.resident_employment_growth_pct)}</strong></article>
        <article class="dialog-metric"><span>Median worker earnings</span><strong>${currency(metro.median_worker_earnings)}</strong></article>
        <article class="dialog-metric"><span>Median gross rent</span><strong>${currency(metro.median_gross_rent)}</strong></article>
        <article class="dialog-metric"><span>Earnings less annual rent</span><strong>${currency(metro.earnings_after_rent)}</strong></article>
        <article class="dialog-metric"><span>Employment-to-population</span><strong>${metro.employment_population_ratio_pct.toFixed(1)}%</strong></article>
        <article class="dialog-metric"><span>Bachelor’s attainment</span><strong>${metro.bachelor_share_pct.toFixed(1)}%</strong></article>
        <article class="dialog-metric"><span>Population growth</span><strong>${signedPercent(metro.population_growth_pct)}</strong></article>
        <article class="dialog-metric"><span>Broadband subscription</span><strong>${metro.broadband_subscription_pct.toFixed(1)}%</strong></article>
      </section>
    `;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }

  function initDialog() {
    closeDialogButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const rect = dialog.getBoundingClientRect();
      const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
      if (outside) dialog.close();
    });
  }

  function initCursorGlow() {
    const glow = document.querySelector('.cursor-glow');
    if (!glow || reducedMotion || window.matchMedia('(pointer: coarse)').matches) return;
    window.addEventListener('pointermove', event => {
      glow.style.transform = `translate(${event.clientX - 224}px, ${event.clientY - 224}px)`;
    }, { passive: true });
  }

  function initHeader() {
    const header = document.querySelector('.site-header');
    const update = () => {
      const opacity = Math.min(0.94, Math.max(0, window.scrollY / 300));
      header.style.background = `rgba(6, 9, 18, ${opacity})`;
      header.style.borderBottom = opacity > .5 ? '1px solid rgba(255,255,255,.08)' : '1px solid transparent';
      header.style.backdropFilter = opacity > .2 ? 'blur(14px)' : 'none';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function init() {
    renderHero();
    initStory();
    initConstellation();
    initComparison();
    initFinder();
    initDialog();
    initCursorGlow();
    initHeader();
  }

  init();
})();
