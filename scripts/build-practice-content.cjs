const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,'content',name),'utf8'));
const practice=read('practice.json'),lectures=read('lectures.json');
const labels={'foundations':'Foundations','linear-programming':'Linear programming','sensitivity':'Sensitivity','computer-solution':'Solvers and COPT','modeling-examples':'Modeling patterns'};
const groups=lectures.filter(l=>l.id!=='assignments').map(l=>({id:l.id,title:l.title,subtitle:l.subtitle,label:labels[l.id],topics:l.topics.map(t=>({id:t.id,title:t.title})),exercises:practice.exercises.filter(e=>e.lectureIds.includes(l.id)).map(e=>({id:e.id,title:e.title,assignment:e.assignment,kind:e.kind,topicIds:e.topicIds}))}));
const index={updated:practice.updated,totalCount:practice.exercises.length,groups};
const outputs={
 'practice-content.js':'/* Generated from content/practice.json. */\nconst CoursePractice='+JSON.stringify(practice)+';\n',
 'practice-index.js':'/* Generated practice links; full questions load only on the practice page. */\nconst CoursePracticeIndex='+JSON.stringify(index)+';\n'
};
for(const [file,bundle] of Object.entries(outputs)){
 const target=path.join(root,file);
 if(process.argv.includes('--check')){if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==bundle)throw Error('Run node scripts/build-practice-content.cjs after editing practice content.');}
 else fs.writeFileSync(target,bundle);
}
console.log(`Built practice for ${groups.length} lecture sections, ${practice.exercises.length} exercises.`);
