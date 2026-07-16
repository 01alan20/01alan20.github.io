const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const project = path.join(__dirname, '..');
const compactPath = path.join(project, 'data', 'scorecard_compact.json');
const institutionsPath = path.join(project, 'data', 'institutions.json');
const stateDiagnosticsPath = path.join(project, 'data', 'state_diagnostics.json');
const institutionDiagnosticsPath = path.join(project, 'data', 'institution_diagnostics.json');
const builderPath = path.join(project, 'scripts', 'build_scorecard_history.py');
const projectReadme = fs.readFileSync(path.join(project, 'README.md'), 'utf8');
const dataReadme = fs.readFileSync(path.join(project, 'data', 'README.md'), 'utf8');

for (const staleReference of ['dashboards/', 'financial_model/', 'The current GitHub Pages build is stored in `site/`', 'domestic market-reach proxy']) {
  assert.equal(projectReadme.includes(staleReference), false, `README must not reference removed or retired content: ${staleReference}`);
}
assert.match(projectReadme, /python -m http\.server 8765/);
assert.match(dataReadme, /--input-dir/);
assert.match(dataReadme, /not stored in this repository/i);
assert.equal(fs.existsSync(path.join(project, 'manifest_phases3_5.json')), false, 'duplicate legacy manifest must not remain');
const projectManifest = JSON.parse(fs.readFileSync(path.join(project, 'manifest.json'), 'utf8'));
assert.equal(projectManifest.project, 'The Enrollment Squeeze');
assert.equal(projectManifest.package, 'GitHub Pages static data story');
const phase1Manifest = JSON.parse(fs.readFileSync(path.join(project, 'data', 'phase1', 'manifest.json'), 'utf8'));
assert.equal(phase1Manifest.generated_files.includes('future_freshman_state_maps.html'), false, 'phase 1 manifest must not list the removed duplicate dashboard');
const phase2Readme = fs.readFileSync(path.join(project, 'README_PHASE2.md'), 'utf8');
assert.equal(phase2Readme.includes('`dashboards/`'), false, 'historical phase notes must not point to the removed dashboard directory');

assert.equal(fs.existsSync(path.join(project, 'data', 'collegescorecard')), false, 'raw Scorecard directory must not be required');
assert.equal(fs.existsSync(path.join(project, 'data', 'institution_history.json')), false, 'redundant history artifact must not remain');
assert.equal(fs.existsSync(compactPath), true, 'compact Scorecard artifact must exist');
const compact = JSON.parse(fs.readFileSync(compactPath, 'utf8'));
assert.deepEqual(compact.sourceYears, ['2015_16', '2016_17', '2017_18', '2018_19', '2019_20', '2020_21', '2021_22', '2022_23', '2023_24', '2024_25']);
assert.ok(Array.isArray(compact.institutions) && compact.institutions.length > 0);
assert.deepEqual(new Set(compact.institutions.map(row => row.unitid)).size, compact.institutions.length);
assert.ok(compact.institutions.every(row => row.years['2015_16'] && row.years['2024_25']));
assert.ok(compact.institutions.every(row => Object.hasOwn(row.years['2024_25'], 'UGDS')));
assert.ok(compact.institutions.every(row => Object.hasOwn(row.years['2024_25'], 'GRADS')));

