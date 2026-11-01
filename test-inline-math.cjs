const assert=require('node:assert/strict');
const {page}=require('./test-reader.cjs');
function check(root){
 assert.equal(root.querySelectorAll('.katex-error,.math-fallback').length,0);
 for(const el of root.querySelectorAll('p,td,th,li,button,label'))assert.ok(!/\\[()]/.test(el.textContent),'No visible raw math delimiters: '+el.textContent.slice(0,100));
}
(async()=>{
 let p=await page('lectures.html','#foundations/break-even');
 const paragraph=[...p.d.querySelectorAll('.lecture-topic>p')].find(el=>el.textContent.includes('Writing'));
 assert.ok(paragraph.querySelectorAll('.katex').length>=6,'Definitions and aliases are typeset inline');
 const tex=[...paragraph.querySelectorAll('annotation')].map(el=>el.textContent);
 assert.ok(tex.includes('c_f'));assert.ok(tex.includes('c_v'));assert.ok(tex.includes('F = c_f'));assert.ok(tex.includes('c = c_v'));
 const inline=p.w.eval('MathView.inline');
 const scratch=p.d.createElement('div');scratch.innerHTML=inline('Fixed cost $10,000 and price $23; \\(x_1^2\\) <script>alert(1)</script>');
 assert.match(scratch.textContent,/Fixed cost \$10,000 and price \$23/);
 assert.equal(scratch.querySelectorAll('script').length,0);assert.equal(scratch.querySelectorAll('.katex').length,1);
 p.close();
 p=await page('lectures.html','#all');check(p.d);p.close();
 const data=require('./content/practice.json');p=await page('practice.html');
 for(const e of data.exercises){
  await p.route('#'+e.lectureIds[0]+'/'+e.id);
  for(let i=0;i<e.hints.length;i++)p.d.querySelector('[data-next-hint]').click();
  p.d.querySelector('[data-compare]').click();check(p.d);
 }
 p.close();console.log('PASS: cost subscripts/aliases, safe inline rendering, literal prices and no raw math markup across all lectures/practice.');
})().catch(e=>{console.error(e);process.exit(1)});
