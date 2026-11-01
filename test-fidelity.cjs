/* Regressions for facts checked against visible lecture pages. */
const assert=require('node:assert/strict');
const lectures=require('./content/lectures.json');
const audit=require('./content/lecture-audit.json');
const topics=new Map(lectures.flatMap(l=>l.topics).map(t=>[t.id,t]));
const text=id=>{const t=topics.get(id);return [t.body,...(t.sections||[]).map(s=>s.body),t.warning||''].join('\n');};

// Chapter 1 p15 visibly has a plus. The PDF text layer is not the source of truth.
assert.ok(text('break-even').includes('TC=F+cv'));
assert.doesNotMatch(text('break-even'),/prints a minus|sign typo|minus sign/i);
// The obvious total typo is corrected in the teaching text; original evidence is in the audit.
assert.match(text('airline-demand'),/\(38,65\)/);
assert.doesNotMatch(text('airline-demand'),/\(38,60\)/);
assert.match(text('segmentation'),/57 business and 8 leisure/);
assert.equal(audit.editorialCorrections.fare38Total.corrected,65);
for(const t of topics.values())assert.equal(t.warning,undefined,'No source-warning fields in reader content');
// Chapter 2 p39 uses two labor hours per Willow bowl. Verify derived consequences.
assert.ok(text('new-product').includes('2y_1+3y_2\\le H'));
assert.ok(text('new-product').includes('480+16H'));
assert.doesNotMatch(text('new-product'),/1120.*32|4,640\/3|5,440\/3/);
// Blank Chapter 4 formulation pages must not be presented as completed slide models.
for(const t of lectures.find(l=>l.id==='modeling-examples').topics){
 assert.ok(t.sections.some(s=>/derived/i.test(s.title)),t.id+' labels calculated additions');
}
assert.doesNotMatch(text('advertising'),/formulation in the slides is continuous/);
assert.match(text('uncertain-returns'),/38\.33%/);
const reviewed=lectures.filter(l=>l.id!=='assignments').flatMap(l=>l.topics.map(t=>t.id)).sort();
assert.deepEqual([...audit.reviewedTopicIds].sort(),reviewed);
for(const finding of audit.findings)assert.ok(finding.source&&finding.resolution);
console.log('PASS: visible-source regressions, corrected Willow model, explicit derived-model labels and lecture audit coverage.');
// Teach the model directly; provenance belongs in the separate references/audit.
for(const topic of lectures.flatMap(l=>l.topics)){
 const prose=[topic.title,topic.body,topic.warning||'',...(topic.sections||[]).flatMap(s=>[s.title,s.body])].join('\n');
 assert.doesNotMatch(prose,/\b(?:slides?|lectures?)\b/i,topic.id+' uses direct teaching prose');
}
