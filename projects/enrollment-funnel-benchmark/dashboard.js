// Global data storage
let rawData = [];
let filteredData = [];
let currentScenario = {
    app_rate: 0.25,
    offer_rate: 0.70,
    enroll_rate: 0.35,
    start_inquiries: 1000
};
const PRIORITY_CHANNELS = ['School Counselor', 'Referral', 'Campus Visit'];

// Load data on page load
document.addEventListener('DOMContentLoaded', async function() {
    await loadData();
    populateFilters();
    applyGlobalFilters();
    setupEventListeners();
});

// Load CSV data
async function loadData() {
    const response = await fetch('data/enrollment_funnel_synthetic.csv');
    const csvText = await response.text();
    rawData = Papa.parse(csvText, { header: true }).data.filter(row => row.student_id);
    filteredData = rawData;
    updateKPIs();
}

// Setup event listeners
function setupEventListeners() {
    // Scenario sliders
    document.getElementById('scenario-app-rate').addEventListener('input', updateScenarioDisplay);
    document.getElementById('scenario-offer-rate').addEventListener('input', updateScenarioDisplay);
    document.getElementById('scenario-enroll-rate').addEventListener('input', updateScenarioDisplay);
    
    // Scenario buttons
    document.getElementById('scenario-update-btn').addEventListener('click', updateScenarioCharts);
    document.getElementById('scenario-reset-btn').addEventListener('click', resetScenario);
    
    // Global filter changes
    document.getElementById('source-filter').addEventListener('change', handleCheckboxFilterChange);
    document.getElementById('geography-filter').addEventListener('change', handleCheckboxFilterChange);
    document.getElementById('major-filter').addEventListener('change', handleCheckboxFilterChange);

    // Segment drilldown filter changes (composes with global filters)
    document.getElementById('segment-filter').addEventListener('change', renderSegmentCharts);
    document.getElementById('program-filter').addEventListener('change', renderSegmentCharts);
}

// Populate filters
function populateFilters() {
    const studentTypes = [...new Set(rawData.map(d => d.student_type).filter(Boolean))];
    const programs = [...new Set(rawData.map(d => d.academic_program).filter(Boolean))];
    const sources = [...new Set(rawData.map(d => d.source_channel).filter(Boolean))].sort();
    const geographies = [...new Set(rawData.map(d => d.market_geography).filter(Boolean))].sort();
    const majors = [...new Set(rawData.map(d => d.academic_program).filter(Boolean))].sort();
    
    const segmentFilter = document.getElementById('segment-filter');
    const programFilter = document.getElementById('program-filter');
    
    studentTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        segmentFilter.appendChild(option);
    });
    
    programs.forEach(prog => {
        const option = document.createElement('option');
        option.value = prog;
        option.textContent = prog;
        programFilter.appendChild(option);
    });

    populateCheckboxGroup('source-filter', 'source', sources);
    populateCheckboxGroup('geography-filter', 'geography', geographies);
    populateCheckboxGroup('major-filter', 'major', majors);
}

function populateCheckboxGroup(containerId, groupName, values) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const allId = `${groupName}-all`;
    container.innerHTML = `
        <label class="filter-check">
            <input type="checkbox" data-group="${groupName}" data-role="all" id="${allId}" checked>
            <span>All</span>
        </label>
        ${values.map((value, index) => `
            <label class="filter-check">
                <input type="checkbox" data-group="${groupName}" data-role="item" value="${value}" id="${groupName}-item-${index}">
                <span>${value}</span>
            </label>
        `).join('')}
    `;
}

function selectedCheckboxValues(groupName) {
    return Array.from(document.querySelectorAll(`input[data-group="${groupName}"][data-role="item"]:checked`))
        .map(input => input.value);
}

function handleCheckboxFilterChange(event) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.type !== 'checkbox') return;
    const group = target.dataset.group;
    const role = target.dataset.role;
    if (!group || !role) return;

    const allCheckbox = document.querySelector(`input[data-group="${group}"][data-role="all"]`);
    const itemCheckboxes = Array.from(document.querySelectorAll(`input[data-group="${group}"][data-role="item"]`));

    if (role === 'all' && target.checked) {
        itemCheckboxes.forEach(input => {
            input.checked = false;
        });
    }

    if (role === 'item' && target.checked && allCheckbox) {
        allCheckbox.checked = false;
    }

    if (role === 'item' && allCheckbox && !itemCheckboxes.some(input => input.checked)) {
        allCheckbox.checked = true;
    }

    if (role === 'all' && !target.checked && !itemCheckboxes.some(input => input.checked)) {
        target.checked = true;
    }

    applyGlobalFilters();
}

