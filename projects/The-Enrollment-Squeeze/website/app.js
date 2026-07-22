
const NATIONAL = window.ENROLLMENT_NATIONAL || [];

const FALLBACK_STATES = window.ENROLLMENT_STATES || [];

const FALLBACK_INSTITUTIONS = window.ENROLLMENT_INSTITUTIONS || [];

let stateRows = FALLBACK_STATES;
let institutions = FALLBACK_INSTITUTIONS;
let selectedInstitution = FALLBACK_INSTITUTIONS[0];

const $ = id => document.getElementById(id);
const fmtInt = n => new Intl.NumberFormat("en-US",{maximumFractionDigits:0}).format(Math.round(n||0));
const fmtCompact = n => new Intl.NumberFormat("en-US",{notation:"compact",maximumFractionDigits:2}).format(n||0);
const fmtPct = n => n==null ? "—" : new Intl.NumberFormat("en-US",{style:"percent",maximumFractionDigits:1,signDisplay:"exceptZero"}).format(n);
const fmtMoney = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",notation:"compact",maximumFractionDigits:1,signDisplay:"exceptZero"}).format(n||0);
const clamp = (x,a,b)=>Math.max(a,Math.min(b,x));

function svgEl(name, attrs={}) {
  const el=document.createElementNS("http://www.w3.org/2000/svg",name);
  Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));
  return el;
}

function renderHeroChart(){
  const svg=$("hero-chart");
  const w=1200,h=300,p={l:62,r:30,t:25,b:42};
  svg.setAttribute("viewBox",`0 0 ${w} ${h}`);
  svg.innerHTML="";
  const xs=NATIONAL.map(d=>d.year), ys=NATIONAL.map(d=>d.graduates);
  const x=d=>p.l+(d-Math.min(...xs))/(Math.max(...xs)-Math.min(...xs))*(w-p.l-p.r);
  const minY=3350000,maxY=3920000;
  const y=d=>p.t+(maxY-d)/(maxY-minY)*(h-p.t-p.b);
  [3400000,3500000,3600000,3700000,3800000,3900000].forEach(v=>{
    svg.append(svgEl("line",{x1:p.l,x2:w-p.r,y1:y(v),y2:y(v),stroke:"#d8dde2"}));
    const t=svgEl("text",{x:p.l-10,y:y(v)+4,"text-anchor":"end",fill:"#718092","font-size":"12"});
    t.textContent=(v/1e6).toFixed(1)+"m";svg.append(t);
  });
  xs.forEach(v=>{
    const t=svgEl("text",{x:x(v),y:h-12,"text-anchor":"middle",fill:"#718092","font-size":"12"});
    t.textContent=v;svg.append(t);
  });
  const observed=NATIONAL.filter(d=>d.year<=2024);
  const projected=NATIONAL.filter(d=>d.year>=2024);
  function path(rows){
    return rows.map((d,i)=>(i?"L":"M")+x(d.year)+","+y(d.graduates)).join(" ");
  }
  svg.append(svgEl("path",{d:path(observed),fill:"none",stroke:"#0d2340","stroke-width":"4"}));
  svg.append(svgEl("path",{d:path(projected),fill:"none",stroke:"#1f8588","stroke-width":"4","stroke-dasharray":"10 9"}));
  NATIONAL.forEach(d=>svg.append(svgEl("circle",{cx:x(d.year),cy:y(d.graduates),r:d.year===2026?7:4,fill:d.year<=2024?"#0d2340":"#1f8588"})));
  const ann=svgEl("text",{x:x(2026)+12,y:y(3847113)-15,fill:"#0d2340","font-size":"13","font-weight":"700"});
  ann.textContent="Projected peak";svg.append(ann);
}