const institutions = JSON.parse(fs.readFileSync(institutionsPath, 'utf8'));
assert.ok(institutions.length > 0);
assert.ok(institutions.every(row => row.unitid && Object.hasOwn(row, 'currentUG') && Object.hasOwn(row, 'marketChange')));
assert.equal(fs.existsSync(stateDiagnosticsPath), true, 'state diagnostics artifact must exist');
assert.equal(fs.existsSync(institutionDiagnosticsPath), true, 'institution diagnostics artifact must exist');
const stateDiagnostics = JSON.parse(fs.readFileSync(stateDiagnosticsPath, 'utf8'));
const institutionDiagnostics = JSON.parse(fs.readFileSync(institutionDiagnosticsPath, 'utf8'));
const international = JSON.parse(fs.readFileSync(path.join(project, 'data', 'international.json'), 'utf8'));
assert.ok(stateDiagnostics.length > 0);
assert.ok(stateDiagnostics.every(row => ['graduateLoss', 'entrantLoss', 'requiredParticipationPoints', 'archetype'].every(key => Object.hasOwn(row, key))));
assert.ok(institutionDiagnostics.length > 0);
assert.equal(new Set(institutionDiagnostics.map(row => String(row.unitid))).size, institutionDiagnostics.length, 'institution diagnostics must contain one record per unitid');
assert.ok(institutionDiagnostics.every(row => ['change', 'peerMedian', 'stateMedian', 'relativePerformance', 'peerCount', 'percentiles'].every(key => Object.hasOwn(row, key))));
assert.ok(institutionDiagnostics.every(row => ['firstTimeHomeStateShare', 'firstTimeOtherStateShare', 'firstTimeKnownDomesticCount', 'residenceSourceYear'].every(key => Object.hasOwn(row, key))));
const residencePayload = JSON.parse(fs.readFileSync(path.join(project, 'data', 'ipeds_residence_2024.json'), 'utf8'));
assert.equal(residencePayload.table, 'EF2024C');
assert.equal(residencePayload.collection, 'Fall 2024');
assert.ok(residencePayload.records.every(row => row.firstTimeKnownDomesticCount === 0 || Math.abs(row.firstTimeHomeStateShare + row.firstTimeOtherStateShare - 1) < 1e-9));
assert.equal(international.originConcentration2024_25.total, 1177766);
assert.equal(international.originConcentration2024_25.groups.reduce((sum, row) => sum + row.students, 0), 1177766);

const builder = fs.readFileSync(builderPath, 'utf8');
assert.equal(builder.includes('data/collegescorecard'), false);
assert.equal(builder.includes('MERGED{year}_PP.csv'), false);
assert.equal(builder.includes('institution_history.json'), false);

const indexHtml = fs.readFileSync(path.join(project, 'index.html'), 'utf8');
const appSource = fs.readFileSync(path.join(project, 'app.js'), 'utf8');
assert.match(indexHtml, /rel="icon"/, 'rendered route should not produce a missing favicon error');
assert.equal(indexHtml.includes('value="coverage"'), false, 'coverage must not be a public state-map metric');
assert.equal(indexHtml.includes('Local pool coverage'), false, 'coverage must not be presented in the public state map');
assert.equal(appSource.includes("metric === 'coverage'"), false, 'app must not render the provisional coverage metric');
assert.equal(appSource.includes('row.coverage'), false, 'state detail must not expose the provisional coverage field');
assert.match(appSource, /international-concentration-chart/);
assert.match(indexHtml, /id="state-key-swatch-left"/);
assert.match(appSource, /state-key-swatch-/);

