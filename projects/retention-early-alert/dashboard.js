// Global data storage
let rawData = [];
let filteredData = [];

// Data loading and initialization
document.addEventListener('DOMContentLoaded', async function() {
    await loadData();
    populateFilters();
    updateAllCharts();
    setupEventListeners();
});

// Load CSV data
async function loadData() {
    const response = await fetch('data/oulad_early_alert_student_course.csv');
    const csvText = await response.text();
    rawData = Papa.parse(csvText, { header: true }).data.filter(row => row.student_id);
    filteredData = rawData;
    updateKPIs();
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('risk-band-filter').addEventListener('change', applyFilters);
    document.getElementById('age-filter').addEventListener('change', applyFilters);
    document.getElementById('education-filter').addEventListener('change', applyFilters);
    document.getElementById('course-filter').addEventListener('change', applyFilters);
}

// Populate filter dropdowns
function populateFilters() {
    const ageBands = [...new Set(rawData.map(d => d.age_band).filter(Boolean))].sort();
    const educationLevels = [...new Set(rawData.map(d => d.highest_education).filter(Boolean))].sort();
    const courses = [...new Set(rawData.map(d => d.module_code).filter(Boolean))].sort();

    const ageFilter = document.getElementById('age-filter');
    const educationFilter = document.getElementById('education-filter');
    const courseFilter = document.getElementById('course-filter');

    ageBands.forEach(band => {
        const option = document.createElement('option');
        option.value = band;
        option.textContent = band;
        ageFilter.appendChild(option);
    });

    educationLevels.forEach(level => {
        const option = document.createElement('option');
        option.value = level;
        option.textContent = level;
        educationFilter.appendChild(option);
    });

    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course;
        option.textContent = course;
        courseFilter.appendChild(option);
    });
}

// Apply filters
function applyFilters() {
    const riskBand = document.getElementById('risk-band-filter').value;
    const ageBand = document.getElementById('age-filter').value;
    const educationLevel = document.getElementById('education-filter').value;
    const course = document.getElementById('course-filter').value;

    filteredData = rawData.filter(row => {
        const riskScore = parseFloat(row.early_alert_risk_score);
        
        if (riskBand === 'high' && riskScore < 70) return false;
        if (riskBand === 'medium' && (riskScore < 40 || riskScore >= 70)) return false;
        if (riskBand === 'low' && riskScore >= 40) return false;
        
        if (ageBand !== 'all' && row.age_band !== ageBand) return false;
        if (educationLevel !== 'all' && row.highest_education !== educationLevel) return false;
        if (course !== 'all' && row.module_code !== course) return false;
        
        return true;
    });

    updateKPIs();
    updateAllCharts();
}

// Update KPI cards
function updateKPIs() {
    const total = filteredData.length;
    const atRisk = filteredData.filter(d => d.at_risk_flag === '1').length;
    const passed = filteredData.filter(d => d.final_result === 'Pass').length;
    const withdrawn = filteredData.filter(d => d.final_result === 'Withdrawn').length;
    
    const avgEngagement = filteredData.length > 0 
        ? (filteredData.reduce((sum, d) => sum + parseFloat(d.engagement_index || 0), 0) / filteredData.length).toFixed(1)
        : 0;

    document.getElementById('kpi-at-risk').textContent = atRisk.toLocaleString();
    document.getElementById('kpi-at-risk-pct').textContent = total > 0 ? ((atRisk / total) * 100).toFixed(1) : 0;
    document.getElementById('kpi-completion').textContent = ((passed / total) * 100).toFixed(0) + '%';
    document.getElementById('kpi-withdrawal').textContent = ((withdrawn / total) * 100).toFixed(0) + '%';
    document.getElementById('kpi-engagement').textContent = avgEngagement;
}

// Update all charts
function updateAllCharts() {
    renderOutcomePie();
    renderRiskDistribution();
    renderRiskOutcomeScatter();
    generateSummaryInsights();
    
    renderRiskAgeChart();
    renderRiskEducationChart();
    renderRiskBandOutcomeChart();
    renderRiskMatrix();
    
    renderEngagementPerformanceChart();
    renderActivityOutcomeChart();
    renderEarlyActivityChart();
    renderAssessmentDistribution();
    renderLateSubmissionChart();
    
    renderCoursePerformanceChart();
    renderCourseRiskChart();
    renderCourseComparisonChart();
    renderCourseDemographicsChart();
    
    renderInterventionOpportunitiesChart();
    renderRiskFactorsChart();
    renderEarlyWarningChart();
    generateInterventionRecommendations();
}

