const DATA = window.DEGREE_ECONOMY_V2 || {};
const $ = id => document.getElementById(id);
const fmt = new Intl.NumberFormat('en-US');
const money = value => '$' + fmt.format(Math.round(Number(value)));
const pct = value => Number(value).toFixed(1) + '%';
const svgNS = 'http://www.w3.org/2000/svg';
let selectedMajor = null;
let occupationMetric = 'change';

function node(tag, attrs = {}) {
  const element = document.createElementNS(svgNS, tag);
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}
function addText(svg, x, y, value, attrs = {}) {
  const t = node('text', { x, y, ...attrs });
  t.textContent = value;
  svg.appendChild(t);
  return t;
}
function chartBox(container, height = 360) {
  container.innerHTML = '';
  const width = Math.max(container.clientWidth || 640, 320);
  const svg = node('svg', { viewBox: `0 0 ${width} ${height}`, role: 'presentation' });
  container.appendChild(svg);
  return { svg, width, height };
}
function scale(value, min, max, start, end) {
  return start + ((Number(value) - min) / ((max - min) || 1)) * (end - start);
}
function tooltip(event, html) {
  const tip = $('tooltip');
  tip.innerHTML = html;
  tip.style.opacity = '1';
  const px = event.clientX || event.target.getBoundingClientRect().left;
  const py = event.clientY || event.target.getBoundingClientRect().top;
  tip.style.left = `${Math.min(px + 12, window.innerWidth - 295)}px`;
  tip.style.top = `${Math.min(py + 12, window.innerHeight - 150)}px`;
}
function hideTooltip(){ $('tooltip').style.opacity = '0'; }
function bindTip(el, message){
  el.addEventListener('mouseenter', event => tooltip(event, message));
  el.addEventListener('mouseleave', hideTooltip);
  el.addEventListener('focus', event => tooltip(event, message));
  el.addEventListener('blur', hideTooltip);
}

function productionChart(){
  const rows = DATA.degree_history.filter(row => row.award_level === "Bachelor's degree");
  const container = $('production-chart');
  const {svg,width,height}=chartBox(container,330);
  const m={l:28,r:38,t:28,b:40};
  const vals=rows.map(r=>Number(r.awards));
  const yMin=Math.floor((Math.min(...vals)-40000)/50000)*50000;
  const yMax=Math.ceil((Math.max(...vals)+40000)/50000)*50000;
  [yMin,(yMin+yMax)/2,yMax].forEach(v=>{
    const y=scale(v,yMin,yMax,height-m.b,m.t);
    svg.appendChild(node('line',{x1:m.l,x2:width-m.r,y1:y,y2:y,class:'gridline'}));
    addText(svg,m.l,y-6,`${(v/1e6).toFixed(2)}m`,{class:'axis-label'});
  });
  let path='';
  rows.forEach((r,i)=>{
    const x=scale(r.year,2014,2024,m.l,width-m.r);
    const y=scale(r.awards,yMin,yMax,height-m.b,m.t);
    path+=`${i?'L':'M'}${x},${y}`;
  });
  svg.appendChild(node('path',{d:path,class:'series-line',stroke:'#287a78'}));
  rows.forEach((r,i)=>{
    const x=scale(r.year,2014,2024,m.l,width-m.r);
    const y=scale(r.awards,yMin,yMax,height-m.b,m.t);
    const c=node('circle',{cx:x,cy:y,r:i===0||i===rows.length-1?5:3.5,fill:'#287a78',class:'series-dot',tabindex:0});
    bindTip(c,`<b>${r.year}</b><br>${fmt.format(r.awards)} bachelor's degrees`);
    svg.appendChild(c);
    if(i===0||i===rows.length-1||r.year===2021){
      addText(svg,x,i===rows.length-1?y-13:y-12,`${r.year}: ${(r.awards/1e6).toFixed(2)}m`,{class:'axis-label','text-anchor':i===0?'start':i===rows.length-1?'end':'middle'});
    }
  });
  [2014,2016,2018,2020,2022,2024].forEach(year=>{
    const x=scale(year,2014,2024,m.l,width-m.r);
    addText(svg,x,height-10,String(year),{class:'axis-label','text-anchor':'middle'});
  });
}

