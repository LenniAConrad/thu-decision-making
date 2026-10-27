const assert=require('node:assert/strict'),fs=require('node:fs');
const {page,event}=require('./test-reader.cjs');
const lectures=require('./content/lectures.json');
const materials=require('./content/materials.json');
const topics=new Set(lectures.flatMap(l=>l.topics.map(t=>`${l.id}/${t.id}`)));

(async()=>{
 assert.equal(new Set(materials.items.map(m=>m.id)).size,materials.items.length);
 assert.doesNotMatch(JSON.stringify(lectures)+JSON.stringify(materials),/Lennart Conrad|2025080264|2024280169|Liebehenschel/i);
 for(const material of materials.items){
  assert.ok(material.files.length&&material.links.length,material.id+' has sources and reading routes');
  for(const link of material.links){
   const [file,hash]=link.href.split('#');
   assert.ok(fs.existsSync(file),link.href+' exists');
   if(hash){const [section,topic]=hash.split('/');assert.ok(lectures.some(l=>l.id===section),link.href);if(topic)assert.ok(topics.has(hash),link.href);}
  }
 }
 let p=await page('materials.html');
 assert.equal(p.d.querySelectorAll('.material-card').length,materials.items.length);
 assert.equal(p.d.querySelector('nav a[aria-current="page"]').textContent,'Materials');
 const input=p.d.querySelector('input');
 for(const query of ['Chapter 3','COPT','Homework 5','Assignment 5','HW5','Homework5','answer']){
  input.value=query;event(p.w,input);
  assert.ok(p.d.querySelector('.material-card'),query+' finds material');
 }
 input.value='missing-material-xyz';event(p.w,input);
 assert.match(p.d.querySelector('[data-material-count]').textContent,/0 matching/);
 assert.equal(p.errors.length,0);p.close();
 p=await page('lectures.html','#assignments/all');
 const assignment=lectures.find(l=>l.id==='assignments');
 assert.equal(p.d.querySelectorAll('.lecture-topic').length,assignment.topics.length);
 assert.equal(p.d.querySelectorAll('.katex-error,.math-fallback').length,0);
 for(const a of p.d.querySelectorAll('a[download]')){
  const file=a.getAttribute('href');assert.ok(fs.existsSync(file),file);
  const code=fs.readFileSync(file,'utf8');assert.doesNotMatch(code,/Lennart Conrad|2025080264|\/home\/lennart/);
 }
 p.close();
 const coverage=require('./content/source-coverage.json');
 for(const source of coverage.sources){
  assert.match(source.sha256,/^[a-f0-9]{64}$/);
  assert.equal(new Set(source.pages.map(p=>p.page)).size,source.pageCount);
  for(let n=1;n<=source.pageCount;n++)assert.ok(source.pages.some(p=>p.page===n),source.file+' page '+n);
 }
 console.log('PASS: course material inventory, source routes, filtering, assignment reading, attachment privacy and complete source-page mappings.');
})().catch(e=>{console.error(e);process.exit(1)});
