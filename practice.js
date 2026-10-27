/* Homework practice. Attempts and reveals belong to this browser tab only. */
(()=>{
 const root=document.getElementById('practice-root'),esc=MathView.escape;
 const exercises=CoursePractice.exercises,groups=CoursePracticeIndex.groups;
 const storageKey='dm-practice-session-v1';
 let saved={};
 try{const value=JSON.parse(sessionStorage.getItem(storageKey)||'{}');if(value&&typeof value==='object'&&!Array.isArray(value))saved=value;}catch{}
 const prose=body=>(body||'').split('\n').filter(s=>s.trim()).map(s=>s.startsWith('$$')?`<div class="lecture-equation">${MathView.html(s.slice(2,-2),true)}</div>`:`<p>${esc(s)}</p>`).join('');
 const kind=e=>e.kind==='homework'?'Homework question':e.kind==='lecture'?'Practice from a lecture example':'Additional practice';
 const route=(group,id)=>'#'+group+(id?'/'+id:'');
 const relevant=(group)=>group==='all'?exercises:exercises.filter(e=>e.lectureIds.includes(group));
 function tables(items=[]){return items.map(t=>`<div class="lecture-table-wrap" role="region" tabindex="0" aria-label="${esc(t.caption)}"><table><caption>${esc(t.caption)}</caption><thead><tr>${t.headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${t.rows.map(row=>`<tr>${row.map((cell,i)=>i?`<td>${esc(String(cell))}</td>`:`<th scope="row">${esc(String(cell))}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`).join('');}
 function code(items=[]){return items.map(c=>`<figure class="code-example"><figcaption>${esc(c.title)}</figcaption><pre tabindex="0"><code>${esc(c.body)}</code></pre></figure>`).join('');}
 function solutionVisual(solution){
  if(!solution.visual)return '';
  if(solution.visual.model==='pottery')return LectureVisuals.figure('Corrected pottery feasible region',LectureVisuals.potteryPlot(),'Reconstructed from the corrected lecture model.');
  const temp=document.createElement('div');temp.innerHTML=LectureVisuals.html(solution.visual.topicId);
  const figures=temp.querySelectorAll('figure');return figures[solution.visual.figure||0]?.outerHTML||'';
 }
 function record(e){
  const raw=saved[e.id]&&typeof saved[e.id]==='object'&&!Array.isArray(saved[e.id])?saved[e.id]:{};
  const value={work:typeof raw.work==='string'?raw.work.slice(0,20000):'',hints:Number.isInteger(raw.hints)?Math.max(0,Math.min(e.hints.length,raw.hints)):0,showSolution:raw.showSolution===true,compare:e.compare.map((_,i)=>raw.compare?.[i]===true)};
  saved[e.id]=value;return value;
 }
 function save(){try{sessionStorage.setItem(storageKey,JSON.stringify(saved));return true;}catch{return false;}}
 function heading(title,description){return `<header class="reader-heading"><p class="eyebrow">Introduction to Decision Making</p><h1>${esc(title)}</h1><p>${esc(description)}</p></header>`;}
 function catalog(group){
  const section=groups.find(g=>g.id===group),items=section?relevant(group):exercises;
  root.innerHTML=heading(section?section.title+' · practice':'Practice each lecture','Try the homework, use a hint when needed, then compare your reasoning with a worked solution.')
   +`<p class="practice-note">Homework questions are restated from the course files. Hints and additional exercises are written for this companion; official answer keys are identified.</p><nav class="practice-tabs" aria-label="Practice sections"><a href="#all" ${!section?'aria-current="page"':''}>All practice</a>${groups.map(g=>`<a href="#${g.id}" ${section===g?'aria-current="page"':''}>${esc(g.label)}</a>`).join('')}</nav>`
   +(section?`<div class="practice-section-actions"><a class="button primary" href="${route(group,items[0]?.id)}">Start practice →</a><a class="text-link" href="lectures.html#${group}">Review this lecture →</a></div>`:'')
   +`<div class="practice-catalog">${(section?[section]:groups).map(g=>{const set=relevant(g.id);return `<section class="practice-group"><div class="practice-group-heading"><h2>${esc(g.subtitle)} · ${esc(g.title)}</h2><span>${set.length} exercises</span></div><ol>${set.map(e=>`<li><a class="practice-exercise-link" href="${route(g.id,e.id)}"><span>${esc(e.assignment)} · ${kind(e)}</span><strong>${esc(e.title)}</strong><small>${e.hints.length} hints · solution for comparison →</small></a></li>`).join('')}</ol></section>`;}).join('')}</div>`;
  document.title=(section?section.subtitle+' practice':'Practice')+' · THU Decision Making';
 }
 function exercise(group,e){
  const r=record(e),set=relevant(group),index=set.findIndex(x=>x.id===e.id);
  const review=e.topicIds.flatMap(id=>{const g=groups.find(g=>g.topics.some(t=>t.id===id));return g?[{title:g.topics.find(t=>t.id===id).title,href:`lectures.html#${g.id}/${id}`}]:[];});
  root.innerHTML=`<a class="back-link" href="${route(group)}">← Practice questions</a>`+heading(e.title,e.assignment)
   +`<p class="practice-note">${kind(e)} · Your working is saved in this browser tab. Nothing is submitted.</p><div class="practice-workspace"><section class="practice-question" aria-labelledby="question-title"><h2 id="question-title">The assignment</h2>${prose(e.prompt)}${tables(e.tables)}<ol class="practice-tasks">${e.tasks.map(t=>`<li>${esc(t)}</li>`).join('')}</ol><details class="practice-source"><summary>Question sources</summary><ul>${e.sources.map(s=>`<li>${esc(s)}</li>`).join('')}</ul></details><section class="practice-hints" aria-labelledby="hints-title"><h3 id="hints-title">Need a hint?</h3><div data-hints></div><button type="button" data-next-hint>Show first hint</button><p class="sr-only" role="status" data-hint-status></p>${review.length?`<details><summary>Review the lecture</summary><ul>${review.map(link=>`<li><a href="${esc(link.href)}">${esc(link.title)}</a></li>`).join('')}</ul></details>`:''}</section><div class="practice-attempt"><label for="practice-working">Your working</label><p id="working-help">Write variables, constraints, calculations, or questions to check. You can also work on paper.</p><textarea id="practice-working" maxlength="20000" rows="9" aria-describedby="working-help" spellcheck="false"></textarea><pre class="practice-print-work" aria-hidden="true"></pre><p role="status" data-storage-status></p></div><div class="practice-actions"><button type="button" class="primary" data-compare aria-controls="practice-solution" aria-expanded="false">Compare with the solution</button><button type="button" data-reset-practice>Clear this attempt</button></div><p role="status" data-practice-status></p></section><section id="practice-solution" class="practice-solution" tabindex="0" hidden aria-labelledby="solution-title"><p class="eyebrow">${esc(e.solution.label)}</p><h2 id="solution-title" tabindex="-1">Solution for comparison</h2>${prose(e.solution.body)}${(e.solution.sections||[]).map(s=>`<section class="lecture-worked"><h3>${esc(s.title)}</h3>${prose(s.body)}</section>`).join('')}${tables(e.solution.tables)}${solutionVisual(e.solution)}${code(e.solution.code)}${e.solution.downloads?.length?`<ul>${e.solution.downloads.map(d=>`<li><a href="${esc(d.href)}" download>${esc(d.title)}</a></li>`).join('')}</ul>`:''}<fieldset class="practice-checklist"><legend>Compare your approach</legend>${e.compare.map((item,i)=>`<label><input type="checkbox" data-compare-item="${i}"><span>${esc(item)}</span></label>`).join('')}</fieldset><p class="practice-self-check">This is a self-check, not an automatic grade. A different feasible optimal allocation can be correct.</p></section></div><nav class="practice-sequence" aria-label="Exercise navigation">${index>0?`<a class="button" href="${route(group,set[index-1].id)}">← Previous question</a>`:'<span></span>'}<a href="${route(group)}">All questions in this section</a>${index<set.length-1?`<a class="button" href="${route(group,set[index+1].id)}">Next question →</a>`:'<span></span>'}</nav>`;
  // Sources and solutions remain separate: only explicit hint/compare actions reveal help.
  const input=root.querySelector('textarea'),printWork=root.querySelector('.practice-print-work');input.value=r.work;printWork.textContent=r.work;
  function persist(){const ok=save();root.querySelector('[data-storage-status]').textContent=ok?'':'This browser could not save your working. Keep this page open or copy your notes.';}
  input.oninput=()=>{r.work=input.value;printWork.textContent=r.work;persist();};
  function hints(){
   root.querySelector('[data-hints]').innerHTML=e.hints.slice(0,r.hints).map((h,i)=>`<section class="practice-hint"><h4>Hint ${i+1}: ${esc(h.title)}</h4>${prose(h.body)}</section>`).join('');
   const button=root.querySelector('[data-next-hint]');button.disabled=r.hints===e.hints.length;button.textContent=r.hints===0?'Show first hint':r.hints===e.hints.length?'All hints shown':'Show next hint';
  }
  root.querySelector('[data-next-hint]').onclick=()=>{if(r.hints<e.hints.length){r.hints++;hints();persist();root.querySelector('[data-hint-status]').textContent=`Hint ${r.hints} of ${e.hints.length} shown.`;}};
  function comparison(focus=false){
   root.querySelector('#practice-solution').hidden=!r.showSolution;
   root.querySelector('.practice-workspace').classList.toggle('comparing',r.showSolution);
   const button=root.querySelector('[data-compare]');button.setAttribute('aria-expanded',String(r.showSolution));button.textContent=r.showSolution?'Hide the solution':'Compare with the solution';
   if(focus&&r.showSolution){const title=root.querySelector('#solution-title');title.focus({preventScroll:true});title.scrollIntoView({block:'nearest'});}
  }
  root.querySelector('[data-compare]').onclick=()=>{r.showSolution=!r.showSolution;comparison(true);persist();};
  root.querySelectorAll('[data-compare-item]').forEach((checkbox,i)=>{checkbox.checked=r.compare[i];checkbox.onchange=()=>{r.compare[i]=checkbox.checked;persist();};});
  root.querySelector('[data-reset-practice]').onclick=()=>{r.work='';r.hints=0;r.showSolution=false;r.compare=e.compare.map(()=>false);input.value='';printWork.textContent='';root.querySelectorAll('[data-compare-item]').forEach(c=>c.checked=false);hints();comparison();persist();root.querySelector('[data-practice-status]').textContent='This question has been reset.';};
  hints();comparison();document.title=e.title+' · Practice · THU Decision Making';
 }
 function render(){
  let [group,id]=location.hash.slice(1).split('/');
  if(!group||group==='assignments')group='all';
  if(group!=='all'&&!groups.some(g=>g.id===group)){catalog('all');return;}
  const found=id&&relevant(group).find(e=>e.id===id);
  if(id&&!found){root.innerHTML=heading('Practice question not found','Choose a question from the practice list.')+`<a class="button" href="${route(group)}">Browse questions →</a>`;return;}
  if(found)exercise(group,found);else catalog(group);
 }
 window.addEventListener('hashchange',()=>{render();const h=root.querySelector('h1');h.tabIndex=-1;h.focus({preventScroll:true});h.scrollIntoView({block:'start'});});render();
})();
