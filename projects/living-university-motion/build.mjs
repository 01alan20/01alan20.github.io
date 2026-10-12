import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const script=fs.readFileSync(path.join(dir,'script.md'),'utf8');
const contract=JSON.parse(fs.readFileSync(path.join(dir,'data_contracts.json'),'utf8'));
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(dir,'../the-degree-economy/Degree_Story/data/story_data.js'),'utf8'),context);
const degree=context.window.DEGREE_ECONOMY_V2;
const specs=[
 ['The Living University','Demand. Completion. Value.','opening',0,'A system under pressure'],
 ['What America completes','Fields change. Programs must respond.','majors',0,'Historical · IPEDS · 2014 & 2024'],
 ['Rank is only half the story','Look at share, as well as scale.','shares',0,'Historical · IPEDS · 2014 & 2024'],
 ['An academic portfolio in motion','Evidence becomes an institutional choice.','portfolio',0,'Institutional planning illustration'],
 ['Where future demand lives','The next class will not look like the last.','map',1,'Projection · WICHE 2024'],
 ['A smaller national pipeline','The projected peak does not last.','demographics',1,'Projection · WICHE 2024'],
 ['One nation. Different futures.','Local context changes the response.','regions',1,'Projection · 2023 to 2041'],
 ['Three universities. Ten years.','The same timeline. Different paths.','institutions',2,'Institution-reported · Fall 2016–2025'],
 ['Harvard University','An uneven path above its starting point.','harvard',2,'Degree-student fall headcount'],
 ['UNC Charlotte','Expansion, with interruptions.','charlotte',2,'Institution-reported fall enrollment'],
 ['Salem State University','A sustained contraction across the decade.','salem',2,'All-university fall headcount'],
 ['A trajectory is not a verdict','Enrollment tells us what happened, not why.','compare',2,'Index · Fall 2016 = 100'],
 ['Move beyond the headcount','Behind every enrollment is a learner.','arrival',3,'From institutions to a national cohort'],
 ['Follow 100 starters','Move the clock forward six years.','hundred',3,'Fall 2019 national starting cohort'],
 ['Admission is only the beginning','Every pathway has a consequence.','outcomes',3,'Historical · NSC · Six-year outcomes'],
 ['Progress meets friction','A bill. A course. A missed connection.','risk',4,'Illustrative student journey'],
 ['One student. Many systems.','The connections matter as much as the offices.','network',4,'Institutional design illustration'],
 ['The cost of disconnection','A handoff can become a gap.','friction',4,'Illustrative · No measured uplift'],
 ['Connect the response','Detect. Act. Review.','response',4,'Illustrative coordinated support'],
 ['Five foundations for progress','A learning system supports the whole person.','pillars',4,'Conceptual learning-system design'],
 ['Run the journey again','Clearer pathways. Earlier support.','scenario',4,'Design scenario · Not a prediction'],
 ['Cost arrives before completion','Tuition. Living costs. Time.','cost',5,'Illustrative cost ledger · No dollar estimates'],
 ['Same start. Different exposure.','Completion timing changes the journey.','paths',5,'Illustrative pathways'],
 ['The value question has stakes','A descriptive contrast in earnings.','earnings',5,'Historical · BLS · 2025'],
 ['What should a learner expect?','Cost, support, and the possibility of leaving.','value',5,'Questions for institutional leadership'],
 ['Build a university that learns','Measure → Respond → Learn → Improve','feedback',6,'Institutional feedback-loop illustration'],
 ['The Living University','From first interest to alumni.','close',6,'The full learner relationship']
];
const chapters=['What America studies','Where demand lives','Institutional trajectories','After students arrive','A connected university','The price before completion','Designing the future'];
const scenes=[...script.matchAll(/^## (\S+)\s+\{([^}]+)\}\r?\n([\s\S]*?)(?=\r?\n## |$)/gm)].map((m,i)=>{
 const [title,subtitle,type,chapter,label]=specs[i];
 return {id:m[1],title,subtitle,type,chapter,label,text:m[3].replace(/\[#\w+\]/g,'').replace(/\s+/g,' ').trim(),hold:Number(m[2].match(/hold=([\d.]+)/)?.[1]||.8)};
});
if(scenes.length!==27)throw Error('Expected 27 scenes');
// The existing annual major-trends file pools award levels. Use the separate
// bachelor-only project extract at its two observed endpoints, never fabricate years.
const selected=[['Registered Nursing, Nursing Administration, Nursing Research and Clinical Nursing','Nursing'],['Business Administration, Management and Operations','Business administration'],['Psychology, General','Psychology'],['Computer Science','Computer science'],['Biology, General','Biology'],['Criminal Justice and Corrections','Criminal justice'],['Communication and Media Studies','Communication'],['English Language and Literature, General','English']];
const majors=selected.map(([field,label])=>{const r=degree.major_shifts.find(x=>x.field===field||x.field===field.replace(', General',''));if(!r)throw Error('Missing field '+field);return {label,start:r.awards_2014,end:r.awards_2024};});
const totals=[2014,2024].map(year=>degree.degree_levels.find(x=>x.year===year&&x.award_level==="Bachelor's degree").awards);
scenes[1].text="Start with the fields in which American universities award bachelor's degrees. Compare selected fields in 2014 and 2024. Their rankings change as some fields expand and others contract. These are two observed snapshots, not an annual series. Each bar represents degrees awarded, not applications.";
scenes[2].text="A ranking only shows part of the story. Compare each selected field's share of all bachelor's awards in 2014 and 2024. Completions tell us where students finished their studies, with a delay after their original choices.";
const stateChanges={AK:-14,HI:-33,WA:-8,MT:5,ND:13,MN:-12,WI:-15,MI:-20,ID:13,WY:-23,SD:7,IA:-4,IL:-32,IN:-10,OH:-6,OR:-19,NV:-9,UT:-6,NE:-4,MO:-12,KY:-9,WV:-26,VA:-6,MD:-11,DE:8,CA:-29,AZ:-2,CO:-12,KS:-12,AR:-5,TN:15,SC:14,NC:6,DC:31,NM:-21,OK:0,TX:5,LA:-4,MS:-16,AL:2,GA:-1,FL:12,PA:-17,NJ:-1,CT:-4,NY:-27,MA:-8,RI:-15,VT:-15,NH:-10,ME:-10};
const data={chapters,scenes,majors,majorTotals:totals,institutions:contract.institutions.cases,cohort:contract.cohort,earnings:contract.earnings,stateChanges,sources:{majors:'https://nces.ed.gov/ipeds/use-the-data',wiche:'https://www.wiche.edu/wp-content/uploads/2024/12/Executive-Summary-Knocking-at-the-College-Door-final.pdf',cohort:'https://www.studentclearinghouse.org/news/college-completion-rates-hold-steady-at-recent-highs/',earnings:'https://www.bls.gov/emp/tables/unemployment-earnings-education.htm'}};
fs.mkdirSync(path.join(dir,'assets'),{recursive:true});
const timingPath=path.join(dir,'assets/narration-timing.json');
if(fs.existsSync(timingPath)){
 const timing=JSON.parse(fs.readFileSync(timingPath,'utf8').replace(/^\uFEFF/,''));let start=0;
 for(const s of scenes){const row=timing.find(x=>x.id===s.id);if(!row)throw Error('Missing narration '+s.id);s.start=start;s.audioDuration=row.duration;s.duration=row.duration+s.hold+.8;s.audio='assets/'+s.id+'.mp3';start+=s.duration;}
 data.duration=start;
 const stamp=n=>{const ms=Math.round(n*1000);return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`;};
 const cues=[];
 for(const s of scenes){const words=s.text.split(' '),chunks=[];let current=[];for(const w of words){current.push(w);if(current.length>=13||/[.!?]$/.test(w)){chunks.push(current);current=[];}}if(current.length)chunks.push(current);let offset=0;for(const ch of chunks){const from=s.start+.4+offset/words.length*s.audioDuration;offset+=ch.length;const to=s.start+.4+offset/words.length*s.audioDuration;cues.push(`${stamp(from)} --> ${stamp(to)}\n${ch.join(' ')}`);}}
 fs.writeFileSync(path.join(dir,'assets/captions.vtt'),'WEBVTT\n\n'+cues.join('\n\n')+'\n');
}
fs.writeFileSync(path.join(dir,'assets/story-data.json'),JSON.stringify(data));
fs.writeFileSync(path.join(dir,'assets/story-data.js'),'window.LIVING_DATA='+JSON.stringify(data)+';\n');
if(data.duration){
 const video=path.join(dir,'video'),assets=path.join(video,'assets');fs.mkdirSync(assets,{recursive:true});
 for(const name of ['story-data.js',...scenes.map(s=>s.id+'.mp3')])fs.copyFileSync(path.join(dir,'assets',name),path.join(assets,name));
 fs.copyFileSync(path.join(dir,'story.js'),path.join(assets,'story.js'));
 const audios=scenes.map((s,i)=>`<audio id="voice-${i}" src="assets/${s.id}.mp3" data-start="${(s.start+.4).toFixed(3)}" data-duration="${s.audioDuration}" data-track-index="1" preload="auto"></audio>`).join('\n');
 const html=`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=1600,height=900"><title>The Living University</title><script src="assets/gsap.min.js"></script><style>html,body{margin:0;width:1600px;height:900px;overflow:hidden;background:#101827}#root{width:100%;height:100%;position:relative}canvas{width:100%;height:100%;display:block}</style></head><body><div id="root" data-composition-id="main" data-start="0" data-width="1600" data-height="900" data-duration="${data.duration}"><canvas id="story" width="1600" height="900"></canvas></div>${audios}<script src="assets/story-data.js"></script><script src="assets/story.js"></script><script>const clock={time:0};const canvas=document.getElementById('story');const tl=gsap.timeline({paused:true,onUpdate:()=>LivingStory.draw(canvas,clock.time)});tl.to(clock,{time:${data.duration},duration:${data.duration},ease:'none'},0);window.__timelines=window.__timelines||{};window.__timelines.main=tl;LivingStory.draw(canvas,0);</script></body></html>`;
 fs.writeFileSync(path.join(video,'index.html'),html);
}
console.log(JSON.stringify({scenes:scenes.length,majors:majors.length,duration:data.duration||'narration pending'}));