function applyGlobalFilters() {
    const selectedSources = selectedCheckboxValues('source');
    const selectedGeographies = selectedCheckboxValues('geography');
    const selectedMajors = selectedCheckboxValues('major');

    filteredData = rawData.filter(row => {
        if (selectedSources.length && !selectedSources.includes(row.source_channel)) return false;
        if (selectedGeographies.length && !selectedGeographies.includes(row.market_geography)) return false;
        if (selectedMajors.length && !selectedMajors.includes(row.academic_program)) return false;
        return true;
    });

    updateKPIs();
    updateAllCharts();
    updateScenarioDisplay();
    updateScenarioCharts();
}

function getSegmentFilteredData() {
    const studentType = document.getElementById('segment-filter').value;
    const program = document.getElementById('program-filter').value;

    return filteredData.filter(row => {
        if (studentType !== 'all' && row.student_type !== studentType) return false;
        if (program !== 'all' && row.academic_program !== program) return false;
        return true;
    });
}

// Update KPI cards
function updateKPIs() {
    const totalInquiries = filteredData.length;
    const applications = filteredData.filter(d => d.application_flag === '1').length;
    const offers = filteredData.filter(d => d.offer_flag === '1').length;
    const enrollments = filteredData.filter(d => d.enrollment_flag === '1').length;
    
    const appRate = totalInquiries > 0 ? ((applications / totalInquiries) * 100).toFixed(1) : 0;
    const offerRate = applications > 0 ? ((offers / applications) * 100).toFixed(1) : 0;
    const enrollRate = offers > 0 ? ((enrollments / offers) * 100).toFixed(1) : 0;
    
    document.getElementById('kpi-inquiries').textContent = totalInquiries.toLocaleString();
    document.getElementById('kpi-app-rate').textContent = appRate + '%';
    document.getElementById('kpi-offer-rate').textContent = offerRate + '%';
    document.getElementById('kpi-enroll-rate').textContent = enrollRate + '%';
}

// Update scenario display
function updateScenarioDisplay() {
    const appRate = (parseFloat(document.getElementById('scenario-app-rate').value) * 100).toFixed(0);
    const offerRate = (parseFloat(document.getElementById('scenario-offer-rate').value) * 100).toFixed(0);
    const enrollRate = (parseFloat(document.getElementById('scenario-enroll-rate').value) * 100).toFixed(0);
    
    document.getElementById('scenario-app-display').textContent = appRate + '%';
    document.getElementById('scenario-offer-display').textContent = offerRate + '%';
    document.getElementById('scenario-enroll-display').textContent = enrollRate + '%';
}

// Update scenario calculations
function updateScenarioCharts() {
    currentScenario.app_rate = parseFloat(document.getElementById('scenario-app-rate').value);
    currentScenario.offer_rate = parseFloat(document.getElementById('scenario-offer-rate').value);
    currentScenario.enroll_rate = parseFloat(document.getElementById('scenario-enroll-rate').value);
    currentScenario.start_inquiries = parseInt(document.getElementById('scenario-inquiries').value);
    
    const apps = Math.round(currentScenario.start_inquiries * currentScenario.app_rate);
    const offers = Math.round(apps * currentScenario.offer_rate);
    const enrollments = Math.round(offers * currentScenario.enroll_rate);
    const overall = ((enrollments / currentScenario.start_inquiries) * 100).toFixed(2);
    
    document.getElementById('scenario-apps-result').textContent = apps.toLocaleString();
    document.getElementById('scenario-offers-result').textContent = offers.toLocaleString();
    document.getElementById('scenario-enrollments-result').textContent = enrollments.toLocaleString();
    document.getElementById('scenario-overall-result').textContent = overall + '%';
    
    renderScenarioComparison();
}

