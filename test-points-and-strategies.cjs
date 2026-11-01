const assert=require('node:assert/strict'),fs=require('node:fs');
const {page}=require('./test-reader.cjs');
(async()=>{
 let p=await page('lectures.html','#foundations/airline-demand');
 const readings=p.d.querySelector('.point-readings');assert.ok(readings);assert.equal(readings.querySelectorAll('li').length,4);
 assert.match(readings.textContent,/At a fare of \$40 per ticket, 55 tickets are sold per departure/);
 assert.match(p.d.querySelector('.lecture-topic').textContent,/At a fare of \$40 per ticket, 55 tickets are sold/);p.close();
 p=await page('lectures.html','#foundations/pricing-strategies');
 assert.equal(p.d.querySelectorAll('.pricing-comparison tbody tr').length,6);
 const strategies=p.w.eval('LectureVisuals.pricingStrategies');
 for(const s of strategies){assert.equal(s.counts.reduce((n,c,i)=>n+c*s.fares[i],0),s.revenue);assert.ok(s.counts.reduce((a,b)=>a+b,0)<=130);}
 assert.deepEqual(Array.from(strategies,s=>s.revenue),[1800,3120,3125,3625,4200,4280]);
 assert.equal(p.d.querySelectorAll('.pricing-comparison svg rect').length,6);
 assert.match(p.d.querySelector('.pricing-comparison svg').getAttribute('aria-label'),/Bars start at zero/);
 assert.doesNotMatch(p.d.querySelector('.lecture-topic').textContent,/the lecture|the slide/i);
 fs.mkdirSync('.build/review',{recursive:true});fs.writeFileSync('.build/review/six-pricing-strategies.svg',p.d.querySelector('.pricing-comparison svg').outerHTML);p.close();
 console.log('PASS: all observed fare/count points have named meanings; six strategies, capacities, revenue arithmetic and chart are consistent.');
})().catch(e=>{console.error(e);process.exit(1)});