function renderPipeline(){
  const year=+$("pipeline-year").value;
  const base=NATIONAL.find(d=>d.year===2026);
  const d=NATIONAL.find(d=>d.year===year);
  const stages=[
    ["High-school graduates",d.graduates,base.graduates],
    ["Likely college entrants",d.college,base.college],
    ["Likely four-year entrants",d.four,base.four]
  ];
  const max=base.graduates;
  $("pipeline-chart").innerHTML=stages.map(([label,value,start])=>{
    const height=Math.max(30,value/max*270);
    const diff=value-start;
    return `<div class="pipeline-stage">
      <em>${diff===0?"2026 baseline":fmtInt(diff)+" vs 2026"}</em>
      <div class="bar" style="height:${height}px"></div>
      <strong>${fmtCompact(value)}</strong>
      <span>${label}</span>
    </div>`;
  }).join("");
  $("pipeline-takeaway").textContent=`By ${year}, the United States is projected to produce ${fmtInt(base.graduates-d.graduates)} fewer high-school graduates and ${fmtInt(base.four-d.four)} fewer likely four-year entrants than in 2026.`;
}

function normalizeState(row){
  const code=row.state||row.code||row.stabbr;
  const fallback=FALLBACK_STATES.find(d=>d.state===code)||{};
  return {
    state:code,
    name:row.name||row.stateName||fallback.name||row.state,
    year:+row.year||2041,
    graduates:+row.graduates||fallback.graduates||0,
    fourYearEntrants:+row.fourYearEntrants||+row.likelyFourYearEntrants||fallback.fourYearEntrants||0,
    change:Number(row.change ?? row.entrantChange ?? fallback.change ?? 0),
    currentIntake:+row.currentIntake||+row.firstTimeIntake||+row.current_first_time_intake||fallback.currentIntake||0,
    home:+row.home||+row.homeStateEntrants||+row.firstTimeInState||fallback.home||0,
    other:+row.other||+row.domesticImports||+row.firstTimeOutState||fallback.other||0,
    international:+row.international||+row.internationalEntrants||+row.firstTimeInternational||fallback.international||0,
    unknown:+row.unknown||+row.unknownResidence||fallback.unknown||0,
    institutions:+row.institutions||+row.institutionCount||fallback.institutions||0
  };
}
function normalizeInstitution(row){
  const currentUG=+(row.latestScorecardUG ?? row.currentUG ?? row.ugds ?? row.undergraduate ?? 0);
  const first=+(row.firstTimeClass ?? row.firstTimeTotal ?? row.first_time_class ?? Math.max(50,currentUG*.20));
  const intl=Number(row.internationalFTShare ?? row.internationalShare ?? row.internationalUGShare ?? 0.05);
  const home=Number(row.homeStateShare ?? row.inStateFTShare ?? row.inStateShare ?? 0.60);
  const other=Number(row.otherStateShare ?? row.outStateFTShare ?? row.outStateShare ?? Math.max(0,1-home-intl));
  const unknown=Math.max(0,1-home-other-intl);
  return {
    unitid:String(row.unitid ?? row.UNITID ?? row.id ?? row.name),
    name:row.name ?? row.instnm ?? "Institution",
    state:row.state ?? row.stabbr ?? "",
    control:(row.controlLabel ?? row.control ?? row.CONTROL ?? "").toString(),
    outStatePriceFactor:Number(row.outStatePriceFactor ?? row.out_state_price_factor ?? row.tuitionOutStateRatio ?? 1.55),
    city:row.city ?? "",
    currentUG,
    currentPG:+(row.latestScorecardPG ?? row.currentPG ?? row.grads ?? 0),
    firstTimeClass:first,
    homeShare:clamp(home,0,1),
    otherShare:clamp(other,0,1),
    internationalShare:clamp(intl,0,1),
    unknownShare:unknown,
    observedChange:Number(row.observedChange ?? row.enrollmentChange ?? row.scorecardChange ?? row.enrollmentCagr ?? 0),
    historicalResidual:Number(row.historicalResidual ?? row.relativePerformance ?? row.enrollmentCagr ?? 0),
    retention:Number(row.retention ?? row.latestRetention ?? row.retentionRate ?? 0.75),
    admissionRate:Number(row.latestAdmissionRate ?? row.admitRate ?? row.admissionRate ?? 0.65),
    tuitionPerFTE:Number(row.tuitionPerFTE ?? row.tuitfte ?? 15000),
    stateChange2041:Number(row.stateChange2041 ?? row.marketChange ?? row.stateMarketChange ?? -0.11),
    peerLabel:row.peerLabel ?? ((Number(row.observedChange ?? 0)>=0?"Historically growing":"Historically declining")+" / "+(Number(row.marketChange ?? -0.1)<0?"future state contraction":"future state growth"))
  };
}