// Reset scenario
function resetScenario() {
    const totalInquiries = filteredData.length;
    const applications = filteredData.filter(d => d.application_flag === '1').length;
    const offers = filteredData.filter(d => d.offer_flag === '1').length;
    const enrollments = filteredData.filter(d => d.enrollment_flag === '1').length;
    
    const appRate = totalInquiries > 0 ? applications / totalInquiries : 0;
    const offerRate = applications > 0 ? offers / applications : 0;
    const enrollRate = offers > 0 ? enrollments / offers : 0;
    
    document.getElementById('scenario-app-rate').value = appRate;
    document.getElementById('scenario-offer-rate').value = offerRate;
    document.getElementById('scenario-enroll-rate').value = enrollRate;
    document.getElementById('scenario-inquiries').value = totalInquiries;
    
    updateScenarioDisplay();
    updateScenarioCharts();
}

// Render all charts
function updateAllCharts() {
    renderWaterfallChart();
    renderVelocityChart();
    renderBenchmarkChart();
    renderExecutiveInsights();
    renderFunnelBarChart();
    renderExitRateChart();
    renderFunnelDetailChart();
    renderSourceChart();
    renderGeographyChart();
    renderSourcePerformanceChart();
    renderSegmentCharts();
}

function safeRate(numerator, denominator) {
    return denominator > 0 ? numerator / denominator : 0;
}

function formatPct(value) {
    return (value * 100).toFixed(1) + '%';
}

function renderExecutiveInsights() {
    const totalInquiries = filteredData.length;
    const insightsContainer = document.getElementById('summary-key-insights');
    const nextStepsContainer = document.getElementById('summary-next-steps');
    if (!insightsContainer || !nextStepsContainer) return;
    if (totalInquiries === 0) {
        insightsContainer.innerHTML = '<li>No data available for the current filter combination.</li>';
        nextStepsContainer.innerHTML = '<li>Clear one or more filters to restore actionable guidance.</li>';
        return;
    }

    const applications = filteredData.filter(d => d.application_flag === '1').length;
    const offers = filteredData.filter(d => d.offer_flag === '1').length;
    const enrollments = filteredData.filter(d => d.enrollment_flag === '1').length;

    const appLoss = totalInquiries - applications;
    const offerLoss = applications - offers;
    const enrollLoss = offers - enrollments;
    const stageLosses = [
        { stage: 'Inquiry to Application', count: appLoss, rate: safeRate(appLoss, totalInquiries) },
        { stage: 'Application to Offer', count: offerLoss, rate: safeRate(offerLoss, applications) },
        { stage: 'Offer to Enrollment', count: enrollLoss, rate: safeRate(enrollLoss, offers) }
    ].sort((a, b) => b.count - a.count);
    const largestLeak = stageLosses[0];

    const channels = [...new Set(filteredData.map(d => d.source_channel).filter(Boolean))]
        .map(channel => {
            const rows = filteredData.filter(d => d.source_channel === channel);
            const channelEnrollments = rows.filter(d => d.enrollment_flag === '1').length;
            return {
                channel,
                count: rows.length,
                rate: safeRate(channelEnrollments, rows.length)
            };
        })
        .filter(item => item.count > 0)
        .sort((a, b) => b.rate - a.rate);

    const topChannel = channels[0];
    const lowChannel = channels[channels.length - 1];
    const priorityStats = PRIORITY_CHANNELS.map(channel => channels.find(item => item.channel === channel)).filter(Boolean);

    const cyclePerformance = [...new Set(filteredData.map(d => d.cycle_year).filter(Boolean))]
        .map(cycle => {
            const rows = filteredData.filter(d => d.cycle_year === cycle);
            const cycleEnrollments = rows.filter(d => d.enrollment_flag === '1').length;
            return { cycle, rate: safeRate(cycleEnrollments, rows.length), count: rows.length };
        })
        .sort((a, b) => b.rate - a.rate);

    const bestCycle = cyclePerformance[0];

    const overallRate = safeRate(enrollments, totalInquiries);
    const inquiryToApp = safeRate(applications, totalInquiries);
    const appToOffer = safeRate(offers, applications);
    const offerToEnroll = safeRate(enrollments, offers);

    const insights = [
        `Overall inquiry-to-enrollment conversion is ${formatPct(overallRate)} (${enrollments.toLocaleString()} of ${totalInquiries.toLocaleString()}).`,
        `Largest leakage happens at ${largestLeak.stage} with ${largestLeak.count.toLocaleString()} students lost (${formatPct(largestLeak.rate)} stage loss).`,
        topChannel && lowChannel
            ? `Source spread is material: ${topChannel.channel} converts at ${formatPct(topChannel.rate)} vs ${lowChannel.channel} at ${formatPct(lowChannel.rate)}.`
            : 'Source-level conversion differences are unavailable for the current filter.',
        bestCycle
            ? `Best cycle is ${bestCycle.cycle} at ${formatPct(bestCycle.rate)} inquiry-to-enrollment conversion.`
            : 'Cycle comparison is unavailable for the current filter.'
    ];

    const nextSteps = [
        `Prioritize the two biggest leaks first: Inquiry -> Application (${formatPct(safeRate(appLoss, totalInquiries))} loss) and Offer -> Enrollment (${formatPct(safeRate(enrollLoss, offers))} loss).`,
        priorityStats.length
            ? `Prioritize reach and conversion investment in ${priorityStats.map(item => `${item.channel} (${formatPct(item.rate)})`).join(', ')}.`
            : 'Re-balance source mix based on conversion and volume once channel-level sample sizes are sufficient.',
        `Set cycle targets using the current stage baselines: Inq->App ${formatPct(inquiryToApp)}, App->Offer ${formatPct(appToOffer)}, Offer->Enroll ${formatPct(offerToEnroll)}.`,
        'Channel growth plan: increase qualified inquiry volume from School Counselor, Referral, Campus Visit by 10-15%.',
        'Message test plan: interview juniors/seniors on decision drivers, convert top reasons into campaign messaging tests, and track conversion lift by source.'
    ];

    insightsContainer.innerHTML = insights.map(text => `<li>${text}</li>`).join('');
    nextStepsContainer.innerHTML = nextSteps.map(text => `<li>${text}</li>`).join('');
}

