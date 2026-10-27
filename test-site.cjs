const assert=require('node:assert/strict'),fs=require('node:fs');
const {page,event}=require('./test-reader.cjs');
const lectures=require('./content/lectures.json');
(async()=>{
 let p=await page('index.html');assert.match(p.d.querySelector('h1').textContent,/Build the model/);assert.equal(p.d.querySelectorAll('.course-path li').length,lectures.length);assert.ok(p.d.querySelector('.landing-professor img').src.endsWith('/hai-jiang.jpg'));
 const price=p.d.querySelector('[data-price]');price.value=25;event(p.w,price);assert.match(p.d.querySelector('[data-price-result]').textContent,/125 tickets sold · \$3,125/);p.d.querySelector('.course-menu').click();assert.equal(p.d.querySelector('.course-menu').getAttribute('aria-expanded'),'true');p.close();
 p=await page('lectures.html');assert.equal(p.d.querySelectorAll('.lecture-catalog-entry').length,lectures.length);const search=p.d.querySelector('input');search.value='shadow price';event(p.w,search);assert.ok(p.d.querySelector('#search-count').textContent.match(/[1-9]/));for(const query of ['oatmeal','beeks','x₁','x_1','Homework 5','Biofuel','Transshipment','COPT']){search.value=query;event(p.w,search);assert.ok(p.d.querySelector('#lecture-catalog a'),query+' searches table/math text');}search.value='nonexistent-abc123';event(p.w,search);assert.match(p.d.querySelector('#search-count').textContent,/0 matching/);
 for(const chapter of lectures){await p.route('#'+chapter.id);assert.equal(p.d.querySelectorAll('.lecture-outline a').length,chapter.topics.length);for(const t of chapter.topics){await p.route('#'+chapter.id+'/'+t.id);assert.equal(p.d.querySelector('.lecture-topic h2').textContent,t.title);assert.equal(p.d.querySelectorAll('.katex-error').length,0,t.id+' valid math');assert.equal(p.d.querySelectorAll('.lecture-topic img,.lecture-topic iframe,.lecture-topic embed').length,0);if(t.tables){assert.equal(p.d.querySelectorAll('.lecture-topic table').length,t.tables.length);for(const table of t.tables)assert.ok([...p.d.querySelectorAll('caption')].some(c=>c.textContent===table.caption));}if(t.code){for(const code of t.code)assert.ok([...p.d.querySelectorAll('pre code')].some(c=>c.textContent===code.body));}if(t.downloads)assert.equal(p.d.querySelectorAll('a[download]').length,t.downloads.length);if(t.experiment)assert.ok(p.d.querySelector('.experiment-plot svg'));if(t.check){p.d.querySelectorAll('[data-choice]')[t.check.answer].click();assert.match(p.d.querySelector('.feedback').textContent,/Correct/);}}}
 await p.route('#linear-programming/graphical');let control=p.d.querySelector('[data-control=bowls]');control.value=25;event(p.w,control);assert.match(p.d.querySelector('.experiment-result').textContent,/Infeasible/);const savedNode=p.d.querySelector('.lecture-topic');await p.route('#foundations/modeling');await p.route('#linear-programming/graphical');assert.equal(p.d.querySelector('.lecture-topic'),savedNode);assert.equal(p.d.querySelector('[data-control=bowls]').value,'25');
 const before=p.w.sessionStorage.getItem('dm-lecture-session');p.w.dispatchEvent(new p.w.Event('beforeprint'));assert.equal(p.d.querySelectorAll('.lecture-topic').length,lectures[1].topics.length,'Print entire current lecture');assert.ok(p.d.querySelector('.native-drawing svg'));p.w.dispatchEvent(new p.w.Event('afterprint'));assert.equal(p.d.querySelector('.lecture-topic'),savedNode);assert.equal(p.w.sessionStorage.getItem('dm-lecture-session'),before,'Print does not change saved controls');
 // A nonblocking print call must retain the full lecture until afterprint.
 p.w.print=()=>{};p.d.querySelector('[data-print]').click();
 assert.equal(p.d.querySelectorAll('.lecture-topic').length,lectures[1].topics.length);
 assert.ok(p.d.querySelectorAll('.lecture-choices button').length>0,'Full printed checks retain their options');
 p.w.dispatchEvent(new p.w.Event('afterprint'));assert.equal(p.d.querySelector('.lecture-topic'),savedNode);
 p.w.print=()=>{throw Error('print unavailable');};p.d.querySelector('[data-print]').click();
 assert.equal(p.d.querySelector('.lecture-topic'),savedNode);assert.match(p.d.querySelector('[data-print-status]').textContent,/Printing could not open/);
 p.d.querySelector('[data-reset]').click();assert.equal(p.d.querySelector('[data-control=bowls]').value,'24');assert.equal(p.w.localStorage.length,0);const state=JSON.parse(before);p.close();
 p=await page('lectures.html','#linear-programming/graphical',{'dm-lecture-session':state});assert.equal(p.d.querySelector('[data-control=bowls]').value,'25');await p.route('#all');assert.equal(p.d.querySelectorAll('.lecture-topic').length,lectures.flatMap(l=>l.topics).length);assert.equal(p.d.querySelectorAll('.katex-error').length,0);assert.equal(p.d.querySelectorAll('.math-fallback').length,0);const ids=[...p.d.querySelectorAll('[id]')].map(e=>e.id);assert.equal(new Set(ids).size,ids.length);
 for(const el of p.d.querySelectorAll('a[href]')){const href=el.getAttribute('href');if(!href.startsWith('#')&&!/^https?:/.test(href))assert.ok(fs.existsSync(href.split('#')[0]),'Local link '+href);}
 fs.mkdirSync('.build/review',{recursive:true});let n=0;for(const svg of p.d.querySelectorAll('.native-drawing svg')){fs.writeFileSync(`.build/review/diagram-${String(++n).padStart(2,'0')}.svg`,svg.outerHTML);}
 assert.equal(p.errors.length,0);p.close();
 for(const bad of [[],null,'bad',{'graphical':[]}]){p=await page('lectures.html','#linear-programming/graphical',{'dm-lecture-session':bad});assert.ok(p.d.querySelector('.lecture-topic'));p.close();}
 p=await page('lectures.html','#foundations/break-even');
 const set=(key,value)=>{const el=p.d.querySelector(`[data-control="${key}"]`);el.value=value;event(p.w,el);};
 set('price',21);set('cost',20);set('fixed',20000);
 assert.match(p.d.querySelector('.experiment-result').textContent,/20,000/);
 const point=p.d.querySelector('.experiment-plot circle');assert.ok(point,'Break-even crossing is marked');
 assert.ok(Number(point.getAttribute('cx'))<600&&Number(point.getAttribute('cy'))>55,'Extreme crossing stays inside the axes');
 set('price',20);assert.equal(p.d.querySelector('.experiment-plot circle'),null);assert.match(p.d.querySelector('.experiment-result').textContent,/cannot cover/);
 set('fixed',0);assert.match(p.d.querySelector('.experiment-result').textContent,/every volume/);
 set('price',10);assert.match(p.d.querySelector('.experiment-result').textContent,/Only zero/);
 p.close();
 p=await page('lectures.html','#assignments/a5-dea');assert.equal(p.d.querySelector('nav a[aria-current="page"]').textContent,'Assignments');
 await p.route('#foundations/missing-topic');assert.match(p.d.querySelector('.missing-topic').textContent,/Topic not found/);assert.ok(p.d.querySelector('.missing-topic a[href="#foundations"]'));p.close();
 const checked=lectures.flatMap(l=>l.topics.map(t=>({l,t}))).find(x=>x.t.check);
 p=await page('lectures.html','#'+checked.l.id+'/'+checked.t.id,{'dm-lecture-session':{[checked.t.id]:{answer:checked.t.check.answer,feedback:'Obsolete explanation from an earlier content version'}}});
 assert.match(p.d.querySelector('.feedback').textContent,/Correct/);assert.ok(p.d.querySelector('.feedback').textContent.includes(checked.t.check.explanation));assert.doesNotMatch(p.d.querySelector('.feedback').textContent,/Obsolete/);p.close();
 const coverage=require('./content/source-coverage.json');for(const source of coverage.sources){assert.equal(source.pages.length,source.pageCount);for(const entry of source.pages){assert.ok(entry.topicIds.length||entry.context);for(const id of entry.topicIds)assert.ok(lectures.some(c=>c.topics.some(t=>t.id===id)),id);}}
 console.log('PASS: home experiment, all '+lectures.flatMap(l=>l.topics).length+' topics, math rendering, navigation, search, controls, session restore, async/error print lifecycle, extreme break-even settings, table/math search, asset links and source inventory.');
})().catch(e=>{console.error(e);process.exit(1)});