async function tryRemoteData(){
  // All prototype data is bundled locally.
  populateControls();
}

function populateControls(){
  const year=+$("state-year").value;
  const matchingYear=stateRows.filter(r=>r.year===year);
  const optionRows=matchingYear.length?matchingYear:stateRows;
  const available=[...new Map(optionRows.map(r=>[r.state,r.name])).entries()].sort((a,b)=>a[1].localeCompare(b[1]));
  $("state-select").innerHTML=available.map(([code,name])=>`<option value="${code}">${name}</option>`).join("");
  if(!available.length){
    $("state-select").innerHTML='<option value="AL">Alabama</option>';
  }
  const sorted=institutions.slice().sort((a,b)=>a.name.localeCompare(b.name));
  $("institution-options").innerHTML=sorted.slice(0,3000).map(r=>`<option value="${r.name}"></option>`).join("");
  const publicExample=institutions.find(r=>/University of Alabama/i.test(r.name));
  selectedInstitution=publicExample||institutions[0]||FALLBACK_INSTITUTIONS[0];
  $("institution-search").value=selectedInstitution.name;
  renderState();
  renderStateOverview();
  renderForecast();
}

function getStateRow(code,year){
  return stateRows.find(r=>r.state===code&&r.year===year)
    || stateRows.find(r=>r.state===code)
    || FALLBACK_STATES[0];
}

function renderState(){
  const code=$("state-select").value||"AL", year=+$("state-year").value;
  const row=getStateRow(code,year);
  let demand=row.currentIntake;
  let home=row.home,other=row.other,intl=row.international,unknown=row.unknown;
  if(!demand){
    const base=FALLBACK_STATES.find(r=>r.state===code)||FALLBACK_STATES[0];
    demand=base.currentIntake;home=base.home;other=base.other;intl=base.international;unknown=base.unknown;
  }
  const supply=row.fourYearEntrants||0;
  const coverage=demand?supply/demand:0;
  $("state-title").textContent=`${row.name} market profile`;
  $("state-supply").textContent=fmtInt(supply);
  $("state-demand").textContent=fmtInt(demand);
  $("state-coverage").textContent=coverage?coverage.toFixed(2)+"×":"—";
  $("coverage-fill").style.width=Math.min(100,coverage*50)+"%";
  $("coverage-interpretation").textContent=coverage<1?"Projected resident supply is smaller than current entering-class demand.":"Projected resident supply is numerically larger than current intake, although retention and competition still matter.";
  const total=home+other+intl+unknown||demand;
  $("origin-total").textContent=fmtInt(total)+" students";
  $("state-origin-bar").innerHTML=[
    ["home-bg",home],["other-bg",other],["intl-bg",intl],["unknown-bg",unknown]
  ].map(([cls,val])=>`<span class="${cls}" style="width:${total?val/total*100:0}%"></span>`).join("");
  $("state-change").textContent=fmtPct(row.change);
  $("state-import").textContent=fmtPct(total?other/total:0);
  $("state-intl").textContent=fmtPct(total?intl/total:0);
  $("state-institutions").textContent=row.institutions||"—";
  $("state-summary").textContent=coverage<1
    ? `${row.name}'s projected resident entrant pool would cover roughly ${Math.round(coverage*100)}% of the current first-time intake shown here. The rest must come from imported, international, transfer, adult, or newly participating students—or from smaller entering classes.`
    : `${row.name}'s projected resident pool remains larger than its current entering-class scale in aggregate. That does not mean every institution is protected: residents leave, institutions compete unevenly, and stronger colleges may take more share.`;
}


