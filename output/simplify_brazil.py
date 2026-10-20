from pathlib import Path
import re
root=Path('projects/brazil-business-survival')
p=root/'depth.js';s=p.read_text(encoding='utf-8')
s=re.sub(r'<div class="evidence-boundaries">.*?<div id="time-gaps"></div></div>','',s,flags=re.S)
start=s.index('  depth.evidence_gaps.forEach(');end=s.index('  const industry = section(',start);s=s[:start]+s[end:]
start=s.index('  const sensitivity = section(');end=s.index('  document\n    .querySelectorAll',start);s=s[:start]+s[end:]
s=s.replace('IBGE Table 2.1 · ratios of rounded published rates. This is employer-cohort attrition, not a legal closure rate.','Employer-cohort attrition, not a legal closure rate.')
s=s.replace(' · IBGE Table 2.2','')
s=s.replace('The denominator<br>moves with time.','Annual attrition and conditional survival')
s=s.replace('What is lost each year?','Annual attrition')
s=s.replace('Already made it this far?','Survival after reaching an earlier year')
s=s.replace('Same industry.<br>Different places.','State comparisons within an industry')
s=s.replace('Explore the evidence ↗','View details')
s=s.replace('The short answer first. The population, period and working are always close by.','Answers to six common questions about business survival in Brazil.')
s=s.replace('Start with a question.','Common questions')
p.write_text(s,encoding='utf-8')
p=root/'index.html';s=p.read_text(encoding='utf-8')
s=s.replace('<a href="#methods">The evidence ↗</a>','<a href="https://github.com/caiopizzol/cnpj-data-pipeline" target="_blank" rel="noopener">Dataset GitHub ↗</a>')
s=re.sub(r'<p class="cover-subtitle">.*?</p>','',s,flags=re.S)
s=re.sub(r'<h1 id="cover-title">.*?</h1>','<h1 id="cover-title">Business survival<br /> in Brazil</h1>',s,flags=re.S)
s=re.sub(r'<p class="cover-intro">.*?</p>','<p class="cover-intro">Explore how business survival varies over time, by industry and across states.</p>',s,flags=re.S)
s=s.replace('Follow one generation','Explore business survival')
s=s.replace('IBGE · 2017 entrants, observed in 2022.','2017 entrants, observed in 2022.')
s=re.sub(r'<h2>\s*A generation enters.*?</h2>','<h2>Five-year business survival</h2>',s,flags=re.S)
s=re.sub(r'<h2 id="cohort-title">.*?</h2>','<h2 id="cohort-title">Changes over five years</h2>',s,flags=re.S)
s=re.sub(r'<h2>\s*The steepest loss.*?</h2>','<h2>Survival by year</h2>',s,flags=re.S)
s=re.sub(r'<h2>\s*Endurance is.*?</h2>','<h2>Survival by business size and industry</h2>',s,flags=re.S)
s=s.replace('The registry ledger.','Business registrations')
s=re.sub(r'<h2>\s*A different view.*?</h2>','<h2>State comparisons</h2>',s,flags=re.S)
s=re.sub(r'<h2>\s*A long history.*?</h2>','<h2>Current status by registration year</h2>',s,flags=re.S)
s=re.sub(r'<h2>\s*The question is simple.*?</h2>','',s,flags=re.S)
s=s.replace('For a measured five-year result, we turn to IBGE employer-enterprise\n            statistics. These cover enterprises with salaried employees.','The five-year analysis covers enterprises with salaried employees.')
s=s.replace('IBGE published salaried-employment size classes. Five-year','Salaried-employment size classes. Five-year')
s=s.replace('Five-year survival · IBGE','Five-year survival')
s=s.replace('Official employer-enterprise cohorts reveal associations with','Employer-enterprise cohorts reveal associations with')
# Keep the analysis download while consolidating provenance in the notebook.
start=s.index('      <section class="wrap methods"');end=s.index('    </main>',start)
s=s[:start]+'''      <section class="wrap methods" id="methods">
        <h2>Explore the analysis</h2>
        <p>The notebook contains the full analysis, definitions and methods.</p>
        <a class="notebook-link" href="brazil-business-survival.ipynb" download>Download the notebook <span>↗</span></a>
        <a class="notebook-link" href="data/story.json">View the analysis data <span>↗</span></a>
        <p id="data-message" class="data-message" role="status"></p>
      </section>
'''+s[end:]
s=s.replace('Brazil, in data. A story about staying power.','Business survival in Brazil')
s=s.replace('Open the\n          evidence <small>Notebook + sources</small>','Open the\n          notebook <small>Full analysis</small>')
p.write_text(s,encoding='utf-8')
p=root/'story.js';s=p.read_text(encoding='utf-8')
start=s.index('    const sources = [');end=s.index('    try {\n      await renderMap();',start);s=s[:start]+s[end:]
s=s.replace('IBGE · employer enterprises ·','Employer enterprises ·')
s=s.replace('IBGE employer local units','Employer local units')
s=s.replace('five-year survival · IBGE employer local units','five-year survival · employer local units')
s=s.replace('IBGE employer-local-unit cohort','employer-local-unit cohort')
s=s.replace('; small cells and the support sensitivity below limit rank stability.','; small cells can make the comparison sensitive.')
p.write_text(s,encoding='utf-8')