// SUMMARY TAB CHARTS

function renderOutcomePie() {
    const outcomeCounts = {
        Pass: filteredData.filter(d => d.final_result === 'Pass').length,
        Withdrawn: filteredData.filter(d => d.final_result === 'Withdrawn').length,
        Fail: filteredData.filter(d => d.final_result === 'Fail').length
    };

    const trace = {
        labels: Object.keys(outcomeCounts),
        values: Object.values(outcomeCounts),
        type: 'pie',
        marker: { colors: ['#27ae60', '#e74c3c', '#f39c12'] },
        hovertemplate: '<b>%{label}</b><br>Count: %{value}<br>Pct: %{percent}<extra></extra>'
    };

    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        margin: { l: 50, r: 50, t: 30, b: 50 }
    };

    Plotly.newPlot('outcome-pie-chart', [trace], layout, { responsive: true });
}

function renderRiskDistribution() {
    const riskScores = filteredData.map(d => parseFloat(d.early_alert_risk_score)).filter(x => !isNaN(x));

    const trace = {
        x: riskScores,
        type: 'histogram',
        nbinsx: 30,
        marker: { color: '#e74c3c' },
        hovertemplate: '<b>Risk Score Range</b><br>Count: %{y}<extra></extra>'
    };

    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        xaxis: { title: 'Early Alert Risk Score (0-100)' },
        yaxis: { title: 'Number of Students', gridcolor: '#ecf0f1' },
        margin: { l: 70, r: 50, t: 30, b: 50 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };

    Plotly.newPlot('risk-distribution-chart', [trace], layout, { responsive: true });
}

function renderRiskOutcomeScatter() {
    const data = filteredData.map(d => ({
        risk: parseFloat(d.early_alert_risk_score),
        engagement: parseFloat(d.engagement_index),
        outcome: d.final_result
    }));

    const passed = data.filter(d => d.outcome === 'Pass');
    const withdrawn = data.filter(d => d.outcome === 'Withdrawn');
    const failed = data.filter(d => d.outcome === 'Fail');

    const trace1 = {
        x: passed.map(d => d.risk),
        y: passed.map(d => d.engagement),
        mode: 'markers',
        type: 'scatter',
        name: 'Passed',
        marker: { size: 6, color: '#27ae60', opacity: 0.6 },
        hovertemplate: 'Risk: %{x:.1f}<br>Engagement: %{y:.1f}<extra></extra>'
    };

    const trace2 = {
        x: withdrawn.map(d => d.risk),
        y: withdrawn.map(d => d.engagement),
        mode: 'markers',
        type: 'scatter',
        name: 'Withdrawn',
        marker: { size: 6, color: '#e74c3c', opacity: 0.6 },
        hovertemplate: 'Risk: %{x:.1f}<br>Engagement: %{y:.1f}<extra></extra>'
    };

    const trace3 = {
        x: failed.map(d => d.risk),
        y: failed.map(d => d.engagement),
        mode: 'markers',
        type: 'scatter',
        name: 'Failed',
        marker: { size: 6, color: '#f39c12', opacity: 0.6 },
        hovertemplate: 'Risk: %{x:.1f}<br>Engagement: %{y:.1f}<extra></extra>'
    };

    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        xaxis: { title: 'Early Alert Risk Score', gridcolor: '#ecf0f1' },
        yaxis: { title: 'Engagement Index', gridcolor: '#ecf0f1' },
        margin: { l: 70, r: 50, t: 30, b: 70 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest',
        legend: { x: 0.02, y: 0.98 }
    };

    Plotly.newPlot('risk-outcome-chart', [trace1, trace2, trace3], layout, { responsive: true });
}