const filtersSource = fs.readFileSync(path.join(project, 'filters.js'), 'utf8');
assert.equal(indexHtml.includes('id="inst-scope"'), false, 'scope must not be a public institution filter');
assert.equal(indexHtml.includes('id="exposure-score"'), false, 'modeled enrollment pressure must not be a public institution filter');
assert.equal(indexHtml.includes('id="institution-international-recovery"'), false, 'institution-specific international recovery must be removed');
assert.equal(filtersSource.includes('scope: $(\'inst-scope\').value'), false, 'institution filtering must not use heuristic scope');
assert.equal(filtersSource.includes('internationalScenarioChange'), false, 'institution forecasts must not use international recovery');
assert.match(filtersSource, /tuitionCounterfactual/);
assert.match(appSource, /const minValue = Math\.min\(\.\.\.values\)/);
assert.match(appSource, /customdata.*1%/s);
for (const id of ['part-pool', 'part-geography', 'part-competition', 'part-alternatives', 'part-finance']) {
  assert.match(indexHtml, new RegExp(`id="${id}"`), `missing analytical chapter ${id}`);
}
assert.equal(/>Part [IVX]+</.test(indexHtml), false, 'chapter transitions must use questions instead of numbered parts');
for (const question of [
  'How many likely entrants will exist?',
  'Where is the loss concentrated, and how much participation would offset it?',
  'Which institutions are moving differently from their markets and peers?',
  'Can other student groups plausibly replace the missing pool?',
  'What would a defined enrollment loss mean for gross tuition revenue?',
]) {
  assert.match(indexHtml, new RegExp(`<h2[^>]*>${question.replace(/[?]/g, '\\?')}</h2>`), `chapter question must be the transition heading: ${question}`);
}
assert.match(indexHtml, /Participation increase required to maintain the 2026 entrant pool/);
assert.match(indexHtml, /Observed institution change versus projected state entrant change/);
assert.equal(indexHtml.includes('Largest modeled gross tuition declines'), false, 'provisional finance ranking must be removed');
assert.equal(indexHtml.includes('The squeeze is unlikely to affect every college equally'), false);
assert.match(indexHtml, /<title>The Enrollment Squeeze: Preparing to Compete<\/title>/);
assert.match(indexHtml, /Institutions will compete on brand, value, outcomes, and student experience/);
assert.match(indexHtml, /widen their admissions pools beyond their traditional geographic and demographic reach/);
assert.match(indexHtml, /both domestically and internationally/);
assert.match(indexHtml, /continuing trend toward urbanization/);
assert.equal(indexHtml.includes('The pool sets the constraint. Competition and revenue models determine the consequence.'), false);
const endingHtml = indexHtml.match(/<section class="ending">([\s\S]*?)<\/section>/)?.[1] || '';
assert.equal(endingHtml.includes('—'), false, 'closing copy must not contain em dashes');
assert.equal(indexHtml.includes('4,968 institutions'), false, 'chart institution-count badge must be removed');
assert.equal(indexHtml.includes('1,797 institutions'), false, 'chart institution-count badge must be removed');
assert.equal(indexHtml.includes('Undergraduate students</p><h3>Undergraduate enrollment'), false, 'undergraduate chart title must not repeat the same concept');
assert.equal(indexHtml.includes('class="model-tag"'), false, 'chart upper-right scenario bubbles must be removed');
assert.equal(indexHtml.includes('<p class="kicker">National outlook</p>'), false, 'national chart subtitle must be removed');
assert.equal(indexHtml.includes('<p class="kicker">Observed history</p>'), false, 'enrollment chart subtitles must be removed');
assert.equal(indexHtml.includes('Grounded counterfactual'), false, 'finance section subtitle must be removed');
assert.equal(filtersSource.includes('Observed institution profile'), false, 'institution profile subtitle must be removed');
assert.match(indexHtml, /id="institution-filter-reset"/, 'institution explorer must include a reset button');
assert.match(indexHtml, /value="firstTimeHomeStateShare">First-time students from within the institution state/);
assert.match(indexHtml, /value="firstTimeOtherStateShare">First-time students from other U\.S\. states/);
assert.match(indexHtml, /value="internationalUGShare">Undergraduate nonresident-alien share/);
assert.equal(/\bpp\b/.test(appSource), false, 'state profiles must spell out percentage points');
assert.equal(/\bpp\b/.test(filtersSource), false, 'institution profiles must spell out percentage points');
assert.equal((indexHtml.match(/data-step="/g) || []).length, 0, 'national chart steps must be consolidated into one message');
assert.equal(appSource.includes('from 2015 to 2023'), false, 'chart callouts must use the latest plotted year');
assert.match(appSource, /displayYears\[endIndex\]/);
assert.equal(indexHtml.includes('One smaller class moves through every stage.'), false);
assert.equal(indexHtml.includes('The chart compares the 2026 baseline with 2041.'), false);
assert.match(appSource, /Likely college entrants/);
assert.equal(indexHtml.includes('id="undergraduate-history-change"'), false);
assert.equal(indexHtml.includes('id="graduate-history-change"'), false);
assert.equal(/class="[^"]*chapter-light[^"]*" id="part-geography"/.test(indexHtml), false, 'geography transition must use the dark chapter color');
assert.equal(indexHtml.includes('Immediately avoidable cost: Not estimated.'), false);
assert.equal(filtersSource.includes('enrollment-loss counterfactual'), false);
assert.equal(filtersSource.includes('finance-warning'), false);
assert.equal(filtersSource.includes("'Largest markets'"), false, 'county summary must not repeat the active view label');
assert.equal(indexHtml.includes('Bubble size is current undergraduate enrollment.'), false);
assert.equal(indexHtml.includes('id="institution-map-coverage"'), false);
for (const finding of [
  '61% of institutions declined by more than 2.5%',
  '31% grew by more than 2.5%, while 8% remained within ±2.5%.',
  'Size produced the clearest divide:',
  'More selective, higher-retention institutions performed better:',
  'Location also mattered:',
]) assert.equal(indexHtml.includes(finding), true, `missing approved institution finding: ${finding}`);
assert.equal(indexHtml.includes('Y-axis: observed undergraduate change'), false);

console.log('Scorecard data contract tests passed');
