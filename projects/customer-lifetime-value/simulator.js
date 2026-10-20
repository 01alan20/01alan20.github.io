function calculateRetention(group,{budget,cost,margin,lift}){
  const values=[budget,cost,margin,lift];
  if(!values.every(Number.isFinite)||budget<0||cost<=0||margin<0||margin>100||lift<0||lift>100)throw Error('Enter valid assumptions. Cost must be positive; margin and lift must be between 0 and 100.');
  const contacts=Math.min(group.customers,Math.floor(budget/cost));
  const spend=contacts*cost;
  const incrementalPurchases=contacts*lift/100;
  const revenuePerReturn=group.predicted_revenue/Math.max(group.customers*group.average_probability,1);
  const incrementalRevenue=incrementalPurchases*revenuePerReturn;
  const incrementalContribution=incrementalRevenue*margin/100-spend;
  return{contacts,spend,incrementalPurchases,revenuePerReturn,incrementalRevenue,incrementalContribution,unspent:budget-spend};
}
if(typeof module!=='undefined')module.exports={calculateRetention};
if(typeof document!=='undefined'){
  const data=globalThis.CLV_RESULTS;
  const money=n=>n.toLocaleString('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0});
  const number=n=>n.toLocaleString('en-GB',{maximumFractionDigits:0});
  const pct=n=>(n*100).toFixed(1)+'%';
  const models=[...data.validation_models].sort((a,b)=>a.brier-b.brier);
  document.getElementById('model-rows').innerHTML=models.map((m,i)=>`<tr class="${i===0?'winner':''}"><td>${m.model}${i===0?' <span>selected</span>':''}</td><td>${m.brier.toFixed(3)}</td><td>${m.average_precision.toFixed(3)}</td><td>${m.roc_auc.toFixed(3)}</td></tr>`).join('');
  document.getElementById('portfolio-rows').innerHTML=[...data.portfolio].sort((a,b)=>b.average_priority-a.average_priority).map(g=>`<tr><td>${g.priority_group}</td><td>${number(g.customers)}</td><td>${pct(g.observed_repeat_rate)}</td><td>${pct(g.average_probability)}</td><td>${money(g.predicted_revenue)}</td></tr>`).join('');
  const select=document.getElementById('group');
  select.innerHTML=data.portfolio.map((g,i)=>`<option value="${i}">${g.priority_group}</option>`).join('');
  const form=document.getElementById('planner');
  function render(){
    try{
      if(!form.checkValidity())throw Error('Check the input ranges.');
      const group=data.portfolio[Number(select.value)];
      const inputs=Object.fromEntries(['budget','cost','margin','lift'].map(k=>[k,Number(document.getElementById(k).value)]));
      const r=calculateRetention(group,inputs);
      const verdict=r.incrementalContribution>0?'Positive scenario':'Negative scenario';
      document.getElementById('scenario').innerHTML=`<h3>${verdict}</h3><p>This is a what-if estimate, not a measured campaign effect.</p><div class="scenario-grid"><div><strong>${number(r.contacts)}</strong><span>customers contacted</span></div><div><strong>${money(r.spend)}</strong><span>campaign spend</span></div><div><strong>${r.incrementalPurchases.toFixed(1)}</strong><span>assumed extra purchasers</span></div><div><strong>${money(r.incrementalContribution)}</strong><span>incremental contribution</span></div></div><p>Each returning customer is estimated at ${money(r.revenuePerReturn)} of 180-day revenue for this group. Product costs are unavailable; contribution uses your ${inputs.margin}% margin assumption.</p>`;
    }catch(e){document.getElementById('scenario').textContent=e.message;}
  }
  form.addEventListener('input',render);form.addEventListener('submit',e=>{e.preventDefault();render();});render();
}