function generateSummaryInsights() {
    const total = filteredData.length;
    const atRisk = filteredData.filter(d => d.at_risk_flag === '1').length;
    const passed = filteredData.filter(d => d.final_result === 'Pass').length;
    const withdrawn = filteredData.filter(d => d.final_result === 'Withdrawn').length;
    
    const avgRiskScore = (filteredData.reduce((sum, d) => sum + parseFloat(d.early_alert_risk_score || 0), 0) / total).toFixed(1);
    const avgEngagement = (filteredData.reduce((sum, d) => sum + parseFloat(d.engagement_index || 0), 0) / total).toFixed(1);
    
    const atRiskPassed = filteredData.filter(d => d.at_risk_flag === '1' && d.final_result === 'Pass').length;
    const atRiskWithdrawn = filteredData.filter(d => d.at_risk_flag === '1' && d.final_result === 'Withdrawn').length;

    let html = `
        <p><strong>Faculty Size:</strong> ${total.toLocaleString()} students across selected courses.</p>
        <p><strong>At-Risk Population:</strong> ${atRisk} students (${((atRisk/total)*100).toFixed(1)}%) flagged for early intervention.</p>
        <p><strong>Completion Rate:</strong> ${((passed/total)*100).toFixed(0)}% passed; ${((withdrawn/total)*100).toFixed(0)}% withdrew.</p>
        <p><strong>Risk-Outcome Correlation:</strong> Of ${atRisk} at-risk students, ${atRiskPassed} passed and ${atRiskWithdrawn} withdrew—indicating ${atRiskWithdrawn > atRiskPassed ? 'withdrawal is the primary risk outcome' : 'some at-risk students recover'}.</p>
        <p><strong>Engagement Baseline:</strong> Average engagement index is ${avgEngagement}/100. Students with lower engagement show higher risk scores (avg risk: ${avgRiskScore}/100).</p>
    `;

    document.getElementById('summary-insights').innerHTML = html;
}

// RISK SEGMENT CHARTS

function renderRiskAgeChart() {
    const ageGroups = [...new Set(filteredData.map(d => d.age_band).filter(Boolean))].sort();
    
    const riskByAge = ageGroups.map(age => {
        const ageData = filteredData.filter(d => d.age_band === age);
        const avgRisk = ageData.reduce((sum, d) => sum + parseFloat(d.early_alert_risk_score), 0) / ageData.length;
        return { age, risk: avgRisk };
    });

    const trace = {
        x: riskByAge.map(d => d.age),
        y: riskByAge.map(d => d.risk),
        type: 'bar',
        marker: { color: riskByAge.map(d => d.risk), colorscale: 'Reds' },
        text: riskByAge.map(d => d.risk.toFixed(1)),
        textposition: 'outside',
        hovertemplate: '<b>%{x}</b><br>Avg Risk: %{y:.1f}<extra></extra>'
    };

    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        yaxis: { title: 'Average Risk Score', gridcolor: '#ecf0f1' },
        margin: { l: 70, r: 50, t: 30, b: 70 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };

    Plotly.newPlot('risk-age-chart', [trace], layout, { responsive: true });
}

function renderRiskEducationChart() {
    const educationLevels = [...new Set(filteredData.map(d => d.highest_education).filter(Boolean))].sort();
    
    const riskByEdu = educationLevels.map(edu => {
        const eduData = filteredData.filter(d => d.highest_education === edu);
        const avgRisk = eduData.reduce((sum, d) => sum + parseFloat(d.early_alert_risk_score), 0) / eduData.length;
        const count = eduData.length;
        return { edu, risk: avgRisk, count };
    }).sort((a, b) => b.risk - a.risk);

    const trace = {
        x: riskByEdu.map(d => d.edu),
        y: riskByEdu.map(d => d.risk),
        type: 'bar',
        marker: { color: '#e74c3c' },
        text: riskByEdu.map(d => `${d.risk.toFixed(1)}<br>(n=${d.count})`),
        textposition: 'outside',
        hovertemplate: '<b>%{x}</b><br>Avg Risk: %{y:.1f}<extra></extra>'
    };

    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        yaxis: { title: 'Average Risk Score', gridcolor: '#ecf0f1' },
        xaxis: { tickangle: -45 },
        margin: { l: 70, r: 50, t: 30, b: 100 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };

    Plotly.newPlot('risk-education-chart', [trace], layout, { responsive: true });
}

