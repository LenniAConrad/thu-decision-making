const assert=require('node:assert/strict'),fs=require('node:fs');
const {page,event}=require('./test-reader.cjs');
const data=require('./content/practice.json'),lectures=require('./content/lectures.json');
const lectureIds=lectures.filter(l=>l.id!=='assignments').map(l=>l.id);
const topicIds=new Set(lectures.flatMap(l=>l.topics.map(t=>t.id)));
const key='dm-practice-session-v1';

(async()=>{
 assert.equal(new Set(data.exercises.map(e=>e.id)).size,data.exercises.length);
 assert.doesNotMatch(JSON.stringify(data),/Lennart Conrad|2025080264|2024280169|\/home\/lennart/);
 for(const id of lectureIds)assert.ok(data.exercises.some(e=>e.lectureIds.includes(id)),id+' has practice');
 for(const n of [1,2,3,4,5])assert.ok(data.exercises.some(e=>e.assignment.startsWith('Homework '+n)),n+' covered');
 for(const e of data.exercises){
  assert.ok(e.id&&e.title&&e.prompt&&e.sources.length&&e.tasks.length&&e.compare.length,e.id);
  assert.ok(['homework','lecture','extra'].includes(e.kind));
  assert.ok(e.hints.length>=2&&e.hints.length<=3);
  for(const l of e.lectureIds)assert.ok(lectureIds.includes(l),e.id+' lecture '+l);
  for(const t of e.topicIds)assert.ok(topicIds.has(t),e.id+' topic '+t);
  for(const t of [...(e.tables||[]),...(e.solution.tables||[])]){
   assert.ok(t.caption&&t.headers.length&&t.rows.length);
   assert.ok(t.rows.every(r=>r.length===t.headers.length),e.id+' rectangular table');
  }
 }
 let p=await page('practice.html');
 assert.equal(p.d.querySelectorAll('.practice-group').length,lectureIds.length);
 assert.equal(p.d.querySelector('nav a[aria-current="page"]').textContent,'Practice');
 for(const id of lectureIds){
  await p.route('#'+id);assert.equal(p.d.querySelectorAll('.practice-exercise-link').length,data.exercises.filter(e=>e.lectureIds.includes(id)).length);
 }
 for(const e of data.exercises){
  await p.route('#'+e.lectureIds[0]+'/'+e.id);
  assert.equal(p.d.querySelector('h1').textContent,e.title);
  assert.equal(p.d.querySelector('#practice-solution').hidden,true,e.id+' solution is initially hidden');
  assert.equal(p.d.querySelectorAll('.practice-hint').length,0,e.id+' no hints initially');
  assert.equal(p.d.querySelector('textarea').value,'');
  assert.equal(p.d.querySelectorAll('.practice-question table').length,(e.tables||[]).length);
  for(let i=1;i<=e.hints.length;i++){
   p.d.querySelector('[data-next-hint]').click();
   assert.equal(p.d.querySelectorAll('.practice-hint').length,i);
   assert.equal(p.d.activeElement,p.d.querySelector('[data-hints] section:last-child h4'));
   assert.equal(p.d.querySelector('#practice-solution').hidden,true,'Hints do not reveal the solution');
  }
  assert.equal(p.d.querySelector('[data-next-hint]').disabled,true);
  p.d.querySelector('[data-compare]').click();
  assert.equal(p.d.querySelector('#practice-solution').hidden,false);
  assert.equal(p.d.querySelector('[data-compare]').getAttribute('aria-expanded'),'true');
  assert.equal(p.d.activeElement.id,'solution-title');
  assert.equal(p.d.querySelectorAll('[data-compare-item]').length,e.compare.length);
  assert.equal(p.d.querySelectorAll('.katex-error,.math-fallback').length,0,e.id+' math renders');
  for(const equation of p.d.querySelectorAll('.lecture-equation'))assert.equal(equation.tabIndex,0,'equation can be scrolled with the keyboard');
  for(const label of p.d.querySelectorAll('.plot-legend>span'))assert.notEqual(p.w.getComputedStyle(label).width,'28px','legend label keeps its natural width');
  if(e.solution.visual)assert.ok(p.d.querySelector('#practice-solution svg'),e.id+' comparison graph');
  for(const c of e.solution.code||[])assert.ok([...p.d.querySelectorAll('pre code')].some(el=>el.textContent===c.body));
  for(const a of p.d.querySelectorAll('a[href]')){
   const href=a.getAttribute('href');if(href.startsWith('http')||href.startsWith('#'))continue;
   assert.ok(fs.existsSync(href.split('#')[0]),href+' exists');
   if(href.startsWith('lectures.html#')){const [section,topic]=href.split('#')[1].split('/');assert.ok(lectures.some(l=>l.id===section&&(!topic||l.topics.some(t=>t.id===topic))),href+' valid');}
  }
 }
 const e=data.exercises[0],hash='#'+e.lectureIds[0]+'/'+e.id;
 await p.route(hash);p.d.querySelector('[data-reset-practice]').click();
 const notes='My variables: x1, x2\n<script>unsafe()</script>\nCheck all constraints.';
 const input=p.d.querySelector('textarea');input.value=notes;event(p.w,input);
 assert.equal(p.d.querySelector('.practice-print-work').textContent,notes);
 assert.equal(p.d.querySelectorAll('.practice-attempt script').length,0);
 p.d.querySelector('[data-next-hint]').click();p.d.querySelector('[data-compare]').click();
 const checked=p.d.querySelector('[data-compare-item]');checked.checked=true;event(p.w,checked,'change');
 const stored=JSON.parse(p.w.sessionStorage.getItem(key));
 assert.equal(p.w.localStorage.length,0);
 await p.route('#all');await p.route(hash);
 assert.equal(p.d.querySelector('textarea').value,notes);
 const source=p.d.querySelector('.practice-source'),beforePrint=p.w.sessionStorage.getItem(key);
 assert.equal(source.open,false);event(p.w,p.w,'beforeprint');event(p.w,p.w,'beforeprint');
 assert.equal(source.open,true);assert.equal(p.d.querySelector('#practice-solution').hidden,false);
 event(p.w,p.w,'afterprint');assert.equal(source.open,false);assert.equal(p.w.sessionStorage.getItem(key),beforePrint);
 source.open=true;event(p.w,p.w,'beforeprint');event(p.w,p.w,'afterprint');assert.equal(source.open,true);
 assert.equal(p.d.querySelectorAll('.practice-hint').length,1);
 assert.equal(p.d.querySelector('[data-compare-item]').checked,true);
 p.close();
 p=await page('practice.html',hash,{[key]:stored});
 assert.equal(p.d.querySelector('textarea').value,notes);
 assert.equal(p.d.querySelector('#practice-solution').hidden,false);
 p.d.querySelector('[data-reset-practice]').click();
 assert.equal(p.d.querySelector('textarea').value,'');assert.equal(p.d.querySelector('#practice-solution').hidden,true);assert.equal(p.d.querySelectorAll('.practice-hint').length,0);assert.equal(p.d.querySelector('[data-compare-item]').checked,false);
 // Storage failure must not destroy the visible attempt or stop the exercise.
 p.w.Storage.prototype.setItem=()=>{throw Error('Storage disabled');};
 p.d.querySelector('textarea').value='Keep these notes';event(p.w,p.d.querySelector('textarea'));
 assert.match(p.d.querySelector('[data-storage-status]').textContent,/could not save/);
 assert.equal(p.d.querySelector('textarea').value,'Keep these notes');
 await p.route('#all');await p.route(hash);assert.match(p.d.querySelector('[data-storage-status]').textContent,/could not save/);
 assert.equal(p.d.querySelector('textarea').value,'Keep these notes');
 event(p.w,p.w,'beforeprint');assert.equal(p.d.querySelector('#practice-solution').hidden,true);assert.equal(p.d.querySelectorAll('.practice-hint').length,0);event(p.w,p.w,'afterprint');
 await p.route('#foundations/missing-question');assert.match(p.d.querySelector('h1').textContent,/not found/);assert.match(p.d.title,/Practice question not found/);
 await p.route('#invalid-section');assert.equal(p.d.querySelectorAll('.practice-group').length,lectureIds.length);p.close();
 for(const bad of [null,[],42,'bad',{[e.id]:{work:[],hints:-5,compare:null}}]){p=await page('practice.html',hash,{[key]:bad});assert.ok(p.d.querySelector('textarea'));assert.equal(p.d.querySelectorAll('.practice-hint').length,0);p.close();}
 p=await page('lectures.html');for(const id of lectureIds){await p.route('#'+id);assert.ok(p.d.querySelector(`a.practice-entry[href="practice.html#${id}"]`),id+' reader practice entry');}p.close();
 console.log(`PASS: ${data.exercises.length} practice exercises, lecture mapping, source data tables, progressive hints, hidden solutions, comparison graphs, notes, reset, session restore, storage failure and keyboard-accessible routes.`);
})().catch(e=>{console.error(e);process.exit(1)});