const TILE_POSITIONS = window.ENROLLMENT_STATE_GRID || {};
function mixHex(a,b,t){
  const A=[1,3,5].map(i=>parseInt(a.slice(i,i+2),16)),B=[1,3,5].map(i=>parseInt(b.slice(i,i+2),16));
  return "#"+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,"0")).join("");
}
function changeColor(v){
  const limit=.30,n=clamp(v/limit,-1,1);
  return n<0?mixHex("#e8decc","#a43f36",Math.abs(n)):mixHex("#e8decc","#247b55",n);
}
function overviewRows(){
  const rows2041=stateRows.filter(r=>r.year===2041);
  const rows=rows2041.length?rows2041:stateRows;
  const byState=new Map(rows.map(r=>[r.state,r]));
  FALLBACK_STATES.forEach(f=>{if(!byState.has(f.state))byState.set(f.state,f);});
  return [...byState.values()];
}
function renderStateGrid(rows){
  const holder=$("state-grid-map");
  const byState=new Map(rows.map(r=>[r.state,r]));
  holder.innerHTML=Object.entries(TILE_POSITIONS).map(([code,pos])=>{
    const [col,row]=pos,d=byState.get(code),v=d?.change??0;
    return `<button type="button" class="state-grid-tile${Math.abs(v)<.015?" neutral":""}"
      style="grid-column:${col};grid-row:${row};background:${changeColor(v)}"
      data-tip="${d?.name||code}: ${fmtPct(v)}"
      aria-label="${d?.name||code}, ${fmtPct(v)} projected change">${code}</button>`;
  }).join("");
}
function renderCoverageRanking(rows){
  const ranked=rows.filter(r=>r.currentIntake>0&&r.fourYearEntrants>0)
    .map(r=>({...r,coverage:r.fourYearEntrants/r.currentIntake}))
    .sort((a,b)=>b.coverage-a.coverage);
  const svg=$("state-coverage-ranking");
  const width=980,rowH=25,top=52,bottom=30,left=152,right=70,maxX=Math.max(1.6,...ranked.map(r=>r.coverage))*1.03;
  const height=top+bottom+ranked.length*rowH;
  svg.setAttribute("viewBox",`0 0 ${width} ${height}`);
  svg.setAttribute("height",height);
  svg.innerHTML="";
  const x=v=>left+(v/maxX)*(width-left-right);
  [0,.5,1,1.5,2].filter(v=>v<=maxX+.05).forEach(v=>{
    svg.append(svgEl("line",{x1:x(v),x2:x(v),y1:top-22,y2:height-bottom,stroke:v===1?"#0d2340":"#d6d9dc","stroke-width":v===1?2:1,"stroke-dasharray":v===1?"5 4":"0"}));
    const t=svgEl("text",{x:x(v),y:top-30,"text-anchor":"middle",fill:"#657381","font-size":"12","font-weight":v===1?"800":"500"});
    t.textContent=v.toFixed(1)+"×";svg.append(t);
  });
  ranked.forEach((r,i)=>{
    const cy=top+i*rowH;
    const label=svgEl("text",{x:left-12,y:cy+5,"text-anchor":"end",fill:"#233b53","font-size":"11"});
    label.textContent=r.name;svg.append(label);
    svg.append(svgEl("rect",{x:left,y:cy-8,width:Math.max(2,x(r.coverage)-left),height:15,fill:r.coverage>=1?"#2d9168":"#ba5144",rx:"1"}));
    const value=svgEl("text",{x:x(r.coverage)+8,y:cy+5,fill:r.coverage>=1?"#256f51":"#993e35","font-size":"11","font-weight":"800"});
    value.textContent=r.coverage.toFixed(2)+"×";svg.append(value);
  });
}
function renderStateOverview(){
  const rows=overviewRows();
  renderStateGrid(rows);
  renderCoverageRanking(rows);
}
function renderSizeBars(){
  const rows=[
    ["20,000+",16,84],
    ["10,000–19,999",38,62],
    ["5,000–9,999",51,49],
    ["1,000–4,999",63,37],
    ["Under 1,000",74,26]
  ];
  $("size-bars").innerHTML=rows.map(([label,decline,grow])=>`<div class="div-row">
    <span class="div-label">${label}</span>
    <div class="div-track">
      <div class="div-decline" style="width:${decline/2}%">${decline}% declined</div>
      <div class="div-grow" style="width:${grow/2}%">${grow}% grew</div>
    </div>
  </div>`).join("");
}