function dumbbellChart(containerId, rows, tone){
  const container=$(containerId);
  const {svg,width,height}=chartBox(container,Math.max(260,rows.length*48+28));
  const mobile=width<560;
  const m={l:mobile?190:235,r:30,t:8,b:22};
  const max=Math.max(...rows.flatMap(r=>[r.awards_2014,r.awards_2024]),1);
  const rowH=(height-m.t-m.b)/rows.length;
  rows.forEach((row,index)=>{
    const y=m.t+index*rowH+rowH/2;
    const x1=scale(row.awards_2014,0,max,m.l,width-m.r);
    const x2=scale(row.awards_2024,0,max,m.l,width-m.r);
    const label=row.field.length>36?row.field.slice(0,34)+'…':row.field;
    addText(svg,m.l-10,y+4,label,{class:'axis-label','text-anchor':'end'});
    svg.appendChild(node('line',{x1,x2,y1:y,y2:y,stroke:tone,'stroke-width':3,'stroke-opacity':.7}));
    const old=node('circle',{cx:x1,cy:y,r:5,fill:'#8b7650',class:'series-dot',tabindex:0});
    const fresh=node('circle',{cx:x2,cy:y,r:5.5,fill:'#287a78',class:'series-dot',tabindex:0});
    const message=`<b>${row.field}</b><br>2014: ${fmt.format(row.awards_2014)}<br>2024: ${fmt.format(row.awards_2024)}<br>Change: ${row.absolute_change>=0?'+':''}${fmt.format(row.absolute_change)} (${row.percent_change>=0?'+':''}${row.percent_change.toFixed(1)}%)`;
    bindTip(old,message);bindTip(fresh,message);svg.appendChild(old);svg.appendChild(fresh);
    addText(svg,Math.max(x1,x2)+8,y+4,`${row.absolute_change>=0?'+':''}${Math.round(row.absolute_change/100)/10}k`,{class:'axis-label'});
  });
}
function shiftChart(){
  const rows=DATA.major_shifts.slice();
  const growers=rows.filter(r=>r.absolute_change>0).sort((a,b)=>b.absolute_change-a.absolute_change).slice(0,5);
  const losers=rows.filter(r=>r.absolute_change<0).sort((a,b)=>a.absolute_change-b.absolute_change).slice(0,5);
  dumbbellChart('shift-chart-growers',growers,'#287a78');
  dumbbellChart('shift-chart-losers',losers,'#c45f43');
}
function fieldExplorer(){
  const select=$('field-select');
  select.innerHTML='';
  select.add(new Option('Select a Field','',true,true));
  DATA.major_shifts.slice().sort((a,b)=>a.field.localeCompare(b.field)).forEach(row=>select.add(new Option(row.field,row.field)));
  const render=()=>{
    const row=DATA.major_shifts.find(item=>item.field===select.value);
    if(!row){
      $('field-result').innerHTML='';
      return;
    }
    $('field-result').innerHTML=`<div><span>2014 awards</span><strong>${fmt.format(row.awards_2014)}</strong></div><div><span>2024 awards</span><strong>${fmt.format(row.awards_2024)}</strong></div><div><span>Numeric change</span><strong>${row.absolute_change>=0?'+':''}${fmt.format(row.absolute_change)}</strong></div><div><span>Percentage change</span><strong>${row.percent_change==null?'N/A':`${row.percent_change>=0?'+':''}${row.percent_change.toFixed(1)}%`}</strong></div>`;
  };
  select.addEventListener('change',render);render();
}

function employmentChart(){
  const rows=DATA.recent_graduate_history;
  const container=$('employment-chart');
  const {svg,width,height}=chartBox(container,380);
  const m={l:50,r:24,t:30,b:40};
  const series=[{key:'recent_graduate_unemployment_pct',label:'Unemployment',color:'#83c2b8'},{key:'recent_graduate_underemployment_pct',label:'Underemployment',color:'#f09b81'}];
  [0,15,30,45,60].forEach(v=>{
    const y=scale(v,0,60,height-m.b,m.t);
    svg.appendChild(node('line',{x1:m.l,x2:width-m.r,y1:y,y2:y,class:'gridline'}));
    addText(svg,m.l-8,y+4,`${v}%`,{class:'axis-label','text-anchor':'end'});
  });
  [2014,2016,2018,2020,2022,2024].forEach(year=>{
    const x=scale(year,2014,2024,m.l,width-m.r);addText(svg,x,height-12,String(year),{class:'axis-label','text-anchor':'middle'});
  });
  series.forEach(s=>{
    let path='';
    rows.forEach((r,i)=>{const x=scale(r.year,2014,2024,m.l,width-m.r);const y=scale(r[s.key],0,60,height-m.b,m.t);path+=`${i?'L':'M'}${x},${y}`;});
    svg.appendChild(node('path',{d:path,class:'series-line',stroke:s.color}));
    rows.forEach(r=>{const x=scale(r.year,2014,2024,m.l,width-m.r);const y=scale(r[s.key],0,60,height-m.b,m.t);const c=node('circle',{cx:x,cy:y,r:3.5,fill:s.color,class:'series-dot',tabindex:0});bindTip(c,`<b>${s.label}</b><br>${r.year}: ${pct(r[s.key])}`);svg.appendChild(c);});
    const last=rows[rows.length-1];const x=scale(last.year,2014,2024,m.l,width-m.r);const y=scale(last[s.key],0,60,height-m.b,m.t);addText(svg,x-4,y-10,`${s.label} ${pct(last[s.key])}`,{class:'axis-label','text-anchor':'end',fill:s.color});
  });
}