// Waterfall Chart
function renderWaterfallChart() {
    const totalInquiries = filteredData.length;
    const applications = filteredData.filter(d => d.application_flag === '1').length;
    const offers = filteredData.filter(d => d.offer_flag === '1').length;
    const enrollments = filteredData.filter(d => d.enrollment_flag === '1').length;
    
    const lossAppStage = totalInquiries - applications;
    const lossOfferStage = applications - offers;
    const lossEnrollStage = offers - enrollments;
    
    const trace = {
        x: ['Inquiries', 'Lost (Inquiry→App)', 'Lost (App→Offer)', 'Lost (Offer→Enroll)', 'Final Enrollments'],
        y: [totalInquiries, -lossAppStage, -lossOfferStage, -lossEnrollStage, enrollments],
        measure: ['absolute', 'relative', 'relative', 'relative', 'total'],
        type: 'waterfall',
        orientation: 'v',
        connector: { line: { color: '#3498db' } },
        increasing: { marker: { color: '#27ae60' } },
        decreasing: { marker: { color: '#e74c3c' } },
        totals: { marker: { color: '#27ae60' } },
        textposition: 'outside',
        text: [
            totalInquiries.toLocaleString(),
            '-' + lossAppStage.toLocaleString(),
            '-' + lossOfferStage.toLocaleString(),
            '-' + lossEnrollStage.toLocaleString(),
            enrollments.toLocaleString()
        ],
        hovertemplate: '<b>%{x}</b><br>Count: %{y:,.0f}<extra></extra>'
    };
    
    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        margin: { l: 50, r: 50, t: 30, b: 50 },
        hovermode: 'closest',
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        yaxis: { gridcolor: '#ecf0f1', title: 'Student Count' }
    };
    
    Plotly.newPlot('waterfall-chart', [trace], layout, { responsive: true });
}

