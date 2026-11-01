/* Native diagrams and tables, authored from lecture data. No slide images. */
const LectureVisuals=(()=>{
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const tick=n=>n>=10000?`${Number((n/1000).toFixed(1))}k`:Number(n.toFixed(2));
 const colors=['#68419a','#198069','#b45f29'];
 const text=(x,y,t,anchor='start')=>`<text x="${x}" y="${y}" text-anchor="${anchor}">${esc(t)}</text>`;
 const line=(x1,y1,x2,y2,color='#b9c4cf',dash='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
 const svg=(body,label,h=380)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 ${h}" role="img" aria-label="${esc(label)}"><style>text{font:17px system-ui,sans-serif;fill:#344354;stroke:none}</style>${body}</svg>`;
 function plot({label,xmax,ymax,xlabel,ylabel,curves=[],polygon=[],points=[]}){
  const X=x=>70+x/xmax*530,Y=y=>300-y/ymax*245;
  let s=text(70,25,ylabel);
  for(let i=0;i<=5;i++){const x=i*xmax/5,y=i*ymax/5;s+=line(X(x),55,X(x),300,'#edf0f4')+line(70,Y(y),600,Y(y),'#edf0f4')+text(X(x),326,tick(x),'middle')+text(58,Y(y)+6,tick(y),'end');}
  if(polygon.length)s+=`<polygon points="${polygon.map(([x,y])=>`${X(x)},${Y(y)}`).join(' ')}" fill="#dcefe8" stroke="#198069" stroke-width="1.5"/>`;
  for(const [i,c] of curves.entries()){
   let d='',active=false;for(let k=0;k<=400;k++){const x=k*xmax/400,y=c.fn(x);if(Number.isFinite(y)&&y>=0&&y<=ymax){d+=`${active?'L':'M'}${X(x).toFixed(2)},${Y(y).toFixed(2)} `;active=true;}else active=false;}
   s+=`<path d="${d}" fill="none" stroke="${c.color||colors[i%3]}" stroke-width="3" ${c.dash?`stroke-dasharray="${c.dash}"`:''}/>`;
  }
  s+=line(70,300,600,300,'#758196')+line(70,55,70,300,'#758196');
  for(const p of points){s+=`<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="5" fill="#ad4036"/>`;if(p.label)s+=text(X(p.x)+(p.dx||10),Y(p.y)+(p.dy||-12),p.label,p.anchor||'start');}
  s+=text(335,365,xlabel,'middle');
  return svg(s,label)+`<div class="plot-legend">${curves.map((c,i)=>`<span><i style="border-color:${c.color||colors[i%3]};border-top-style:${c.dash?'dashed':'solid'}"></i>${esc(c.name)}</span>`).join('')}${polygon.length?'<span><i style="border-color:#198069"></i>Shaded feasible region</span>':''}</div>`;
 }
 const figure=(title,drawing,caption='')=>`<figure class="native-figure"><div class="native-drawing" tabindex="0" aria-label="${esc(title)}">${drawing}</div><figcaption><strong>${esc(title)}</strong>${caption?' — '+esc(caption):''}<span class="figure-basis">Recreated for these notes.</span></figcaption></figure>`;
 function table(title,heads,rows){return `<div class="lecture-table-wrap" tabindex="0" role="region" aria-label="${esc(title)}"><table><caption>${esc(title)}</caption><thead><tr>${heads.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((v,i)=>i?`<td>${esc(v)}</td>`:`<th scope="row">${esc(v)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
 const potteryPlot=(labor=40,c1=40,c2=50)=>{const m=DecisionMath.pottery(labor,120,c1,c2);return plot({label:`Pottery feasible region. Best profit ${m.value.toFixed(2)} at ${m.x.toFixed(2)} bowls and ${m.y.toFixed(2)} mugs.`,xmax:50,ymax:50,xlabel:'Bowls per day · x₁',ylabel:'Mugs per day · x₂',polygon:[[0,0],...m.vertices.filter(p=>p[0]||p[1]).sort((a,b)=>Math.atan2(b[1],b[0])-Math.atan2(a[1],a[0]))],curves:[{name:'Labor: x₁ + 2x₂ = '+labor,fn:x=>(labor-x)/2},{name:'Clay: 4x₁ + 3x₂ = 120',fn:x=>(120-4*x)/3},{name:'Best objective line',fn:x=>(m.value-c1*x)/c2,dash:'7 5'}],points:m.best.map(([x,y])=>({x,y,label:`(${+x.toFixed(1)}, ${+y.toFixed(1)})`}))});};
 const arrows=id=>`<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#198069"/></marker></defs>`;
 const arrow=(id,x1,y1,x2,y2,both=false)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#198069" stroke-width="2" marker-end="url(#${id})" ${both?`marker-start="url(#${id})"`:''}/>`;
 const box=(x,y,w,h,labels)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#f7f4fb" stroke="#bca8d0"/>${labels.map((label,i)=>text(x+w/2,y+h/2+(i-(labels.length-1)/2)*23+6,label,'middle')).join('')}`;
 function modelingCycle(){
  const id='model-feedback-arrow',labels=['Observation','Problem definition','Model construction','Solution','Implementation'];
  let body=arrows(id);
  labels.forEach((label,i)=>{body+=box(230,20+i*90,230,50,[label]);if(i<4)body+=arrow(id,345,70+i*90,345,110+i*90);});
  body+=arrow(id,230,405,135,405)+`<path d="M135 405 V135" fill="none" stroke="#198069" stroke-width="2"/>`;
  for(const y of [135,225,315])body+=arrow(id,135,y,230,y);
  body+=text(35,275,'Feedback');
  return svg(body,'Five stages: observation, problem definition, model construction, solution, implementation. Implementation feeds back to definition, construction and solution.',455);
 }
 function supportSystem(){
  const id='decision-support-arrow';
  const body=arrows(id)+arrow(id,320,65,320,120,true)+arrow(id,190,167,230,167,true)+arrow(id,410,167,450,167,true)+arrow(id,320,215,320,275,true)
   +box(200,15,240,50,['Decision maker'])+box(230,120,180,95,['User interface'])+box(15,132,175,70,['Databases'])+box(450,132,175,70,['Management','science models'])+box(200,275,240,50,['Internet/e-business']);
  return svg(body,'The user interface exchanges information in both directions with the decision maker, databases, management science models, and Internet/e-business.',350);
 }
 const pricingStrategies=[
  {name:'1 · Keep full fare',short:'1 · Full fare',fares:[60,0,60],counts:[30,0,0],fareWords:'$60 common fare',revenue:1800},
  {name:'2 · Fill every seat',short:'2 · Fill the plane',fares:[24,0,24],counts:[66,0,64],fareWords:'$24 common fare',revenue:3120},
  {name:'3 · Best common fare',short:'3 · Best common fare',fares:[25,0,25],counts:[65,0,60],fareWords:'$25 common fare',revenue:3125},
  {name:'4 · Separate customer types',short:'4 · Two fares',fares:[45,0,20],counts:[45,0,80],fareWords:'Business $45; leisure $20',revenue:3625},
  {name:'5 · App; leisure fixed',short:'5 · App; leisure fixed',fares:[60,40,20],counts:[30,20,80],fareWords:'Full-fare business $60; app $40; leisure $20',revenue:4200},
  {name:'6 · Choose app + leisure fares',short:'6 · Choose both fares',fares:[60,32,22],counts:[30,28,72],fareWords:'Full-fare business $60; app $32; leisure $22',revenue:4280}
 ];
 function pricingComparison(){
  const money=n=>'$'+n.toLocaleString('en-US');
  const rows=pricingStrategies.map(p=>{const [business,app,leisure]=p.counts,total=p.counts.reduce((a,b)=>a+b,0);return [p.name,p.fareWords,`${business} business; ${app} app; ${leisure} leisure`,`${total} of 130`,130-total,money(p.revenue)];});
  let b=text(260,28,'Ticket revenue per departure ($)');
  for(let i=0;i<=4;i++){const value=i*1000,x=260+value/4500*310;b+=line(x,50,x,445,'#edf0f4')+text(x,472,value.toLocaleString('en-US'),'middle');}
  b+=line(260,50,260,445,'#758196');
  pricingStrategies.forEach((p,i)=>{const y=65+i*62,w=p.revenue/4500*310;b+=text(15,y+23,p.short)+`<rect x="260" y="${y}" width="${w}" height="32" rx="3" fill="${i===5?'#198069':'#68419a'}"/>`+text(268+w,y+23,money(p.revenue));});
  const chart=figure('Compare revenue across all six strategies',svg(b,'Revenue per departure: full fare $1,800; fill the plane $3,120; best common fare $3,125; two fares $3,625; app with fixed leisure fare $4,200; choose app and leisure fares $4,280. Bars start at zero.',500),'Keep the 130-seat capacity and the stated demand assumptions fixed. The table gives the exact fares, passenger mix and empty seats.');
  return `<section class="pricing-comparison" aria-label="Six airline pricing strategies">${table('Six ways to price a 130-seat flight',['Strategy','Fare per ticket','Passengers by ticket type','Tickets sold','Empty seats','Revenue per departure'],rows)}${chart}</section>`;
 }
 function shadowSteps(label,xlabel,xmax,ymax,segments){
  const X=x=>70+x/xmax*530,Y=y=>300-y/ymax*245;
  let b=text(70,25,'Marginal contribution per extra unit');
  for(let i=0;i<=5;i++){const x=i*xmax/5,y=i*ymax/5;b+=line(X(x),55,X(x),300,'#edf0f4')+line(70,Y(y),600,Y(y),'#edf0f4')+text(X(x),326,tick(x),'middle')+text(58,Y(y)+6,tick(y),'end');}
  b+=line(70,300,600,300,'#758196')+line(70,55,70,300,'#758196');
  for(const [a,z,value] of segments){b+=line(X(a),Y(value),X(z),Y(value),'#68419a');for(const x of [a,z])if(x>0&&x<xmax)b+=`<circle cx="${X(x)}" cy="${Y(value)}" r="4" fill="white" stroke="#68419a" stroke-width="2"/>`;}
  b+=text(335,365,xlabel,'middle');
  return svg(b,label)+`<p>Open circles mark regime boundaries: use left and right slopes at a jump. The final zero-value interval continues beyond the plot.</p>`;
 }
 const content={
  'a6-concrete':()=>figure('Concrete plant: current quota of 5',plot({label:'Concrete plant feasible polygon at quota 5. Optimum A=11, B=5, contribution 285.',xmax:18,ymax:10,xlabel:'Basic blocks A',ylabel:'Decorative blocks B',polygon:[[0,0],[15,0],[15,2],[13,4],[11,5],[0,5]],curves:[{name:'Shared molding',fn:x=>17-x},{name:'Heat treatment',fn:x=>(21-x)/2},{name:'Surface finishing',fn:x=>(27-x)/3},{name:'Quality inspection',fn:x=>(35-x)/4},{name:'Distributor quota',fn:()=>5,dash:'7 5'}],points:[{x:11,y:5,label:'(11, 5)',dy:-20}]}),'The dedicated A-mold bound x ≤ 15 is the polygon’s right edge.')
   +figure('Concrete quota: full shadow-price graph',shadowSteps('Quota marginal values 35, 25, 15, 5 and 0, changing at quotas 2, 4, 6 and 8.','Distributor quota b₆',12,40,[[0,2,35],[2,4,25],[4,6,15],[6,8,5],[8,12,0]]),'Derived from the five binding-resource regimes; the adjacent table provides exact intervals and values.'),
  'a6-agency':()=>figure('Agency: current approval limit of 11',plot({label:'Agency feasible polygon at 11 approvals. Optimum standard=9.5, premium=1.5, contribution 86.',xmax:16,ymax:6,xlabel:'Standard campaigns A',ylabel:'Premium campaigns B',polygon:[[0,0],[11,0],[9.5,1.5],[8,2],[0,4]],curves:[{name:'Preparatory design',fn:x=>(16-x)/4},{name:'Content editing',fn:x=>(14-x)/3},{name:'Final publishing',fn:x=>(13-x)/2},{name:'Approvals',fn:x=>11-x,dash:'7 5'}],points:[{x:9.5,y:1.5,label:'(9.5, 1.5)',dx:10,dy:-25}]}))
   +figure('Approvals: full shadow-price graph',shadowSteps('Approval marginal values 13, 5, 4, 1 and 0, changing at 4, 10, 12 and 13 approvals.','Approval slots b₄',16,15,[[0,4,13],[4,10,5],[10,12,4],[12,13,1],[13,16,0]]),'A slot has no marginal value once approvals reach 13. Exact breakpoint behavior is explained in the text.'),

  'a2-graphical':()=>figure('Problem 1: bounded maximum',plot({label:'Feasible polygon with unique optimum at (8, 5.2), objective 81.6.',xmax:12,ymax:12,xlabel:'x₁',ylabel:'x₂',polygon:[[0,0],[8,0],[8,5.2],[0,10]],curves:[{name:'3x₁ + 5x₂ = 50',fn:x=>10-.6*x},{name:'2x₁ + 4x₂ = 40',fn:x=>10-.5*x}],points:[{x:8,y:5.2,label:'(8, 5.2)',dy:-15}]}),'The right boundary is x₁ = 8.')
   +figure('Problem 2: unbounded region, finite minimum',plot({label:'Region extends upward and to the right. Minimum at (0,5.5), objective 11; maximization is unbounded.',xmax:12,ymax:12,xlabel:'x₁',ylabel:'x₂',polygon:[[0,5.5],[4,3.5],[38/7,27/7],[9.5,12],[0,12]],curves:[{name:'2x₁ + 4x₂ = 22',fn:x=>5.5-.5*x},{name:'−x₁ + 4x₂ = 10',fn:x=>2.5+.25*x},{name:'4x₁ − 2x₂ = 14',fn:x=>2*x-7},{name:'x₁ − 3x₂ = 1',fn:x=>(x-1)/3,dash:'7 5'}],points:[{x:0,y:5.5,label:'Minimum (0, 5.5)',dx:15,dy:-18}]}),'The shading is clipped by the plotting window; the feasible region continues above it.')
   +figure('Problem 4: change the objective sense',plot({label:'Feasible triangle with maximum at (5,5), 8500 dollars, and minimum at (6,3), 7500 dollars.',xmax:9,ymax:9,xlabel:'x₁',ylabel:'x₂',polygon:[[3,6],[5,5],[6,3]],curves:[{name:'2x₁ + 4x₂ = 30',fn:x=>7.5-.5*x},{name:'4x₁ + 2x₂ = 30',fn:x=>15-2*x},{name:'x₁ + x₂ = 9',fn:x=>9-x}],points:[{x:5,y:5,label:'Maximum (5, 5)',dy:-15},{x:6,y:3,label:'Minimum (6, 3)',dx:-10,dy:28,anchor:'end'}]})),
  'a2-claims':()=>figure('Claims staffing: the corrected feasible polygon',plot({label:'Claims processing polygon. Least cost at (20.121951,10.670732). Workstation/error corner is (34.444444,5.555556).',xmax:50,ymax:40,xlabel:'Permanent operators · x₁',ylabel:'Temporary operators · x₂',polygon:[[28.125,0],[40,0],[310/9,50/9],[825/41,875/82]],curves:[{name:'Claims: 16x₁ + 12x₂ = 450',fn:x=>37.5-4*x/3},{name:'Workstations: x₁ + x₂ = 40',fn:x=>40-x},{name:'Errors: 0.5x₁ + 1.4x₂ = 25',fn:x=>(25-.5*x)/1.4}],points:[{x:825/41,y:875/82,label:'Optimum (20.12, 10.67)',dy:-95}]}),'Staffing is continuous in the LP; an integer staffing requirement changes the model.'),
  'a3-mills':()=>figure('Aluminum mills: minimum cost at (4,0)',plot({label:'Feasible region above grade requirements; minimum at (4,0), cost 24000 dollars.',xmax:8,ymax:8,xlabel:'Mill 1 operating days · x₁',ylabel:'Mill 2 operating days · x₂',polygon:[[0,6],[1,3],[4,0],[8,0],[8,8],[0,8]],curves:[{name:'High grade: 6x₁ + 2x₂ = 12',fn:x=>6-3*x},{name:'Medium grade: 2x₁ + 2x₂ = 8',fn:x=>4-x},{name:'Low grade: 4x₁ + 10x₂ = 5',fn:x=>.5-.4*x,dash:'7 5'}],points:[{x:4,y:0,label:'(4, 0)',dy:-15}]}),'The region continues beyond the plotting window. The low-grade requirement is redundant.'),
  'a3-bradley':()=>figure('Bradley farm: land and budget bind',plot({label:'Farm feasible region. Optimum 320 corn acres and 90 tobacco acres, profit 142800 dollars.',xmax:550,ymax:260,xlabel:'Corn acres · x₁',ylabel:'Tobacco acres · x₂',polygon:[[0,0],[410,0],[320,90],[300,100],[0,100]],curves:[{name:'Land: x₁ + x₂ = 410',fn:x=>410-x},{name:'Budget: x₁ + 2x₂ = 500',fn:x=>250-.5*x},{name:'Tobacco quota: x₂ = 100',fn:()=>100}],points:[{x:320,y:90,label:'(320, 90)',dy:-16}]})),
  'a3-apex':()=>figure('Apex: two binding resources',plot({label:'Feasible polygon has optimum at (40,20), profit 2800 dollars.',xmax:70,ymax:70,xlabel:'Component A · x₁',ylabel:'Component B · x₂',polygon:[[0,0],[50,0],[40,20],[0,40]],curves:[{name:'Machining: 2x₁ + x₂ = 100',fn:x=>100-2*x},{name:'Finishing: x₁ + 2x₂ = 80',fn:x=>40-.5*x}],points:[{x:40,y:20,label:'(40, 20)',dy:-15}]})),
  'modeling':()=>figure('The five stages of the management science approach',modelingCycle(),'Following Chapter 1 pages 8–9: implementation feeds back to problem definition, model construction and solution.'),
  'airline-demand':()=>figure('The combined demand curve',plot({label:'Total expected demand has a kink at price 40 and demand 50. Capacity is 130 seats.',xmax:100,ymax:250,xlabel:'Common fare · dollars',ylabel:'Expected passengers',curves:[{name:'Combined demand',fn:p=>DecisionMath.demand(p)},{name:'Seat capacity',fn:()=>130,dash:'7 5'}],points:[{x:40,y:50,label:'Kink (40, 50)',dy:-20,dx:20}]})),
  'segmentation':()=>figure('Two sources of demand',plot({label:'Business demand is 90 minus price; leisure demand is 160 minus four times price, clipped at zero.',xmax:100,ymax:200,xlabel:'Fare · dollars',ylabel:'Expected passengers',curves:[{name:'Business travelers',fn:p=>Math.max(0,90-p)},{name:'Leisure travelers',fn:p=>Math.max(0,160-4*p),dash:'7 5'}]})),
  'app-fare':()=>pricingComparison(),
  'pricing-strategies':()=>pricingComparison(),
  'decision-support':()=>figure('A decision support system',supportSystem(),'Following Chapter 1 page 43: information flows in both directions through the user interface.'),
  'gantt':()=>figure('Render the visible part first',svg(`<rect x="45" y="40" width="550" height="230" fill="#f4f6fa" stroke="#b9c4cf"/>${[0,1,2,3,4].map((n)=>`<rect x="${65+n%2*35}" y="${60+n*40}" width="${440-n*25}" height="22" fill="#d4e5df"/>`).join('')}<rect x="170" y="75" width="280" height="160" fill="none" stroke="#68419a" stroke-width="2" stroke-dasharray="7 5"/><rect x="220" y="110" width="170" height="80" fill="#fff" fill-opacity=".8" stroke="#198069" stroke-width="3"/>${text(305,155,'Visible view','middle')}${text(320,305,'Dashed boundary: extended view cached nearby','middle')}`, 'Gantt chart with a smaller visible view inside a larger cached extended view.',340),'Blocks outside the current view need not all be drawn before the interface responds.'),
  'pottery':()=>table('Pottery inputs',['Product','Labor hr/unit','Clay lb/unit','Profit $/unit'],[['Bowl',1,4,40],['Mug',2,3,50],['Available',40,120,'—']]),
  'fertilizer':()=>figure('A minimum-cost boundary',plot({label:'Fertilizer feasible region above both minimum nutrient constraints. Optimum zero Super-gro and eight Crop-quick bags.',xmax:10,ymax:10,xlabel:'Super-gro bags · x₁',ylabel:'Crop-quick bags · x₂',polygon:[[0,8],[4.8,1.6],[8,0],[10,0],[10,10],[0,10]],curves:[{name:'Nitrogen requirement',fn:x=>4-x/2},{name:'Phosphate requirement',fn:x=>8-4*x/3},{name:'Minimum cost = 24',fn:x=>8-2*x,dash:'7 5'}],points:[{x:0,y:8,label:'(0, 8)'},{x:4.8,y:1.6,label:'(4.8, 1.6)',dy:-15}]})),
  'irregular':()=>figure('An entire edge can be optimal',potteryPlot(40,40,30),'With profit 40x₁ + 30x₂, every point between (24,8) and (30,0) earns 1,200.'),
  'hot-dogs':()=>figure('The mixture is a line segment',plot({label:'Chicken plus beef equals 1000 pounds; feasible beef 200 to 333.33 and chicken 800 to 666.67.',xmax:1000,ymax:500,xlabel:'Chicken · pounds',ylabel:'Beef · pounds',curves:[{name:'Fixed total: c + b = 1000',fn:c=>c>=200?1000-c:NaN},{name:'Feasible mixture',fn:c=>c>=2000/3&&c<=800?1000-c:NaN}],points:[{x:800,y:200,label:'Optimum (800, 200)',dx:-10,dy:30,anchor:'end'}]})),
  'furniture':()=>figure('Furniture feasible region',plot({label:'Furniture feasible vertices (0,0), (4,0), (4,3), (2,6), (0,6); optimum (2,6).',xmax:6,ymax:10,xlabel:'Doors · x₁',ylabel:'Windows · x₂',polygon:[[0,0],[4,0],[4,3],[2,6],[0,6]],curves:[{name:'Workshop 2: x₂ = 6',fn:()=>6},{name:'Workshop 3: 3x₁ + 2x₂ = 18',fn:x=>9-1.5*x}],points:[{x:2,y:6,label:'(2, 6)'}]}),'The vertical boundary at x₁ = 4 comes from workshop 1.'),
  'clay-shadow':()=>figure('Clay value is piecewise linear',plot({label:'Profit slopes 50/3 until 60 pounds, 6 until 160 pounds, then zero.',xmax:200,ymax:2000,xlabel:'Available clay · pounds',ylabel:'Best profit · dollars',curves:[{name:'Optimal profit',fn:c=>DecisionMath.pottery(40,c).value}],points:[{x:60,y:1000,label:'60 lb'},{x:160,y:1600,label:'160 lb'}]})),
  'nutrient-shadow':()=>figure('More nitrogen is initially free',plot({label:'Minimum fertilizer cost remains 24 until the nitrogen requirement exceeds 32 pounds, then rises by 0.75 per pound.',xmax:60,ymax:60,xlabel:'Required nitrogen · pounds (phosphate fixed at 24)',ylabel:'Minimum cost · dollars',curves:[{name:'Cost = max(24, 0.75 N)',fn:n=>Math.max(24,.75*n)}],points:[{x:32,y:24,label:'Threshold: 32',dy:28,dx:15}]})),
  'reports':()=>table('Pottery sensitivity report',['Item','Value','Coefficient or RHS','Allowable decrease','Allowable increase'],[['Bowls',24,40,15,'26⅔'],['Mugs',8,50,20,30],['Labor usage',40,40,10,40],['Clay usage',120,120,60,40]]),
  'copt':()=>`<figure class="code-example"><figcaption>Corrected pottery model · example1.lp</figcaption><pre><code>Maximize
 profit: 40 x1 + 50 x2
Subject To
 labor: x1 + 2 x2 &lt;= 40
 clay: 4 x1 + 3 x2 &lt;= 120
Bounds
 x1 &gt;= 0
 x2 &gt;= 0
End</code></pre><a class="text-link" href="assets/examples/pottery.lp" download>Download the LP file →</a></figure>`,
  'shirts':()=>table('Per-dozen production data',['Product','Hours','Cost ($)','Profit ($)'],[['Sweatshirt, front',.10,36,90],['Sweatshirt, both sides',.25,48,125],['T-shirt, front',.08,25,45],['T-shirt, both sides',.21,35,65]]),
  'diet':()=>table('Nutrients per stated serving',['Food / unit','Cal','Fat g','Chol. mg','Iron mg','Calcium mg','Protein g','Fiber g','Cost $'],[['Bran cereal / cup',90,0,0,6,20,3,5,.18],['Dry cereal / cup',110,2,0,4,48,4,2,.22],['Oatmeal / cup',100,2,0,2,12,5,3,.10],['Oat bran / cup',90,2,0,3,8,6,4,.12],['Egg',75,5,270,1,30,7,0,.10],['Bacon / slice',35,3,8,0,0,2,0,.09],['Orange',65,0,0,1,52,1,1,.40],['Milk 2% / cup',100,4,12,0,250,9,0,.16],['Orange juice / cup',120,0,0,0,3,1,0,.50],['Wheat toast / slice',65,1,0,1,26,3,3,.07]]),
  'transport':()=>table('Shipping cost per TV ($)',['Warehouse','New York','Dallas','Detroit','Supply'],[['Cincinnati',16,18,11,300],['Atlanta',14,12,13,200],['Pittsburgh',13,15,17,200],['Demand',150,250,200,600]]),
  'production':()=>table('Derived six-week schedule (zero initial/terminal inventory)',['Week','Demand','Regular','Overtime','Ending inventory'],[[1,105,160,0,55],[2,170,160,0,45],[3,230,160,25,0],[4,180,160,20,0],[5,150,160,30,40],[6,250,160,50,0]]),
  'cash-flow':()=>figure('Cash flow under the stated timing convention',svg(`${line(60,220,580,220,'#198069')}${[0,1,2,3,4,5].map(i=>`<circle cx="${60+i*104}" cy="220" r="6" fill="#198069"/>${text(60+i*104,255,i<5?'Year '+(i+1):'End 5','middle')}`).join('')}<path d="M60 210 Q164 75 268 210" fill="none" stroke="#68419a" stroke-width="2"/>${text(164,125,'A₁ × 1.15','middle')}<path d="M164 205 Q320 -20 476 205" fill="none" stroke="#b45f29" stroke-width="2"/>${text(320,75,'C × 1.40','middle')}<path d="M268 210 Q424 50 580 210" fill="none" stroke="#68419a" stroke-width="2" stroke-dasharray="7 5"/>${text(510,90,'B × 1.25','middle')}${text(320,310,'D carries money one year forward at × 1.06','middle')}`, 'Reader timing convention: A1 matures at the start of year 3; C at the start of year 5; B at the end of year 5; D spans one year.',350),'Reader timing convention: D matures after one year and proceeds can be reinvested at year boundaries. An investment uses only cash already available.'),
  'dea':()=>table('School inputs and outputs',['School','Teacher/student','Funds/student','Parent education','Reading','Math','History'],[['Alton',.06,260,11.3,86,75,71],['Beeks',.05,320,10.5,82,72,67],['Carey',.08,340,12,81,79,80],['Delancey',.06,460,13.1,81,73,69]])
 };
 return {html:id=>content[id]?.()||'',plot,figure,table,potteryPlot,pricingStrategies};
})();