function scatterChart(){
  const container=$('major-chart');
  const query=($('major-search').value||'').toLowerCase();
  const rows=DATA.major_outcomes.filter(row=>row.major.toLowerCase().includes(query));
  if(!rows.length){container.innerHTML='<p style="padding:24px;color:#bdd0cf">No majors match that search.</p>';return;}
  const {svg,width,height}=chartBox(container,510);
  const m={l:72,r:30,t:25,b:58};
  const xMax=Math.max(70,...rows.map(r=>r.underemployment_pct));
  const yMin=Math.floor(Math.min(...rows.map(r=>r.early_median),30000)/10000)*10000;
  const yMax=Math.ceil(Math.max(...rows.map(r=>r.early_median),100000)/10000)*10000;
  [0,20,40,60].forEach(v=>{const x=scale(v,0,xMax,m.l,width-m.r);svg.appendChild(node('line',{x1:x,x2:x,y1:m.t,y2:height-m.b,class:'gridline'}));addText(svg,x,height-25,`${v}%`,{class:'axis-label','text-anchor':'middle'});});
  for(let v=yMin;v<=yMax;v+=20000){const y=scale(v,yMin,yMax,height-m.b,m.t);svg.appendChild(node('line',{x1:m.l,x2:width-m.r,y1:y,y2:y,class:'gridline'}));addText(svg,m.l-8,y+4,money(v),{class:'axis-label','text-anchor':'end'});}
  addText(svg,width/2,height-3,'Underemployment rate',{class:'axis-title','text-anchor':'middle'});
  addText(svg,16,height/2,'Early-career median wage',{class:'axis-title',transform:`rotate(-90 16 ${height/2})`,'text-anchor':'middle'});
  rows.forEach(row=>{
    const x=scale(row.underemployment_pct,0,xMax,m.l,width-m.r),y=scale(row.early_median,yMin,yMax,height-m.b,m.t);
    const circle=node('circle',{cx:x,cy:y,r:row.major===selectedMajor?8:5,fill:row.major===selectedMajor?'#f09b81':'#83c2b8',stroke:'#14282c','stroke-width':2,class:'series-dot',tabindex:0});
    const message=`<b>${row.major}</b><br>Unemployment: ${pct(row.unemployment_pct)}<br>Underemployment: ${pct(row.underemployment_pct)}<br>Early-career median: ${money(row.early_median)}<br>Mid-career median: ${money(row.mid_median)}<br>Graduate-degree share: ${pct(row.graduate_degree_share_pct)}`;
    bindTip(circle,message);circle.addEventListener('click',()=>{selectedMajor=row.major;scatterChart();});svg.appendChild(circle);
  });
  const detail=DATA.major_outcomes.find(row=>row.major===selectedMajor);
  const median=key=>DATA.major_outcomes.reduce((sum,row)=>sum+Number(row[key]),0)/DATA.major_outcomes.length;
  const relative=(value,key)=>{const midpoint=median(key),difference=Number(value)-midpoint;if(Math.abs(difference)/midpoint<.05)return 'Around median';return difference>0?'Above median':'Below median';};
  const direction=(value,key)=>relative(value,key).replace(' median','').toLowerCase();
  if(!detail){$('major-detail').innerHTML='Select a point to inspect a major. Search filters the plotted fields.';return;}
  const gain=Number(detail.mid_median)-Number(detail.early_median);
  const gainPct=gain/Number(detail.early_median)*100;
  $('major-detail').innerHTML=`<div class="major-detail-head"><strong>${detail.major}</strong><span>${money(detail.early_median)} early career → ${money(detail.mid_median)} mid-career <b>(+${money(gain)} / +${gainPct.toFixed(0)}%)</b></span></div><div class="major-detail-stats"><span><b>${pct(detail.underemployment_pct)}</b> underemployment</span><span><b>${pct(detail.unemployment_pct)}</b> unemployment</span><span><b>${pct(detail.graduate_degree_share_pct)}</b> graduate degree</span></div><div class="major-relative"><span class="relative-kicker">Relative to other majors</span><div><span>Early earnings</span><b>${relative(detail.early_median,'early_median')}</b></div><div><span>Underemployment</span><b>${relative(detail.underemployment_pct,'underemployment_pct')}</b></div><div><span>Unemployment</span><b>${relative(detail.unemployment_pct,'unemployment_pct')}</b></div><div><span>Mid-career earnings</span><b>${relative(detail.mid_median,'mid_median')}</b></div><div><span>Graduate-degree share</span><b>${relative(detail.graduate_degree_share_pct,'graduate_degree_share_pct')}</b></div></div><p class="major-comparison">Compared with other majors: <strong>${direction(detail.early_median,'early_median')} early-career earnings</strong>, <strong>${direction(detail.underemployment_pct,'underemployment_pct')} underemployment</strong>, and <strong>${direction(detail.unemployment_pct,'unemployment_pct')} unemployment</strong>.</p>`;
}