// Enrollment Velocity Chart
function renderVelocityChart() {
    const daysToApp = filteredData
        .filter(d => d.application_flag === '1' && d.days_inquiry_to_app)
        .map(d => parseFloat(d.days_inquiry_to_app));
    
    const daysToOffer = filteredData
        .filter(d => d.offer_flag === '1' && d.days_app_to_offer)
        .map(d => parseFloat(d.days_app_to_offer));
    
    const daysToEnroll = filteredData
        .filter(d => d.enrollment_flag === '1' && d.days_offer_to_enroll)
        .map(d => parseFloat(d.days_offer_to_enroll));
    
    const trace1 = {
        y: daysToApp,
        name: 'Inquiry → App',
        type: 'box',
        marker: { color: '#3498db' }
    };
    
    const trace2 = {
        y: daysToOffer,
        name: 'App → Offer',
        type: 'box',
        marker: { color: '#f39c12' }
    };
    
    const trace3 = {
        y: daysToEnroll,
        name: 'Offer → Enroll',
        type: 'box',
        marker: { color: '#27ae60' }
    };
    
    const layout = {
        title: { text: '', font: { size: 14 } },
        yaxis: { title: 'Days', gridcolor: '#ecf0f1' },
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        margin: { l: 50, r: 50, t: 30, b: 50 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };
    
    Plotly.newPlot('velocity-chart', [trace1, trace2, trace3], layout, { responsive: true });
}

// Benchmark Comparison Chart
function renderBenchmarkChart() {
    const totalInquiries = filteredData.length;
    const applications = filteredData.filter(d => d.application_flag === '1').length;
    const offers = filteredData.filter(d => d.offer_flag === '1').length;
    const enrollments = filteredData.filter(d => d.enrollment_flag === '1').length;
    
    const appRate = totalInquiries > 0 ? (applications / totalInquiries) * 100 : 0;
    const offerRate = applications > 0 ? (offers / applications) * 100 : 0;
    const enrollRate = offers > 0 ? (enrollments / offers) * 100 : 0;
    
    const trace1 = {
        x: ['Inq → App', 'App → Offer', 'Offer → Enroll'],
        y: [appRate, offerRate, enrollRate],
        type: 'bar',
        name: 'Actual',
        marker: { color: '#3498db' }
    };
    
    const trace2 = {
        x: ['Inq → App', 'App → Offer', 'Offer → Enroll'],
        y: [30, 70, 35],
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Benchmark',
        line: { color: '#e74c3c', width: 3, dash: 'dash' },
        marker: { size: 10 }
    };
    
    const layout = {
        barmode: 'group',
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        yaxis: { title: 'Conversion Rate (%)', gridcolor: '#ecf0f1' },
        margin: { l: 60, r: 50, t: 30, b: 50 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };
    
    Plotly.newPlot('benchmark-chart', [trace1, trace2], layout, { responsive: true });
}

// Funnel Bar Chart
function renderFunnelBarChart() {
    const stages = ['Inquiries', 'Applications', 'Offers', 'Enrollments'];
    const totalInquiries = filteredData.length;
    const applications = filteredData.filter(d => d.application_flag === '1').length;
    const offers = filteredData.filter(d => d.offer_flag === '1').length;
    const enrollments = filteredData.filter(d => d.enrollment_flag === '1').length;
    
    const counts = [totalInquiries, applications, offers, enrollments];
    const colors = ['#3498db', '#f39c12', '#9b59b6', '#27ae60'];
    
    const trace = {
        x: stages,
        y: counts,
        type: 'bar',
        marker: { color: colors },
        text: counts.map(c => c.toLocaleString()),
        textposition: 'outside',
        hovertemplate: '<b>%{x}</b><br>Count: %{y:,.0f}<extra></extra>'
    };
    
    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        yaxis: { title: 'Count', gridcolor: '#ecf0f1' },
        xaxis: { tickangle: 0 },
        margin: { l: 60, r: 50, t: 30, b: 50 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };
    
    Plotly.newPlot('funnel-bar-chart', [trace], layout, { responsive: true });
}

// Exit Rate Chart
function renderExitRateChart() {
    const stageNames = ['Inq → App', 'App → Offer', 'Offer → Enroll'];
    const totalInquiries = filteredData.length;
    const applications = filteredData.filter(d => d.application_flag === '1').length;
    const offers = filteredData.filter(d => d.offer_flag === '1').length;
    const enrollments = filteredData.filter(d => d.enrollment_flag === '1').length;
    
    const exitRates = [
        ((totalInquiries - applications) / totalInquiries * 100).toFixed(1),
        ((applications - offers) / applications * 100).toFixed(1),
        ((offers - enrollments) / offers * 100).toFixed(1)
    ];
    
    const trace = {
        x: stageNames,
        y: exitRates,
        type: 'bar',
        marker: { color: '#e74c3c' },
        text: exitRates.map(r => r + '%'),
        textposition: 'outside',
        hovertemplate: '<b>%{x}</b><br>Exit Rate: %{y}%<extra></extra>'
    };
    
    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        yaxis: { title: 'Exit Rate (%)', gridcolor: '#ecf0f1 ' },
        margin: { l: 60, r: 50, t: 30, b: 50 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };
    
    Plotly.newPlot('exit-rate-chart', [trace], layout, { responsive: true });
}

// Funnel Detail Chart
function renderFunnelDetailChart() {
    const studentTypes = [...new Set(filteredData.map(d => d.student_type).filter(Boolean))];
    
    const traces = studentTypes.map(type => {
        const typeData = filteredData.filter(d => d.student_type === type);
        const totalInquiries = typeData.length;
        const applications = typeData.filter(d => d.application_flag === '1').length;
        const offers = typeData.filter(d => d.offer_flag === '1').length;
        const enrollments = typeData.filter(d => d.enrollment_flag === '1').length;
        
        return {
            x: ['Inquiries', 'Applications', 'Offers', 'Enrollments'],
            y: [totalInquiries, applications, offers, enrollments],
            name: type,
            type: 'scatter',
            mode: 'lines+markers',
            marker: { size: 10 }
        };
    });
    
    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        yaxis: { title: 'Count', gridcolor: '#ecf0f1' },
        margin: { l: 60, r: 50, t: 30, b: 50 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };
    
    Plotly.newPlot('funnel-detail-chart', traces, layout, { responsive: true });
}

// Source Channel Chart
function renderSourceChart() {
    const sources = [...new Set(filteredData.map(d => d.source_channel).filter(Boolean))];
    
    const sourceData = sources.map(source => {
        const sourceRecords = filteredData.filter(d => d.source_channel === source);
        const conversions = sourceRecords.filter(d => d.enrollment_flag === '1').length;
        const rate = sourceRecords.length > 0 ? (conversions / sourceRecords.length) * 100 : 0;
        return { source, count: sourceRecords.length, conversions, rate };
    }).sort((a, b) => b.rate - a.rate);
    
    const trace = {
        x: sourceData.map(d => d.source),
        y: sourceData.map(d => d.rate),
        type: 'bar',
        marker: { color: '#3498db' },
        text: sourceData.map(d => d.rate.toFixed(1) + '%'),
        textposition: 'outside',
        hovertemplate: '<b>%{x}</b><br>Conversion: %{y:.1f}%<extra></extra>'
    };
    
    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        yaxis: { title: 'Conversion Rate to Enrollment (%)', gridcolor: '#ecf0f1' },
        xaxis: { tickangle: -45 },
        margin: { l: 60, r: 50, t: 30, b: 80 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };
    
    Plotly.newPlot('source-chart', [trace], layout, { responsive: true });
}

// Geographic Distribution Chart
function renderGeographyChart() {
    const geos = [...new Set(filteredData.map(d => d.market_geography).filter(Boolean))];
    
    const geoData = geos.map(geo => {
        const geoRecords = filteredData.filter(d => d.market_geography === geo);
        return { geo, count: geoRecords.length };
    }).sort((a, b) => b.count - a.count);
    
    const trace = {
        labels: geoData.map(d => d.geo),
        values: geoData.map(d => d.count),
        type: 'pie',
        hovertemplate: '<b>%{label}</b><br>Count: %{value}<br>Pct: %{percent}<extra></extra>'
    };
    
    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        margin: { l: 50, r: 50, t: 30, b: 50 }
    };
    
    Plotly.newPlot('geography-chart', [trace], layout, { responsive: true });
}

// Source Performance Matrix
function renderSourcePerformanceChart() {
    const sources = [...new Set(filteredData.map(d => d.source_channel).filter(Boolean))];
    
    const performanceData = sources.map(source => {
        const sourceRecords = filteredData.filter(d => d.source_channel === source);
        const appRate = sourceRecords.length > 0 ? (sourceRecords.filter(d => d.application_flag === '1').length / sourceRecords.length) * 100 : 0;
        const enrollRate = sourceRecords.length > 0 ? (sourceRecords.filter(d => d.enrollment_flag === '1').length / sourceRecords.length) * 100 : 0;
        return {
            source,
            volume: sourceRecords.length,
            appRate: parseFloat(appRate.toFixed(1)),
            enrollRate: parseFloat(enrollRate.toFixed(1))
        };
    });
    
    const trace = {
        x: performanceData.map(d => d.appRate),
        y: performanceData.map(d => d.enrollRate),
        mode: 'markers+text',
        type: 'scatter',
        text: performanceData.map(d => d.source),
        textposition: 'top center',
        marker: {
            size: performanceData.map(d => Math.sqrt(d.volume / 2)),
            color: performanceData.map(d => d.enrollRate),
            colorscale: 'Viridis',
            showscale: true,
            colorbar: { title: 'Enrollment %' }
        },
        hovertemplate: '<b>%{text}</b><br>App Rate: %{x:.1f}%<br>Enrollment Rate: %{y:.1f}%<extra></extra>'
    };
    
    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        xaxis: { title: 'Application Rate (%)', gridcolor: '#ecf0f1' },
        yaxis: { title: 'Enrollment Rate (%)', gridcolor: '#ecf0f1' },
        margin: { l: 70, r: 70, t: 30, b: 70 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };
    
    Plotly.newPlot('source-performance-chart', [trace], layout, { responsive: true });
}

// Segment Type Chart
function renderSegmentTypeChart() {
    const segmentRows = getSegmentFilteredData();
    if (!segmentRows.length) {
        renderNoDataChart('segment-type-chart', 'No segment data for current filters.');
        return;
    }

    const types = [...new Set(segmentRows.map(d => d.student_type).filter(Boolean))];
    
    const typeData = types.map(type => {
        const typeRecords = segmentRows.filter(d => d.student_type === type);
        const appRate = typeRecords.length > 0 ? (typeRecords.filter(d => d.application_flag === '1').length / typeRecords.length) * 100 : 0;
        const offerRate = typeRecords.length > 0 ? (typeRecords.filter(d => d.offer_flag === '1').length / typeRecords.length) * 100 : 0;
        const enrollRate = typeRecords.length > 0 ? (typeRecords.filter(d => d.enrollment_flag === '1').length / typeRecords.length) * 100 : 0;
        return { type, appRate, offerRate, enrollRate };
    });
    
    const trace1 = {
        x: typeData.map(d => d.type),
        y: typeData.map(d => d.appRate),
        name: 'Inquiry → App',
        type: 'bar',
        marker: { color: '#3498db' }
    };
    
    const trace2 = {
        x: typeData.map(d => d.type),
        y: typeData.map(d => d.offerRate),
        name: 'App → Offer',
        type: 'bar',
        marker: { color: '#f39c12' }
    };
    
    const trace3 = {
        x: typeData.map(d => d.type),
        y: typeData.map(d => d.enrollRate),
        name: 'Offer → Enroll',
        type: 'bar',
        marker: { color: '#27ae60' }
    };
    
    const layout = {
        barmode: 'group',
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        yaxis: { title: 'Conversion Rate (%)', gridcolor: '#ecf0f1' },
        margin: { l: 60, r: 50, t: 30, b: 50 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };
    
    Plotly.newPlot('segment-type-chart', [trace1, trace2, trace3], layout, { responsive: true });
}

function academicIndexToGpa(academicIndex) {
    if (isNaN(academicIndex)) return NaN;
    return Math.min(4.0, Math.max(0.0, academicIndex / 25));
}

function formatGpaBand(start) {
    return `${start.toFixed(1)}-${(start + 0.5).toFixed(1)}`;
}

// GPA Band Chart
function renderGpaChart() {
    const segmentRows = getSegmentFilteredData();
    if (!segmentRows.length) {
        renderNoDataChart('gpa-chart', 'No GPA data for current filters.');
        return;
    }

    // The synthetic dataset stores academic strength on a 0-100 scale, so normalize it
    // to a 0.0-4.0 GPA display scale for this chart.
    const trainingData = segmentRows.map(d => ({
        gpa: academicIndexToGpa(parseFloat(d.academic_index)),
        enrolled: d.enrollment_flag === '1' ? 1 : 0
    })).filter(d => !isNaN(d.gpa));
    if (!trainingData.length) {
        renderNoDataChart('gpa-chart', 'No GPA data for current filters.');
        return;
    }
    
    const bandStarts = Array.from({ length: 8 }, (_, index) => index * 0.5);
    const bins = Object.fromEntries(
        bandStarts.map(start => [start.toFixed(1), { total: 0, enrolled: 0 }])
    );

    trainingData.forEach(d => {
        const clampedGpa = Math.min(4.0, Math.max(0.0, d.gpa));
        const bandStart = clampedGpa >= 4.0 ? 3.5 : Math.floor(clampedGpa / 0.5) * 0.5;
        const bandKey = bandStart.toFixed(1);
        bins[bandKey].total++;
        bins[bandKey].enrolled += d.enrolled;
    });
    
    const bandLabels = bandStarts.map(formatGpaBand);
    const enrollmentRates = bandStarts.map(start => {
        const band = bins[start.toFixed(1)];
        if (!band.total) return null;
        const rate = (band.enrolled / band.total) * 100;
        return parseFloat(rate.toFixed(1));
    });
    
    const trace = {
        x: bandLabels,
        y: enrollmentRates,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Enrollment Rate',
        line: { color: '#e74c3c', width: 3 },
        marker: { size: 8 },
        fill: 'tozeroy',
        fillcolor: 'rgba(231, 76, 60, 0.2)',
        connectgaps: false,
        hovertemplate: '<b>GPA Band: %{x}</b><br>Enrollment Rate: %{y:.1f}%<extra></extra>'
    };
    
    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        xaxis: { title: 'GPA Band' },
        yaxis: { title: 'Enrollment Rate (%)', gridcolor: '#ecf0f1' },
        margin: { l: 70, r: 50, t: 30, b: 70 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };
    
    Plotly.newPlot('gpa-chart', [trace], layout, { responsive: true });
}

// Program Comparison Chart
function renderProgramChart() {
    const segmentRows = getSegmentFilteredData();
    if (!segmentRows.length) {
        renderNoDataChart('program-chart', 'No program data for current filters.');
        return;
    }

    const programs = [...new Set(segmentRows.map(d => d.academic_program).filter(Boolean))];
    
    const programData = programs.map(prog => {
        const progRecords = segmentRows.filter(d => d.academic_program === prog);
        const count = progRecords.length;
        const enrolled = progRecords.filter(d => d.enrollment_flag === '1').length;
        const rate = count > 0 ? (enrolled / count) * 100 : 0;
        return { prog, count, enrolled, rate };
    }).sort((a, b) => b.rate - a.rate);
    
    const trace = {
        x: programData.map(d => d.prog),
        y: programData.map(d => d.rate),
        type: 'bar',
        marker: { color: programData.map(d => d.rate), colorscale: 'Greens' },
        text: programData.map(d => d.rate.toFixed(1) + '%'),
        textposition: 'outside',
        hovertemplate: '<b>%{x}</b><br>Enrollment Rate: %{y:.1f}%<extra></extra>'
    };
    
    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        yaxis: { title: 'Enrollment Rate (%)', gridcolor: '#ecf0f1' },
        xaxis: { tickangle: -45 },
        margin: { l: 60, r: 50, t: 30, b: 80 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };
    
    Plotly.newPlot('program-chart', [trace], layout, { responsive: true });
}

function renderSegmentCharts() {
    renderSegmentTypeChart();
    renderGpaChart();
    renderProgramChart();
}

function renderNoDataChart(chartId, message) {
    Plotly.newPlot(chartId, [], {
        annotations: [{
            text: message,
            xref: 'paper',
            yref: 'paper',
            x: 0.5,
            y: 0.5,
            showarrow: false,
            font: { size: 14, color: '#6b7280' }
        }],
        xaxis: { visible: false },
        yaxis: { visible: false },
        margin: { l: 20, r: 20, t: 30, b: 20 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent'
    }, { responsive: true });
}

// Scenario Comparison Chart
function renderScenarioComparison() {
    const currentApps = filteredData.filter(d => d.application_flag === '1').length;
    const currentOffers = filteredData.filter(d => d.offer_flag === '1').length;
    const currentEnrollments = filteredData.filter(d => d.enrollment_flag === '1').length;
    
    const scenarioApps = Math.round(currentScenario.start_inquiries * currentScenario.app_rate);
    const scenarioOffers = Math.round(scenarioApps * currentScenario.offer_rate);
    const scenarioEnrollments = Math.round(scenarioOffers * currentScenario.enroll_rate);
    
    const trace1 = {
        x: ['Applications', 'Offers', 'Enrollments'],
        y: [currentApps, currentOffers, currentEnrollments],
        name: 'Current',
        type: 'bar',
        marker: { color: '#95a5a6' }
    };
    
    const trace2 = {
        x: ['Applications', 'Offers', 'Enrollments'],
        y: [scenarioApps, scenarioOffers, scenarioEnrollments],
        name: 'Scenario',
        type: 'bar',
        marker: { color: '#3498db' }
    };
    
    const layout = {
        barmode: 'group',
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        yaxis: { title: 'Projected Count', gridcolor: '#ecf0f1' },
        margin: { l: 70, r: 50, t: 30, b: 50 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };
    
    Plotly.newPlot('scenario-comparison-chart', [trace1, trace2], layout, { responsive: true });
}