function internationalMultiplier(year,path){
  const base={2030:1,2035:1.08,2041:1.16};
  const limited={2030:.92,2035:1,2041:1.06};
  const strong={2030:1.04,2035:1.15,2041:1.28};
  return (path==="limited"?limited:path==="strong"?strong:base)[year]||1;
}
function nationalMarketIndex(year){
  const base=NATIONAL.find(d=>d.year===2026).four;
  const target=NATIONAL.find(d=>d.year===year)?.four||base;
  return target/base;
}
function stateMarketIndex(inst,year){
  const rows=stateRows.filter(r=>r.state===inst.state);
  const row=rows.find(r=>r.year===year);
  if(row){
    const base=rows.find(r=>r.year===2026);
    if(base?.fourYearEntrants) return row.fourYearEntrants/base.fourYearEntrants;
    return 1+row.change;
  }
  const full=inst.stateChange2041||-0.11;
  const share=(year-2026)/(2041-2026);
  return 1+full*share;
}

function modelInstitution(inst,year,path,momentumShare){
  const first=inst.firstTimeClass||Math.max(50,inst.currentUG*.2);
  const home0=first*inst.homeShare;
  const other0=first*inst.otherShare;
  const intl0=first*inst.internationalShare;
  const unknown0=Math.max(0,first-home0-other0-intl0);
  const stateIdx=stateMarketIndex(inst,year);
  const natIdx=nationalMarketIndex(year);
  const horizon=(year-2024)/(2041-2024);
  const residual=clamp(inst.historicalResidual||inst.observedChange||0,-.20,.20);
  const momentum=1+residual*(momentumShare/100)*horizon;
  const home=home0*stateIdx*momentum;
  const other=other0*natIdx*momentum;
  const intl=intl0*internationalMultiplier(year,path)*Math.max(.85,momentum);
  const unknown=unknown0*natIdx;
  const projectedFirst=Math.max(0,home+other+intl+unknown);
  const firstRatio=first?projectedFirst/first:1;
  const retention=clamp(inst.retention||.75,.35,.99);
  const stockWeight=.62+.18*retention;
  const projectedUG=Math.max(0,inst.currentUG*(1-stockWeight+stockWeight*firstRatio));
  const ugChange=inst.currentUG?projectedUG/inst.currentUG-1:0;
  const fteRatio=.86;
  const tuition=(projectedUG-inst.currentUG)*fteRatio*(inst.tuitionPerFTE||15000);
  const currentTuition=inst.currentUG*fteRatio*(inst.tuitionPerFTE||15000);
  return {first,home0,other0,intl0,unknown0,home,other,intl,unknown,projectedFirst,firstRatio,projectedUG,ugChange,tuition,currentTuition,stateIdx,natIdx,momentum};
}

function findInstitution(name){
  const exact=institutions.find(r=>r.name.toLowerCase()===name.toLowerCase());
  if(exact)return exact;
  return institutions.find(r=>r.name.toLowerCase().includes(name.toLowerCase()))||selectedInstitution;
}


