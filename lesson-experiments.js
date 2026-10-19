/* Small, user-controlled experiments. No animation or persistent progress. */
const LessonExperiments=(()=>{
 const definitions={
  'break-even':{title:'Move the break-even point',note:'Change price, unit cost or fixed cost. Demand is not modeled in this experiment.',controls:[['price','Price per pair ($)',10,40,1,23],['cost','Cost per pair ($)',0,20,1,8],['fixed','Fixed cost ($)',0,20000,500,10000]]},
  airline:{title:'Does filling the plane earn the most?',note:'One common fare, 130 seats, and the lecture’s fitted demand curve.',controls:[['price','Ticket price ($)',0,90,1,24]]},
  pottery:{title:'Move a feasible production plan',note:'Try the intersection, then move outside the shaded region. A large profit is irrelevant if the plan violates a resource limit.',controls:[['bowls','Bowls per day',0,40,1,24],['mugs','Mugs per day',0,40,1,8]]},
  profit:{title:'Rotate the objective',note:'Change bowl profit while keeping mug profit at $50. The feasible region stays fixed.',controls:[['profit','Profit per bowl ($)',0,100,1,40]]},
  labor:{title:'What is another labor hour worth?',note:'Clay stays fixed at 120 lb. Watch the marginal value change at 30 and 80 hours.',controls:[['labor','Available labor (hours)',0,100,1,40]]}
 };
 const fmt=n=>Number(n.toFixed(2)).toLocaleString('en-US');
 function view(type,p){
  if(type==='break-even'){
   const v=DecisionMath.breakEven(p.fixed,p.cost,p.price),desc=p.fixed===0&&p.price===p.cost?'Revenue equals cost at every volume; profit is zero.':v===null?(p.fixed===0?'Only zero sales break even; positive sales make a loss.':'No positive contribution: increasing sales cannot cover the fixed cost.'):`Break-even volume: ${fmt(v)} pairs. At least ${Math.ceil(v)} whole pairs cover the modeled cost.`;
   return {desc,graph:LectureVisuals.plot({label:desc,xmax:1600,ymax:65000,xlabel:'Pairs sold',ylabel:'Revenue and cost · dollars',curves:[{name:'Revenue',fn:x=>p.price*x},{name:'Total cost',fn:x=>p.fixed+p.cost*x,dash:'7 5'},{name:'Fixed cost',fn:()=>p.fixed,dash:'2 5'}]})};
  }
  if(type==='airline'){
   const m=DecisionMath.airline(p.price),desc=`Fare $${p.price}: expected demand ${fmt(m.demand)}, sales ${fmt(m.sales)} of 130 seats, revenue $${fmt(m.revenue)}. ${p.price===25?'This is the best common fare in the model.':p.price===24?'All seats sell. Try $25 and compare revenue.':'The best common fare is $25; compare it with the $24 full-plane fare.'}`;
   return {desc,graph:LectureVisuals.plot({label:desc,xmax:90,ymax:3500,xlabel:'Common fare · dollars',ylabel:'Revenue · dollars',curves:[{name:'Capacity-limited revenue',fn:x=>DecisionMath.airline(x).revenue}],points:[{x:p.price,y:m.revenue}]})};
  }
  if(type==='pottery'){
   const l=p.bowls+2*p.mugs,c=4*p.bowls+3*p.mugs,z=40*p.bowls+50*p.mugs,ok=l<=40&&c<=120;
   return {desc:`${ok?'Feasible':'Infeasible'}: labor ${l}/40 hours; clay ${c}/120 lb. ${ok?'Profit':'Nominal profit'} $${z}. ${p.bowls===24&&p.mugs===8?'Both constraints bind: this is optimal.':ok?'Compare with 24 bowls and 8 mugs.':'Reduce production to satisfy every constraint.'}`,graph:LectureVisuals.plot({label:`Chosen plan: ${p.bowls} bowls and ${p.mugs} mugs. ${ok?'Feasible':'Infeasible'}.`,xmax:50,ymax:50,xlabel:'Bowls · x₁',ylabel:'Mugs · x₂',polygon:[[0,0],[0,20],[24,8],[30,0]],curves:[{name:'Labor boundary',fn:x=>(40-x)/2},{name:'Clay boundary',fn:x=>(120-4*x)/3}],points:[{x:p.bowls,y:p.mugs}]})};
  }
  if(type==='profit'){const m=DecisionMath.pottery(40,120,p.profit,50);return {desc:`Best profit $${fmt(m.value)} at ${fmt(m.x)} bowls and ${fmt(m.y)} mugs.${m.best.length>1?' The entire edge between the tied vertices is optimal.':''} The original point (24,8) is optimal for bowl profit from $25 through $66⅔.`,graph:LectureVisuals.potteryPlot(40,p.profit,50)};}
  const m=DecisionMath.pottery(p.labor),marg=p.labor<30?'40':p.labor<80?'16':'0';return {desc:`Best plan: ${fmt(m.x)} bowls and ${fmt(m.y)} mugs. Profit $${fmt(m.value)}. The right-hand marginal value of another labor hour is $${marg}.`,graph:LectureVisuals.plot({label:'Optimal profit versus labor; current labor '+p.labor,xmax:100,ymax:2200,xlabel:'Available labor · hours',ylabel:'Best profit · dollars',curves:[{name:'Optimal profit',fn:l=>DecisionMath.pottery(l).value}],points:[{x:p.labor,y:m.value}]})};
 }
 function mount(root,type,stored={},save=()=>{}){
  const d=definitions[type];if(!d)throw Error('Unknown experiment '+type);
  const values=Object.fromEntries(d.controls.map(([key,,min,max,step,initial])=>[key,Number.isFinite(stored[key])?Math.min(max,Math.max(min,stored[key])):initial]));
  root.innerHTML=`<div class="inline-experiment"><p class="try-label">Explore the model</p><h3>${d.title}</h3><p class="experiment-note">${d.note}</p><div class="experiment-controls">${d.controls.map(([key,label,min,max,step])=>`<label>${label}<output data-output="${key}"></output><input type="range" min="${min}" max="${max}" step="${step}" value="${values[key]}" data-control="${key}" aria-label="${label}"></label>`).join('')}</div><div class="experiment-plot native-drawing" tabindex="0" aria-label="Interactive graph"></div><p class="experiment-result" role="status" aria-live="polite"></p><button type="button" data-reset>Reset experiment</button></div>`;
  function update(){for(const [k,v] of Object.entries(values))root.querySelector(`[data-output="${k}"]`).textContent=fmt(v);const m=view(type,values);root.querySelector('.experiment-plot').innerHTML=m.graph;root.querySelector('.experiment-result').textContent=m.desc;}
  root.querySelectorAll('[data-control]').forEach(input=>input.oninput=()=>{values[input.dataset.control]=Number(input.value);save({...values});update();});
  root.querySelector('[data-reset]').onclick=()=>{for(const [key,,,,,initial] of d.controls){values[key]=initial;root.querySelector(`[data-control="${key}"]`).value=initial;}save({...values});update();};update();return {pause(){},destroy(){root.replaceChildren();}};
 }
 return {mount,view};
})();