function occupationChart(){
  const key=occupationMetric==='change'?'change_thousands':'growth_pct';
  const rows=DATA.selected_growth_occupations.filter(r=>r.typical_entry_education==="Bachelor's degree").sort((a,b)=>Number(b[key])-Number(a[key]));
  const {svg,width,height}=chartBox($('occupation-chart'),Math.max(500,rows.length*56+30));
  const m={l:225,r:85,t:10,b:18};
  const max=Math.max(...rows.map(r=>Number(r[key])));
  const rowH=(height-m.t-m.b)/rows.length;
  rows.forEach((row,index)=>{
    const y=m.t+index*rowH+9;const value=Number(row[key]);const barW=scale(value,0,max,0,width-m.l-m.r);
    const bar=node('rect',{x:m.l,y,width:Math.max(2,barW),height:Math.max(22,rowH-16),fill:index<3?'#287a78':'#7ca8a1',class:'bar',tabindex:0});
    const label=occupationMetric==='change'?`+${fmt.format(Math.round(value*1000))}`:pct(value);
    const message=`<b>${row.occupation}</b><br>2024 employment: ${fmt.format(Math.round(row.employment_2024_thousands*1000))}<br>2034 employment: ${fmt.format(Math.round(row.employment_2034_thousands*1000))}<br>Jobs added: +${fmt.format(Math.round(row.change_thousands*1000))}<br>Growth: ${pct(row.growth_pct)}<br>Median wage: ${money(row.median_wage_2024)}`;
    bindTip(bar,message);svg.appendChild(bar);
    const display=row.occupation.length>33?row.occupation.slice(0,31)+'…':row.occupation;
    addText(svg,m.l-10,y+17,display,{class:'axis-label','text-anchor':'end'});
    addText(svg,m.l+barW+8,y+17,label,{class:'axis-label'});
  });
}

function skillsMatrix(){
  const root=$('skills-matrix');
  root.innerHTML=DATA.skills.map(row=>`<article class="skill-card"><div class="growth">+${pct(row.growth_pct)}</div><div class="occupation">${row.occupation}</div><div class="wage">${money(row.median_wage)} median wage · 2024</div><ul>${row.skills.map(skill=>`<li>${skill}</li>`).join('')}</ul></article>`).join('');
  const counts={};
  DATA.skills.forEach(row=>row.skills.forEach(skill=>counts[skill]=(counts[skill]||0)+1));
  const repeated=Object.entries(counts).filter(([,n])=>n>1).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
  $('skill-frequency').innerHTML='<span class="chart-kicker">Repeated across this sample</span>'+repeated.map(([skill,n])=>`<span class="frequency-chip">${skill} <strong>${n}×</strong></span>`).join('');
}

function activeNav(){
  const links=[...document.querySelectorAll('.site-header nav a')];
  const sections=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const observer=new IntersectionObserver(entries=>{
    const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible)return;
    links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${visible.target.id}`));
  },{rootMargin:'-20% 0px -65% 0px',threshold:[0,.1,.25]});
  sections.forEach(section=>observer.observe(section));
}

function init(){
  productionChart();shiftChart();fieldExplorer();employmentChart();scatterChart();occupationChart();skillsMatrix();activeNav();
  $('major-search').addEventListener('input',scatterChart);
  $('major-reset').addEventListener('click',()=>{selectedMajor=null;$('major-search').value='';scatterChart();});
  document.querySelectorAll('.metric-toggle').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.metric-toggle').forEach(b=>b.classList.remove('active'));button.classList.add('active');occupationMetric=button.dataset.metric;occupationChart();}));
  window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-window.innerHeight;$('reading-progress').style.width=`${max?(window.scrollY/max)*100:0}%`;},{passive:true});
  let timer;window.addEventListener('resize',()=>{clearTimeout(timer);timer=setTimeout(()=>{productionChart();shiftChart();employmentChart();scatterChart();occupationChart();},180);});
}
init();
