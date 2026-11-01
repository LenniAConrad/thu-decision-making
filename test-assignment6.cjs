const assert=require('node:assert/strict');
const {page,event}=require('./test-reader.cjs');
(async()=>{
 for(const id of ['rhs-algebra','rhs-worked-examples']){
  const p=await page('lectures.html','#sensitivity/'+id);
  assert.ok(p.d.querySelectorAll('.katex').length>0,'Equations rendered');
  if(id==='rhs-worked-examples')assert.ok(p.d.querySelector('p .katex'),'Inline equations rendered');
  assert.equal(p.d.querySelectorAll('.katex-error,.math-fallback').length,0);
  for(const el of p.d.querySelectorAll('p'))assert.ok(!el.textContent.includes('\\('),'No raw delimiters');
  assert.equal(p.errors.length,0);p.close();
 }
 for(const id of ['a6-concrete','a6-agency']){
  const p=await page('lectures.html','#assignments/'+id);
  assert.equal(p.d.querySelectorAll('.native-drawing svg').length,2,'Feasible region and complete marginal graph');
  assert.equal(p.d.querySelectorAll('table').length,3,'Notation, official data and derived regimes');
  assert.match(p.d.querySelector('main').textContent,/Excel/);
  assert.equal(p.d.querySelectorAll('.katex-error,.math-fallback').length,0);
  assert.equal(p.errors.length,0);p.close();
 }
 const p=await page('materials.html');const input=p.d.querySelector('input');input.value='Homework 6';event(p.w,input);assert.equal(p.d.querySelectorAll('.material-card').length,1);assert.match(p.d.querySelector('.material-card').textContent,/algebraic/i);p.close();
 console.log('PASS: Assignment 6 deep links, inline math, both model diagrams/tables and material search.');
})().catch(e=>{console.error(e);process.exit(1)});