let replacementMix={home:40,other:35,intl:25};
let adjustingMix=false;
function confidenceFor(inst,year){
  const coverageChecks=[
    inst.currentUG>0,
    inst.firstTimeClass>0,
    Number.isFinite(inst.homeShare)&&Number.isFinite(inst.otherShare)&&Number.isFinite(inst.internationalShare),
    Number.isFinite(inst.observedChange),
    inst.retention>0,
    inst.tuitionPerFTE>0,
    Number.isFinite(inst.stateChange2041)
  ];
  const dataCoverage=coverageChecks.filter(Boolean).length/coverageChecks.length;

  const volatility=Number.isFinite(inst.volatility)
    ? Math.abs(inst.volatility)
    : Math.min(.25,Math.abs(inst.historicalResidual||inst.observedChange||0));
  const historicalStability=clamp(1-volatility/.25,0,1);

  const residenceCoverage=
    Number.isFinite(inst.homeShare)&&
    Number.isFinite(inst.otherShare)&&
    Number.isFinite(inst.internationalShare)
      ? 1
      : 0.45;

  const financeCoverage=inst.tuitionPerFTE>0 ? 1 : 0.35;

  const score=
    .40*dataCoverage+
    .30*historicalStability+
    .20*residenceCoverage+
    .10*financeCoverage;

  return {
    score,
    label:score>=.75?"Higher":score>=.50?"Moderate":"Limited"
  };
}
function normalizeMix(changed,value){
  if(adjustingMix)return;
  adjustingMix=true;
  replacementMix[changed]=value;
  const others=Object.keys(replacementMix).filter(k=>k!==changed);
  const remainder=100-value;
  const oldTotal=others.reduce((s,k)=>s+replacementMix[k],0)||1;
  others.forEach((k,i)=>{
    replacementMix[k]=i===others.length-1
      ? remainder-others.slice(0,-1).reduce((s,x)=>s+replacementMix[x],0)
      : Math.round(replacementMix[k]/oldTotal*remainder);
  });
  const sum=Object.values(replacementMix).reduce((a,b)=>a+b,0);
  if(sum!==100)replacementMix[others.at(-1)]+=100-sum;
  ["home","other","intl"].forEach(k=>{
    const el=$(k+"-mix"); if(el)el.value=replacementMix[k];
  });
  adjustingMix=false;
}
function renderForecast(){
  const name=$("institution-search").value.trim();
  selectedInstitution=findInstitution(name)||FALLBACK_INSTITUTIONS[0];
  const year=+$("forecast-year").value;
  const path=$("international-path").value;
  const momentum=+$("momentum-slider").value;
  $("momentum-output").textContent=momentum+"%";
  const m=modelInstitution(selectedInstitution,year,path,momentum);
  $("institution-name").textContent=selectedInstitution.name;
  $("institution-context").textContent=selectedInstitution.peerLabel;
  $("headline-enrollment").textContent=fmtInt(m.projectedUG);
  $("headline-change").textContent=`${fmtPct(m.ugChange)} from ${fmtInt(selectedInstitution.currentUG)}`;
  const conf=confidenceFor(selectedInstitution,year);
  $("confidence-label").textContent=conf.label;
  $("confidence-fill").style.width=(conf.score*100)+"%";

  const current=[m.home0,m.other0,m.intl0,m.unknown0];
  const future=[m.home,m.other,m.intl,m.unknown];
  const colors=["home-bg","other-bg","intl-bg","unknown-bg"];
  function stacked(values){
    const total=values.reduce((a,b)=>a+b,0)||1;
    return values.map((v,i)=>`<i class="${colors[i]}" style="width:${v/total*100}%"></i>`).join("");
  }
  $("entry-comparison").innerHTML=`
    <div class="entry-row"><span>Current</span><div class="entry-stacked">${stacked(current)}</div><strong>${fmtInt(m.first)}</strong></div>
    <div class="entry-row"><span>${year}</span><div class="entry-stacked">${stacked(future)}</div><strong>${fmtInt(m.projectedFirst)}</strong></div>`;

  const components=[
    ["Current class",m.first,"total"],
    ["Home market",m.home-m.home0,(m.home-m.home0)>=0?"positive":"negative"],
    ["Other states",m.other-m.other0,(m.other-m.other0)>=0?"positive":"negative"],
    ["International",m.intl-m.intl0,(m.intl-m.intl0)>=0?"positive":"negative"],
    ["Capture trend",(m.home0+m.other0)*(m.momentum-1),(m.momentum-1)>=0?"positive":"negative"],
    [`${year} class`,m.projectedFirst,"total"]
  ];
  const max=Math.max(...components.map(d=>Math.abs(d[1])),m.first);
  $("waterfall").innerHTML=components.map(([label,value,cls],idx)=>{
    const height=idx===0||idx===components.length-1?Math.abs(value)/max*190:Math.max(8,Math.abs(value)/max*190);
    return `<div class="wf-item"><b>${value>=0&&idx>0&&idx<components.length-1?"+":""}${fmtInt(value)}</b><div class="wf-bar ${cls}" style="height:${height}px"></div><span>${label}</span></div>`;
  }).join("");

  const totalGap=Math.max(0,selectedInstitution.currentUG-m.projectedUG);
  $("replacement-total").textContent=fmtInt(totalGap);
  ["home","other","intl"].forEach(k=>{
    $(k+"-mix-output").textContent=replacementMix[k]+"%";
  });
  $("replacement-mix-stack").innerHTML=`
    <span class="home-bg" style="width:${replacementMix.home}%"></span>
    <span class="other-bg" style="width:${replacementMix.other}%"></span>
    <span class="intl-bg" style="width:${replacementMix.intl}%"></span>`;
  const replacementRows=[
    ["Home state",totalGap*replacementMix.home/100,m.home0,"home"],
    ["Other U.S.",totalGap*replacementMix.other/100,m.other0,"other"],
    ["International",totalGap*replacementMix.intl/100,m.intl0,"intl"]
  ];
  $("replacement-table").innerHTML=`<table class="replacement-table"><thead><tr><th>Channel</th><th>Students</th><th>Growth over current channel</th><th>Feasibility</th></tr></thead><tbody>${
    replacementRows.map(([label,needed,base,key])=>{
      const growth=base?needed/base:0;
      const cls=growth<=.10?"within":growth<=.35?"above":"far";
      const text=cls==="within"?"Low required growth":cls==="above"?"Moderate required growth":"High required growth";
      return `<tr><td>${label}</td><td>${fmtInt(needed)}</td><td>${fmtPct(growth)}</td><td><span class="feasibility ${cls}">${text}</span></td></tr>`;
    }).join("")
  }</tbody></table>`;

  const publicInstitution=/public|1/i.test(String(selectedInstitution.control||""));
  const outFactor=publicInstitution?(selectedInstitution.outStatePriceFactor||1.55):1;
  const fte=.86;
  const baseTuition=selectedInstitution.tuitionPerFTE||15000;
  const recoveredRevenue=fte*baseTuition*(
    totalGap*replacementMix.home/100+
    totalGap*replacementMix.other/100*outFactor+
    totalGap*replacementMix.intl/100*outFactor
  );
  const adjustedTuition=Math.min(0,m.tuition+recoveredRevenue);
  $("tuition-impact").textContent=fmtMoney(m.tuition);
  $("tuition-share").textContent=`${fmtPct(m.currentTuition?m.tuition/m.currentTuition:0)} of the current modeled tuition base in ${year}.`;
  $("adjusted-tuition-impact").textContent=fmtMoney(adjustedTuition);
  $("recovered-tuition-note").textContent=`The selected mix recovers approximately ${fmtMoney(recoveredRevenue)} in annual gross tuition.`;
  renderEnrollmentPath(selectedInstitution,m,year);
  $("sensitivity-row").innerHTML=[.05,.10,.20].map(loss=>{
    const val=-selectedInstitution.currentUG*loss*.86*(selectedInstitution.tuitionPerFTE||15000);
    return `<div><span>${Math.round(loss*100)}% loss</span><b>${fmtMoney(val)}</b></div>`;
  }).join("");
}

