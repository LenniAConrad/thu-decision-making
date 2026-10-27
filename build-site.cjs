const fs=require('node:fs'),path=require('node:path');
const files=['index.html','lectures.html','materials.html','materials.js','course-theme.css','course-shell.js','landing.js','decision-math.js','lecture-content.js','lecture-visuals.js','lesson-experiments.js','lectures.js','math-render.js','math.css','assets'];
const dest='.build/site';fs.rmSync(dest,{recursive:true,force:true});fs.mkdirSync(dest,{recursive:true});for(const name of files)fs.cpSync(name,path.join(dest,name),{recursive:true});fs.writeFileSync(path.join(dest,'.nojekyll'),'');console.log('Built static site in '+dest);