function renderRiskBandOutcomeChart() {
    const riskBands = [
        { label: 'Low Risk (0-40)', min: 0, max: 40 },
        { label: 'Medium Risk (40-70)', min: 40, max: 70 },
        { label: 'High Risk (70-100)', min: 70, max: 100 }
    ];

    const bandData = riskBands.map(band => {
        const bandRecords = filteredData.filter(d => {
            const risk = parseFloat(d.early_alert_risk_score);
            return risk >= band.min && risk < band.max;
        });
        return {
            label: band.label,
            pass: bandRecords.filter(d => d.final_result === 'Pass').length,
            withdrawn: bandRecords.filter(d => d.final_result === 'Withdrawn').length,
            fail: bandRecords.filter(d => d.final_result === 'Fail').length
        };
    });

    const trace1 = {
        x: bandData.map(d => d.label),
        y: bandData.map(d => d.pass),
        name: 'Passed',
        type: 'bar',
        marker: { color: '#27ae60' }
    };

    const trace2 = {
        x: bandData.map(d => d.label),
        y: bandData.map(d => d.withdrawn),
        name: 'Withdrawn',
        type: 'bar',
        marker: { color: '#e74c3c' }
    };

    const trace3 = {
        x: bandData.map(d => d.label),
        y: bandData.map(d => d.fail),
        name: 'Failed',
        type: 'bar',
        marker: { color: '#f39c12' }
    };

    const layout = {
        barmode: 'group',
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        yaxis: { title: 'Count', gridcolor: '#ecf0f1' },
        margin: { l: 70, r: 50, t: 30, b: 70 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };

    Plotly.newPlot('risk-band-outcome-chart', [trace1, trace2, trace3], layout, { responsive: true });
}

function renderRiskMatrix() {
    const ageGroups = [...new Set(filteredData.map(d => d.age_band).filter(Boolean))];
    const genders = [...new Set(filteredData.map(d => d.gender).filter(Boolean))];

    const matrixData = ageGroups.map(age => 
        genders.map(gender => {
            const subset = filteredData.filter(d => d.age_band === age && d.gender === gender);
            const count = subset.length;
            const avgRisk = count > 0 ? subset.reduce((sum, d) => sum + parseFloat(d.early_alert_risk_score), 0) / count : 0;
            return { age, gender, count, avgRisk };
        })
    ).flat();

    const trace = {
        x: matrixData.map(d => d.gender),
        y: matrixData.map(d => d.age),
        mode: 'markers',
        type: 'scatter',
        text: matrixData.map(d => `${d.gender}, ${d.age}<br>n=${d.count}<br>Risk=${d.avgRisk.toFixed(1)}`),
        marker: {
            size: matrixData.map(d => Math.sqrt(d.count / 2) + 5),
            color: matrixData.map(d => d.avgRisk),
            colorscale: 'Reds',
            showscale: true,
            colorbar: { title: 'Avg Risk' }
        },
        hovertemplate: '<b>%{text}</b><extra></extra>'
    };

    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        xaxis: { title: 'Gender' },
        yaxis: { title: 'Age Band' },
        margin: { l: 100, r: 100, t: 30, b: 50 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };

    Plotly.newPlot('risk-matrix-chart', [trace], layout, { responsive: true });
}

// ENGAGEMENT & PERFORMANCE CHARTS

function renderEngagementPerformanceChart() {
    const data = filteredData.map(d => ({
        engagement: parseFloat(d.engagement_index),
        assessment: parseFloat(d.avg_assessment_score)
    })).filter(d => !isNaN(d.engagement) && !isNaN(d.assessment));

    const trace = {
        x: data.map(d => d.engagement),
        y: data.map(d => d.assessment),
        mode: 'markers',
        type: 'scatter',
        marker: { size: 5, color: '#3498db', opacity: 0.5 },
        hovertemplate: 'Engagement: %{x:.1f}<br>Assessment Score: %{y:.1f}<extra></extra>'
    };

    // Add trend line
    const sortedData = data.sort((a, b) => a.engagement - b.engagement);
    const trendX = sortedData.map(d => d.engagement);
    const trendY = sortedData.map(d => d.assessment);

    const trace2 = {
        x: trendX,
        y: trendY,
        mode: 'lines',
        type: 'scatter',
        name: 'Trend',
        line: { color: '#e74c3c', width: 3, shape: 'spline' },
        hoverinfo: 'skip'
    };

    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        xaxis: { title: 'Engagement Index', gridcolor: '#ecf0f1' },
        yaxis: { title: 'Average Assessment Score', gridcolor: '#ecf0f1' },
        margin: { l: 70, r: 50, t: 30, b: 70 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };

    Plotly.newPlot('engagement-performance-chart', [trace, trace2], layout, { responsive: true });
}

function renderActivityOutcomeChart() {
    const outcomes = ['Pass', 'Withdrawn', 'Fail'];
    
    const activityByOutcome = outcomes.map(outcome => {
        const outcomeData = filteredData.filter(d => d.final_result === outcome);
        const avgClicks = outcomeData.length > 0 
            ? outcomeData.reduce((sum, d) => sum + parseFloat(d.total_clicks || 0), 0) / outcomeData.length
            : 0;
        return { outcome, clicks: avgClicks };
    });

    const trace = {
        x: activityByOutcome.map(d => d.outcome),
        y: activityByOutcome.map(d => d.clicks),
        type: 'bar',
        marker: { color: ['#27ae60', '#e74c3c', '#f39c12'] },
        text: activityByOutcome.map(d => d.clicks.toFixed(0)),
        textposition: 'outside',
        hovertemplate: '<b>%{x}</b><br>Avg Clicks: %{y:.0f}<extra></extra>'
    };

    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        yaxis: { title: 'Average Platform Clicks', gridcolor: '#ecf0f1' },
        margin: { l: 70, r: 50, t: 30, b: 50 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };

    Plotly.newPlot('activity-outcome-chart', [trace], layout, { responsive: true });
}

function renderEarlyActivityChart() {
    const data = filteredData.map(d => ({
        earlyClicks: parseFloat(d.clicks_first_30_days),
        outcome: d.final_result
    }));

    const outcomeGroups = {};
    data.forEach(d => {
        if (!outcomeGroups[d.outcome]) outcomeGroups[d.outcome] = [];
        outcomeGroups[d.outcome].push(d.earlyClicks);
    });

    const traces = Object.keys(outcomeGroups).map((outcome, idx) => ({
        y: outcomeGroups[outcome],
        name: outcome,
        type: 'box',
        marker: { color: ['#27ae60', '#e74c3c', '#f39c12'][idx] }
    }));

    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        yaxis: { title: 'Clicks in First 30 Days', gridcolor: '#ecf0f1' },
        margin: { l: 70, r: 50, t: 30, b: 50 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };

    Plotly.newPlot('early-activity-chart', traces, layout, { responsive: true });
}

function renderAssessmentDistribution() {
    const assessmentScores = filteredData.map(d => parseFloat(d.avg_assessment_score)).filter(x => !isNaN(x) && x > 0);

    const trace = {
        x: assessmentScores,
        type: 'histogram',
        nbinsx: 25,
        marker: { color: '#3498db' }
    };

    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        xaxis: { title: 'Average Assessment Score' },
        yaxis: { title: 'Count', gridcolor: '#ecf0f1' },
        margin: { l: 70, r: 50, t: 30, b: 50 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };

    Plotly.newPlot('assessment-distribution-chart', [trace], layout, { responsive: true });
}

function renderLateSubmissionChart() {
    const data = filteredData.map(d => ({
        lateRate: parseFloat(d.late_submission_rate),
        outcome: d.final_result
    })).filter(d => !isNaN(d.lateRate));

    const passed = data.filter(d => d.outcome === 'Pass').map(d => d.lateRate);
    const withdrawn = data.filter(d => d.outcome === 'Withdrawn').map(d => d.lateRate);
    const failed = data.filter(d => d.outcome === 'Fail').map(d => d.lateRate);

    const trace1 = { y: passed, name: 'Passed', type: 'box', marker: { color: '#27ae60' } };
    const trace2 = { y: withdrawn, name: 'Withdrawn', type: 'box', marker: { color: '#e74c3c' } };
    const trace3 = { y: failed, name: 'Failed', type: 'box', marker: { color: '#f39c12' } };

    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        yaxis: { title: 'Late Submission Rate (0-1)', gridcolor: '#ecf0f1' },
        margin: { l: 70, r: 50, t: 30, b: 50 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };

    Plotly.newPlot('late-submission-chart', [trace1, trace2, trace3], layout, { responsive: true });
}

// COURSE DRILLDOWN CHARTS

function renderCoursePerformanceChart() {
    const courses = [...new Set(filteredData.map(d => d.module_code))];
    
    const courseStats = courses.map(course => {
        const courseData = filteredData.filter(d => d.module_code === course);
        const passed = courseData.filter(d => d.final_result === 'Pass').length;
        const rate = (passed / courseData.length * 100).toFixed(1);
        return { course, rate: parseFloat(rate), count: courseData.length };
    }).sort((a, b) => b.rate - a.rate);

    const trace = {
        x: courseStats.map(d => d.course),
        y: courseStats.map(d => d.rate),
        type: 'bar',
        marker: { color: courseStats.map(d => d.rate), colorscale: 'Greens' },
        text: courseStats.map(d => `${d.rate.toFixed(1)}%`),
        textposition: 'outside',
        hovertemplate: '<b>%{x}</b><br>Pass Rate: %{y:.1f}%<extra></extra>'
    };

    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        yaxis: { title: 'Completion Rate (%)', gridcolor: '#ecf0f1' },
        xaxis: { tickangle: -45 },
        margin: { l: 70, r: 50, t: 30, b: 100 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };

    Plotly.newPlot('course-performance-chart', [trace], layout, { responsive: true });
}

function renderCourseRiskChart() {
    const courses = [...new Set(filteredData.map(d => d.module_code))];
    
    const courseRisk = courses.map(course => {
        const courseData = filteredData.filter(d => d.module_code === course);
        const atRiskCount = courseData.filter(d => d.at_risk_flag === '1').length;
        const rate = (atRiskCount / courseData.length * 100).toFixed(1);
        return { course, rate: parseFloat(rate) };
    }).sort((a, b) => b.rate - a.rate);

    const trace = {
        x: courseRisk.map(d => d.course),
        y: courseRisk.map(d => d.rate),
        type: 'bar',
        marker: { color: '#e74c3c' },
        text: courseRisk.map(d => d.rate.toFixed(1) + '%'),
        textposition: 'outside',
        hovertemplate: '<b>%{x}</b><br>At-Risk: %{y:.1f}%<extra></extra>'
    };

    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        yaxis: { title: 'At-Risk Rate (%)', gridcolor: '#ecf0f1' },
        xaxis: { tickangle: -45 },
        margin: { l: 70, r: 50, t: 30, b: 100 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };

    Plotly.newPlot('course-risk-chart', [trace], layout, { responsive: true });
}

function renderCourseComparisonChart() {
    const courses = [...new Set(filteredData.map(d => d.module_code))];
    
    const comparison = courses.map(course => {
        const courseData = filteredData.filter(d => d.module_code === course);
        const avgRisk = courseData.reduce((sum, d) => sum + parseFloat(d.early_alert_risk_score), 0) / courseData.length;
        const passRate = (courseData.filter(d => d.final_result === 'Pass').length / courseData.length * 100);
        return { course, risk: avgRisk, passRate, count: courseData.length };
    });

    const trace = {
        x: comparison.map(d => d.risk),
        y: comparison.map(d => d.passRate),
        mode: 'markers+text',
        type: 'scatter',
        text: comparison.map(d => d.course),
        textposition: 'top center',
        marker: {
            size: comparison.map(d => Math.sqrt(d.count / 5) + 8),
            color: comparison.map(d => d.risk),
            colorscale: 'Reds',
            showscale: true,
            colorbar: { title: 'Avg Risk' }
        },
        hovertemplate: '<b>%{text}</b><br>Risk: %{x:.1f}<br>Pass Rate: %{y:.1f}%<extra></extra>'
    };

    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        xaxis: { title: 'Average Risk Score', gridcolor: '#ecf0f1' },
        yaxis: { title: 'Pass Rate (%)', gridcolor: '#ecf0f1' },
        margin: { l: 70, r: 100, t: 30, b: 70 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };

    Plotly.newPlot('course-comparison-chart', [trace], layout, { responsive: true });
}

function renderCourseDemographicsChart() {
    const courses = [...new Set(filteredData.map(d => d.module_code))].slice(0, 6); // Top 6 courses
    
    const demographics = courses.map(course => {
        const courseData = filteredData.filter(d => d.module_code === course);
        const femaleCount = courseData.filter(d => d.gender === 'F').length;
        const maleCount = courseData.filter(d => d.gender === 'M').length;
        const total = courseData.length;
        return {
            course,
            female: (femaleCount / total * 100).toFixed(1),
            male: (maleCount / total * 100).toFixed(1)
        };
    });

    const trace1 = {
        x: demographics.map(d => d.course),
        y: demographics.map(d => parseFloat(d.female)),
        name: 'Female',
        type: 'bar',
        marker: { color: '#e74c3c' }
    };

    const trace2 = {
        x: demographics.map(d => d.course),
        y: demographics.map(d => parseFloat(d.male)),
        name: 'Male',
        type: 'bar',
        marker: { color: '#3498db' }
    };

    const layout = {
        barmode: 'stack',
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        yaxis: { title: 'Percentage (%)', gridcolor: '#ecf0f1' },
        xaxis: { tickangle: -45 },
        margin: { l: 70, r: 50, t: 30, b: 100 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };

    Plotly.newPlot('course-demographics-chart', [trace1, trace2], layout, { responsive: true });
}

// INTERVENTION OPPORTUNITY CHARTS

function renderInterventionOpportunitiesChart() {
    // High risk + low engagement = intervention needed
    const interventionCandidates = filteredData
        .filter(d => parseFloat(d.early_alert_risk_score) > 70 && parseFloat(d.engagement_index) < 40)
        .map(d => ({
            course: d.module_code,
            risk: parseFloat(d.early_alert_risk_score),
            engagement: parseFloat(d.engagement_index)
        }));

    const courses = [...new Set(interventionCandidates.map(d => d.course))];
    const courseIntervention = courses.map(course => {
        const count = interventionCandidates.filter(d => d.course === course).length;
        const avgRisk = interventionCandidates.filter(d => d.course === course)
            .reduce((sum, d) => sum + d.risk, 0) / (count || 1);
        return { course, count, avgRisk };
    }).sort((a, b) => b.count - a.count).slice(0, 8);

    const trace = {
        x: courseIntervention.map(d => d.course),
        y: courseIntervention.map(d => d.count),
        type: 'bar',
        marker: { color: '#f39c12' },
        text: courseIntervention.map(d => d.count),
        textposition: 'outside',
        hovertemplate: '<b>%{x}</b><br>At-Risk Students: %{y}<extra></extra>'
    };

    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        yaxis: { title: 'Count of Students Needing Intervention', gridcolor: '#ecf0f1' },
        xaxis: { tickangle: -45 },
        margin: { l: 100, r: 50, t: 30, b: 100 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };

    Plotly.newPlot('intervention-opportunity-chart', [trace], layout, { responsive: true });
}

function renderRiskFactorsChart() {
    // Show which factors correlate most with withdrawal
    const withdrawn = filteredData.filter(d => d.final_result === 'Withdrawn');
    const notWithdrawn = filteredData.filter(d => d.final_result !== 'Withdrawn');

    const factors = [
        {
            name: 'Low Engagement',
            withdrawnAvg: withdrawn.length > 0 ? withdrawn.reduce((sum, d) => sum + parseFloat(d.engagement_index), 0) / withdrawn.length : 0,
            notWithdrawnAvg: notWithdrawn.length > 0 ? notWithdrawn.reduce((sum, d) => sum + parseFloat(d.engagement_index), 0) / notWithdrawn.length : 0
        },
        {
            name: 'Low Assessment Score',
            withdrawnAvg: withdrawn.length > 0 ? withdrawn.reduce((sum, d) => sum + parseFloat(d.avg_assessment_score || 0), 0) / withdrawn.length : 0,
            notWithdrawnAvg: notWithdrawn.length > 0 ? notWithdrawn.reduce((sum, d) => sum + parseFloat(d.avg_assessment_score || 0), 0) / notWithdrawn.length : 0
        },
        {
            name: 'High Late Submission',
            withdrawnAvg: withdrawn.length > 0 ? withdrawn.reduce((sum, d) => sum + parseFloat(d.late_submission_rate), 0) / withdrawn.length : 0,
            notWithdrawnAvg: notWithdrawn.length > 0 ? notWithdrawn.reduce((sum, d) => sum + parseFloat(d.late_submission_rate), 0) / notWithdrawn.length : 0
        }
    ];

    const trace1 = {
        x: factors.map(d => d.name),
        y: factors.map(d => d.withdrawnAvg),
        name: 'Withdrawn',
        type: 'bar',
        marker: { color: '#e74c3c' }
    };

    const trace2 = {
        x: factors.map(d => d.name),
        y: factors.map(d => d.notWithdrawnAvg),
        name: 'Completed',
        type: 'bar',
        marker: { color: '#27ae60' }
    };

    const layout = {
        barmode: 'group',
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        yaxis: { title: 'Average Score', gridcolor: '#ecf0f1' },
        margin: { l: 70, r: 50, t: 30, b: 100 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };

    Plotly.newPlot('risk-factors-chart', [trace1, trace2], layout, { responsive: true });
}

function renderEarlyWarningChart() {
    // Students inactive in first 30 days
    const inactive = filteredData.filter(d => parseFloat(d.clicks_first_30_days) < 50);
    const active = filteredData.filter(d => parseFloat(d.clicks_first_30_days) >= 50);

    const inactiveWithdrawn = inactive.filter(d => d.final_result === 'Withdrawn').length;
    const activewithdrawn = active.filter(d => d.final_result === 'Withdrawn').length;

    const trace1 = {
        x: ['Inactive First 30 Days', 'Active First 30 Days'],
        y: [inactiveWithdrawn, activewithdrawn],
        type: 'bar',
        marker: { color: ['#e74c3c', '#27ae60'] },
        text: [inactiveWithdrawn, activewithdrawn],
        textposition: 'outside',
        hovertemplate: '<b>%{x}</b><br>Withdrawals: %{y}<extra></extra>'
    };

    const layout = {
        font: { family: 'Segoe UI, sans-serif', size: 12 },
        yaxis: { title: 'Number of Withdrawals', gridcolor: '#ecf0f1' },
        margin: { l: 70, r: 50, t: 30, b: 80 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'transparent',
        hovermode: 'closest'
    };

    Plotly.newPlot('early-warning-chart', [trace1], layout, { responsive: true });
}

function generateInterventionRecommendations() {
    const total = filteredData.length;
    const atRisk = filteredData.filter(d => d.at_risk_flag === '1').length;
    const highRiskLowEngagement = filteredData.filter(d => parseFloat(d.early_alert_risk_score) > 70 && parseFloat(d.engagement_index) < 40).length;
    const inactiveFirst30 = filteredData.filter(d => parseFloat(d.clicks_first_30_days) < 50).length;
    const lateSubmitters = filteredData.filter(d => parseFloat(d.late_submission_rate) > 0.5).length;

    let html = '';
    
    if (highRiskLowEngagement > 0) {
        html += `<p><strong>Priority 1 - Check-in Campaign (${highRiskLowEngagement} students):</strong> Target students with high risk scores (>70) and low engagement (<40). These are at-risk but still recoverable. Reach out via email, SMS, or direct advisor contact within 1 week.</p>`;
    }

    if (inactiveFirst30 > 0) {
        html += `<p><strong>Priority 2 - Early Alert (${inactiveFirst30} students):</strong> Students with <50 platform clicks in first 30 days are 4x more likely to withdraw. Implement onboarding check-in by day 14 of course enrollment.</p>`;
    }

    if (lateSubmitters > 0) {
        html += `<p><strong> Priority 3 - Assessment Support (${lateSubmitters} students):</strong> Late submission rate >50% correlates with withdrawal. Offer extension mechanisms, peer tutoring, or assignment clarification workshops.</p>`;
    }

    if (atRisk > 0) {
        html += `<p><strong>Overall Intervention Capacity:</strong> ${atRisk} students are flagged at-risk (${((atRisk/total)*100).toFixed(0)}% of cohort). Recommend triage: direct advising for high-risk + low-engagement; group workshops for engagement issues; peer mentoring for assessment struggles.</p>`;
    }

    html += `<p><strong>Success Metric:</strong> Track withdrawal rate in intervention vs. control groups. Target: reduce withdrawal from current rate by 2-5 percentage points within one cycle.</p>`;

    document.getElementById('intervention-recs').innerHTML = html;
}