function renderEnrollmentPath(inst,m,target){
  const box=$("enrollment-path");
  const w=620,h=170,p={l:40,r:15,t:15,b:28};
  const years=[2024,2030,2035,2041].filter(y=>y<=target||y===target);
  if(!years.includes(target))years.push(target);
  years.sort((a,b)=>a-b);
  const vals=years.map(y=>y===2024?inst.currentUG:modelInstitution(inst,y,$("international-path").value,+$("momentum-slider").value).projectedUG);
  const min=Math.min(...vals)*.92,max=Math.max(...vals)*1.06;
  const x=y=>p.l+(y-2024)/(target-2024||1)*(w-p.l-p.r);
  const yy=v=>p.t+(max-v)/(max-min||1)*(h-p.t-p.b);
  const points=years.map((y,i)=>`${x(y)},${yy(vals[i])}`).join(" ");
  box.innerHTML=`<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
    ${[0,.5,1].map(t=>`<line x1="${p.l}" x2="${w-p.r}" y1="${p.t+t*(h-p.t-p.b)}" y2="${p.t+t*(h-p.t-p.b)}" stroke="#dde2e6"/>`).join("")}
    <polyline points="${points}" fill="none" stroke="#1f8588" stroke-width="4"/>
    ${years.map((y,i)=>`<circle cx="${x(y)}" cy="${yy(vals[i])}" r="5" fill="${y===2024?"#0d2340":"#1f8588"}"/><text x="${x(y)}" y="${h-7}" text-anchor="middle" font-size="11" fill="#718092">${y}</text>`).join("")}
    <text x="${x(target)-5}" y="${yy(vals.at(-1))-10}" text-anchor="end" font-size="12" font-weight="700" fill="#0d2340">${fmtInt(vals.at(-1))}</text>
  </svg>`;
}

function renderExplorer(inst,m,year,shortfall){
  $("explorer-summary").innerHTML=`
    <article><span>Observed position</span><strong>${fmtPct(inst.observedChange)}</strong><p>${inst.peerLabel}. Admissions ${fmtPct(inst.admissionRate)}; retention ${fmtPct(inst.retention)}.</p></article>
    <article><span>Current student markets</span><strong>${fmtPct(inst.homeShare)} home state</strong><p>${fmtPct(inst.otherShare)} other U.S.; ${fmtPct(inst.internationalShare)} international.</p></article>
    <article><span>${year} modeled outlook</span><strong>${fmtInt(m.projectedUG)}</strong><p>${fmtInt(m.projectedUG-inst.currentUG)} undergraduates versus the current baseline.</p></article>
    <article><span>Replacement and tuition</span><strong>${fmtInt(shortfall)} entrants</strong><p>${fmtMoney(m.tuition)} estimated annual gross tuition consequence.</p></article>`;
}


function initReveals(){
  const nodes=document.querySelectorAll(".reveal");
  if(!("IntersectionObserver" in window)){nodes.forEach(n=>n.classList.add("is-visible"));return;}
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}
    });
  },{threshold:.08,rootMargin:"0px 0px -40px 0px"});
  nodes.forEach(n=>observer.observe(n));
}

function updateProgress(){
  const doc=document.documentElement;
  const ratio=doc.scrollTop/(doc.scrollHeight-doc.clientHeight);
  $("progress-bar").style.width=(ratio*100)+"%";
}

$("pipeline-year").addEventListener("change",renderPipeline);
$("state-select").addEventListener("change",renderState);
$("state-year").addEventListener("change",()=>{populateControls();});
["institution-search","forecast-year","international-path","momentum-slider"].forEach(id=>{
  $(id).addEventListener(id==="institution-search"?"change":"input",renderForecast);
});
["home","other","intl"].forEach(k=>{
  $(k+"-mix").addEventListener("input",event=>{
    normalizeMix(k,+event.target.value);
    renderForecast();
  });
});
window.addEventListener("scroll",updateProgress,{passive:true});

initReveals();
renderHeroChart();
renderPipeline();
renderSizeBars();
populateControls();
if(!location.search.includes("offline=1")) tryRemoteData();
