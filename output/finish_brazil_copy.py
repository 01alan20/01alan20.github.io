from pathlib import Path
import re
r=Path('projects/brazil-business-survival')
p=r/'story.js';s=p.read_text(encoding='utf-8').replace('    renderSensitivity();\n','')
a=s.index('function renderSensitivity() {');b=s.index('function updateStateSupport()',a)
s=s[:a]+s[b:];p.write_text(s,encoding='utf-8')
p=r/'index.html';s=p.read_text(encoding='utf-8').replace('<div class="sensitivity-note" id="sensitivity-note"></div>','')
s=re.sub(r'Salaried-employment size classes\. Five-year\s+employer-enterprise survival, 2017 cohort\. The source table does\s+not explicitly document the size reference year here; these\s+classes should not be read as predictors measured at founding\.', 'Five-year employer-enterprise survival by employment size, 2017 cohort. These groups describe the cohort; their size should not be treated as a characteristic measured at founding.',s)
s=s.replace('The notebook preserves the source definitions.','');p.write_text(s,encoding='utf-8')
p=r/'depth.js';s=p.read_text(encoding='utf-8').replace('Sector-standardised ranks also change when small cells are excluded. ','');p.write_text(s,encoding='utf-8')
