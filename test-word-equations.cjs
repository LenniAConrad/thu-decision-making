const assert=require('node:assert/strict'),katex=require('./assets/katex/katex.min.js');
const {page}=require('./test-reader.cjs');
const lectures=require('./content/lectures.json'),practice=require('./content/practice.json');
function equations(o){
 if(typeof o==='string')return o.split('\n').filter(s=>s.startsWith('$$')).map(s=>s.slice(2,-2));
 if(Array.isArray(o))return o.flatMap(equations);
 if(o&&typeof o==='object')return Object.entries(o).filter(([k])=>!['code','sources','downloads','equationWords','notation'].includes(k)).flatMap(([,v])=>equations(v));
 return [];
}
(async()=>{
 let count=0;
 for(const item of [...lectures.flatMap(l=>l.topics),...practice.exercises])for(const tex of equations(item)){
  const words=item.equationWords?.[tex];assert.ok(words,item.id+' has a word version of every displayed formula');
  assert.ok(words.includes('\\text{'),'Variables replaced by descriptive names');
  assert.doesNotThrow(()=>katex.renderToString(words,{throwOnError:true,strict:'ignore'}));count++;
 }
 const p=await page('lectures.html','#foundations/break-even');
 const pairs=p.d.querySelectorAll('.equation-pair');assert.equal(pairs.length,2);
 for(const pair of pairs){
  assert.equal(pair.querySelector('.word-equation-label'),null,'No redundant word-formula heading');
  assert.equal(pair.children[0].className,'lecture-equation');
  assert.equal(pair.children[1].className,'word-equation','Word formula follows the symbolic formula in the same row');
  assert.equal(p.w.getComputedStyle(pair).display,'flex');
  assert.equal(p.w.getComputedStyle(pair).flexWrap,'nowrap','Keep both versions side by side');
  assert.equal(p.w.getComputedStyle(pair).overflowX,'auto','Long formulas remain accessible by scrolling');
  assert.equal(pair.tabIndex,0);
 }
 const last=pairs[1];assert.equal(last.querySelector('.word-equation-arrow').textContent,'⇔');
 const text=last.querySelector('.word-equation').textContent;
 for(const term of ['break-even units','fixed cost','selling price per unit','variable cost per unit'])assert.ok(text.includes(term));
 assert.ok(last.querySelector('.word-equation .katex-html .mfrac'),'The word version preserves the fraction structure');
 assert.equal(p.d.querySelectorAll('.katex-error').length,0);p.close();
 console.log('PASS: '+count+' displayed formulas have valid name-based equivalents; break-even fraction is paired with ⇔.');
})().catch(e=>{console.error(e);process.exit(1)});
